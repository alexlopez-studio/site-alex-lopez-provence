'use client'

import { useState } from 'react'
import { Bell, BellDot, X, Check, Eye, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'unread' | 'read' | 'processed' | 'ignored'
  action_label: string | null
  created_at: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'price_drop',
    title: 'Baisse de prix détectée',
    message: 'Maison à Cotignac — 245 000 € → 229 000 € (-6.5%)',
    priority: 'high',
    status: 'unread',
    action_label: 'Voir le bien',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '2',
    type: 'new_listing',
    title: 'Nouveau bien sur le marché',
    message: 'Appartement 3 pièces à Brignoles — 189 000 €',
    priority: 'medium',
    status: 'unread',
    action_label: 'Analyser',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'Opportunité identifiée',
    message: 'Bien sous-évalué à Saint-Maximin — potentiel mandat',
    priority: 'critical',
    status: 'unread',
    action_label: 'Voir opportunité',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    type: 'sync_complete',
    title: 'Synchronisation terminée',
    message: '15 biens mis à jour pour la zone 83170 (Brignoles)',
    priority: 'low',
    status: 'read',
    action_label: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
]

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600',
}

function formatTimeAgo(dateStr: string) {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `il y a ${minutes} min`
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${days}j`
}

export function NotificationsSheet() {
  const [open, setOpen] = useState(false)
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.status === 'unread').length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {unreadCount} non lues
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Alertes et notifications de votre marché
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <div className="space-y-2">
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            MOCK_NOTIFICATIONS.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  'group relative rounded-lg border p-3 transition-colors hover:bg-accent/50',
                  notif.status === 'unread' && 'border-l-2 border-l-brand bg-brand/5'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px] px-1.5 py-0 h-4',
                          PRIORITY_COLORS[notif.priority]
                        )}
                      >
                        {notif.priority === 'critical' ? 'Urgent' : notif.priority}
                      </Badge>
                      {notif.status === 'unread' && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      )}
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        {formatTimeAgo(notif.created_at)}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                </div>
                {notif.action_label && (
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      {notif.action_label}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {MOCK_NOTIFICATIONS.length > 0 && (
          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Check className="h-3.5 w-3.5 mr-1" />
              Tout marquer comme lu
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}