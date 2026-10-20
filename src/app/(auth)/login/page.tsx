'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, Chrome, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { signInWithPassword, signInWithGoogle } from '@/actions/auth'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
  const urlError = searchParams.get('error')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(
    urlError ? 'Sign-in did not complete. Please try again with email, or reconnect Google in Supabase Auth.' : null
  )
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, startGoogleTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('redirectTo', redirectTo)
    startTransition(async () => {
      const result = await signInWithPassword(fd)
      if (result?.error) setError(result.error)
    })
  }

  function handleGoogle() {
    setError(null)
    startGoogleTransition(async () => {
      const result = await signInWithGoogle(redirectTo)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="hairline rounded-3xl bg-white/90 backdrop-blur-md shadow-xl px-8 py-10 sm:px-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-muted)]">
          Sign in to your instavibes account
        </p>
      </div>

      {/* Google OAuth */}
      <button
        onClick={handleGoogle}
        disabled={isGooglePending || isPending}
        className="hairline mb-5 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition-all hover:bg-[var(--color-surface)] disabled:opacity-60"
      >
        {isGooglePending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="h-4 w-4 text-[#4285F4]" />
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative mb-5 flex items-center gap-3">
        <div className="flex-1 border-t border-[var(--color-border)]" />
        <span className="text-xs font-medium text-[var(--color-muted)]">or with email</span>
        <div className="flex-1 border-t border-[var(--color-border)]" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-[var(--color-text)]">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="text-xs font-semibold text-[var(--color-text)]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[var(--color-accent)] hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              id="login-password"
              name="password"
              type={showPw ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="input pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || isGooglePending}
          className="btn-primary mt-2 w-full gap-2 disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Don&apos;t have an account?{' '}
        <Link
          href="/sign-up"
          className="font-semibold text-[var(--color-accent)] underline-offset-4 hover:underline"
        >
          Sign up free
        </Link>
      </p>
    </div>
  )
}
