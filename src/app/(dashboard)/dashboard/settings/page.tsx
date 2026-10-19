import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import SettingsClient from './SettingsClient'

type Profile = Database['public']['Tables']['profiles']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: Profile | null = null
  let subscription: Subscription | null = null

  if (user) {
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    ])
    profile = p
    subscription = s
  }

  return <SettingsClient initialProfile={profile} subscription={subscription} />
}
