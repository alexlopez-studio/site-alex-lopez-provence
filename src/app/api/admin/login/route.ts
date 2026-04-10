import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword || !password || password !== adminPassword)
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin-session', adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch (e) {
    console.error('[/api/admin/login]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
