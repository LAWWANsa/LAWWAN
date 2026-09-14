import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'
import { Logo } from '@/components/brand/logo'

export const metadata: Metadata = {
  title: 'تسجيل الدخول | لَوَّان',
  description: 'سجّل الدخول إلى حسابك في منصة لَوَّان.',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo className="h-9" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-foreground">
              مرحباً بعودتك
            </h1>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              سجّل الدخول لمتابعة رحلتك التدريبية.
            </p>
          </header>

          <LoginForm />
        </div>
      </div>
    </main>
  )
}
