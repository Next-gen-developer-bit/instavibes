import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import type { MarketingViewer } from '@/lib/access'

export default function FinalCTA({ viewer }: { viewer: MarketingViewer }) {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-36">
      {/* Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
        style={{
          width: 600,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,90,78,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: 'var(--color-accent)' }}
        >
          <Zap className="h-7 w-7 fill-white text-white" />
        </div>
        <h2
          className="font-semibold tracking-tight text-[var(--color-text)]"
          style={{ fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
        >
          Ready when you are
        </h2>
        <p className="mt-5 text-lg text-[var(--color-muted)]">
          Start with one reel. instavibes learns how you talk, turns any viral video into your next script, and writes it in English, Hindi or Hinglish.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={viewer.isLoggedIn ? viewer.appHref : '/sign-up'}
            className="flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-88"
            style={{ background: 'var(--color-accent)', boxShadow: '0 10px 30px rgba(255,90,78,0.35)' }}
          >
            {viewer.isLoggedIn ? viewer.appLabel : 'Try free for 3 days'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {!viewer.isLoggedIn && (
            <Link
              href="/login"
              className="rounded-full border border-black/12 bg-white px-8 py-4 text-[15px] font-semibold text-[var(--color-text)] transition hover:border-black/24"
            >
              Sign in
            </Link>
          )}
        </div>
        <p className="mt-5 text-sm text-[var(--color-muted)]">
          3-day free trial · Cancel anytime · No credit card required
        </p>
      </div>
    </section>
  )
}
