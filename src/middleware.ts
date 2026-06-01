import { NextRequest, NextResponse } from 'next/server'

const ADMIN_COOKIE = 'admin-session'
const ADMIN_LOGIN_PATH = '/admin/login'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected = path.startsWith('/admin') || path.startsWith('/dashboard')
  if (!isProtected) return NextResponse.next()
  if (path === ADMIN_LOGIN_PATH) return NextResponse.next()

  const session = req.cookies.get(ADMIN_COOKIE)?.value
  const adminPassword = process.env.ADMIN_PASSWORD

  if (adminPassword && session === adminPassword) {
    return NextResponse.next()
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, req.url)
  loginUrl.searchParams.set('redirect', path.startsWith('/dashboard') ? '/admin/market' : path)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
