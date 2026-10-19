'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
  Trash2,
  Video,
  Instagram,
  Flame,
  ArrowRight,
  Lock,
} from 'lucide-react'
import {
  scheduleScript,
  updateScriptStatus,
  deleteScript,
  createManualScript,
  type ScriptWithReel,
} from '@/actions/scripts'
import ConfirmModal from '@/components/ui/ConfirmModal'
import Toast, { type ToastMessage } from '@/components/ui/Toast'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  idea: { label: 'Idea', badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-200', dotClass: 'bg-zinc-400' },
  hook: { label: 'Hook', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200', dotClass: 'bg-amber-500' },
  script: { label: 'Scripted', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200', dotClass: 'bg-purple-500' },
  filming: { label: 'To Film', badgeClass: 'bg-orange-100 text-orange-800 border-orange-200', dotClass: 'bg-orange-500' },
  ready: { label: 'Ready to Post', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200', dotClass: 'bg-emerald-500' },
  posted: { label: 'Published', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200', dotClass: 'bg-blue-500' },
}

interface CalendarClientProps {
  initialScripts: ScriptWithReel[]
}

export default function CalendarClient({ initialScripts }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scripts, setScripts] = useState<ScriptWithReel[]>(initialScripts)
  const [selectedScript, setSelectedScript] = useState<ScriptWithReel | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDayForNew, setSelectedDayForNew] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

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

  // Today reference
  const getTodayStr = () => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const todayStr = getTodayStr()

  const todayMidnight = new Date()
  todayMidnight.setHours(0, 0, 0, 0)

  // New script form state
  const [newTitle, setNewTitle] = useState('')
  const [newHook, setNewHook] = useState('')
  const [newBody, setNewBody] = useState('')
  const [newDate, setNewDate] = useState(todayStr)
  const [newLanguage, setNewLanguage] = useState<'english' | 'hindi' | 'hinglish'>('english')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() // 0-indexed
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const cells = Array.from({ length: firstDayIndex + totalDays }, (_, i) => {
    if (i < firstDayIndex) return null
    return i - firstDayIndex + 1
  })

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Filter scripts for this month
  const scheduledScripts = scripts.filter((s) => s.scheduled_date)
  const unscheduledScripts = scripts.filter((s) => !s.scheduled_date)

  // Map scripts by date (YYYY-MM-DD)
  const scriptsByDate = new Map<string, ScriptWithReel[]>()
  for (const s of scheduledScripts) {
    if (!s.scheduled_date) continue
    const dateKey = s.scheduled_date.slice(0, 10)
    if (!scriptsByDate.has(dateKey)) {
      scriptsByDate.set(dateKey, [])
    }
    scriptsByDate.get(dateKey)!.push(s)
  }

  const handleUpdateStatus = (scriptId: string, status: any) => {
    startTransition(async () => {
      await updateScriptStatus(scriptId, status)
      setScripts((prev) =>
        prev.map((s) => (s.id === scriptId ? { ...s, status } : s))
      )
      if (selectedScript?.id === scriptId) {
        setSelectedScript((prev) => (prev ? { ...prev, status } : null))
      }
      showToast(`Status updated to ${STATUS_CONFIG[status]?.label || status}`, 'info')
    })
  }

  const handleReschedule = (scriptId: string, dateStr: string | null) => {
    if (dateStr && dateStr < todayStr) {
      showToast('Cannot schedule for a past date. Please choose today or a future date.', 'error')
      return
    }
    startTransition(async () => {
      await scheduleScript(scriptId, dateStr)
      setScripts((prev) =>
        prev.map((s) => (s.id === scriptId ? { ...s, scheduled_date: dateStr } : s))
      )
      if (selectedScript?.id === scriptId) {
        setSelectedScript((prev) => (prev ? { ...prev, scheduled_date: dateStr } : null))
      }
      showToast(dateStr ? `Shoot date scheduled for ${dateStr}` : 'Date unscheduled', 'success')
    })
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
      if (selectedScript?.id === scriptId) {
        setSelectedScript(null)
      }
      setDeleteModal(null)
      showToast('Script deleted successfully', 'success')
    })
  }

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBody.trim()) return

    if (newDate && newDate < todayStr) {
      showToast('Please select today or a future date.', 'error')
      return
    }

    startTransition(async () => {
      const res = await createManualScript({
        title: newTitle,
        hook: newHook,
        script_body: newBody,
        scheduled_date: newDate || null,
        language: newLanguage,
        status: 'script',
      })

      if (res.script) {
        setScripts((prev) => [res.script as ScriptWithReel, ...prev])
        setShowAddModal(false)
        showToast(
          newDate
            ? `Script scheduled for ${newDate}!`
            : 'Script added to unscheduled queue!',
          'success'
        )
        setNewTitle('')
        setNewHook('')
        setNewBody('')
        setNewDate(todayStr)
      } else if (res.error) {
        showToast(res.error, 'error')
      }
    })
  }

  const handleCopyScript = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast('Script copied to clipboard!', 'info')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  // Monthly stats
  const scheduledCount = scheduledScripts.length
  const readyCount = scheduledScripts.filter((s) => s.status === 'ready').length
  const postedCount = scheduledScripts.filter((s) => s.status === 'posted').length

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--color-text)] flex items-center gap-2.5">
            <CalendarDays className="h-7 w-7 text-[var(--color-accent)]" />
            Content Calendar
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Schedule shooting dates and track reel production across your workflow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/studio"
            className="flex items-center gap-2 rounded-xl bg-[var(--color-surface)] border border-black/8 px-4 py-2.5 text-xs font-bold text-[var(--color-text)] hover:bg-black/5 transition"
          >
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" />
            <span>Generate in Studio</span>
          </Link>

          <button
            onClick={() => {
              setNewDate(todayStr)
              setShowAddModal(true)
            }}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-button)] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Plan New Script</span>
          </button>
        </div>
      </div>

      {/* Cadence Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
            Total Scheduled
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[var(--color-text)]">
              {scheduledCount}
            </span>
            <span className="text-xs text-[var(--color-muted)]">scripts</span>
          </div>
        </div>

        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
            To Film
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-600">
              {scheduledScripts.filter((s) => s.status === 'filming').length}
            </span>
            <span className="text-xs text-[var(--color-muted)]">shoots</span>
          </div>
        </div>

        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Ready to Post
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">
              {readyCount}
            </span>
            <span className="text-xs text-[var(--color-muted)]">reels</span>
          </div>
        </div>

        <div className="rounded-2xl border border-black/8 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            Published
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600">
              {postedCount}
            </span>
            <span className="text-xs text-[var(--color-muted)]">posted</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar (8 cols) + Unscheduled Queue (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Card */}
        <div className="lg:col-span-8 rounded-3xl border border-black/8 bg-white shadow-sm overflow-hidden">
          {/* Month Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[var(--color-text)]">
                {monthName}
              </h2>
              <button
                onClick={goToToday}
                className="rounded-lg bg-[var(--color-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] transition cursor-pointer"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="rounded-lg border border-black/10 p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextMonth}
                className="rounded-lg border border-black/10 p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50">
            {DAYS.map((d) => (
              <div
                key={d}
                className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="min-h-[110px] border-b border-r border-[var(--color-border)] bg-[var(--color-surface)]/30 p-1.5"
                  />
                )
              }

              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayScripts = scriptsByDate.get(dateKey) || []
              const cellDate = new Date(year, month, day)
              cellDate.setHours(0, 0, 0, 0)
              const isPast = cellDate.getTime() < todayMidnight.getTime()
              const isToday =
                new Date().getFullYear() === year &&
                new Date().getMonth() === month &&
                new Date().getDate() === day

              return (
                <div
                  key={dateKey}
                  onClick={() => {
                    if (isPast) return
                    setNewDate(dateKey)
                    setShowAddModal(true)
                  }}
                  className={`group relative min-h-[110px] border-b border-r border-[var(--color-border)] p-1.5 transition ${
                    isPast
                      ? 'bg-zinc-100/70 opacity-40 blur-[0.45px] select-none cursor-not-allowed'
                      : isToday
                      ? 'bg-orange-50/25 hover:bg-orange-50/40 cursor-pointer'
                      : 'hover:bg-[var(--color-surface)]/50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isToday
                          ? 'bg-[var(--color-accent)] text-white shadow-sm'
                          : isPast
                          ? 'text-zinc-400 font-medium'
                          : 'text-[var(--color-text)]'
                      }`}
                    >
                      {day}
                    </span>

                    {isPast ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 px-1 py-0.5">
                        Passed
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setNewDate(dateKey)
                          setShowAddModal(true)
                        }}
                        className="opacity-0 group-hover:opacity-100 rounded-md p-0.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface)] transition cursor-pointer"
                        title="Add script to this day"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Scheduled Scripts List for this Day */}
                  <div className="space-y-1">
                    {dayScripts.map((s) => {
                      const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.script
                      return (
                        <div
                          key={s.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedScript(s)
                          }}
                          className={`rounded-lg border px-2 py-1 text-[11px] font-semibold truncate cursor-pointer transition hover:scale-[1.02] shadow-xs flex items-center gap-1.5 ${cfg.badgeClass} ${
                            isPast ? 'opacity-85 pointer-events-auto' : ''
                          }`}
                          title={isPast ? 'Shoot date passed — click to inspect' : undefined}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dotClass}`} />
                          <span className="truncate">{s.title || s.hook || 'Untitled Script'}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Unscheduled Queue Sidebar (4 cols on large screens) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--color-accent)]" />
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  Unscheduled Queue
                </h3>
              </div>
              <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-xs font-bold text-[var(--color-muted)]">
                {unscheduledScripts.length}
              </span>
            </div>

            <p className="mt-2 text-xs text-[var(--color-muted)] leading-relaxed">
              Scripts waiting for a shoot date. Assign today or a future date to schedule.
            </p>

            <div className="mt-4 space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {unscheduledScripts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 p-6 text-center text-xs text-[var(--color-muted)]">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-500 mb-2" />
                  <p className="font-semibold text-[var(--color-text)]">All Caught Up!</p>
                  <p className="mt-1">Every generated script is scheduled on your calendar.</p>
                </div>
              ) : (
                unscheduledScripts.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-2xl border border-black/8 bg-[var(--color-surface)]/40 p-3.5 transition hover:border-[var(--color-accent)]/40 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        onClick={() => setSelectedScript(s)}
                        className="text-xs font-bold text-[var(--color-text)] line-clamp-1 hover:text-[var(--color-accent)] cursor-pointer"
                      >
                        {s.title || s.hook || 'Generated Script'}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] shrink-0">
                        {s.language}
                      </span>
                    </div>

                    {s.hook && (
                      <p className="text-[11px] text-[var(--color-muted)] line-clamp-2 italic">
                        &quot;{s.hook}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setSelectedScript(s)}
                        className="text-[11px] font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer"
                      >
                        Inspect
                      </button>

                      <div className="flex items-center gap-1.5">
                        <label className="text-[10px] font-bold text-[var(--color-muted)]">Date:</label>
                        <input
                          type="date"
                          min={todayStr}
                          onChange={(e) => {
                            if (e.target.value) handleReschedule(s.id, e.target.value)
                          }}
                          className="text-[10px] rounded-lg border border-black/15 bg-white px-2 py-1 cursor-pointer text-[var(--color-text)]"
                          title="Schedule for date"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Script Inspector Drawer / Modal */}
      {selectedScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-black/10 overflow-hidden">
            {/* Modal Header */}
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

            {/* Modal Scrollable Body */}
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

              {/* Hook Box */}
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

              {/* Full Script */}
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

              {/* On Screen Text */}
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

              {/* Source Reel Info if present */}
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

              {/* Workflow Status Selector */}
              <div className="flex items-center justify-between rounded-2xl border border-black/8 p-3.5">
                <span className="text-xs font-semibold text-[var(--color-text)]">
                  Production Status:
                </span>
                <select
                  value={selectedScript.status}
                  onChange={(e) => handleUpdateStatus(selectedScript.id, e.target.value)}
                  className="text-xs font-bold rounded-xl border border-black/10 bg-white px-3 py-1.5 text-[var(--color-text)] cursor-pointer"
                >
                  <option value="script">Scripted</option>
                  <option value="filming">To Film</option>
                  <option value="ready">Ready to Post</option>
                  <option value="posted">Published</option>
                </select>
              </div>

              {/* Schedule Date Change */}
              <div className="flex items-center justify-between rounded-2xl border border-black/8 p-3.5">
                <span className="text-xs font-semibold text-[var(--color-text)]">
                  Scheduled Shoot Date:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    min={todayStr}
                    value={selectedScript.scheduled_date ? selectedScript.scheduled_date.slice(0, 10) : ''}
                    onChange={(e) => handleReschedule(selectedScript.id, e.target.value || null)}
                    className="text-xs font-medium rounded-xl border border-black/10 bg-white px-3 py-1.5 text-[var(--color-text)]"
                  />
                  {selectedScript.scheduled_date && (
                    <button
                      onClick={() => handleReschedule(selectedScript.id, null)}
                      className="text-xs text-red-500 hover:underline font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopyScript(
                      `${selectedScript.title ? `Title: ${selectedScript.title}\n\n` : ''}${
                        selectedScript.hook ? `Hook: ${selectedScript.hook}\n\n` : ''
                      }${selectedScript.script_body || ''}`
                    )
                  }
                  className="flex items-center gap-1.5 rounded-xl bg-white border border-black/10 px-4 py-2 text-xs font-bold text-[var(--color-text)] hover:bg-[var(--color-surface)] cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan New Script Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-black/10">
            <div className="flex items-center justify-between pb-3 border-b border-black/8">
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Plan New Script / Reel
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-[var(--color-muted)] hover:text-black cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[var(--color-text)] mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 AI Tools That Replace Your Virtual Assistant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-black/10 p-2.5 text-xs text-[var(--color-text)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text)] mb-1">
                  Hook (First 3 Seconds)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stop hiring freelancers before you watch this..."
                  value={newHook}
                  onChange={(e) => setNewHook(e.target.value)}
                  className="w-full rounded-xl border border-black/10 p-2.5 text-xs text-[var(--color-text)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--color-text)] mb-1">
                  Script Notes / Body
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Draft your bullet points or full speaking script..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full rounded-xl border border-black/10 p-2.5 text-xs text-[var(--color-text)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--color-text)] mb-1">
                    Shoot Date (Today or Future)
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-xl border border-black/10 p-2 text-xs text-[var(--color-text)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[var(--color-text)] mb-1">
                    Language
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as any)}
                    className="w-full rounded-xl border border-black/10 p-2 text-xs text-[var(--color-text)]"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="hinglish">Hinglish</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-black/10 px-4 py-2 text-xs font-semibold text-[var(--color-muted)] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[var(--color-button)] px-5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 cursor-pointer"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
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
            This will permanently remove it from your calendar and library.
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
