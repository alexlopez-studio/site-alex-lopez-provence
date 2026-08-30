import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Chemins accessibles sans session (auth elle-même)
const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/mot-de-passe-oublie',
  '/admin/reset-password',
]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Rafraîchit la session sur toutes les routes internes.
  const { response, user } = await updateSession(req)

  const isProtected = path.startsWith('/admin') || path.startsWith('/dashboard') || path.startsWith('/app')
  if (!isProtected) return response

  // Pages publiques d'auth : on laisse passer (mais on garde les cookies rafraîchis)
  if (PUBLIC_ADMIN_PATHS.some((p) => path === p || path.startsWith(p + '/'))) {
    return response
  }

  // Toute autre route interne exige une session.
  // Fail-closed : pas de session => redirection vers le login.
  if (!user) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('redirect', path.startsWith('/dashboard') ? '/app/dashboard' : path)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

// Réactivé le 29/08/2026. Il avait été neutralisé (matcher vide) le 17/06 dans
// 98d6df9, ce qui laissait /admin, /dashboard et /app accessibles sans session.
//
// Attention : le matcher ne couvre PAS /api/*. Les routes API qui utilisent le
// client service-role (supabaseAdmin) court-circuitent les RLS et restent donc
// ouvertes tant qu'elles ne portent pas leur propre garde — voir
// src/lib/market/client-admin.ts.
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/app/:path*'],
}
