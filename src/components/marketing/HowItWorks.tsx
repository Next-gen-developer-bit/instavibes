const STEPS = [
  {
    num: '01',
    title: 'Enter your Instagram link',
    desc: 'instavibes reads your existing content to learn your style from the start.',
  },
  {
    num: '02',
    title: 'Get ideas and scripts from viral videos',
    desc: "Paste or browse a viral reel. Get ideas, hooks, and scripts built from what's working, rewritten in your voice.",
  },
  {
    num: '03',
    title: 'Fill up your calendar',
    desc: 'Every idea and script drops straight into your content calendar.',
  },
  {
    num: '04',
    title: "Know what you're shooting next",
    desc: 'Your calendar always has the next script ready, so you never open the app wondering what to film.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-28 px-5 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            How it works
          </span>
          <h2
            className="mt-3 font-semibold tracking-tight text-[var(--color-text)]"
            style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
          >
            From one link to a full week of content, in four steps.
          </h2>
        </div>

        <ol className="mt-12 divide-y divide-black/8 border-y border-black/8">
          {STEPS.map((step) => (
            <li key={step.num} className="grid gap-3 py-7 sm:grid-cols-[5rem_1fr] sm:gap-8 sm:py-8">
              <span className="text-sm font-bold tracking-widest text-[var(--color-accent)]">{step.num}</span>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">{step.title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-[15px]">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
