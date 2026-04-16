import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendMagicLinkEmail } from '@/lib/resend'

interface LeadRow { email: string; prenom: string; token: string; type: string }

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: 'token requis' }, { status: 400 })

    const { data: lead, error } = await supabaseAdmin
      .from('leads')
      .select('email, prenom, token, type')
      .eq('token', token)
      .single() as { data: LeadRow | null; error: unknown }

    if (error || !lead) return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
    await sendMagicLinkEmail({
      to: lead.email,
      prenom: lead.prenom,
      token: lead.token,
      type: lead.type as 'vendre' | 'acheter' | 'audit',
      siteUrl,
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[/api/admin/resend-magic-link]', e)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
