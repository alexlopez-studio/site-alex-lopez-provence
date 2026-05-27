import { NextRequest, NextResponse } from 'next/server'

const ADMIN_COOKIE = 'admin-session'
const ADMIN_LOGIN_PATH = '/admin/login'
const PROTECTED_PREFIXES = [
  '/admin',
  '/api/market',
  '/api/rules',
  '/api/notifications',
  '/api/opportunities',
]

function isProtectedPath(path: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'))
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (!isProtectedPath(path)) return NextResponse.next()
  if (path === ADMIN_LOGIN_PATH) return NextResponse.next()

  const session = req.cookies.get(ADMIN_COOKIE)?.value
  const adminPassword = process.env.ADMIN_PASSWORD

  if (adminPassword && session === adminPassword) {
    return NextResponse.next()
  }

  if (path.startsWith('/api/')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, req.url)
  loginUrl.searchParams.set('redirect', path)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/market/:path*',
    '/api/rules/:path*',
    '/api/notifications/:path*',
    '/api/opportunities/:path*',
  ],
}
