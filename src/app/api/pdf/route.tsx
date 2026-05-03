import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { verifyMagicToken, MagicTokenError } from '@/lib/magic-token'
import {
  extractEstimationPdfData,
  extractAuditPdfData,
} from '@/lib/pdf/extract'
import { sanitizeFilename } from '@/lib/pdf/format'
import EstimationPDFDocument from '@/components/pdf/EstimationPDF'
import AuditPDFDocument from '@/components/pdf/AuditPDF'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/pdf?token=...
 *
 * Decode le magic link, switch sur payload.type et renvoie le PDF approprie
 * en streaming (`application/pdf`, inline).
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json(
      { error: 'Token manquant' },
      { status: 400 },
    )
  }

  let payload
  try {
    payload = verifyMagicToken(token)
  } catch (err) {
    if (err instanceof MagicTokenError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: errorStatusForCode(err.code) },
      )
    }
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
  }

  let element: React.ReactElement
  let filenameBase: string
  let prenomLabel: string

  switch (payload.type) {
    case 'vendre': {
      const data = extractEstimationPdfData(payload)
      element = <EstimationPDFDocument data={data} />
      filenameBase = 'estimation-alex-lopez'
      prenomLabel = data.prenom ?? ''
      break
    }
    case 'audit': {
      const data = extractAuditPdfData(payload)
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
  filenameParts.push(payload.jti.slice(0, 8))
  const filename = sanitizeFilename(filenameParts.join('-')) + '.pdf'

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
      'Content-Length': String(buffer.length),
    },
  })
}

function errorStatusForCode(code: string): number {
  switch (code) {
    case 'expired':
      return 410
    case 'missing_secret':
      return 500
    default:
      return 401
  }
}
