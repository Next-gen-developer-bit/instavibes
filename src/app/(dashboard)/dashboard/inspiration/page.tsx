'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, SlidersHorizontal, ExternalLink, Eye, Heart, MessageCircle, ArrowRight, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { searchTrendingReels, triggerManualTrendingScrape } from '@/actions/content'
import type { Reel } from '@/actions/content'

const NICHES = ['All', 'Finance', 'Fitness', 'Tech', 'Lifestyle', 'Comedy', 'E-commerce', 'Travel', 'Food']

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return String(n)
}

export default function InspirationPage() {
  const [niche, setNiche] = useState('All')
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncNotice, setSyncNotice] = useState<{ message: string; isError?: boolean } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadReels() {
    setLoading(true)
    setError(null)
    try {
      const query = niche === 'All' ? 'viral reels' : `${niche.toLowerCase()} reels`
      const { reels: data } = await searchTrendingReels(query, 5)
      setReels(data || [])
    } catch {
      setError('Failed to load reels. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReels()
  }, [niche])

  async function handleSync() {
    if (syncing) return
    setSyncing(true)
    setSyncNotice(null)
    try {
      const res = await triggerManualTrendingScrape(niche === 'All' ? undefined : niche)
      if (res.success && res.count > 0) {
        setSyncNotice({ message: `Successfully fetched ${res.count} fresh reels from Instagram!` })
        await loadReels()
      } else {
        setSyncNotice({
          message: res.message || 'Apify quota reached. Showing latest cached reels.',
          isError: !res.success,
        })
      }
    } catch (e: any) {
      setSyncNotice({
        message: e.message || 'Sync failed. Showing cached reels.',
        isError: true,
      })
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncNotice(null), 8000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Inspiration</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              24h Cron Active
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Top 5 viral reels per niche · Auto-synced daily · Cached for zero-credit instant browsing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="hairline flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-[var(--color-text)] shadow-sm transition hover:bg-[var(--color-surface)] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            title="Trigger on-demand Apify scraper"
          >
            <RotateCw className={`h-4 w-4 text-[var(--color-accent)] ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Scraping Instagram…' : 'Sync fresh reels'}</span>
          </button>
          <button className="hairline flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Sync Banner Notification */}
      {syncNotice && (
        <div
          className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition animate-in fade-in ${
            syncNotice.isError
              ? 'border border-amber-200 bg-amber-50 text-amber-800'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {syncNotice.isError ? (
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <span>{syncNotice.message}</span>
        </div>
      )}

      {/* Niche pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {NICHES.map((n) => (
          <button
            key={n}
            onClick={() => setNiche(n)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              n === niche
                ? 'bg-[var(--color-button)] text-white'
                : 'hairline bg-white text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center shadow-sm">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
          <p className="text-sm font-medium text-[var(--color-text)]">Discovering trending reels with our AI agents…</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Analyzing viral hooks and high-performing formats</p>
        </div>
      ) : error ? (
        <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <Sparkles className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-text)]">Failed to load reels</h3>
          <p className="mt-1.5 text-sm text-[var(--color-muted)]">Please try again.</p>
          <button
            onClick={() => setNiche(niche)}
            className="btn-primary mt-6 px-5 py-2.5 text-sm"
          >
            Try again
          </button>
        </div>
      ) : reels.length === 0 ? (
        <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
            <Sparkles className="h-8 w-8 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-text)]">No reels found</h3>
          <p className="mt-2 max-w-xs text-sm text-[var(--color-muted)]">
            We couldn&apos;t find trending reels for this niche right now. Try another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="hairline flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Thumbnail header */}
              <div className="relative aspect-[9/16] bg-[var(--color-surface)] overflow-hidden">
                {reel.thumbnail_url ? (
                  <img
                    src={reel.thumbnail_url}
                    alt={reel.creator_handle || 'reel'}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Sparkles className="h-10 w-10 text-[var(--color-muted)]/30" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
                  <MessageCircle className="h-3 w-3" />
                  {reel.duration_seconds ? `${reel.duration_seconds}s` : 'reel'}
                </div>
                {reel.niche && (
                  <div className="absolute right-3 top-3 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {reel.niche}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[10px] font-bold text-[var(--color-accent)]">
                      {(reel.creator_handle || '?')[0].toUpperCase()}
                    </div>
                    <span className="truncate text-sm font-semibold text-[var(--color-text)]">
                      @{reel.creator_handle || 'creator'}
                    </span>
                  </div>
                  {reel.engagement_rate > 0 && (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {(reel.engagement_rate * 100).toFixed(1)}% ER
                    </span>
                  )}
                </div>

                {reel.hook_text && (
                  <div className="rounded-xl bg-[var(--color-surface)] p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">Hook</p>
                    <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-[var(--color-text)]">
                      &ldquo;{reel.hook_text}&rdquo;
                    </p>
                  </div>
                )}

                <p className="line-clamp-2 text-xs text-[var(--color-muted)]">
                  {reel.caption || 'No caption'}
                </p>

                {/* Metrics */}
                <div className="mt-auto flex items-center gap-4 text-xs font-medium text-[var(--color-muted)] pt-2 border-t border-[var(--color-border)]/50">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    {formatCount(reel.view_count)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5" />
                    {formatCount(reel.like_count)}
                  </span>
                  <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  >
                    Watch <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Primary CTA */}
                <Link
                  href={`/dashboard/studio?url=${encodeURIComponent(reel.url)}`}
                  className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--color-button)] py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Remix in Studio
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}