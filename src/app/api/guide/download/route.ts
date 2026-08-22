import { NextRequest, NextResponse } from 'next/server'
import { createLead, upsertProspect } from '@/lib/leads-repo'

const RESEND_API = 'https://api.resend.com/emails'
const FROM = 'Alexandre Lopez <guide@alexlopez-provence.fr>'
const ADMIN_EMAIL = 'alexlopez.studio@gmail.com'

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function resolveSiteUrl(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env && env.length > 0) return env.replace(/\/+$/, '')
  try {
    return new URL(req.url).origin
  } catch {
    return 'https://alexandrelopez.fr'
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = asString(body?.email)
    const prenom = asString(body?.prenom)
    const nom = asString(body?.nom)
    const telephone = asString(body?.telephone)
    const commune = asString(body?.commune)
    const source = asString(body?.source) || 'cold_prospection_guide_pap'
    const optIn = Boolean(body?.opt_in)

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Une adresse email valide est requise.' },
        { status: 400 }
      )
    }

    if (!optIn) {
      return NextResponse.json(
        { success: false, error: 'Le consentement RGPD est requis pour recevoir le guide.' },
        { status: 400 }
      )
    }

    const siteUrl = resolveSiteUrl(req)
    const guideUrl = `${siteUrl}/guide-vendeur`
    const greeting = prenom ? `Bonjour ${escapeHtml(prenom)},` : 'Bonjour,'
    const fullName = `${prenom} ${nom}`.trim() || 'Propriétaire Vendeur'

    // 1. Enregistrement en base de données (best-effort, non-bloquant)
    try {
      const prospect = await upsertProspect({
        email,
        firstName: prenom || undefined,
        lastName: nom || undefined,
        phone: telephone || undefined,
      })
      if (prospect?.id) {
        await createLead({
          prospectId: prospect.id,
          tool: 'vendre',
          commune: commune || undefined,
          sourceChannel: source,
          formData: {
            guide_downloaded: true,
            download_date: new Date().toISOString(),
            telephone,
            commune,
            source,
          },
        })
      }
    } catch (dbErr) {
      console.warn('[Guide API] Supabase persistence skipped/warning:', dbErr)
    }

    // 2. Envoi des emails via Resend si API Key configurée
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      // Email pour le prospect avec le lien d'accès au guide
      const prospectSubject = 'Votre Guide Stratégique du Vendeur Particulier (Édition Provence)'
      const prospectHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(prospectSubject)}</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F172A">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:16px;border:1px solid #E2E8F0;overflow:hidden">
          <tr>
            <td style="background:#0077B6;padding:24px 32px;text-align:left">
              <span style="font-size:22px;font-weight:700;color:#ffffff;display:block">Alexandre Lopez</span>
              <span style="font-size:12px;font-weight:600;color:#E0F0FA;text-transform:uppercase;letter-spacing:0.15em">Conseiller en immobilier iad · Provence Verte & Verdon</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 16px">
              <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0F172A">${greeting}</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155">
                Merci pour votre demande. Vous trouverez ci-dessous votre accès immédiat au <strong>Guide Stratégique du Vendeur Particulier</strong> (41 planches méthodiques, checklists imprimables A4 et analyse notariée DVF).
              </p>
              <div style="background:#F8FAFC;border-left:4px solid #0077B6;padding:16px;border-radius:0 8px 8px 0;margin:20px 0">
                <p style="margin:0;font-size:14px;font-weight:600;color:#0F172A">Ce que vous allez y trouver :</p>
                <ul style="margin:8px 0 0;padding-left:20px;font-size:13px;line-height:1.6;color:#475569">
                  <li>La méthode pour exploiter les prix réels notariés DVF dans votre village</li>
                  <li>La checklist de 20 points de valorisation & désencombrement</li>
                  <li>Le script en 4 questions pour filtrer 100% des curieux non finançables</li>
                  <li>Le dossier juridique complet pour sécuriser la signature notaire</li>
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 32px 32px">
              <a href="${guideUrl}" style="display:inline-block;background:#0077B6;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:999px;font-weight:700;font-size:15px;box-shadow:0 4px 14px rgba(0,119,182,0.25)">
                Ouvrir & Consulter le Guide en Ligne
              </a>
              <p style="margin:12px 0 0;font-size:12px;color:#64748B">
                Format interactif et imprimable A4 (41 pages haute définition)
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px">
              <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 20px">
              <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#475569">
                Une question sur un point particulier de votre bien à ${escapeHtml(commune || 'en Provence Verte')} ?
              </p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569">
                Je reste à votre entière disposition au <a href="tel:+33613180168" style="color:#0077B6;text-decoration:none;font-weight:700">06 13 18 01 68</a> (appel ou WhatsApp direct).
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#F8FAFC;padding:20px 32px;border-top:1px solid #E2E8F0">
              <p style="margin:0;font-size:12px;color:#64748B;line-height:1.5">
                <strong>Alexandre Lopez</strong> · Conseiller en immobilier iad<br>
                Provence Verte, Verdon & Haut-Var · <a href="${siteUrl}" style="color:#0077B6;text-decoration:none">alexandrelopez.fr</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

      const prospectText = [
        prenom ? `Bonjour ${prenom},` : 'Bonjour,',
        '',
        'Merci pour votre demande.',
        'Voici votre accès immédiat au Guide Stratégique du Vendeur Particulier (41 pages) :',
        guideUrl,
        '',
        'Au sommaire :',
        '- Méthode d\'estimation par les ventes réelles DVF',
        '- Checklists de valorisation pièce par pièce',
        '- Script de filtrage bancaire avant visite',
        '- Dossier notarial et sécurisation juridique',
        '',
        'Une question sur votre bien en Provence Verte ?',
        'Contactez-moi directement au 06 13 18 01 68.',
        '',
        'Alexandre Lopez — Conseiller en immobilier iad',
      ].join('\n')

      // Notification admin pour Alexandre
      const adminSubject = `[Nouveau Prospect Guide] ${fullName} (${commune || 'Secteur non précisé'})`
      const adminHtml = `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,-apple-system,sans-serif;color:#0F172A;padding:20px;background:#F8FAFC">
  <div style="max-width:540px;background:#fff;padding:24px;border-radius:12px;border:1px solid #E2E8F0">
    <h2 style="color:#0077B6;margin-top:0">🎯 Nouveau téléchargement Guide Vendeur PAP</h2>
    <p><strong>Nom / Prénom :</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <p><strong>Téléphone :</strong> ${telephone ? `<a href="tel:${escapeHtml(telephone)}">${escapeHtml(telephone)}</a>` : '<em>Non renseigné</em>'}</p>
    <p><strong>Commune du bien :</strong> ${escapeHtml(commune || 'Non renseignée')}</p>
    <p><strong>Canal / Source :</strong> ${escapeHtml(source)}</p>
    <p><strong>Date & Heure :</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
    <hr style="margin:20px 0;border:0;border-top:1px solid #E2E8F0">
    <p style="font-size:13px;color:#64748B">Ce prospect provient de la prospection à froid ou de la landing page d'acquisition guide vendeur.</p>
  </div>
</body>
</html>`

      // Envoi en parallèle via Resend
      await Promise.allSettled([
        fetch(RESEND_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: FROM,
            to: [email],
            subject: prospectSubject,
            html: prospectHtml,
            text: prospectText,
          }),
        }),
        fetch(RESEND_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Site Alex Lopez <contact@alexlopez-provence.fr>',
            to: [ADMIN_EMAIL],
            reply_to: email,
            subject: adminSubject,
            html: adminHtml,
          }),
        }),
      ])
    }

    return NextResponse.json({
      success: true,
      downloadUrl: '/guide-vendeur',
      message: 'Guide envoyé avec succès.',
    })
  } catch (error) {
    console.error('[Guide API Error]', error)
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
