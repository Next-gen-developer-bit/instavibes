import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hasPaidAccess } from '@/lib/access'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardTopBar from '@/components/dashboard/TopBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  // If user hasn't completed onboarding, send to onboarding
  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  // Paywall: the signup placeholder trial does not unlock the studio.
  if (!hasPaidAccess(subscription)) {
    redirect('/checkout')
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#F6F6F4]">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopBar profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
