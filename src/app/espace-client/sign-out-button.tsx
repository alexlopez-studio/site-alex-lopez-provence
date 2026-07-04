'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
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
    <button
      type="button"
      onClick={signOut}
      aria-label="Déconnexion"
      title="Déconnexion"
      className="hidden size-9 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6] focus-visible:ring-offset-2 sm:inline-flex"
    >
      <LogOut className="size-5" />
    </button>
  )
}
