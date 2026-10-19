/**
 * High-performance sliding-window in-memory rate limiter.
 * Designed for Next.js Middleware and Server Actions.
 * Safely prunes stale entries periodically to maintain bounded memory footprint.
 */

interface RateLimitRecord {
  timestamps: number[]
}

class SlidingWindowRateLimiter {
  private store = new Map<string, RateLimitRecord>()
  private lastCleanup = Date.now()
  private cleanupIntervalMs = 60_000 // Clean up every 60s

  /**
   * Check whether a given identifier has exceeded the allowed limit within the window.
   *
   * @param key Unique identifier (e.g. IP address, User ID, Email)
   * @param limit Maximum allowed requests in the time window
   * @param windowSeconds Time window in seconds (e.g. 60 for 1 minute)
   * @returns Object with success status, remaining quota, and reset timestamp
   */
  public check(
    key: string,
    limit: number,
    windowSeconds: number
  ): {
    success: boolean
    limit: number
    remaining: number
    reset: number
  } {
    const now = Date.now()
    const windowMs = windowSeconds * 1000
    const windowStart = now - windowMs

    this.maybeCleanup(windowMs)

    let record = this.store.get(key)
    if (!record) {
      record = { timestamps: [] }
      this.store.set(key, record)
    }

    // Filter out timestamps outside the active sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart)

    if (record.timestamps.length >= limit) {
      const oldestInWindow = record.timestamps[0] || now
      const resetTime = Math.ceil((oldestInWindow + windowMs - now) / 1000)

      return {
        success: false,
        limit,
        remaining: 0,
        reset: Math.max(resetTime, 1),
      }
    }

    // Record this request
    record.timestamps.push(now)

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - record.timestamps.length),
      reset: Math.ceil(windowSeconds),
    }
  }

  /**
   * Removes stale keys where all timestamps are older than the active window.
   */
  private maybeCleanup(maxWindowMs: number) {
    const now = Date.now()
    if (now - this.lastCleanup < this.cleanupIntervalMs) return
    this.lastCleanup = now

    const cutoff = now - Math.max(maxWindowMs, 600_000) // At least 10 mins
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > cutoff)
      if (record.timestamps.length === 0) {
        this.store.delete(key)
      }
    }
  }
}

// Global singleton instance so memory state persists across invocations within the process
const globalRateLimiter = new SlidingWindowRateLimiter()

/**
 * Extracts the real client IP address from request headers.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0].trim()
    if (first) return first
  }
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  const cfIp = headers.get('cf-connecting-ip')
  if (cfIp) return cfIp.trim()

  return '127.0.0.1'
}

/**
 * Rate limit definitions:
 * - Auth (login/signup): 10 attempts per minute per IP
 * - Password Reset Request: 3 requests per 10 minutes per IP/email
 * - AI Script Generation: 10 requests per minute per user
 * - Instagram Scraper: 5 requests per 5 minutes per user
 * - API Routes (general): 60 requests per minute per IP
 */
export const rateLimits = {
  checkAuth(identifier: string) {
    return globalRateLimiter.check(`auth:${identifier}`, 10, 60)
  },
  checkAuthPage(ip: string) {
    return globalRateLimiter.check(`auth_page:${ip}`, 30, 60)
  },
  checkPasswordReset(identifier: string) {
    return globalRateLimiter.check(`pw_reset:${identifier}`, 3, 600)
  },
  checkAiGeneration(userId: string) {
    return globalRateLimiter.check(`ai_gen:${userId}`, 10, 300)
  },
  checkManualScrape(userId: string) {
    return globalRateLimiter.check(`scrape:${userId}`, 5, 300)
  },
  checkApi(ip: string) {
    return globalRateLimiter.check(`api:${ip}`, 60, 60)
  },
  checkCustom(key: string, limit: number, windowSeconds: number) {
    return globalRateLimiter.check(key, limit, windowSeconds)
  },
}
