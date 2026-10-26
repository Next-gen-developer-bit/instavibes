'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User, Instagram, Shield, Bell, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react'
import { updateProfileName, updateInstagramHandle } from '@/actions/profile'
import { cancelSubscription } from '@/actions/subscription'
import ConfirmModal from '@/components/ui/ConfirmModal'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row'] | null
type Subscription = Database['public']['Tables']['subscriptions']['Row'] | null

interface SettingsClientProps {
  initialProfile: Profile
  subscription: Subscription
}

interface ToastState {
  id: number
  message: string
  type: 'success' | 'error'
  subtext?: string
}

export default function SettingsClient({ initialProfile, subscription }: SettingsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Profile Form State
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? '')
  const [email] = useState(initialProfile?.email ?? '')
  const [savingProfile, setSavingProfile] = useState(false)

  // Instagram Handle Form State
  const [instagramHandle, setInstagramHandle] = useState(initialProfile?.instagram_handle ?? '')
  const [savingHandle, setSavingHandle] = useState(false)

  // Notifications State
  const [notifyWatchlist, setNotifyWatchlist] = useState(true)
  const [notifyWeekly, setNotifyWeekly] = useState(true)
  const [plan, setPlan] = useState(subscription)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [canceling, setCanceling] = useState(false)

  const onTrial = plan?.status === 'trialing'
  const canCancel = (onTrial || plan?.status === 'active') && !plan?.cancel_at

  // Toast Notification State
  const [toast, setToast] = useState<ToastState | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success', subtext?: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({
      id: Date.now(),
      message,
      type,
      subtext,
    })
    timerRef.current = setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Update local state if initialProfile changes from server revalidation
  useEffect(() => {
    if (initialProfile?.full_name !== undefined) {
      setFullName(initialProfile.full_name ?? '')
    }
    if (initialProfile?.instagram_handle !== undefined) {
      setInstagramHandle(initialProfile.instagram_handle ?? '')
    }
  }, [initialProfile])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = fullName.trim()
    if (!trimmed) {
      showToast('Please enter your full name', 'error')
      return
    }

    setSavingProfile(true)
    try {
      const res = await updateProfileName(trimmed)
      if (res?.error) {
        showToast(res.error, 'error')
      } else {
        showToast('User name saved successfully', 'success', 'Profile details updated')
        startTransition(() => {
          router.refresh()
        })
      }
    } catch {
      showToast('Failed to save profile. Please try again.', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSaveInstagram = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingHandle(true)
    try {
      const res = await updateInstagramHandle(instagramHandle)
      if (res?.error) {
        showToast(res.error, 'error')
      } else {
        showToast('Instagram handle saved successfully', 'success', 'Voice preferences will use this handle')
        startTransition(() => {
          router.refresh()
        })
      }
    } catch {
      showToast('Failed to update Instagram handle. Please try again.', 'error')
    } finally {
      setSavingHandle(false)
    }
  }

  return (
    <div className="relative mx-auto max-w-2xl space-y-6">
      {/* Toast Notification Popup */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 shadow-2xl border border-black/5 ring-1 ring-black/5 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
          style={{
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toast.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
              }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </div>
          <div className="pr-1">
            <p className="text-sm font-semibold text-[var(--color-text)]">{toast.message}</p>
            {toast.subtext && (
              <p className="text-xs text-[var(--color-muted)]">{toast.subtext}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 rounded-lg p-1 text-[var(--color-muted)] hover:bg-black/5 hover:text-[var(--color-text)] transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Settings</h1>

      {/* Profile Card */}
      <div className="hairline rounded-2xl bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <User className="h-4 w-4 text-[var(--color-accent)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                placeholder="Your name"
                disabled={savingProfile}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                className="input bg-[var(--color-surface)] text-[var(--color-muted)] cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile || isPending}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {savingProfile ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save changes</span>
            )}
          </button>
        </form>
      </div>

      {/* Instagram Card */}
      <div className="hairline rounded-2xl bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <Instagram className="h-4 w-4 text-[#E1306C]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Instagram Handle</h2>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          We use your public Instagram handle to learn your voice.
        </p>

        <form onSubmit={handleSaveInstagram} className="flex gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--color-muted)]">
              @
            </span>
            <input
              type="text"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              className="input pl-8"
              placeholder="yourhandle"
              disabled={savingHandle}
            />
          </div>
          <button
            type="submit"
            disabled={savingHandle || isPending}
            className="btn-accent shrink-0 flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {savingHandle ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Analyze voice</span>
            )}
          </button>
        </form>
      </div>

      {/* Subscription Card */}
      <div className="hairline rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <Shield className="h-4 w-4 text-[var(--color-accent)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Subscription</h2>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-[var(--color-surface)] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)] capitalize">
              {plan?.status === 'canceled' ? 'Canceled' : plan?.status ?? 'Free'} plan
            </p>
            {onTrial && plan?.trial_end && !plan.cancel_at && (
              <p className="text-xs text-[var(--color-muted)]">
                Trial ends{' '}
                {new Date(plan.trial_end).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                . Cancel before then and you will not be charged.
              </p>
            )}
            {plan?.cancel_at && plan.status !== 'canceled' && (
              <p className="text-xs text-[var(--color-muted)]">
                Cancels on{' '}
                {new Date(plan.cancel_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                . You will not be charged again.
              </p>
            )}
            {plan?.status === 'canceled' && (
              <p className="text-xs text-[var(--color-muted)]">
                Canceled. You will not be charged.
              </p>
            )}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${plan?.status === 'active'
                ? 'bg-emerald-100 text-emerald-700'
                : plan?.status === 'canceled'
                  ? 'bg-zinc-100 text-zinc-600'
                  : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              }`}
          >
            {plan?.status === 'active'
              ? 'Active'
              : plan?.status === 'trialing'
                ? 'Trial'
                : plan?.status === 'canceled'
                  ? 'Canceled'
                  : 'Free'}
          </span>
        </div>
        {canCancel && (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="w-full rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            {onTrial ? 'Cancel 3-day trial' : 'Cancel subscription'}
          </button>
        )}
        {!onTrial && plan?.status !== 'active' && plan?.status !== 'canceled' && (
          <a
            href="/checkout"
            className="block text-center text-sm font-semibold text-[var(--color-accent)] hover:underline underline-offset-4"
          >
            Upgrade to Pro →
          </a>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmCancel}
        onClose={() => {
          if (!canceling) setConfirmCancel(false)
        }}
        isLoading={canceling}
        variant="danger"
        title={onTrial ? 'Cancel your free trial?' : 'Cancel your subscription?'}
        description={
          onTrial
            ? 'Your 3-day trial will stop now. Your card will not be charged.'
            : 'You keep access until the end of this billing period, and you will not be charged again.'
        }
        confirmText={onTrial ? 'Cancel trial' : 'Cancel subscription'}
        cancelText="Keep my plan"
        onConfirm={() => {
          setCanceling(true)
          startTransition(async () => {
            const result = await cancelSubscription()
            setCanceling(false)
            if (result.error) {
              setConfirmCancel(false)
              showToast(result.error, 'error')
              return
            }
            setConfirmCancel(false)
            showToast(result.message || 'Canceled.', 'success')
            if (result.endedAccess) {
              window.location.href = '/?canceled=trial'
              return
            }
            setPlan((current) =>
              current
                ? {
                    ...current,
                    status: 'active',
                    cancel_at: current.current_period_end || new Date().toISOString(),
                  }
                : current
            )
            router.refresh()
          })
        }}
      />

      {/* Notifications Card */}
      <div className="hairline rounded-2xl bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <Bell className="h-4 w-4 text-[var(--color-accent)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Notifications</h2>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Breakout reels from watchlist
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Get notified when a followed creator posts a breakout reel
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setNotifyWatchlist(!notifyWatchlist)
              showToast(
                !notifyWatchlist
                  ? 'Watchlist notifications enabled'
                  : 'Watchlist notifications disabled'
              )
            }}
            className="relative mt-0.5 shrink-0 focus:outline-none"
            aria-label="Toggle breakout reels notifications"
          >
            <div
              className={`h-5 w-9 rounded-full transition-colors cursor-pointer ${notifyWatchlist ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
                }`}
            />
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifyWatchlist ? 'left-[22px]' : 'left-0.5'
                }`}
            />
          </button>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Weekly inspiration digest
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              A curated list of top reels from your niches every Monday
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setNotifyWeekly(!notifyWeekly)
              showToast(
                !notifyWeekly
                  ? 'Weekly digest notifications enabled'
                  : 'Weekly digest notifications disabled'
              )
            }}
            className="relative mt-0.5 shrink-0 focus:outline-none"
            aria-label="Toggle weekly inspiration digest notifications"
          >
            <div
              className={`h-5 w-9 rounded-full transition-colors cursor-pointer ${notifyWeekly ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
                }`}
            />
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifyWeekly ? 'left-[22px]' : 'left-0.5'
                }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
