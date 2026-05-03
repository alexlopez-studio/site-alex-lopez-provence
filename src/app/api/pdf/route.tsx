import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import { getLeadById } from '@/lib/leads-repo'
import {
  extractEstimationPdfDataFromLead,
  extractAuditPdfDataFromLead,
} from '@/lib/pdf/extract'
import { sanitizeFilename } from '@/lib/pdf/format'
import EstimationPDFDocument from '@/components/pdf/EstimationPDF'
import AuditPDFDocument from '@/components/pdf/AuditPDF'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * GET /api/pdf?token=...
 *
 * Phase B (Step 4) : `token` est l'UUID id de la ligne `leads`. On lookup
 * via getLeadById et on streame le PDF approprie selon `lead.tool`.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json(
      { error: 'Token manquant' },
      { status: 400 },
    )
  }
  if (!UUID_RE.test(token)) {
    return NextResponse.json(
      { error: 'Token invalide', code: 'invalid_format' },
      { status: 401 },
    )
  }

  let lead
  try {
    lead = await getLeadById(token)
  } catch (err) {
    console.error('[api/pdf] getLeadById failed', err)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 },
    )
  }
  if (!lead) {
    return NextResponse.json(
      { error: 'Dossier introuvable', code: 'not_found' },
      { status: 404 },
    )
  }
  const expiresMs = new Date(lead.magic_link_expires_at).getTime()
  if (Number.isFinite(expiresMs) && expiresMs < Date.now()) {
    return NextResponse.json(
      { error: 'Lien expire', code: 'expired' },
      { status: 410 },
    )
  }

  let element: React.ReactElement<DocumentProps>
  let filenameBase: string
  let prenomLabel: string

  switch (lead.tool) {
    case 'vendre': {
      const data = extractEstimationPdfDataFromLead(lead)
      element = <EstimationPDFDocument data={data} />
      filenameBase = 'estimation-alex-lopez'
      prenomLabel = data.prenom ?? ''
      break
    }
    case 'audit': {
      const data = extractAuditPdfDataFromLead(lead)
      element = <AuditPDFDocument data={data} />
      filenameBase = 'audit-alex-lopez'
      prenomLabel = data.prenom ?? ''
      break
    }
    case 'acheter':
      return NextResponse.json(
        { error: 'PDF non disponible pour ce type de demande' },
        { status: 501 },
      )
    default:
      return NextResponse.json(
        { error: 'Type de demande inconnu' },
        { status: 400 },
      )
  }

  let buffer: Buffer
  try {
    buffer = await renderToBuffer(element)
  } catch (err) {
    console.error('[api/pdf] renderToBuffer failed', err)
    return NextResponse.json(
      { error: 'Erreur lors de la generation du PDF' },
      { status: 500 },
    )
  }

  const filenameParts = [filenameBase]
  if (prenomLabel) filenameParts.push(prenomLabel.toLowerCase())
  filenameParts.push(lead.id.slice(0, 8))
  const filename = sanitizeFilename(filenameParts.join('-')) + '.pdf'

  // TS 5.7+ : BodyInit n'accepte plus Uint8Array<ArrayBufferLike> (BufferSource
  // est resserre sur ArrayBuffer strict). Blob est un membre direct de
  // BodyInit et est supporte nativement par le runtime Node de Next.js 15.
  const body = new Blob([buffer], { type: 'application/pdf' })

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
      'Content-Length': String(buffer.length),
    },
  })
}
