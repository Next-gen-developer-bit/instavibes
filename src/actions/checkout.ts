'use server'

import { createClient } from '@/lib/supabase/server'
import { getAppUrl } from '@/lib/app-url'
import { buildCreemCheckoutUrl, getCreemConfig } from '@/lib/creem/config'

export interface CheckoutResult {
  checkoutUrl?: string
  error?: string
  isDirectLink?: boolean
}

function creemErrorMessage(status: number, body: string) {
  let parsed: { message?: string; error?: string } | null = null
  try {
    parsed = JSON.parse(body)
  } catch {
    parsed = null
  }
  const detail = parsed?.message || parsed?.error || body.slice(0, 280)

  if (status === 401) {
    return 'Creem API key was rejected. Confirm CREEM_API_KEY matches the approved live key in the Creem dashboard.'
  }
  if (status === 404) {
    return 'Creem product was not found. Confirm CREEM_PRODUCT_ID is the approved product ID from the Creem dashboard.'
  }
  if (detail) {
    return `Creem checkout failed (${status}): ${detail}`
  }
  return `Creem checkout failed (${status}). Check the API key and product ID in environment variables.`
}

/**
 * Initiates Creem checkout for the authenticated user.
 * Prefers the Checkout Session API, then falls back to the hosted payment link.
 * https://docs.creem.io/api-reference/endpoint/create-checkout
 */
export async function createCreemCheckoutSession(
  billingInterval: 'month' | 'year' = 'month'
): Promise<CheckoutResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please sign in to proceed to checkout.' }
    }

    const appUrl = await getAppUrl()
    const successUrl = `${appUrl}/checkout/success`
    const config = getCreemConfig()
    const productId =
      billingInterval === 'year' ? config.annualProductId : config.monthlyProductId

    if (config.apiKey) {
      if (!productId) {
        return {
          error:
            'Creem product ID is missing. Set CREEM_PRODUCT_ID (or CREEM_PRODUCT_ID_MONTHLY / CREEM_PRODUCT_ID_ANNUAL) to the approved product.',
        }
      }

      const response = await fetch(`${config.apiBase}/v1/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
        },
        body: JSON.stringify({
          product_id: productId,
          request_id: user.id,
          success_url: successUrl,
          customer: user.email ? { email: user.email } : undefined,
          metadata: {
            user_id: user.id,
            billing_interval: billingInterval,
          },
        }),
      })

      const raw = await response.text()
      let data: { checkout_url?: string; url?: string } = {}
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        data = {}
      }

      if (response.ok) {
        const checkoutUrl = data.checkout_url || data.url
        if (checkoutUrl) {
          return { checkoutUrl, isDirectLink: false }
        }
      }

      console.error('Creem API checkout failed', {
        status: response.status,
        body: raw.slice(0, 500),
        productId,
        apiBase: config.apiBase,
      })
      return { error: creemErrorMessage(response.status, raw) }
    }

    const checkoutUrl = buildCreemCheckoutUrl({
      billingInterval,
      userEmail: user.email,
      userId: user.id,
      successUrl,
    })

    if (!checkoutUrl) {
      return {
        error:
          'Payment is not configured. Set CREEM_API_KEY and CREEM_PRODUCT_ID (the approved Creem product) on Vercel, then redeploy.',
      }
    }

    return { checkoutUrl, isDirectLink: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to start checkout.'
    console.error('createCreemCheckoutSession error:', err)
    return { error: message }
  }
}
