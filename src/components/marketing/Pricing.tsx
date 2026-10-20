'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Brain, Clapperboard, Sparkles, CalendarDays, Languages } from 'lucide-react'
import type { MarketingViewer } from '@/lib/access'

const LAUNCH_END = new Date('2026-11-06T23:59:59+05:30')

function Countdown() {
  const [t, setT] = useState({ d: '--', h: '--', m: '--', s: '--' })
  useEffect(() => {
    function tick() {
      const diff = LAUNCH_END.getTime() - Date.now()
      if (diff <= 0) { setT({ d: '00', h: '00', m: '00', s: '00' }); return }
      setT({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])

  const units = [
    { label: 'days', val: t.d },
    { label: 'hours', val: t.h },
    { label: 'mins', val: t.m },
    { label: 'secs', val: t.s },
  ]
  return (
    <div className="flex items-center gap-2">
      {units.map(u => (
        <div key={u.label} className="min-w-[3.5rem] rounded-xl bg-white px-2.5 py-2 text-center ring-1 ring-[var(--color-border)]">
          <p className="text-xl font-bold tabular-nums leading-none text-[var(--color-text)]">{u.val}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{u.label}</p>
        </div>
      ))}
    </div>
  )
}

const FEATURES = [
  {
    icon: Brain,
    label: 'AI Persona & Voice',
    items: [
      'Learns your distinct speaking rhythm, signature hooks, and niche vocabulary from your reels',
      'Full visibility into your creator profile—fine-tune and evolve your persona anytime',
    ],
  },
  {
    icon: Clapperboard,
    label: 'Script Studio',
    items: [
      'Import viral Instagram reels or paste any reel link to analyze hooks and structure',
      'Transforms any winning format into an original script calibrated to your exact voice',
    ],
  },
  {
    icon: Sparkles,
    label: 'Outlier Radar',
    items: [
      'Curated stream of high-velocity reels winning in your specific domain today',
      'Creator watchlist: monitor top creators and spot breakout ideas before they saturate',
    ],
  },
  {
    icon: CalendarDays,
    label: 'Workflow & Vault',
    items: [
      'Interactive content calendar to schedule drops and keep your posting cadence unbroken',
      'Centralized vault to bookmark viral references and store your produced scripts',
    ],
  },
]

export default function Pricing({ viewer }: { viewer: MarketingViewer }) {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="relative scroll-mt-24 px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/10 px-3.5 py-1.5 text-sm font-semibold text-[var(--color-accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] pulse" />
            Special launch pricing · ends 6 November
          </span>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
            Lock in your founder rate
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[var(--color-muted)]">
            Join during our launch window to grandfather your discount forever. One simple plan, cancel anytime.
          </p>
          <div className="mt-6"><Countdown /></div>

          {/* Toggle */}
          <div className="mt-8 inline-flex rounded-full bg-[var(--color-surface)] p-1 ring-1 ring-[var(--color-border)]">
            {['Monthly', 'Annual'].map((tab) => {
              const isActive = (tab === 'Annual') === annual
              return (
                <button
                  key={tab}
                  onClick={() => setAnnual(tab === 'Annual')}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'}`}
                >
                  {isActive && <span className="absolute inset-0 rounded-full bg-[var(--color-button)]" />}
                  <span className="relative">{tab}</span>
                  {tab === 'Annual' && (
                    <span className="relative rounded-full px-2 py-0.5 text-[11px] font-bold bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                      2 months free
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Card */}
        <div className="hairline mx-auto mt-10 grid max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl md:grid-cols-[5fr_7fr]">
          {/* Left – dark */}
          <div className="relative flex flex-col overflow-hidden bg-[var(--color-button)] p-8 text-white sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
            />
            <div className="relative flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">instavibes pro</p>
              <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white">Founder deal</span>
            </div>
            <div className="relative mt-8">
              <p className="text-xl text-white/40 line-through">{annual ? '$200' : '$20'}</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-6xl font-semibold tracking-tight">{annual ? '$100' : '$10'}</span>
                <span className="text-white/60">/{annual ? 'year' : 'month'}</span>
              </p>
              <p className="mt-3 text-sm text-white/60">
                {annual ? 'Billed yearly (equal to $8.33/mo). Cancel anytime.' : 'Billed every month. Cancel anytime.'}
              </p>
            </div>
            <div className="relative mt-auto pt-10">
              <Link
                href={viewer.isLoggedIn ? viewer.appHref : '/sign-up'}
                className="flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                {viewer.isLoggedIn ? viewer.appLabel : 'Start your 3-day free trial'}
              </Link>
              <p className="mt-3 text-center text-xs text-white/50">Zero risk for 3 days · Cancel in one click</p>
            </div>
          </div>

          {/* Right – white */}
          <div className="p-8 sm:p-10">
            <p className="text-sm font-semibold text-[var(--color-text)]">All creator tools included</p>
            <div className="mt-5 grid gap-x-6 gap-y-6 sm:grid-cols-2">
              {FEATURES.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.label}>
                    <p className="flex items-center gap-2 text-[15px] font-semibold text-[var(--color-text)]">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      {f.label}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {f.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-muted)]">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" strokeWidth={3} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
            <p className="mt-7 flex items-center gap-2 border-t border-[var(--color-border)] pt-5 text-sm text-[var(--color-muted)]">
              <Languages className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
              Crafted natively for English, Hindi, and Hinglish — never translated.
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          Special launch rates end 6 November at 11:59 pm IST. Subscriptions renew at your locked-in rate.
        </p>
      </div>
    </section>
  )
}
