'use client'
import { useState } from 'react'
import { CalendarDays, Check, Clock3, X } from 'lucide-react'
import { respondToTrainerBooking } from '@/app/auth/actions'

type Booking = { id:string; scheduled_start:string; scheduled_end:string; status:string; price:number; mode:string; trainee_note:string|null; trainer_note:string|null; trainee_name:string }

const statusLabel: Record<string,string> = { requested:'طلب جديد', confirmed:'مؤكد', rejected:'مرفوض', cancelled_by_trainee:'ملغي من الطالب', cancelled_by_trainer:'ملغي من المدرب', completed:'مكتمل', no_show:'لم يحضر' }
const modeLabel: Record<string,string> = { online:'أونلاين', in_person:'حضوري', both:'حضوري + أونلاين' }

export function TrainerBookings({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [busy, setBusy] = useState<string|null>(null)
  const [notice, setNotice] = useState('')
  const [rejecting, setRejecting] = useState<string|null>(null)
  const [reason, setReason] = useState('')
  const flash=(m:string)=>{setNotice(m);setTimeout(()=>setNotice(''),3500)}
  const formatDate=(value:string)=>new Intl.DateTimeFormat('ar-SA',{weekday:'long',day:'numeric',month:'long',hour:'numeric',minute:'2-digit'}).format(new Date(value))
  async function decide(id:string, action:'accept'|'reject') {
    setBusy(id)
    const r=await respondToTrainerBooking({bookingId:id,action,reason:action==='reject'?reason:undefined})
    setBusy(null)
    if(r.status==='success') { setBookings(bs=>bs.map(b=>b.id===id?{...b,status:action==='accept'?'confirmed':'rejected'}:b)); setRejecting(null); setReason(''); flash(action==='accept'?'تم قبول الحجز.':'تم رفض الحجز.') }
    else flash(r.message)
  }
  return <div className="space-y-5">
    {notice && <div className="fixed bottom-5 left-5 z-50 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background shadow-xl">{notice}</div>}
    {bookings.length===0 ? <div className="rounded-2xl border border-border bg-card p-10 text-center"><CalendarDays className="mx-auto size-10 text-primary"/><h2 className="mt-4 text-xl font-extrabold">لا توجد حجوزات حتى الآن</h2><p className="mt-2 text-sm text-muted-foreground">عندما يطلب طالب جلسة ستظهر هنا لتتمكن من قبولها أو رفضها.</p></div> : bookings.map(b=><div key={b.id} className="rounded-2xl border border-border bg-card p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center"><div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><CalendarDays className="size-5"/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold">{b.trainee_name || 'طالب لَوَّان'}</h3><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">{statusLabel[b.status]||b.status}</span></div><p className="mt-1 text-sm text-muted-foreground"><Clock3 className="mr-1 inline size-3.5"/>{formatDate(b.scheduled_start)} · {modeLabel[b.mode]||b.mode}</p>{b.trainee_note&&<p className="mt-3 rounded-xl bg-secondary p-3 text-sm leading-6">ملاحظة الطالب: {b.trainee_note}</p>}</div><div className="text-left"><div className="text-lg font-extrabold">{Number(b.price).toLocaleString('ar-SA')} ر.س</div><div className="mt-1 text-xs text-muted-foreground">مدة الجلسة {Math.round((new Date(b.scheduled_end).getTime()-new Date(b.scheduled_start).getTime())/60000)} دقيقة</div></div></div>
    {['confirmed','completed'].includes(b.status)&&<div className="mt-4 border-t border-border pt-4"><a href={`/chat/${b.id}`} className="inline-flex rounded-xl border border-border px-4 py-2.5 text-sm font-bold">💬 فتح المحادثة</a></div>}{b.status==='requested'&&<div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4"><button disabled={busy===b.id} onClick={()=>decide(b.id,'accept')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"><Check className="size-4"/> قبول الحجز</button><button disabled={busy===b.id} onClick={()=>setRejecting(rejecting===b.id?null:b.id)} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-bold disabled:opacity-50"><X className="size-4"/> رفض الحجز / اقتراح بديل</button></div>}
    {rejecting===b.id&&<div className="mt-3 rounded-xl bg-secondary p-4"><label className="block text-sm font-bold">سبب الرفض (مطلوب)</label><textarea value={reason} onChange={e=>setReason(e.target.value)} className="mt-2 min-h-20 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="مثلاً: الوقت غير مناسب. يمكنك اقتراح موعد بديل للطالب عبر التواصل معه."/><button disabled={busy===b.id} onClick={()=>decide(b.id,'reject')} className="mt-3 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background">تأكيد الرفض</button></div>}
    </div>)}</div>
}
