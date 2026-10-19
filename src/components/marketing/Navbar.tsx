'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="fixed left-0 right-0 z-50 px-4"
      style={{ top: 52 }}
    >
      <div
        className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/60 bg-white/75 px-5 py-2.5 shadow-lg backdrop-blur-xl"
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="InstaVibes home">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
            <Zap className="h-4 w-4 fill-white text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-[var(--color-text)]">
            instavibes
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 text-sm font-medium sm:flex">
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

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-black/12 bg-white px-5 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-black/24 sm:flex"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="hidden rounded-full bg-[var(--color-button)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-85 sm:flex"
          >
            Get started free
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-black/5 sm:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mx-auto mt-2 max-w-5xl flex flex-col gap-1 rounded-2xl border border-black/8 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] hover:bg-black/4 hover:text-[var(--color-text)]"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2 border-t border-black/6 pt-3">
            <Link href="/login" className="flex-1 rounded-full border border-black/12 bg-white px-4 py-2.5 text-center text-sm font-semibold text-[var(--color-text)]">
              Login
            </Link>
            <Link
              href="/sign-up"
              className="flex flex-1 items-center justify-center rounded-full bg-[var(--color-button)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
