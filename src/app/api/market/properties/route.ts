import { NextRequest, NextResponse } from 'next/server'
import { listMarketProperties } from '@/lib/market-repo'

export async function GET(req: NextRequest) {
  try {
    const params = new URL(req.url).searchParams
    const properties = await listMarketProperties({
      zipcode: params.get('zipcode') ?? undefined,
      city: params.get('city') ?? undefined,
      status: params.get('status') ?? undefined,
      q: params.get('q') ?? undefined,
      tag: params.get('tag') ?? undefined,
      limit: Number(params.get('limit') ?? 200),
    })
    return NextResponse.json({ success: true, properties })
  } catch (error) {
    console.error('[api/market/properties]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
