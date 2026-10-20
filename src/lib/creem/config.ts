/**
 * Creem Merchant of Record & Payment Gateway Configuration
 * https://docs.creem.io/api-reference/endpoint/create-checkout
 *
 * Env vars (any of these work):
 * - CREEM_API_KEY
 * - CREEM_PRODUCT_ID  (single approved product — used for both intervals if specific ones are unset)
 * - CREEM_PRODUCT_ID_MONTHLY / CREEM_PRODUCT_ID_ANNUAL
 * - NEXT_PUBLIC_CREEM_CHECKOUT_URL  (full hosted URL, or a raw prod_xxx id)
 * - CREEM_API_URL  (optional; otherwise inferred from the API key)
 * - CREEM_WEBHOOK_SECRET
 */

export interface CreemCheckoutOptions {
  billingInterval?: 'month' | 'year'
  userEmail?: string
  userId?: string
  successUrl?: string
  cancelUrl?: string
}

function env(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key]?.trim()
    if (value) return value
  }
  return ''
}

function isPlaceholder(value: string) {
  const v = value.trim().toLowerCase()
  return (
    !v ||
    v.includes('placeholder') ||
    v.includes('your-product') ||
    v.includes('prod_monthly_instavibes') ||
    v.includes('prod_annual_instavibes') ||
    v === 'https://checkout.creem.io'
  )
}

function extractProductId(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || isPlaceholder(trimmed)) return ''

  if (/^prod_[A-Za-z0-9]+$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const parts = url.pathname.split('/').filter(Boolean)
    const fromPath = parts.find((p) => p.startsWith('prod_'))
    if (fromPath) return fromPath
  } catch {
    // not a URL
  }

  return trimmed.startsWith('prod_') ? trimmed : ''
}

function hostedPaymentUrl(productId: string, testMode: boolean) {
  if (!productId) return ''
  const host = testMode ? 'https://www.creem.io/test/payment' : 'https://www.creem.io/payment'
  return `${host}/${productId}`
}

export function getCreemConfig() {
  const apiKey = env('CREEM_API_KEY')
  const testMode =
    apiKey.toLowerCase().includes('test') ||
    env('CREEM_API_URL').includes('test-api.creem.io')

  const apiBase =
    env('CREEM_API_URL') ||
    (testMode ? 'https://test-api.creem.io' : 'https://api.creem.io')

  const singleProductId = extractProductId(
    env('CREEM_PRODUCT_ID', 'NEXT_PUBLIC_CREEM_PRODUCT_ID', 'NEXT_PUBLIC_CREEM_CHECKOUT_URL')
  )
  const monthlyProductId =
    extractProductId(env('CREEM_PRODUCT_ID_MONTHLY', 'NEXT_PUBLIC_CREEM_PRODUCT_ID_MONTHLY')) ||
    singleProductId
  const annualProductId =
    extractProductId(env('CREEM_PRODUCT_ID_ANNUAL', 'NEXT_PUBLIC_CREEM_PRODUCT_ID_ANNUAL')) ||
    singleProductId

  const defaultCheckoutRaw = env(
    'NEXT_PUBLIC_CREEM_CHECKOUT_URL',
    'CREEM_CHECKOUT_URL'
  )
  const monthlyCheckoutRaw = env('NEXT_PUBLIC_CREEM_CHECKOUT_URL_MONTHLY') || defaultCheckoutRaw
  const annualCheckoutRaw = env('NEXT_PUBLIC_CREEM_CHECKOUT_URL_ANNUAL') || defaultCheckoutRaw

  const resolveCheckoutUrl = (raw: string, productId: string) => {
    if (raw && !isPlaceholder(raw) && raw.startsWith('http')) return raw
    const idFromRaw = extractProductId(raw)
    return hostedPaymentUrl(idFromRaw || productId, testMode)
  }

  return {
    apiKey,
    testMode,
    apiBase,
    webhookSecret: env('CREEM_WEBHOOK_SECRET'),
    monthlyProductId,
    annualProductId,
    monthlyCheckoutUrl: resolveCheckoutUrl(monthlyCheckoutRaw, monthlyProductId),
    annualCheckoutUrl: resolveCheckoutUrl(annualCheckoutRaw, annualProductId),
    defaultCheckoutUrl: resolveCheckoutUrl(defaultCheckoutRaw, monthlyProductId),
    isConfigured: Boolean(apiKey && (monthlyProductId || annualProductId)) ||
      Boolean(resolveCheckoutUrl(defaultCheckoutRaw, monthlyProductId)),
  }
}

/**
 * Builds a ready-to-redirect Creem hosted payment URL with customer metadata.
 */
export function buildCreemCheckoutUrl(options: CreemCheckoutOptions = {}): string | null {
  const config = getCreemConfig()
  const baseUrl =
    options.billingInterval === 'year'
      ? config.annualCheckoutUrl
      : config.monthlyCheckoutUrl

  if (!baseUrl || isPlaceholder(baseUrl)) return null

  try {
    const url = new URL(baseUrl)
    if (options.userEmail) {
      url.searchParams.set('email', options.userEmail)
    }
    if (options.userId) {
      url.searchParams.set('client_reference_id', options.userId)
    }
    if (options.successUrl) {
      url.searchParams.set('success_url', options.successUrl)
    }
    return url.toString()
  } catch {
    return baseUrl
  }
}
