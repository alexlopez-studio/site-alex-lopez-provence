'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/espace-client/connexion')
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={signOut}>
      <LogOut className="mr-2 size-4" /> Déconnexion
    </Button>
  )
}
