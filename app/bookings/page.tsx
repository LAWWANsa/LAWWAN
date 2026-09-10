import { redirect } from 'next/navigation'
export default async function BookingsPage({searchParams}:{searchParams:Promise<{trainer?:string}>}){
 const {trainer}=await searchParams
 if(trainer) redirect(`/book/${trainer}`)
 redirect('/trainers')
}
