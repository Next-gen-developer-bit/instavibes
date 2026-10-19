'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  BookMarked,
  Search,
  Sparkles,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  Trash2,
  Instagram,
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  Video,
  Clock,
  Filter,
  X,
  FileText,
  History,
  TrendingUp,
} from 'lucide-react'
import {
  scheduleScript,
  updateScriptStatus,
  deleteScript,
  type ScriptWithReel,
  type SearchedReelItem,
} from '@/actions/scripts'
import ConfirmModal from '@/components/ui/ConfirmModal'
import Toast, { type ToastMessage } from '@/components/ui/Toast'

const STATUS_TABS = [
  { id: 'all', label: 'All Scripts' },
  { id: 'script', label: 'Scripted' },
  { id: 'filming', label: 'To Film' },
  { id: 'ready', label: 'Ready' },
  { id: 'posted', label: 'Published' },
]

interface LibraryClientProps {
  initialScripts: ScriptWithReel[]
  searchedReels: SearchedReelItem[]
}

export default function LibraryClient({
  initialScripts,
  searchedReels,
}: LibraryClientProps) {
  const [activeTab, setActiveTab] = useState<'scripts' | 'reels' | 'stats'>('scripts')
  const [scripts, setScripts] = useState<ScriptWithReel[]>(initialScripts)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [selectedScript, setSelectedScript] = useState<ScriptWithReel | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Scheduling state in modal
  const [scheduleModalScript, setScheduleModalScript] = useState<ScriptWithReel | null>(null)
  const [targetDate, setTargetDate] = useState('')

  // Clean Modal & Feedback state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    scriptId: string
    title: string
  } | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  // Today string for date input restriction
  const getTodayStr = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const todayStr = getTodayStr()

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      showToast('Script copied to clipboard!', 'info')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // ignore
    }
  }

  const requestDelete = (scriptId: string, title?: string) => {
    setDeleteModal({
      isOpen: true,
      scriptId,
      title: title || 'this script',
    })
  }

  const confirmDelete = () => {
    if (!deleteModal) return
    const { scriptId } = deleteModal
    startTransition(async () => {
      await deleteScript(scriptId)
      setScripts((prev) => prev.filter((s) => s.id !== scriptId))
      if (selectedScript?.id === scriptId) setSelectedScript(null)
      setDeleteModal(null)
      showToast('Script deleted successfully', 'success')
    })
  }

  const handleSaveSchedule = (scriptId: string, dateStr: string | null) => {
    if (dateStr && dateStr < todayStr) {
      showToast('Cannot schedule for a past date. Please choose today or a future date.', 'error')
      return
    }
    startTransition(async () => {
      await scheduleScript(scriptId, dateStr)
      setScripts((prev) =>
        prev.map((s) => (s.id === scriptId ? { ...s, scheduled_date: dateStr } : s))
      )
      setScheduleModalScript(null)
      showToast(dateStr ? `Shoot date scheduled for ${dateStr}` : 'Schedule cleared', 'success')
    })
  }

  const handleStatusChange = (scriptId: string, status: any) => {
    startTransition(async () => {
      await updateScriptStatus(scriptId, status)
      setScripts((prev) =>
        prev.map((s) => (s.id === scriptId ? { ...s, status } : s))
      )
      if (selectedScript?.id === scriptId) {
        setSelectedScript((prev) => (prev ? { ...prev, status } : null))
      }
      showToast(`Status updated to ${status}`, 'info')
    })
  }

  // Filter scripts
  const filteredScripts = scripts.filter((s) => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter
    const matchesLang = languageFilter === 'all' || s.language === languageFilter
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      s.title?.toLowerCase().includes(q) ||
      s.hook?.toLowerCase().includes(q) ||
      s.script_body?.toLowerCase().includes(q) ||
      (Array.isArray(s.tags) && (s.tags as string[]).some((t) => t.toLowerCase().includes(q)))

    return matchesStatus && matchesLang && matchesSearch
  })

  // Filter searched reels
  const filteredReels = searchedReels.filter((r) => {
    const q = searchQuery.toLowerCase().trim()
    return (
      !q ||
      r.url.toLowerCase().includes(q) ||
      r.creator_handle?.toLowerCase().includes(q) ||
      r.caption?.toLowerCase().includes(q)
    )
  })

  // Metrics
  const totalScripts = scripts.length
  const scheduledCount = scripts.filter((s) => s.scheduled_date).length
  const uniqueReelsCount = searchedReels.length

  function formatNumber(n?: number) {
    if (!n) return '0'
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
    return String(n)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Content Vault & Library
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            All your generated scripts, analyzed reel links, and video archives in one central hub.
          </p>
        </div>

        <Link
          href="/dashboard/studio"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-button)] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Script in Studio</span>
        </Link>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'scripts'
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Generated Scripts</span>
            <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--color-muted)]">
              {totalScripts}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'reels'
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Analyzed Reel History</span>
            <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--color-muted)]">
              {uniqueReelsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'stats'
                ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Vault Insights</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'reels' ? 'Search reel links...' : 'Search scripts, hooks...'}
            className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 py-1.5 text-xs text-[var(--color-text)] placeholder:text-[var(--color-muted)]"
          />
        </div>
      </div>

      {/* =========================================================================
          TAB 1: GENERATED SCRIPTS
      ========================================================================== */}
      {activeTab === 'scripts' && (
        <div className="space-y-4">
          {/* Subfilters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-black/8 shadow-xs">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[var(--color-accent)] text-white shadow-xs'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Language filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--color-muted)] font-medium">Language:</span>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-[var(--color-text)] cursor-pointer"
              >
                <option value="all">All Languages</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>
          </div>

          {/* Scripts Grid */}
          {filteredScripts.length === 0 ? (
            <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <BookMarked className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)]">
                No scripts found
              </h3>
              <p className="mt-1 text-xs text-[var(--color-muted)] max-w-sm">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try clearing your search query or status filter.'
                  : 'Start generating scripts in the Content Studio to populate your library.'}
              </p>
              <Link
                href="/dashboard/studio"
                className="mt-4 rounded-xl bg-[var(--color-button)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              >
                Open Studio →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScripts.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm hover:border-[var(--color-accent)]/30 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top badging */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        {s.language}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          s.status === 'ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'filming'
                            ? 'bg-orange-100 text-orange-800'
                            : s.status === 'posted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    {/* Title & Hook */}
                    <div>
                      <h3
                        onClick={() => setSelectedScript(s)}
                        className="text-sm font-bold text-[var(--color-text)] line-clamp-2 hover:text-[var(--color-accent)] cursor-pointer"
                      >
                        {s.title || s.hook || 'Untitled Script'}
                      </h3>
                      {s.hook && (
                        <p className="mt-1.5 text-xs text-[var(--color-muted)] line-clamp-2 italic bg-[var(--color-surface)]/50 p-2 rounded-lg">
                          &quot;{s.hook}&quot;
                        </p>
                      )}
                    </div>

                    {/* Scheduled Date badge */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="h-3 w-3 text-[var(--color-accent)]" />
                      {s.scheduled_date ? (
                        <span className="font-semibold text-emerald-700">
                          {new Date(s.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      ) : (
                        <span className="text-[var(--color-muted)]">Unscheduled</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedScript(s)}
                      className="text-xs font-bold text-[var(--color-accent)] hover:underline cursor-pointer"
                    >
                      Inspect →
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setTargetDate(s.scheduled_date ? s.scheduled_date.slice(0, 10) : '')
                          setScheduleModalScript(s)
                        }}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition cursor-pointer"
                        title="Schedule on Calendar"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          handleCopy(
                            s.id,
                            `${s.title ? `Title: ${s.title}\n\n` : ''}${s.hook ? `Hook: ${s.hook}\n\n` : ''}${
                              s.script_body || ''
                            }`
                          )
                        }
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition cursor-pointer"
                        title="Copy Script"
                      >
                        {copiedId === s.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => requestDelete(s.id, s.title || s.hook || 'Untitled')}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Script"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: SEARCHED & ANALYZED REELS HISTORY
      ========================================================================== */}
      {activeTab === 'reels' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Instagram Reels You&apos;ve Analyzed
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                Every viral reel link you pasted or inspected in InstaVibes. Click to generate new script versions anytime.
              </p>
            </div>
            <Link
              href="/dashboard/inspiration"
              className="text-xs font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1"
            >
              Browse Viral Feed <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {filteredReels.length === 0 ? (
            <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <Instagram className="h-7 w-7 text-[#E1306C]" />
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)]">
                No analyzed reels yet
              </h3>
              <p className="mt-1 text-xs text-[var(--color-muted)] max-w-sm">
                Paste any Instagram reel URL into the Content Studio to break down its viral hooks and generate scripts.
              </p>
              <Link
                href="/dashboard/studio"
                className="mt-4 rounded-xl bg-[var(--color-button)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              >
                Analyze a Reel Now →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReels.map((reel, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm hover:border-[var(--color-accent)]/30 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Creator Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-xs shrink-0">
                          {reel.creator_handle ? reel.creator_handle[0]?.toUpperCase() : 'IG'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--color-text)] truncate">
                            @{reel.creator_handle || 'instagram_creator'}
                          </p>
                          {reel.creator_name && (
                            <p className="text-[10px] text-[var(--color-muted)] truncate">
                              {reel.creator_name}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="rounded-full bg-orange-50 text-orange-700 px-2.5 py-0.5 text-[10px] font-bold">
                        {reel.scripts_count} {reel.scripts_count === 1 ? 'script' : 'scripts'}
                      </span>
                    </div>

                    {/* Reel Caption */}
                    {reel.caption ? (
                      <p className="text-xs text-[var(--color-muted)] line-clamp-3 leading-relaxed">
                        {reel.caption}
                      </p>
                    ) : (
                      <p className="text-xs italic text-[var(--color-muted)]">
                        No caption provided
                      </p>
                    )}

                    {/* Engagement Metrics */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-[var(--color-muted)]">
                      <span className="flex items-center gap-1 font-semibold">
                        <Eye className="h-3 w-3 text-blue-500" />
                        {formatNumber(reel.view_count)} views
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Heart className="h-3 w-3 text-rose-500" />
                        {formatNumber(reel.like_count)}
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <MessageCircle className="h-3 w-3 text-emerald-500" />
                        {formatNumber(reel.comment_count)}
                      </span>
                    </div>
                  </div>

                  {/* Reel Actions */}
                  <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    <Link
                      href={`/dashboard/studio?reelUrl=${encodeURIComponent(reel.url)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent)] hover:underline"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Rewrite in Studio</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={reel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[#E1306C] hover:bg-rose-50 transition"
                        title="Open Reel on Instagram"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(reel.url)
                          showToast('Reel URL copied!', 'info')
                        }}
                        className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition"
                        title="Copy Reel Link"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: VAULT INSIGHTS & STATS
      ========================================================================== */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                Total Scripts Generated
              </span>
              <p className="mt-2 text-3xl font-black text-[var(--color-text)]">
                {totalScripts}
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Across English, Hindi, & Hinglish
              </p>
            </div>

            <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Scheduled Rate
              </span>
              <p className="mt-2 text-3xl font-black text-emerald-600">
                {totalScripts > 0 ? Math.round((scheduledCount / totalScripts) * 100) : 0}%
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {scheduledCount} of {totalScripts} assigned to shoot dates
              </p>
            </div>

            <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                In Production Pipeline
              </span>
              <p className="mt-2 text-3xl font-black text-orange-600">
                {scripts.filter((s) => s.status === 'filming' || s.status === 'ready').length}
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Ready to record or edit
              </p>
            </div>

            <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                Viral References
              </span>
              <p className="mt-2 text-3xl font-black text-purple-600">
                {uniqueReelsCount}
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Unique creator reels analyzed
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
              Creator Consistency Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[var(--color-muted)]">
              <div className="rounded-2xl border border-black/8 p-4 bg-[var(--color-surface)]/30 space-y-1.5">
                <span className="font-bold text-[var(--color-text)] block">
                  Aim for 3-5 Reels / Week
                </span>
                <p>
                  Schedule your shoot dates on the Calendar in batches to never run out of daily content.
                </p>
              </div>
              <div className="rounded-2xl border border-black/8 p-4 bg-[var(--color-surface)]/30 space-y-1.5">
                <span className="font-bold text-[var(--color-text)] block">
                  Keep Unscheduled Queue Low
                </span>
                <p>
                  You currently have {totalScripts - scheduledCount} unscheduled scripts. Assign dates to maintain momentum.
                </p>
              </div>
              <div className="rounded-2xl border border-black/8 p-4 bg-[var(--color-surface)]/30 space-y-1.5">
                <span className="font-bold text-[var(--color-text)] block">
                  Iterate on High Performers
                </span>
                <p>
                  Check the Analyzed Reel History tab to generate alternative hooks for angles that performed well.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Script Inspector Drawer / Modal */}
      {selectedScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-black/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--color-accent)] capitalize">
                  {selectedScript.language}
                </span>
                <span className="text-xs font-semibold text-[var(--color-muted)]">
                  {selectedScript.scheduled_date
                    ? `Shoot date: ${selectedScript.scheduled_date}`
                    : 'Unscheduled'}
                </span>
              </div>
              <button
                onClick={() => setSelectedScript(null)}
                className="rounded-lg p-1.5 text-[var(--color-muted)] hover:text-black hover:bg-black/5 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h2 className="text-xl font-black text-[var(--color-text)]">
                  {selectedScript.title || 'Untitled Script'}
                </h2>
                {selectedScript.idea && (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {selectedScript.idea}
                  </p>
                )}
              </div>

              {selectedScript.hook && (
                <div className="rounded-2xl bg-[var(--color-accent)]/5 border-l-4 border-l-[var(--color-accent)] p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                    Hook (First 3s)
                  </span>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                    {selectedScript.hook}
                  </p>
                </div>
              )}

              {selectedScript.script_body && (
                <div className="rounded-2xl border border-black/8 bg-[var(--color-surface)]/30 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    Full Speaking Script
                  </span>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text)] font-sans">
                    {selectedScript.script_body}
                  </pre>
                </div>
              )}

              {selectedScript.on_screen_text && (
                <div className="rounded-2xl border border-black/8 bg-white p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    On-Screen Text
                  </span>
                  <p className="mt-1 text-xs text-[var(--color-text)]">
                    {selectedScript.on_screen_text}
                  </p>
                </div>
              )}

              {selectedScript.source_url && (
                <div className="flex items-center justify-between rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-xs">
                  <span className="text-[var(--color-muted)] flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-[#E1306C]" />
                    Original Reel Inspiration
                  </span>
                  <a
                    href={selectedScript.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1"
                  >
                    View on Instagram <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Status picker in modal */}
              <div className="flex items-center justify-between rounded-2xl border border-black/8 p-3.5">
                <span className="text-xs font-semibold text-[var(--color-text)]">
                  Production Status:
                </span>
                <select
                  value={selectedScript.status}
                  onChange={(e) => handleStatusChange(selectedScript.id, e.target.value)}
                  className="text-xs font-bold rounded-xl border border-black/10 bg-white px-3 py-1.5 text-[var(--color-text)] cursor-pointer"
                >
                  <option value="script">Scripted</option>
                  <option value="filming">To Film</option>
                  <option value="ready">Ready to Post</option>
                  <option value="posted">Published</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-black/8 bg-[var(--color-surface)]/50">
              <button
                type="button"
                onClick={() =>
                  requestDelete(
                    selectedScript.id,
                    selectedScript.title || selectedScript.hook || 'Untitled'
                  )
                }
                className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={() =>
                  handleCopy(
                    selectedScript.id,
                    `${selectedScript.title ? `Title: ${selectedScript.title}\n\n` : ''}${
                      selectedScript.hook ? `Hook: ${selectedScript.hook}\n\n` : ''
                    }${selectedScript.script_body || ''}`
                  )
                }
                className="flex items-center gap-1.5 rounded-xl bg-white border border-black/10 px-4 py-2 text-xs font-bold text-[var(--color-text)] hover:bg-[var(--color-surface)] cursor-pointer"
              >
                {copiedId === selectedScript.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedId === selectedScript.id ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Schedule Date Modal */}
      {scheduleModalScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-black/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/8">
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[var(--color-accent)]" />
                Schedule on Calendar
              </h3>
              <button
                onClick={() => setScheduleModalScript(null)}
                className="rounded-lg p-1 text-[var(--color-muted)] hover:text-black cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--color-muted)]">
              Choose a shooting or posting date for <span className="font-bold text-[var(--color-text)]">&quot;{scheduleModalScript.title || 'Untitled'}&quot;</span>:
            </p>

            <div>
              <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                Shoot Date (Today or Future)
              </label>
              <input
                type="date"
                min={todayStr}
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-black/15 p-2.5 text-[var(--color-text)] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {scheduleModalScript.scheduled_date && (
                <button
                  onClick={() => handleSaveSchedule(scheduleModalScript.id, null)}
                  className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear Date
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setScheduleModalScript(null)}
                  className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => targetDate && handleSaveSchedule(scheduleModalScript.id, targetDate)}
                  disabled={!targetDate || isPending}
                  className="rounded-xl bg-[var(--color-button)] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
                >
                  Save Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clean Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={confirmDelete}
        title="Delete Script?"
        description={
          <span>
            Are you sure you want to delete{' '}
            <strong className="text-zinc-900 font-bold">&quot;{deleteModal?.title}&quot;</strong>?
            This will permanently remove it from your library and calendar.
          </span>
        }
        confirmText="Delete Script"
        cancelText="Cancel"
        variant="danger"
        isLoading={isPending}
      />

      {/* Toast Feedback */}
      <Toast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  )
}
