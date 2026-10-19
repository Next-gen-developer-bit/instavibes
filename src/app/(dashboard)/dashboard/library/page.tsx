import type { Metadata } from 'next'
import { getUserScripts, getUserSearchedReels } from '@/actions/scripts'
import LibraryClient from './LibraryClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Creator Library — Scripts, Reels & Vault | InstaVibes',
  description: 'Your saved reels, AI-generated scripts, audio links, and content history.',
}

export default async function LibraryPage() {
  const [{ scripts }, { reels }] = await Promise.all([
    getUserScripts(),
    getUserSearchedReels(),
  ])

  return (
    <LibraryClient
      initialScripts={scripts || []}
      searchedReels={reels || []}
    />
  )
}

