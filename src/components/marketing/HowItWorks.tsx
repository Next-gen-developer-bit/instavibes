const STEPS = [
  {
    num: '01',
    title: 'Enter your Instagram link',
    desc: 'instavibes reads your existing content to learn your style, tone, topics, and hooks from the start.',
    color: 'var(--color-accent)',
    bgLight: 'rgba(255,90,78,0.06)',
  },
  {
    num: '02',
    title: 'Get ideas & scripts from viral videos',
    desc: "Paste or browse a viral reel. Get ideas, hooks, and scripts built from what's working — rewritten in your voice.",
    color: 'var(--color-accent-2)',
    bgLight: 'rgba(255,140,66,0.06)',
  },
  {
    num: '03',
    title: 'Fill your content calendar',
    desc: 'Every idea and script drops straight into your content calendar — dated, ready to shoot.',
    color: 'var(--color-accent)',
    bgLight: 'rgba(255,90,78,0.06)',
  },
  {
    num: '04',
    title: "Always know what you're shooting next",
    desc: "Your calendar always has the next script ready, so you never open the app wondering what to film.",
    color: '#7C3AED',
    bgLight: 'rgba(124,58,237,0.06)',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-6 py-20 sm:py-32">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 32px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{ background: 'linear-gradient(to right, var(--color-background), transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3"
        style={{ background: 'linear-gradient(to left, var(--color-background), transparent)' }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-accent)' }}>
            How it works
          </span>
          <h2
            className="mt-4 font-semibold tracking-tight text-[var(--color-text)]"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
          >
            From one link to a full week of content
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            Four steps. No guesswork. Scripts in your voice every time.
          </p>
        </div>

        {/* Steps grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.num} className="group relative">
              {/* Connector line (hidden on last) */}
              {i < STEPS.length - 1 && (
                <div
                  className="absolute right-0 top-10 hidden h-px w-5 lg:block"
                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.12), transparent)', transform: 'translateX(100%)' }}
                />
              )}
              <div
                className="flex h-full flex-col rounded-3xl border border-black/8 bg-white p-6 shadow-sm transition-shadow duration-300 group-hover:shadow-md"
              >
                {/* Number badge */}
                <div
                  className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold text-white"
                  style={{ background: step.color }}
                >
                  {step.num}
                </div>

                {/* Content area with gradient bg */}
                <div
                  className="mb-5 flex h-20 w-full items-center justify-center rounded-2xl"
                  style={{ background: step.bgLight }}
                >
                  <div
                    className="h-10 w-10 rounded-xl"
                    style={{ background: step.color, opacity: 0.15 }}
                  />
                </div>

                <h3 className="text-base font-semibold leading-snug text-[var(--color-text)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
