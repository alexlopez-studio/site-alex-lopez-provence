import { NextResponse } from 'next/server'
import { listNotifications } from '@/lib/market-repo'

export async function GET() {
  try {
    const notifications = await listNotifications()
    return NextResponse.json({ success: true, notifications })
  } catch (error) {
    console.error('[api/notifications]', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
