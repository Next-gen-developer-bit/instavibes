'use client'

import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type?: 'success' | 'error' | 'info'
  text: string
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type
        const isError = toast.type === 'error'

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl bg-zinc-900 text-white px-4 py-3 shadow-xl border border-white/10 animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="h-4 w-4 text-orange-400 shrink-0" />}
              <span className="text-xs font-medium truncate">{toast.text}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-400 hover:text-white transition shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
