import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// TODO: implémenter génération PDF avec @react-pdf/renderer
export async function GET(req: NextRequest) {
  try {
    const token = new URL(req.url).searchParams.get('token')
    if (!token) return NextResponse.json({ error: 'token requis' }, { status: 400 })

    const { data: lead, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('token', token)
      .single()

    if (error || !lead) return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 })

    // Placeholder — génération PDF à implémenter
    return NextResponse.json({ message: 'PDF generation — coming soon', token })
  } catch (e) {
    console.error('[API /pdf]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
