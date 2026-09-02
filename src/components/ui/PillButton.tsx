import Link from 'next/link'
import '@/styles/design-tokens.css'

/**
 * Bouton pilule du design system public (DESIGN_VENDEZ_PRO.md §3.2).
 *
 * `solid` sur fond clair, `light` sur fond bleu profond. La flèche avance au
 * survol. Un seul appel à l'action principal par page, et c'est le guide (§7.2).
 */
export type PillVariant = 'solid' | 'light'

const ARROW = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M2 8h12M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

type CommonProps = {
  children: React.ReactNode
  variant?: PillVariant
  withArrow?: boolean
}

export function PillButton({
  href,
  children,
  variant = 'solid',
  withArrow = true,
  ...rest
}: CommonProps & { href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'children'>) {
  return (
    <Link href={href} className={'site-btn-pill ' + variant} {...rest}>
      {children}
      {withArrow ? ARROW : null}
    </Link>
  )
}

export function PillAction({
  children,
  variant = 'solid',
  withArrow = true,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={'site-btn-pill ' + variant} {...rest}>
      {children}
      {withArrow ? ARROW : null}
    </button>
  )
}
