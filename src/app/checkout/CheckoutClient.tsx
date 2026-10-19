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

  const isConfigured = Boolean(
    defaultCreemUrl &&
      defaultCreemUrl.trim() !== '' &&
      !defaultCreemUrl.includes('placeholder') &&
      defaultCreemUrl !== 'https://checkout.creem.io'
  )

  const handleStartCheckout = async () => {
    if (!isConfigured) {
      setError(
        'Creem checkout link is not configured yet or is currently under review in Creem. Once approved, add your Creem checkout link to NEXT_PUBLIC_CREEM_CHECKOUT_URL in Vercel.'
      )
      return
    }

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
    <div className="min-h-screen bg-[#0E0F12] text-white flex flex-col justify-between selection:bg-[#FF5A36] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8C42] text-white font-black text-lg shadow-md shadow-[#FF5A36]/20">
            ⚡
          </div>
          <span className="font-bold text-lg tracking-tight">InstaVibes</span>
          <span className="rounded-full bg-[#FF5A36]/15 border border-[#FF5A36]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF5A36]">
            Early Access
          </span>
        </div>

        {/* Back and Cancel Navigation */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>

          <Link
            href="/"
            className="text-xs font-semibold text-white/50 hover:text-white transition px-3 py-1.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 cursor-pointer"
          >
            Cancel
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 mb-4">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Blueprint Saved • 3-Day Risk-Free Trial</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Start Your Free Trial. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] via-[#FF8C42] to-[#FFC247]">
              Never run out of what to post.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-white/70">
            {profile?.instagram_handle ? (
              <>
                Voice profile for{' '}
                <span className="text-white font-semibold">
                  @{profile.instagram_handle}
                </span>{' '}
                is ready.
              </>
            ) : (
              'Your Content Brain is calibrated.'
            )}{' '}
            Start testing viral hooks and scripts in your exact voice today.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center rounded-full bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setInterval('month')}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                interval === 'month'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Monthly ($10/mo)
            </button>
            <button
              onClick={() => setInterval('year')}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                interval === 'year'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Annual ($100/yr)</span>
              <span className="rounded-full bg-[#FF5A36] px-1.5 py-0.2 text-[10px] font-bold text-white">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing & Checkout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: What's Included */}
          <div className="lg:col-span-7 rounded-3xl bg-white/[0.03] border border-white/8 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-white/90">
              <Sparkles className="h-4 w-4 text-[#FF5A36]" />
              <span>Everything unlocked in your trial:</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0 border border-purple-500/20">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Personalized Content Brain
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                    Analyzes viral reels and writes original scripts matching your exact tone, cadence, and target audience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 shrink-0 border border-orange-500/20">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Unlimited Reel Script Studio
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                    Paste any trending Instagram reel URL to break down hook structures and generate camera-ready scripts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-[#E1306C] shrink-0 border border-rose-500/20">
                  <Instagram className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Outlier Radar & Niche Insights
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                    Curated feed of outlier Instagram reels winning across tech, fitness, finance, lifestyle, and comedy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 border border-emerald-500/20">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Posting Calendar & Script Vault
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                    Plan dated shooting schedules and keep all your hooks and scripts organized in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/8 flex items-center justify-between text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Cancel anytime with 1 click
              </span>
              <span>English • Hindi • Hinglish</span>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 rounded-3xl bg-white/[0.04] border border-white/12 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF8C42]">
                  Subscription Plan
                </p>
                <h3 className="text-xl font-black text-white mt-0.5">
                  InstaVibes Pro
                </h3>
              </div>
              <div className="text-right">
                <span className="line-through text-xs text-white/40 block">
                  {interval === 'year' ? '$200/yr' : '$20/mo'}
                </span>
                <span className="text-lg font-bold text-white">
                  {interval === 'year' ? '$100/yr' : '$10/mo'}
                </span>
              </div>
            </div>

            {/* Trial breakdown */}
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

            <div className="pt-4 pb-2 border-t border-white/8 flex items-center justify-between text-base font-extrabold text-white">
              <span>Total Due Today:</span>
              <span className="text-2xl text-emerald-400 font-black">$0.00</span>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {!isConfigured && (
              <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Payment Gateway Under Review</span>
                </div>
                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                  Creem checkout is being configured or is under review. Once your product link is generated in Creem, add it to <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono text-[10px]">NEXT_PUBLIC_CREEM_CHECKOUT_URL</code> in Vercel to start live payments.
                </p>
              </div>
            )}

            <button
              onClick={handleStartCheckout}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF8C42] px-6 py-4 text-sm sm:text-base font-extrabold text-white shadow-xl shadow-[#FF5A36]/25 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting to Checkout…</span>
                </>
              ) : (
                <>
                  <span>Start 3-Day Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-white/40">
              Secured by <span className="font-semibold text-white/70">Creem</span>. Cancel anytime before trial ends and you won&apos;t be charged.
            </p>
          </div>
        </div>

        {/* Back and Cancel Actions (Bypassing workspace preview link removed) */}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-white/50">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to previous step</span>
          </button>
          <span className="text-white/20">•</span>
          <Link
            href="/"
            className="text-white/60 hover:text-white transition cursor-pointer"
          >
            Cancel checkout & return home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} InstaVibes. All rights reserved. • Powered by Creem Merchant of Record.
      </footer>
    </div>
  )
}
