import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarDays, CheckCircle2, Clock3, CreditCard, Search, Star, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/lawwan/header'
import { ReviewForm } from '@/components/lawwan/review-form'

const status: Record<string,string> = { requested:'بانتظار المدرب', confirmed:'مؤكد', rejected:'مرفوض', cancelled_by_trainee:'ملغي', cancelled_by_trainer:'ملغي من المدرب', completed:'مكتمل', no_show:'لم يحضر' }
const payment: Record<string,string> = { pending:'بانتظار الدفع', unpaid:'بانتظار الدفع', paid:'مدفوع', verified:'مدفوع', failed:'فشل الدفع', refunded:'مسترد' }
const mode: Record<string,string> = { online:'أونلاين', in_person:'حضوري', both:'حضوري / أونلاين' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data:{user} } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const name = user.user_metadata?.full_name?.split(' ')[0] || 'بك'
  const { data: bookings } = await supabase.from('bookings').select('id,trainer_id,service_id,scheduled_start,scheduled_end,status,payment_status,price,mode,trainee_note,rejection_reason,trainers(display_name,profile_image_url),services(title)').eq('trainee_id',user.id).order('scheduled_start',{ascending:false}).limit(30)
  const { data: notifications } = await supabase.from('notifications').select('id,title,body,read_at,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(5)
  const { data: reviews } = await supabase.from('reviews').select('booking_id').eq('trainee_id',user.id)
  const reviewed = new Set((reviews||[]).map(r=>r.booking_id))
  const rows = bookings || []
  const upcoming = rows.filter(b=>['requested','confirmed'].includes(b.status) && new Date(b.scheduled_start).getTime() >= Date.now()).slice(0,3)
  const completed = rows.filter(b=>b.status==='completed').length
  const pending = rows.filter(b=>b.status==='requested').length
  return <div dir="rtl" className="min-h-svh bg-secondary/20"><SiteHeader userName={name}/><main className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold text-primary">لوحة الطالب</p><h1 className="mt-1 text-3xl font-extrabold">هلا {name} 👋</h1><p className="mt-2 text-muted-foreground">تابع حجوزاتك ومدفوعاتك وجلساتك من مكان واحد.</p></div><Link href="/trainers" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"><Search className="size-4"/> اكتشف مدرب</Link></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-3"><Stat icon={<CalendarDays/>} label="الجلسات القادمة" value={String(upcoming.length)}/><Stat icon={<Clock3/>} label="طلبات بانتظار المدرب" value={String(pending)}/><Stat icon={<CheckCircle2/>} label="جلسات مكتملة" value={String(completed)}/></div>
    {notifications?.some(n=>!n.read_at) && <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5"><h2 className="font-extrabold">آخر الإشعارات</h2><div className="mt-3 space-y-2">{notifications.filter(n=>!n.read_at).map(n=><div key={n.id} className="rounded-xl bg-card p-3 text-sm"><div className="font-bold">{n.title}</div><div className="mt-1 text-muted-foreground">{n.body}</div></div>)}</div></section>}
    <section className="mt-8 rounded-2xl border border-border bg-card p-6"><div><h2 className="text-xl font-extrabold">حجوزاتك</h2><p className="mt-1 text-sm text-muted-foreground">آخر الحجوزات وحالتها الحالية.</p></div>
      <div className="mt-5 space-y-3">{rows.length===0 ? <Empty/> : rows.map(b=>{ const trainer = Array.isArray(b.trainers)?b.trainers[0]:b.trainers; const service=Array.isArray(b.services)?b.services[0]:b.services; const canPay=b.status==='confirmed' && ['pending','unpaid','failed'].includes(b.payment_status); const canReview=b.status==='completed'&&!reviewed.has(b.id); return <div key={b.id} className="rounded-2xl border border-border p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center"><div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><CalendarDays className="size-5"/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold">{service?.title || 'جلسة تدريب'}</h3><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">{status[b.status]||b.status}</span></div><p className="mt-1 text-sm text-muted-foreground">مع {trainer?.display_name || 'مدرب لَوَّان'}</p><p className="mt-1 text-xs text-muted-foreground">{new Intl.DateTimeFormat('ar-SA',{weekday:'long',day:'numeric',month:'long',hour:'numeric',minute:'2-digit'}).format(new Date(b.scheduled_start))} · {mode[b.mode]||b.mode}</p></div><div className="text-left"><div className="text-lg font-extrabold">{Number(b.price).toLocaleString('ar-SA')} ر.س</div><div className="mt-1 text-xs text-muted-foreground"><CreditCard className="mr-1 inline size-3"/>{payment[b.payment_status]||b.payment_status}</div></div></div>{(['confirmed','completed'].includes(b.status))&&<div className="mt-4 flex justify-end border-t border-border pt-4"><Link href={`/chat/${b.id}`} className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold">💬 فتح المحادثة</Link></div>}{(canPay||canReview)&&<div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">{canPay&&<Link href={`/pay/${b.id}`} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">إكمال الدفع</Link>}{canReview&&<ReviewForm bookingId={b.id}/>}</div>}{b.status==='rejected'&&<div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"><XCircle className="ml-1 inline size-4"/> {b.rejection_reason||'تم رفض طلب الحجز.'}</div>}</div>})}</div>
    </section>
  </main></div>
}
function Stat({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="rounded-2xl border border-border bg-card p-5"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div><div className="mt-4 text-2xl font-extrabold">{value}</div><div className="mt-1 text-sm text-muted-foreground">{label}</div></div>}
function Empty(){return <div className="py-12 text-center"><CalendarDays className="mx-auto size-10 text-primary"/><h3 className="mt-4 font-extrabold">لا توجد حجوزات حتى الآن</h3><p className="mt-2 text-sm text-muted-foreground">ابدأ باكتشاف المدربين واحجز أول جلسة لك.</p><Link href="/trainers" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">اكتشف المدربين</Link></div>}
