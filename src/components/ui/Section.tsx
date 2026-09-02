import '@/styles/design-tokens.css'

/**
 * Bande de section du design system public (DESIGN_VENDEZ_PRO.md §7.2).
 *
 * Rayon 2rem, marge de 0.75rem entre bandes, et l'un des trois fonds autorisés
 * uniquement. La règle des trois fonds veut qu'on alterne : deux sections
 * identiques peuvent se succéder exceptionnellement, jamais trois.
 */
export type SectionTone = 'deep' | 'surface' | 'light'

export function Section({
  tone,
  id,
  children,
  className,
}: {
  tone: SectionTone
  id?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={'site-section ' + tone + (className ? ' ' + className : '')}>
      <div className="site-section-inner">{children}</div>
    </section>
  )
}
