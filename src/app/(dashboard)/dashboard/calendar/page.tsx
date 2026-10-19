import type { Metadata } from 'next'
import { getUserScripts } from '@/actions/scripts'
import CalendarClient from './CalendarClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Content Calendar — Plan & Schedule Scripts | InstaVibes',
  description: 'Plan your Instagram reels and video shoot dates with an interactive creator calendar.',
}

export default async function CalendarPage() {
  const { scripts } = await getUserScripts()

  return <CalendarClient initialScripts={scripts || []} />
}
