'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/layout/PageTransition'

export function AppChrome({ children }: { children: React.ReactNode }) {
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
      <Header />
      <PageTransition>
        <main className="pt-20">{children}</main>
      </PageTransition>
      <Footer />
    </>
  )
}
