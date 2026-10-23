'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Link2,
  Sparkles,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  Calendar,
  CalendarDays,
  Clock,
  BookMarked,
  CheckCircle2,
  Video,
} from 'lucide-react'
import { generateScript } from '@/actions/content'
import { scheduleScript, updateScriptStatus } from '@/actions/scripts'
import type { Script } from '@/actions/content'

const LANGUAGES: { id: 'english' | 'hindi' | 'hinglish'; label: string }[] = [
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'hinglish', label: 'Hinglish' },
]

const STATUS_OPTIONS: { id: Script['status']; label: string; color: string }[] = [
  { id: 'script', label: 'Draft Script', color: 'bg-purple-100 text-purple-700' },
  { id: 'filming', label: 'To Film', color: 'bg-amber-100 text-amber-700' },
  { id: 'ready', label: 'Ready to Post', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'posted', label: 'Posted', color: 'bg-blue-100 text-blue-700' },
]

export default function StudioPage() {
  const [url, setUrl] = useState('')
  const [language, setLanguage] = useState<'english' | 'hindi' | 'hinglish'>('english')
  const [script, setScript] = useState<Script | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Scheduling states
  const [scheduledDate, setScheduledDate] = useState<string | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [customDate, setCustomDate] = useState('')
  const [scheduling, setScheduling] = useState(false)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const u = params.get('url')
      if (u) setUrl(u)
    }
  }, [])

  async function handleGenerate() {
    if (!url.trim()) {
      setError('Please paste a reel URL first.')
      return
    }
    setLoading(true)
    setError(null)
    setScript(null)
    setScheduledDate(null)
    setScheduleSuccess(false)
    try {
      const { script: result, error: err } = await generateScript({
        reelUrl: url.trim(),
        language,
      })
      if (err) {
        setError(err)
        return
      }
      if (result) {
        setScript(result)
        if (result.scheduled_date) {
          setScheduledDate(result.scheduled_date)
        }
      }
    } catch {
      setError('Failed to generate script. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    const text = [
      script?.title ? `Title: ${script.title}` : '',
      script?.hook ? `Hook: ${script.hook}` : '',
      script?.script_body ? `Script:\n${script.script_body}` : '',
      script?.on_screen_text ? `On-screen text: ${script.on_screen_text}` : '',
    ].filter(Boolean).join('\n\n')
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  async function handleSchedule(dateStr: string) {
    if (!script?.id) return
    setScheduling(true)
    try {
      const res = await scheduleScript(script.id, dateStr)
      if (res.success) {
        setScheduledDate(dateStr)
        setScheduleSuccess(true)
        setShowScheduleModal(false)
        setTimeout(() => setScheduleSuccess(false), 4000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setScheduling(false)
    }
  }

  async function handleStatusChange(newStatus: Script['status']) {
    if (!script?.id) return
    try {
      await updateScriptStatus(script.id, newStatus)
      setScript({ ...script, status: newStatus })
    } catch (err) {
      console.error(err)
    }
  }

  function getPresetDate(daysAhead: number) {
    const d = new Date()
    d.setDate(d.getDate() + daysAhead)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }


  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Content Studio</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Paste an Instagram reel and get a script in your voice — in seconds.
          </p>
        </div>
        <Link
          href="/dashboard/library"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
        >
          <BookMarked className="h-4 w-4" />
          <span>Saved Library</span>
        </Link>
      </div>

      {/* Input card */}
      <div className="hairline rounded-2xl bg-white p-6 shadow-sm">
        <label className="mb-3 block text-sm font-semibold text-[var(--color-text)]">
          Paste an Instagram reel URL
        </label>
        <div className="relative">
          <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="https://www.instagram.com/reel/..."
            className="input pl-11 pr-36"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-lg bg-[var(--color-button)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>

        {/* Language picker */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[var(--color-muted)] self-center">Write in:</span>
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className={`hairline rounded-full px-3 py-1 text-xs font-semibold transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] ${
                language === l.id
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5'
                  : 'text-[var(--color-muted)]'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Result Empty State */}
      {!script && !loading && (
        <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
            <Sparkles className="h-8 w-8 text-[var(--color-accent)]" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-text)]">No scripts yet</h3>
          <p className="mt-2 max-w-sm text-sm text-[var(--color-muted)]">
            Paste an Instagram reel URL above and click Generate to create your first script.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2 text-xs text-[var(--color-muted)]">
            <span className="font-medium">Or browse trending reels →</span>
            <Link
              href="/dashboard/inspiration"
              className="flex items-center gap-1 font-semibold text-[var(--color-accent)] hover:underline underline-offset-4"
            >
              Open Inspiration feed <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-sm">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
            <Sparkles className="h-8 w-8 animate-pulse text-[var(--color-accent)]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--color-accent)]"></span>
            </span>
          </div>
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            Please wait, our AI agents are working on it…
          </h3>
          <p className="mt-2 max-w-sm text-sm text-[var(--color-muted)]">
            Analyzing video dynamics, audience psychology, and generating your high-converting script.
          </p>
        </div>
      )}

      {/* Generated Script Result */}
      {script && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Scheduling confirmation banner */}
          {scheduleSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Script added to calendar for {scheduledDate}!</span>
              </div>
              <Link
                href="/dashboard/calendar"
                className="font-bold underline hover:text-emerald-950 flex items-center gap-1"
              >
                View on Calendar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--color-text)]">Your script</h2>
              {/* Status Selector */}
              <select
                value={script.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="text-xs font-semibold rounded-lg border border-black/10 bg-white px-2.5 py-1 text-[var(--color-text)] cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* Schedule to Calendar Button */}
              <div className="relative">
                <button
                  onClick={() => setShowScheduleModal(!showScheduleModal)}
                  className={`hairline flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    scheduledDate
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'text-[var(--color-text)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  <span>
                    {scheduledDate
                      ? `Scheduled: ${new Date(scheduledDate + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}`
                      : 'Add to Calendar'}
                  </span>
                </button>

                {/* Schedule Quick Picker Dropdown */}
                {showScheduleModal && (
                  <div className="absolute right-0 top-full mt-2 z-20 w-64 rounded-2xl bg-white border border-black/10 p-4 shadow-xl">
                    <p className="text-xs font-bold text-[var(--color-text)] mb-2 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                      Plan shoot date:
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <button
                        onClick={() => handleSchedule(getPresetDate(0))}
                        disabled={scheduling}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-surface)] font-medium text-[var(--color-text)] flex justify-between"
                      >
                        <span>Today</span>
                        <span className="text-[var(--color-muted)]">{getPresetDate(0)}</span>
                      </button>
                      <button
                        onClick={() => handleSchedule(getPresetDate(1))}
                        disabled={scheduling}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-surface)] font-medium text-[var(--color-text)] flex justify-between"
                      >
                        <span>Tomorrow</span>
                        <span className="text-[var(--color-muted)]">{getPresetDate(1)}</span>
                      </button>
                      <button
                        onClick={() => handleSchedule(getPresetDate(3))}
                        disabled={scheduling}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-surface)] font-medium text-[var(--color-text)] flex justify-between"
                      >
                        <span>In 3 Days</span>
                        <span className="text-[var(--color-muted)]">{getPresetDate(3)}</span>
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-black/5">
                      <label className="block text-[11px] font-semibold text-[var(--color-muted)] mb-1">
                        Pick custom date:
                      </label>
                      <input
                        type="date"
                        min={getPresetDate(0)}
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full text-xs rounded-lg border border-black/10 px-2 py-1 mb-2"
                      />
                      <button
                        onClick={() => customDate && handleSchedule(customDate)}
                        disabled={!customDate || scheduling}
                        className="w-full rounded-lg bg-[var(--color-button)] py-1.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                      >
                        {scheduling ? 'Scheduling…' : 'Confirm Date'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Copy Script */}
              <button
                onClick={handleCopy}
                className="hairline flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>

              {/* View in Library */}
              <Link
                href="/dashboard/library"
                className="hairline flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                <BookMarked className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Library</span>
              </Link>
            </div>
          </div>

          {/* Title */}
          {script.title && (
            <div className="hairline rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Title</p>
              <p className="mt-1 font-bold text-[var(--color-text)]">{script.title}</p>
            </div>
          )}

          {/* Core idea */}
          {script.idea && (
            <div className="hairline rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Core idea</p>
              <p className="mt-1 text-sm text-[var(--color-text)]">{script.idea}</p>
            </div>
          )}

          {/* Hook */}
          {script.hook && (
            <div className="hairline rounded-2xl bg-[var(--color-accent)]/5 p-5 shadow-sm border-l-4 border-l-[var(--color-accent)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">Hook (first 3 seconds)</p>
              <p className="mt-1 font-semibold text-[var(--color-text)] text-base">{script.hook}</p>
            </div>
          )}

          {/* Script Body */}
          {script.script_body && (
            <div className="hairline rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Full Script</p>
                <span className="text-[11px] text-[var(--color-muted)] flex items-center gap-1">
                  <Video className="h-3 w-3" /> Camera Ready
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text)] font-sans">
                {script.script_body}
              </pre>
            </div>
          )}

          {/* On-screen text */}
          {script.on_screen_text && (
            <div className="hairline rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">On-screen text suggestions</p>
              <p className="mt-1 text-sm text-[var(--color-text)]">{script.on_screen_text}</p>
            </div>
          )}

          {/* Tags */}
          {Array.isArray(script.tags) && (script.tags as string[]).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(script.tags as string[]).map((t, i) => (
                <span key={i} className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-xs text-[var(--color-muted)]">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}