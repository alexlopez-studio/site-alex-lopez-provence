import { NextRequest, NextResponse } from 'next/server'
import { createOpportunity, listOpportunities } from '@/lib/market-repo'

export async function GET() {
  try {
    const opportunities = await listOpportunities()
    return NextResponse.json({ success: true, opportunities })
  } catch (error) {
    console.error('[api/opportunities]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (typeof body.propertyId !== 'string') {
      return NextResponse.json({ success: false, error: 'propertyId requis' }, { status: 400 })
    }
    const opportunity = await createOpportunity(body.propertyId)
    return NextResponse.json({ success: true, opportunity })
  } catch (error) {
    console.error('[api/opportunities POST]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
