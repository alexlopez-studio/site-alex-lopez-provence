'use client'

import { useCallback, useEffect, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import type { Json } from '@/types/supabase'

type ClientRow = {
  id: string
  title: string
  status: string
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
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createDraft, setCreateDraft] = useState(emptyCreateDraft())

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        page_size: '20',
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
  }, [pagination.page, search, status])

  useEffect(() => {
    const timer = setTimeout(() => void fetchRows(), 250)
    return () => clearTimeout(timer)
  }, [fetchRows])

  async function createClientDossier() {
    setCreating(true)
    try {
      const res = await fetch('/api/market/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            first_name: createDraft.first_name,
            last_name: createDraft.last_name,
            email: createDraft.email,
            phone: createDraft.phone,
          },
          title: createDraft.title,
          property_snapshot: {
            adresse: createDraft.adresse,
            commune: createDraft.commune,
            type_bien: createDraft.type_bien,
            surface: createDraft.surface,
            surface_terrain: createDraft.surface_terrain,
            nb_pieces: createDraft.nb_pieces,
            prix_estime: createDraft.prix_estime,
            contexte: createDraft.contexte,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Création impossible')
      setCreateOpen(false)
      setCreateDraft(emptyCreateDraft())
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
          <h1 className="app-page-title text-2xl">Clients vendeurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Dossiers partagés, documents, bien et suivi visible dans l’espace client.</p>
        </div>
        <Button className="rounded-full" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Nouveau dossier
        </Button>
      </div>

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
                        <p className="font-semibold text-foreground">Aucun dossier client trouvé</p>
                        <p className="mt-1 text-sm text-muted-foreground">Créez un dossier vendeur manuellement ou préparez un espace depuis un lead.</p>
                      </div>
                      <Button className="rounded-full" onClick={() => setCreateOpen(true)}>
                        <Plus className="mr-2 size-4" />
                        Créer le premier dossier
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : rows.map((row) => {
                const snapshot = asRecord(row.property_snapshot)
                const clientName = [row.client_profile.first_name, row.client_profile.last_name].filter(Boolean).join(' ').trim() || 'Client vendeur'
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
                        {(text(snapshot.commune) || text(snapshot.adresse)) && (
                          <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{text(snapshot.commune) || text(snapshot.adresse)}</span>
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
            <DialogTitle>Nouveau dossier client vendeur</DialogTitle>
            <DialogDescription>
              Créez un espace vendeur sans partir d’un lead. Vous pourrez compléter l’avis pro, les documents et le suivi ensuite.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <CreateField label="Prénom" value={createDraft.first_name} onChange={(value) => setCreateDraft({ ...createDraft, first_name: value })} />
              <CreateField label="Nom" value={createDraft.last_name} onChange={(value) => setCreateDraft({ ...createDraft, last_name: value })} />
              <CreateField label="Email" value={createDraft.email} onChange={(value) => setCreateDraft({ ...createDraft, email: value })} />
              <CreateField label="Téléphone" value={createDraft.phone} onChange={(value) => setCreateDraft({ ...createDraft, phone: value })} />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <CreateField label="Titre dossier" value={createDraft.title} onChange={(value) => setCreateDraft({ ...createDraft, title: value })} />
              <CreateField label="Commune" value={createDraft.commune} onChange={(value) => setCreateDraft({ ...createDraft, commune: value })} />
              <CreateField label="Adresse / secteur" value={createDraft.adresse} onChange={(value) => setCreateDraft({ ...createDraft, adresse: value })} />
              <CreateField label="Type de bien" value={createDraft.type_bien} onChange={(value) => setCreateDraft({ ...createDraft, type_bien: value })} />
              <CreateField label="Surface habitable" value={createDraft.surface} onChange={(value) => setCreateDraft({ ...createDraft, surface: value })} />
              <CreateField label="Terrain" value={createDraft.surface_terrain} onChange={(value) => setCreateDraft({ ...createDraft, surface_terrain: value })} />
              <CreateField label="Pièces" value={createDraft.nb_pieces} onChange={(value) => setCreateDraft({ ...createDraft, nb_pieces: value })} />
              <CreateField label="Prix estimé" value={createDraft.prix_estime} onChange={(value) => setCreateDraft({ ...createDraft, prix_estime: value })} />
            </div>

            <label className="space-y-1">
              <span className="text-xs font-semibold">Contexte bien</span>
              <Textarea value={createDraft.contexte} onChange={(event) => setCreateDraft({ ...createDraft, contexte: event.target.value })} rows={3} />
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>Annuler</Button>
            <Button onClick={createClientDossier} disabled={creating}>
              {creating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
              Créer le dossier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold">{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function emptyCreateDraft() {
  return {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    title: '',
    adresse: '',
    commune: '',
    type_bien: 'Maison',
    surface: '',
    surface_terrain: '',
    nb_pieces: '',
    prix_estime: '',
    contexte: '',
  }
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

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
