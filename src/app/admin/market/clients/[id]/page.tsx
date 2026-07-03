'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Download, FileUp, Loader2, Plus, Save, Send, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { ClientDocumentStatus, Json } from '@/types/supabase'

type ClientDetail = {
  dossier: {
    id: string
    title: string
    status: string
    advisor_note: string | null
    property_snapshot: Json
    professional_opinion: Json
    client_profile: {
      email: string
      first_name: string
      last_name: string
      phone: string | null
      is_active: boolean
    }
  }
  documents: ClientDocument[]
  events: ClientEvent[]
  lead: { id: string; next_action: string | null } | null
  opportunity: { id: string; title: string; stage: string | null; next_action: string | null } | null
}

type ClientDocument = {
  id: string
  label: string
  category: string
  status: ClientDocumentStatus
  file_name: string | null
  signed_url: string | null
  notes: string | null
  uploaded_at: string | null
  validated_at: string | null
}

type ClientEvent = {
  id: string
  type: string
  title: string
  description: string | null
  status: string
  event_date: string | null
  payload: Json
  visible_to_client: boolean
}

type Draft = {
  title: string
  status: string
  advisor_note: string
  first_name: string
  last_name: string
  email: string
  phone: string
}

type PropertyDraft = Record<string, string>
type ProfessionalDraft = {
  price: string
  price_low: string
  price_high: string
  commission_rate: string
  summary: string
  arguments: string
  comparables_json: string
}

const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  missing: 'Manquant',
  requested: 'Demandé',
  uploaded: 'Reçu',
  validated: 'Validé',
  rejected: 'Rejeté',
}

const PROPERTY_FIELDS = [
  ['adresse', 'Adresse / secteur'],
  ['commune', 'Commune'],
  ['type_bien', 'Type de bien'],
  ['surface', 'Surface habitable'],
  ['surface_terrain', 'Terrain'],
  ['nb_pieces', 'Pièces'],
  ['dpe', 'DPE'],
  ['etat', 'État général'],
  ['prix_estime', 'Prix estimé'],
  ['fourchette_basse', 'Fourchette basse'],
  ['fourchette_haute', 'Fourchette haute'],
  ['equipements', 'Équipements'],
  ['contexte', 'Contexte / notes bien'],
] as const

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [data, setData] = useState<ClientDetail | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [propertyDraft, setPropertyDraft] = useState<PropertyDraft>({})
  const [professionalDraft, setProfessionalDraft] = useState<ProfessionalDraft>(emptyProfessionalDraft())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [newDoc, setNewDoc] = useState({ label: '', category: 'general' })
  const [newEvent, setNewEvent] = useState(emptyEventDraft())
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/market/clients/' + id)
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Erreur API')
      setData(json.data)
      setDraft(draftFromData(json.data))
      setPropertyDraft(propertyFromData(json.data))
      setProfessionalDraft(professionalFromData(json.data))
    } catch (err) {
      console.error('[ClientDetailPage] fetch:', err)
      toast.error('Impossible de charger le dossier client')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetchDetail()
  }, [fetchDetail])

  const clientName = useMemo(() => {
    if (!data) return 'Client vendeur'
    return [data.dossier.client_profile.first_name, data.dossier.client_profile.last_name].filter(Boolean).join(' ').trim() || 'Client vendeur'
  }, [data])

  async function saveDossier() {
    if (!draft) return
    setSaving(true)
    try {
      const res = await fetch('/api/market/clients/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            first_name: draft.first_name,
            last_name: draft.last_name,
            email: draft.email,
            phone: draft.phone,
          },
          dossier: {
            title: draft.title,
            status: draft.status,
            advisor_note: draft.advisor_note,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Erreur API')
      toast.success('Dossier sauvegardé')
      await fetchDetail()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sauvegarde impossible')
    } finally {
      setSaving(false)
    }
  }

  async function saveProperty() {
    setSaving(true)
    try {
      const res = await fetch('/api/market/clients/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_snapshot: normalizeProperty(propertyDraft) }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Erreur API')
      toast.success('Bien sauvegardé')
      await fetchDetail()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sauvegarde impossible')
    } finally {
      setSaving(false)
    }
  }

  async function saveProfessionalOpinion() {
    setSaving(true)
    try {
      const res = await fetch('/api/market/clients/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossier: {
            professional_opinion: normalizeProfessionalOpinion(professionalDraft),
          },
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Erreur API')
      toast.success('Avis pro sauvegardé')
      await fetchDetail()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sauvegarde impossible')
    } finally {
      setSaving(false)
    }
  }

  async function inviteClient() {
    setInviting(true)
    try {
      const res = await fetch(`/api/market/clients/${id}/invite`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Erreur API')
      if (json.data?.action_link) {
        await navigator.clipboard?.writeText(json.data.action_link)
        toast.success('Lien copié')
      } else {
        toast.success('Invitation envoyée')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invitation impossible')
    } finally {
      setInviting(false)
    }
  }

  async function addDocument() {
    if (!newDoc.label.trim()) return
    const res = await fetch(`/api/market/clients/${id}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoc),
    })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Ajout impossible')
    setNewDoc({ label: '', category: 'general' })
    await fetchDetail()
  }

  async function updateDocument(documentId: string, patch: Record<string, unknown>) {
    const res = await fetch(`/api/market/clients/${id}/documents`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: documentId, ...patch }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Mise à jour impossible')
    await fetchDetail()
  }

  async function deleteDocument(documentId: string) {
    const res = await fetch(`/api/market/clients/${id}/documents?id=${encodeURIComponent(documentId)}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Suppression impossible')
    await fetchDetail()
  }

  async function uploadDocument(document: ClientDocument | null, file: File | null) {
    if (!file) return
    setUploadingId(document?.id ?? 'new')
    try {
      const body = new FormData()
      if (document) body.set('document_id', document.id)
      body.set('label', document?.label ?? file.name)
      body.set('category', document?.category ?? 'general')
      body.set('file', file)
      const res = await fetch(`/api/market/clients/${id}/documents/upload`, { method: 'POST', body })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Upload impossible')
      await fetchDetail()
      toast.success('Document ajouté')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload impossible')
    } finally {
      setUploadingId(null)
    }
  }

  async function addEvent() {
    if (!newEvent.title.trim()) return
    const res = await fetch(`/api/market/clients/${id}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newEvent.title,
        description: newEvent.description,
        type: newEvent.type,
        status: newEvent.status,
        event_date: newEvent.event_date,
        visible_to_client: newEvent.visible_to_client,
        payload: normalizeEventPayload(newEvent),
      }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Ajout impossible')
    setNewEvent(emptyEventDraft())
    await fetchDetail()
  }

  async function updateEvent(eventId: string, patch: Record<string, unknown>) {
    const res = await fetch(`/api/market/clients/${id}/events`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: eventId, ...patch }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Mise à jour impossible')
    await fetchDetail()
  }

  async function deleteEvent(eventId: string) {
    const res = await fetch(`/api/market/clients/${id}/events?id=${encodeURIComponent(eventId)}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Suppression impossible')
    await fetchDetail()
  }

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Chargement du dossier...</div>
  if (!data || !draft) {
    return (
      <div className="space-y-3 p-8">
        <p className="text-sm text-muted-foreground">Dossier introuvable.</p>
        <Button variant="outline" onClick={() => router.push('/app/clients')}>Retour</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/app/clients" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Clients
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{data.dossier.title}</h1>
            <Badge variant="outline">{data.dossier.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{clientName} · {data.dossier.client_profile.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={inviteClient} disabled={inviting}>
            {inviting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
            Inviter
          </Button>
          <Button onClick={saveDossier} disabled={saving}>
            {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dossier" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="dossier">Dossier</TabsTrigger>
          <TabsTrigger value="bien">Bien</TabsTrigger>
          <TabsTrigger value="estimation">Avis pro</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="suivi">Suivi</TabsTrigger>
        </TabsList>

        <TabsContent value="dossier" className="space-y-4">
          <Section title="Client et accès">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Prénom" value={draft.first_name} onChange={(value) => setDraft({ ...draft, first_name: value })} />
              <Field label="Nom" value={draft.last_name} onChange={(value) => setDraft({ ...draft, last_name: value })} />
              <Field label="Email" value={draft.email} onChange={(value) => setDraft({ ...draft, email: value })} />
              <Field label="Téléphone" value={draft.phone} onChange={(value) => setDraft({ ...draft, phone: value })} />
            </div>
          </Section>
          <Section title="Dossier visible client">
            <div className="grid gap-3 md:grid-cols-[1fr_180px]">
              <Field label="Titre" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
              <label className="block space-y-1">
                <span className="text-xs font-semibold">Statut</span>
                <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="draft">Brouillon</option>
                  <option value="active">Actif</option>
                  <option value="archived">Archivé</option>
                </select>
              </label>
            </div>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-semibold">Note conseiller</span>
              <Textarea value={draft.advisor_note} onChange={(event) => setDraft({ ...draft, advisor_note: event.target.value })} rows={4} />
            </label>
          </Section>
        </TabsContent>

        <TabsContent value="bien" className="space-y-4">
          <Section title="Informations du bien">
            <div className="grid gap-3 md:grid-cols-2">
              {PROPERTY_FIELDS.map(([key, label]) => (
                key === 'contexte' || key === 'equipements' ? (
                  <label key={key} className="block space-y-1 md:col-span-2">
                    <span className="text-xs font-semibold">{label}</span>
                    <Textarea value={propertyDraft[key] ?? ''} onChange={(event) => setPropertyDraft({ ...propertyDraft, [key]: event.target.value })} rows={key === 'contexte' ? 4 : 2} />
                  </label>
                ) : (
                  <Field key={key} label={label} value={propertyDraft[key] ?? ''} onChange={(value) => setPropertyDraft({ ...propertyDraft, [key]: value })} />
                )
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={saveProperty} disabled={saving}>
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                Sauvegarder le bien
              </Button>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="estimation" className="space-y-4">
          <Section title="Avis de valeur visible client">
            <div className="grid gap-3 md:grid-cols-4">
              <Field label="Prix retenu" value={professionalDraft.price} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price: value })} />
              <Field label="Fourchette basse" value={professionalDraft.price_low} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price_low: value })} />
              <Field label="Fourchette haute" value={professionalDraft.price_high} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price_high: value })} />
              <Field label="Honoraires indicatifs" value={professionalDraft.commission_rate} onChange={(value) => setProfessionalDraft({ ...professionalDraft, commission_rate: value })} />
            </div>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-semibold">Lecture marché / synthèse conseiller</span>
              <Textarea value={professionalDraft.summary} onChange={(event) => setProfessionalDraft({ ...professionalDraft, summary: event.target.value })} rows={4} />
            </label>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-semibold">Arguments visibles client (un par ligne)</span>
              <Textarea value={professionalDraft.arguments} onChange={(event) => setProfessionalDraft({ ...professionalDraft, arguments: event.target.value })} rows={5} />
            </label>
            <label className="mt-3 block space-y-1">
              <span className="text-xs font-semibold">Comparables validés JSON</span>
              <Textarea value={professionalDraft.comparables_json} onChange={(event) => setProfessionalDraft({ ...professionalDraft, comparables_json: event.target.value })} rows={6} />
            </label>
            <p className="mt-2 text-xs text-muted-foreground">
              Format comparables : [{`{"title":"Maison vendue proche centre","location":"Cotignac","surface":120,"rooms":5,"distance":"à 850m","price":410000,"price_per_sqm":3417,"lat":43.52,"lng":6.14}`}].
              Les coordonnées sont optionnelles et affichées de façon approximative côté client.
            </p>
            <div className="mt-4 flex justify-end">
              <Button onClick={saveProfessionalOpinion} disabled={saving}>
                {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                Sauvegarder l’avis pro
              </Button>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Section title="Ajouter une pièce demandée">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <Input value={newDoc.label} onChange={(event) => setNewDoc({ ...newDoc, label: event.target.value })} placeholder="Ex. Diagnostic amiante" />
              <Input value={newDoc.category} onChange={(event) => setNewDoc({ ...newDoc, category: event.target.value })} placeholder="Catégorie" />
              <Button onClick={addDocument}><Plus className="mr-2 size-4" /> Ajouter</Button>
            </div>
          </Section>
          <Section title="Checklist et fichiers">
            <div className="space-y-3">
              {data.documents.map((document) => (
                <div key={document.id} className="grid gap-3 rounded-lg border bg-white p-4 lg:grid-cols-[1fr_160px_auto] lg:items-center">
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{document.label}</div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{document.category}</span>
                      {document.file_name && <span>{document.file_name}</span>}
                      {document.validated_at && <span>Validé le {formatDate(document.validated_at)}</span>}
                    </div>
                  </div>
                  <select value={document.status} onChange={(event) => updateDocument(document.id, { status: event.target.value })} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                    {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <div className="flex flex-wrap justify-end gap-2">
                    {document.signed_url && (
                      <Button asChild variant="outline" size="sm"><a href={document.signed_url} target="_blank" rel="noreferrer"><Download className="mr-1 size-4" /> Ouvrir</a></Button>
                    )}
                    <label className="inline-flex h-9 cursor-pointer items-center rounded-md border px-3 text-sm font-semibold hover:bg-accent">
                      {uploadingId === document.id ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Upload className="mr-1 size-4" />}
                      Upload
                      <input type="file" className="sr-only" onChange={(event) => uploadDocument(document, event.target.files?.[0] ?? null)} />
                    </label>
                    <Button variant="outline" size="sm" onClick={() => updateDocument(document.id, { status: 'validated' })}><CheckCircle2 className="mr-1 size-4" /> Valider</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteDocument(document.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              ))}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-white p-5 text-sm font-semibold text-brand hover:bg-brand-light/50">
                {uploadingId === 'new' ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
                Ajouter un fichier libre
                <input type="file" className="sr-only" onChange={(event) => uploadDocument(null, event.target.files?.[0] ?? null)} />
              </label>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="suivi" className="space-y-4">
          <Section title="Ajouter un jalon">
            <div className="grid gap-3 md:grid-cols-[1fr_160px_160px]">
              <Input value={newEvent.title} onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })} placeholder="Titre du jalon" />
              <Input type="date" value={newEvent.event_date} onChange={(event) => setNewEvent({ ...newEvent, event_date: event.target.value })} />
              <select value={newEvent.type} onChange={(event) => setNewEvent({ ...newEvent, type: event.target.value })} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="milestone">Jalon</option>
                <option value="visit">Visite</option>
                <option value="offer">Offre</option>
                <option value="note">Note</option>
              </select>
            </div>
            <Textarea className="mt-3" value={newEvent.description} onChange={(event) => setNewEvent({ ...newEvent, description: event.target.value })} placeholder="Description" rows={3} />
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <Field label="Acheteur / visiteur" value={newEvent.buyer_name} onChange={(value) => setNewEvent({ ...newEvent, buyer_name: value })} />
              <Field label="Montant offre" value={newEvent.amount} onChange={(value) => setNewEvent({ ...newEvent, amount: value })} />
              <Field label="Intérêt visite (1 à 5)" value={newEvent.rating} onChange={(value) => setNewEvent({ ...newEvent, rating: value })} />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newEvent.visible_to_client} onChange={(event) => setNewEvent({ ...newEvent, visible_to_client: event.target.checked })} />
                Visible client
              </label>
              <Button onClick={addEvent}><Plus className="mr-2 size-4" /> Ajouter</Button>
            </div>
          </Section>
          <Section title="Timeline">
            <div className="space-y-3">
              {data.events.map((event) => (
                <div key={event.id} className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{event.title}</span>
                      <Badge variant="outline">{event.status}</Badge>
                      <Badge variant="outline">{event.type}</Badge>
                      {!event.visible_to_client && <Badge variant="outline">Interne</Badge>}
                    </div>
                    {event.description && <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>}
                    {event.event_date && <p className="mt-1 text-xs text-muted-foreground">{formatDate(event.event_date)}</p>}
                    {summarizeEventPayload(event.payload) && <p className="mt-1 text-xs font-semibold text-foreground">{summarizeEventPayload(event.payload)}</p>}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => updateEvent(event.id, { status: event.status === 'done' ? 'todo' : 'done' })}>{event.status === 'done' ? 'À faire' : 'Terminer'}</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold">{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function draftFromData(data: ClientDetail): Draft {
  return {
    title: data.dossier.title,
    status: data.dossier.status,
    advisor_note: data.dossier.advisor_note ?? '',
    first_name: data.dossier.client_profile.first_name,
    last_name: data.dossier.client_profile.last_name,
    email: data.dossier.client_profile.email,
    phone: data.dossier.client_profile.phone ?? '',
  }
}

function propertyFromData(data: ClientDetail): PropertyDraft {
  const snapshot = asRecord(data.dossier.property_snapshot)
  return Object.fromEntries(PROPERTY_FIELDS.map(([key]) => [key, stringify(snapshot[key])]))
}

function professionalFromData(data: ClientDetail): ProfessionalDraft {
  const opinion = asRecord(data.dossier.professional_opinion)
  return {
    price: stringify(opinion.price ?? opinion.prix_retenu),
    price_low: stringify(opinion.price_low ?? opinion.fourchette_basse),
    price_high: stringify(opinion.price_high ?? opinion.fourchette_haute),
    commission_rate: stringify(opinion.commission_rate ?? '0.045'),
    summary: stringify(opinion.summary ?? opinion.market_context),
    arguments: Array.isArray(opinion.arguments) ? opinion.arguments.map(stringify).filter(Boolean).join('\n') : stringify(opinion.arguments),
    comparables_json: JSON.stringify(Array.isArray(opinion.comparables) ? opinion.comparables : [], null, 2),
  }
}

function normalizeProperty(draft: PropertyDraft) {
  const numeric = new Set(['surface', 'surface_terrain', 'nb_pieces', 'prix_estime', 'fourchette_basse', 'fourchette_haute'])
  return Object.fromEntries(Object.entries(draft).map(([key, value]) => {
    if (numeric.has(key)) {
      const parsed = Number(value)
      return [key, Number.isFinite(parsed) && value.trim() !== '' ? parsed : null]
    }
    return [key, value.trim() || null]
  }))
}

function normalizeProfessionalOpinion(draft: ProfessionalDraft) {
  return {
    price: nullableNumber(draft.price),
    price_low: nullableNumber(draft.price_low),
    price_high: nullableNumber(draft.price_high),
    commission_rate: nullableNumber(draft.commission_rate) ?? 0.045,
    summary: draft.summary.trim() || null,
    arguments: draft.arguments.split('\n').map((line) => line.trim()).filter(Boolean),
    comparables: parseComparables(draft.comparables_json),
  }
}

function emptyProfessionalDraft(): ProfessionalDraft {
  return {
    price: '',
    price_low: '',
    price_high: '',
    commission_rate: '0.045',
    summary: '',
    arguments: '',
    comparables_json: '[]',
  }
}

function emptyEventDraft() {
  return {
    title: '',
    description: '',
    type: 'milestone',
    status: 'todo',
    event_date: '',
    visible_to_client: true,
    buyer_name: '',
    amount: '',
    rating: '',
  }
}

function normalizeEventPayload(event: ReturnType<typeof emptyEventDraft>) {
  return {
    buyer_name: event.buyer_name.trim() || null,
    amount: nullableNumber(event.amount),
    rating: nullableNumber(event.rating),
  }
}

function asRecord(value: Json): Record<string, Json | undefined> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function parseComparables(value: string) {
  if (!value.trim()) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    toast.error('JSON comparables invalide, les comparables ne sont pas sauvegardés')
    return []
  }
}

function nullableNumber(value: string) {
  const parsed = Number(value.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(parsed) && value.trim() !== '' ? parsed : null
}

function stringify(value: unknown) {
  if (value == null) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function summarizeEventPayload(value: Json) {
  const payload = asRecord(value)
  const buyer = stringify(payload.buyer_name)
  const amount = nullableNumber(stringify(payload.amount))
  const rating = nullableNumber(stringify(payload.rating))
  return [buyer, amount ? `${amount.toLocaleString('fr-FR')} €` : null, rating ? `Intérêt ${rating}/5` : null].filter(Boolean).join(' · ')
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
