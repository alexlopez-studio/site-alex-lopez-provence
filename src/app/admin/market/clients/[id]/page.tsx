'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Download,
  Eye,
  FileText,
  FileUp,
  Loader2,
  MapPin,
  Plus,
  Save,
  Send,
  SlidersHorizontal,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
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

type PropertyDraft = {
  mandate_number: string
  mandate_type: string
  type_bien: string
  adresse: string
  commune: string
  surface: string
  surface_terrain: string
  nb_pieces: string
  chambres: string
  dpe: string
  etat: string
  equipements: string
  contexte: string
  description: string
}

type PortalId = 'global' | 'seloger' | 'leboncoin' | 'iad' | 'bienici' | 'autre'

type PortalDraft = {
  id: PortalId
  name: string
  description: string
  views: string
  engagement: string
  calls: string
  messages: string
  favorites: string
}

type ProfessionalDraft = {
  price: string
  price_low: string
  price_high: string
  commission_rate: string
  summary: string
  arguments: string
  comparables_json: string
  audience_views: string
  audience_views_change: string
  audience_contacts: string
  audience_contacts_change: string
  portals: PortalDraft[]
}

const ADMIN_TAB_VALUES = ['mandat', 'estimation', 'documents', 'plan', 'visites', 'offres'] as const
type AdminTabValue = (typeof ADMIN_TAB_VALUES)[number]

const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  missing: 'Manquant',
  requested: 'Demandé',
  uploaded: 'Reçu',
  validated: 'Validé',
  rejected: 'Rejeté',
}

const MANDATE_TYPE_OPTIONS = ['Mandat exclusif', 'Mandat simple', 'Mandat semi-exclusif', 'Mandat de recherche acquéreur']
const PROPERTY_TYPE_OPTIONS = ['Maison', 'Villa', 'Maison de village', 'Appartement', 'Terrain', 'Immeuble', 'Propriété', 'Bastide / Mas']
const PROPERTY_STATE_OPTIONS = ['À rénover', 'À rafraîchir', 'Bon état', 'Très bon état', 'Rénové', 'Prestations premium']
const DPE_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Non communiqué', 'En cours']
const PROPERTY_FEATURE_OPTIONS = ['Piscine', 'Garage', 'Parking', 'Terrasse', 'Jardin', 'Vue dégagée', 'Plain-pied', 'Suite parentale', 'Climatisation', 'Cheminée', 'Dépendance', 'Forage', 'Calme', 'Proche village']
const DOCUMENT_CATEGORY_OPTIONS = ['Propriété', 'Identité', 'Diagnostics', 'Fiscalité', 'Urbanisme', 'Copropriété', 'Travaux', 'Assainissement', 'Mandat']
const REJECTION_REASON_OPTIONS = ['Illisible', 'Document incomplet', 'Document expiré', 'Mauvais document', 'Informations incohérentes', 'À rescanner']
const EVENT_STATUS_OPTIONS = [
  { value: 'todo', label: 'À venir' },
  { value: 'pending', label: 'En cours' },
  { value: 'done', label: 'Terminé' },
  { value: 'blocked', label: 'Bloqué' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'declined', label: 'Refusé' },
]
const MILESTONE_TYPE_OPTIONS = ['Estimation', 'Signature mandat', 'Préparation dossier', 'Shooting photo', 'Visite virtuelle', 'Diffusion annonce', 'Visites', 'Offres', 'Compromis', 'Acte authentique']
const VISIT_STATUS_OPTIONS = [
  { value: 'planned', label: 'Programmée' },
  { value: 'done', label: 'Effectuée' },
  { value: 'cancelled', label: 'Annulée' },
  { value: 'postponed', label: 'Reportée' },
]
const BUYER_PROFILE_OPTIONS = ['Résidence principale', 'Résidence secondaire', 'Investisseur', 'Mutation professionnelle', 'Retraite', 'Projet familial']
const FINANCING_OPTIONS = ['Non vérifié', 'Budget déclaré', 'Courtier validé', 'Accord bancaire', 'Comptant', 'À confirmer']
const OFFER_STATUS_OPTIONS = [
  { value: 'new', label: 'Nouvelle' },
  { value: 'pending', label: 'En analyse' },
  { value: 'accepted', label: 'Acceptée' },
  { value: 'counter', label: 'Contre-proposition' },
  { value: 'declined', label: 'Refusée' },
  { value: 'expired', label: 'Expirée' },
  { value: 'withdrawn', label: 'Retirée' },
]
const OFFER_CONDITION_OPTIONS = ['Sans condition suspensive', 'Sous condition de prêt', 'Sous condition de vente', 'Sous condition urbanisme', 'Paiement comptant']
const OFFER_STRENGTH_OPTIONS = ['À vérifier', 'Correct', 'Solide', 'Très solide']

const PORTAL_DEFS: Array<Pick<PortalDraft, 'id' | 'name' | 'description'>> = [
  { id: 'global', name: 'Global', description: 'Audience consolidée de tous les supports de diffusion.' },
  { id: 'seloger', name: 'SeLoger', description: 'Portail immobilier national à forte audience vendeurs et acquéreurs.' },
  { id: 'leboncoin', name: 'LeBonCoin', description: 'Support généraliste générant une forte visibilité locale.' },
  { id: 'iad', name: 'iAD France', description: 'Diffusion réseau iAD auprès des acquéreurs qualifiés.' },
  { id: 'bienici', name: "Bien'ici", description: 'Portail innovant avec cartographie 3D immersive.' },
  { id: 'autre', name: 'Autre', description: 'Support de diffusion complémentaire.' },
]

const ADMIN_INPUT_CLASS = 'h-10 rounded-xl px-3 text-sm'
const ADMIN_SELECT_CLASS = 'h-10 w-full rounded-xl border border-input bg-background px-3 text-sm'
const ADMIN_TEXTAREA_CLASS = 'rounded-xl px-3 py-2 text-sm'
const ADMIN_PRIMARY_ACTION_CLASS = 'h-10 rounded-xl px-4'
const ADMIN_SECONDARY_ACTION_CLASS = 'h-9 rounded-xl px-3'
const ADMIN_ICON_ACTION_CLASS = 'size-9 rounded-xl'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [data, setData] = useState<ClientDetail | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [propertyDraft, setPropertyDraft] = useState<PropertyDraft>(emptyPropertyDraft())
  const [professionalDraft, setProfessionalDraft] = useState<ProfessionalDraft>(emptyProfessionalDraft())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [openingClientLink, setOpeningClientLink] = useState(false)
  const [newDoc, setNewDoc] = useState({ label: '', category: 'Autre' })
  const [newEvent, setNewEvent] = useState(emptyEventDraft())
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<AdminTabValue>('mandat')

  const fetchDetail = useCallback(async ({ showLoading = true }: { showLoading?: boolean } = {}) => {
    if (showLoading) setLoading(true)
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
      if (showLoading) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetchDetail()
  }, [fetchDetail])

  const clientName = useMemo(() => {
    if (!data) return 'Client vendeur'
    return [data.dossier.client_profile.first_name, data.dossier.client_profile.last_name].filter(Boolean).join(' ').trim() || 'Client vendeur'
  }, [data])

  const mandateReference = propertyDraft.mandate_number || `M-${new Date().getFullYear()}-${id.slice(0, 4).toUpperCase()}`
  const address = propertyDraft.adresse || data?.dossier.title || 'Adresse du mandat à compléter'

  async function saveClientPortal() {
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
          property_snapshot: normalizeProperty(propertyDraft),
          dossier: {
            title: draft.title,
            status: draft.status,
            advisor_note: draft.advisor_note,
            professional_opinion: normalizeProfessionalOpinion(professionalDraft, propertyDraft),
          },
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Erreur API')
      toast.success('Modifications sauvegardées')
      await fetchDetail({ showLoading: false })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Publication impossible')
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

  async function openClientPortalLink() {
    setOpeningClientLink(true)
    try {
      const href = `${window.location.origin}/espace-client/preview/${id}?presentation=1`
      await navigator.clipboard?.writeText(href)
      window.open(href, '_blank', 'noopener,noreferrer')
      toast.success('Interface client ouverte et lien copié')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ouverture impossible')
    } finally {
      setOpeningClientLink(false)
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
    setNewDoc({ label: '', category: 'Autre' })
    await fetchDetail({ showLoading: false })
  }

  async function updateDocument(documentId: string, patch: Record<string, unknown>) {
    const res = await fetch(`/api/market/clients/${id}/documents`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: documentId, ...patch }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Mise à jour impossible')
    await fetchDetail({ showLoading: false })
  }

  async function deleteDocument(documentId: string) {
    const res = await fetch(`/api/market/clients/${id}/documents?id=${encodeURIComponent(documentId)}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Suppression impossible')
    await fetchDetail({ showLoading: false })
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
      await fetchDetail({ showLoading: false })
      toast.success('Document ajouté')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload impossible')
    } finally {
      setUploadingId(null)
    }
  }

  async function addEvent(type: string) {
    if (!newEvent.title.trim()) return
    const res = await fetch(`/api/market/clients/${id}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newEvent.title,
        description: newEvent.description,
        type,
        status: normalizedEventStatus(type, newEvent.status),
        event_date: newEvent.event_date,
        visible_to_client: newEvent.visible_to_client,
        payload: normalizeEventPayload(newEvent),
      }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Ajout impossible')
    setNewEvent(emptyEventDraft())
    await fetchDetail({ showLoading: false })
  }

  async function updateEvent(eventId: string, patch: Record<string, unknown>) {
    const res = await fetch(`/api/market/clients/${id}/events`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: eventId, ...patch }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Mise à jour impossible')
    await fetchDetail({ showLoading: false })
  }

  async function deleteEvent(eventId: string) {
    const res = await fetch(`/api/market/clients/${id}/events?id=${encodeURIComponent(eventId)}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok || !json.success) return toast.error(json.error ?? 'Suppression impossible')
    await fetchDetail({ showLoading: false })
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

  const planEvents = data.events.filter((event) => !['visit', 'offer'].includes(event.type))
  const visitEvents = data.events.filter((event) => event.type === 'visit')
  const offerEvents = data.events.filter((event) => event.type === 'offer')

  return (
    <div className="space-y-6">
      <Link href="/app/clients" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Clients
      </Link>

      <section className="rounded-[28px] bg-[#0F172A] p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0077B6] px-3 py-1 text-[11px] font-extrabold uppercase">
                <Users className="size-3.5" />
                Espace conseiller iAD
              </span>
              <span className="text-sm text-slate-400">Mandat : {mandateReference}</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Console d&apos;Administration Pro</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
              <MapPin className="size-4 text-[#0077B6]" />
              <span className="truncate">{address}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={inviteClient} disabled={inviting} className={ADMIN_PRIMARY_ACTION_CLASS}>
              {inviting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
              Inviter
            </Button>
            <Button asChild variant="secondary" className={ADMIN_PRIMARY_ACTION_CLASS}>
              <Link href={`/app/clients/${id}/preview`}>
                <Eye className="mr-2 size-4" />
                Preview admin
              </Link>
            </Button>
            <Button variant="secondary" onClick={openClientPortalLink} disabled={openingClientLink} className={ADMIN_PRIMARY_ACTION_CLASS}>
              {openingClientLink ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Eye className="mr-2 size-4" />}
              Accès direct client
            </Button>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(normalizeAdminTab(value))} className="space-y-6">
        <TabsList className="flex h-auto flex-wrap justify-start rounded-2xl border bg-white p-1 shadow-sm">
          <AdminTab value="mandat" icon={SlidersHorizontal} label="Mandat & Technical" />
          <AdminTab value="estimation" icon={BarChart3} label="Estimation (DVF)" />
          <AdminTab value="documents" icon={FileText} label="Documents Vendeur" />
          <AdminTab value="plan" icon={BookOpen} label="Plan de Vente" />
          <AdminTab value="visites" icon={Users} label="Visites physiques" />
          <AdminTab value="offres" icon={DollarSign} label="Offres d'achat" />
        </TabsList>

        <TabsContent value="mandat" className="space-y-6">
          <Section title="Informations Générales du Mandat & Statistiques de l'Annonce" icon={SlidersHorizontal}>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-4">
                <Field label="Client vendeur" value={clientName} onChange={() => undefined} readOnly />
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Référence mandat" value={propertyDraft.mandate_number} onChange={(value) => setPropertyDraft({ ...propertyDraft, mandate_number: value })} />
                  <SelectWithOther label="Type de mandat" value={propertyDraft.mandate_type} options={MANDATE_TYPE_OPTIONS} onChange={(value) => setPropertyDraft({ ...propertyDraft, mandate_type: value })} />
                </div>
                <SelectWithOther label="Type de bien" value={propertyDraft.type_bien} options={PROPERTY_TYPE_OPTIONS} onChange={(value) => setPropertyDraft({ ...propertyDraft, type_bien: value })} />
                <Field label="Adresse complète" value={propertyDraft.adresse} onChange={(value) => setPropertyDraft({ ...propertyDraft, adresse: value })} />
                <Field label="Commune" value={propertyDraft.commune} onChange={(value) => setPropertyDraft({ ...propertyDraft, commune: value })} />
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Surface (m²)" value={propertyDraft.surface} onChange={(value) => setPropertyDraft({ ...propertyDraft, surface: value })} />
                  <Field label="Terrain (m²)" value={propertyDraft.surface_terrain} onChange={(value) => setPropertyDraft({ ...propertyDraft, surface_terrain: value })} />
                  <Field label="Pièces" value={propertyDraft.nb_pieces} onChange={(value) => setPropertyDraft({ ...propertyDraft, nb_pieces: value })} />
                  <Field label="Chambres" value={propertyDraft.chambres} onChange={(value) => setPropertyDraft({ ...propertyDraft, chambres: value })} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <SelectWithOther label="DPE" value={propertyDraft.dpe} options={DPE_OPTIONS} onChange={(value) => setPropertyDraft({ ...propertyDraft, dpe: value })} />
                  <SelectWithOther label="État général" value={propertyDraft.etat} options={PROPERTY_STATE_OPTIONS} onChange={(value) => setPropertyDraft({ ...propertyDraft, etat: value })} />
                </div>
                <TagsWithOther label="Équipements / atouts" value={propertyDraft.equipements} options={PROPERTY_FEATURE_OPTIONS} onChange={(value) => setPropertyDraft({ ...propertyDraft, equipements: value })} />
              </div>

              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Prix suggéré (€)" value={professionalDraft.price} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price: value })} />
                  <Field label="Estimation basse (€)" value={professionalDraft.price_low} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price_low: value })} />
                  <Field label="Estimation haute (€)" value={professionalDraft.price_high} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price_high: value })} />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Audience : vues d'annonce" value={professionalDraft.audience_views} onChange={(value) => setProfessionalDraft({ ...professionalDraft, audience_views: value })} />
                  <Field label="Audience : contacts" value={professionalDraft.audience_contacts} onChange={(value) => setProfessionalDraft({ ...professionalDraft, audience_contacts: value })} />
                </div>
                <label className="block space-y-1">
                  <span className="text-xs font-extrabold uppercase text-slate-500">Description publique commerciale</span>
                  <Textarea
                    value={propertyDraft.description}
                    onChange={(event) => setPropertyDraft({ ...propertyDraft, description: event.target.value })}
                    rows={8}
                    className={ADMIN_TEXTAREA_CLASS}
                  />
                </label>
              </div>
            </div>
          </Section>

          <Section title="Statistiques de l'annonce par portail immobilier" icon={BarChart3}>
            <p className="-mt-2 mb-5 text-sm text-muted-foreground">
              Saisissez manuellement ou mettez à jour les statistiques clés de performance de l&apos;annonce pour chaque portail de diffusion.
            </p>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {professionalDraft.portals.map((portal, index) => (
                <PortalStatsCard
                  key={portal.id}
                  portal={portal}
                  index={index}
                  onChange={(next) => setProfessionalDraft({ ...professionalDraft, portals: replacePortal(professionalDraft.portals, portal.id, next) })}
                />
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="estimation" className="space-y-6">
          <Section title="Estimation (DVF) & Avis de valeur visible client" icon={BarChart3}>
            <div className="grid gap-3 md:grid-cols-4">
              <Field label="Prix retenu" value={professionalDraft.price} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price: value })} />
              <Field label="Fourchette basse" value={professionalDraft.price_low} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price_low: value })} />
              <Field label="Fourchette haute" value={professionalDraft.price_high} onChange={(value) => setProfessionalDraft({ ...professionalDraft, price_high: value })} />
              <Field label="Honoraires indicatifs" value={professionalDraft.commission_rate} onChange={(value) => setProfessionalDraft({ ...professionalDraft, commission_rate: value })} />
            </div>
            <label className="mt-4 block space-y-1">
              <span className="text-xs font-extrabold uppercase text-slate-500">Lecture marché / synthèse conseiller</span>
              <Textarea value={professionalDraft.summary} onChange={(event) => setProfessionalDraft({ ...professionalDraft, summary: event.target.value })} rows={4} className={ADMIN_TEXTAREA_CLASS} />
            </label>
            <label className="mt-4 block space-y-1">
              <span className="text-xs font-extrabold uppercase text-slate-500">Arguments visibles client (un par ligne)</span>
              <Textarea value={professionalDraft.arguments} onChange={(event) => setProfessionalDraft({ ...professionalDraft, arguments: event.target.value })} rows={5} className={ADMIN_TEXTAREA_CLASS} />
            </label>
            <label className="mt-4 block space-y-1">
              <span className="text-xs font-extrabold uppercase text-slate-500">Comparables validés JSON</span>
              <Textarea value={professionalDraft.comparables_json} onChange={(event) => setProfessionalDraft({ ...professionalDraft, comparables_json: event.target.value })} rows={7} className={cn(ADMIN_TEXTAREA_CLASS, 'font-mono text-xs')} />
            </label>
          </Section>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Section title="Ajouter une pièce demandée" icon={FileText}>
            <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <Input value={newDoc.label} onChange={(event) => setNewDoc({ ...newDoc, label: event.target.value })} placeholder="Ex. Diagnostic amiante" className={ADMIN_INPUT_CLASS} />
              <SelectWithOther label="Catégorie" value={newDoc.category} options={DOCUMENT_CATEGORY_OPTIONS} onChange={(value) => setNewDoc({ ...newDoc, category: value })} compact />
              <Button onClick={addDocument} className={ADMIN_PRIMARY_ACTION_CLASS}><Plus className="mr-2 size-4" /> Ajouter</Button>
            </div>
          </Section>
          <Section title="Checklist et fichiers vendeur" icon={FileText}>
            <div className="space-y-3">
              {data.documents.map((document) => (
                <DocumentRow
                  key={document.id}
                  document={document}
                  uploadingId={uploadingId}
                  onUpdate={updateDocument}
                  onDelete={deleteDocument}
                  onUpload={uploadDocument}
                />
              ))}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed bg-white p-5 text-sm font-semibold text-[#0077B6] hover:bg-[#E0F0FA]/50">
                {uploadingId === 'new' ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
                Ajouter un fichier libre
                <input type="file" className="sr-only" onChange={(event) => uploadDocument(null, event.target.files?.[0] ?? null)} />
              </label>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="plan" className="space-y-6">
          <EventEditor title="Ajouter une étape au plan de vente" type="milestone" onAdd={addEvent} newEvent={newEvent} setNewEvent={setNewEvent} />
          <EventList title="Plan de vente publié" events={planEvents} onUpdate={updateEvent} onDelete={deleteEvent} />
        </TabsContent>

        <TabsContent value="visites" className="space-y-6">
          <EventEditor title="Ajouter une visite physique" type="visit" onAdd={addEvent} newEvent={newEvent} setNewEvent={setNewEvent} />
          <EventList title="Comptes-rendus de visites" events={visitEvents} onUpdate={updateEvent} onDelete={deleteEvent} />
        </TabsContent>

        <TabsContent value="offres" className="space-y-6">
          <EventEditor title="Ajouter une offre d'achat" type="offer" onAdd={addEvent} newEvent={newEvent} setNewEvent={setNewEvent} />
          <EventList title="Offres transmises" events={offerEvents} onUpdate={updateEvent} onDelete={deleteEvent} />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button onClick={saveClientPortal} disabled={saving} className="h-10 rounded-xl bg-[#10B981] px-5 text-white shadow-lg hover:bg-[#0EA371]">
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          Sauvegarder
        </Button>
      </div>
    </div>
  )
}

function AdminTab({ value, icon: Icon, label }: { value: string; icon: typeof SlidersHorizontal; label: string }) {
  return (
    <TabsTrigger value={value} className="gap-2 rounded-xl px-4 py-2 data-[state=active]:bg-[#0077B6] data-[state=active]:text-white">
      <Icon className="size-4" />
      {label}
    </TabsTrigger>
  )
}

function normalizeAdminTab(value: string): AdminTabValue {
  return ADMIN_TAB_VALUES.includes(value as AdminTabValue) ? value as AdminTabValue : 'mandat'
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof SlidersHorizontal; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 border-b pb-4 text-lg font-extrabold text-[#0F172A]">
        <Icon className="size-4 text-[#0077B6]" />
        {title}
      </h2>
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-extrabold uppercase text-slate-500">{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} readOnly={readOnly} className={ADMIN_INPUT_CLASS} />
    </label>
  )
}

function SelectWithOther({
  label,
  value,
  options,
  onChange,
  compact = false,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  compact?: boolean
}) {
  const isPreset = !value || options.includes(value)
  const selectValue = isPreset ? value : '__other__'

  return (
    <label className={`block ${compact ? 'space-y-0' : 'space-y-1'}`}>
      {!compact && <span className="text-xs font-extrabold uppercase text-slate-500">{label}</span>}
      <select
        value={selectValue}
        onChange={(event) => onChange(event.target.value === '__other__' ? 'Autre' : event.target.value)}
        className={ADMIN_SELECT_CLASS}
        aria-label={compact ? label : undefined}
      >
        <option value="">Sélectionner</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
        <option value="__other__">Autre</option>
      </select>
      {(!isPreset || selectValue === '__other__') && (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`${label} personnalisé`}
          className={cn('mt-2', ADMIN_INPUT_CLASS)}
        />
      )}
    </label>
  )
}

function SelectValue({
  value,
  options,
  onChange,
}: {
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className={ADMIN_SELECT_CLASS}>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  )
}

function TagsWithOther({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const values = splitTags(value)
  const customValues = values.filter((item) => !options.includes(item))

  const updateTag = (tag: string, checked: boolean) => {
    const next = checked ? [...values, tag] : values.filter((item) => item !== tag)
    onChange(uniqueTags(next).join(', '))
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-extrabold uppercase text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-2 rounded-2xl border bg-white p-3">
        {options.map((option) => {
          const checked = values.includes(option)
          return (
            <label key={option} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${checked ? 'border-[#0077B6] bg-[#E0F0FA] text-[#0077B6]' : 'bg-white text-slate-600'}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => updateTag(option, event.target.checked)}
                className="sr-only"
              />
              {option}
            </label>
          )
        })}
      </div>
      <Input
        value={customValues.join(', ')}
        onChange={(event) => onChange(uniqueTags([...values.filter((item) => options.includes(item)), ...splitTags(event.target.value)]).join(', '))}
        placeholder="Autre équipement ou atout, séparé par virgules"
        className={ADMIN_INPUT_CLASS}
      />
    </div>
  )
}

function PortalStatsCard({ portal, index, onChange }: { portal: PortalDraft; index: number; onChange: (portal: PortalDraft) => void }) {
  return (
    <div className="rounded-2xl border bg-[#F8FAFC] p-4">
      <div className="mb-4 flex items-center justify-between border-b pb-3">
        <p className="text-sm font-extrabold text-[#0F172A]">{portal.name}</p>
        <span className="text-[10px] font-extrabold uppercase text-slate-400">Canal #{index + 1}</span>
      </div>
      <div className="mb-3">
        <SelectWithOther label="Portail" value={portal.name} options={PORTAL_DEFS.map((item) => item.name).filter((name) => name !== 'Autre')} onChange={(value) => onChange({ ...portal, name: value || 'Autre' })} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Vues" value={portal.views} onChange={(value) => onChange({ ...portal, views: value })} />
        <Field label="Engagement (%)" value={portal.engagement} onChange={(value) => onChange({ ...portal, engagement: value })} />
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <Field label="Appels" value={portal.calls} onChange={(value) => onChange({ ...portal, calls: value })} />
        <Field label="Messages" value={portal.messages} onChange={(value) => onChange({ ...portal, messages: value })} />
        <Field label="Favoris" value={portal.favorites} onChange={(value) => onChange({ ...portal, favorites: value })} />
      </div>
    </div>
  )
}

function DocumentRow({
  document,
  uploadingId,
  onUpdate,
  onDelete,
  onUpload,
}: {
  document: ClientDocument
  uploadingId: string | null
  onUpdate: (documentId: string, patch: Record<string, unknown>) => void
  onDelete: (documentId: string) => void
  onUpload: (document: ClientDocument | null, file: File | null) => void
}) {
  return (
    <div className="grid gap-3 rounded-2xl border bg-[#F8FAFC] p-4 lg:grid-cols-[1fr_180px_160px_auto] lg:items-center">
      <div className="min-w-0">
        <div className="font-semibold text-foreground">{document.label}</div>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{document.category}</span>
          {document.file_name && <span>{document.file_name}</span>}
          {document.validated_at && <span>Validé le {formatDate(document.validated_at)}</span>}
        </div>
        {document.status === 'rejected' && document.notes && (
          <p className="mt-2 text-xs font-semibold text-red-600">Motif : {document.notes}</p>
        )}
      </div>
      <SelectWithOther label="Catégorie" value={document.category} options={DOCUMENT_CATEGORY_OPTIONS} onChange={(value) => onUpdate(document.id, { category: value })} compact />
      <SelectValue
        value={document.status}
        options={Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
        onChange={(value) => onUpdate(document.id, { status: value })}
      />
      <div className="flex flex-wrap justify-end gap-2">
        {document.signed_url && (
          <Button asChild variant="outline" size="sm" className={ADMIN_SECONDARY_ACTION_CLASS}><a href={document.signed_url} target="_blank" rel="noreferrer"><Download className="mr-1 size-4" /> Ouvrir</a></Button>
        )}
        <label className={cn('inline-flex cursor-pointer items-center border text-sm font-semibold hover:bg-accent', ADMIN_SECONDARY_ACTION_CLASS)}>
          {uploadingId === document.id ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Upload className="mr-1 size-4" />}
          Upload
          <input type="file" className="sr-only" onChange={(event) => onUpload(document, event.target.files?.[0] ?? null)} />
        </label>
        <Button variant="outline" size="sm" className={ADMIN_SECONDARY_ACTION_CLASS} onClick={() => onUpdate(document.id, { status: 'validated' })}><CheckCircle2 className="mr-1 size-4" /> Valider</Button>
        <Button variant="ghost" size="icon-sm" className={ADMIN_ICON_ACTION_CLASS} onClick={() => onDelete(document.id)}><Trash2 className="size-4" /></Button>
      </div>
      {document.status === 'rejected' && (
        <div className="lg:col-span-4">
          <SelectWithOther label="Motif de rejet" value={document.notes ?? ''} options={REJECTION_REASON_OPTIONS} onChange={(value) => onUpdate(document.id, { notes: value })} />
        </div>
      )}
    </div>
  )
}

function EventEditor({
  title,
  type,
  newEvent,
  setNewEvent,
  onAdd,
}: {
  title: string
  type: string
  newEvent: ReturnType<typeof emptyEventDraft>
  setNewEvent: (event: ReturnType<typeof emptyEventDraft>) => void
  onAdd: (type: string) => void
}) {
  const statusOptions = type === 'visit' ? VISIT_STATUS_OPTIONS : type === 'offer' ? OFFER_STATUS_OPTIONS : EVENT_STATUS_OPTIONS
  const currentStatus = statusOptions.some((option) => option.value === newEvent.status) ? newEvent.status : statusOptions[0]?.value ?? newEvent.status
  return (
    <Section title={title} icon={CalendarDays}>
      <div className="grid gap-3 md:grid-cols-[1fr_160px_160px]">
        <Input value={newEvent.title} onChange={(event) => setNewEvent({ ...newEvent, title: event.target.value })} placeholder="Titre" className={ADMIN_INPUT_CLASS} />
        <Input type="date" value={newEvent.event_date} onChange={(event) => setNewEvent({ ...newEvent, event_date: event.target.value })} className={ADMIN_INPUT_CLASS} />
        <SelectValue value={currentStatus} options={statusOptions} onChange={(value) => setNewEvent({ ...newEvent, status: value })} />
      </div>
      {type === 'milestone' && (
        <div className="mt-3">
          <SelectWithOther label="Type d'étape" value={newEvent.milestone_kind} options={MILESTONE_TYPE_OPTIONS} onChange={(value) => setNewEvent({ ...newEvent, milestone_kind: value })} />
        </div>
      )}
      <Textarea className={cn('mt-3', ADMIN_TEXTAREA_CLASS)} value={newEvent.description} onChange={(event) => setNewEvent({ ...newEvent, description: event.target.value })} placeholder="Description visible client" rows={3} />
      {type !== 'milestone' && (
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Field label="Acheteur / visiteur" value={newEvent.buyer_name} onChange={(value) => setNewEvent({ ...newEvent, buyer_name: value })} />
          {type === 'offer' && <Field label="Montant offre" value={newEvent.amount} onChange={(value) => setNewEvent({ ...newEvent, amount: value })} />}
          {type === 'visit' && <SelectWithOther label="Intérêt visite" value={newEvent.rating} options={['1', '2', '3', '4', '5']} onChange={(value) => setNewEvent({ ...newEvent, rating: value })} />}
        </div>
      )}
      {type === 'visit' && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <SelectWithOther label="Profil acquéreur" value={newEvent.buyer_profile} options={BUYER_PROFILE_OPTIONS} onChange={(value) => setNewEvent({ ...newEvent, buyer_profile: value })} />
          <SelectWithOther label="Financement" value={newEvent.financing} options={FINANCING_OPTIONS} onChange={(value) => setNewEvent({ ...newEvent, financing: value })} />
        </div>
      )}
      {type === 'offer' && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <SelectWithOther label="Condition principale" value={newEvent.offer_condition} options={OFFER_CONDITION_OPTIONS} onChange={(value) => setNewEvent({ ...newEvent, offer_condition: value })} />
          <SelectWithOther label="Solidité" value={newEvent.offer_strength} options={OFFER_STRENGTH_OPTIONS} onChange={(value) => setNewEvent({ ...newEvent, offer_strength: value })} />
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="block w-full max-w-xs space-y-1">
          <span className="text-xs font-extrabold uppercase text-slate-500">Visibilité</span>
          <select
            value={newEvent.visible_to_client ? 'client' : 'internal'}
            onChange={(event) => setNewEvent({ ...newEvent, visible_to_client: event.target.value === 'client' })}
            className={ADMIN_SELECT_CLASS}
          >
            <option value="client">Visible client</option>
            <option value="internal">Interne uniquement</option>
          </select>
        </label>
        <Button onClick={() => onAdd(type)} className={ADMIN_PRIMARY_ACTION_CLASS}><Plus className="mr-2 size-4" /> Ajouter</Button>
      </div>
    </Section>
  )
}

function EventList({
  title,
  events,
  onUpdate,
  onDelete,
}: {
  title: string
  events: ClientEvent[]
  onUpdate: (eventId: string, patch: Record<string, unknown>) => void
  onDelete: (eventId: string) => void
}) {
  return (
    <Section title={title} icon={BookOpen}>
      <div className="space-y-3">
        {events.length === 0 && <p className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">Aucune donnée pour le moment.</p>}
        {events.map((event) => (
          <div key={event.id} className="grid gap-3 rounded-2xl border bg-[#F8FAFC] p-4 md:grid-cols-[1fr_auto]">
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
              <Button variant="outline" size="sm" className={ADMIN_SECONDARY_ACTION_CLASS} onClick={() => onUpdate(event.id, { status: event.status === 'done' ? 'todo' : 'done' })}>
                {event.status === 'done' ? 'À faire' : 'Terminer'}
              </Button>
              <Button variant="ghost" size="icon-sm" className={ADMIN_ICON_ACTION_CLASS} onClick={() => onDelete(event.id)}><Trash2 className="size-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
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
  const opinion = asRecord(data.dossier.professional_opinion)
  return {
    mandate_number: stringify(snapshot.mandate_number ?? opinion.mandate_number),
    mandate_type: stringify(snapshot.mandate_type ?? opinion.mandate_type ?? 'Mandat de vente exclusif (OS)'),
    type_bien: stringify(snapshot.type_bien ?? snapshot.type_label ?? data.opportunity?.title),
    adresse: stringify(snapshot.adresse ?? data.opportunity?.title),
    commune: stringify(snapshot.commune),
    surface: stringify(snapshot.surface),
    surface_terrain: stringify(snapshot.surface_terrain),
    nb_pieces: stringify(snapshot.nb_pieces),
    chambres: stringify(snapshot.chambres ?? snapshot.bedrooms),
    dpe: stringify(snapshot.dpe),
    etat: stringify(snapshot.etat),
    equipements: stringify(snapshot.equipements),
    contexte: stringify(snapshot.contexte),
    description: stringify(snapshot.description ?? opinion.property_description),
  }
}

function professionalFromData(data: ClientDetail): ProfessionalDraft {
  const opinion = asRecord(data.dossier.professional_opinion)
  const audience = asRecord(opinion.audience)
  return {
    price: stringify(opinion.price ?? opinion.prix_retenu ?? opinion.price_suggested),
    price_low: stringify(opinion.price_low ?? opinion.fourchette_basse),
    price_high: stringify(opinion.price_high ?? opinion.fourchette_haute),
    commission_rate: stringify(opinion.commission_rate ?? '0.045'),
    summary: stringify(opinion.summary ?? opinion.market_context),
    arguments: Array.isArray(opinion.arguments) ? opinion.arguments.map(stringify).filter(Boolean).join('\n') : stringify(opinion.arguments),
    comparables_json: JSON.stringify(Array.isArray(opinion.comparables) ? opinion.comparables : [], null, 2),
    audience_views: stringify(audience.views_count ?? audience.views),
    audience_views_change: stringify(audience.views_change),
    audience_contacts: stringify(audience.contacts_count ?? audience.contacts),
    audience_contacts_change: stringify(audience.contacts_change),
    portals: portalsFromAudience(audience),
  }
}

function emptyPropertyDraft(): PropertyDraft {
  return {
    mandate_number: '',
    mandate_type: 'Mandat de vente exclusif (OS)',
    type_bien: '',
    adresse: '',
    commune: '',
    surface: '',
    surface_terrain: '',
    nb_pieces: '',
    chambres: '',
    dpe: '',
    etat: '',
    equipements: '',
    contexte: '',
    description: '',
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
    audience_views: '',
    audience_views_change: '',
    audience_contacts: '',
    audience_contacts_change: '',
    portals: defaultPortalDrafts(),
  }
}

function defaultPortalDrafts(): PortalDraft[] {
  return PORTAL_DEFS.map((portal) => ({
    ...portal,
    views: '',
    engagement: '',
    calls: '',
    messages: '',
    favorites: '',
  }))
}

function portalsFromAudience(audience: Record<string, unknown>): PortalDraft[] {
  const portals = asRecord(audience.portals)
  return PORTAL_DEFS.map((definition) => {
    const stored = asRecord(portals[definition.id])
    return {
      ...definition,
      description: stringify(stored.description ?? definition.description),
      views: stringify(stored.views),
      engagement: stringify(stored.engagement),
      calls: stringify(stored.calls),
      messages: stringify(stored.messages),
      favorites: stringify(stored.favorites),
    }
  })
}

function replacePortal(portals: PortalDraft[], id: PortalId, next: PortalDraft) {
  return portals.map((portal) => (portal.id === id ? next : portal))
}

function normalizeProperty(draft: PropertyDraft) {
  return {
    mandate_number: draft.mandate_number.trim() || null,
    mandate_type: draft.mandate_type.trim() || null,
    type_bien: draft.type_bien.trim() || null,
    type_label: draft.type_bien.trim() || null,
    adresse: draft.adresse.trim() || null,
    commune: draft.commune.trim() || null,
    surface: nullableNumber(draft.surface),
    surface_terrain: nullableNumber(draft.surface_terrain),
    nb_pieces: nullableNumber(draft.nb_pieces),
    chambres: nullableNumber(draft.chambres),
    dpe: draft.dpe.trim() || null,
    etat: draft.etat.trim() || null,
    equipements: draft.equipements.trim() || null,
    contexte: draft.contexte.trim() || null,
    description: draft.description.trim() || null,
    hero_title: draft.type_bien.trim() || null,
  }
}

function normalizeProfessionalOpinion(draft: ProfessionalDraft, property: PropertyDraft) {
  return {
    price: nullableNumber(draft.price),
    price_suggested: nullableNumber(draft.price),
    price_low: nullableNumber(draft.price_low),
    price_high: nullableNumber(draft.price_high),
    commission_rate: nullableNumber(draft.commission_rate) ?? 0.045,
    summary: draft.summary.trim() || null,
    property_description: property.description.trim() || null,
    mandate_type: property.mandate_type.trim() || null,
    mandate_number: property.mandate_number.trim() || null,
    arguments: draft.arguments.split('\n').map((line) => line.trim()).filter(Boolean),
    comparables: parseComparables(draft.comparables_json),
    audience: {
      views_count: nullableNumber(draft.audience_views),
      views: nullableNumber(draft.audience_views),
      views_change: nullableNumber(draft.audience_views_change),
      contacts_count: nullableNumber(draft.audience_contacts),
      contacts: nullableNumber(draft.audience_contacts),
      contacts_change: nullableNumber(draft.audience_contacts_change),
      portals: Object.fromEntries(draft.portals.map((portal) => [
        portal.id,
        {
          name: portal.name,
          description: portal.description,
          views: nullableNumber(portal.views),
          engagement: nullableNumber(portal.engagement),
          calls: nullableNumber(portal.calls),
          messages: nullableNumber(portal.messages),
          favorites: nullableNumber(portal.favorites),
        },
      ])),
    },
  }
}

function emptyEventDraft() {
  return {
    title: '',
    description: '',
    status: 'todo',
    event_date: '',
    visible_to_client: true,
    milestone_kind: '',
    buyer_name: '',
    amount: '',
    rating: '',
    buyer_profile: '',
    financing: '',
    offer_condition: '',
    offer_strength: '',
  }
}

function normalizeEventPayload(event: ReturnType<typeof emptyEventDraft>) {
  return {
    milestone_kind: event.milestone_kind.trim() || null,
    buyer_name: event.buyer_name.trim() || null,
    amount: nullableNumber(event.amount),
    rating: nullableNumber(event.rating),
    buyer_profile: event.buyer_profile.trim() || null,
    financing: event.financing.trim() || null,
    offer_condition: event.offer_condition.trim() || null,
    offer_strength: event.offer_strength.trim() || null,
  }
}

function normalizedEventStatus(type: string, status: string) {
  const options = type === 'visit' ? VISIT_STATUS_OPTIONS : type === 'offer' ? OFFER_STATUS_OPTIONS : EVENT_STATUS_OPTIONS
  return options.some((option) => option.value === status) ? status : options[0]?.value ?? status
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
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

function splitTags(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function uniqueTags(values: string[]) {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)))
}

function summarizeEventPayload(value: Json) {
  const payload = asRecord(value)
  const buyer = stringify(payload.buyer_name)
  const amount = nullableNumber(stringify(payload.amount))
  const rating = nullableNumber(stringify(payload.rating))
  const milestone = stringify(payload.milestone_kind)
  const profile = stringify(payload.buyer_profile)
  const financing = stringify(payload.financing)
  const condition = stringify(payload.offer_condition)
  const strength = stringify(payload.offer_strength)
  return [
    milestone,
    buyer,
    amount ? `${amount.toLocaleString('fr-FR')} €` : null,
    rating ? `Intérêt ${rating}/5` : null,
    profile,
    financing,
    condition,
    strength,
  ].filter(Boolean).join(' · ')
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
