'use client'

import { usePathname } from 'next/navigation'
import { PageTransition } from '@/components/layout/PageTransition'

export function AppChrome({
  children,
  header,
  footer,
}: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}) {
  const pathname = usePathname()
  const isToolsMiniApp = pathname === '/outils' || pathname.startsWith('/outils/')

  if (isToolsMiniApp) {
    return (
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
    )
  }

  return (
    <>
      {header}
      <PageTransition>
        <main className="pt-20">{children}</main>
      </PageTransition>
      {footer}
    </>
  )
}
