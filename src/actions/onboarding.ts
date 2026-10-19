'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface OnboardingData {
  instagramHandle?: string
  tone: string[]
  language: 'english' | 'hindi' | 'hinglish'
  hookStyle: string[]
  audience?: string
  offers?: string
  topics: string[]
  formats: string[]
}

export async function completeOnboarding(data: OnboardingData) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please sign in to complete onboarding.' }
    }

    if (data.instagramHandle && data.instagramHandle.length > 50) {
      return { error: 'Instagram handle is too long.' }
    }
    if (data.audience && data.audience.length > 500) {
      return { error: 'Target audience text is too long (max 500 characters).' }
    }
    if (data.offers && data.offers.length > 500) {
      return { error: 'Offers text is too long (max 500 characters).' }
    }

    const admin = createAdminClient()

    // 1. Update profile with handle and mark onboarding as complete
    const { error: profileError } = await admin
      .from('profiles')
      .update({
        instagram_handle: data.instagramHandle || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Profile update error in onboarding:', profileError)
    }

    // 2. Upsert user Content Brain
    const { error: brainError } = await admin
      .from('content_brains')
      .upsert(
        {
          user_id: user.id,
          tone: data.tone,
          topics: data.topics,
          hooks_style: data.hookStyle,
          audience: data.audience || null,
          offers: data.offers || null,
          storytelling_patterns: data.formats,
          language_preference: data.language,
          last_analyzed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (brainError) {
      console.error('Content brain upsert error in onboarding:', brainError)
      return { error: 'Failed to save your Content Brain. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('completeOnboarding error:', err)
    return { error: 'Failed to complete onboarding. Please try again.' }
  }
}
