import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CheckCircle2, Sparkles, ArrowRight, Brain, Zap } from 'lucide-react'

export const metadata = {
  title: 'Welcome to InstaVibes Pro! 🎉',
  description: 'Your trial has been activated successfully.',
}

export default async function CheckoutSuccessPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ensure subscription record is active/trialing in Supabase
  try {
    const admin = createAdminClient()
    const { data: existingSub } = await admin
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!existingSub || existingSub.status !== 'active') {
      const trialEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      await admin.from('subscriptions').upsert(
        {
          user_id: user.id,
          status: 'trialing',
          billing_interval: 'month',
          trial_end: trialEnd,
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd,
        },
        { onConflict: 'user_id' }
      )
    }
  } catch (err) {
    console.error('Error confirming subscription in success page:', err)
  }

  return (
    <div className="min-h-screen bg-[#0E0F12] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-3xl bg-white/[0.04] border border-white/10 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-6 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <span className="rounded-full bg-[#FF5A36]/15 border border-[#FF5A36]/30 px-3 py-1 text-xs font-bold text-[#FF5A36]">
          Trial Activated
        </span>

        <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-white">
          Welcome to InstaVibes Pro!
        </h1>

        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          Your 3-day free trial is officially live. Your Content Brain is connected and ready to write your first viral script.
        </p>

        <div className="my-6 rounded-2xl bg-white/[0.03] border border-white/8 p-4 text-left space-y-2.5 text-xs text-white/80">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FF5A36]" />
            <span>Unlimited AI Script Studio unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            <span>Voice engine calibrated for your niche</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-400" />
            <span>Trending Outlier Radar enabled</span>
          </div>
        </div>

        <Link
          href="/dashboard/studio"
          className="w-full rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#FF8C42] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF5A36]/25 transition hover:brightness-110 flex items-center justify-center gap-2"
        >
          <span>Launch Script Studio</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
