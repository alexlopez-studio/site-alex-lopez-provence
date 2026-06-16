'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { EyeIcon, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { LeadStatsCards } from '@/components/admin/LeadStatsCards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Prospect {
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string | null
}

interface LeadRow {
    id: string
    tool: string
    status: string
    form_data: Record<string, unknown>
    commune: string | null
    magic_link_sent_at: string | null
    created_at: string
    updated_at: string
    prospect: Prospect
}

interface Pagination {
    page: number
    pageSize: number
    total: number
    totalPages: number
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
    nouveau: 'bg-blue-100 text-blue-800 border-blue-200',
    contacte: 'bg-amber-100 text-amber-800 border-amber-200',
    r1: 'bg-purple-100 text-purple-800 border-purple-200',
    mandat: 'bg-green-100 text-green-800 border-green-200',
    sous_compromis: 'bg-teal-100 text-teal-800 border-teal-200',
    vendu: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    perdu: 'bg-gray-100 text-gray-500 border-gray-200',
}

const TOOL_LABELS: Record<string, string> = {
    vendre: 'Vendre',
    acheter: 'Acheter',
    audit: 'Audit',
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function LeadsListPage() {
    const [leads, setLeads] = useState<LeadRow[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
    })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [toolFilter, setToolFilter] = useState('')

    const fetchLeads = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.set('page', String(pagination.page))
            params.set('page_size', '20')
            if (statusFilter) params.set('status', statusFilter)
            if (toolFilter) params.set('tool', toolFilter)
            if (search.trim()) params.set('q', search.trim())

            const res = await fetch('/api/leads/list?' + params.toString())
            const json = await res.json()
            if (json.success) {
                setLeads(json.data)
                setPagination(json.pagination)
            }
        } catch (err) {
            console.error('[LeadsListPage] fetch error:', err)
        } finally {
            setLoading(false)
        }
    }, [pagination.page, statusFilter, toolFilter, search])

    useEffect(() => {
        const timer = setTimeout(() => fetchLeads(), 300)
        return () => clearTimeout(timer)
    }, [fetchLeads])

    function goToPage(page: number) {
        setPagination((p) => ({ ...p, page }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestion des prospects
                    </p>
                </div>
            </div>
            <LeadStatsCards />

            <div className="flex flex-col gap-4 px-4 lg:px-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[200px] max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher (email, nom...)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="nouveau">Nouveau</option>
                        <option value="contacte">Contacté</option>
                        <option value="r1">R1</option>
                        <option value="mandat">Mandat</option>
                        <option value="sous_compromis">Sous compromis</option>
                        <option value="vendu">Vendu</option>
                        <option value="perdu">Perdu</option>
                    </select>
                    <select
                        value={toolFilter}
                        onChange={(e) => setToolFilter(e.target.value)}
                        className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                        <option value="">Tous les outils</option>
                        <option value="vendre">Vente</option>
                        <option value="acheter">Achat</option>
                        <option value="audit">Audit</option>
                    </select>
                    <Button variant="outline" size="sm" onClick={() => fetchLeads()}>
                        <RefreshCw className="mr-1 size-4" /> Actualiser
                    </Button>
                </div>
            </div>

            <div className="px-4 lg:px-6">
                <div className="rounded-xl border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prospect</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Outil</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Commune</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Magic link</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Chargement...</td>
                                    </tr>
                                ) : leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Aucun lead trouvé</td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-foreground">{lead.prospect.first_name} {lead.prospect.last_name}</div>
                                                <div className="text-xs text-muted-foreground">{lead.prospect.email}{lead.prospect.phone ? ` · ${lead.prospect.phone}` : ''}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className="font-medium">{TOOL_LABELS[lead.tool] ?? lead.tool}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ' + (STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-700')}>
                                                    {STATUS_LABELS[lead.status] ?? lead.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{lead.commune ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                {lead.magic_link_sent_at ? (
                                                    <span className="text-xs font-medium text-green-600">Envoyé</span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Non envoyé</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{formatDate(lead.created_at)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={'/admin/market/leads/' + lead.id} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                                                    <EyeIcon className="size-3.5" /> Détail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <div className="text-xs text-muted-foreground">
                                {pagination.total} résultat{pagination.total > 1 ? 's' : ''} — Page {pagination.page} / {pagination.totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => goToPage(pagination.page - 1)}>
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => goToPage(pagination.page + 1)}>
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}