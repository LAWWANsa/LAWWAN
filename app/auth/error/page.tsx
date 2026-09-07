import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'حدث خطأ | لَوَّان',
}

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo className="h-9" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>

          <h1 className="text-balance text-2xl font-extrabold text-foreground">
            تعذّر إكمال العملية
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            حدث خطأ غير متوقّع أثناء المصادقة. الرجاء المحاولة مرة أخرى.
          </p>

          <Button
            render={<a href="/auth/sign-up" />}
            className="mt-8 h-12 w-full rounded-xl text-base font-bold"
          >
            العودة لإنشاء الحساب
          </Button>
        </div>
      </div>
    </main>
  )
}
