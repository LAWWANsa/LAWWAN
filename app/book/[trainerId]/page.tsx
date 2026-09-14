import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { RealBookingForm } from '@/components/lawwan/real-booking-form'

function weekdayForSaudi(date: Date) { return Number(new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Riyadh',weekday:'short'}).format(date)==='Sun'?0:new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Riyadh',weekday:'short'}).format(date)==='Mon'?1:new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Riyadh',weekday:'short'}).format(date)==='Tue'?2:new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Riyadh',weekday:'short'}).format(date)==='Wed'?3:new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Riyadh',weekday:'short'}).format(date)==='Thu'?4:new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Riyadh',weekday:'short'}).format(date)==='Fri'?5:6) }
function label(date:Date){return new Intl.DateTimeFormat('ar-SA',{timeZone:'Asia/Riyadh',weekday:'long',day:'numeric',month:'long'}).format(date)}
export default async function BookTrainerPage({params}:{params:Promise<{trainerId:string}>}){
 const {trainerId}=await params; const supabase=await createClient()
 const {data:trainer}=await supabase.from('trainers').select('*').eq('id',trainerId).eq('verified',true).eq('active',true).maybeSingle(); if(!trainer)notFound()
 const {data:services}=await supabase.from('services').select('id,title,price,duration_minutes,mode').eq('trainer_id',trainer.id).eq('active',true).order('created_at')
 const {data:availability}=await supabase.from('trainer_availability').select('weekday,start_time,end_time').eq('trainer_id',trainer.id).eq('active',true).order('weekday').order('start_time')
 const now=new Date(); const horizon=new Date(now.getTime()+14*86400000)
 const {data:busy}=await supabase.from('bookings').select('scheduled_start,scheduled_end').eq('trainer_id',trainer.id).in('status',['requested','confirmed']).gte('scheduled_end',now.toISOString()).lte('scheduled_start',horizon.toISOString())
 const busyRanges=(busy||[]).map(b=>[new Date(b.scheduled_start).getTime(),new Date(b.scheduled_end).getTime()])
 const slots:any[]=[]
 for(let d=0;d<14;d++){
  const day=new Date(now.getTime()+d*86400000); const wd=weekdayForSaudi(day)
  for(const a of availability||[]){if(Number(a.weekday)!==wd)continue
   const [sh,sm]=String(a.start_time).slice(0,5).split(':').map(Number); const [eh,em]=String(a.end_time).slice(0,5).split(':').map(Number)
   for(let mins=sh*60+sm;mins+30<=eh*60+em;mins+=30){
    const ymd=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(day)
    const iso=`${ymd}T${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}:00+03:00`; const start=new Date(iso); const duration=Number(services?.[0]?.duration_minutes||60); const end=new Date(start.getTime()+duration*60000)
    if(start<=now||start>horizon)continue; if(busyRanges.some(([s,e])=>start.getTime()<e&&end.getTime()>s))continue
    slots.push({start:iso,end:end.toISOString(),label:label(start)}); if(slots.length>=20)break
   } if(slots.length>=20)break
  } if(slots.length>=20)break
 }
 return <main className="min-h-svh bg-secondary/30"><div className="mx-auto max-w-3xl px-5 py-8"><Link href={`/trainers/${trainer.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground"><ArrowRight className="size-4"/> العودة لملف المدرب</Link><div className="mt-5"><RealBookingForm trainer={trainer} services={services||[]} slots={slots}/></div>{!services?.length&&<div className="mt-4 rounded-2xl border border-border bg-card p-5 text-center text-sm text-muted-foreground"><CalendarDays className="mx-auto size-6"/><p className="mt-2">المدرب لم يضف خدمات للحجز بعد.</p></div>}</div></main>
}
