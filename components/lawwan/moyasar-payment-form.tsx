'use client'

import Script from 'next/script'
import { useState } from 'react'

declare global {
  interface Window { Moyasar?: { init: (config: Record<string, unknown>) => void } }
}

export function MoyasarPaymentForm({ bookingId, transactionId, amount }: { bookingId: string; transactionId: string; amount: number }) {
  const [loaded, setLoaded] = useState(false)
  const key = process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY
  const callback = typeof window !== 'undefined'
    ? `${window.location.origin}/payment/result?booking_id=${encodeURIComponent(bookingId)}&transaction_id=${encodeURIComponent(transactionId)}`
    : '/payment/result'

  if (!key) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">أضف مفتاح Moyasar التجريبي في <code>NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY</code> لتفعيل الدفع.</div>

  return <>
    <Script src="https://cdn.moyasar.com/mpf/1.16.0/moyasar.js" onLoad={() => setLoaded(true)} />
    <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.16.0/moyasar.css" />
    {!loaded && <p className="mb-4 text-sm text-muted-foreground">جاري تجهيز بوابة الدفع...</p>}
    <div className="mysr-form" />
    {loaded && typeof window !== 'undefined' && window.Moyasar && window.Moyasar.init({
      element: '.mysr-form', amount: Math.round(amount * 100), currency: 'SAR',
      description: `LAWWAN booking ${bookingId}`, publishable_api_key: key,
      callback_url: callback, language: 'ar', methods: ['creditcard'],
      supported_networks: ['mada', 'visa', 'mastercard', 'amex', 'unionpay'],
      metadata: { booking_id: bookingId, transaction_id: transactionId },
    }) && null}
  </>
}
