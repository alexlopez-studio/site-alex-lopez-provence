"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2Icon,
  GitCompareArrowsIcon,
  KanbanIcon,
  LayoutDashboardIcon,
  RadarIcon,
  ScrollTextIcon,
  BellIcon,
  MapIcon,
  SettingsIcon,
  UsersIcon,
  PackageIcon,
  UserPlusIcon,
  FlameIcon,
  ShieldIcon,
} from "lucide-react"
import type { AdminRole } from "@/types/supabase"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const OVERVIEW_ITEMS = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboardIcon },
]

const SELLER_ITEMS = [
  { title: "Radar", url: "/app/radar", icon: RadarIcon },
  { title: "Leads", url: "/app/leads", icon: UserPlusIcon },
  { title: "Liste chaude", url: "/app/liste-chaude", icon: FlameIcon },
  { title: "Opportunités", url: "/app/opportunities", icon: KanbanIcon },
]

const BUYER_ITEMS = [
  { title: "Acquéreurs", url: "/app/acheteurs", icon: UsersIcon },
  { title: "Matching", url: "/app/matching", icon: GitCompareArrowsIcon },
]

const MARKET_ITEMS = [
  { title: "Biens", url: "/app/properties", icon: Building2Icon },
  { title: "Zones surveillées", url: "/app/zones", icon: MapIcon },
]

const AUTOMATION_ITEMS = [
  { title: "Règles", url: "/app/rules", icon: ScrollTextIcon },
  { title: "Notifications", url: "/app/notifications", icon: BellIcon },
]

const CONFIG_ITEMS = [
  { title: "Paramètres", url: "/app/settings", icon: SettingsIcon },
]

const SUPER_ADMIN_ITEMS = [
  { title: "Utilisateurs", url: "/app/utilisateurs", icon: ShieldIcon },
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role?: AdminRole
  email?: string
}

export function AppSidebar({ role, email, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  const configItems =
    role === "super_admin" ? [...CONFIG_ITEMS, ...SUPER_ADMIN_ITEMS] : CONFIG_ITEMS

  const isActive = (href: string) => {
    if (href === '/app/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  const withActiveState = (items: typeof OVERVIEW_ITEMS) =>
    items.map((item) => ({
      ...item,
      isActive: isActive(item.url),
    }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
            <SidebarMenuButton
              asChild
              className="min-w-0 flex-1 data-[slot=sidebar-menu-button]:!p-1.5 group-data-[collapsible=icon]:flex-none"
            >
              <Link href="/app/dashboard">
                <PackageIcon className="h-5 w-5 text-brand" />
                <span className="text-base font-semibold">Mandat OS</span>
              </Link>
            </SidebarMenuButton>
            <SidebarTrigger className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:mt-1" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Vue d'ensemble" items={withActiveState(OVERVIEW_ITEMS)} />
        <NavMain title="Vendeurs" items={withActiveState(SELLER_ITEMS)} />
        <NavMain title="Acquéreurs" items={withActiveState(BUYER_ITEMS)} />
        <NavMain title="Marché" items={withActiveState(MARKET_ITEMS)} />
        <NavMain title="Automatisation" items={withActiveState(AUTOMATION_ITEMS)} />
        <NavMain title="Configuration" items={withActiveState(configItems)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: email ? email.split("@")[0] : "Administrateur",
            email: email ?? "",
            avatar: "/alexandre-lopez-no-background.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
