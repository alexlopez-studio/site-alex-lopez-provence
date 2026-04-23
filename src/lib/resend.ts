const RESEND_API = 'https://api.resend.com/emails'
const FROM = 'Alex Lopez <estimation@alexlopez-provence.fr>'

export async function sendMagicLinkEmail(params: {
  to: string; prenom: string | null; token: string
  type: 'vendre' | 'acheter' | 'audit'; siteUrl: string
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const { to, prenom, token, type, siteUrl } = params
  const url = `${siteUrl}/resultats/${token}`
  const greeting = prenom ? `Bonjour ${prenom}\u00a0!` : 'Bonjour\u00a0!'
  const typeLbl: Record<string, string> = { vendre: 'estimation de votre bien', acheter: 'recherche acheteur', audit: 'audit immobilier' }

  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
    <h2 style="color:#0F172A;font-size:20px;margin-bottom:8px">${greeting}</h2>
    <p style="color:#64748B;font-size:15px;line-height:1.6">Votre ${typeLbl[type] ?? 'dossier'} a bien \u00e9t\u00e9 enregistr\u00e9. Retrouvez vos r\u00e9sultats ci-dessous.</p>
    <a href="${url}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#0077B6;color:#fff;border-radius:999px;font-weight:600;font-size:14px;text-decoration:none">Voir mes r\u00e9sultats \u2192</a>
    <p style="color:#64748B;font-size:13px">Ou copiez ce lien\u00a0: <a href="${url}" style="color:#0077B6">${url}</a></p>
    <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
    <p style="color:#64748B;font-size:13px">Pour affiner avec une visite gratuite, appelez-moi au <strong>06\u00a013\u00a018\u00a001\u00a068</strong>.</p>
    <p style="color:#64748B;font-size:13px">Alex Lopez<br>Mandataire IAD \u00b7 Provence Verte</p>
  </div>`

  try {
    const r = await fetch(RESEND_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: FROM, to: [to], subject: 'Vos r\u00e9sultats \u2014 Alex Lopez Provence', html }),
    })
    return r.ok
  } catch { return false }
}
