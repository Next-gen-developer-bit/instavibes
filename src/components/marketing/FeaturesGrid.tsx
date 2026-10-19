import { Brain, Clapperboard, Sparkles, CalendarDays, Eye } from 'lucide-react'

const FEATURES = [
  {
    title: 'Turn Any Viral Reel Into Yours',
    desc: 'Paste any Instagram reel URL. InstaVibes understands why it worked, then rewrites it completely in your own voice.',
    colSpan: 'sm:col-span-2 lg:col-span-3',
    icon: Clapperboard,
    iconColor: '#FF5A4E',
    bg: 'rgba(255,90,78,0.06)',
    iconBg: 'rgba(255,90,78,0.12)',
  },
  {
    title: 'From Idea to Finished Script',
    desc: 'Ideas become hooks. Hooks become scripts. Scripts fill your calendar, dated and ready to shoot.',
    colSpan: 'sm:col-span-2 lg:col-span-3',
    icon: Sparkles,
    iconColor: '#FF8C42',
    bg: 'rgba(255,140,66,0.06)',
    iconBg: 'rgba(255,140,66,0.12)',
  },
  {
    title: 'Your Voice, Remembered',
    desc: 'instavibes learns your audience, tone, offers and storytelling style so every script sounds like you.',
    colSpan: 'sm:col-span-2 lg:col-span-2',
    icon: Brain,
    iconColor: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
    iconBg: 'rgba(124,58,237,0.12)',
  },
  {
    title: 'Content Calendar',
    desc: "Always know what you're filming next. Every script lands on a date.",
    colSpan: 'sm:col-span-1 lg:col-span-2',
    icon: CalendarDays,
    iconColor: '#10B981',
    bg: 'rgba(16,185,129,0.06)',
    iconBg: 'rgba(16,185,129,0.12)',
  },
  {
    title: 'Watch Your Inspiration',
    desc: 'Follow the creators you learn from. instavibes watches what they post and surfaces only their breakout reels.',
    colSpan: 'sm:col-span-1 lg:col-span-2',
    icon: Eye,
    iconColor: '#3B82F6',
    bg: 'rgba(59,130,246,0.06)',
    iconBg: 'rgba(59,130,246,0.12)',
  },
]

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative px-6 py-20 sm:py-32" style={{ background: 'var(--color-surface)' }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-[720px] text-center">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-accent)' }}
          >
            Features
          </span>
          <h2
            className="mt-4 font-semibold tracking-tight text-[var(--color-text)]"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
          >
            Everything you need to grow on Instagram.
          </h2>
          <p className="mt-5 text-lg text-[var(--color-muted)]">
            From finding viral ideas to a finished script in your voice — one workflow, not ten tools.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 lg:grid-cols-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon
            return (
              <div key={feat.title} className={`${feat.colSpan} group`}>
                <div
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg"
                >
                  {/* Visual */}
                  <div
                    className="flex items-center justify-center p-8"
                    style={{ background: feat.bg, minHeight: 160 }}
                  >
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-2xl"
                      style={{ background: feat.iconBg }}
                    >
                      <Icon className="h-10 w-10" style={{ color: feat.iconColor }} />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="flex flex-col p-6 pt-5">
                    <h3
                      className="font-semibold tracking-tight text-[var(--color-text)]"
                      style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}
                    >
                      {feat.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-muted)]">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
