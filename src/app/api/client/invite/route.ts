import { NextRequest, NextResponse } from 'next/server'
import { ensureClientDossierForLead } from '@/lib/client-portal'
import { getCurrentAdmin } from '@/lib/auth'
import { sendClientPortalInviteEmail } from '@/lib/resend'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      const admin = await getCurrentAdmin()
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'Accès admin requis' },
          { status: 401 },
        )
      }
    }

    const body = await req.json() as { lead_id?: string }
    const leadId = body.lead_id?.trim()

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'lead_id requis' },
        { status: 400 },
      )
    }

    const { profile, dossier } = await ensureClientDossierForLead(leadId)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin
    const redirectTo = `${siteUrl}/auth/callback?next=/espace-client`

    const generated = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: profile.email,
      options: { redirectTo },
    })

    const actionLink = generated.data?.properties?.action_link ?? null
    if (actionLink) {
      const sent = await sendClientPortalInviteEmail({
        to: profile.email,
        prenom: profile.first_name,
        magicLinkUrl: actionLink,
      })

      return NextResponse.json({
        success: true,
        data: {
          dossier_id: dossier.id,
          email: profile.email,
          delivery: sent ? 'resend' : 'manual',
          action_link: sent ? null : actionLink,
        },
      })
    }

    const fallback = await supabase.auth.signInWithOtp({
      email: profile.email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    })

    if (fallback.error) {
      console.error('[POST /api/client/invite] auth:', generated.error, fallback.error)
      return NextResponse.json(
        { success: false, error: 'Lien client préparé, mais envoi impossible' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        dossier_id: dossier.id,
        email: profile.email,
        delivery: 'supabase',
      },
    })
  } catch (err) {
    console.error('[POST /api/client/invite]', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Erreur invitation client' },
      { status: 500 },
    )
  }
}
