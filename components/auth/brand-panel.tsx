import { Logo } from '@/components/brand/logo'
import { GraduationCap, Users, Sparkles } from 'lucide-react'

const highlights = [
  { icon: GraduationCap, text: 'برامج تدريبية معتمدة بجودة عالية' },
  { icon: Users, text: 'نخبة من المدربين والمرشدين المحترفين' },
  { icon: Sparkles, text: 'رحلة تطوير مصمّمة خصيصاً لأهدافك' },
]

export function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:p-12">
      {/* subtle geometric wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative">
        <Logo variant="light" className="h-10" />
      </div>

      <div className="relative max-w-sm">
        <h2 className="text-balance font-serif text-4xl font-bold leading-tight">
          طوّر مهاراتك مع لَوَّان
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/75">
          منصة سعودية تجمعك بأفضل المدربين والمرشدين في مكان واحد، لتنطلق في رحلة
          تعلّم وتطوير احترافية.
        </p>

        <ul className="mt-10 flex flex-col gap-5">
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10 text-accent">
                <Icon className="size-5" />
              </span>
              <span className="text-pretty leading-relaxed text-primary-foreground/90">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} لَوَّان. جميع الحقوق محفوظة.
      </p>
    </aside>
  )
}
