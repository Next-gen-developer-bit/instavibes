/**
 * Creem Merchant of Record & Payment Gateway Configuration
 * https://creem.io
 *
 * Configurable via environment variables:
 * - NEXT_PUBLIC_CREEM_CHECKOUT_URL: Direct Creem checkout link (fallback or primary)
 * - NEXT_PUBLIC_CREEM_CHECKOUT_URL_MONTHLY: Specific monthly checkout link
 * - NEXT_PUBLIC_CREEM_CHECKOUT_URL_ANNUAL: Specific annual checkout link
 * - CREEM_API_KEY: Secret API key for server-side Creem API session generation
 * - CREEM_PRODUCT_ID_MONTHLY: Creem Product ID for Monthly subscription ($10/mo)
 * - CREEM_PRODUCT_ID_ANNUAL: Creem Product ID for Annual subscription ($100/yr)
 * - CREEM_WEBHOOK_SECRET: Secret key to verify inbound Creem webhooks
 */

export interface CreemCheckoutOptions {
  billingInterval?: 'month' | 'year'
  userEmail?: string
  userId?: string
  successUrl?: string
  cancelUrl?: string
}

export function getCreemConfig() {
  const defaultCheckout =
    process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL ||
    process.env.CREEM_CHECKOUT_URL ||
    ''

  const monthlyCheckout =
    process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL_MONTHLY ||
    defaultCheckout

  const annualCheckout =
    process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL_ANNUAL ||
    defaultCheckout

  return {
    apiKey: process.env.CREEM_API_KEY,
    webhookSecret: process.env.CREEM_WEBHOOK_SECRET,
    monthlyProductId: process.env.CREEM_PRODUCT_ID_MONTHLY || 'prod_monthly_instavibes',
    annualProductId: process.env.CREEM_PRODUCT_ID_ANNUAL || 'prod_annual_instavibes',
    monthlyCheckoutUrl: monthlyCheckout,
    annualCheckoutUrl: annualCheckout,
    defaultCheckoutUrl: defaultCheckout,
  }
}

/**
 * Builds a ready-to-redirect Creem checkout URL with customer metadata prefilled.
 */
export function buildCreemCheckoutUrl(options: CreemCheckoutOptions = {}): string | null {
  const config = getCreemConfig()
  const baseUrl = options.billingInterval === 'year'
    ? config.annualCheckoutUrl
    : config.monthlyCheckoutUrl

  if (
    !baseUrl ||
    baseUrl.trim() === '' ||
    baseUrl === 'https://checkout.creem.io' ||
    baseUrl.includes('placeholder')
  ) {
    return null
  }

  try {
    const url = new URL(baseUrl)
    if (options.userEmail) {
      url.searchParams.set('email', options.userEmail)
      url.searchParams.set('customer_email', options.userEmail)
    }
    if (options.userId) {
      url.searchParams.set('client_reference_id', options.userId)
      url.searchParams.set('user_id', options.userId)
      url.searchParams.set('metadata[user_id]', options.userId)
    }
    if (options.billingInterval) {
      url.searchParams.set('interval', options.billingInterval)
    }
    if (options.successUrl) {
      url.searchParams.set('success_url', options.successUrl)
    }
    if (options.cancelUrl) {
      url.searchParams.set('cancel_url', options.cancelUrl)
    }
    return url.toString()
  } catch {
    // If baseUrl is a relative path or raw placeholder
    const separator = baseUrl.includes('?') ? '&' : '?'
    const params = new URLSearchParams()
    if (options.userEmail) params.set('email', options.userEmail)
    if (options.userId) params.set('userId', options.userId)
    return `${baseUrl}${separator}${params.toString()}`
  }
}
