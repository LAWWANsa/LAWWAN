'use server'

import { createClient } from '@/lib/supabase/server'
import {
  normalizeSaudiPhone,
  validateSignUp,
  hasErrors,
  type FieldErrors,
  type SignUpInput,
} from '@/lib/validation'

export type SignUpResult =
  | { status: 'success' }
  | { status: 'field_errors'; errors: FieldErrors }
  | { status: 'error'; message: string }

/**
 * Trainee registration.
 *
 * Runs server-side so we can (1) validate before touching Supabase,
 * (2) keep raw auth errors off the client, and (3) later fan out to the
 * existing LAWWAN backend from a single trusted place.
 */
export async function signUpTrainee(input: SignUpInput): Promise<SignUpResult> {
  const errors = validateSignUp(input)
  if (hasErrors(errors)) {
    return { status: 'field_errors', errors }
  }

  const phone = normalizeSaudiPhone(input.phone)!
  const email = input.email.trim().toLowerCase()
  const fullName = input.fullName.trim()

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      emailRedirectTo: 'https://lawwan.vercel.app/auth/callback',
      data: {
        full_name: fullName,
        phone,
        role: 'trainee',
      },
    },
  })

  if (error) {
    // Surface actionable signals; genericize credential/existence ones.
    const code = (error as { code?: string }).code
    if (code === 'user_already_exists' || error.message.includes('already registered')) {
      return {
        status: 'field_errors',
        errors: { email: 'هذا البريد الإلكتروني مسجّل مسبقاً.' },
      }
    }
    if (code === 'weak_password') {
      return {
        status: 'field_errors',
        errors: { password: 'كلمة المرور ضعيفة، الرجاء اختيار كلمة أقوى.' },
      }
    }
    if (code === 'over_email_send_rate_limit' || error.status === 429) {
      return {
        status: 'error',
        message: 'عدد كبير من المحاولات. الرجاء المحاولة بعد قليل.',
      }
    }
    console.log('[v0] signUpTrainee unexpected error:', error.message)
    return {
      status: 'error',
      message: 'تعذّر إنشاء الحساب حالياً. الرجاء المحاولة لاحقاً.',
    }
  }

  // TODO(LAWWAN backend): once the user is created (and confirmed), sync the
  // trainee profile to the existing LAWWAN API using data.user?.id here.
  void data

  return { status: 'success' }
}


export type TrainerApplicationResult =
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function submitTrainerApplication(input: {
  experienceYears: number
  instrumentOrArt: string
  portfolioUrl?: string
  specialties: string
}): Promise<TrainerApplicationResult> {
  if (!input.instrumentOrArt.trim()) return { status: 'error', message: 'اكتب المجال الذي تدرّسه.' }
  if (!input.specialties.trim()) return { status: 'error', message: 'اكتب التخصص أو المهارات التي تقدمها.' }
  if (input.experienceYears < 0 || input.experienceYears > 60) return { status: 'error', message: 'سنوات الخبرة غير صحيحة.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'سجّل دخولك أولاً للتقديم كمدرّب.' }

  const { error } = await supabase.rpc('submit_trainer_application', {
    p_experience_years: input.experienceYears,
    p_instrument_or_art: input.instrumentOrArt.trim(),
    p_portfolio_url: input.portfolioUrl?.trim() || undefined,
    p_specialties: input.specialties.trim(),
  })

  if (error) {
    if (error.message.toLowerCase().includes('already')) {
      return { status: 'error', message: 'لديك طلب مدرّب مسجّل بالفعل.' }
    }
    console.log('[lawwan] trainer application error:', error.message)
    return { status: 'error', message: 'تعذّر إرسال الطلب حالياً. حاول مرة أخرى.' }
  }

  return { status: 'success' }
}

export type TrainerActionResult = { status: 'success' } | { status: 'error'; message: string }

async function getCurrentTrainer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, trainer: null }
  const { data: trainer } = await supabase.from('trainers').select('*').eq('user_id', user.id).maybeSingle()
  return { supabase, user, trainer }
}

export async function updateTrainerProfile(input: {
  displayName: string
  bio: string
  city: string
  trainingMode: 'online' | 'in_person' | 'both'
}): Promise<TrainerActionResult> {
  const { supabase, trainer } = await getCurrentTrainer()
  if (!trainer) return { status: 'error', message: 'لا يوجد ملف مدرّب مرتبط بهذا الحساب.' }
  if (!input.displayName.trim()) return { status: 'error', message: 'اكتب اسم العرض.' }
  const { error } = await supabase.from('trainers').update({
    display_name: input.displayName.trim(), bio: input.bio.trim(), city: input.city.trim(), training_mode: input.trainingMode,
  }).eq('id', trainer.id)
  return error ? { status: 'error', message: 'تعذّر حفظ الملف الشخصي.' } : { status: 'success' }
}

export async function saveTrainerService(input: {
  serviceId?: string
  categoryId: string
  title: string
  description: string
  durationMinutes: number
  price: number
  mode: 'online' | 'in_person' | 'both'
}): Promise<TrainerActionResult> {
  const { supabase, trainer } = await getCurrentTrainer()
  if (!trainer || !trainer.verified) return { status: 'error', message: 'لا يمكنك إدارة الخدمات قبل اعتماد حسابك.' }
  if (!input.categoryId || !input.title.trim()) return { status: 'error', message: 'أكمل بيانات الخدمة.' }
  if (input.durationMinutes < 30 || input.durationMinutes > 240) return { status: 'error', message: 'مدة الحصة يجب أن تكون بين 30 و240 دقيقة.' }
  if (input.price <= 0) return { status: 'error', message: 'السعر يجب أن يكون أكبر من صفر.' }
  const payload = {
    trainer_id: trainer.id, category_id: input.categoryId, title: input.title.trim(), description: input.description.trim(),
    duration_minutes: input.durationMinutes, price: input.price, mode: input.mode, active: true,
  }
  const query = input.serviceId
    ? supabase.from('services').update(payload).eq('id', input.serviceId).eq('trainer_id', trainer.id)
    : supabase.from('services').insert(payload)
  const { error } = await query
  return error ? { status: 'error', message: 'تعذّر حفظ الخدمة. تحقق من البيانات وحاول مرة أخرى.' } : { status: 'success' }
}

export async function toggleTrainerService(serviceId: string, active: boolean): Promise<TrainerActionResult> {
  const { supabase, trainer } = await getCurrentTrainer()
  if (!trainer || !trainer.verified) return { status: 'error', message: 'غير مصرح.' }
  const { error } = await supabase.from('services').update({ active }).eq('id', serviceId).eq('trainer_id', trainer.id)
  return error ? { status: 'error', message: 'تعذّر تحديث الخدمة.' } : { status: 'success' }
}

export async function saveTrainerAvailability(slots: Array<{ weekday: number; startTime: string; endTime: string }>): Promise<TrainerActionResult> {
  const { supabase, trainer } = await getCurrentTrainer()
  if (!trainer || !trainer.verified) return { status: 'error', message: 'غير مصرح.' }
  for (const slot of slots) {
    if (slot.weekday < 0 || slot.weekday > 6 || slot.startTime >= slot.endTime) return { status: 'error', message: 'هناك فترة زمنية غير صحيحة.' }
  }
  const { error: deleteError } = await supabase.from('trainer_availability').delete().eq('trainer_id', trainer.id)
  if (deleteError) return { status: 'error', message: 'تعذّر تحديث المواعيد.' }
  if (!slots.length) return { status: 'success' }
  const { error } = await supabase.from('trainer_availability').insert(slots.map(s => ({
    trainer_id: trainer.id, weekday: s.weekday, start_time: s.startTime, end_time: s.endTime, active: true,
  })))
  return error ? { status: 'error', message: 'تعذّر حفظ المواعيد.' } : { status: 'success' }
}

export async function respondToTrainerBooking(input: { bookingId: string; action: 'accept' | 'reject'; reason?: string; note?: string }): Promise<TrainerActionResult> {
  const { supabase, trainer } = await getCurrentTrainer()
  if (!trainer || !trainer.verified) return { status: 'error', message: 'غير مصرح.' }
  if (!input.bookingId) return { status: 'error', message: 'الحجز غير صحيح.' }
  const { error } = await supabase.rpc('respond_to_booking', {
    p_booking_id: input.bookingId,
    p_action: input.action === 'accept' ? 'confirm' : 'reject',
    p_reason: input.reason?.trim() || null,
    p_note: input.note?.trim() || null,
  })
  if (error) {
    console.log('[lawwan] booking response error:', error.message)
    return { status: 'error', message: 'تعذّر تحديث الحجز. حاول مرة أخرى.' }
  }
  return { status: 'success' }
}

export async function createTraineeBooking(input: { trainerId: string; serviceId: string; start: string; mode: 'online' | 'in_person'; note?: string }): Promise<TrainerActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'سجّل دخولك أولاً لإرسال طلب الحجز.' }
  if (!input.trainerId || !input.serviceId || !input.start) return { status: 'error', message: 'اختر الخدمة والموعد.' }
  const { error } = await supabase.rpc('trainee_create_booking', {
    p_trainer_id: input.trainerId,
    p_service_id: input.serviceId,
    p_start: input.start,
    p_mode: input.mode,
    p_note: input.note?.trim() || null,
  })
  if (error) {
    console.log('[lawwan] trainee booking error:', error.message)
    return { status: 'error', message: error.message.toLowerCase().includes('available') ? 'هذا الموعد غير متاح. اختر موعداً آخر.' : 'تعذّر إرسال طلب الحجز. حاول مرة أخرى.' }
  }
  return { status: 'success' }
}

export async function createMoyasarPaymentIntent(bookingId: string): Promise<{ status: 'success'; transactionId: string } | { status: 'error'; message: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'سجّل دخولك أولاً.' }
  const { data, error } = await supabase.rpc('create_payment_intent', { p_booking_id: bookingId, p_method: 'card', p_provider: 'moyasar' })
  if (error || !data) return { status: 'error', message: error?.message || 'تعذّر تجهيز عملية الدفع.' }
  return { status: 'success', transactionId: String(data) }
}

export async function submitReview(input: { bookingId: string; rating: number; comment?: string }): Promise<TrainerActionResult> {
  if (!input.bookingId || input.rating < 1 || input.rating > 5) return { status: 'error', message: 'التقييم غير صحيح.' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'سجّل دخولك أولاً.' }
  const { error } = await supabase.rpc('submit_review', { p_booking_id: input.bookingId, p_rating: input.rating, p_comment: input.comment?.trim() || null })
  if (error) return { status: 'error', message: error.message.includes('already') ? 'تم تقييم هذه الجلسة مسبقاً.' : 'تعذّر إرسال التقييم.' }
  return { status: 'success' }
}

export async function sendChatMessage(input: { bookingId: string; body: string }): Promise<{status:'success';id:string}|{status:'error';message:string}> {
  if (!input.bookingId || !input.body.trim()) return { status:'error', message:'اكتب رسالة.' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status:'error', message:'سجّل دخولك أولاً.' }
  const { data, error } = await supabase.rpc('send_message', { p_booking_id: input.bookingId, p_body: input.body.trim() })
  if (error || !data) return { status:'error', message:'تعذّر إرسال الرسالة.' }
  return { status:'success', id:String(data) }
}
