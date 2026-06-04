'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Home,
  MapPin,
  Euro,
  Timer,
  MoreHorizontal,
  Eye,
  Star,
  Flag,
  ArrowUpRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface PropertyData {
  id: string
  title: string
  city: string
  zipcode: string
  price: number
  surface: number
  rooms: number
  bedrooms: number
  propertyType: string
  dpe: string | null
  status: string
  daysOnline: number
  pricePerM2: number
  tags: string[]
  lat: number
  lng: number
}

// Coordonnées approximatives des communes du Var
const CITY_COORDS: Record<string, [number, number]> = {
  'Cotignac': [43.5283, 6.1525],
  'Brignoles': [43.4067, 6.0617],
  'Saint-Maximin': [43.4533, 5.8667],
  'Barjols': [43.5583, 6.0075],
  'Carcès': [43.4750, 6.1833],
}

const PROPERTIES: PropertyData[] = [
  {
    id: '1', title: 'Maison de village 4 pièces', city: 'Cotignac', zipcode: '83570',
    price: 295000, surface: 110, rooms: 4, bedrooms: 3, propertyType: 'Maison',
    dpe: 'D', status: 'actif', daysOnline: 15, pricePerM2: 2682, tags: ['Jardin', 'Vue'],
    lat: 43.5283, lng: 6.1525,
  },
  {
    id: '2', title: 'Villa contemporaine 5 pièces', city: 'Brignoles', zipcode: '83170',
    price: 459000, surface: 160, rooms: 5, bedrooms: 4, propertyType: 'Villa',
    dpe: 'B', status: 'prix_en_baisse', daysOnline: 45, pricePerM2: 2869, tags: ['Piscine', 'Garage', 'Terrasse'],
    lat: 43.4067, lng: 6.0617,
  },
  {
    id: '3', title: 'Appartement T3 centre historique', city: 'Saint-Maximin', zipcode: '83470',
    price: 189000, surface: 72, rooms: 3, bedrooms: 2, propertyType: 'Appartement',
    dpe: 'C', status: 'nouveau', daysOnline: 2, pricePerM2: 2625, tags: ['Balcon', 'Ascenseur'],
    lat: 43.4533, lng: 5.8667,
  },
  {
    id: '4', title: 'Bastide provençale 6 pièces', city: 'Barjols', zipcode: '83670',
    price: 625000, surface: 200, rooms: 6, bedrooms: 4, propertyType: 'Bastide',
    dpe: 'E', status: 'stagne', daysOnline: 120, pricePerM2: 3125, tags: ['Piscine', 'Puits'],
    lat: 43.5583, lng: 6.0075,
  },
  {
    id: '5', title: 'Terrain constructible 800m²', city: 'Carcès', zipcode: '83570',
    price: 85000, surface: 800, rooms: 0, bedrooms: 0, propertyType: 'Terrain',
    dpe: null, status: 'opportunite', daysOnline: 30, pricePerM2: 106, tags: ['Viabilisé'],
    lat: 43.4750, lng: 6.1833,
  },
  {
    id: '6', title: 'Villa 4 pièces avec piscine', city: 'Carcès', zipcode: '83570',
    price: 385000, surface: 130, rooms: 4, bedrooms: 3, propertyType: 'Villa',
    dpe: 'C', status: 'actif', daysOnline: 8, pricePerM2: 2962, tags: ['Piscine', 'Climatisation'],
    lat: 43.4800, lng: 6.1900,
  },
  {
    id: '7', title: 'Maison de maître 7 pièces', city: 'Cotignac', zipcode: '83570',
    price: 720000, surface: 250, rooms: 7, bedrooms: 5, propertyType: 'Maison',
    dpe: 'F', status: 'prix_en_baisse', daysOnline: 90, pricePerM2: 2880, tags: ['Jardin', 'Cave', 'Grenier'],
    lat: 43.5350, lng: 6.1600,
  },
  {
    id: '8', title: 'Appartement T2 centre ville', city: 'Brignoles', zipcode: '83170',
    price: 135000, surface: 52, rooms: 2, bedrooms: 1, propertyType: 'Appartement',
    dpe: 'D', status: 'nouveau', daysOnline: 1, pricePerM2: 2596, tags: ['Centre', 'Commerces'],
    lat: 43.4100, lng: 6.0650,
  },
]

const STATUS_BADGES: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  nouveau: { label: 'Nouveau', variant: 'default' },
  actif: { label: 'Actif', variant: 'secondary' },
  prix_en_baisse: { label: 'Prix en baisse', variant: 'destructive' },
  opportunite: { label: 'Opportunité', variant: 'default' },
  stagne: { label: 'Stagne', variant: 'outline' },
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

function formatPricePerM2(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price) + '/m²'
}

export function PropertiesTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'price' | 'days' | 'surface'>('price')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const cities = [...new Set(PROPERTIES.map(p => p.city))]
  const types = [...new Set(PROPERTIES.map(p => p.propertyType))]

  const filtered = PROPERTIES
    .filter(p => {
      if (search) {
        const s = search.toLowerCase()
        if (!p.title.toLowerCase().includes(s) && !p.city.toLowerCase().includes(s)) return false
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (cityFilter !== 'all' && p.city !== cityFilter) return false
      if (typeFilter !== 'all' && p.propertyType !== typeFilter) return false
      return true
    })
    .sort((a, b) => {
      const dir = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'price') return (a.price - b.price) * dir
      if (sortBy === 'days') return (a.daysOnline - b.daysOnline) * dir
      return (a.surface - b.surface) * dir
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marché immobilier</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {PROPERTIES.length} biens surveillés sur vos zones
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un bien, une ville..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="prix_en_baisse">Prix en baisse</SelectItem>
                <SelectItem value="opportunite">Opportunité</SelectItem>
                <SelectItem value="stagne">Stagne</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {types.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="h-9">
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results + sorting */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Trier par :</span>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'price' | 'days' | 'surface')}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Prix</SelectItem>
              <SelectItem value="days">Jours en ligne</SelectItem>
              <SelectItem value="surface">Surface</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">Bien</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Localisation</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Prix</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Surface</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Prix/m²</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">DPE</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">En ligne</th>
                  <th className="w-[50px] p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((prop) => {
                  const badge = STATUS_BADGES[prop.status]
                  return (
                    <tr
                      key={prop.id}
                      className="border-b last:border-0 hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-4">
                        <Link
                          href={`/admin/market/properties/${prop.id}`}
                          className="font-medium hover:text-brand transition-colors"
                        >
                          {prop.title}
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                            {prop.propertyType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{prop.rooms} pièces</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {prop.city} ({prop.zipcode})
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatPrice(prop.price)}
                        {prop.status === 'prix_en_baisse' && (
                          <div className="flex items-center justify-end gap-0.5 text-destructive text-xs">
                            <ArrowUpRight className="h-3 w-3 rotate-180" />
                            -9.1%
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        {prop.surface} m²
                      </td>
                      <td className="p-4 text-right text-muted-foreground text-xs">
                        {formatPricePerM2(prop.pricePerM2)}
                      </td>
                      <td className="p-4 text-center">
                        {prop.dpe ? (
                          <Badge variant="outline" className={cn('text-[10px] px-1.5', DPE_COLORS[prop.dpe])}>
                            {prop.dpe}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={badge.variant} className="text-xs">
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Timer className="h-3 w-3" />
                          {prop.daysOnline}j
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" /> Détail
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" /> Marquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-amber-600">
                              <Flag className="h-4 w-4 mr-2" /> Signaler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Home className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium">Aucun bien trouvé</p>
              <p className="text-xs text-muted-foreground mt-1">Essayez de modifier vos filtres</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}