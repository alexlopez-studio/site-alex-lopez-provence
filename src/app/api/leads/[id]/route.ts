/**
 * GET    /api/leads/[id]       — Détail d'un lead avec prospect + events
 * PATCH  /api/leads/[id]       — Mise à jour statut / ajout note
 * POST   /api/leads/[id]/resend — Renvoi du magic link (dans route séparée)
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { markMagicLinkSent } from '@/lib/leads-repo'
import { sendMagicLinkEmail } from '@/lib/resend'

type RouteContext = { params: Promise<{ id: string }> }

// ─── helpers ────────────────────────────────────────────────

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {}
}

function resolveSiteUrl(): string {
    const env = process.env.NEXT_PUBLIC_SITE_URL
    if (env && env.length > 0) return env.replace(/\/+$/, '')
    return 'https://alexlopez-provence.fr'
}

// ─── GET /api/leads/[id] ────────────────────────────────────

export async function GET(
    _req: NextRequest,
    context: RouteContext,
): Promise<NextResponse> {
    const { id } = await context.params

    const { data: lead, error } = await supabaseAdmin
        .from('leads')
        .select(
            `
        *,
        prospect:prospects!leads_prospect_id_fkey (*),
        events:lead_events (*)
      `,
        )
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle()

    if (error) {
        console.error('[API GET /leads/[id]]', error)
        return NextResponse.json(
            { success: false, error: 'Erreur base de données' },
            { status: 500 },
        )
    }

    if (!lead) {
        return NextResponse.json(
            { success: false, error: 'Lead introuvable' },
            { status: 404 },
        )
    }

    return NextResponse.json({ success: true, data: lead })
}

// ─── PATCH /api/leads/[id] ──────────────────────────────────

export async function PATCH(
    req: NextRequest,
    context: RouteContext,
): Promise<NextResponse> {
    const { id } = await context.params

    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json(
            { success: false, error: 'JSON invalide' },
            { status: 400 },
        )
    }

    const payload = asRecord(body)
    const { status: newStatus, note, created_by: createdBy } = payload

    // ── Si mise à jour de statut ─────────────────────────────
    if (typeof newStatus === 'string') {
        const VALID_STATUSES = [
            'nouveau', 'contacte', 'r1', 'mandat',
            'sous_compromis', 'vendu', 'perdu',
        ]
        if (!VALID_STATUSES.includes(newStatus)) {
            return NextResponse.json(
                { success: false, error: 'Statut invalide' },
                { status: 400 },
            )
        }

        const { data: updated, error: updateError } = await supabaseAdmin
            .from('leads')
            .update({ status: newStatus as never, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select('*')
            .single()

        if (updateError) {
            console.error('[API PATCH /leads/[id]] update status:', updateError)
            return NextResponse.json(
                { success: false, error: 'Erreur mise à jour statut' },
                { status: 500 },
            )
        }

        // Log l'événement de changement de statut
        const { error: eventError } = await supabaseAdmin
            .from('lead_events')
            .insert({
                lead_id: id,
                kind: 'status_change',
                payload: { status: newStatus },
                created_by: typeof createdBy === 'string' ? createdBy : null,
            })

        if (eventError) {
            console.error('[API PATCH /leads/[id]] append event:', eventError)
        }

        return NextResponse.json({ success: true, data: updated })
    }

    // ── Si ajout de note seulement ───────────────────────────
    if (typeof note === 'string' && note.trim().length > 0) {
        const { error: noteError } = await supabaseAdmin
            .from('lead_events')
            .insert({
                lead_id: id,
                kind: 'note',
                payload: { text: note.trim() },
                created_by: typeof createdBy === 'string' ? createdBy : null,
            })

        if (noteError) {
            console.error('[API PATCH /leads/[id]] add note:', noteError)
            return NextResponse.json(
                { success: false, error: 'Erreur ajout note' },
                { status: 500 },
            )
        }

        // Retourner le lead mis à jour
        const { data: lead } = await supabaseAdmin
            .from('leads')
            .select('*, prospect:prospects!leads_prospect_id_fkey (*), events:lead_events (*)')
            .eq('id', id)
            .is('deleted_at', null)
            .maybeSingle()

        return NextResponse.json({ success: true, data: lead ?? null })
    }

    return NextResponse.json(
        { success: false, error: 'Rien à mettre à jour. Envoyez status ou note.' },
        { status: 400 },
    )
}