'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { rateLimits } from '@/lib/security/rate-limit'

function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (url) return url.replace(/\/$/, '')
  return 'http://localhost:3000'
}

export async function signInWithPassword(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()?.toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please enter both your email and password.' }
  }

  if (email.length > 255 || password.length > 128) {
    return { error: 'Input exceeds maximum allowed length.' }
  }

  // Rate limit: max 10 attempts per minute per email
  const limitCheck = rateLimits.checkAuth(email)
  if (!limitCheck.success) {
    return {
      error: `Too many login attempts. Please wait ${limitCheck.reset} seconds before trying again.`,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function signUpWithPassword(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()?.toLowerCase()
  const password = formData.get('password') as string
  const fullName = (formData.get('fullName') as string)?.trim()

  if (!email || !password) {
    return { error: 'Please enter both your email and password.' }
  }

  if (email.length > 255 || password.length > 128 || (fullName && fullName.length > 100)) {
    return { error: 'Input exceeds maximum allowed length.' }
  }

  // Rate limit: max 10 attempts per minute per email
  const limitCheck = rateLimits.checkAuth(email)
  if (!limitCheck.success) {
    return {
      error: `Too many signup attempts. Please wait ${limitCheck.reset} seconds before trying again.`,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
    },
  })
  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getAppUrl()}/auth/callback`,
    },
  })
  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
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

  // Rate limit: max 3 password reset requests per 10 minutes per email
  const limitCheck = rateLimits.checkPasswordReset(email)
  if (!limitCheck.success) {
    return {
      error: `Too many password reset requests for this email. Please wait ${limitCheck.reset} seconds before trying again.`,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
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

