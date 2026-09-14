import { FlaskConical } from 'lucide-react'

export function ValidationBanner() {
  return (
    <div className="border-b border-accent/30 bg-accent/10">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2.5 text-center text-xs font-medium text-foreground lg:px-8">
        <FlaskConical className="size-4 shrink-0 text-accent-foreground" />
        <span><strong>نسخة تجريبية للتحقق من جدوى المشروع:</strong> جميع الأسماء والمدربين والمواعيد والأسعار المعروضة حاليًا غير حقيقية ولأغراض الاختبار فقط.</span>
      </div>
    </div>
  )
}
