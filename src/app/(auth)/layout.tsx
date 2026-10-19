import type { Metadata } from 'next'
import { Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] px-4 py-12">
      {/* Glow */}
      <div className="glow glow-coral absolute left-1/2 top-1/3 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden />
      <div className="glow glow-orange absolute right-[10%] top-2/3 h-[300px] w-[300px] opacity-40" aria-hidden />

      {/* Logo */}
      <Link href="/" className="relative z-10 mb-8 flex items-center gap-2" aria-label="instavibes home">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)]">
          <Zap className="h-5 w-5 fill-white text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-[var(--color-text)]">
          instavibes
        </span>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
