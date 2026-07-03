import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentClientDossier } from '@/lib/client-portal'
import { ClientPortalView } from './portal-view'

export const metadata: Metadata = {
  title: 'Espace vendeur',
  robots: { index: false, follow: false },
}

export default async function ClientPortalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/espace-client/connexion')

  const data = await getCurrentClientDossier(supabase)
  if (!data) redirect('/espace-client/connexion')

  return <ClientPortalView data={data} />
}
