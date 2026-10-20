import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { marketingViewer } from '@/lib/access'
import Navbar from '@/components/marketing/Navbar'
import LaunchBar from '@/components/marketing/LaunchBar'
import Hero from '@/components/marketing/Hero'
import HowItWorks from '@/components/marketing/HowItWorks'
import FeaturesGrid from '@/components/marketing/FeaturesGrid'
import Pricing from '@/components/marketing/Pricing'
import NativeLanguage from '@/components/marketing/NativeLanguage'
import FAQ from '@/components/marketing/FAQ'
import FinalCTA from '@/components/marketing/FinalCTA'
import Footer from '@/components/marketing/Footer'

interface HomePageProps {
  searchParams?: Promise<{ code?: string; next?: string }>
}

export default async function HomePage(props: HomePageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {}

  // 1. If arriving from OAuth with code on root path, forward to callback
  if (searchParams?.code) {
    redirect(`/auth/callback?code=${encodeURIComponent(searchParams.code)}`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let onboardingCompleted = false
  let subscription: { status: string | null; stripe_subscription_id: string | null } | null = null

  if (user) {
    const [{ data: profile }, { data: sub }] = await Promise.all([
      supabase.from('profiles').select('onboarding_completed').eq('id', user.id).maybeSingle(),
      supabase.from('subscriptions').select('status, stripe_subscription_id').eq('user_id', user.id).maybeSingle(),
    ])
    onboardingCompleted = Boolean(profile?.onboarding_completed)
    subscription = sub
  }

  const viewer = marketingViewer({
    userId: user?.id,
    onboardingCompleted,
    subscription,
  })

  return (
    <>
      <LaunchBar />
      <Navbar viewer={viewer} />
      <main>
        <Hero viewer={viewer} />
        <HowItWorks />
        <FeaturesGrid />
        <NativeLanguage />
        <Pricing viewer={viewer} />
        <FAQ />
        <FinalCTA viewer={viewer} />
      </main>
      <Footer />
    </>
  )
}
