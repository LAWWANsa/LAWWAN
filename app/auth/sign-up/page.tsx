import type { Metadata } from 'next'
import { SignUpForm } from '@/components/auth/signup-form'
import { BrandPanel } from '@/components/auth/brand-panel'
import { Logo } from '@/components/brand/logo'

export const metadata: Metadata = {
  title: 'إنشاء حساب متدرب | لَوَّان',
  description: 'انضم إلى لَوَّان وابدأ رحلتك التدريبية مع نخبة من المدربين.',
}

export default function SignUpPage() {
  return (
    <main className="flex min-h-svh flex-col lg:flex-row-reverse">
      <BrandPanel />

      <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo className="h-9" />
          </div>

          <header className="mb-8">
            <h1 className="text-pretty text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              إنشاء حساب متدرب
            </h1>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              أنشئ حسابك للوصول إلى برامج تدريبية وجلسات إرشاد مصمّمة لتطويرك.
            </p>
          </header>

          <SignUpForm />

          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
            بإنشائك للحساب فإنك توافق على{' '}
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              شروط الاستخدام
            </a>{' '}
            و
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              {' '}
              سياسة الخصوصية
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
