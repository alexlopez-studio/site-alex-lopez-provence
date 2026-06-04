'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Home,
  MapPin,
  Euro,
  Maximize2,
  Bed,
  Bath,
  Ruler,
  Zap,
  Calendar,
  Clock,
  TrendingDown,
  AlertTriangle,
  Star,
  FileText,
  Plus,
  ChevronLeft,
  Building2,
  ExternalLink,
  Tag,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const MOCK_PROPERTY = {
  id: '2',
  title: 'Villa contemporaine 5 pièces',
  city: 'Brignoles',
  zipcode: '83170',
  address: 'Chemin des Oliviers, 83170 Brignoles',
  price: 459000,
  originalPrice: 505000,
  surface: 160,
  landSurface: 800,
  rooms: 5,
  bedrooms: 4,
  bathrooms: 2,
  propertyType: 'Villa',
  dpe: 'B',
  ges: 'A',
  description: 'Magnifique villa contemporaine construite en 2020, située dans un quartier calme et recherché de Brignoles. Profitez d\'une vue dégagée sur la campagne environnante depuis la grande terrasse. Prestations haut de gamme : cuisine équipée, climatisation réversible, piscine chauffée, garage double.',
  status: 'prix_en_baisse' as const,
  firstSeenAt: '2026-04-15',
  lastSeenAt: '2026-06-01',
  publishedAt: '2026-04-15',
  daysOnline: 45,
  pricePerM2: 2869,
  url: 'https://example.com/bien/2',
  tags: ['Piscine', 'Garage', 'Terrasse', 'Climatisation', 'Vue dégagée'],
  priceHistory: [
    { date: '2026-05-20', price: 459000, change: -46000, changePercent: -9.1 },
    { date: '2026-04-15', price: 505000, change: 0, changePercent: 0 },
  ],
  opportunities: [
    { id: 'o1', title: 'Baisse significative — potentiel mandat', stage: 'À contacter', priority: 'high' },
  ],
}

const DPE_COLORS: Record<string, string> = {
  A: 'bg-green-100 text-green-700 border-green-200',
  B: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  D: 'bg-orange-100 text-orange-700 border-orange-200',
  E: 'bg-red-100 text-red-700 border-red-200',
  F: 'bg-red-200 text-red-800 border-red-300',
  G: 'bg-red-300 text-red-900 border-red-400',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface BuyerMatch {
  buyer_lead_id: string
  score: number
  score_details: {
    commune: number
    type: number
    budget: number
    surface: number
    pieces: number
  }
  matched_commune: boolean
  matched_type: boolean
  matched_budget: boolean
  matched_surface: boolean
  matched_pieces: boolean
}

export function PropertyDetail() {
  const params = useParams()
  const router = useRouter()
  const property = MOCK_PROPERTY
  const propertyId = params.id as string

  // Charger les acheteurs potentiels pour ce bien
  const [potentialBuyers, setPotentialBuyers] = useState<BuyerMatch[]>([])
  const [loadingMatches, setLoadingMatches] = useState(false)

  useEffect(() => {
    if (!propertyId) return
    setLoadingMatches(true)
    fetch(`/api/market/matching?property_id=${propertyId}&limit=10&min_score=40`)
      .then((res) => res.ok ? res.json() : { matches: [] })
      .then((data) => setPotentialBuyers(data.matches ?? []))
      .catch(() => setPotentialBuyers([]))
      .finally(() => setLoadingMatches(false))
  }, [propertyId])

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/admin/market/properties"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour au marché
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{property.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-1" />
            Voir l'annonce
          </Button>
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-1" />
            Favori
          </Button>
        </div>
      </div>

      {/* Key info cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prix actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatPrice(property.price)}</div>
            {property.originalPrice && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-destructive" />
                <span className="text-xs text-destructive">
                  -{((property.originalPrice - property.price) / property.originalPrice * 100).toFixed(1)}% (était {formatPrice(property.originalPrice)})
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Surface</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.surface} m²</div>
            <p className="text-xs text-muted-foreground mt-1">
              Terrain : {property.landSurface} m²
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prix / m²</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(property.pricePerM2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              vs {formatPrice(2450)} moyenne zone
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En ligne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {property.daysOnline} jours
              {property.daysOnline > 30 && (
                <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200 text-xs">
                  Stagne
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Publié le {formatDate(property.publishedAt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Characteristics */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="rounded-full bg-muted/30 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-bold">{property.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Chambres</p>
                </div>
                <div className="text-center">
                  <div className="rounded-full bg-muted/30 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Bath className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-bold">{property.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Salles de bain</p>
                </div>
                <div className="text-center">
                  <div className="rounded-full bg-muted/30 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Ruler className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-bold">{property.surface} m²</p>
                  <p className="text-xs text-muted-foreground">Surface habitable</p>
                </div>
                <div className="text-center">
                  <div className="rounded-full bg-muted/30 w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {property.dpe ? (
                    <>
                      <Badge variant="outline" className={cn('text-sm px-2 py-0', DPE_COLORS[property.dpe])}>
                        {property.dpe}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">DPE</p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-3">Non disponible</p>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {property.propertyType}
                </Badge>
                {property.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Price history */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des prix</CardTitle>
              <CardDescription>Évolution du prix de ce bien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {property.priceHistory.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{formatDate(entry.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {i === property.priceHistory.length - 1 ? 'Mise en vente initiale' : 'Baisse de prix'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatPrice(entry.price)}</p>
                      {entry.change !== 0 && (
                        <p className="text-xs text-destructive">
                          {formatPrice(Math.abs(entry.change))} ({entry.changePercent}%)
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Situation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant="destructive">Prix en baisse</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Première détection</span>
                <span className="text-sm">{formatDate(property.firstSeenAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dernière mise à jour</span>
                <span className="text-sm">{formatDate(property.lastSeenAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Alerte */}
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Baisse détectée</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ce bien a baissé de 9.1% depuis sa mise en vente. C'est le moment idéal pour contacter le vendeur.
                  </p>
                  <Button size="sm" className="mt-3 h-8 text-xs">
                    Créer une opportunité
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acquéreurs potentiels — cross-reference matching */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Acquéreurs potentiels
              </CardTitle>
              <CardDescription className="text-[11px]">
                Leads acheteurs dont les critères matchent ce bien
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingMatches ? (
                <p className="text-xs text-muted-foreground">Chargement...</p>
              ) : potentialBuyers.length === 0 ? (
                <p className="text-xs text-muted-foreground">Aucun acquéreur potentiel trouvé</p>
              ) : (
                <div className="space-y-2">
                  {potentialBuyers.map((match) => (
                    <div
                      key={match.buyer_lead_id}
                      className="rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Acquéreur #{match.buyer_lead_id.slice(0, 8)}</span>
                        <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${
                          match.score >= 80 ? 'text-green-600 bg-green-50 border-green-200' : 'text-amber-600 bg-amber-50 border-amber-200'
                        }`}>
                          {match.score}%
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {match.matched_commune && <span className="text-[10px] text-muted-foreground">📍 Commune</span>}
                        {match.matched_type && <span className="text-[10px] text-muted-foreground">🏠 Type</span>}
                        {match.matched_budget && <span className="text-[10px] text-muted-foreground">💰 Budget</span>}
                        {match.matched_surface && <span className="text-[10px] text-muted-foreground">📐 Surface</span>}
                        {match.matched_pieces && <span className="text-[10px] text-muted-foreground">🚪 Pièces</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opportunités liées */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Opportunités liées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {property.opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <Star className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{opp.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">
                          {opp.stage}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px]',
                            opp.priority === 'high' && 'bg-orange-50 text-orange-700 border-orange-200'
                          )}
                        >
                          {opp.priority === 'high' ? 'Haute priorité' : opp.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Ajouter une note
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              Créer une opportunité
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Ajouter une note
            </Button>
            <Button variant="ghost" className="w-full text-muted-foreground">
              <Tag className="h-4 w-4 mr-2" />
              Gérer les tags
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}