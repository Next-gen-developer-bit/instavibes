'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCreemConfig } from '@/lib/creem/config'

export interface CancelSubscriptionResult {
  success?: boolean
  endedAccess?: boolean
  error?: string
  message?: string
}

async function creemRequest(path: string, init?: RequestInit) {
  const config = getCreemConfig()
  if (!config.apiKey) {
    throw new Error('CREEM_API_KEY is not configured')
  }

  const response = await fetch(`${config.apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      ...(init?.headers || {}),
    },
  })
  const body = await response.text()
  return { response, body }
}

function parseJson(body: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(body) as unknown
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}

/**
 * Find the Creem subscription id. Checkout success sometimes stores a checkout id.
 */
async function resolveCreemSubscriptionId(
  storedId: string | null,
  customerId: string | null
): Promise<string | null> {
  if (storedId?.startsWith('sub_')) return storedId
  if (!customerId) return storedId

  const { response, body } = await creemRequest(
    `/v1/subscriptions?customer_id=${encodeURIComponent(customerId)}`
  )
  if (!response.ok) return storedId

  const parsed = parseJson(body)
  const items = Array.isArray(parsed?.items)
    ? parsed.items
    : Array.isArray(parsed?.data)
      ? parsed.data
      : []

  const subscriptions = items.filter(
    (item): item is { id?: string; status?: string } =>
      Boolean(item) && typeof item === 'object'
  )
  const current = subscriptions.find(
    (item) => item.status === 'trialing' || item.status === 'active'
  )
  return current?.id || subscriptions[0]?.id || storedId
}

/**
 * Cancel the signed-in user's Creem trial or subscription.
 * A trial is canceled immediately so the card is not charged.
 * A paid plan is canceled at the end of the current period.
 */
export async function cancelSubscription(): Promise<CancelSubscriptionResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: 'Please sign in to cancel your trial.' }

    const admin = createAdminClient()
    const { data: subscription, error: lookupError } = await admin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (lookupError) return { error: 'Could not load your subscription.' }
    if (!subscription) return { error: 'No trial or subscription was found for this account.' }

    if (subscription.status === 'canceled' || subscription.cancel_at) {
      return {
        success: true,
        endedAccess: subscription.status === 'canceled',
        message: 'This trial is already canceled. You will not be charged.',
      }
    }

    const isTrial = subscription.status === 'trialing'
    if (!isTrial && subscription.status !== 'active') {
      return { error: 'This account does not have a trial that can be canceled.' }
    }

    const creemSubscriptionId = await resolveCreemSubscriptionId(
      subscription.stripe_subscription_id,
      subscription.stripe_customer_id
    )

    if (!creemSubscriptionId || !creemSubscriptionId.startsWith('sub_')) {
      return {
        error:
          'This trial is not linked to a Creem subscription yet, so it cannot be canceled from here. Email support and we will cancel it.',
      }
    }

    const { response, body } = await creemRequest(
      `/v1/subscriptions/${encodeURIComponent(creemSubscriptionId)}/cancel`,
      {
        method: 'POST',
        body: JSON.stringify(
          isTrial
            ? { mode: 'immediate' }
            : { mode: 'scheduled', onExecute: 'cancel' }
        ),
      }
    )

    if (!response.ok && response.status !== 409) {
      console.error('Creem cancel failed', response.status, body.slice(0, 400))
      const parsed = parseJson(body)
      const detail =
        parsed && typeof parsed.message === 'string'
          ? parsed.message
          : parsed && typeof parsed.error === 'string'
            ? parsed.error
            : ''
      if (response.status === 404) {
        return { error: 'Creem could not find this subscription. It may already be canceled.' }
      }
      return {
        error: detail
          ? `Creem could not cancel the trial (${response.status}): ${detail}`
          : 'Creem could not cancel the trial. Please try again.',
      }
    }

    const remote = parseJson(body)
    const remoteStatus = typeof remote?.status === 'string' ? remote.status : ''
    const endedNow =
      isTrial || remoteStatus === 'canceled' || remoteStatus === 'cancelled'
    const now = new Date().toISOString()
    const { error: updateError } = await admin
      .from('subscriptions')
      .update(
        endedNow
          ? {
              status: 'canceled',
              cancel_at: now,
              stripe_subscription_id: creemSubscriptionId,
            }
          : {
              cancel_at: subscription.current_period_end || now,
              stripe_subscription_id: creemSubscriptionId,
            }
      )
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Subscription cancel save error:', updateError)
      return {
        error:
          'Creem canceled the billing, but the account status did not save. Refresh and check Settings.',
      }
    }

    return {
      success: true,
      endedAccess: endedNow,
      message: endedNow
        ? isTrial
          ? 'Your 3-day trial is canceled. You will not be charged.'
          : 'Your subscription is canceled. You will not be charged again.'
        : 'Your subscription will end at the close of this billing period. You will not be charged again.',
    }
  } catch (err) {
    console.error('cancelSubscription error:', err)
    const message = err instanceof Error ? err.message : ''
    if (message.includes('CREEM_API_KEY')) {
      return { error: 'Billing is not configured, so the trial cannot be canceled yet.' }
    }
    return { error: 'Could not cancel the trial. Please try again.' }
  }
}
