import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-immo'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prenom, nom, email, telephone, sujet, commune, message } = body

    // Validation minimale
    if (!email || !message) {
      return NextResponse.json({ error: 'Email et message requis' }, { status: 400 })
    }

    // Insertion dans Supabase (base SaaS app)
    const supabase = createServerClient()
    const { error } = await supabase.from('immo_leads').insert([
      {
        prenom: prenom || null,
        nom: nom || null,
        email,
        telephone: telephone || null,
        sujet: sujet || null,
        commune: commune || null,
        message,
        source: 'contact',
      },
    ])

    if (error) {
      console.error('[Contact API] Supabase error:', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Contact API] Error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
