import { NextRequest, NextResponse } from 'next/server'
import { formatInternalApiError } from '@/lib/api-error'
import { syncMarketPropertiesByZipcode } from '@/lib/market-repo'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { zipcode?: string }
    const zipcode = body.zipcode || '83670'
    const result = await syncMarketPropertiesByZipcode(zipcode)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('[api/market/sync]', error)
    return NextResponse.json({ success: false, error: formatInternalApiError(error) }, { status: 500 })
  }
}
