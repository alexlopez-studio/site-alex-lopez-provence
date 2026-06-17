'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'

const PAGE_TITLES: Record<string, string> = {
  '/app/radar': 'Radar',
  '/app/leads': 'Leads',
  '/app/dashboard': 'Dashboard',
  '/app/properties': 'Marché',
  '/app/acheteurs': 'Acquéreurs',
  '/app/matching': 'Matching',
  '/app/opportunities': 'Opportunités',
  '/app/rules': 'Règles',
  '/app/notifications': 'Notifications',
  '/app/zones': 'Zones surveillées',
  '/app/settings': 'Paramètres',
}

export function SiteHeader() {
  const pathname = usePathname()

  const title =
    Object.entries(PAGE_TITLES)
      .sort(([a], [b]) => b.length - a.length)
      .find(([path]) => pathname.startsWith(path))?.[1] ?? 'Mandat OS'

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
