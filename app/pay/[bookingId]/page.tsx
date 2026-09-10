import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createMoyasarPaymentIntent } from '@/app/auth/actions'
import { MoyasarPaymentForm } from '@/components/lawwan/moyasar-payment-form'

export default async function PayBookingPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?next=/pay/${bookingId}`)
  const { data: booking } = await supabase.from('bookings').select('id,price,status,payment_status,scheduled_start').eq('id', bookingId).eq('trainee_id', user.id).maybeSingle()
  if (!booking) notFound()
  if (booking.status !== 'confirmed') return <main className="min-h-svh bg-secondary/20 p-6"><div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 text-center"><h1 className="text-2xl font-extrabold">الدفع غير متاح بعد</h1><p className="mt-2 text-muted-foreground">يجب أن يوافق المدرب على طلب الحجز أولاً.</p><Link href="/bookings" className="mt-6 inline-block font-bold text-primary">العودة للحجوزات</Link></div></main>
  const intent = await createMoyasarPaymentIntent(bookingId)
  return <main className="min-h-svh bg-secondary/20 p-5"><div className="mx-auto max-w-xl py-8"><Link href="/bookings" className="text-sm font-bold text-muted-foreground">← العودة للحجوزات</Link><div className="mt-5 rounded-3xl border bg-card p-6 shadow-sm"><p className="text-sm font-bold text-primary">الدفع التجريبي</p><h1 className="mt-1 text-2xl font-extrabold">أكمل حجزك في لَوَّان</h1><div className="my-6 rounded-2xl bg-secondary/50 p-4"><div className="flex justify-between"><span>قيمة الجلسة</span><strong>{Number(booking.price).toFixed(2)} ر.س</strong></div></div>{intent.status === 'error' ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{intent.message}</div> : <MoyasarPaymentForm bookingId={booking.id} transactionId={intent.transactionId} amount={Number(booking.price)} />}<p className="mt-5 text-xs leading-6 text-muted-foreground">هذه نسخة Sandbox للتجربة فقط، ولن يتم خصم أموال حقيقية.</p></div></div></main>
}
