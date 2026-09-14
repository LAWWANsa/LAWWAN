'use server'

import { createClient } from '@/lib/supabase/server'

export type TrainerInterestResult = { status: 'success' } | { status: 'error'; message: string }

export async function submitTrainerInterest(input: {
  fullName: string
  phone: string
  email?: string
  city: string
  specialty: string
  experienceYears?: number
  trainingMode: 'online' | 'in_person' | 'both'
  expectedPrice?: number
  portfolioUrl?: string
  bio?: string
}): Promise<TrainerInterestResult> {
  if (!input.fullName.trim()) return { status: 'error', message: 'اكتب الاسم الكامل.' }
  if (!input.phone.trim()) return { status: 'error', message: 'اكتب رقم الجوال.' }
  if (!input.city.trim()) return { status: 'error', message: 'اكتب المدينة.' }
  if (!input.specialty.trim()) return { status: 'error', message: 'اكتب المجال الفني أو الموسيقي.' }
  if (input.experienceYears !== undefined && (input.experienceYears < 0 || input.experienceYears > 60)) return { status: 'error', message: 'سنوات الخبرة غير صحيحة.' }
  if (input.expectedPrice !== undefined && input.expectedPrice < 0) return { status: 'error', message: 'السعر غير صحيح.' }

  const supabase = await createClient()
  const { error } = await supabase.from('trainer_interest_leads').insert({
    full_name: input.fullName.trim(), phone: input.phone.trim(), email: input.email?.trim() || null,
    city: input.city.trim(), specialty: input.specialty.trim(), experience_years: input.experienceYears ?? null,
    training_mode: input.trainingMode, expected_price: input.expectedPrice ?? null,
    portfolio_url: input.portfolioUrl?.trim() || null, bio: input.bio?.trim() || null,
  })
  if (error) {
    console.log('[lawwan] trainer interest error:', error.message)
    return { status: 'error', message: 'تعذّر تسجيل الطلب حالياً. حاول مرة أخرى.' }
  }
  return { status: 'success' }
}
