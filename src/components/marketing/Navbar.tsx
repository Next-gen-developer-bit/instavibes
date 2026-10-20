'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import type { MarketingViewer } from '@/lib/access'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar({ viewer }: { viewer: MarketingViewer }) {
  const [open, setOpen] = useState(false)
  const loggedIn = viewer.isLoggedIn

  return (
    <header className="sticky top-11 z-50 border-b border-black/6 bg-[#FAFAF9]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="instavibes home">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <Zap className="h-4 w-4 fill-white text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-[var(--color-text)]">
            instavibes
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!loggedIn && (
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-black/4 md:flex"
            >
              Login
            </Link>
          )}
          <Link
            href={loggedIn ? viewer.appHref : '/sign-up'}
            className="hidden rounded-full bg-[var(--color-button)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-85 md:flex"
          >
            {loggedIn ? viewer.appLabel : 'Get started'}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-black/5 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/6 bg-[#FAFAF9] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-muted)] hover:bg-black/4 hover:text-[var(--color-text)]"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2 border-t border-black/6 pt-3">
              {!loggedIn && (
                <Link href="/login" className="flex-1 rounded-full border border-black/12 bg-white px-4 py-2.5 text-center text-sm font-semibold">
                  Login
                </Link>
              )}
              <Link
                href={loggedIn ? viewer.appHref : '/sign-up'}
                className="flex flex-1 items-center justify-center rounded-full bg-[var(--color-button)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                {loggedIn ? viewer.appLabel : 'Get started'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
