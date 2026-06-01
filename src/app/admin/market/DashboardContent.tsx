'use client'

import {
  Building2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bell,
  Zap,
  Map,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Target,
  Euro,
  Home,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

// Mock data — sera remplacé par les appels API Supabase
const DASHBOARD_DATA = {
  kpis: {
    totalProperties: 247,
    newThisWeek: 12,
    activeOpportunities: 8,
    unreadNotifications: 3,
    avgPricePerM2: 2150,
    avgDaysOnline: 42,
  },
  priceTrends: [
    { label: 'Brignoles (83170)', current: 2280, previous: 2350, change: -3.0 },
    { label: 'Cotignac (83570)', current: 2650, previous: 2580, change: 2.7 },
    { label: 'Saint-Maximin (83470)', current: 1950, previous: 2020, change: -3.5 },
    { label: 'Barjols (83670)', current: 1720, previous: 1700, change: 1.2 },
  ],
  recentAlerts: [
    {
      id: '1',
      type: 'price_drop',
      title: 'Baisse significative',
      message: 'Villa à Cotignac : 395 000 € → 359 000 € (-9.1%)',
      priority: 'high',
      time: 'Il y a 2h',
    },
    {
      id: '2',
      type: 'new_listing',
      title: 'Nouveau bien',
      message: 'Appartement 3 pièces à Brignoles — 189 000 €',
      priority: 'medium',
      time: 'Il y a 4h',
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Opportunité détectée',
      message: 'Maison sous-évaluée à Saint-Maximin (2 150 €/m² vs 2 450 €/m² moyenne)',
      priority: 'high',
      time: 'Il y a 6h',
    },
    {
      id: '4',
      type: 'sync',
      title: 'Sync terminée',
      message: '15 biens mis à jour — zone 83170',
      priority: 'low',
      time: 'Il y a 12h',
    },
  ],
  recentProperties: [
    {
      id: '1',
      title: 'Maison de village 4 pièces',
      city: 'Cotignac',
      price: 295000,
      surface: 110,
      status: 'actif',
      daysOnline: 15,
    },
    {
      id: '2',
      title: 'Villa contemporaine 5 pièces',
      city: 'Brignoles',
      price: 459000,
      surface: 160,
      status: 'prix_en_baisse',
      daysOnline: 45,
    },
    {
      id: '3',
      title: 'Appartement T3 centre historique',
      city: 'Saint-Maximin',
      price: 189000,
      surface: 72,
      status: 'nouveau',
      daysOnline: 2,
    },
    {
      id: '4',
      title: 'Bastide provençale 6 pièces',
      city: 'Barjols',
      price: 625000,
      surface: 200,
      status: 'stagne',
      daysOnline: 120,
    },
    {
      id: '5',
      title: 'Terrain constructible 800m²',
      city: 'Carcès',
      price: 85000,
      surface: 800,
      status: 'opportunite',
      daysOnline: 30,
    },
  ],
}

const STATUS_BADGES: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  nouveau: { label: 'Nouveau', variant: 'default' },
  actif: { label: 'Actif', variant: 'secondary' },
  prix_en_baisse: { label: 'Prix en baisse', variant: 'destructive' },
  opportunite: { label: 'Opportunité', variant: 'default' },
  stagne: { label: 'Stagne', variant: 'outline' },
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

function formatPricePerM2(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price) + '/m²'
}

export function DashboardContent() {
  const { kpis, priceTrends, recentAlerts, recentProperties } = DASHBOARD_DATA

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vue d'ensemble de votre marché et opportunités
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Biens surveillés</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalProperties}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                +{kpis.newThisWeek} cette semaine
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prix moyen / m²</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPricePerM2(kpis.avgPricePerM2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-destructive" />
              <span className="text-xs text-destructive">-0.8% vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Opportunités</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.activeOpportunities}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="default" className="text-xs bg-amber-500 hover:bg-amber-600">
                {kpis.activeOpportunities} à traiter
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.unreadNotifications}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="destructive" className="text-xs">
                Non lues
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two columns: price trends + alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Price trends by zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution des prix par zone</CardTitle>
            <CardDescription>Prix médian au m² — 30 derniers jours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {priceTrends.map((zone) => (
              <div key={zone.label} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{zone.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatPricePerM2(zone.current)}
                    </span>
                    <span className="text-xs text-muted-foreground">vs</span>
                    <span className="text-xs text-muted-foreground">
                      {formatPricePerM2(zone.previous)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    zone.change > 0
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }
                >
                  <div className="flex items-center gap-0.5">
                    {zone.change > 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(zone.change).toFixed(1)}%
                  </div>
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alertes récentes</CardTitle>
            <CardDescription>Activité des dernières 24h</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="mt-0.5">
                  {alert.priority === 'high' ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : alert.type === 'new_listing' ? (
                    <Home className="h-4 w-4 text-brand" />
                  ) : (
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <span className="text-xs text-muted-foreground ml-auto">{alert.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs">
              Voir toutes les alertes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent properties */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Derniers biens synchronisés</CardTitle>
            <CardDescription>Les biens les plus récents sur votre marché</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Building2 className="h-4 w-4 mr-1" />
            Voir tout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Bien</th>
                  <th className="pb-3 font-medium text-muted-foreground">Ville</th>
                  <th className="pb-3 font-medium text-muted-foreground">Prix</th>
                  <th className="pb-3 font-medium text-muted-foreground">Surface</th>
                  <th className="pb-3 font-medium text-muted-foreground">Prix/m²</th>
                  <th className="pb-3 font-medium text-muted-foreground">Statut</th>
                  <th className="pb-3 font-medium text-muted-foreground">En ligne</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((prop) => {
                  const badge = STATUS_BADGES[prop.status] || { label: prop.status, variant: 'secondary' as const }
                  return (
                    <tr key={prop.id} className="border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer">
                      <td className="py-3 font-medium">{prop.title}</td>
                      <td className="py-3 text-muted-foreground">{prop.city}</td>
                      <td className="py-3 font-medium">{formatPrice(prop.price)}</td>
                      <td className="py-3 text-muted-foreground">{prop.surface} m²</td>
                      <td className="py-3 text-muted-foreground">{formatPrice(prop.price / prop.surface)}</td>
                      <td className="py-3">
                        <Badge variant={badge.variant} className="text-xs">
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {prop.daysOnline}j
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-brand/5 border-brand/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-full bg-brand/10 p-2">
              <Zap className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-sm font-medium">Synchroniser une zone</p>
              <p className="text-xs text-muted-foreground">Lancer une sync manuelle</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-full bg-amber-100 p-2">
              <Target className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Nouvelle opportunité</p>
              <p className="text-xs text-muted-foreground">Créer une opportunité manuellement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-full bg-emerald-100 p-2">
              <Map className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Ajouter une zone</p>
              <p className="text-xs text-muted-foreground">Surveiller un nouveau secteur</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}