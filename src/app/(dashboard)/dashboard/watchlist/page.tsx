import type { Metadata } from 'next'
import { Eye, PlusCircle } from 'lucide-react'

export const metadata: Metadata = { title: 'Watchlist' }

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Watchlist</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Follow creators and see their breakout reels first</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm">
          <PlusCircle className="h-4 w-4" /> Add creator
        </button>
      </div>
      <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
          <Eye className="h-8 w-8 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-base font-semibold text-[var(--color-text)]">No creators yet</h3>
        <p className="mt-2 max-w-xs text-sm text-[var(--color-muted)]">
          Add Instagram handles to watch. We&apos;ll surface only their breakout reels — content that beats their own average.
        </p>
      </div>
    </div>
  )
}
