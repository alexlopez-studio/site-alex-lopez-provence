import type { ReactNode } from 'react'

type Variant = 'tip' | 'warning'

const config: Record<Variant, { icon: string; label: string }> = {
  tip: { icon: '💡', label: 'BON À SAVOIR' },
  warning: { icon: '⚠️', label: 'ATTENTION' },
}

export default function InfoBox({
  variant = 'tip',
  title,
  children,
}: {
  variant?: Variant
  title?: string
  children: ReactNode
}) {
  const c = config[variant]
  return (
    <div className="my-8 rounded-2xl border-l-4 border-brand bg-surface p-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[18px]">{c.icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-foreground">
          {title || c.label}
        </span>
      </div>
      <div className="text-[15px] leading-[1.7] text-muted">{children}</div>
    </div>
  )
}
