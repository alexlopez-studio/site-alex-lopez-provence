'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Star,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Home,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────

type Priority = 'low' | 'medium' | 'high' | 'critical'
type SignalType = 'price_drop' | 'new_listing' | 'undervalued' | 'expired' | 'manual'

interface Opportunity {
  id: string
  title: string
  description: string
  stage: string
  priority: Priority
  type: SignalType
  propertyTitle: string | null
  propertyCity: string | null
  propertyPrice: number | null
  nextAction: string | null
  dueDate: string | null
  created_at: string
}

// Ligne brute renvoyée par l'API (enrichie du bien lié)
interface OpportunityRow {
  id: string
  title: string | null
  description: string | null
  stage: string | null
  priority: string | null
  signal_type: string | null
  next_action: string | null
  due_date: string | null
  created_at: string
  property: { title: string | null; city: string | null; price: number | null } | null
}

// ─── Stages ───────────────────────────────────────────────
// L'identité d'un stage = son label FR (valeur stockée en base, cf. POST + règles).

const STAGES = [
  { id: 'À qualifier', label: 'À qualifier', color: 'bg-slate-500' },
  { id: 'À analyser', label: 'À analyser', color: 'bg-blue-500' },
  { id: 'À contacter', label: 'À contacter', color: 'bg-amber-500' },
  { id: 'Contacté', label: 'Contacté', color: 'bg-purple-500' },
  { id: 'Rendez-vous à préparer', label: 'RDV à préparer', color: 'bg-indigo-500' },
  { id: 'En suivi', label: 'En suivi', color: 'bg-cyan-500' },
  { id: 'Mandat potentiel', label: 'Mandat potentiel', color: 'bg-emerald-500' },
  { id: 'Converti', label: 'Converti', color: 'bg-green-600' },
  { id: 'Écarté', label: 'Écarté', color: 'bg-gray-400' },
]

const PIPELINE_STAGES = STAGES.slice(0, 7) // Colonnes actives
const FOOTER_STAGES = STAGES.slice(7) // Converti + Écarté (issues du pipeline)
const DEFAULT_STAGE = STAGES[0].id

const PRIORITY_CONFIG: Record<Priority, { label: string; class: string }> = {
  low: { label: 'Basse', class: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Moyenne', class: 'bg-blue-100 text-blue-600' },
  high: { label: 'Haute', class: 'bg-orange-100 text-orange-600' },
  critical: { label: 'Urgente', class: 'bg-red-100 text-red-600' },
}

const TYPE_CONFIG: Record<SignalType, { label: string; icon: typeof AlertTriangle; class: string }> = {
  price_drop: { label: 'Baisse de prix', icon: AlertTriangle, class: 'bg-red-50 text-red-700 border-red-200' },
  new_listing: { label: 'Nouveau bien', icon: Home, class: 'bg-blue-50 text-blue-700 border-blue-200' },
  undervalued: { label: 'Sous-évalué', icon: Star, class: 'bg-amber-50 text-amber-700 border-amber-200' },
  expired: { label: 'Expiré', icon: Clock, class: 'bg-gray-50 text-gray-700 border-gray-200' },
  manual: { label: 'Manuel', icon: User, class: 'bg-purple-50 text-purple-700 border-purple-200' },
}

// ─── Helpers ──────────────────────────────────────────────

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatDaysAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  return `Il y a ${days}j`
}

function normalizePriority(value: string | null): Priority {
  return value === 'low' || value === 'medium' || value === 'high' || value === 'critical' ? value : 'medium'
}

function normalizeType(value: string | null): SignalType {
  return value === 'price_drop' || value === 'new_listing' || value === 'undervalued' || value === 'expired' || value === 'manual'
    ? value
    : 'manual'
}

function mapRow(row: OpportunityRow): Opportunity {
  // Un stage inconnu retombe sur la première colonne pour rester visible.
  const stage = STAGES.some((s) => s.id === row.stage) ? (row.stage as string) : DEFAULT_STAGE
  return {
    id: row.id,
    title: row.title ?? 'Opportunité',
    description: row.description ?? '',
    stage,
    priority: normalizePriority(row.priority),
    type: normalizeType(row.signal_type),
    propertyTitle: row.property?.title ?? null,
    propertyCity: row.property?.city ?? null,
    propertyPrice: row.property?.price ?? null,
    nextAction: row.next_action,
    dueDate: row.due_date,
    created_at: row.created_at,
  }
}

// ─── Sortable Card ─────────────────────────────────────────

function SortableOpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opportunity.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const typeCfg = TYPE_CONFIG[opportunity.type]
  const priorityCfg = PRIORITY_CONFIG[opportunity.priority]
  const TypeIcon = typeCfg.icon

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <Card className="hover:shadow-md transition-shadow pointer-events-none">
        <CardContent className="p-3">
          <div className="flex items-center justify-end mb-2">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', typeCfg.class)}>
                <TypeIcon className="h-3 w-3 mr-1" />
                {typeCfg.label}
              </Badge>
              <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', priorityCfg.class)}>
                {priorityCfg.label}
              </Badge>
            </div>
          </div>

          <p className="text-sm font-medium leading-tight mb-1">{opportunity.title}</p>
          {opportunity.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{opportunity.description}</p>
          )}

          {/* Bien lié — masqué pour une opportunité sans bien */}
          {opportunity.propertyTitle && (
            <div className="rounded-md bg-muted/30 p-2 mb-3">
              <p className="text-xs font-medium truncate">{opportunity.propertyTitle}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">{opportunity.propertyCity ?? ''}</span>
                {opportunity.propertyPrice != null && (
                  <span className="text-xs font-medium">{formatPrice(opportunity.propertyPrice)}</span>
                )}
              </div>
            </div>
          )}

          {opportunity.nextAction && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <ArrowUpRight className="h-3 w-3" />
              {opportunity.nextAction}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{formatDaysAgo(opportunity.created_at)}</span>
            {opportunity.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(opportunity.dueDate)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Drag Overlay ──────────────────────────────────────────

function OpportunityCardOverlay({ opportunity }: { opportunity: Opportunity }) {
  const typeCfg = TYPE_CONFIG[opportunity.type]
  const priorityCfg = PRIORITY_CONFIG[opportunity.priority]
  const TypeIcon = typeCfg.icon

  return (
    <Card className="shadow-xl rotate-3 opacity-90 w-72">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', typeCfg.class)}>
              <TypeIcon className="h-3 w-3 mr-1" />
              {typeCfg.label}
            </Badge>
            <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', priorityCfg.class)}>
              {priorityCfg.label}
            </Badge>
          </div>
        </div>
        <p className="text-sm font-medium leading-tight mb-1">{opportunity.title}</p>
        {opportunity.propertyTitle && (
          <div className="rounded-md bg-muted/30 p-2">
            <p className="text-xs font-medium truncate">{opportunity.propertyTitle}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Droppable Column ─────────────────────────────────────

function DroppableColumn({ stage, children }: { stage: typeof STAGES[0]; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'space-y-3 min-h-[200px] rounded-lg p-2 transition-colors',
        isOver ? 'bg-primary/10 ring-2 ring-primary/30' : 'bg-muted/20',
      )}
    >
      {children}
    </div>
  )
}

// ─── Create dialog ─────────────────────────────────────────

interface CreateDraft {
  title: string
  description: string
  priority: Priority
  nextAction: string
  dueDate: string
  stage: string
}

function emptyDraft(stage: string): CreateDraft {
  return { title: '', description: '', priority: 'medium', nextAction: '', dueDate: '', stage }
}

// ─── Main Kanban Board ─────────────────────────────────────

export function KanbanBoard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState<CreateDraft>(emptyDraft(DEFAULT_STAGE))
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  )

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/market/opportunities?limit=100')
      const data = await res.json()
      const rows: OpportunityRow[] = data.opportunities ?? []
      setOpportunities(rows.map(mapRow))
    } catch (err) {
      console.error('Erreur chargement opportunités', err)
      toast.error('Impossible de charger les opportunités')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const activeOpportunity = activeId ? opportunities.find((o) => o.id === activeId) ?? null : null
  const getStageOpps = (stageId: string) => opportunities.filter((o) => o.stage === stageId)
  const findStageByOppId = (id: string) => opportunities.find((o) => o.id === id)?.stage

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  async function persistStage(id: string, stage: string, previousStage: string) {
    try {
      const res = await fetch(`/api/market/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      })
      if (!res.ok) throw new Error('Erreur API')
    } catch (err) {
      console.error('Erreur persistance stage:', err)
      // Revert optimiste
      setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, stage: previousStage } : o)))
      toast.error('Déplacement non enregistré — réessaie')
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeIdStr = String(active.id)
    const overIdStr = String(over.id)

    // Stage cible : colonne directe, sinon stage de la carte survolée
    const targetStage = STAGES.find((s) => s.id === overIdStr)?.id ?? findStageByOppId(overIdStr)
    if (!targetStage) return

    const current = opportunities.find((o) => o.id === activeIdStr)
    if (!current || current.stage === targetStage) return

    const previousStage = current.stage
    setOpportunities((prev) => prev.map((o) => (o.id === activeIdStr ? { ...o, stage: targetStage } : o)))
    void persistStage(activeIdStr, targetStage, previousStage)
  }

  function openCreate(stage: string = DEFAULT_STAGE) {
    setDraft(emptyDraft(stage))
    setDialogOpen(true)
  }

  async function submitCreate() {
    const title = draft.title.trim()
    if (!title) {
      toast.error('Le titre est requis')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/market/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: draft.description.trim() || null,
          stage: draft.stage,
          priority: draft.priority,
          signal_type: 'manual',
          next_action: draft.nextAction.trim() || null,
          due_date: draft.dueDate || null,
          created_from: 'manual',
        }),
      })
      if (!res.ok) throw new Error('Erreur API')
      toast.success('Opportunité créée')
      setDialogOpen(false)
      await load()
    } catch (err) {
      console.error('Erreur création opportunité:', err)
      toast.error('Impossible de créer l’opportunité')
    } finally {
      setSaving(false)
    }
  }

  const total = opportunities.length

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Opportunités</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loading ? '…' : `${total} opportunité${total > 1 ? 's' : ''} — pipeline de mandats`}
            </p>
          </div>
          <Button onClick={() => openCreate()}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle opportunité
          </Button>
        </div>

        {/* Kanban board */}
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
          {PIPELINE_STAGES.map((stage) => {
            const stageOpps = getStageOpps(stage.id)
            return (
              <div key={stage.id} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                    <span className="text-sm font-medium">{stage.label}</span>
                    <span className="text-xs text-muted-foreground">({stageOpps.length})</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openCreate(stage.id)}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <SortableContext items={stageOpps.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                  <DroppableColumn stage={stage}>
                    {stageOpps.map((opp) => (
                      <SortableOpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                    {stageOpps.length === 0 && (
                      <div className="flex items-center justify-center h-32 text-xs text-muted-foreground border-2 border-dashed border-border rounded-lg">
                        {loading ? 'Chargement…' : 'Déposer ici'}
                      </div>
                    )}
                  </DroppableColumn>
                </SortableContext>
              </div>
            )
          })}
        </div>

        {/* Issues du pipeline — droppables (Converti / Écarté) */}
        <div className="grid gap-4 sm:grid-cols-2">
          {FOOTER_STAGES.map((stage) => {
            const stageOpps = getStageOpps(stage.id)
            return (
              <div key={stage.id}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className={cn('w-2 h-2 rounded-full', stage.color)} />
                  <span className="text-sm font-medium">{stage.label}</span>
                  <span className="text-xs text-muted-foreground">({stageOpps.length})</span>
                </div>
                <SortableContext items={stageOpps.map((o) => o.id)} strategy={verticalListSortingStrategy}>
                  <DroppableColumn stage={stage}>
                    {stageOpps.map((opp) => (
                      <SortableOpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                    {stageOpps.length === 0 && (
                      <div className="flex items-center justify-center h-16 text-xs text-muted-foreground border-2 border-dashed border-border rounded-lg">
                        Déposer ici
                      </div>
                    )}
                  </DroppableColumn>
                </SortableContext>
              </div>
            )
          })}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeOpportunity ? <OpportunityCardOverlay opportunity={activeOpportunity} /> : null}
      </DragOverlay>

      {/* Dialog création manuelle */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle opportunité</DialogTitle>
            <DialogDescription>Crée une piste de mandat à suivre dans le pipeline.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium">Titre *</span>
              <Input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Ex. Maison Cotignac — vendeur à recontacter"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium">Description</span>
              <Textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Contexte, signal détecté, historique…"
                rows={3}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-xs font-medium">Priorité</span>
                <Select value={draft.priority} onValueChange={(v) => setDraft((d) => ({ ...d, priority: v as Priority }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="critical">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium">Étape</span>
                <Select value={draft.stage} onValueChange={(v) => setDraft((d) => ({ ...d, stage: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-xs font-medium">Prochaine action</span>
                <Input
                  value={draft.nextAction}
                  onChange={(e) => setDraft((d) => ({ ...d, nextAction: e.target.value }))}
                  placeholder="Ex. Appeler le vendeur"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium">Échéance</span>
                <Input
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
                />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={saving}>Annuler</Button>
            <Button onClick={submitCreate} disabled={saving}>
              {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}
