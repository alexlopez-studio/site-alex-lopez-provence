import type { Metadata } from 'next'

/**
 * Page de resultat des outils : en ligne mais invisible (refonte 2026-09, §1).
 * Elle porte un token dans l'URL, elle n'a rien a faire dans l'index.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ResultatsLayout({ children }: { children: React.ReactNode }) {
  return children
}
