type NotionEstimationInput = {
  token: string
  type: string
  email: string
  prenom?: string
  nom?: string
  telephone?: string
  formData: Record<string, unknown>
  results: Record<string, unknown>
  magicLinkUrl: string
}

const NOTION_VERSION = '2022-06-28'

/**
 * Best-effort Notion backup for estimation submissions.
 *
 * This is intentionally non-blocking: the estimation must remain usable even if
 * Notion is not configured or rejects a property schema.
 *
 * Recommended env for the current estimation-first phase:
 * - NOTION_API_KEY
 * - NOTION_ESTIMATIONS_PARENT_PAGE_ID
 *
 * Optional database mode:
 * - NOTION_ESTIMATIONS_DATABASE_ID (expects a title property named "Name")
 */
export async function saveEstimationToNotion(
  input: NotionEstimationInput,
): Promise<{ ok: boolean; pageId?: string; skipped?: boolean; error?: string }> {
  const apiKey = process.env.NOTION_API_KEY
  const parentPageId = process.env.NOTION_ESTIMATIONS_PARENT_PAGE_ID
  const databaseId = process.env.NOTION_ESTIMATIONS_DATABASE_ID

  if (!apiKey || (!parentPageId && !databaseId)) {
    return { ok: false, skipped: true }
  }

  const title = buildTitle(input)
  const body = buildPageBody(input)

  const payload = databaseId
    ? {
        parent: { database_id: databaseId },
        properties: {
          Name: titleProperty(title),
        },
        children: body,
      }
    : {
        parent: { page_id: parentPageId },
        properties: {
          title: titleProperty(title),
        },
        children: body,
      }

  try {
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const detail = await safeText(res)
      return { ok: false, error: `Notion ${res.status}: ${detail}` }
    }

    const json = (await res.json()) as { id?: string }
    return { ok: true, pageId: json.id }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Notion error',
    }
  }
}

function buildTitle(input: NotionEstimationInput): string {
  const name = [input.prenom, input.nom].filter(Boolean).join(' ').trim()
  const adresse = stringValue(input.formData.adresse)
  return [
    'Estimation',
    name || input.email,
    adresse,
  ].filter(Boolean).join(' — ')
}

function buildPageBody(input: NotionEstimationInput) {
  const summary = [
    `Token : ${input.token}`,
    `Type : ${input.type}`,
    `Email : ${input.email}`,
    input.telephone ? `Téléphone : ${input.telephone}` : null,
    `Magic link : ${input.magicLinkUrl}`,
    `Soumission : ${new Date().toISOString()}`,
  ].filter(Boolean).join('\n')

  return [
    heading('Résumé'),
    paragraph(summary),
    heading('Coordonnées'),
    codeBlock(JSON.stringify({
      prenom: input.prenom ?? null,
      nom: input.nom ?? null,
      email: input.email,
      telephone: input.telephone ?? null,
    }, null, 2)),
    heading('Formulaire'),
    ...jsonBlocks(input.formData),
    heading('Résultat estimation'),
    ...jsonBlocks(input.results),
  ]
}

function titleProperty(content: string) {
  return {
    title: [{ type: 'text', text: { content: truncate(content, 1800) } }],
  }
}

function heading(content: string) {
  return {
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: [{ type: 'text', text: { content } }] },
  }
}

function paragraph(content: string) {
  return {
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: [{ type: 'text', text: { content: truncate(content, 1800) } }] },
  }
}

function codeBlock(content: string) {
  return {
    object: 'block',
    type: 'code',
    code: {
      language: 'json',
      rich_text: [{ type: 'text', text: { content: truncate(content, 1800) } }],
    },
  }
}

function jsonBlocks(value: Record<string, unknown>) {
  const json = JSON.stringify(value, null, 2)
  return split(json, 1800).map(codeBlock)
}

function split(value: string, size: number): string[] {
  const chunks: string[] = []
  for (let i = 0; i < value.length; i += size) {
    chunks.push(value.slice(i, i + size))
  }
  return chunks.length > 0 ? chunks : ['{}']
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

async function safeText(res: Response): Promise<string> {
  try {
    return truncate(await res.text(), 500)
  } catch {
    return 'Unable to read response body'
  }
}
