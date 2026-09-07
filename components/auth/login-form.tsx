'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (authError) {
        if (authError.message.toLowerCase().includes('email not confirmed')) {
          setError('لم يتم تأكيد بريدك الإلكتروني بعد. الرجاء فتح رابط التفعيل.')
        } else {
          setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.')
        }
        return
      }

      router.push('/dashboard')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email" className="text-sm font-medium">
          البريد الإلكتروني
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Mail className="size-4" />
          </span>
          <Input
            id="login-email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="h-12 rounded-xl bg-card pr-10 text-right placeholder:text-right"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password" className="text-sm font-medium">
          كلمة المرور
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="size-4" />
          </span>
          <Input
            id="login-password"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            autoComplete="current-password"
            className="h-12 rounded-xl bg-card pr-10 pl-10"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
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
            جارٍ تسجيل الدخول...
          </>
        ) : (
          'تسجيل الدخول'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{' '}
        <a
          href="/auth/sign-up"
          className="font-bold text-primary underline-offset-4 hover:underline"
        >
          إنشاء حساب
        </a>
      </p>
    </form>
  )
}
