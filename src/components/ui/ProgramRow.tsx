import Link from 'next/link'
import '@/styles/design-tokens.css'
import type { SurfaceTone } from './Eyebrow'

/**
 * Ligne de programme (DESIGN_VENDEZ_PRO.md §4, section 4).
 *
 * Filet fin, numéro d'étape, flèche circulaire qui avance au survol. La ligne
 * entière est cliquable et mène à la sortie unique de la page.
 */
const ARROW = (
  <span className="site-program-arrow" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8h12M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

type Content = { index: string; title: string; description?: string; tone?: SurfaceTone }

function Body({ index, title, description }: Content) {
  return (
    <>
      <span className="site-program-index">{index}</span>
      <span className="site-program-body">
        <span className="site-title" style={{ fontSize: '1.25rem', display: 'block' }}>
          {title}
        </span>
        {description ? <span className="site-body">{description}</span> : null}
      </span>
      {ARROW}
    </>
  )
}

export function ProgramRow({ href, tone = 'dark', ...content }: Content & { href: string }) {
  return (
    <Link href={href} className={'site-program-row ' + tone}>
      <Body {...content} />
    </Link>
  )
}

export function ProgramRowAction({
  tone = 'dark',
  onClick,
  ...content
}: Content & { onClick: () => void }) {
  return (
    <button type="button" className={'site-program-row ' + tone} onClick={onClick}>
      <Body {...content} />
    </button>
  )
}
