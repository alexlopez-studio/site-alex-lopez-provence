import { NextRequest, NextResponse } from 'next/server'
import { updateNotification } from '@/lib/market-repo'

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const notification = await updateNotification(id, typeof body.status === 'string' ? body.status : 'read')
    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error('[api/notifications/:id]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
