/**
 * Création de lead
 * 1. Insert Supabase
 * 2. Push Attio CRM
 * 3. Magic link email (Resend)
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { pushLeadToAttio } from '@/lib/attio'
import { sendMagicLinkEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prenom, nom, email, telephone, type = 'vendre', form_data, opt_in = false, token: clientToken } = body

    if (!email) return NextResponse.json({ error: 'email requis' }, { status: 400 })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
    let token: string = clientToken ?? crypto.randomUUID()
    let attioRecordId: string | null = null

    // 1. Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // NOTE: `as never` pattern until `Database` generics are wired into createClient().
      // Cf. commit 419cf28 (resend-magic-link) for the same workaround.
      const { data: lead, error } = await supabaseAdmin
        .from('leads')
        .insert({
          type, prenom: prenom ?? null, nom: nom ?? null,
          email, telephone: telephone ?? null,
          form_data: form_data ?? body, token,
          opt_in: Boolean(opt_in),
          opt_in_date: opt_in ? new Date().toISOString() : null,
        } as never)
        .select('token')
        .single<{ token: string }>()

      if (error) console.error('[API /leads] Supabase:', error)
      else if (lead) token = lead.token

      // 2. Attio
      attioRecordId = await pushLeadToAttio({
        prenom: prenom ?? null, nom: nom ?? null,
        email, telephone: telephone ?? null,
        type, token, siteUrl,
      })

      if (attioRecordId) {
        await supabaseAdmin
          .from('leads')
          .update({ attio_record_id: attioRecordId } as never)
          .eq('token', token)
      }
    }

    // 3. Magic link
    if (email && (type === 'vendre' || type === 'acheter' || type === 'audit')) {
      await sendMagicLinkEmail({ to: email, prenom: prenom ?? null, token, type, siteUrl })
    }

    return NextResponse.json({ success: true, token })
  } catch (e) {
    console.error('[API /leads]', e)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
