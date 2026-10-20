import { headers } from 'next/headers'

function stripSlash(url: string) {
  return url.replace(/\/$/, '')
}

function isLocalHost(value: string) {
  return /localhost|127\.0\.0\.1/.test(value)
}

/**
 * Public origin for OAuth callbacks and checkout return URLs.
 * Prefer the incoming request host so production never redirects to localhost
 * when NEXT_PUBLIC_APP_URL is still a local value.
 */
export async function getAppUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()

  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    const proto =
      h.get('x-forwarded-proto') ||
      (host && isLocalHost(host) ? 'http' : 'https')
    if (host) {
      const requestUrl = stripSlash(`${proto}://${host}`)
      if (!envUrl || isLocalHost(envUrl) || envUrl === requestUrl) {
        return requestUrl
      }
    }
  } catch {
    // headers() is unavailable outside a request (e.g. build)
  }

  if (envUrl) return stripSlash(envUrl)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export function sanitizeInternalPath(
  path: string | null | undefined,
  fallback = '/dashboard'
): string {
  if (!path) return fallback
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return fallback
  }
  return path
}
