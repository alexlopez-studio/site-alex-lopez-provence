'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit,
  ExternalLink,
  Home,
  Link2,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  StickyNote,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { OpportunityEventType } from '@/types/supabase'

type Priority = 'low' | 'medium' | 'high' | 'critical'

interface OpportunityEvent {
  id: string
  opportunity_id: string
  type: OpportunityEventType
  title: string | null
  content: string | null
  due_at: string | null
  occurred_at: string
  completed_at: string | null
  metadata: Record<string, unknown>
  created_by: string | null
  created_at: string
  updated_at: string
}

interface Opportunity {
  id: string
  lead_id: string | null
  market_property_id: string | null
  title: string | null
  description: string | null
  stage: string | null
  priority: string | null
  next_action: string | null
  due_date: string | null
  note: string | null
  seller_name: string | null
  seller_phone: string | null
  seller_email: string | null
  source_channel: string | null
  property_city: string | null
  property_type: string | null
  estimated_price_min: number | null
  estimated_price_max: number | null
  selling_timeline: string | null
  pre_estimation_done_at: string | null
  visit_at: string | null
  report_delivered_at: string | null
  follow_up_at: string | null
  property_snapshot: Record<string, unknown>
  professional_opinion: Record<string, unknown>
  created_at: string
  updated_at: string
  lead: LeadInfo | null
  property: PropertyInfo | null
  events: OpportunityEvent[]
}

interface LeadInfo {
  id: string
  commune: string | null
  source_channel: string | null
  priority: string | null
  next_action: string | null
  due_date: string | null
  follow_up_at: string | null
  prospect: {
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
  } | null
  seller_property: {
    adresse: string | null
    type_bien: string | null
    surface: number | null
    surface_terrain: number | null
    nb_pieces: number | null
    delai: string | null
    prix_estime: number | null
  } | null
}

interface PropertyInfo {
  id: string
  external_id: string | null
  title: string | null
  description: string | null
  price: number | null
  surface: number | null
  land_surface: number | null
  rooms: number | null
  bedrooms: number | null
  price_per_m2: number | null
  city: string | null
  zipcode: string | null
  property_type: string | null
  status: string | null
  source: string | null
  url: string | null
  seller_type: string | null
  published_at: string | null
  first_seen_at: string | null
  last_seen_at: string | null
  thumbnail_url: string | null
}

interface PropertySearchRow extends PropertyInfo {
  opportunity?: { id: string; title: string; stage: string | null; priority: string | null } | null
}

interface LeadSearchRow {
  id: string
  commune: string | null
  source_channel: string | null
  priority: Priority
  next_action: string | null
  prospect: {
    first_name: string
    last_name: string
    email: string | null
    phone: string | null
  }
  seller_property: {
    type_bien: string | null
    surface: number | null
    prix_estime: number | null
  } | null
  opportunity: { id: string; title: string; stage: string | null } | null
}

interface EventDraft {
  type: OpportunityEventType
  title: string
  content: string
  due_at: string
  occurred_at: string
  milestone: string
}

interface PropertyDraft {
  mandate_number: string
  mandate_type: string
  type_bien: string
  adresse: string
  commune: string
  surface: string
  surface_terrain: string
  nb_pieces: string
  dpe: string
  etat: string
  equipements: string
  contexte: string
  points_vigilance: string
}

interface ProfessionalDraft {
  price: string
  price_low: string
  price_high: string
  summary: string
  arguments: string
  comparables_json: string
}

const STAGES = [
  'Veille annonce',
  'Nouveau contact',
  'Pré-estimation',
  "Visite d'estimation",
  "Remise de l'estimation",
  'Décision vendeur',
  'Suivi moyen terme',
  'Mandat signé',
  'Vendu',
  'Perdu / Écarté',
]

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  critical: 'Urgente',
}

const PRIORITY_CLASSES: Record<string, string> = {
  low: 'bg-gray-50 text-gray-600 border-gray-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
}

const EVENT_CONFIG: Record<OpportunityEventType, { label: string; icon: typeof StickyNote; className: string }> = {
  note: { label: 'Note', icon: StickyNote, className: 'bg-slate-50 text-slate-700 border-slate-200' },
  task: { label: 'Tâche', icon: CheckCircle2, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  call: { label: 'Appel', icon: Phone, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  meeting: { label: 'RDV', icon: Calendar, className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  email: { label: 'Email', icon: Mail, className: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  stage_change: { label: 'Étape', icon: ChevronDown, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  estimation: { label: 'Estimation', icon: Building2, className: 'bg-purple-50 text-purple-700 border-purple-200' },
  system: { label: 'Système', icon: MoreHorizontal, className: 'bg-gray-50 text-gray-600 border-gray-200' },
}

const PROPERTY_TYPES = [
  { value: 'maison', label: 'Maison' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'terrain', label: 'Terrain' },
  { value: 'immeuble', label: 'Immeuble' },
  { value: 'autre', label: 'Autre' },
]

const ESTIMATION_MILESTONES = [
  { value: 'estimation_done', label: 'Estimation réalisée' },
]

const EMPTY_PROPERTY_DRAFT: PropertyDraft = {
  mandate_number: '',
  mandate_type: '',
  type_bien: '',
  adresse: '',
  commune: '',
  surface: '',
  surface_terrain: '',
  nb_pieces: '',
  dpe: '',
  etat: '',
  equipements: '',
  contexte: '',
  points_vigilance: '',
}

const EMPTY_PROFESSIONAL_DRAFT: ProfessionalDraft = {
  price: '',
  price_low: '',
  price_high: '',
  summary: '',
  arguments: '',
  comparables_json: '[]',
}

function emptyEventDraft(type: OpportunityEventType): EventDraft {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return {
    type,
    title: type === 'task' ? 'Nouvelle tâche' : '',
    content: '',
    due_at: '',
    occurred_at: now.toISOString().slice(0, 16),
    milestone: 'pre_estimation',
  }
}

function leadName(lead: LeadInfo | null) {
  const name = [lead?.prospect?.first_name, lead?.prospect?.last_name].filter(Boolean).join(' ').trim()
  return name || 'Contact vendeur'
}

function leadOptionName(lead: LeadSearchRow) {
  return [lead.prospect.first_name, lead.prospect.last_name].filter(Boolean).join(' ').trim() || 'Contact vendeur'
}

function formatPrice(value: number | null | undefined) {
  if (value == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

function formatNumber(value: number | null | undefined, suffix = '') {
  if (value == null) return '—'
  return `${new Intl.NumberFormat('fr-FR').format(value)}${suffix}`
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function eventDate(event: OpportunityEvent) {
  return event.due_at ?? event.occurred_at ?? event.created_at
}

function isUserEditableProperty(property: PropertyInfo | null) {
  return property?.source === 'manual' || property?.source === 'user'
}

function milestoneRows(opportunity: Opportunity) {
  return [
    { label: 'Estimation réalisée', value: formatDate(opportunity.pre_estimation_done_at) },
    {
      label: 'Prochaine action',
      value: opportunity.next_action
        ? `${opportunity.next_action}${opportunity.due_date ? ` · ${formatDate(opportunity.due_date)}` : ''}`
        : '—',
    },
  ]
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function stringify(value: unknown) {
  if (value == null) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function nullableNumber(value: string) {
  const parsed = Number(value.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(parsed) && value.trim() !== '' ? parsed : null
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

function propertyDraftFromOpportunity(opportunity: Opportunity): PropertyDraft {
  const snapshot = asRecord(opportunity.property_snapshot)
  const leadProperty = opportunity.lead?.seller_property
  return {
    mandate_number: stringify(snapshot.mandate_number),
    mandate_type: stringify(snapshot.mandate_type),
    type_bien: stringify(snapshot.type_bien ?? leadProperty?.type_bien ?? opportunity.property_type ?? opportunity.property?.property_type),
    adresse: stringify(snapshot.adresse ?? leadProperty?.adresse ?? opportunity.property?.title),
    commune: stringify(snapshot.commune ?? opportunity.property_city ?? opportunity.lead?.commune ?? opportunity.property?.city),
    surface: stringify(snapshot.surface ?? leadProperty?.surface ?? opportunity.property?.surface),
    surface_terrain: stringify(snapshot.surface_terrain ?? leadProperty?.surface_terrain ?? opportunity.property?.land_surface),
    nb_pieces: stringify(snapshot.nb_pieces ?? leadProperty?.nb_pieces ?? opportunity.property?.rooms),
    dpe: stringify(snapshot.dpe),
    etat: stringify(snapshot.etat),
    equipements: stringify(snapshot.equipements),
    contexte: stringify(snapshot.contexte ?? opportunity.selling_timeline),
    points_vigilance: stringify(snapshot.points_vigilance),
  }
}

function professionalDraftFromOpportunity(opportunity: Opportunity): ProfessionalDraft {
  const opinion = asRecord(opportunity.professional_opinion)
  return {
    price: stringify(opinion.price ?? opinion.price_suggested ?? opportunity.estimated_price_min),
    price_low: stringify(opinion.price_low ?? opportunity.estimated_price_min),
    price_high: stringify(opinion.price_high ?? opportunity.estimated_price_max),
    summary: stringify(opinion.summary),
    arguments: Array.isArray(opinion.arguments) ? opinion.arguments.map(stringify).filter(Boolean).join('\n') : stringify(opinion.arguments),
    comparables_json: JSON.stringify(Array.isArray(opinion.comparables) ? opinion.comparables : [], null, 2),
  }
}

function normalizePropertyDraft(draft: PropertyDraft) {
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
    dpe: draft.dpe.trim() || null,
    etat: draft.etat.trim() || null,
    equipements: draft.equipements.trim() || null,
    contexte: draft.contexte.trim() || null,
    points_vigilance: draft.points_vigilance.trim() || null,
  }
}

function normalizeProfessionalDraft(draft: ProfessionalDraft) {
  return {
    price: nullableNumber(draft.price),
    price_suggested: nullableNumber(draft.price),
    price_low: nullableNumber(draft.price_low),
    price_high: nullableNumber(draft.price_high),
    summary: draft.summary.trim() || null,
    arguments: draft.arguments.split('\n').map((line) => line.trim()).filter(Boolean),
    comparables: parseComparables(draft.comparables_json),
  }
}

function eventToDraft(event: OpportunityEvent): EventDraft {
  const occurred = new Date(event.occurred_at)
  const due = event.due_at ? new Date(event.due_at) : null
  const normalize = (date: Date | null) => {
    if (!date || Number.isNaN(date.getTime())) return ''
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
  }

  return {
    type: event.type,
    title: event.title ?? '',
    content: event.content ?? '',
    due_at: normalize(due),
    occurred_at: normalize(occurred),
    milestone: typeof event.metadata?.milestone === 'string' ? event.metadata.milestone : 'estimation_done',
  }
}

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingStage, setSavingStage] = useState(false)
  const [propertyDraft, setPropertyDraft] = useState<PropertyDraft>(EMPTY_PROPERTY_DRAFT)
  const [professionalDraft, setProfessionalDraft] = useState<ProfessionalDraft>(EMPTY_PROFESSIONAL_DRAFT)
  const [savingPreparation, setSavingPreparation] = useState(false)

  const [eventDialogOpen, setEventDialogOpen] = useState(false)
  const [eventDraft, setEventDraft] = useState<EventDraft>(emptyEventDraft('note'))
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [savingEvent, setSavingEvent] = useState(false)
  const [completingEventId, setCompletingEventId] = useState<string | null>(null)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)

  const [leadDialogOpen, setLeadDialogOpen] = useState(false)
  const [leadSearch, setLeadSearch] = useState('')
  const [leadRows, setLeadRows] = useState<LeadSearchRow[]>([])
  const [leadLoading, setLeadLoading] = useState(false)
  const [attachingLeadId, setAttachingLeadId] = useState<string | null>(null)

  const [propertyDialogOpen, setPropertyDialogOpen] = useState(false)
  const [propertySearch, setPropertySearch] = useState('')
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('')
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('')
  const [propertyRows, setPropertyRows] = useState<PropertySearchRow[]>([])
  const [propertyLoading, setPropertyLoading] = useState(false)
  const [attachingPropertyId, setAttachingPropertyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/market/opportunities/' + id)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      const loadedOpportunity = { ...data.opportunity, events: data.opportunity.events ?? [] } as Opportunity
      setOpportunity(loadedOpportunity)
      setPropertyDraft(propertyDraftFromOpportunity(loadedOpportunity))
      setProfessionalDraft(professionalDraftFromOpportunity(loadedOpportunity))
    } catch (err) {
      console.error('[OpportunityDetailPage] load:', err)
      toast.error('Impossible de charger l’opportunité')
    } finally {
      setLoading(false)
    }
  }, [id])

  const loadLeads = useCallback(async () => {
    setLeadLoading(true)
    try {
      const params = new URLSearchParams({ page_size: '30', tool: 'vendre' })
      if (leadSearch.trim()) params.set('q', leadSearch.trim())
      const res = await fetch('/api/leads/list?' + params.toString())
      const data = await res.json()
      if (!res.ok || data.success === false) throw new Error(data.error ?? 'Erreur API')
      setLeadRows(data.data ?? [])
    } catch (err) {
      console.error('[OpportunityDetailPage] leads:', err)
      toast.error('Impossible de charger les contacts')
    } finally {
      setLeadLoading(false)
    }
  }, [leadSearch])

  const loadProperties = useCallback(async () => {
    setPropertyLoading(true)
    try {
      const params = new URLSearchParams({ limit: '20', sort: 'last_seen_at.desc' })
      if (propertySearch.trim()) params.set('q', propertySearch.trim())
      if (propertyTypeFilter) params.set('property_type', propertyTypeFilter)
      if (propertyStatusFilter) params.set('status', propertyStatusFilter)
      const res = await fetch('/api/market/properties?' + params.toString())
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      setPropertyRows(data.properties ?? [])
    } catch (err) {
      console.error('[OpportunityDetailPage] properties:', err)
      toast.error('Impossible de charger les biens')
    } finally {
      setPropertyLoading(false)
    }
  }, [propertySearch, propertyStatusFilter, propertyTypeFilter])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    if (!leadDialogOpen) return
    const timer = setTimeout(() => { void loadLeads() }, 250)
    return () => clearTimeout(timer)
  }, [leadDialogOpen, loadLeads])
  useEffect(() => {
    if (!propertyDialogOpen) return
    const timer = setTimeout(() => { void loadProperties() }, 250)
    return () => clearTimeout(timer)
  }, [propertyDialogOpen, loadProperties])

  const events = useMemo(
    () => [...(opportunity?.events ?? [])].sort((a, b) => new Date(eventDate(b)).getTime() - new Date(eventDate(a)).getTime()),
    [opportunity?.events],
  )
  const upcomingEvents = useMemo(
    () => events
      .filter((event) => ['task', 'call', 'meeting'].includes(event.type) && !event.completed_at)
      .sort((a, b) => new Date(eventDate(a)).getTime() - new Date(eventDate(b)).getTime()),
    [events],
  )
  const recentEvents = events.slice(0, 6)

  function openEvent(type: OpportunityEventType) {
    setEditingEventId(null)
    setEventDraft(emptyEventDraft(type))
    setEventDialogOpen(true)
  }

  function editEvent(event: OpportunityEvent) {
    setEditingEventId(event.id)
    setEventDraft(eventToDraft(event))
    setEventDialogOpen(true)
  }

  async function updateStage(stage: string) {
    if (!opportunity || stage === opportunity.stage) return
    setSavingStage(true)
    try {
      const res = await fetch('/api/market/opportunities/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      setOpportunity({ ...data.opportunity, events: data.opportunity.events ?? [] })
      toast.success('Étape mise à jour')
    } catch (err) {
      console.error('[OpportunityDetailPage] stage:', err)
      toast.error('Impossible de modifier l’étape')
    } finally {
      setSavingStage(false)
    }
  }

  async function savePreparation() {
    setSavingPreparation(true)
    try {
      const res = await fetch('/api/market/opportunities/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_snapshot: normalizePropertyDraft(propertyDraft),
          professional_opinion: normalizeProfessionalDraft(professionalDraft),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      const updatedOpportunity = { ...data.opportunity, events: data.opportunity.events ?? [] } as Opportunity
      setOpportunity(updatedOpportunity)
      setPropertyDraft(propertyDraftFromOpportunity(updatedOpportunity))
      setProfessionalDraft(professionalDraftFromOpportunity(updatedOpportunity))
      toast.success('Pré-mandat sauvegardé')
    } catch (err) {
      console.error('[OpportunityDetailPage] save preparation:', err)
      toast.error('Impossible de sauvegarder le pré-mandat')
    } finally {
      setSavingPreparation(false)
    }
  }

  async function saveEvent() {
    if (!eventDraft.title.trim() && !eventDraft.content.trim() && eventDraft.type !== 'estimation') {
      toast.error('Ajoute un titre ou un contenu')
      return
    }

    setSavingEvent(true)
    try {
      const milestone = ESTIMATION_MILESTONES.find((item) => item.value === eventDraft.milestone)
      const res = await fetch(
        editingEventId
          ? `/api/market/opportunities/${id}/events/${editingEventId}`
          : `/api/market/opportunities/${id}/events`,
        {
          method: editingEventId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: eventDraft.type,
            title: eventDraft.type === 'estimation' ? milestone?.label : eventDraft.title.trim(),
            content: eventDraft.content.trim() || null,
            due_at: eventDraft.due_at || null,
            occurred_at: eventDraft.occurred_at || null,
            metadata: eventDraft.type === 'estimation' ? { milestone: eventDraft.milestone } : {},
            created_by: 'admin',
          }),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      setEventDialogOpen(false)
      setEditingEventId(null)
      toast.success(editingEventId ? 'Activité modifiée' : 'Activité ajoutée')
      await load()
    } catch (err) {
      console.error('[OpportunityDetailPage] event:', err)
      toast.error('Impossible d’enregistrer l’activité')
    } finally {
      setSavingEvent(false)
    }
  }

  async function deleteEvent(event: OpportunityEvent) {
    if (!window.confirm('Supprimer cette activité ?')) return
    setDeletingEventId(event.id)
    try {
      const res = await fetch(`/api/market/opportunities/${id}/events/${event.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      toast.success('Activité supprimée')
      await load()
    } catch (err) {
      console.error('[OpportunityDetailPage] delete event:', err)
      toast.error('Impossible de supprimer l’activité')
    } finally {
      setDeletingEventId(null)
    }
  }

  async function completeEvent(event: OpportunityEvent) {
    setCompletingEventId(event.id)
    try {
      const res = await fetch(`/api/market/opportunities/${id}/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complete: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      toast.success('Activité terminée')
      await load()
    } catch (err) {
      console.error('[OpportunityDetailPage] complete event:', err)
      toast.error('Impossible de terminer l’activité')
    } finally {
      setCompletingEventId(null)
    }
  }

  async function attachLead(lead: LeadSearchRow) {
    if (lead.opportunity && lead.opportunity.id !== id) {
      toast.error('Ce contact est déjà rattaché à une opportunité')
      return
    }
    setAttachingLeadId(lead.id)
    try {
      const res = await fetch('/api/market/opportunities/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id }),
      })
      const data = await res.json()
      if (res.status === 409) {
        toast.error('Ce contact est déjà rattaché à une opportunité', {
          action: data.existing_opportunity?.id
            ? { label: 'Ouvrir', onClick: () => router.push(`/app/opportunities/${data.existing_opportunity.id}`) }
            : undefined,
        })
        return
      }
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      setOpportunity({ ...data.opportunity, events: data.opportunity.events ?? [] })
      setLeadDialogOpen(false)
      toast.success('Contact rattaché')
    } catch (err) {
      console.error('[OpportunityDetailPage] attach lead:', err)
      toast.error('Impossible de rattacher ce contact')
    } finally {
      setAttachingLeadId(null)
    }
  }

  async function attachProperty(property: PropertySearchRow) {
    if (property.opportunity && property.opportunity.id !== id) {
      toast.error('Ce bien est déjà rattaché à une opportunité')
      return
    }
    setAttachingPropertyId(property.id)
    try {
      const res = await fetch('/api/market/opportunities/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ market_property_id: property.id }),
      })
      const data = await res.json()
      if (res.status === 409) {
        toast.error('Ce bien est déjà rattaché à une opportunité', {
          action: data.existing_opportunity?.id
            ? { label: 'Ouvrir', onClick: () => router.push(`/app/opportunities/${data.existing_opportunity.id}`) }
            : undefined,
        })
        return
      }
      if (!res.ok) throw new Error(data.error ?? 'Erreur API')
      setOpportunity({ ...data.opportunity, events: data.opportunity.events ?? [] })
      setPropertyDialogOpen(false)
      toast.success('Bien rattaché')
    } catch (err) {
      console.error('[OpportunityDetailPage] attach property:', err)
      toast.error('Impossible de rattacher ce bien')
    } finally {
      setAttachingPropertyId(null)
    }
  }

  if (loading) return <div className="p-8 text-muted-foreground">Chargement...</div>
  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-muted-foreground">Opportunité introuvable</p>
        <Button variant="outline" onClick={() => router.push('/app/opportunities')}>Retour</Button>
      </div>
    )
  }

  const currentStage = opportunity.stage ?? STAGES[0]
  const stageIndex = Math.max(0, STAGES.indexOf(currentStage))
  const progress = Math.max(8, ((stageIndex + 1) / STAGES.length) * 100)
  const priority = opportunity.priority ?? 'medium'
  const editableProperty = isUserEditableProperty(opportunity.property)
  const estimate = opportunity.estimated_price_min || opportunity.estimated_price_max
    ? [opportunity.estimated_price_min, opportunity.estimated_price_max].filter((value): value is number => value != null).map(formatPrice).join(' - ')
    : null

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b pb-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link href="/app/opportunities" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Retour aux affaires
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="min-w-0 text-2xl font-bold leading-tight">{opportunity.title ?? 'Opportunité vendeur'}</h1>
            <Badge variant="outline">{currentStage}</Badge>
            <Badge variant="outline" className={cn(PRIORITY_CLASSES[priority] ?? PRIORITY_CLASSES.medium)}>
              {PRIORITY_LABELS[priority] ?? priority}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>Créée le {formatDate(opportunity.created_at)}</span>
            {opportunity.source_channel && <span>{opportunity.source_channel}</span>}
            {estimate && <span>{estimate}</span>}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full shrink-0 bg-brand hover:bg-brand-hover sm:w-auto">
              <Plus className="mr-2 size-4" />
              Ajouter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => openEvent('note')}><StickyNote className="mr-2 size-4" /> Ajouter une note</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEvent('task')}><CheckCircle2 className="mr-2 size-4" /> Ajouter une tâche</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEvent('call')}><Phone className="mr-2 size-4" /> Planifier un appel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEvent('meeting')}><Calendar className="mr-2 size-4" /> Planifier un RDV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEvent('email')}><Mail className="mr-2 size-4" /> Logguer un email</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEvent('estimation')}><Building2 className="mr-2 size-4" /> Ajouter une étape estimation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList variant="line" className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="overview" className="px-0 sm:px-3">Vue d’ensemble</TabsTrigger>
          <TabsTrigger value="preparation" className="px-0 sm:px-3">Bien & technique</TabsTrigger>
          <TabsTrigger value="estimation" className="px-0 sm:px-3">Estimation</TabsTrigger>
          <TabsTrigger value="history" className="px-0 sm:px-3">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <main className="space-y-5">
              <section className="rounded-xl border bg-card p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-base font-semibold">Étape en cours</h2>
                    <div className="mt-3 flex items-center gap-3 text-sm">
                      <span className="rounded-md border bg-muted/30 px-2 py-1 font-medium">{stageIndex + 1}/{STAGES.length}</span>
                      <span>{currentStage}</span>
                      {savingStage && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                    </div>
                  </div>
                  <Select value={currentStage} onValueChange={updateStage}>
                    <SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger>
                    <SelectContent>{STAGES.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Ouverte depuis le {formatDate(opportunity.created_at)}.
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-4">
                  {milestoneRows(opportunity).map((milestone) => (
                    <div key={milestone.label} className="rounded-lg border bg-muted/20 p-3">
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground">{milestone.label}</p>
                      <p className="mt-1 line-clamp-2 text-sm font-medium">{milestone.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border bg-card p-5">
                <h2 className="text-base font-semibold">Activités à venir</h2>
                <div className="mt-4 space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
                      Aucune activité à venir. Utilise le bouton Ajouter pour créer une tâche, un appel ou un RDV.
                    </div>
                  ) : upcomingEvents.map((event) => (
                    <ActivityRow
                      key={event.id}
                      event={event}
                      action={
                        <EventActions
                          event={event}
                          completing={completingEventId === event.id}
                          deleting={deletingEventId === event.id}
                          onComplete={completeEvent}
                          onEdit={editEvent}
                          onDelete={deleteEvent}
                        />
                      }
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-xl border bg-card p-5">
                <h2 className="text-base font-semibold">Historique récent</h2>
                <Timeline events={recentEvents} emptyText="Aucune activité récente." onEdit={editEvent} onDelete={deleteEvent} deletingEventId={deletingEventId} />
              </section>
            </main>

            <aside className="space-y-5">
              <InfoCard
                title="Bien"
                icon={<Home className="size-4" />}
                action={opportunity.property ? (
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/app/properties/${opportunity.property.id}`}><ExternalLink className="mr-1 size-3.5" /> Ouvrir</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPropertyDialogOpen(true)}>
                      <Link2 className="mr-1 size-3.5" /> Changer
                    </Button>
                    {editableProperty && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/app/properties/${opportunity.property.id}`}><Edit className="mr-1 size-3.5" /> Modifier</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setPropertyDialogOpen(true)}><Plus className="mr-1 size-3.5" /> Ajouter</Button>
                )}
              >
                {opportunity.property ? (
                  <div className="space-y-3">
                    <PropertyThumbnail title={opportunity.property.title} url={opportunity.property.thumbnail_url} />
                    <div>
                      <p className="line-clamp-2 font-medium">{opportunity.property.title ?? 'Bien en annonce'}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {opportunity.property.city && <span>{opportunity.property.city}</span>}
                        {opportunity.property.zipcode && <span>{opportunity.property.zipcode}</span>}
                        {opportunity.property.status && <Badge variant="outline" className="text-[10px]">{opportunity.property.status}</Badge>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Metric label="Prix" value={formatPrice(opportunity.property.price)} />
                      <Metric label="Surface" value={formatNumber(opportunity.property.surface, ' m²')} />
                      <Metric label="Vendeur" value={opportunity.property.seller_type ?? '—'} />
                      <Metric label="Source" value={opportunity.property.source ?? '—'} />
                    </div>
                    {!editableProperty && (
                      <p className="text-xs text-muted-foreground">Annonce importée : modification verrouillée.</p>
                    )}
                  </div>
                ) : (
                  <EmptyCardText>Aucun bien associé à cette opportunité.</EmptyCardText>
                )}
              </InfoCard>

              <InfoCard
                title="Contacts"
                icon={<UserRound className="size-4" />}
                action={opportunity.lead ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/app/leads/${opportunity.lead.id}`}><ExternalLink className="mr-1 size-3.5" /> Ouvrir</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/app/leads/${opportunity.lead.id}`}><Edit className="mr-1 size-3.5" /> Modifier</Link>
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setLeadDialogOpen(true)}><Plus className="mr-1 size-3.5" /> Ajouter</Button>
                )}
              >
                {opportunity.lead ? (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{leadName(opportunity.lead)}</p>
                      <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {opportunity.lead.prospect?.phone && <p className="flex items-center gap-1.5"><Phone className="size-3.5" /> {opportunity.lead.prospect.phone}</p>}
                        {opportunity.lead.prospect?.email && <p className="flex items-center gap-1.5"><Mail className="size-3.5" /> {opportunity.lead.prospect.email}</p>}
                        {opportunity.lead.commune && <p className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {opportunity.lead.commune}</p>}
                      </div>
                    </div>
                    <Metric label="Source" value={opportunity.lead.source_channel ?? '—'} />
                    {opportunity.lead.next_action && <p className="text-sm text-muted-foreground">{opportunity.lead.next_action}</p>}
                  </div>
                ) : (
                  <EmptyCardText>Aucun contact associé à cette opportunité.</EmptyCardText>
                )}
              </InfoCard>
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="preparation">
          <section className="rounded-xl border bg-card p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold">Préparation bien & technique</h2>
                <p className="mt-1 text-sm text-muted-foreground">Données de travail pré-mandat, conservées sur l’opportunité.</p>
              </div>
              <Button onClick={savePreparation} disabled={savingPreparation} className="bg-brand hover:bg-brand-hover">
                {savingPreparation ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
                Sauvegarder
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DraftField label="N° mandat" value={propertyDraft.mandate_number} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, mandate_number: value }))} />
              <DraftField label="Type de mandat prévu" value={propertyDraft.mandate_type} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, mandate_type: value }))} />
              <DraftField label="Type de bien" value={propertyDraft.type_bien} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, type_bien: value }))} />
              <DraftField label="Adresse / secteur" value={propertyDraft.adresse} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, adresse: value }))} />
              <DraftField label="Commune" value={propertyDraft.commune} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, commune: value }))} />
              <DraftField label="DPE" value={propertyDraft.dpe} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, dpe: value }))} />
              <DraftField label="Surface habitable" type="number" value={propertyDraft.surface} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, surface: value }))} />
              <DraftField label="Terrain / extérieur" type="number" value={propertyDraft.surface_terrain} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, surface_terrain: value }))} />
              <DraftField label="Pièces" type="number" value={propertyDraft.nb_pieces} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, nb_pieces: value }))} />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <DraftArea label="État / travaux" value={propertyDraft.etat} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, etat: value }))} />
              <DraftArea label="Équipements" value={propertyDraft.equipements} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, equipements: value }))} />
              <DraftArea label="Contexte vendeur" value={propertyDraft.contexte} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, contexte: value }))} />
              <DraftArea label="Points de vigilance" value={propertyDraft.points_vigilance} onChange={(value) => setPropertyDraft((draft) => ({ ...draft, points_vigilance: value }))} />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="estimation">
          <section className="rounded-xl border bg-card p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold">Estimation & avis de valeur</h2>
                <p className="mt-1 text-sm text-muted-foreground">Prépare l’avis de valeur avant signature, sans créer de client.</p>
              </div>
              <Button onClick={savePreparation} disabled={savingPreparation} className="bg-brand hover:bg-brand-hover">
                {savingPreparation ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
                Sauvegarder
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <DraftField label="Prix retenu" type="number" value={professionalDraft.price} onChange={(value) => setProfessionalDraft((draft) => ({ ...draft, price: value }))} />
              <DraftField label="Estimation basse" type="number" value={professionalDraft.price_low} onChange={(value) => setProfessionalDraft((draft) => ({ ...draft, price_low: value }))} />
              <DraftField label="Estimation haute" type="number" value={professionalDraft.price_high} onChange={(value) => setProfessionalDraft((draft) => ({ ...draft, price_high: value }))} />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <DraftArea label="Synthèse de l’avis" value={professionalDraft.summary} onChange={(value) => setProfessionalDraft((draft) => ({ ...draft, summary: value }))} rows={5} />
              <DraftArea label="Arguments de valeur" value={professionalDraft.arguments} onChange={(value) => setProfessionalDraft((draft) => ({ ...draft, arguments: value }))} rows={5} />
            </div>

            <label className="mt-4 block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Comparables JSON</span>
              <Textarea value={professionalDraft.comparables_json} onChange={(e) => setProfessionalDraft((draft) => ({ ...draft, comparables_json: e.target.value }))} rows={8} className="font-mono text-xs" />
            </label>
          </section>
        </TabsContent>

        <TabsContent value="history">
          <section className="rounded-xl border bg-card p-5">
            <h2 className="text-base font-semibold">Historique complet</h2>
            <Timeline events={events} emptyText="Aucune activité enregistrée." onEdit={editEvent} onDelete={deleteEvent} deletingEventId={deletingEventId} />
          </section>
        </TabsContent>
      </Tabs>

      <EventDialog
        open={eventDialogOpen}
        draft={eventDraft}
        saving={savingEvent}
        editing={Boolean(editingEventId)}
        onOpenChange={setEventDialogOpen}
        onDraftChange={setEventDraft}
        onSubmit={saveEvent}
      />

      <LeadAttachDialog
        open={leadDialogOpen}
        rows={leadRows}
        search={leadSearch}
        loading={leadLoading}
        attachingId={attachingLeadId}
        opportunityId={id}
        onOpenChange={setLeadDialogOpen}
        onSearchChange={setLeadSearch}
        onAttach={attachLead}
        onOpenOpportunity={(opportunityId) => router.push(`/app/opportunities/${opportunityId}`)}
      />

      <PropertyAttachDialog
        open={propertyDialogOpen}
        rows={propertyRows}
        search={propertySearch}
        typeFilter={propertyTypeFilter}
        statusFilter={propertyStatusFilter}
        loading={propertyLoading}
        attachingId={attachingPropertyId}
        opportunityId={id}
        onOpenChange={setPropertyDialogOpen}
        onSearchChange={setPropertySearch}
        onTypeFilterChange={setPropertyTypeFilter}
        onStatusFilterChange={setPropertyStatusFilter}
        onAttach={attachProperty}
        onOpenOpportunity={(opportunityId) => router.push(`/app/opportunities/${opportunityId}`)}
      />
    </div>
  )
}

function InfoCard({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon: React.ReactNode
  action: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold">{icon}{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function DraftField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number'
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function DraftArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} />
    </label>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 p-3">
      <p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-medium">{value}</p>
    </div>
  )
}

function EmptyCardText({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">{children}</div>
}

function PropertyThumbnail({ title, url }: { title?: string | null; url?: string | null }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-lg border bg-muted/30">
      {url ? (
        <div
          aria-label={title ?? 'Miniature du bien'}
          className="h-full w-full bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url("${url}")` }}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <Home className="size-8" />
        </div>
      )}
    </div>
  )
}

function ActivityRow({ event, action }: { event: OpportunityEvent; action?: React.ReactNode }) {
  const config = EVENT_CONFIG[event.type]
  const Icon = config.icon
  return (
    <div className="rounded-lg border p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn('text-[10px]', config.className)}>
              <Icon className="mr-1 size-3" /> {config.label}
            </Badge>
            <p className="font-medium">{event.title || config.label}</p>
          </div>
          {event.content && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{event.content}</p>}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {formatDateTime(eventDate(event))}</span>
            {event.created_by && <span>{event.created_by}</span>}
            {event.completed_at && <span>Terminée le {formatDateTime(event.completed_at)}</span>}
          </div>
        </div>
        {action}
      </div>
    </div>
  )
}

function EventActions({
  event,
  completing,
  deleting,
  onComplete,
  onEdit,
  onDelete,
}: {
  event: OpportunityEvent
  completing?: boolean
  deleting?: boolean
  onComplete?: (event: OpportunityEvent) => void
  onEdit: (event: OpportunityEvent) => void
  onDelete: (event: OpportunityEvent) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {onComplete && !event.completed_at && ['task', 'call', 'meeting'].includes(event.type) && (
        <Button variant="outline" size="sm" onClick={() => onComplete(event)} disabled={completing}>
          {completing ? <Loader2 className="mr-1 size-4 animate-spin" /> : <CheckCircle2 className="mr-1 size-4" />}
          Terminée
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={() => onEdit(event)}>
        <Edit className="mr-1 size-4" />
        Modifier
      </Button>
      <Button variant="outline" size="sm" onClick={() => onDelete(event)} disabled={deleting}>
        {deleting ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
        Supprimer
      </Button>
    </div>
  )
}

function Timeline({
  events,
  emptyText,
  onEdit,
  onDelete,
  deletingEventId,
}: {
  events: OpportunityEvent[]
  emptyText: string
  onEdit: (event: OpportunityEvent) => void
  onDelete: (event: OpportunityEvent) => void
  deletingEventId: string | null
}) {
  if (events.length === 0) {
    return <div className="mt-4 rounded-lg border border-dashed p-5 text-sm text-muted-foreground">{emptyText}</div>
  }

  return (
    <div className="mt-4 space-y-4">
      {events.map((event) => (
        <div key={event.id} className="relative pl-6">
          <div className="absolute left-0 top-2 size-2 rounded-full bg-brand" />
          <div className="absolute bottom-[-18px] left-[3px] top-4 w-px bg-border last:hidden" />
          <ActivityRow
            event={event}
            action={
              <EventActions
                event={event}
                deleting={deletingEventId === event.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            }
          />
        </div>
      ))}
    </div>
  )
}

function EventDialog({
  open,
  draft,
  saving,
  editing,
  onOpenChange,
  onDraftChange,
  onSubmit,
}: {
  open: boolean
  draft: EventDraft
  saving: boolean
  editing: boolean
  onOpenChange: (open: boolean) => void
  onDraftChange: (draft: EventDraft) => void
  onSubmit: () => void
}) {
  const config = EVENT_CONFIG[draft.type]
  const showDue = ['task', 'call', 'meeting'].includes(draft.type)
  const showMilestone = draft.type === 'estimation'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{config.label}</DialogTitle>
          <DialogDescription>Ajoute une activité à la timeline de cette opportunité.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {showMilestone ? (
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Jalon</span>
              <Select value={draft.milestone} onValueChange={(value) => onDraftChange({ ...draft, milestone: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ESTIMATION_MILESTONES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
              </Select>
            </label>
          ) : (
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Titre</span>
              <Input value={draft.title} onChange={(e) => onDraftChange({ ...draft, title: e.target.value })} />
            </label>
          )}

          <label className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Détails</span>
            <Textarea
              value={draft.content}
              onChange={(e) => onDraftChange({ ...draft, content: e.target.value })}
              rows={4}
              placeholder="Compte rendu, objectif, précision utile..."
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Date de l’activité</span>
              <Input type="datetime-local" value={draft.occurred_at} onChange={(e) => onDraftChange({ ...draft, occurred_at: e.target.value })} />
            </label>
            {showDue && (
              <label className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Échéance</span>
                <Input type="datetime-local" value={draft.due_at} onChange={(e) => onDraftChange({ ...draft, due_at: e.target.value })} />
              </label>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>Annuler</Button>
          <Button onClick={onSubmit} disabled={saving} className="bg-brand hover:bg-brand-hover">
            {saving ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Plus className="mr-1 size-4" />}
            {editing ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LeadAttachDialog({
  open,
  rows,
  search,
  loading,
  attachingId,
  opportunityId,
  onOpenChange,
  onSearchChange,
  onAttach,
  onOpenOpportunity,
}: {
  open: boolean
  rows: LeadSearchRow[]
  search: string
  loading: boolean
  attachingId: string | null
  opportunityId: string
  onOpenChange: (open: boolean) => void
  onSearchChange: (value: string) => void
  onAttach: (lead: LeadSearchRow) => void
  onOpenOpportunity: (id: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un contact</DialogTitle>
          <DialogDescription>Recherche dans les contacts vendeurs déjà présents.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Nom, téléphone, email..." className="pl-9" />
          </div>
          <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-lg border p-2">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Chargement...</div>
            ) : rows.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Aucun contact trouvé</p>
            ) : rows.map((lead) => {
              const alreadyLinked = lead.opportunity && lead.opportunity.id !== opportunityId
              return (
                <div key={lead.id} className="rounded-lg border p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{leadOptionName(lead)}</p>
                        {alreadyLinked && <Badge variant="destructive" className="text-[10px]">déjà lié</Badge>}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {lead.prospect.phone && <span>{lead.prospect.phone}</span>}
                        {lead.prospect.email && <span>{lead.prospect.email}</span>}
                        {lead.commune && <span>{lead.commune}</span>}
                        {lead.seller_property?.type_bien && <span>{lead.seller_property.type_bien}</span>}
                      </div>
                    </div>
                    {alreadyLinked ? (
                      <Button variant="outline" size="sm" onClick={() => onOpenOpportunity(lead.opportunity!.id)}>Voir l’opportunité</Button>
                    ) : (
                      <Button size="sm" onClick={() => onAttach(lead)} disabled={attachingId === lead.id} className="bg-brand hover:bg-brand-hover">
                        {attachingId === lead.id ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Link2 className="mr-1 size-4" />}
                        Ajouter
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PropertyAttachDialog({
  open,
  rows,
  search,
  typeFilter,
  statusFilter,
  loading,
  attachingId,
  opportunityId,
  onOpenChange,
  onSearchChange,
  onTypeFilterChange,
  onStatusFilterChange,
  onAttach,
  onOpenOpportunity,
}: {
  open: boolean
  rows: PropertySearchRow[]
  search: string
  typeFilter: string
  statusFilter: string
  loading: boolean
  attachingId: string | null
  opportunityId: string
  onOpenChange: (open: boolean) => void
  onSearchChange: (value: string) => void
  onTypeFilterChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onAttach: (property: PropertySearchRow) => void
  onOpenOpportunity: (id: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ajouter un bien</DialogTitle>
          <DialogDescription>Recherche uniquement dans les biens déjà présents en base.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px_160px]">
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Recherche</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Titre, commune, CP..." className="pl-9" />
              </div>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Type</span>
              <select value={typeFilter} onChange={(e) => onTypeFilterChange(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Tous</option>
                {PROPERTY_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Statut</span>
              <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Tous</option>
                <option value="active">En ligne</option>
                <option value="online">Online</option>
                <option value="expired">Expiré</option>
                <option value="opportunity">Opportunité</option>
              </select>
            </label>
          </div>

          <div className="max-h-[460px] space-y-2 overflow-y-auto rounded-lg border p-2">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Chargement...</div>
            ) : rows.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Aucun bien trouvé</p>
            ) : rows.map((property) => {
              const alreadyLinked = property.opportunity && property.opportunity.id !== opportunityId
              return (
                <div key={property.id} className="rounded-lg border p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 gap-3">
                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md border bg-muted/30">
                        {property.thumbnail_url ? (
                          <div
                            aria-label={property.title ?? 'Miniature du bien'}
                            className="h-full w-full bg-cover bg-center"
                            role="img"
                            style={{ backgroundImage: `url("${property.thumbnail_url}")` }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <Home className="size-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="line-clamp-1 font-medium">{property.title ?? 'Bien en annonce'}</p>
                          {property.status && <Badge variant="outline" className="text-[10px]">{property.status}</Badge>}
                          {alreadyLinked && <Badge variant="destructive" className="text-[10px]">déjà lié</Badge>}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {[property.property_type, property.city, property.zipcode].filter(Boolean).map((item) => <span key={item}>{item}</span>)}
                          <span>{formatPrice(property.price)}</span>
                          <span>{formatNumber(property.surface, ' m²')}</span>
                          {property.seller_type && <span>{property.seller_type}</span>}
                        </div>
                      </div>
                    </div>
                    {alreadyLinked ? (
                      <Button variant="outline" size="sm" onClick={() => onOpenOpportunity(property.opportunity!.id)}>Voir l’opportunité</Button>
                    ) : (
                      <Button size="sm" onClick={() => onAttach(property)} disabled={attachingId === property.id} className="bg-brand hover:bg-brand-hover">
                        {attachingId === property.id ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Link2 className="mr-1 size-4" />}
                        Ajouter
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
