import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { UserRound, Search } from 'lucide-react'

export function SiteHeader({ userName }: { userName?: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="لَوَّان" className="shrink-0"><Logo className="h-8" /></Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/trainers" className="text-muted-foreground transition hover:text-foreground">استكشف المدربين</Link>
            <Link href="/" className="text-muted-foreground transition hover:text-foreground">كيف تعمل المنصة؟</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/trainers" className="hidden size-10 items-center justify-center rounded-xl border border-border bg-card md:flex" aria-label="بحث"><Search className="size-4" /></Link>
          {userName ? (
            <Link href="/dashboard" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm">
              <UserRound className="size-4" /> حسابي
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-xl px-3 py-2.5 text-sm font-bold text-foreground">دخول</Link>
              <Link href="/auth/sign-up" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm">ابدأ الآن</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
