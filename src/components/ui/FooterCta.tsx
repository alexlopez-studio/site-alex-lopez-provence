import '@/styles/design-tokens.css'
import { PillButton } from './PillButton'
import type { SurfaceTone } from './Eyebrow'

/**
 * Bandeau d'appel à l'action de pied de page (DESIGN_VENDEZ_PRO.md §4, section 8).
 *
 * Titre monumental à gauche, bouton pilule à droite, filet de séparation sous
 * l'ensemble. C'est l'appel à l'action unique de la page, et c'est le guide (§4).
 */
export function FooterCta({
  title,
  ctaLabel,
  href,
  tone = 'light',
}: {
  title: string
  ctaLabel: string
  href: string
  tone?: SurfaceTone
}) {
  return (
    <div className={'site-footer-cta ' + tone}>
      <h2 className="site-title">{title}</h2>
      <PillButton href={href} variant={tone === 'light' ? 'light' : 'solid'}>
        {ctaLabel}
      </PillButton>
    </div>
  )
}
