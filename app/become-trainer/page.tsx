import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Clock3, Sparkles } from 'lucide-react'
import { TrainerApplicationForm } from '@/components/lawwan/trainer-application-form'
import { SiteHeader } from '@/components/lawwan/header'

export const metadata: Metadata = {
  title: 'انضم كمدرّب | لَوَّان',
  description: 'قدّم طلبك للانضمام إلى شبكة مدربي لَوَّان.',
}

export default function BecomeTrainerPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowRight className="size-4" /> العودة للرئيسية
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <section className="rounded-[2rem] bg-primary p-7 text-primary-foreground shadow-xl sm:p-9">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10"><Sparkles className="size-6" /></div>
            <h1 className="mt-6 text-3xl font-extrabold leading-tight">حوّل مهارتك إلى تجربة يتعلمها الآخرون.</h1>
            <p className="mt-4 leading-7 text-primary-foreground/80">انضم إلى لَوَّان كمدرّب، وبعد مراجعة طلبك ومقابلة قصيرة نجهّز ملفك لتبدأ استقبال الحجوزات.</p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex gap-3"><BadgeCheck className="mt-0.5 size-5 shrink-0" /><span>ملف مدرّب احترافي بعد القبول</span></div>
              <div className="flex gap-3"><Clock3 className="mt-0.5 size-5 shrink-0" /><span>تحدد أسعارك ومواعيدك بنفسك</span></div>
              <div className="flex gap-3"><Sparkles className="mt-0.5 size-5 shrink-0" /><span>تصل إلى متعلمين مهتمين بالموسيقى والفنون</span></div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-9">
            <div className="mb-7">
              <p className="text-sm font-bold text-primary">طلب الانضمام</p>
              <h2 className="mt-1 text-2xl font-extrabold">بياناتك كمدرّب</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">خذ دقيقتين فقط. نراجع الطلب قبل تفعيل ملفك.</p>
            </div>
            <TrainerApplicationForm />
          </section>
        </div>
      </main>
    </div>
  )
}
