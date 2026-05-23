import type { LeadType } from './leads/compute-results'

type AttioLeadInput = {
  token: string
  type: LeadType
  email: string
  prenom?: string
  nom?: string
  telephone?: string
  formData: Record<string, unknown>
  results: Record<string, unknown>
  magicLinkUrl: string
}

type AttioSyncResult = {
  ok: boolean
  skipped?: boolean
  reason?: string
  personRecordId?: string
  listEntryId?: string
  error?: string
}

type AttioJson = Record<string, unknown>

const ATTIO_API_BASE_URL = 'https://api.attio.com/v2'

/**
 * Best-effort Attio CRM sync.
 *
 * Target model:
 * - People is the canonical contact object.
 * - Seller / buyer pipelines are Attio lists whose parent object is people.
 * - The exact list slugs and optional list attribute slugs are configured via env.
 *
 * Required env:
 * - ATTIO_API_KEY
 *
 * Optional env:
 * - ATTIO_SELLER_LIST_ID or ATTIO_SELLER_LIST_SLUG
 * - ATTIO_BUYER_LIST_ID or ATTIO_BUYER_LIST_SLUG
 * - ATTIO_SELLER_STAGE_ATTRIBUTE, default: stage
 * - ATTIO_BUYER_STAGE_ATTRIBUTE, default: stage
 */
export async function syncLeadToAttio(input: AttioLeadInput): Promise<AttioSyncResult> {
  const apiKey = process.env.ATTIO_API_KEY
  if (!apiKey) return { ok: false, skipped: true, reason: 'missing_ATTIO_API_KEY' }

  try {
    const person = await upsertPerson({ apiKey, input })
    const personRecordId = extractRecordId(person)

    if (!personRecordId) {
      return { ok: false, error: 'Attio person record id introuvable' }
    }

    const list = resolvePipelineList(input.type)
    if (!list) {
      return {
        ok: true,
        skipped: true,
        reason: 'missing_pipeline_list_env',
        personRecordId,
      }
    }

    const entry = await upsertListEntry({ apiKey, list, personRecordId, input })
    return {
      ok: true,
      personRecordId,
      listEntryId: extractEntryId(entry),
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Attio error',
    }
  }
}

async function upsertPerson({ apiKey, input }: { apiKey: string; input: AttioLeadInput }) {
  const fullName = [input.prenom, input.nom].filter(Boolean).join(' ').trim()
  const description = buildPersonDescription(input)
  const values: AttioJson = {
    email_addresses: [{ email_address: input.email }],
    name: [{
      first_name: input.prenom,
      last_name: input.nom,
      full_name: fullName || input.email,
    }],
    description,
  }

  if (input.telephone) {
    values.phone_numbers = [{
      original_phone_number: input.telephone,
      country_code: 'FR',
    }]
  }

  return attioFetch({
    apiKey,
    path: '/objects/people/records?matching_attribute=email_addresses',
    method: 'PUT',
    body: { data: { values } },
  })
}

async function upsertListEntry({
  apiKey,
  list,
  personRecordId,
  input,
}: {
  apiKey: string
  list: string
  personRecordId: string
  input: AttioLeadInput
}) {
  return attioFetch({
    apiKey,
    path: `/lists/${encodeURIComponent(list)}/entries`,
    method: 'PUT',
    body: {
      data: {
        parent_record_id: personRecordId,
        parent_object: 'people',
        entry_values: buildEntryValues(input),
      },
    },
  })
}

async function attioFetch({
  apiKey,
  path,
  method,
  body,
}: {
  apiKey: string
  path: string
  method: 'GET' | 'PUT' | 'POST'
  body?: unknown
}) {
  const res = await fetch(`${ATTIO_API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  const json = await safeJson(res)
  if (!res.ok) {
    throw new Error(`Attio ${res.status}: ${JSON.stringify(json).slice(0, 600)}`)
  }
  return json
}

function resolvePipelineList(type: LeadType): string | undefined {
  if (type === 'vendre') {
    return process.env.ATTIO_SELLER_LIST_ID || process.env.ATTIO_SELLER_LIST_SLUG
  }

  if (type === 'acheter') {
    return process.env.ATTIO_BUYER_LIST_ID || process.env.ATTIO_BUYER_LIST_SLUG
  }

  return process.env.ATTIO_AUDIT_LIST_ID || process.env.ATTIO_AUDIT_LIST_SLUG
}

function buildEntryValues(input: AttioLeadInput): AttioJson {
  const stageAttribute = input.type === 'acheter'
    ? process.env.ATTIO_BUYER_STAGE_ATTRIBUTE || 'stage'
    : process.env.ATTIO_SELLER_STAGE_ATTRIBUTE || 'stage'

  const values: AttioJson = {
    [stageAttribute]: input.type === 'acheter' ? 'Recherche reçue' : 'Estimation demandée',
    source: 'Site web — ' + input.type,
    lead_type: input.type,
    token: input.token,
    magic_link: input.magicLinkUrl,
    rgpd: true,
    notes: buildEntryNotes(input),
  }

  setIfString(values, 'adresse', input.formData.adresse)
  setIfString(values, 'type_bien', input.formData.type_bien)
  setIfNumber(values, 'surface', input.formData.surface)
  setIfNumber(values, 'surface_terrain', input.formData.surface_terrain)
  setIfString(values, 'dpe', input.formData.dpe)
  setIfString(values, 'delai', input.formData.delai)
  setIfNumber(values, 'estimation_mediane', input.results.valeur_mediane)
  setIfNumber(values, 'estimation_basse', input.results.fourchette_basse)
  setIfNumber(values, 'estimation_haute', input.results.fourchette_haute)
  setIfNumber(values, 'budget_max', input.formData.budget_max)

  return values
}

function buildPersonDescription(input: AttioLeadInput): string {
  return [
    `Source : site web (${input.type})`,
    `Token : ${input.token}`,
    `Résultat : ${input.magicLinkUrl}`,
    input.formData.adresse ? `Adresse : ${input.formData.adresse}` : null,
  ].filter(Boolean).join('\n')
}

function buildEntryNotes(input: AttioLeadInput): string {
  const summary = {
    token: input.token,
    type: input.type,
    magicLinkUrl: input.magicLinkUrl,
    contact: {
      prenom: input.prenom ?? null,
      nom: input.nom ?? null,
      email: input.email,
      telephone: input.telephone ?? null,
    },
    formData: input.formData,
    results: input.results,
  }

  return JSON.stringify(summary, null, 2).slice(0, 9000)
}

function setIfString(target: AttioJson, key: string, value: unknown) {
  if (typeof value === 'string' && value.trim().length > 0) target[key] = value.trim()
}

function setIfNumber(target: AttioJson, key: string, value: unknown) {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  if (Number.isFinite(parsed)) target[key] = parsed
}

function extractRecordId(json: unknown): string | undefined {
  if (!json || typeof json !== 'object') return undefined
  const data = (json as { data?: unknown }).data
  if (!data || typeof data !== 'object') return undefined
  const direct = (data as { record_id?: unknown }).record_id
  if (typeof direct === 'string') return direct
  const id = (data as { id?: unknown }).id
  if (id && typeof id === 'object') {
    const recordId = (id as { record_id?: unknown }).record_id
    if (typeof recordId === 'string') return recordId
  }
  return undefined
}

function extractEntryId(json: unknown): string | undefined {
  if (!json || typeof json !== 'object') return undefined
  const data = (json as { data?: unknown }).data
  if (!data || typeof data !== 'object') return undefined
  const id = (data as { id?: unknown }).id
  if (id && typeof id === 'object') {
    const entryId = (id as { entry_id?: unknown }).entry_id
    if (typeof entryId === 'string') return entryId
  }
  return undefined
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json()
  } catch {
    return null
  }
}
