import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function PaymentResult({ searchParams }: { searchParams: Promise<{ booking_id?: string; transaction_id?: string; id?: string; status?: string; message?: string }> }) {
  const q = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let verified = false
  let booking: any = null
  if (user && q.booking_id) {
    const result = await supabase.from('bookings').select('id,payment_status,price,status').eq('id', q.booking_id).eq('trainee_id', user.id).maybeSingle()
    booking = result.data
  }
  if (user && q.booking_id && q.transaction_id && q.id && q.status === 'paid') {
    const { data: tx } = await supabase.from('payment_transactions').select('id,booking_id,trainee_id,amount,currency,provider').eq('id', q.transaction_id).eq('booking_id', q.booking_id).eq('trainee_id', user.id).maybeSingle()
    const secret = process.env.MOYASAR_SECRET_KEY
    if (tx?.provider === 'moyasar' && secret) {
      try {
        const auth = Buffer.from(`${secret}:`).toString('base64')
        const res = await fetch(`https://api.moyasar.com/v1/payments/${encodeURIComponent(q.id)}`, { headers:{Authorization:`Basic ${auth}`,Accept:'application/json'}, cache:'no-store' })
        const p = await res.json()
        const ok = res.ok && p?.status === 'paid' && Number(p.amount) === Math.round(Number(tx.amount)*100) && String(p.currency).toUpperCase() === String(tx.currency||'SAR').toUpperCase()
        if (ok) { const r=await supabase.rpc('mark_payment_paid',{p_transaction_id:tx.id,p_provider_payment_id:q.id,p_checkout_url:null}); verified=!r.error }
        else await supabase.rpc('payment_webhook_reconcile',{p_provider:'moyasar',p_provider_payment_id:q.id,p_status:String(p?.status||'failed'),p_paid_at:null,p_payload:p})
      } catch {}
    }
  }
  const success = verified || booking?.payment_status === 'paid'
  return <main dir="rtl" className="min-h-svh bg-secondary/20 p-6"><div className="mx-auto max-w-xl py-16"><div className="rounded-3xl border bg-card p-8 text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl">{success?'✓':'!'}</div><h1 className="mt-5 text-2xl font-extrabold">{success?'تم تأكيد الدفع':q.status==='paid'?'تعذر تأكيد الدفع':'لم تكتمل عملية الدفع'}</h1><p className="mt-3 text-muted-foreground">{success?'تم تسجيل دفعتك بنجاح.':q.status==='paid'?'لم نتمكن من مطابقة العملية مع الحجز. لا تعتبر العملية مكتملة حتى تظهر كمدفوعة في حسابك.':(q.message||'يمكنك المحاولة مرة أخرى من صفحة الحجوزات.')}</p>{booking&&<p className="mt-4 text-sm font-bold">حالة الدفع الحالية: {booking.payment_status}</p>}<div className="mt-7 flex justify-center gap-2"><Link href="/dashboard" className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">لوحة حسابي</Link><Link href="/trainers" className="rounded-xl border px-5 py-3 font-bold">استكشف المدربين</Link></div></div></div></main>
}
