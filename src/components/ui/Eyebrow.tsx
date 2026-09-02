import '@/styles/design-tokens.css'

/**
 * Sur-titre du design system public (DESIGN_VENDEZ_PRO.md §3.1).
 *
 * Ouvre chaque section : la séquence imposée est sur-titre → titre → contenu →
 * appel à l'action (§7.2).
 *
 * `tone` suit le fond de la section : `dark` sur fond clair, `light` sur fond
 * bleu profond.
 */
export type SurfaceTone = 'dark' | 'light'

export function Eyebrow({ children, tone = 'dark' }: { children: React.ReactNode; tone?: SurfaceTone }) {
  return (
    <p className={'site-eyebrow ' + tone}>
      <span className="dot" aria-hidden="true" />
      {children}
    </p>
  )
}
