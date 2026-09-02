import type { Metadata } from 'next'

/**
 * Les outils restent en ligne mais invisibles (refonte 2026-09, §1) :
 * jamais lies depuis le site, hors sitemap, et desindexes ici.
 *
 * Le noindex est pose au niveau du segment parce que /outils/acheter et
 * /outils/audit sont des composants client : ils ne peuvent pas exporter de
 * `metadata` eux-memes. Next fusionne champ par champ, donc /outils/page.tsx
 * garde son titre et son canonical tout en heritant de ce `robots`.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function OutilsLayout({ children }: { children: React.ReactNode }) {
  return children
}
