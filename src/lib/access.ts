/**
 * A paid account is one Creem has actually started.
 * Signup inserts a placeholder `trialing` row with no subscription id, and that
 * must not unlock the studio.
 */
export function hasPaidAccess(subscription: {
  status?: string | null
  stripe_subscription_id?: string | null
} | null | undefined): boolean {
  if (!subscription?.stripe_subscription_id) return false
  return subscription.status === 'active' || subscription.status === 'trialing'
}

export type MarketingViewer = {
  isLoggedIn: boolean
  isPaid: boolean
  /** Free users go to onboarding or checkout. Paid users go to the dashboard. */
  appHref: string
  appLabel: string
}

export function marketingViewer(input: {
  userId?: string | null
  onboardingCompleted?: boolean | null
  subscription?: {
    status?: string | null
    stripe_subscription_id?: string | null
  } | null
}): MarketingViewer {
  if (!input.userId) {
    return {
      isLoggedIn: false,
      isPaid: false,
      appHref: '/sign-up',
      appLabel: 'Get started',
    }
  }

  const isPaid = hasPaidAccess(input.subscription)
  if (isPaid) {
    return {
      isLoggedIn: true,
      isPaid: true,
      appHref: '/dashboard',
      appLabel: 'Dashboard',
    }
  }

  return {
    isLoggedIn: true,
    isPaid: false,
    appHref: input.onboardingCompleted ? '/checkout' : '/onboarding',
    appLabel: 'Go to app',
  }
}
