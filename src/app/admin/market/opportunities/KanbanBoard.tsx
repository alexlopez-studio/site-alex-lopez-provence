'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Star,
  AlertTriangle,
  Clock,
  Phone,
  Calendar,
  User,
  Home,
  MoreHorizontal,
  ArrowUpRight,
  Building2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Opportunity {
  id: string
  title: string
  description: string
  stage: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'price_drop' | 'new_listing' | 'undervalued' | 'expired' | 'manual'
  propertyTitle: string
  propertyCity: string
  propertyPrice: number
  nextAction: string | null
  dueDate: string | null
  created_at: string
}

const STAGES = [
  { id: 'a_qualifier', label: 'À qualifier', color: 'bg-slate-500' },
  { id: 'a_analyser', label: 'À analyser', color: 'bg-blue-500' },
  { id: 'a_contacter', label: 'À contacter', color: 'bg-amber-500' },
  { id: 'contacte', label: 'Contacté', color: 'bg-purple-500' },
  { id: 'rendez_vous', label: 'RDV à préparer', color: 'bg-indigo-500' },
  { id: 'en_suivi', label: 'En suivi', color: 'bg-cyan-500' },
  { id: 'mandat_potentiel', label: 'Mandat potentiel', color: 'bg-emerald-500' },
  { id: 'converti', label: 'Converti', color: 'bg-green-600' },
  { id: 'ecarte', label: 'Écarté', color: 'bg-gray-400' },
]

const PRIORITY_CONFIG = {
  low: { label: 'Basse', class: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Moyenne', class: 'bg-blue-100 text-blue-600' },
  high: { label: 'Haute', class: 'bg-orange-100 text-orange-600' },
  critical: { label: 'Urgente', class: 'bg-red-100 text-red-600' },
}

const TYPE_CONFIG = {
  price_drop: { label: 'Baisse de prix', icon: AlertTriangle, class: 'bg-red-50 text-red-700 border-red-200' },
  new_listing: { label: 'Nouveau bien', icon: Home, class: 'bg-blue-50 text-blue-700 border-blue-200' },
  undervalued: { label: 'Sous-évalué', icon: Star, class: 'bg-amber-50 text-amber-700 border-amber-200' },
  expired: { label: 'Expiré', icon: Clock, class: 'bg-gray-50 text-gray-700 border-gray-200' },
  manual: { label: 'Manuel', icon: User, class: 'bg-purple-50 text-purple-700 border-purple-200' },
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Villa contemporaine — baisse de 9.1%',
    description: 'Bien passé de 505k€ à 459k€. Bonne opportunité de mandat.',
    stage: 'a_contacter',
    priority: 'high',
    type: 'price_drop',
    propertyTitle: 'Villa contemporaine 5 pièces',
    propertyCity: 'Brignoles',
    propertyPrice: 459000,
    nextAction: 'Appeler le vendeur',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'opp-2',
    title: 'Nouveau bien à Saint-Maximin',
    description: 'Appartement T3 à 189k€. Premier sur le marché.',
    stage: 'a_analyser',
    priority: 'medium',
    type: 'new_listing',
    propertyTitle: 'Appartement T3 centre historique',
    propertyCity: 'Saint-Maximin',
    propertyPrice: 189000,
    nextAction: 'Analyser le DPE',
    dueDate: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'opp-3',
    title: 'Bastide Barjols — sous-évaluée',
    description: 'Prix/m² à 3125€ vs 3450€ moyenne. Vendeur potentiellement pressé.',
    stage: 'a_qualifier',
    priority: 'critical',
    type: 'undervalued',
    propertyTitle: 'Bastide provençale 6 pièces',
    propertyCity: 'Barjols',
    propertyPrice: 625000,
    nextAction: 'Estimation rapide',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
  {
    id: 'opp-4',
    title: 'Terrain Carcès — viabilisé',
    description: 'Terrain 800m² à 85k€. Forte demande dans ce secteur.',
    stage: 'en_suivi',
    priority: 'low',
    type: 'manual',
    propertyTitle: 'Terrain constructible 800m²',
    propertyCity: 'Carcès',
    propertyPrice: 85000,
    nextAction: 'Contacter mairie pour PLU',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'opp-5',
    title: 'Maison Cotignac — 120 jours en ligne',
    description: 'Bien qui stagne depuis 4 mois. Vendeur probablement ouvert à discussion.',
    stage: 'a_contacter',
    priority: 'medium',
    type: 'expired',
    propertyTitle: 'Maison de maître 7 pièces',
    propertyCity: 'Cotignac',
    propertyPrice: 720000,
    nextAction: 'Proposition de mandat',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'opp-6',
    title: 'Villa Carcès avec piscine',
    description: 'Bien récent (8j), bien valorisé. Surveiller évolution.',
    stage: 'a_analyser',
    priority: 'medium',
    type: 'new_listing',
    propertyTitle: 'Villa 4 pièces avec piscine',
    propertyCity: 'Carcès',
    propertyPrice: 385000,
    nextAction: 'Comparer avec estima',
    dueDate: null,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'opp-7',
    title: 'Appartement Brignoles — bon plan',
    description: 'T2 à 135k€ en centre-ville. Excellent rapport qualité-prix.',
    stage: 'rendez_vous',
    priority: 'high',
    type: 'undervalued',
    propertyTitle: 'Appartement T2 centre ville',
    propertyCity: 'Brignoles',
    propertyPrice: 135000,
    nextAction: 'Préparer visite',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'opp-8',
    title: 'Maison Cotignac — suivi client',
    description: 'Client intéressé. Envoyer sélection de biens similaires.',
    stage: 'en_suivi',
    priority: 'high',
    type: 'manual',
    propertyTitle: 'Maison de village 4 pièces',
    propertyCity: 'Cotignac',
    propertyPrice: 295000,
    nextAction: 'Envoyer sélection',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatDaysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  return `Il y a ${days}j`
}

export function KanbanBoard() {
  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES)

  const getStageOpps = (stageId: string) =>
    opportunities.filter((o) => o.stage === stageId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opportunités</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {opportunities.length} opportunités en cours — pipeline de mandats
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle opportunité
        </Button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
        {STAGES.slice(0, 7).map((stage) => {
          const stageOpps = getStageOpps(stage.id)
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-72"
            >
              {/* Stage header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                  <span className="text-sm font-medium">{stage.label}</span>
                  <span className="text-xs text-muted-foreground">({stageOpps.length})</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Cards */}
              <div className="space-y-3 min-h-[200px]">
                {stageOpps.map((opp) => {
                  const typeCfg = TYPE_CONFIG[opp.type]
                  const priorityCfg = PRIORITY_CONFIG[opp.priority]
                  const TypeIcon = typeCfg.icon
                  return (
                    <Card key={opp.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        {/* Type badge */}
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', typeCfg.class)}>
                            <TypeIcon className="h-3 w-3 mr-1" />
                            {typeCfg.label}
                          </Badge>
                          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', priorityCfg.class)}>
                            {priorityCfg.label}
                          </Badge>
                        </div>

                        {/* Title */}
                        <p className="text-sm font-medium leading-tight mb-1">
                          {opp.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {opp.description}
                        </p>

                        {/* Property info */}
                        <div className="rounded-md bg-muted/30 p-2 mb-3">
                          <p className="text-xs font-medium truncate">{opp.propertyTitle}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-muted-foreground">{opp.propertyCity}</span>
                            <span className="text-xs font-medium">{formatPrice(opp.propertyPrice)}</span>
                          </div>
                        </div>

                        {/* Next action */}
                        {opp.nextAction && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                            <ArrowUpRight className="h-3 w-3" />
                            {opp.nextAction}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{formatDaysAgo(opp.created_at)}</span>
                          {opp.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(opp.dueDate)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend for completed/ignored */}
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <div>
                <p className="text-sm font-medium">Converti en mandat</p>
                <p className="text-xs text-muted-foreground">2 mandats signés ce mois-ci</p>
              </div>
            </div>
            <Badge variant="secondary">+25% vs mois dernier</Badge>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <div>
                <p className="text-sm font-medium">Écarté</p>
                <p className="text-xs text-muted-foreground">5 opportunités écartées</p>
              </div>
            </div>
            <Badge variant="outline">Taux : 28%</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}