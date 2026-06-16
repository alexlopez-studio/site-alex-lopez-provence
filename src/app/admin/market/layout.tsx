import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import { MarketShell } from './MarketShell'

export default async function MarketLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login?redirect=/admin/market')

  return (
    <MarketShell role={admin.role} email={admin.email}>
      {children}
    </MarketShell>
  )
}
