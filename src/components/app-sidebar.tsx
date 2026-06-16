"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpCircleIcon,
  Building2Icon,
  GitCompareArrowsIcon,
  KanbanIcon,
  LayoutDashboardIcon,
  ScrollTextIcon,
  BellIcon,
  MapIcon,
  SettingsIcon,
  UsersIcon,
  PackageIcon,
  UserPlusIcon,
  PanelLeftIcon,
  FlameIcon,
} from "lucide-react"

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
  useSidebar,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { title: "Dashboard", url: "/admin/market", icon: LayoutDashboardIcon },
  { title: "Leads", url: "/admin/market/leads", icon: UserPlusIcon },
  { title: "Liste chaude", url: "/admin/market/liste-chaude", icon: FlameIcon },
  { title: "Marché", url: "/admin/market/properties", icon: Building2Icon },
  { title: "Acquéreurs", url: "/admin/market/acheteurs", icon: UsersIcon },
  { title: "Matching", url: "/admin/market/matching", icon: GitCompareArrowsIcon },
  { title: "Opportunités", url: "/admin/market/opportunities", icon: KanbanIcon },
  { title: "Règles", url: "/admin/market/rules", icon: ScrollTextIcon },
  { title: "Notifications", url: "/admin/market/notifications", icon: BellIcon },
]

const ZONE_ITEMS = [
  { title: "Zones surveillées", url: "/admin/market/zones", icon: MapIcon },
  { title: "Paramètres", url: "/admin/market/settings", icon: SettingsIcon },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()

  const isActive = (href: string) => {
    if (href === '/admin/market') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin/market">
                <PackageIcon className="h-5 w-5 text-brand" />
                <span className="text-base font-semibold">Mandat OS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="w-full justify-start gap-2 [&>svg]:size-4 group-data-[collapsible=icon]:[&>svg]:mx-auto group-data-[collapsible=icon]:[&>svg]:ml-0 group-data-[collapsible=icon]:[&>span]:hidden" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={NAV_ITEMS.map((item) => ({
            ...item,
            isActive: isActive(item.url),
          }))}
        />
        <div className="mt-2 px-3 py-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
            Configuration
          </p>
        </div>
        <NavMain
          items={ZONE_ITEMS.map((item) => ({
            ...item,
            isActive: pathname === item.url,
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "Alexandre Lopez",
            email: "alexandre@iad.fr",
            avatar: "/alexandre-lopez-no-background.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
