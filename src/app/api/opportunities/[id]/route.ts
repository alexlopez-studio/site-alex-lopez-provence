import { NextRequest, NextResponse } from 'next/server'
import { updateOpportunity } from '@/lib/market-repo'

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const opportunity = await updateOpportunity(id, {
      stage: typeof body.stage === 'string' ? body.stage : undefined,
      priority: typeof body.priority === 'string' ? body.priority : undefined,
      next_action: typeof body.next_action === 'string' ? body.next_action : undefined,
      note: typeof body.note === 'string' ? body.note : undefined,
    })
    return NextResponse.json({ success: true, opportunity })
  } catch (error) {
    console.error('[api/opportunities/:id]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
