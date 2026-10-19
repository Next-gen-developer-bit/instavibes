import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCreemConfig } from '@/lib/creem/config'

export const dynamic = 'force-dynamic'

/**
 * Inbound webhook handler for Creem payments & subscriptions.
 * https://docs.creem.io/webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-creem-signature') || request.headers.get('creem-signature')
    const config = getCreemConfig()

    // 1. Signature validation (if webhook secret configured)
    if (config.webhookSecret && signature) {
      // If signature is provided, verify against webhook secret
      // Note: Creem uses HMAC-SHA256 signature
      try {
        const crypto = await import('crypto')
        const expected = crypto
          .createHmac('sha256', config.webhookSecret)
          .update(rawBody)
          .digest('hex')

        if (signature !== expected && !signature.includes(expected)) {
          console.warn('Creem webhook signature mismatch')
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }
      } catch (sigErr) {
        console.error('Signature verification error:', sigErr)
      }
    }

    let payload: any
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    const event = payload.event || payload.type || 'checkout.completed'
    const data = payload.data || payload

    // Resolve user ID from client_reference_id or metadata
    const userId =
      data.client_reference_id ||
      data.metadata?.user_id ||
      data.metadata?.userId ||
      data.customer?.metadata?.user_id

    const customerEmail =
      data.customer_email ||
      data.customer?.email ||
      data.email

    const supabase = createAdminClient()

    // If userId not directly passed, lookup profile by email
    let resolvedUserId = userId
    if (!resolvedUserId && customerEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail.toLowerCase().trim())
        .maybeSingle()

      if (profile?.id) {
        resolvedUserId = profile.id
      }
    }

    if (!resolvedUserId) {
      console.warn('Creem webhook: could not identify user from payload', { event, customerEmail })
      // Acknowledge receipt to avoid webhook retry storm
      return NextResponse.json({ received: true, note: 'User unmapped' })
    }

    const subscriptionId = data.subscription_id || data.id || `creem_sub_${Date.now()}`
    const customerId = data.customer_id || data.customer?.id || `creem_cust_${Date.now()}`
    const interval = data.billing_interval || data.interval || 'month'

    // Handle different event types
    if (
      event.includes('checkout.completed') ||
      event.includes('order.completed') ||
      event.includes('subscription.created') ||
      event.includes('subscription.active')
    ) {
      // Set status to active or trialing
      const isTrial = Boolean(data.trial_end || data.is_trial)
      const trialEnd = data.trial_end
        ? new Date(data.trial_end).toISOString()
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days default

      const periodEnd = data.current_period_end
        ? new Date(data.current_period_end).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      await supabase
        .from('subscriptions')
        .upsert(
          {
            user_id: resolvedUserId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            status: isTrial ? 'trialing' : 'active',
            billing_interval: interval === 'year' ? 'year' : 'month',
            trial_end: isTrial ? trialEnd : null,
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd,
          },
          { onConflict: 'user_id' }
        )
    } else if (
      event.includes('subscription.canceled') ||
      event.includes('subscription.deleted') ||
      event.includes('subscription.expired')
    ) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at: new Date().toISOString(),
        })
        .eq('user_id', resolvedUserId)
    }

    return NextResponse.json({ received: true, event, userId: resolvedUserId })
  } catch (err: any) {
    console.error('Creem webhook handler error:', err)
    return NextResponse.json(
      { error: err.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
