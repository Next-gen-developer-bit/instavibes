'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { updatePassword } from '@/actions/auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updatePassword(fd)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    })
  }

  return (
    <div className="hairline rounded-3xl bg-white/90 backdrop-blur-md shadow-xl px-8 py-10 sm:px-10">
      {success ? (
        <div className="text-center animate-in fade-in duration-300">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Password updated
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Your password has been changed successfully. Redirecting you to your dashboard…
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Set new password
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-muted)]">
              Choose a strong password with at least 8 characters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-xs font-semibold text-[var(--color-text)]">
                New password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  id="new-password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-semibold text-[var(--color-text)]">
                Confirm new password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPw ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className="input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              disabled={isPending}
              className="btn-primary mt-2 w-full gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating password…
                </>
              ) : (
                <>
                  Update password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
            Remembered your credentials?{' '}
            <Link href="/login" className="font-semibold text-[var(--color-accent)] hover:underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
