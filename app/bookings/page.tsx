'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, CheckCircle2, ChevronLeft } from 'lucide-react'
import { trainers } from '@/lib/lawwan-data'
import { useState } from 'react'

export default function BookingPage() {
  const params = useSearchParams()
  const trainer = trainers.find(t => t.id === params.get('trainer')) ?? trainers[0]
  const [selected, setSelected] = useState('الثلاثاء 8 سبتمبر · 7:00 م')
  const [sent, setSent] = useState(false)
  if (sent) return <main className="flex min-h-svh items-center justify-center px-5"><div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 text-center shadow-xl"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary"><CheckCircle2 className="size-8" /></div><h1 className="mt-5 text-2xl font-extrabold">تم إرسال طلب الحجز</h1><p className="mt-3 leading-7 text-muted-foreground">أرسلنا طلبك إلى {trainer.name}. في النسخة الحالية الحجز تجريبي، وسنربطه بالدفع وقاعدة البيانات في المرحلة التالية.</p><Link href="/dashboard" className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">العودة لحسابي</Link></div></main>
  return <main className="min-h-svh bg-secondary/30"><div className="mx-auto max-w-2xl px-5 py-10"><Link href={`/trainers/${trainer.id}`} className="text-sm font-bold text-muted-foreground">‹ العودة لملف المدرب</Link><div className="mt-6 rounded-[2rem] border border-border bg-card p-7 shadow-xl"><div className="flex items-center gap-4"><div className="flex size-16 items-center justify-center rounded-2xl bg-primary font-extrabold text-primary-foreground">{trainer.initials}</div><div><h1 className="text-2xl font-extrabold">حجز جلسة مع {trainer.name}</h1><p className="mt-1 text-sm text-muted-foreground">{trainer.specialty} · {trainer.price} ر.س</p></div></div><div className="mt-8"><h2 className="font-extrabold">اختر الموعد</h2><div className="mt-3 grid gap-3">{['الثلاثاء 8 سبتمبر · 7:00 م','الأربعاء 9 سبتمبر · 6:00 م','الخميس 10 سبتمبر · 8:00 م'].map(slot => <button key={slot} onClick={() => setSelected(slot)} className={`flex items-center justify-between rounded-xl border p-4 text-right text-sm font-bold ${selected === slot ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'}`}><span><CalendarDays className="mr-2 inline size-4" />{slot}</span><ChevronLeft className="size-4" /></button>)}</div></div><div className="mt-7 rounded-xl bg-secondary p-4 text-sm leading-6 text-muted-foreground">هذه النسخة تستخدم بيانات تجريبية. لن يتم تحصيل أي مبلغ ولن يتم إنشاء حجز حقيقي بعد.</div><button onClick={() => setSent(true)} className="mt-6 h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground">إرسال طلب الحجز</button></div></div></main>
}
