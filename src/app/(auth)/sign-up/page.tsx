'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, Chrome, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import { signUpWithPassword, signInWithGoogle } from '@/actions/auth'

const PERKS = [
  '3-day free trial, no credit card',
  'Scripts in English, Hindi & Hinglish',
  'Cancel anytime',
]

export default function SignUpPage() {
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, startGoogleTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    if ((fd.get('password') as string).length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    startTransition(async () => {
      const result = await signUpWithPassword(fd)
      if (result?.error) setError(result.error)
    })
  }

  function handleGoogle() {
    setError(null)
    startGoogleTransition(async () => {
      const result = await signInWithGoogle()
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="hairline rounded-3xl bg-white/90 backdrop-blur-md shadow-xl px-8 py-10 sm:px-10">
      {/* Header */}
      <div className="mb-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Start creating, free
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-muted)]">
          Generate authentic reel scripts and scale your audience
        </p>
      </div>

      {/* Perks */}
      <div className="mb-6 mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {PERKS.map((p) => (
          <span key={p} className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
            <Check className="h-3 w-3 text-[var(--color-accent)]" strokeWidth={3} />
            {p}
          </span>
        ))}
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
        {/* Name */}
        <div>
          <label htmlFor="signup-name" className="mb-1.5 block text-xs font-semibold text-[var(--color-text)]">
            Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              id="signup-name"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className="input pl-10"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-xs font-semibold text-[var(--color-text)]">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              id="signup-email"
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
          <label htmlFor="signup-password" className="mb-1.5 block text-xs font-semibold text-[var(--color-text)]">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              id="signup-password"
              name="password"
              type={showPw ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Min 8 characters"
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
          className="btn-accent mt-2 w-full gap-2 disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-[var(--color-muted)]">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--color-text)]">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-text)]">Privacy Policy</Link>
        </p>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-[var(--color-accent)] underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
