import { NextRequest, NextResponse } from 'next/server'
import { updateRule } from '@/lib/market-repo'

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const rule = await updateRule(id, {
      active: typeof body.active === 'boolean' ? body.active : undefined,
      name: typeof body.name === 'string' ? body.name : undefined,
      description: typeof body.description === 'string' ? body.description : undefined,
      priority: typeof body.priority === 'string' ? body.priority : undefined,
    })
    return NextResponse.json({ success: true, rule })
  } catch (error) {
    console.error('[api/rules/:id]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
