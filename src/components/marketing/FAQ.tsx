'use client'

import { useState } from 'react'

const ITEMS = [
  {
    q: 'What is InstaVibes, exactly?',
    a: 'A content engine for creators. It learns your voice from your own reels, turns any viral video into fresh ideas and scripts, and writes them in English, Hindi or Hinglish.',
  },
  {
    q: "Does it just copy other people's content?",
    a: "No. InstaVibes only takes patterns and structure from a source video: hooks, pacing, format. It never reproduces the original wording. Every script is written fresh, in your voice.",
  },
  {
    q: 'What do you need to get started?',
    a: "Your Instagram handle. InstaVibes reads your recent public reels to learn how you sound. No password, no access to your account, nothing to install.",
  },
  {
    q: 'How does it decide which reels to show me?',
    a: "Your feed is matched to what you actually post, not to whatever is trending that week. And when you follow a creator, InstaVibes surfaces their reel only when it beat their own usual numbers, so a big account's ordinary day never crowds out a smaller one's best.",
  },
  {
    q: 'What languages does it support?',
    a: 'English, Hindi and Hinglish. Each written natively, never translated from one into another.',
  },
  {
    q: 'Do I need existing scripts to use it?',
    a: "It helps. Adding a few past scripts or captions lets InstaVibes learn your style faster, but you can start without them.",
  },
  {
    q: 'How do I get started?',
    a: 'Sign up and start a 3-day free trial. Nothing is charged for the first 3 days, and you can cancel anytime.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
          Questions, answered
        </h2>
        <div className="mt-12 flex flex-col gap-3">
          {ITEMS.map((item, i) => (
            <div key={i} className="hairline overflow-hidden rounded-2xl bg-[var(--color-surface)]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="text-base font-semibold text-[var(--color-text)]">
                  {item.q}
                </span>
                <span
                  className={`shrink-0 text-xl transition-transform duration-300 ${open === i ? 'rotate-45 text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
          Still stuck?{' '}
          <a
            href="mailto:instavibesai@gmail.com"
            className="font-semibold text-[var(--color-accent)] underline-offset-4 hover:underline"
          >
            instavibesai@gmail.com
          </a>{' '}
          (a real person reads it).
        </p>
      </div>
    </section>
  )
}
