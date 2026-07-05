'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, FileText, Loader2, Mail, MapPin, Plus, Search, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Json } from '@/types/supabase'

type ClientRow = {
  id: string
  title: string
  status: string
  client_type: string
  buyer_lead_id: string | null
  property_snapshot: Json
  updated_at: string
  client_profile: {
    email: string
    first_name: string
    last_name: string
    phone: string | null
    is_active: boolean
  }
  stats: {
    documents_total: number
    documents_missing: number
    documents_validated: number
    last_activity_at: string | null
  }
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type SellerCandidate = {
  id: string
  lead_id: string | null
  title: string | null
  stage: string | null
  seller_name: string | null
  seller_phone: string | null
  seller_email: string | null
  property_city: string | null
  property_type: string | null
  updated_at: string
  created_at: string
  property: { title: string | null; city: string | null; price: number | null } | null
}

type BuyerCandidate = {
  id: string
  lead_id: string
  type_bien: string | null
  communes: string[] | null
  budget_max: number | null
  surface_min: number | null
  pieces_min: number | null
  active: boolean
  stage: string | null
  updated_at: string
  created_at: string
}

type ClientCandidate = {
  id: string
  title: string
  contact: string
  project: string
  meta: string
  updatedAt: string
  href: string
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  active: 'Actif',
  archived: 'Archivé',
}

export default function ClientsPage() {
  const router = useRouter()
  const [rows, setRows] = useState<ClientRow[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 20, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [clientType, setClientType] = useState<'seller' | 'buyer'>('seller')
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [candidateSearch, setCandidateSearch] = useState('')
  const [candidateLoading, setCandidateLoading] = useState(false)
  const [sellerCandidates, setSellerCandidates] = useState<SellerCandidate[]>([])
  const [buyerCandidates, setBuyerCandidates] = useState<BuyerCandidate[]>([])
  const [selectedCandidateId, setSelectedCandidateId] = useState('')

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        page_size: '20',
        client_type: clientType,
      })
      if (search.trim()) params.set('q', search.trim())
      if (status) params.set('status', status)

      const res = await fetch('/api/market/clients?' + params.toString())
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Erreur API')
      setRows(json.data ?? [])
      setPagination(json.pagination)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, search, status, clientType])

  useEffect(() => {
    const timer = setTimeout(() => void fetchRows(), 250)
    return () => clearTimeout(timer)
  }, [fetchRows])

  const loadClientCandidates = useCallback(async () => {
    setCandidateLoading(true)
    try {
      if (clientType === 'seller') {
        const params = new URLSearchParams({ stage: 'Mandat signé', limit: '100', sort: 'updated_at.desc' })
        const res = await fetch('/api/market/opportunities?' + params.toString())
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Chargement impossible')
        setSellerCandidates(json.opportunities ?? [])
      } else {
        const params = new URLSearchParams({ active: 'all', limit: '200' })
        const res = await fetch('/api/market/buyers?' + params.toString())
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Chargement impossible')
        setBuyerCandidates((json.buyers ?? []).filter((buyer: BuyerCandidate) => buyer.stage === 'Mandat de recherche signé'))
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Impossible de charger les opportunités signées')
    } finally {
      setCandidateLoading(false)
    }
  }, [clientType])

  useEffect(() => {
    if (!createOpen) return
    setSelectedCandidateId('')
    setCandidateSearch('')
    void loadClientCandidates()
  }, [createOpen, clientType, loadClientCandidates])

  const clientCandidates = useMemo<ClientCandidate[]>(() => {
    const query = candidateSearch.trim().toLowerCase()
    const rows = clientType === 'seller'
      ? sellerCandidates.map((candidate) => {
          const contact = candidate.seller_name || candidate.seller_phone || candidate.seller_email || 'Contact vendeur'
          const project = [
            candidate.property?.title || candidate.property_type || 'Bien vendeur',
            candidate.property?.city || candidate.property_city,
          ].filter(Boolean).join(' · ')
          return {
            id: candidate.id,
            title: candidate.title || 'Opportunité vendeur signée',
            contact,
            project,
            meta: candidate.lead_id ? 'Mandat signé' : 'Contact à rattacher',
            updatedAt: candidate.updated_at || candidate.created_at,
            href: `/app/opportunities/${candidate.id}`,
          }
        })
      : buyerCandidates.map((candidate) => {
          const communes = candidate.communes?.slice(0, 3).join(', ')
          const criteria = [
            candidate.type_bien || 'Recherche acquéreur',
            communes,
            candidate.budget_max ? formatPrice(candidate.budget_max) : null,
          ].filter(Boolean).join(' · ')
          return {
            id: candidate.lead_id,
            title: candidate.type_bien ? `Recherche ${candidate.type_bien}` : 'Opportunité acquéreur signée',
            contact: candidate.lead_id,
            project: criteria || 'Critères acquéreur',
            meta: 'Mandat de recherche signé',
            updatedAt: candidate.updated_at || candidate.created_at,
            href: `/app/acheteurs/${candidate.lead_id}`,
          }
        })

    if (!query) return rows
    return rows.filter((row) => [row.title, row.contact, row.project, row.meta].join(' ').toLowerCase().includes(query))
  }, [buyerCandidates, candidateSearch, clientType, sellerCandidates])

  async function createClientFromOpportunity() {
    if (!selectedCandidateId) {
      toast.error('Sélectionne une opportunité signée')
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/market/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientType === 'seller'
          ? { client_type: 'seller', opportunity_id: selectedCandidateId }
          : { client_type: 'buyer', buyer_lead_id: selectedCandidateId }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Création impossible')
      setCreateOpen(false)
      setSelectedCandidateId('')
      router.push(`/app/clients/${json.data.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Création impossible')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="app-page-title text-2xl">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">Dossiers post-mandat, côté vendeurs et acquéreurs.</p>
        </div>
        <Button className="rounded-full" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Nouveau client {clientType === 'buyer' ? 'acquéreur' : 'vendeur'}
        </Button>
      </div>

      <Tabs value={clientType} onValueChange={(value) => {
        setPagination((p) => ({ ...p, page: 1 }))
        setClientType(value === 'buyer' ? 'buyer' : 'seller')
      }}>
        <TabsList>
          <TabsTrigger value="seller">Vendeurs</TabsTrigger>
          <TabsTrigger value="buyer">Acquéreurs</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setPagination((p) => ({ ...p, page: 1 }))
              setSearch(event.target.value)
            }}
            placeholder="Rechercher client, email, bien, commune..."
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(event) => {
            setPagination((p) => ({ ...p, page: 1 }))
            setStatus(event.target.value)
          }}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">Tous statuts</option>
          <option value="active">Actifs</option>
          <option value="draft">Brouillons</option>
          <option value="archived">Archivés</option>
        </select>
        <Button className="rounded-full" variant="outline" onClick={() => void fetchRows()}>Actualiser</Button>
      </div>

      <div className="app-panel rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bien</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Documents</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Activité</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Dossier</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Chargement...</td></tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="mx-auto max-w-md space-y-3">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-brand-light text-brand">
                        <UserRound className="size-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Aucun client trouvé</p>
                        <p className="mt-1 text-sm text-muted-foreground">Créez un client depuis une opportunité avec mandat signé.</p>
                      </div>
                      <Button className="rounded-full" onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 size-4" />
                        Créer le premier client
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : rows.map((row) => {
                const snapshot = asRecord(row.property_snapshot)
                const clientName = [row.client_profile.first_name, row.client_profile.last_name].filter(Boolean).join(' ').trim() || (row.client_type === 'buyer' ? 'Client acquéreur' : 'Client vendeur')
                const communes = Array.isArray(snapshot.communes) ? snapshot.communes.filter((value): value is string => typeof value === 'string') : []
                const location = text(snapshot.commune) || text(snapshot.adresse) || communes.slice(0, 3).join(', ')
                return (
                  <tr key={row.id} className="border-b transition-colors last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                          <UserRound className="size-4" />
                        </span>
                        <div className="min-w-[180px]">
                          <div className="font-semibold text-foreground">{clientName}</div>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><Mail className="size-3" />{row.client_profile.email}</span>
                            <Badge variant="outline">{STATUS_LABELS[row.status] ?? row.status}</Badge>
                          </div>
                          <Link href={`/app/clients/${row.id}`} className="mt-2 inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold text-foreground lg:hidden">
                            Ouvrir
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{text(snapshot.type_bien) || row.title}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {location && (
                          <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{location}</span>
                        )}
                        {numberValue(snapshot.surface) && <span>{numberValue(snapshot.surface)} m²</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1">
                        <FileText className="size-4 text-brand" />
                        <span>{row.stats.documents_validated}/{row.stats.documents_total} validés</span>
                      </div>
                      {row.stats.documents_missing > 0 && (
                        <div className="mt-1 text-xs text-amber-700">{row.stats.documents_missing} à traiter</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(row.stats.last_activity_at ?? row.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="outline" size="sm" className="rounded-full">
                        <Link href={`/app/clients/${row.id}`}>Ouvrir</Link>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="text-xs text-muted-foreground">Page {pagination.page} / {pagination.totalPages}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau client {clientType === 'buyer' ? 'acquéreur' : 'vendeur'}</DialogTitle>
            <DialogDescription>
              Sélectionnez une opportunité signée. Le client sera créé ou rattaché automatiquement avec les informations déjà saisies.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={candidateSearch}
                onChange={(event) => setCandidateSearch(event.target.value)}
                placeholder={clientType === 'buyer' ? 'Rechercher acquéreur, commune, critères...' : 'Rechercher vendeur, commune, bien...'}
                className="pl-9"
              />
            </div>

            <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-lg border p-2">
              {candidateLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Chargement des opportunités signées
                </div>
              ) : clientCandidates.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Aucune opportunité signée disponible. Passez d’abord une opportunité en mandat signé.
                </div>
              ) : clientCandidates.map((candidate) => {
                const selected = selectedCandidateId === candidate.id
                return (
                  <div
                    key={candidate.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      setSelectedCandidateId(candidate.id)
                    }}
                    className={cn(
                      'w-full cursor-pointer rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                      selected ? 'border-brand bg-brand-light/40' : 'border-border',
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-foreground">{candidate.title}</p>
                          <Badge variant="outline">{candidate.meta}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{candidate.contact}</p>
                        <p className="mt-2 text-sm">{candidate.project}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-start gap-2 text-xs text-muted-foreground sm:items-end">
                        <span>{formatDate(candidate.updatedAt)}</span>
                        <Link
                          href={candidate.href}
                          className="rounded-md border px-2 py-1 font-semibold text-foreground"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Ouvrir
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>Annuler</Button>
            <Button onClick={createClientFromOpportunity} disabled={creating || !selectedCandidateId}>
              {creating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
              Créer le client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function asRecord(value: Json): Record<string, Json | undefined> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
