export default function NativeLanguage() {
  return (
    <section className="px-5 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
        <div>
          <h2
            className="font-semibold tracking-tight text-[var(--color-text)]"
            style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
          >
            Written natively, not translated
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            Most AI writing tools think in English, then translate. instavibes writes natively in whichever language your audience speaks: English, Hindi, or Hinglish.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-black/8 bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Translated</p>
            <p className="mt-2 text-[var(--color-muted)]">“This is the best way to grow your account fast.”</p>
          </div>
          <div className="rounded-2xl border border-[#FF5A4E]/20 bg-[#FF5A4E]/6 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#FF5A4E]">Native Hinglish</p>
            <p className="mt-2 font-medium text-[var(--color-text)]">“Yeh trick follow karo, growth guaranteed hai.”</p>
          </div>
        </div>
      </div>
    </section>
  )
}
