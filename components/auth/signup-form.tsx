'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, User, Phone, Mail, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUpTrainee } from '@/app/auth/actions'
import { validateSignUp, type FieldErrors, type SignUpInput } from '@/lib/validation'

const emptyForm: SignUpInput = {
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function SignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState<SignUpInput>(emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function update(field: keyof SignUpInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    const clientErrors = validateSignUp(form)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    startTransition(async () => {
      const result = await signUpTrainee(form)
      if (result.status === 'success') {
        router.push('/auth/sign-up-success')
      } else if (result.status === 'field_errors') {
        setErrors(result.errors)
      } else {
        setFormError(result.message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field
        id="fullName"
        label="الاسم الكامل"
        icon={<User className="size-4" />}
        placeholder="محمد عبدالله"
        value={form.fullName}
        onChange={(v) => update('fullName', v)}
        error={errors.fullName}
        autoComplete="name"
      />

      <Field
        id="phone"
        label="رقم الجوال"
        icon={<Phone className="size-4" />}
        placeholder="05XXXXXXXX"
        value={form.phone}
        onChange={(v) => update('phone', v)}
        error={errors.phone}
        inputMode="tel"
        autoComplete="tel"
        dir="ltr"
        align="right"
      />

      <Field
        id="email"
        label="البريد الإلكتروني"
        icon={<Mail className="size-4" />}
        placeholder="you@example.com"
        value={form.email}
        onChange={(v) => update('email', v)}
        error={errors.email}
        type="email"
        inputMode="email"
        autoComplete="email"
        dir="ltr"
        align="right"
      />

      <PasswordField
        id="password"
        label="كلمة المرور"
        placeholder="٨ أحرف على الأقل"
        value={form.password}
        onChange={(v) => update('password', v)}
        error={errors.password}
        visible={showPassword}
        onToggle={() => setShowPassword((s) => !s)}
        autoComplete="new-password"
      />

      <PasswordField
        id="confirmPassword"
        label="تأكيد كلمة المرور"
        placeholder="أعد إدخال كلمة المرور"
        value={form.confirmPassword}
        onChange={(v) => update('confirmPassword', v)}
        error={errors.confirmPassword}
        visible={showConfirm}
        onToggle={() => setShowConfirm((s) => !s)}
        autoComplete="new-password"
      />

      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-1 h-12 w-full rounded-xl text-base font-bold"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            جارٍ إنشاء الحساب...
          </>
        ) : (
          'إنشاء الحساب'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{' '}
        <a
          href="/auth/login"
          className="font-bold text-primary underline-offset-4 hover:underline"
        >
          تسجيل الدخول
        </a>
      </p>
    </form>
  )
}

type FieldProps = {
  id: string
  label: string
  icon: React.ReactNode
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
  dir?: 'rtl' | 'ltr'
  align?: 'right' | 'left'
}

function Field({
  id,
  label,
  icon,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  inputMode,
  autoComplete,
  dir,
  align,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          dir={dir}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 rounded-xl bg-card pr-10 ${
            align === 'right' ? 'text-right placeholder:text-right' : ''
          }`}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

type PasswordFieldProps = {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  visible: boolean
  onToggle: () => void
  autoComplete?: string
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  visible,
  onToggle,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Lock className="size-4" />
        </span>
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 rounded-xl bg-card pr-10 pl-10"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
