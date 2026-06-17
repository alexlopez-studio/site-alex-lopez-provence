'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Send,
    RefreshCw,
    Calendar,
    Wrench,
    FileText,
    Zap,
    CheckCircle2,
    XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Prospect {
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string | null
    created_at: string
}

interface LeadEvent {
    id: string
    kind: string
    payload: Record<string, unknown>
    created_by: string | null
    created_at: string
}

interface LeadDetail {
    id: string
    prospect_id: string
    tool: string
    status: string
    form_data: Record<string, unknown>
    results: Record<string, unknown>
    commune: string | null
    magic_link_sent_at: string | null
    magic_link_expires_at: string
    created_at: string
    updated_at: string
    prospect: Prospect
    events: LeadEvent[]
}

const STATUS_LABELS: Record<string, string> = {
    nouveau: 'Nouveau',
    contacte: 'Contacté',
    r1: 'R1',
    mandat: 'Mandat',
    sous_compromis: 'Sous compromis',
    vendu: 'Vendu',
    perdu: 'Perdu',
}

const STATUS_COLORS: Record<string, string> = {
    nouveau: 'bg-blue-100 text-blue-800',
    contacte: 'bg-amber-100 text-amber-800',
    r1: 'bg-purple-100 text-purple-800',
    mandat: 'bg-green-100 text-green-800',
    sous_compromis: 'bg-teal-100 text-teal-800',
    vendu: 'bg-emerald-100 text-emerald-800',
    perdu: 'bg-gray-100 text-gray-500',
}

const TOOL_LABELS: Record<string, string> = {
    vendre: 'Vente',
    acheter: 'Achat',
    audit: 'Audit',
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function formatShortDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const EVENT_KIND_LABELS: Record<string, string> = {
    status_change: 'Changement de statut',
    note: 'Note ajoutée',
    magic_link_resent: 'Magic link renvoyé',
    rgpd_delete: 'Suppression RGPD',
    system: 'Système',
}

export default function LeadDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [lead, setLead] = useState<LeadDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [changingStatus, setChangingStatus] = useState(false)
    const [noteText, setNoteText] = useState('')
    const [sendingNote, setSendingNote] = useState(false)
    const [resending, setResending] = useState(false)

    async function fetchLead() {
        setLoading(true)
        try {
            const res = await fetch('/api/leads/' + id)
            const json = await res.json()
            if (json.success) {
                setLead(json.data)
            }
        } catch (err) {
            console.error('[LeadDetailPage] fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLead()
    }, [id])

    async function changeStatus(newStatus: string) {
        setChangingStatus(true)
        try {
            await fetch('/api/leads/' + id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })
            await fetchLead()
        } catch (err) {
            console.error('[LeadDetailPage] changeStatus error:', err)
        } finally {
            setChangingStatus(false)
        }
    }

    async function addNote() {
        if (!noteText.trim()) return
        setSendingNote(true)
        try {
            await fetch('/api/leads/' + id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: noteText.trim() }),
            })
            setNoteText('')
            await fetchLead()
        } catch (err) {
            console.error('[LeadDetailPage] addNote error:', err)
        } finally {
            setSendingNote(false)
        }
    }

    async function resendMagicLink() {
        setResending(true)
        try {
            await fetch('/api/leads/' + id + '/resend', { method: 'POST' })
            await fetchLead()
        } catch (err) {
            console.error('[LeadDetailPage] resend error:', err)
        } finally {
            setResending(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">Chargement...</div>
        )
    }

    if (!lead) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                <p className="text-muted-foreground">Lead introuvable</p>
                <Link href="/app/leads" className="text-sm text-brand underline">Retour à la liste</Link>
            </div>
        )
    }

    const sortedEvents = [...lead.events].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    return (
        <div className="space-y-6">
            {/* Back button */}
            <Link href="/app/leads" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="size-4" /> Retour aux leads
            </Link>

            {/* Header card */}
            <div className="rounded-xl border bg-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-foreground">
                                {lead.prospect.first_name} {lead.prospect.last_name}
                            </h1>
                            <span className={'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ' + (STATUS_COLORS[lead.status] ?? '')}>
                                {STATUS_LABELS[lead.status] ?? lead.status}
                            </span>
                            <Badge variant="outline" className="font-medium">
                                {TOOL_LABELS[lead.tool] ?? lead.tool}
                            </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="size-3.5" /> {lead.prospect.email}
                            </span>
                            {lead.prospect.phone && (
                                <span className="inline-flex items-center gap-1.5">
                                    <Phone className="size-3.5" /> {lead.prospect.phone}
                                </span>
                            )}
                            {lead.commune && (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="size-3.5" /> {lead.commune}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="size-3.5" /> {formatDate(lead.created_at)}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {lead.status !== 'contacte' && (
                            <Button size="sm" onClick={() => changeStatus('contacte')} disabled={changingStatus}>
                                <CheckCircle2 className="mr-1 size-4" /> Marquer contacté
                            </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={resendMagicLink} disabled={resending}>
                            <Send className="mr-1 size-4" /> {resending ? 'Envoi...' : 'Renvoyer le lien'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left column — Actions */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    {/* Status change */}
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="mb-3 text-sm font-semibold text-foreground">Changer le statut</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => changeStatus(key)}
                                    disabled={changingStatus || key === lead.status}
                                    className={
                                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ' +
                                        (key === lead.status
                                            ? 'border-brand bg-brand text-white'
                                            : 'border-border text-muted-foreground hover:border-brand hover:text-brand')
                                    }
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add note */}
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="mb-3 text-sm font-semibold text-foreground">Ajouter une note</h3>
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Note interne..."
                            rows={3}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                        />
                        <Button size="sm" className="mt-2 w-full" onClick={addNote} disabled={sendingNote || !noteText.trim()}>
                            {sendingNote ? 'Enregistrement...' : 'Enregistrer la note'}
                        </Button>
                    </div>

                    {/* Magic link info */}
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="mb-3 text-sm font-semibold text-foreground">Magic link</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>
                                Statut :{' '}
                                {lead.magic_link_sent_at ? (
                                    <span className="font-medium text-green-600">Envoyé le {formatShortDate(lead.magic_link_sent_at)}</span>
                                ) : (
                                    <span className="font-medium text-amber-600">Non envoyé</span>
                                )}
                            </p>
                            <p>
                                URL :{' '}
                                <a href={'/resultats/' + lead.id} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                                    /resultats/{lead.id.slice(0, 8)}...
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column — Form data + Events */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    {/* Form data */}
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <FileText className="size-4" /> Données du formulaire
                        </h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {Object.entries(lead.form_data).map(([key, value]) => {
                                if (key.startsWith('lat') || key.startsWith('lng') || key === 'cadastre_surface') return null
                                const display = Array.isArray(value) ? value.join(', ') : String(value ?? '')
                                if (!display || display === '') return null
                                return (
                                    <div key={key} className="rounded-lg bg-muted/30 px-3 py-2">
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            {key.replace(/_/g, ' ')}
                                        </div>
                                        <div className="mt-0.5 text-sm font-medium text-foreground truncate">{display}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Results */}
                    {Object.keys(lead.results).length > 0 && (
                        <div className="rounded-xl border bg-card p-5">
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                                <Zap className="size-4" /> Résultats estimation
                            </h3>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {Object.entries(lead.results).map(([key, value]) => {
                                    const display = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')
                                    if (!display || display === '') return null
                                    return (
                                        <div key={key} className="rounded-lg bg-muted/30 px-3 py-2">
                                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                {key.replace(/_/g, ' ')}
                                            </div>
                                            <div className="mt-0.5 text-sm font-medium text-foreground truncate">{display}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Events timeline */}
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                            <RefreshCw className="size-4" /> Historique ({sortedEvents.length})
                        </h3>
                        {sortedEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucun événement enregistré.</p>
                        ) : (
                            <div className="space-y-3">
                                {sortedEvents.map((event) => (
                                    <div key={event.id} className="flex gap-3 rounded-lg border border-border bg-muted/20 p-3">
                                        <div className="mt-0.5 shrink-0">
                                            {event.kind === 'status_change' ? (
                                                <RefreshCw className="size-4 text-blue-500" />
                                            ) : event.kind === 'note' ? (
                                                <FileText className="size-4 text-amber-500" />
                                            ) : event.kind === 'magic_link_resent' ? (
                                                <Send className="size-4 text-green-500" />
                                            ) : (
                                                <Wrench className="size-4 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-foreground">
                                                    {EVENT_KIND_LABELS[event.kind] ?? event.kind}
                                                </span>
                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    {formatShortDate(event.created_at)}
                                                </span>
                                            </div>
                                            {event.kind === 'note' && typeof event.payload?.text === 'string' && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {event.payload.text}
                                                </p>
                                            )}
                                            {event.kind === 'status_change' && typeof event.payload?.status === 'string' && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Nouveau statut :{' '}
                                                    <span className="font-medium text-foreground">
                                                        {STATUS_LABELS[event.payload.status] ?? event.payload.status}
                                                    </span>
                                                </p>
                                            )}
                                            {event.created_by && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    par {event.created_by}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}