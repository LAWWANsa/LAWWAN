import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { bookingId, transactionId, providerPaymentId } = await req.json()
  if (!bookingId || !transactionId || !providerPaymentId) return NextResponse.json({ error: 'Missing payment data' }, { status: 400 })
  const { data: tx } = await supabase.from('payment_transactions').select('id,booking_id,trainee_id,amount,currency,provider,status').eq('id', transactionId).eq('booking_id', bookingId).eq('trainee_id', user.id).maybeSingle()
  if (!tx || tx.provider !== 'moyasar') return NextResponse.json({ error: 'Payment transaction not found' }, { status: 404 })
  const secret = process.env.MOYASAR_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'Moyasar secret key is not configured' }, { status: 500 })
  const auth = Buffer.from(`${secret}:`).toString('base64')
  const response = await fetch(`https://api.moyasar.com/v1/payments/${encodeURIComponent(providerPaymentId)}`, { headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' }, cache: 'no-store' })
  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload) return NextResponse.json({ error: 'Unable to verify payment with Moyasar' }, { status: 502 })
  const expectedHalalas = Math.round(Number(tx.amount) * 100)
  const amountMatches = Number(payload.amount) === expectedHalalas
  const currencyMatches = String(payload.currency).toUpperCase() === String(tx.currency || 'SAR').toUpperCase()
  if (payload.status === 'paid' && amountMatches && currencyMatches) {
    const { error } = await supabase.rpc('mark_payment_paid', { p_transaction_id: transactionId, p_provider_payment_id: providerPaymentId, p_checkout_url: null })
    if (error) return NextResponse.json({ error: 'Payment verified but could not be recorded' }, { status: 500 })
    return NextResponse.json({ ok: true, status: 'paid' })
  }
  await supabase.rpc('payment_webhook_reconcile', { p_provider: 'moyasar', p_provider_payment_id: providerPaymentId, p_status: String(payload.status || 'failed'), p_paid_at: null, p_payload: payload })
  return NextResponse.json({ ok: false, status: payload.status || 'failed', message: 'Payment was not verified.' }, { status: 400 })
}
