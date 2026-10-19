import Link from 'next/link'
import { Eye, Heart, Instagram, ArrowRight } from 'lucide-react'

const METRICS = [
  { Icon: Instagram, color: '#E1306C', label: 'Viral Reel', views: '1.2M', likes: '42.8K' },
  { Icon: Instagram, color: '#E1306C', label: 'Trending Audio', views: '840K', likes: '31.2K' },
  { Icon: Instagram, color: '#E1306C', label: 'Hook Template', views: '590K', likes: '24.6K' },
]

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
]

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-20 pt-40 sm:pt-48"
    >
      {/* Background glows */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,90,78,0.28) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3"
        aria-hidden
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,66,0.20) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-1.5 text-xs font-medium text-[var(--color-muted)] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" style={{ animation: 'pulse 2s infinite' }} />
            Idea → hook → script from any viral reel
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-center font-semibold tracking-tight text-[var(--color-text)]"
          style={{ fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: '1.02', letterSpacing: '-0.025em' }}
        >
          Grow and monetize your{' '}
          <span
            style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #FF5A4E 0%, #FF8C42 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Instagram audience
          </span>
          , fast
        </h1>

        {/* Sub */}
        <p
          className="mx-auto mt-6 max-w-xl text-center text-[var(--color-muted)]"
          style={{ fontSize: 'clamp(16px, 3vw, 18px)', lineHeight: '1.65' }}
        >
          instavibes learns how you talk, turns any viral reel into your next
          script, and writes it in English, Hindi, or Hinglish.
        </p>

        {/* Social proof */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <div className="flex -space-x-2">
            {AVATARS.map((src, i) => (
              <div
                key={i}
                className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-[var(--color-surface)]"
                style={{ zIndex: AVATARS.length - i }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            <span className="font-semibold text-[var(--color-text)]">2,400+</span> creators growing with instavibes
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="flex items-center gap-2 rounded-full bg-[var(--color-button)] px-8 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-88"
          >
            Try free for 3 days
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-[var(--color-muted)]">No credit card · Cancel anytime</p>
        </div>

        {/* Phone mockup */}
        <div className="relative mx-auto mt-16 max-w-xs sm:max-w-sm">
          {/* Desktop metric cards */}
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className="absolute hidden items-center gap-3 rounded-2xl border border-black/8 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm lg:flex"
              style={{
                left: i % 2 === 0 ? -140 : undefined,
                right: i % 2 === 1 ? -140 : undefined,
                top: `${20 + i * 28}%`,
              }}
            >
              <m.Icon className="h-8 w-8 shrink-0" style={{ color: m.color }} />
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text)]">
                  <Eye className="h-3 w-3 text-[var(--color-muted)]" />
                  {m.views} views
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text)]">
                  <Heart className="h-3 w-3 text-[var(--color-muted)]" />
                  {m.likes} likes
                </span>
              </div>
            </div>
          ))}

          {/* Phone frame */}
          <div
            className="relative mx-auto overflow-hidden border border-black/8 bg-[var(--color-surface)] shadow-2xl"
            style={{ borderRadius: '2.5rem', aspectRatio: '9 / 16', width: '100%' }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255,90,78,0.10) 0%, transparent 50%, rgba(255,140,66,0.08) 100%)',
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(255,90,78,0.12)' }}
              >
                <Instagram className="h-8 w-8" style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Viral Reel Feed</p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">Trending in your niche right now</p>
              </div>
              <div className="w-full space-y-2.5">
                {[0.9, 0.75, 0.6].map((opacity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl border border-black/6 bg-white/80 p-2.5 shadow-sm backdrop-blur-sm"
                    style={{ opacity }}
                  >
                    <div
                      className="h-9 w-9 shrink-0 rounded-xl"
                      style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))' }}
                    />
                    <div className="flex-1 space-y-1.5 text-left">
                      <div
                        className="h-2 rounded-full bg-black/10"
                        style={{ width: `${65 - i * 12}%` }}
                      />
                      <div
                        className="h-1.5 rounded-full bg-black/6"
                        style={{ width: `${45 - i * 8}%` }}
                      />
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-accent)]">
                      Viral
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile metric chips */}
          <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-2 lg:hidden">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-2 rounded-xl border border-black/8 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm"
              >
                <m.Icon className="h-5 w-5 shrink-0" style={{ color: m.color }} />
                <div className="flex flex-col">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-text)]">
                    <Eye className="h-2.5 w-2.5 text-[var(--color-muted)]" />
                    {m.views}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[var(--color-muted)]">
                    <Heart className="h-2.5 w-2.5 text-[var(--color-muted)]" />
                    {m.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
            50M+ views, 10M+ likes and counting
          </p>
        </div>
      </div>
    </section>
  )
}
