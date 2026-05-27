import { NextResponse } from 'next/server'
import { formatInternalApiError } from '@/lib/api-error'
import { getStreamEstateUsageStats } from '@/lib/market-repo'

export async function GET() {
  try {
    const usage = await getStreamEstateUsageStats()
    return NextResponse.json({ success: true, usage })
  } catch (error) {
    console.error('[api/market/usage]', error)
    return NextResponse.json({ success: false, error: formatInternalApiError(error) }, { status: 500 })
  }
}
