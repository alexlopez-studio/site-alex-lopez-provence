import { NextRequest, NextResponse } from 'next/server'
import { getMarketProperty } from '@/lib/market-repo'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const property = await getMarketProperty(id)
    if (!property) return NextResponse.json({ success: false, error: 'Bien introuvable' }, { status: 404 })
    return NextResponse.json({ success: true, property })
  } catch (error) {
    console.error('[api/market/properties/:id]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
