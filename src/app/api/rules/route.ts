import { NextResponse } from 'next/server'
import { listRules } from '@/lib/market-repo'

export async function GET() {
  try {
    const rules = await listRules()
    return NextResponse.json({ success: true, rules })
  } catch (error) {
    console.error('[api/rules]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
