import type { Metadata } from 'next'
import { MailCheck } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'تم إنشاء الحساب | لَوَّان',
}

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo className="h-9" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MailCheck className="size-8" />
          </div>

          <h1 className="text-balance text-2xl font-extrabold text-foreground">
            تحقّق من بريدك الإلكتروني
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            أرسلنا لك رابط تأكيد إلى بريدك الإلكتروني. الرجاء فتح الرابط لتفعيل
            حسابك والبدء في رحلتك مع لَوَّان.
          </p>

          <Button
            render={<a href="/auth/login" />}
            className="mt-8 h-12 w-full rounded-xl text-base font-bold"
          >
            الذهاب لتسجيل الدخول
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          لم يصلك البريد؟ تحقّق من مجلد الرسائل غير المرغوب فيها.
        </p>
      </div>
    </main>
  )
}
