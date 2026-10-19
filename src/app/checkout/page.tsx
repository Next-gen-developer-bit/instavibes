import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CheckoutClient from './CheckoutClient'
import { getCreemConfig } from '@/lib/creem/config'

export const metadata = {
  title: 'Checkout — Start Your 3-Day Free Trial | InstaVibes',
  description: 'Complete checkout to activate your InstaVibes Pro trial and unlock your Content Brain.',
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/checkout')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('instagram_handle, full_name')
    .eq('id', user.id)
    .maybeSingle()

  const config = getCreemConfig()

  return (
    <CheckoutClient
      user={{ id: user.id, email: user.email }}
      profile={profile}
      defaultCreemUrl={config.defaultCheckoutUrl}
    />
  )
}
