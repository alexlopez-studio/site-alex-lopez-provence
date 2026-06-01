'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Kanban,
  Bell,
  ScrollText,
  Map,
  Settings,
  ChevronLeft,
  BellDot,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/sonner'
import { NotificationsSheet } from '@/components/admin/NotificationsSheet'

const NAV_ITEMS = [
  { href: '/admin/market', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/market/properties', label: 'Marché', icon: Building2 },
  { href: '/admin/market/opportunities', label: 'Opportunités', icon: Kanban },
  { href: '/admin/market/rules', label: 'Règles', icon: ScrollText },
  { href: '/admin/market/notifications', label: 'Notifications', icon: Bell },
]

const ZONE_ITEMS = [
  { href: '/admin/market/zones', label: 'Zones surveillées', icon: Map },
  { href: '/admin/market/settings', label: 'Paramètres', icon: Settings },
]

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center gap-2 border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5 text-brand" />
            <span className="text-sm">Mandat OS</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
            Pilotage
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.label === 'Notifications' && (
                  <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
                    3
                  </Badge>
                )}
              </Link>
            )
          })}

          <Separator className="my-4" />

          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
            Configuration
          </div>
          {ZONE_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/alexandre-lopez-no-background.png" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Alexandre Lopez</p>
              <p className="text-xs text-muted-foreground truncate">iad France</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-6">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Admin
          </Link>
          <div className="flex-1" />
          <NotificationsSheet />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  )
}