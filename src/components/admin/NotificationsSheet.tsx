'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Bell, BellDot, Check, Loader2 } from 'lucide-react'
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
  status: string
  action_label: string | null
  market_property_id: string | null
  created_at: string
}

type FilterKey = 'new_listing' | 'all'

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600',
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${days}j`
}

export function NotificationsSheet() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<FilterKey>('new_listing')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const loadCount = useCallback(async () => {
    try {
      const res = await fetch('/api/market/notifications?status=unread&limit=1')
      const data = await res.json()
      setUnreadCount(data.total ?? 0)
    } catch {
      /* silencieux : la cloche ne doit pas casser le header */
    }
  }, [])

  const loadList = useCallback(async (key: FilterKey) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '30' })
      if (key === 'new_listing') params.set('type', 'new_listing')
      const res = await fetch(`/api/market/notifications?${params}`)
      const data = await res.json()
      setNotifications(data.notifications ?? [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadCount() }, [loadCount])
  useEffect(() => { if (open) loadList(filter) }, [open, filter, loadList])

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })))
    setUnreadCount(0)
    try {
      await fetch('/api/market/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true, status: 'read' }),
      })
    } finally {
      loadCount()
    }
  }

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n)))
    setUnreadCount((c) => Math.max(0, c - 1))
    try {
      await fetch(`/api/market/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })
    } catch {
      loadCount()
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
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
          <SheetDescription>Alertes et nouveaux biens de votre marché</SheetDescription>
        </SheetHeader>

        {/* Filtre */}
        <div className="mt-4 flex items-center gap-2">
          <Button
            variant={filter === 'new_listing' ? 'primary' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setFilter('new_listing')}
          >
            Nouveaux biens
          </Button>
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setFilter('all')}
          >
            Tout
          </Button>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto" onClick={markAllRead}>
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {filter === 'new_listing' ? 'Aucun nouveau bien' : 'Aucune notification'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  'group relative rounded-lg border p-3 transition-colors hover:bg-accent/50',
                  notif.status === 'unread' && 'border-l-2 border-l-brand bg-brand/5',
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="secondary"
                    className={cn('text-[10px] px-1.5 py-0 h-4', PRIORITY_COLORS[notif.priority])}
                  >
                    {notif.priority === 'critical' ? 'Urgent' : notif.priority}
                  </Badge>
                  {notif.status === 'unread' && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                  <span className="ml-auto text-[10px] text-muted-foreground">{formatTimeAgo(notif.created_at)}</span>
                </div>
                <p className="text-sm font-medium">{notif.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                <div className="mt-2 flex items-center gap-2">
                  {notif.action_label && notif.market_property_id && (
                    <Button variant="outline" size="sm" className="h-7 text-xs" asChild onClick={() => markRead(notif.id)}>
                      <Link href={`/app/properties/${notif.market_property_id}`}>{notif.action_label}</Link>
                    </Button>
                  )}
                  {notif.status === 'unread' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Marquer comme lue"
                      onClick={() => markRead(notif.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
