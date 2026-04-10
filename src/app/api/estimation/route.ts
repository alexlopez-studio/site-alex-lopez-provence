import { NextRequest, NextResponse } from 'next/server'
import { calculerEstimation } from '@/lib/estimation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lat, lng, surface, type_bien, etat, dpe, equipements, delai } = body
    if (!lat || !lng || !surface)
      return NextResponse.json({ error: 'lat, lng et surface requis' }, { status: 400 })
    const result = await calculerEstimation({ lat, lng, surface, type_bien, etat, dpe, equipements, delai })
    return NextResponse.json(result)
  } catch (e) {
    console.error('[API /estimation]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
