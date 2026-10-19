import type { Metadata } from 'next'
import { Brain, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type ContentBrain = Database['public']['Tables']['content_brains']['Row']

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Content Brain' }

export default async function BrainPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let brain: ContentBrain | null = null
  if (user) {
    const { data } = await supabase.from('content_brains').select('*').eq('user_id', user.id).single()
    brain = data
  }

  const toneList = (brain?.tone as string[] | undefined) ?? []
  const topicsList = (brain?.topics as string[] | undefined) ?? []
  const hooksList = (brain?.hooks_style as string[] | undefined) ?? []

  const isEmpty = !brain || (toneList.length === 0 && topicsList.length === 0)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Content Brain</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Everything instavibes knows about your voice</p>
        </div>
        {!isEmpty && (
          <a href="/onboarding" className="hairline flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)]">
            <Pencil className="h-4 w-4" /> Re-train Brain
          </a>
        )}
      </div>

      {isEmpty || !brain ? (
        <div className="hairline flex flex-col items-center justify-center rounded-2xl bg-white py-24 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-base font-semibold text-[var(--color-text)]">Your Brain is empty</h3>
          <p className="mt-2 max-w-xs text-sm text-[var(--color-muted)]">
            Add your Instagram handle in Settings to let instavibes learn your voice from your existing reels.
          </p>
          <a href="/onboarding" className="btn-primary mt-6 inline-flex gap-2 px-6 py-2.5 text-sm">
            Set up your Content Brain →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {[
            { label: 'Tone', value: toneList.join(', ') },
            { label: 'Topics', value: topicsList.join(', ') },
            { label: 'Hook Styles', value: hooksList.join(', ') },
            { label: 'Audience', value: brain.audience },
            { label: 'Language', value: brain.language_preference },
          ].filter(f => Boolean(f.value)).map((field) => (
            <div key={field.label} className="hairline rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{field.label}</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-text)]">{field.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
