# LAWWAN — Moyasar Sandbox

Add these Vercel Environment Variables:

- `NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY` = your `pk_test_...`
- `MOYASAR_SECRET_KEY` = your `sk_test_...`

The publishable key is safe for the browser; the secret key must remain server-side.

The payment page is `/pay/{bookingId}` and redirects to `/payment/result` after Moyasar's callback.

For sandbox testing, Moyasar documents test cards such as Visa `4111111111111111` and Mada `4201320111111010` as successful test cards.
