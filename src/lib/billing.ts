import { supabase } from './supabase'

export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise'

export interface SubscriptionPlan {
  id: PlanType
  name: string
  priceNGN: number
  priceUSD: number
  features: string[]
  maxCourses: number
  maxStudents: number
  hasAI: boolean
  hasPriority: boolean
  hasAnalytics: boolean
}

export const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    priceNGN: 0,
    priceUSD: 0,
    features: ['Up to 5 courses', 'Basic notifications', 'Schedule management'],
    maxCourses: 5,
    maxStudents: 50,
    hasAI: false,
    hasPriority: false,
    hasAnalytics: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    priceNGN: 500000, // 5,000 NGN in kobo
    priceUSD: 12,
    features: ['Up to 20 courses', 'Email notifications', 'File uploads', 'Attendance tracking'],
    maxCourses: 20,
    maxStudents: 500,
    hasAI: false,
    hasPriority: false,
    hasAnalytics: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    priceNGN: 1500000, // 15,000 NGN in kobo
    priceUSD: 35,
    features: ['Unlimited courses', 'Push notifications', 'AI summaries', 'Video management', 'Grade analytics', 'Priority support'],
    maxCourses: 999,
    maxStudents: 9999,
    hasAI: true,
    hasPriority: true,
    hasAnalytics: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceNGN: 5000000, // 50,000 NGN in kobo
    priceUSD: 120,
    features: ['Everything in Pro', 'Custom branding', 'API access', 'Dedicated support', 'SLA guarantee', 'Multi-campus'],
    maxCourses: 999,
    maxStudents: 99999,
    hasAI: true,
    hasPriority: true,
    hasAnalytics: true,
  },
]

// Get user's current subscription
export async function getCurrentSubscription(userId: string) {
  const { data, error } = await supabase
    .from('billing_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

// Check if a feature is enabled for user's plan
export function hasFeature(subscription: any, feature: string): boolean {
  const plan = plans.find(p => p.id === (subscription?.plan || 'free'))
  if (!plan) return false
  
  switch (feature) {
    case 'ai': return plan.hasAI
    case 'priority': return plan.hasPriority
    case 'analytics': return plan.hasAnalytics
    case 'notifications': return true
    case 'file_uploads': return plan.id !== 'free'
    case 'video_management': return plan.id === 'pro' || plan.id === 'enterprise'
    case 'custom_branding': return plan.id === 'enterprise'
    case 'api_access': return plan.id === 'enterprise'
    default: return true
  }
}

// Get plan limits
export function getPlanLimits(subscription: any) {
  const plan = plans.find(p => p.id === (subscription?.plan || 'free'))
  return {
    maxCourses: plan?.maxCourses || 5,
    maxStudents: plan?.maxStudents || 50,
    hasAI: plan?.hasAI || false,
    hasPriority: plan?.hasPriority || false,
    hasAnalytics: plan?.hasAnalytics || false,
  }
}

// Create subscription record after payment
export async function createSubscription(
  userId: string,
  plan: PlanType,
  paymentMethod: string,
  transactionId: string,
  currency: string,
  amount: number,
  expiresAt?: string
) {
  const { error } = await supabase.from('billing_subscriptions').insert({
    user_id: userId,
    plan,
    payment_method: paymentMethod,
    transaction_id: transactionId,
    status: 'active',
    currency,
    amount,
    starts_at: new Date().toISOString(),
    expires_at: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })
  if (error) throw error
}

// Check if subscription is active
export function isSubscriptionActive(subscription: any): boolean {
  if (!subscription) return false
  if (subscription.status !== 'active') return false
  if (subscription.expires_at && new Date(subscription.expires_at) < new Date()) return false
  return true
}
