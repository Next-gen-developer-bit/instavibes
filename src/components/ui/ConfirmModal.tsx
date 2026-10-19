'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const isDanger = variant === 'danger'

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Backdrop click */}
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!isLoading) onClose()
        }}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-black/10 text-center animate-in zoom-in-95 duration-150 z-10">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
            isDanger
              ? 'bg-red-50 text-red-600 border border-red-100 ring-4 ring-red-50/50'
              : 'bg-orange-50 text-orange-600 border border-orange-100 ring-4 ring-orange-50/50'
          }`}
        >
          {isDanger ? (
            <Trash2 className="h-6 w-6 stroke-[2.2]" />
          ) : (
            <AlertTriangle className="h-6 w-6 stroke-[2.2]" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-zinc-900 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <div className="mt-2 text-xs text-zinc-600 leading-relaxed">
          {description}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition shadow-sm active:scale-[0.98] disabled:opacity-50 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isLoading ? 'Processing…' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
