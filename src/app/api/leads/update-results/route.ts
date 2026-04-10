import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { token, results } = await req.json()
    if (!token || !results)
      return NextResponse.json({ error: 'token et results requis' }, { status: 400 })

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
      return NextResponse.json({ success: false, message: 'Supabase non configuré' })

    const { error } = await supabaseAdmin
      .from('leads')
      .update({ results, updated_at: new Date().toISOString() })
      .eq('token', token)

    if (error) { console.error('[leads/update-results]', error); return NextResponse.json({ success: false }, { status: 500 }) }
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[leads/update-results]', e)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
