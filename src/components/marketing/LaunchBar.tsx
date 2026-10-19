'use client'

import { useEffect, useState } from 'react'

const LAUNCH_END = new Date('2026-11-06T23:59:59+05:30')

export default function LaunchBar() {
  const [time, setTime] = useState({ d: '--', h: '--', m: '--', s: '--' })

  useEffect(() => {
    function tick() {
      const diff = LAUNCH_END.getTime() - Date.now()
      if (diff <= 0) { setTime({ d: '00', h: '00', m: '00', s: '00' }); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTime({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <a
      href="#pricing"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 px-4 text-sm"
      style={{
        height: 44,
        borderBottom: '1px solid rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span className="flex items-center gap-1.5 font-semibold text-[var(--color-text)]">
        <span
          className="h-1.5 w-1.5 rounded-full pulse"
          style={{ background: 'var(--color-accent)' }}
        />
        <span className="hidden sm:inline">Launch offer is live:</span>
        <span className="sm:hidden">Launch offer:</span>
      </span>
      <span>
        <span
          className="mr-1 text-[var(--color-muted)] line-through"
          style={{ fontSize: 13 }}
        >
          $20
        </span>
        <span
          className="font-semibold"
          style={{ color: 'var(--color-accent)' }}
        >
          $10/mo
        </span>
      </span>
      <span className="text-[var(--color-muted)]" style={{ opacity: 0.5 }}>·</span>
      <span className="tabular-nums text-[var(--color-muted)]">
        <span className="hidden sm:inline">ends in </span>
        {time.d}d {time.h}h {time.m}m {time.s}s
      </span>
      <span
        className="font-semibold text-[var(--color-text)] underline-offset-4 hover:underline"
        style={{ fontSize: 13 }}
      >
        <span className="hidden sm:inline">Claim </span>›
      </span>
    </a>
  )
}
