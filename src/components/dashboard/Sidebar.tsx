'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Clapperboard, Sparkles, Eye, CalendarDays,
  BookMarked, Brain, Settings, Zap, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard/studio', icon: Clapperboard, label: 'Content Studio' },
  { href: '/dashboard/inspiration', icon: Sparkles, label: 'Inspiration' },
  { href: '/dashboard/watchlist', icon: Eye, label: 'Watchlist' },
  { href: '/dashboard/calendar', icon: CalendarDays, label: 'Calendar' },
  { href: '/dashboard/library', icon: BookMarked, label: 'Library' },
  { href: '/dashboard/brain', icon: Brain, label: 'Content Brain' },
]

const BOTTOM_NAV = [
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-[var(--color-border)] px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
          <Zap className="h-4 w-4 fill-white text-white" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-[var(--color-text)]">
          instavibes
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-link', active && 'active')}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--color-border)] p-3">
        {BOTTOM_NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn('sidebar-link', pathname === href && 'active')}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
