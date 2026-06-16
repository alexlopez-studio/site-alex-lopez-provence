'use client'

import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import type { AdminRole } from '@/types/supabase'

export function MarketShell({
  children,
  role,
  email,
}: {
  children: React.ReactNode
  role: AdminRole
  email: string
}) {
  return (
    <SidebarProvider>
      <AppSidebar role={role} email={email} />
      <SidebarInset>
        <div className="p-4 lg:p-6">{children}</div>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}
