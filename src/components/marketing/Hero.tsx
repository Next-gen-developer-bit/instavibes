import Link from 'next/link'
import { ArrowRight, Heart, Play } from 'lucide-react'
import type { MarketingViewer } from '@/lib/access'

const REELS = [
  { views: '1.1M', likes: '16.6K', rotate: '-8deg', delay: '0s', accent: '#FF5A4E' },
  { views: '300K', likes: '3.4K', rotate: '6deg', delay: '0.08s', accent: '#FF8C42' },
  { views: '97K', likes: '7.8K', rotate: '-2deg', delay: '0.16s', accent: '#121211' },
]

export default function Hero({ viewer }: { viewer: MarketingViewer }) {
  return (
    <section id="top" className="relative overflow-hidden px-5 sm:px-6 pb-16 pt-10 sm:pt-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% -10%, rgba(255,90,78,0.18) 0%, rgba(255,140,66,0.08) 40%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-1.5 text-xs font-medium text-[var(--color-muted)] shadow-sm">
          Idea → hook → script from any viral reel
        </span>

        <h1
          className="font-semibold tracking-tight text-[var(--color-text)]"
          style={{ fontSize: 'clamp(34px, 6vw, 64px)', lineHeight: '1.05', letterSpacing: '-0.03em' }}
        >
          Grow and monetize your{' '}
          <em
            className="not-italic"
            style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #FF5A4E 0%, #FF8C42 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Instagram audience
          </em>
          , fast
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--color-muted)] sm:text-lg">
          instavibes learns how you talk, turns any viral reel into your next
          script, and writes it in English, Hindi, or Hinglish.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <Link
            href={viewer.isLoggedIn ? viewer.appHref : '/sign-up'}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-button)] px-7 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-88"
          >
            {viewer.isLoggedIn ? viewer.appLabel : 'Try free for 3 days'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-[var(--color-muted)]">Nothing charged for 3 days · Cancel anytime</p>
        </div>
      </div>

      <div className="relative mx-auto mt-14 flex max-w-4xl items-end justify-center gap-3 sm:gap-5 px-2">
        {REELS.map((reel, i) => (
          <div
            key={reel.views}
            className={`relative w-[31%] max-w-[220px] overflow-hidden rounded-[1.6rem] border border-black/8 bg-[#1a1a1a] shadow-2xl ${
              i === 1 ? 'mb-0 sm:-mb-6' : 'mb-6 sm:mb-10'
            }`}
            style={{
              aspectRatio: '9 / 14',
              transform: `rotate(${reel.rotate})`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${reel.accent}33 0%, #111 70%)`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                <Play className="h-5 w-5 fill-white text-white" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <span className="text-[11px] font-semibold sm:text-sm">{reel.views} views</span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-white/80 sm:text-xs">
                <Heart className="h-3 w-3 fill-white" />
                {reel.likes}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm font-medium text-[var(--color-muted)]">
        Scripts written for creators already posting to millions of views
      </p>
    </section>
  )
}
