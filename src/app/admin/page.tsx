import { redirect } from 'next/navigation'

/**
 * /admin → redirige vers le dashboard Mandat OS.
 * (L'accès est protégé par le middleware + la garde du layout /admin/market.)
 */
export default function AdminPage() {
  redirect('/admin/market')
}
