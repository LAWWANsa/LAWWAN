import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ChatBox } from '@/components/lawwan/chat-box'
import { SiteHeader } from '@/components/lawwan/header'

export default async function ChatPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: booking } = await supabase.from('bookings').select('id,trainee_id,trainer_id,scheduled_start,status,services(title),trainers(display_name,user_id)').eq('id', bookingId).maybeSingle()
  if (!booking) redirect('/dashboard')
  const trainer = Array.isArray(booking.trainers) ? booking.trainers[0] : booking.trainers
  const allowed = booking.trainee_id === user.id || trainer?.user_id === user.id
  if (!allowed) redirect('/dashboard')
  const { data: messages } = await supabase.from('messages').select('id,sender_id,message,created_at').eq('booking_id', bookingId).order('created_at', { ascending: true }).limit(100)
  return <div dir="rtl" className="min-h-svh bg-secondary/20"><SiteHeader userName={user.user_metadata?.full_name || 'حسابي'}/><main className="mx-auto max-w-3xl px-5 py-8"><Link href={booking.trainee_id===user.id?'/dashboard':'/trainer-dashboard'} className="text-sm font-bold text-primary">← العودة</Link><div className="mt-5"><p className="text-sm font-bold text-primary">محادثة الحجز</p><h1 className="mt-1 text-2xl font-extrabold">{(Array.isArray(booking.services)?booking.services[0]:booking.services)?.title || 'جلسة لَوَّان'}</h1><p className="mt-2 text-sm text-muted-foreground">{trainer?.display_name || 'المدرب'} · {new Intl.DateTimeFormat('ar-SA',{dateStyle:'medium',timeStyle:'short'}).format(new Date(booking.scheduled_start))}</p></div><ChatBox bookingId={bookingId} currentUserId={user.id} initialMessages={messages || []}/></main></div>
}
