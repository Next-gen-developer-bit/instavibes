import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { rateLimits, getClientIp } from '@/lib/security/rate-limit'
import { hasPaidAccess } from '@/lib/access'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const ip = getClientIp(request)

  // 1. Rate Limiting on sensitive authentication routes
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/sign-up' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'

  // Only throttle non-GET auth traffic so the login page itself always renders.
  if (isAuthRoute && request.method !== 'GET') {
    const rateCheck = rateLimits.checkAuthPage(ip)
    if (!rateCheck.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many attempts. Please wait a moment before trying again.',
          retryAfter: rateCheck.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateCheck.reset),
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  // Rate Limiting on generic API routes (protects against API abuse)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/cron')) {
    const rateCheck = rateLimits.checkApi(ip)
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please slow down.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.reset),
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  // 2. If Google / OAuth provider returns with ?code= on the root path, forward to auth callback
  const code = request.nextUrl.searchParams.get('code')
  if (code && pathname === '/') {
    const callbackUrl = new URL('/auth/callback', request.url)
    callbackUrl.searchParams.set('code', code)
    const next = request.nextUrl.searchParams.get('next')
    if (next) callbackUrl.searchParams.set('next', next)
    return NextResponse.redirect(callbackUrl)
  }

  let supabaseResponse = NextResponse.next({ request })

  // 3. Attach standard HTTP Security Headers
  const securityHeaders: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
  }

  Object.entries(securityHeaders).forEach(([k, v]) => {
    supabaseResponse.headers.set(k, v)
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          // Re-apply security headers
          Object.entries(securityHeaders).forEach(([k, v]) => {
            supabaseResponse.headers.set(k, v)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. Protect dashboard, onboarding & checkout routes for unauthenticated users
  if (
    (pathname.startsWith('/dashboard') ||
      pathname === '/onboarding' ||
      pathname.startsWith('/checkout')) &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Logged-in visitors keep the marketing site. Only a paid subscription opens the studio.
  // Free accounts that open login or sign-up are sent back to the landing page.
  if (user && (pathname === '/login' || pathname === '/sign-up')) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, stripe_subscription_id')
      .eq('user_id', user.id)
      .maybeSingle()

    const destination = hasPaidAccess(subscription) ? '/dashboard' : '/'
    const url = request.nextUrl.clone()
    url.pathname = destination
    url.search = ''
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

