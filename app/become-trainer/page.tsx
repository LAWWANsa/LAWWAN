import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Clock3, Sparkles } from 'lucide-react'
import { TrainerInterestForm } from '@/components/lawwan/trainer-interest-form'
import { ValidationBanner } from '@/components/lawwan/validation-banner'
import { SiteHeader } from '@/components/lawwan/header'

export const metadata: Metadata = {
  title: 'انضم كمدرّب | لَوَّان',
  description: 'قدّم طلبك للانضمام إلى شبكة مدربي لَوَّان.',
}

export default function BecomeTrainerPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <ValidationBanner />
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowRight className="size-4" /> العودة للرئيسية</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <section className="rounded-[2rem] bg-primary p-7 text-primary-foreground shadow-xl sm:p-9">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10"><Sparkles className="size-6" /></div>
            <h1 className="mt-6 text-3xl font-extrabold leading-tight">كن من أوائل مدربي لَوَّان.</h1>
            <p className="mt-4 leading-7 text-primary-foreground/80">نحن نختبر فكرة لَوَّان حاليًا مع مجموعة أولية من الفنانين والمدربين في السعودية. سجّل اهتمامك، وسنتواصل معك لمعرفة رأيك واحتياجك.</p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex gap-3"><BadgeCheck className="mt-0.5 size-5 shrink-0" /><span>التسجيل مجاني في المرحلة التجريبية</span></div>
              <div className="flex gap-3"><Clock3 className="mt-0.5 size-5 shrink-0" /><span>دقيقتان تقريبًا لتسجيل بياناتك</span></div>
              <div className="flex gap-3"><Sparkles className="mt-0.5 size-5 shrink-0" /><span>هدفنا الوصول إلى أول 30–50 مدربًا مهتمًا</span></div>
            </div>
          </section>
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-9">
            <div className="mb-7"><p className="text-sm font-bold text-primary">تسجيل اهتمام</p><h2 className="mt-1 text-2xl font-extrabold">بياناتك كفنان أو مدرّب</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">لا تحتاج إلى إنشاء حساب الآن. نحتاج معلومات بسيطة لفهم مجتمع المدربين المحتملين.</p></div>
            <TrainerInterestForm />
          </section>
        </div>
      </main>
    </div>
  )
}
