'use client'

import { useState } from 'react'
import { Bell, BellDot, Check, Eye, Archive, X, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
        id: '1', type: 'price_drop', title: 'Baisse de prix détectée',
        message: 'Maison à Cotignac — 245 000 € → 229 000 € (-6.5%)',
        priority: 'high', status: 'unread', action_label: 'Voir le bien',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: '2', type: 'new_listing', title: 'Nouveau bien sur le marché',
        message: 'Villa 5 pièces à Brignoles — 459 000 €',
        priority: 'medium', status: 'unread', action_label: 'Analyser',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        id: '3', type: 'expired', title: 'Bien expiré',
        message: 'Appartement T3 à Saint-Maximin — 189 000 €, en ligne depuis 90 jours',
        priority: 'medium', status: 'read', action_label: null,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
        id: '4', type: 'match', title: 'Nouveau matching',
        message: 'Acheteur potentiel pour bastide Barjols (625 000 €)',
        priority: 'high', status: 'unread', action_label: 'Voir le match',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
        id: '5', type: 'system', title: 'Synchronisation terminée',
        message: 'Les données marché ont été mises à jour pour toutes les zones.',
        priority: 'low', status: 'processed', action_label: null,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
]

const PRIORITY_CONFIG = {
    low: { class: 'bg-gray-100 text-gray-600' },
    medium: { class: 'bg-blue-100 text-blue-600' },
    high: { class: 'bg-orange-100 text-orange-600' },
    critical: { class: 'bg-red-100 text-red-600' },
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
    price_drop: <ArrowUpRight className="h-4 w-4 text-red-500" />,
    new_listing: <Bell className="h-4 w-4 text-blue-500" />,
    expired: <Archive className="h-4 w-4 text-gray-500" />,
    match: <BellDot className="h-4 w-4 text-purple-500" />,
    system: <Bell className="h-4 w-4 text-slate-500" />,
}

function formatTimeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "À l'instant"
    if (mins < 60) return `Il y a ${mins} min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `Il y a ${hours}h`
    const days = Math.floor(hours / 24)
    return `Il y a ${days}j`
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    const filtered = filter === 'unread'
        ? notifications.filter((n) => n.status === 'unread')
        : notifications

    function markAsRead(id: string) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, status: 'read' as const } : n)),
        )
    }

    function markAsProcessed(id: string) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, status: 'processed' as const } : n)),
        )
    }

    function dismiss(id: string) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, status: 'ignored' as const } : n)),
        )
    }

    const unreadCount = notifications.filter((n) => n.status === 'unread').length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Alertes et opportunités
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="rounded-full">
                            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                    <div className="flex gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            Toutes
                        </Button>
                        <Button
                            variant={filter === 'unread' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('unread')}
                        >
                            Non lues
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {filtered.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                            Aucune notification
                        </CardContent>
                    </Card>
                ) : (
                    filtered.map((notif) => (
                        <Card
                            key={notif.id}
                            className={cn(
                                'transition-colors',
                                notif.status === 'unread' && 'border-l-4 border-l-brand bg-muted/20',
                            )}
                        >
                            <CardContent className="flex items-start gap-4 p-4">
                                <div className="mt-0.5 shrink-0">
                                    {TYPE_ICONS[notif.type] ?? <Bell className="h-4 w-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {notif.title}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {notif.message}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-1">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'text-[10px] px-1.5 py-0 h-5',
                                                    PRIORITY_CONFIG[notif.priority].class,
                                                )}
                                            >
                                                {notif.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] text-muted-foreground">
                                            {formatTimeAgo(notif.created_at)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {notif.status === 'unread' && (
                                                <button
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                                >
                                                    <Eye className="h-3 w-3" /> Marquer lu
                                                </button>
                                            )}
                                            {notif.status === 'read' && (
                                                <button
                                                    onClick={() => markAsProcessed(notif.id)}
                                                    className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                                >
                                                    <Check className="h-3 w-3" /> Traiter
                                                </button>
                                            )}
                                            {notif.status !== 'ignored' && notif.status !== 'processed' && (
                                                <button
                                                    onClick={() => dismiss(notif.id)}
                                                    className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                                >
                                                    <X className="h-3 w-3" /> Ignorer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}