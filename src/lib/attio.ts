/**
 * Client Attio — push de leads vers le CRM
 */

const ATTIO_API = 'https://api.attio.com/v2'

export interface AttioLeadParams {
  prenom: string | null
  nom: string | null
  email: string
  telephone: string | null
  type: string
  token: string
  siteUrl: string
}

export async function pushLeadToAttio(params: AttioLeadParams): Promise<string | null> {
  const apiKey = process.env.ATTIO_API_KEY
  if (!apiKey) return null

  try {
    const adminUrl = `${params.siteUrl}/admin/${params.token}`

    const res = await fetch(`${ATTIO_API}/objects/people/records`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          values: {
            name: [{ first_name: params.prenom ?? '', last_name: params.nom ?? '' }],
            email_addresses: [{ email_address: params.email }],
            ...(params.telephone ? { phone_numbers: [{ phone_number: params.telephone }] } : {}),
          },
        },
      }),
    })

    if (!res.ok) { console.error('[Attio] Error:', await res.text()); return null }
    const data = await res.json()
    const recordId: string | null = data.data?.id?.record_id ?? null

    if (recordId) {
      await fetch(`${ATTIO_API}/notes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            format: 'plaintext',
            parent_object: 'people',
            parent_record_id: recordId,
            title: `Dossier ${params.type} — Alex Lopez Provence`,
            content: `Type\u00a0: ${params.type}\nDossier admin\u00a0: ${adminUrl}`,
          },
        }),
      }).catch(() => null)
    }
    return recordId
  } catch (e) {
    console.error('[Attio] Network error:', e)
    return null
  }
}
