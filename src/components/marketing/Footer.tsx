import Link from 'next/link'
import { Instagram, Twitter, Zap } from 'lucide-react'

const SOCIAL = [
  { Icon: Instagram, href: 'https://www.instagram.com/getinstavibes/', label: 'Instagram' },
  { Icon: Twitter, href: 'https://x.com/FutureTech_AI1', label: 'X' },
]

const LINKS = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms#refunds', label: 'Refunds' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="relative px-6 py-12 sm:py-16 border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-[var(--color-text)]">
                instavibes
              </span>
            </div>
            <span className="text-sm font-medium text-[var(--color-muted)]">
              Your content, in your voice.
            </span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {SOCIAL.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`instavibes on ${label}`}
                className="hairline flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-muted)] transition-colors hover:border-black/20 hover:text-[var(--color-text)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row">
          <span className="text-xs font-medium text-[var(--color-muted)]">
            © {new Date().getFullYear()} instavibes. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="mailto:instavibesai@gmail.com"
              className="text-xs font-semibold text-[var(--color-text)] transition hover:opacity-70"
            >

            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
