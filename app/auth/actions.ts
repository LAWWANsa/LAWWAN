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
