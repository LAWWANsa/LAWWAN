import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  /** Use the light (on-dark) variant for the brand panel. */
  variant?: 'default' | 'light'
}

/**
 * LAWWAN wordmark. Arabic name لَوَّان set in the serif display face,
 * with a small gold diamond accent standing in for the brand mark.
 */
export function Logo({ className, variant = 'default' }: LogoProps) {
  const text = variant === 'light' ? 'text-primary-foreground' : 'text-primary'
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="inline-block size-3 rotate-45 rounded-[3px] bg-accent"
      />
      <span
        className={cn(
          'font-serif text-3xl font-bold leading-none tracking-tight',
          text,
        )}
      >
        لَوَّان
      </span>
    </span>
  )
}
