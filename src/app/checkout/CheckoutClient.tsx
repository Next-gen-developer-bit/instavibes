'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Brain,
  Instagram,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { createCreemCheckoutSession } from '@/actions/checkout'

interface CheckoutClientProps {
  user: {
    id: string
    email?: string
  }
  profile?: {
    instagram_handle?: string | null
    full_name?: string | null
  } | null
  defaultCreemUrl?: string
}

export default function CheckoutClient({
  user,
  profile,
  defaultCreemUrl,
}: CheckoutClientProps) {
  const router = useRouter()
  const [interval, setInterval] = useState<'month' | 'year'>('month')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await createCreemCheckoutSession(interval)

      if (res.error) {
        setError(res.error)
        setLoading(false)
        return
      }

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl
      } else {
        router.push('/checkout/success')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError('Unable to initiate checkout. Please try again or contact support.')
      setLoading(false)
    }
  }

  const trialEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  )

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#121211] flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-black/8 bg-[#FAFAF9]/90 px-6 py-3.5 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8C42] text-white font-black text-lg shadow-md shadow-[#FF5A36]/20">
            ⚡
          </div>
          <span className="font-bold text-lg tracking-tight">instavibes</span>
          <span className="rounded-full bg-[#FF5A4E]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF5A4E]">
            3-day trial
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#51515A] hover:text-[#121211] transition px-3 py-1.5 rounded-full border border-black/10 hover:bg-white cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Link>

          <Link
            href="/onboarding?canceled=true"
            className="text-xs font-semibold text-[#51515A] hover:text-[#121211] transition px-3 py-1.5 rounded-full cursor-pointer"
          >
            Cancel
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 mb-4">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Nothing charged for 3 days · Cancel anytime</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
            Lock in the launch price
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#51515A]">
            {profile?.instagram_handle ? (
              <>
                Voice profile for{' '}
                <span className="text-[#121211] font-semibold">
                  @{profile.instagram_handle}
                </span>{' '}
                is ready.
              </>
            ) : (
              'Your Content Brain is calibrated.'
            )}{' '}
            Start testing viral hooks and scripts in your exact voice today.
          </p>

          <div className="mt-6 inline-flex items-center rounded-full bg-white border border-black/10 p-1">
            <button
              onClick={() => setInterval('month')}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                interval === 'month'
                  ? 'bg-[#121211] text-white shadow-md'
                  : 'text-[#51515A] hover:text-[#121211]'
              }`}
            >
              Monthly ($10/mo)
            </button>
            <button
              onClick={() => setInterval('year')}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                interval === 'year'
                  ? 'bg-[#121211] text-white shadow-md'
                  : 'text-[#51515A] hover:text-[#121211]'
              }`}
            >
              <span>Annual ($100/yr)</span>
              <span className="rounded-full bg-[#FF5A4E] px-1.5 py-0.5 text-[10px] font-bold text-white">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 rounded-3xl bg-white border border-black/8 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-[#121211]">
              <Sparkles className="h-4 w-4 text-[#FF5A4E]" />
              <span>Everything included</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0 border border-purple-100">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#121211]">Content Brain</h4>
                  <p className="text-xs text-[#51515A] mt-0.5 leading-relaxed">
                    Learns your voice from your own reels: your tone, your hooks, your topics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 shrink-0 border border-orange-100">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#121211]">Content Studio</h4>
                  <p className="text-xs text-[#51515A] mt-0.5 leading-relaxed">
                    Paste any Instagram reel and get a script in your voice, with a hook and on-screen text.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-[#E1306C] shrink-0 border border-rose-100">
                  <Instagram className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#121211]">Inspiration</h4>
                  <p className="text-xs text-[#51515A] mt-0.5 leading-relaxed">
                    A feed of reels doing well in your niche, plus a watchlist for breakout posts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#121211]">Plan</h4>
                  <p className="text-xs text-[#51515A] mt-0.5 leading-relaxed">
                    Content calendar for what goes out when, and a library for scripts you save.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/8 flex items-center justify-between text-xs text-[#51515A]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Cancel anytime with 1 click
              </span>
              <span>English • Hindi • Hinglish</span>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-3xl bg-[#121211] text-white p-6 sm:p-8 shadow-xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                  instavibes pro
                </p>
                <h3 className="text-xl font-semibold mt-0.5">Launch price</h3>
              </div>
              <div className="text-right">
                <span className="line-through text-xs text-white/40 block">
                  {interval === 'year' ? '$200/yr' : '$20/mo'}
                </span>
                <span className="text-lg font-bold">
                  {interval === 'year' ? '$100/yr' : '$10/mo'}
                </span>
              </div>
            </div>

            <div className="py-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/70">3-Day Free Trial</span>
                <span className="font-bold text-emerald-400">$0.00</span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>First billing date</span>
                <span>{trialEndDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Recurring charge</span>
                <span>
                  {interval === 'year' ? '$100 every year' : '$10 every month'}
                </span>
              </div>
            </div>

            <div className="pt-4 pb-2 border-t border-white/10 flex items-center justify-between text-base font-semibold">
              <span>Total due today</span>
              <span className="text-2xl text-emerald-400 font-bold">$0.00</span>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-red-500/15 border border-red-400/30 p-3 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <button
              onClick={handleStartCheckout}
              disabled={loading}
              className="mt-6 w-full rounded-full bg-[#FF5A4E] px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#FF5A4E]/25 transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting to Checkout…</span>
                </>
              ) : (
                <>
                  <span>Start your 3-day free trial</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-white/50">
              Secured by <span className="font-semibold text-white/80">Creem</span>. Cancel anytime before trial ends and you won&apos;t be charged.
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-[#51515A]">
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 hover:text-[#121211] transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to onboarding</span>
          </Link>
          <span className="text-black/20">•</span>
          <Link
            href="/onboarding?canceled=true"
            className="hover:text-[#121211] transition cursor-pointer"
          >
            Cancel checkout
          </Link>
        </div>
      </main>

      <footer className="border-t border-black/8 px-6 py-6 text-center text-xs text-[#51515A] space-y-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          <Link href="/terms" target="_blank" className="hover:text-[#121211] transition">Terms</Link>
          <span>•</span>
          <Link href="/privacy" target="_blank" className="hover:text-[#121211] transition">Privacy</Link>
          <span>•</span>
          <Link href="/terms#refunds" target="_blank" className="hover:text-[#121211] transition">Refunds</Link>
          <span>•</span>
          <Link href="/contact" target="_blank" className="hover:text-[#121211] transition">Contact</Link>
        </div>
        <p>© {new Date().getFullYear()} instavibes. Payments securely processed by Creem (Merchant of Record).</p>
      </footer>
    </div>
  )
}
