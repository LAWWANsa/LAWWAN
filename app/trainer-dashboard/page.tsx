import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/lawwan/header'
import { TrainerDashboard } from '@/components/lawwan/trainer-dashboard'
import { TrainerBookings } from '@/components/lawwan/trainer-bookings'

export default async function TrainerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: trainer } = await supabase.from('trainers').select('*').eq('user_id', user.id).maybeSingle()
  if (!trainer) redirect('/become-trainer')
  const [{ data: categories }, { data: services }, { data: availability }, { data: bookings }] = await Promise.all([
    supabase.from('categories').select('id,name_ar').eq('active', true).order('name_ar'),
    supabase.from('services').select('id,category_id,title,description,duration_minutes,price,mode,active').eq('trainer_id', trainer.id).order('created_at', { ascending: false }),
    supabase.from('trainer_availability').select('id,weekday,start_time,end_time,active').eq('trainer_id', trainer.id).eq('active', true).order('weekday'),
    supabase.from('bookings').select('id,trainee_id,scheduled_start,scheduled_end,status,price,mode,trainee_note,trainer_note').eq('trainer_id', trainer.id).order('scheduled_start', { ascending: true }),
  ])
  const traineeIds = [...new Set((bookings || []).map((b: any) => b.trainee_id))]
  const { data: traineeProfiles } = traineeIds.length ? await supabase.from('profiles').select('id,full_name').in('id', traineeIds) : { data: [] as any[] }
  const names = new Map((traineeProfiles || []).map((p: any) => [p.id, p.full_name]))
  const bookingRows = (bookings || []).map((b: any) => ({ ...b, trainee_name: names.get(b.trainee_id) || 'طالب لَوَّان' }))
  return <div className="min-h-svh bg-secondary/25"><SiteHeader userName={user.user_metadata?.full_name || trainer.display_name || 'المدرب'} /><main className="mx-auto max-w-7xl px-5 py-8 lg:px-8"><TrainerDashboard trainer={trainer} categories={categories || []} services={services || []} availability={availability || []} /><div className="mt-8"><div className="mb-4"><p className="text-sm font-bold text-primary">الحجوزات</p><h2 className="text-2xl font-extrabold">طلبات الطلاب</h2></div><TrainerBookings initialBookings={bookingRows} /></div></main></div>
}
