'use server'

import { createClient } from '@/lib/supabase/server'
import { buildCreemCheckoutUrl, getCreemConfig } from '@/lib/creem/config'

function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (url) return url.replace(/\/$/, '')
  return 'http://localhost:3000'
}

export interface CheckoutResult {
  checkoutUrl?: string
  error?: string
  isDirectLink?: boolean
}

/**
 * Initiates Creem checkout for the authenticated user.
 * Supports both direct Creem hosted checkout links and API session generation.
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

    const appUrl = getAppUrl()
    const successUrl = `${appUrl}/checkout/success`
    const cancelUrl = `${appUrl}/checkout`
    const config = getCreemConfig()

    // 1. If Creem API key is provided, attempt programmatic session creation
    if (config.apiKey) {
      try {
        const productId =
          billingInterval === 'year'
            ? config.annualProductId
            : config.monthlyProductId

        const response = await fetch('https://api.creem.io/v1/checkouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': config.apiKey,
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            product_id: productId,
            customer_email: user.email,
            client_reference_id: user.id,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
              user_id: user.id,
              billing_interval: billingInterval,
            },
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const checkoutUrl = data.checkout_url || data.url
          if (checkoutUrl) {
            return { checkoutUrl, isDirectLink: false }
          }
        }
      } catch (apiErr) {
        console.warn('Creem API session creation fallback to hosted link:', apiErr)
      }
    }

    // 2. Build pre-populated Creem hosted checkout link
    const checkoutUrl = buildCreemCheckoutUrl({
      billingInterval,
      userEmail: user.email,
      userId: user.id,
      successUrl,
      cancelUrl,
    })

    if (!checkoutUrl) {
      return {
        error:
          'Creem payment link is currently being configured or is under review in Creem. Once ready, add your Creem checkout link to NEXT_PUBLIC_CREEM_CHECKOUT_URL in Vercel.',
      }
    }

    return { checkoutUrl, isDirectLink: true }
  } catch (err: any) {
    console.error('createCreemCheckoutSession error:', err)
    return { error: err.message || 'Failed to start checkout.' }
  }
}
