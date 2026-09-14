import Link from 'next/link'
import { ArrowLeft, Check, Palette, Search, Star, Music2, Video, MapPin, ShieldCheck } from 'lucide-react'
import { SiteHeader } from '@/components/lawwan/header'
import { ValidationBanner } from '@/components/lawwan/validation-banner'
import { categories, trainers } from '@/lib/lawwan-data'

export default function Page() {
  const featured = trainers.slice(0, 4)
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <ValidationBanner />
      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-24 bottom-0 size-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-28">
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary"><span className="size-1.5 rounded-full bg-primary" /> تعلّم مهارة تحبها</div>
              <h1 className="max-w-3xl text-balance text-5xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">ابحث عن مدرّبك.<br /><span className="text-primary">واكتشف لونك مع لَوَّان.</span></h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">منصة سعودية تجمعك بمدرّبين مختصين في الموسيقى والفنون. اختر مهارتك، شاهد المدربين، واحجز الجلسة المناسبة لك.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/trainers" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/15">استكشف المدربين <ArrowLeft className="size-4" /></Link>
                <Link href="/auth/sign-up" className="inline-flex h-13 items-center justify-center rounded-xl border border-border bg-card px-6 font-bold">أنشئ حسابك مجاناً</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Check className="size-4 text-primary" /> مدربون مختارون</span><span className="flex items-center gap-2"><Check className="size-4 text-primary" /> حضوري أو أونلاين</span><span className="flex items-center gap-2"><Check className="size-4 text-primary" /> حجز مرن</span></div>
            </div>
            <div className="relative">
              <div className="rounded-[2rem] border border-border bg-card p-4 shadow-2xl shadow-foreground/5">
                <div className="rounded-[1.5rem] bg-primary p-7 text-primary-foreground">
                  <div className="flex items-center justify-between"><span className="text-sm font-medium opacity-80">جلسة اليوم</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs">أونلاين</span></div>
                  <div className="mt-14 text-3xl font-extrabold">تعلم العود من الصفر</div>
                  <div className="mt-2 opacity-80">مع نورة الحربي</div>
                  <div className="mt-8 flex items-center gap-4 border-t border-white/15 pt-5 text-sm"><span>اليوم · 7:00 م</span><span className="mr-auto rounded-lg bg-white px-3 py-2 font-bold text-primary">الدخول للجلسة</span></div>
                </div>
                <div className="grid grid-cols-3 gap-3 p-3"><div className="rounded-xl bg-secondary p-4 text-center"><Music2 className="mx-auto mb-2 size-5" /><span className="text-xs font-bold">موسيقى</span></div><div className="rounded-xl bg-secondary p-4 text-center"><Palette className="mx-auto mb-2 size-5" /><span className="text-xs font-bold">فنون</span></div><div className="rounded-xl bg-secondary p-4 text-center"><Video className="mx-auto mb-2 size-5" /><span className="text-xs font-bold">أونلاين</span></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="mb-8 flex items-end justify-between"><div><p className="text-sm font-bold text-primary">استكشف</p><h2 className="mt-1 text-3xl font-extrabold">وش ودك تتعلم؟</h2></div><Link href="/trainers" className="hidden text-sm font-bold text-primary sm:block">عرض كل المدربين ←</Link></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{categories.map((c) => <Link key={c.name} href={`/trainers?category=${encodeURIComponent(c.name)}`} className="group rounded-2xl border border-border bg-card p-4 text-center transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"><div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-secondary text-2xl">{c.icon}</div><div className="mt-3 text-sm font-bold">{c.name}</div><div className="mt-1 text-xs text-muted-foreground">{c.count} مدرب</div></Link>)}</div>
        </section>

        <section className="bg-secondary/45 py-16"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-8"><p className="text-sm font-bold text-primary">مختارون لك</p><h2 className="mt-1 text-3xl font-extrabold">مدربون مميزون</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{featured.map((t) => <TrainerCard key={t.id} trainer={t} />)}</div></div></section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="rounded-[2rem] bg-primary px-7 py-12 text-center text-primary-foreground sm:px-12"><ShieldCheck className="mx-auto size-9 opacity-90" /><h2 className="mt-4 text-3xl font-extrabold">تعلّم بطريقة تناسبك</h2><p className="mx-auto mt-3 max-w-2xl leading-7 opacity-80">جلسات فردية، مدرب تختاره بنفسك، ومواعيد تناسب جدولك. لَوَّان يخلي بداية رحلتك أسهل.</p><Link href="/trainers" className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-primary">ابدأ الاستكشاف</Link></div></section>
      </main>
      <footer className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><LogoFooter /><span>© 2026 لَوَّان. جميع الحقوق محفوظة.</span></div></footer>
    </div>
  )
}

function TrainerCard({ trainer: t }: { trainer: (typeof trainers)[number] }) {
  return <Link href={`/trainers/${t.id}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl"><div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/15 to-accent/20"><div className="flex size-20 items-center justify-center rounded-full bg-primary text-xl font-extrabold text-primary-foreground shadow-lg">{t.initials}</div></div><div className="p-5"><div className="flex items-center justify-between gap-2"><h3 className="font-extrabold">{t.name}</h3><span className="flex items-center gap-1 text-xs font-bold"><Star className="size-3.5 fill-current text-accent-foreground" />{t.rating}</span></div><p className="mt-1 text-sm text-muted-foreground">{t.specialty}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="text-xs text-muted-foreground"><MapPin className="mr-1 inline size-3" />{t.city}</span><span className="text-sm font-extrabold">{t.price} ر.س <span className="text-xs font-normal text-muted-foreground">/ جلسة</span></span></div></div></Link>
}

function LogoFooter() { return <Link href="/" className="font-serif text-xl font-bold text-foreground">لَوَّان</Link> }
