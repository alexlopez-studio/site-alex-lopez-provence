import type { ReactNode } from 'react'

export default function ArticleLead({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-4 border-brand pl-6 text-[18px] leading-[1.8] text-foreground">
      {children}
    </div>
  )
}
