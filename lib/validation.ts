// Shared validation for LAWWAN trainee registration.
// Normalizes and validates fields on both client and server.

export type SignUpInput = {
  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

export type FieldErrors = Partial<Record<keyof SignUpInput, string>>

/**
 * Normalize a Saudi phone number to E.164 (+9665XXXXXXXX).
 * Accepts: 05XXXXXXXX, 5XXXXXXXX, 9665XXXXXXXX, +9665XXXXXXXX.
 * Returns null when it cannot be parsed as a valid Saudi mobile number.
 */
export function normalizeSaudiPhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-()]/g, '').replace(/^\+/, '')
  let local: string | null = null

  if (/^9665\d{8}$/.test(digits)) local = digits.slice(3)
  else if (/^05\d{8}$/.test(digits)) local = digits.slice(1)
  else if (/^5\d{8}$/.test(digits)) local = digits

  if (!local) return null
  return `+966${local}`
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSignUp(input: SignUpInput): FieldErrors {
  const errors: FieldErrors = {}

  const fullName = input.fullName.trim()
  if (fullName.length < 3) {
    errors.fullName = 'الرجاء إدخال الاسم الكامل (٣ أحرف على الأقل).'
  } else if (fullName.split(/\s+/).length < 2) {
    errors.fullName = 'الرجاء إدخال الاسم الأول واسم العائلة.'
  }

  if (!normalizeSaudiPhone(input.phone)) {
    errors.phone = 'رقم جوال سعودي غير صحيح. مثال: 05XXXXXXXX'
  }

  if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = 'البريد الإلكتروني غير صحيح.'
  }

  if (input.password.length < 8) {
    errors.password = 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل.'
  } else if (!/[A-Za-z]/.test(input.password) || !/\d/.test(input.password)) {
    errors.password = 'كلمة المرور يجب أن تحتوي على أحرف وأرقام.'
  }

  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = 'كلمتا المرور غير متطابقتين.'
  }

  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
