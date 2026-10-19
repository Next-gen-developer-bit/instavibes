'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { requestPasswordReset } from '@/actions/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await requestPasswordReset(fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setSubmitted(true)
      }
    })
  }

  return (
    <div className="hairline rounded-3xl bg-white/90 backdrop-blur-md shadow-xl px-8 py-10 sm:px-10">
      {submitted ? (
        <div className="text-center animate-in fade-in duration-300">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">
            We sent a password recovery link to{' '}
            <span className="font-semibold text-[var(--color-text)]">{email}</span>. Click the link in the email to choose a new password.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
            >
              Back to sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
            >
              Didn&apos;t get the email? Try another address
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] transition mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Forgot password?
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-muted)]">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="mb-1.5 block text-xs font-semibold text-[var(--color-text)]">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                />
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
              disabled={isPending}
              className="btn-primary mt-2 w-full gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending link…
                </>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
            Remember your password?{' '}
            <Link href="/login" className="font-semibold text-[var(--color-accent)] hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
