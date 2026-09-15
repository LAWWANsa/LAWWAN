'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const modes = [
  { value: 'in_person', label: 'حضوري' },
  { value: 'online', label: 'أونلاين' },
  { value: 'both', label: 'حضوري وأونلاين' },
] as const

const audiences = [
  { value: 'male', label: 'ذكور' },
  { value: 'female', label: 'إناث' },
  { value: 'both', label: 'ذكور وإناث' },
] as const

const ageGroups = [
  { value: 'adults', label: 'بالغين' },
  { value: 'children', label: 'أطفال' },
  { value: 'both', label: 'بالغين وأطفال' },
] as const

export function TrainerInterestForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', city: '', specialty: '', experienceYears: '',
    trainingMode: 'both' as 'online' | 'in_person' | 'both',
    targetAudience: 'both' as 'male' | 'female' | 'both',
    targetAgeGroup: 'adults' as 'adults' | 'children' | 'both',
    expectedPrice: '', portfolioUrl: '', bio: '', inquiries: '',
  })

  function update(key: string, value: string) { setForm((current) => ({ ...current, [key]: value })) }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const required = [
      ['الاسم الكامل', form.fullName],
      ['رقم الجوال', form.phone],
      ['المدينة', form.city],
      ['المجال الفني أو الموسيقي', form.specialty],
    ] as const
    const missing = required.find(([, value]) => !value.trim())
    if (missing) {
      setError(`فضلاً أدخل ${missing[0]}.`)
      return
    }

    setPending(true)
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!url || !key) throw new Error('إعدادات قاعدة البيانات غير مكتملة في الموقع.')

      const supabase = createClient()
      const { error: submitError } = await supabase.rpc('submit_trainer_interest', {
        p_full_name: form.fullName.trim(),
        p_phone: form.phone.trim(),
        p_city: form.city.trim(),
        p_specialty: form.specialty.trim(),
        p_email: form.email.trim() || null,
        p_experience_years: form.experienceYears ? Number(form.experienceYears) : null,
        p_training_mode: form.trainingMode,
        p_expected_price: form.expectedPrice ? Number(form.expectedPrice) : null,
        p_portfolio_url: form.portfolioUrl.trim() || null,
        p_bio: [form.bio.trim(), form.inquiries.trim() ? `استفسارات أو اقتراحات: ${form.inquiries.trim()}` : ''].filter(Boolean).join('\n\n') || null,
      })

      if (submitError) throw submitError
      setDone(true)
    } catch (err) {
      console.error('[lawwan] trainer interest submit error:', err)
      const message = err instanceof Error ? err.message : 'تعذّر تسجيل الطلب حالياً. حاول مرة أخرى.'
      setError(message)
    } finally {
      setPending(false)
    }
  }

  if (done) return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center">
      <CheckCircle2 className="mx-auto size-14 text-primary" />
      <h2 className="mt-5 text-2xl font-extrabold">تم تسجيل اهتمامك 🎉</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">شكرًا لك. هذه مرحلة تحقق مبكرة من جدوى لَوَّان، وسنتواصل مع المهتمين عند اكتمال المرحلة التجريبية.</p>
    </div>
  )

  return (
    <form onSubmit={submit} noValidate className="space-y-5" dir="rtl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2"><Label>الاسم الكامل *</Label><Input required value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="اكتب اسمك" className="h-12 rounded-xl" /></div>
        <div className="space-y-2"><Label>رقم الجوال *</Label><Input required value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="05xxxxxxxx" inputMode="tel" dir="ltr" className="h-12 rounded-xl text-left" /></div>
        <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="name@example.com" dir="ltr" className="h-12 rounded-xl text-left" /></div>
        <div className="space-y-2"><Label>المدينة *</Label><Input required value={form.city} onChange={e => update('city', e.target.value)} placeholder="مثال: الخبر" className="h-12 rounded-xl" /></div>
        <div className="space-y-2 sm:col-span-2"><Label>مجالك الفني أو الموسيقي *</Label><Input required value={form.specialty} onChange={e => update('specialty', e.target.value)} placeholder="مثال: عود، بيانو، رسم، خط عربي، تصوير" className="h-12 rounded-xl" /></div>
        <div className="space-y-2"><Label>سنوات الخبرة</Label><Input type="number" min="0" max="60" value={form.experienceYears} onChange={e => update('experienceYears', e.target.value)} placeholder="مثال: 5" className="h-12 rounded-xl" /></div>
        <div className="space-y-2"><Label>السعر المتوقع للجلسة (ر.س)</Label><Input type="number" min="0" value={form.expectedPrice} onChange={e => update('expectedPrice', e.target.value)} placeholder="مثال: 150" className="h-12 rounded-xl" /></div>
      </div>

      <div className="space-y-2"><Label>طريقة تقديم الجلسات *</Label><div className="grid grid-cols-3 gap-2">{modes.map(mode => <button key={mode.value} type="button" onClick={() => setForm(current => ({ ...current, trainingMode: mode.value }))} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${form.trainingMode === mode.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/30'}`}>{mode.label}</button>)}</div></div>

      <div className="space-y-2"><Label>الفئة المستهدفة؟ *</Label><div className="grid grid-cols-3 gap-2">{audiences.map(option => <button key={option.value} type="button" onClick={() => setForm(current => ({ ...current, targetAudience: option.value }))} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${form.targetAudience === option.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/30'}`}>{option.label}</button>)}</div></div>

      <div className="space-y-2"><Label>الفئة العمرية المستهدفة؟ *</Label><div className="grid grid-cols-3 gap-2">{ageGroups.map(option => <button key={option.value} type="button" onClick={() => setForm(current => ({ ...current, targetAgeGroup: option.value }))} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${form.targetAgeGroup === option.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/30'}`}>{option.label}</button>)}</div></div>

      <div className="space-y-2"><Label>نبذة قصيرة عن خبرتك</Label><Textarea value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="عرّفنا بنفسك وما الذي تحب تعليمه..." className="min-h-28 rounded-xl" /></div>
      <div className="space-y-2"><Label>استفسارات أو اقتراحات</Label><Textarea value={form.inquiries} onChange={e => update('inquiries', e.target.value)} placeholder="هل لديك استفسار أو اقتراح يساعدنا على تطوير لَوَّان؟" className="min-h-24 rounded-xl" /><p className="text-xs leading-5 text-muted-foreground">بنجيب على جميع استفساراتك، وبنحاول نوفر جميع الاقتراحات المناسبة لتجربة أفضل للمدربين والطلاب.</p></div>
      <div className="space-y-2"><Label>رابط Instagram أو معرض أعمالك</Label><Input type="url" value={form.portfolioUrl} onChange={e => update('portfolioUrl', e.target.value)} placeholder="https://..." dir="ltr" className="h-12 rounded-xl text-left" /></div>

      {error && <div role="alert" className="flex gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</div>}
      <Button type="submit" disabled={pending} className="h-13 w-full rounded-xl text-base font-bold">{pending ? <><Loader2 className="size-4 animate-spin" /> جارٍ التسجيل...</> : 'سجّل اهتمامك كمدرب'}</Button>
      <p className="text-center text-xs leading-5 text-muted-foreground">التسجيل مجاني ولا يعني القبول أو الإطلاق التجاري. البيانات تُجمع فقط لقياس اهتمام المدربين بالمشروع.</p>
    </form>
  )
}
