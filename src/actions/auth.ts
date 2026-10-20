'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { rateLimits } from '@/lib/security/rate-limit'
import { getAppUrl, sanitizeInternalPath } from '@/lib/app-url'

export async function signInWithPassword(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()?.toLowerCase()
  const password = formData.get('password') as string
  const next = sanitizeInternalPath(formData.get('redirectTo') as string)

  if (!email || !password) {
    return { error: 'Please enter both your email and password.' }
  }

  if (email.length > 255 || password.length > 128) {
    return { error: 'Input exceeds maximum allowed length.' }
  }

  const limitCheck = rateLimits.checkAuth(email)
  if (!limitCheck.success) {
    return {
      error: `Too many login attempts. Please wait ${limitCheck.reset} seconds before trying again.`,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect(next)
}

export async function signUpWithPassword(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()?.toLowerCase()
  const password = formData.get('password') as string
  const fullName = (formData.get('fullName') as string)?.trim()
  const next = sanitizeInternalPath(formData.get('redirectTo') as string, '/onboarding')

  if (!email || !password) {
    return { error: 'Please enter both your email and password.' }
  }

  if (email.length > 255 || password.length > 128 || (fullName && fullName.length > 100)) {
    return { error: 'Input exceeds maximum allowed length.' }
  }

  const limitCheck = rateLimits.checkAuth(email)
  if (!limitCheck.success) {
    return {
      error: `Too many signup attempts. Please wait ${limitCheck.reset} seconds before trying again.`,
    }
  }

  const supabase = await createClient()
  const appUrl = await getAppUrl()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })
  if (error) return { error: error.message }

  if (!data.session) {
    return {
      error:
        'Check your email to confirm your account, then come back here to sign in.',
    }
  }

  redirect(next)
}

export async function signInWithGoogle(nextPath?: string) {
  const supabase = await createClient()
  const appUrl = await getAppUrl()
  const next = sanitizeInternalPath(nextPath, '/dashboard')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })
  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
  return { error: 'Google sign-in is not available. Use email and password, or enable Google in Supabase Auth providers.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function requestPasswordReset(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()?.toLowerCase()

  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' }
  }

  if (email.length > 255) {
    return { error: 'Email address is too long.' }
  }

  const limitCheck = rateLimits.checkPasswordReset(email)
  if (!limitCheck.success) {
    return {
      error: `Too many password reset requests for this email. Please wait ${limitCheck.reset} seconds before trying again.`,
    }
  }

  const supabase = await createClient()
  const appUrl = await getAppUrl()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' }
  }

  if (password.length > 128) {
    return { error: 'Password cannot exceed 128 characters.' }
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
