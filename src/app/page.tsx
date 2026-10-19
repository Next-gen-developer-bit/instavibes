import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/marketing/Navbar'
import LaunchBar from '@/components/marketing/LaunchBar'
import Hero from '@/components/marketing/Hero'
import HowItWorks from '@/components/marketing/HowItWorks'
import FeaturesGrid from '@/components/marketing/FeaturesGrid'
import Pricing from '@/components/marketing/Pricing'
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

  // 2. If user is logged in, show dashboard only
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  // 3. Logged-out users see public landing page
  return (
    <>
      <LaunchBar />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturesGrid />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
