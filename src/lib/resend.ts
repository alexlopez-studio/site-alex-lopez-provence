import { buildMagicLinkEmail, type MagicLinkType } from './email/magic-link-template'

const RESEND_API = 'https://api.resend.com/emails'
const FROM = 'Alex Lopez <estimation@alexlopez-provence.fr>'

export async function sendMagicLinkEmail(params: {
	to: string
	prenom: string | null
	token: string
	type: MagicLinkType
	siteUrl: string
}): Promise<boolean> {
	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) return false

	const { to, prenom, token, type, siteUrl } = params
	const magicLinkUrl = `${siteUrl}/resultats/${token}`

	const { subject, html, text } = buildMagicLinkEmail({ prenom, magicLinkUrl, type })

	try {
		const r = await fetch(RESEND_API, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				from: FROM,
				to: [to],
				subject,
				html,
				text,
			}),
		})
		return r.ok
	} catch {
		return false
	}
}

export type { MagicLinkType }
