'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitTrainerApplication } from '@/app/auth/actions'

export function TrainerApplicationForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ experienceYears: '3', instrumentOrArt: '', specialties: '', portfolioUrl: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null)
    startTransition(async () => {
      const result = await submitTrainerApplication({
        experienceYears: Number(form.experienceYears),
        instrumentOrArt: form.instrumentOrArt,
        specialties: form.specialties,
        portfolioUrl: form.portfolioUrl,
      })
      if (result.status === 'success') setDone(true)
      else setError(result.message)
    })
  }

  if (done) return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
      <CheckCircle2 className="mx-auto size-12 text-primary" />
      <h3 className="mt-4 text-2xl font-extrabold">تم استلام طلبك 🎉</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">بنراجع طلبك، وإذا تم ترشيحك للمقابلة بنتواصل معك. حالة الطلب ستتحدث من لوحة التحكم.</p>
      <Button className="mt-6 rounded-xl" onClick={() => router.push('/dashboard')}>الذهاب إلى حسابي <ArrowLeft className="size-4" /></Button>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-5" dir="rtl">
      <div className="space-y-2"><Label>المجال الرئيسي</Label><Input required value={form.instrumentOrArt} onChange={e => setForm({...form, instrumentOrArt:e.target.value})} placeholder="مثال: عود، بيانو، رسم، خط عربي" className="h-12 rounded-xl" /></div>
      <div className="space-y-2"><Label>سنوات الخبرة</Label><Input required min="0" max="60" type="number" value={form.experienceYears} onChange={e => setForm({...form, experienceYears:e.target.value})} className="h-12 rounded-xl" /></div>
      <div className="space-y-2"><Label>التخصص والمهارات</Label><Textarea required value={form.specialties} onChange={e => setForm({...form, specialties:e.target.value})} placeholder="ما الذي تستطيع تدريسه؟ ولأي مستوى؟" className="min-h-28 rounded-xl" /></div>
      <div className="space-y-2"><Label>رابط أعمالك أو معرضك <span className="font-normal text-muted-foreground">(اختياري)</span></Label><Input type="url" value={form.portfolioUrl} onChange={e => setForm({...form, portfolioUrl:e.target.value})} placeholder="https://..." dir="ltr" className="h-12 rounded-xl text-left" /></div>
      {error && <div role="alert" className="flex gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</div>}
      <Button disabled={pending} className="h-12 w-full rounded-xl text-base font-bold">{pending ? <><Loader2 className="size-4 animate-spin" /> جارٍ إرسال الطلب...</> : 'إرسال طلب الانضمام'}</Button>
      <p className="text-center text-xs leading-5 text-muted-foreground">التقديم لا يعني القبول تلقائياً. نراجع الطلب ونتواصل مع المرشحين للمقابلة.</p>
    </form>
  )
}
