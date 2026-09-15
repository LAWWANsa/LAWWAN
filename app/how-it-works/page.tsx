import Link from 'next/link'
import { ArrowLeft, CalendarCheck2, MessageCircle, Search, ShieldCheck, UserRound, CreditCard } from 'lucide-react'
import { SiteHeader } from '@/components/lawwan/header'
import { ValidationBanner } from '@/components/lawwan/validation-banner'

const steps = [
  ['01', Search, 'استكشف المدربين', 'اختر المجال الذي تريد تعلمه، وتصفح ملفات المدربين وأسعارهم وطريقة تقديم الجلسات.'],
  ['02', UserRound, 'اختر مدربك', 'اطلع على خبرة المدرب وتخصصه وتقييماته والمواعيد المتاحة قبل إرسال طلب الحجز.'],
  ['03', CalendarCheck2, 'اطلب جلستك', 'اختر الموعد المناسب وطريقة الجلسة: حضوري أو أونلاين، ثم أرسل طلبك للمدرب.'],
  ['04', MessageCircle, 'تواصل وتعلّم', 'بعد قبول الطلب، تواصل مع المدرب ثم ادفع لتأكيد الجلسة والاستعداد للتعلّم في الموعد المتفق عليه.'],
]

export default function HowItWorksPage() {
  return <div className="min-h-svh bg-background" dir="rtl"><SiteHeader /><ValidationBanner /><main className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
    <div className="max-w-3xl"><p className="text-sm font-bold text-primary">كيف تعمل المنصة؟</p><h1 className="mt-2 text-4xl font-extrabold leading-tight sm:text-5xl">من أول بحث إلى أول جلسة.</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">لَوَّان مصمم ليجعل الوصول إلى مدرب مناسب وحجز جلسة خاصة تجربة واضحة وبسيطة.</p></div>
    <div className="mt-12 grid gap-4 md:grid-cols-2">{steps.map(([num, Icon, title, text]) => { const I = Icon as typeof Search; return <section key={String(num)} className="rounded-3xl border border-border bg-card p-7"><div className="flex items-center justify-between"><span className="text-sm font-extrabold text-primary">{num}</span><div className="flex size-12 items-center justify-center rounded-2xl bg-secondary"><I className="size-6" /></div></div><h2 className="mt-8 text-xl font-extrabold">{title}</h2><p className="mt-2 leading-7 text-muted-foreground">{text}</p></section> })}</div>
    <section className="mt-10 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 size-7 shrink-0" /><div><h2 className="text-2xl font-extrabold">ما الذي يحصل عليه المدرب؟</h2><p className="mt-3 max-w-2xl leading-7 text-primary-foreground/80">ملف احترافي، تحديد الأسعار والمواعيد، استقبال طلبات الحجز، والتواصل مع الطلاب في مكان واحد. في النموذج التجاري المستهدف، تحصل لَوَّان على عمولة مقابل الحجوزات التي تتم عبر المنصة.</p></div></div></section>
    <section className="mt-10 grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-border bg-card p-7"><CreditCard className="size-7 text-primary" /><h2 className="mt-4 text-xl font-extrabold">الدفع</h2><p className="mt-2 leading-7 text-muted-foreground">في النسخة التجارية المستهدفة سيتم دعم وسائل الدفع المناسبة للسوق السعودي. الدفع الحقيقي غير مفعّل في هذه المرحلة التجريبية.</p></div><div className="rounded-3xl border border-border bg-card p-7"><MessageCircle className="size-7 text-primary" /><h2 className="mt-4 text-xl font-extrabold">الحجز والتواصل</h2><p className="mt-2 leading-7 text-muted-foreground">الفكرة أن تبقى رحلة الطالب والمدرب داخل المنصة بدل تشتيت الحجز والتواصل بين عدة قنوات.</p></div></section>
    <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link href="/trainers" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">استكشف المدربين <ArrowLeft className="size-4" /></Link><Link href="/become-trainer" className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 font-bold">انضم كمدرب</Link></div>
  </main></div>
}
