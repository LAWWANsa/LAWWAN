'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { UserRound, Search, Menu, X } from 'lucide-react'

export function SiteHeader({ userName }: { userName?: string | null }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="لَوَّان" className="shrink-0" onClick={() => setOpen(false)}><Logo className="h-8" /></Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/how-it-works" className="text-muted-foreground transition hover:text-foreground">كيف تعمل المنصة؟</Link>
            <Link href="/trainers" className="text-muted-foreground transition hover:text-foreground">استكشف المدربين</Link>
            <Link href="/become-trainer" className="text-muted-foreground transition hover:text-foreground">انضم كمدرّب</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/trainers" className="hidden size-10 items-center justify-center rounded-xl border border-border bg-card md:flex" aria-label="بحث"><Search className="size-4" /></Link>
          {userName ? (
            <Link href="/dashboard" className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm sm:flex">
              <UserRound className="size-4" /> حسابي
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="hidden rounded-xl px-3 py-2.5 text-sm font-bold text-foreground sm:block">دخول</Link>
              <Link href="/auth/sign-up" className="hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm sm:block">ابدأ الآن</Link>
            </>
          )}
          <button type="button" aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={open} onClick={() => setOpen(value => !value)} className="flex size-10 items-center justify-center rounded-xl border border-border bg-card md:hidden">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden" dir="rtl">
          <nav className="flex flex-col gap-1 text-sm font-bold">
            <Link href="/how-it-works" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 hover:bg-secondary">كيف تعمل المنصة؟</Link>
            <Link href="/trainers" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 hover:bg-secondary">استكشف المدربين</Link>
            <Link href="/become-trainer" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 hover:bg-secondary">انضم كمدرّب</Link>
            {userName ? <Link href="/dashboard" onClick={() => setOpen(false)} className="mt-1 rounded-xl bg-primary px-4 py-3 text-center text-primary-foreground">حسابي</Link> : <><Link href="/auth/login" onClick={() => setOpen(false)} className="mt-1 rounded-xl px-4 py-3 text-center">دخول</Link><Link href="/auth/sign-up" onClick={() => setOpen(false)} className="rounded-xl bg-primary px-4 py-3 text-center text-primary-foreground">ابدأ الآن</Link></>}
          </nav>
        </div>
      )}
    </header>
  )
}
