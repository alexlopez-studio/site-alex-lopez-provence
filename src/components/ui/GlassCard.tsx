import '@/styles/design-tokens.css'

/**
 * Carte en verre dépoli (DESIGN_VENDEZ_PRO.md §3.5).
 *
 * `light` est le verre blanc translucide posé sur une vidéo ou un fond sombre.
 * `dark` est la légende flottante gris anthracite, lisible sur un visuel clair.
 */
export function GlassCard({
  tone = 'light',
  children,
  className,
}: {
  tone?: 'light' | 'dark'
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={'site-glass-card ' + tone + (className ? ' ' + className : '')}>{children}</div>
  )
}
