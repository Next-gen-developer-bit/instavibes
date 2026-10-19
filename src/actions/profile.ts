'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateProfileName(fullName: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please sign in to update your profile.' }
    }

    const trimmedName = fullName.trim()
    if (!trimmedName) {
      return { error: 'Please enter a valid name.' }
    }
    if (trimmedName.length > 100) {
      return { error: 'Name cannot exceed 100 characters.' }
    }

    const admin = createAdminClient()

    // 1. Update public.profiles table
    const { error: profileError } = await admin
      .from('profiles')
      .update({
        full_name: trimmedName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('Error updating profile in database:', profileError)
      return { error: 'Failed to update profile. Please try again.' }
    }

    // 2. Update auth user metadata so user sessions reflect the change
    try {
      await supabase.auth.updateUser({
        data: { full_name: trimmedName },
      })
    } catch (metaErr) {
      console.warn('Could not update auth user metadata:', metaErr)
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/settings')

    return { success: true }
  } catch (err) {
    console.error('updateProfileName error:', err)
    return { error: 'Failed to update profile. Please try again.' }
  }
}

export async function updateInstagramHandle(handle: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Please sign in to update your Instagram handle.' }
    }

    const cleanedHandle = handle.trim().replace(/^@+/, '')
    if (cleanedHandle.length > 50) {
      return { error: 'Instagram handle cannot exceed 50 characters.' }
    }
    const admin = createAdminClient()

    const { error: handleErr } = await admin
      .from('profiles')
      .update({
        instagram_handle: cleanedHandle || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (handleErr) {
      console.error('Error updating Instagram handle in database:', handleErr)
      return { error: 'Failed to update Instagram handle. Please try again.' }
    }

    revalidatePath('/dashboard', 'layout')
    revalidatePath('/dashboard/settings')

    return { success: true }
  } catch (err) {
    console.error('updateInstagramHandle error:', err)
    return { error: 'Failed to update Instagram handle. Please try again.' }
  }
}
