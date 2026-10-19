/**
 * Strict URL validator and SSRF (Server-Side Request Forgery) protection.
 * Ensures user-provided media URLs belong exclusively to authorized external social platforms
 * and blocks access to cloud metadata endpoints, localhost, or internal network IPs.
 */

const ALLOWED_DOMAINS = [
  'instagram.com',
  'www.instagram.com',
  'instagr.am',
]

const FORBIDDEN_IP_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./, // AWS / GCP / Azure metadata endpoint
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /\.local$/i,
  /\.internal$/i,
  /\.lan$/i,
]

export type SupportedPlatform = 'instagram'

export interface UrlValidationResult {
  valid: boolean
  sanitizedUrl?: string
  platform?: SupportedPlatform
  error?: string
}

export function validateContentUrl(inputUrl: string): UrlValidationResult {
  const trimmed = inputUrl?.trim()
  if (!trimmed) {
    return { valid: false, error: 'Please enter a video or reel URL.' }
  }

  if (trimmed.length > 2048) {
    return { valid: false, error: 'URL exceeds maximum length of 2048 characters.' }
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return { valid: false, error: 'Invalid URL format. Please provide a valid link.' }
  }

  // Must be HTTPS (or HTTP in local dev)
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { valid: false, error: 'Only secure HTTP(S) links are supported.' }
  }

  const hostname = parsed.hostname.toLowerCase()

  // 1. SSRF Check: Reject loopback, private IPs, or internal metadata endpoints
  for (const pattern of FORBIDDEN_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, error: 'Access to local or private network addresses is forbidden.' }
    }
  }

  // Reject custom non-standard ports
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return { valid: false, error: 'Custom ports are not allowed.' }
  }

  // 2. Domain Whitelist Check
  const isAllowed = ALLOWED_DOMAINS.some(
    (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
  )

  if (!isAllowed) {
    return {
      valid: false,
      error: 'Please paste a valid Instagram reel link (e.g. https://www.instagram.com/reel/...).',
    }
  }

  // 3. Platform Detection (InstaVibes is focused exclusively on Instagram)
  const platform: SupportedPlatform = 'instagram'

  // Remove unnecessary tracking query parameters for clean caching
  const sanitized = new URL(parsed.toString())
  const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'igsh', 'fbclid', 'gclid']
  trackingParams.forEach((param) => sanitized.searchParams.delete(param))

  return {
    valid: true,
    sanitizedUrl: sanitized.toString(),
    platform,
  }
}
