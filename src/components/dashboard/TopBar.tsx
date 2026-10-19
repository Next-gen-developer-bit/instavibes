'use client'

import { Bell, Search } from 'lucide-react'
import { signOut } from '@/actions/auth'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row'] | null

export default function DashboardTopBar({ profile }: { profile: Profile }) {
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-white px-6">
      {/* Search */}
      <div className="relative hidden w-72 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="search"
          placeholder="Search scripts, reels…"
          className="input h-9 py-0 pl-9 text-sm"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]">
          <Bell className="h-4.5 w-4.5" />
        </button>

        {/* User avatar + dropdown */}
        <div className="group relative">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
            {initials}
          </button>
          {/* Dropdown */}
          <div className="hairline invisible absolute right-0 top-full mt-2 w-48 rounded-xl bg-white py-1.5 shadow-lg opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100">
            <div className="border-b border-[var(--color-border)] px-4 py-2.5">
              <p className="text-xs font-semibold text-[var(--color-text)] truncate">{profile?.full_name || 'Creator'}</p>
              <p className="text-[11px] text-[var(--color-muted)] truncate">{profile?.email}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full px-4 py-2 text-left text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-red-500"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
