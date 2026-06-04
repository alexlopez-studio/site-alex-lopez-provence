'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'

const PAGE_TITLES: Record<string, string> = {
  '/admin/market/leads': 'Leads',
  '/admin/market': 'Dashboard',
  '/admin/market/properties': 'Marché',
  '/admin/market/acheteurs': 'Acquéreurs',
  '/admin/market/matching': 'Matching',
  '/admin/market/opportunities': 'Opportunités',
  '/admin/market/rules': 'Règles',
  '/admin/market/notifications': 'Notifications',
  '/admin/market/zones': 'Zones surveillées',
  '/admin/market/settings': 'Paramètres',
}

export function SiteHeader() {
  const pathname = usePathname()

  let title = 'Mandat OS'
  for (const [path, label] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(path)) {
      title = label
    }
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}