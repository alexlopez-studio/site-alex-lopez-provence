import '@/styles/design-tokens.css'

/**
 * Bouton fléché circulaire (DESIGN_VENDEZ_PRO.md §3.4).
 *
 * `outline` sur fond clair, `solid` en noir plein. 3rem, 3.5rem au-delà de 640px.
 */
export type ArrowVariant = 'outline' | 'solid'
export type ArrowDirection = 'left' | 'right' | 'up' | 'down'

const ROTATION: Record<ArrowDirection, string> = {
  right: '0deg',
  down: '90deg',
  left: '180deg',
  up: '270deg',
}

export function ArrowButton({
  variant = 'outline',
  direction = 'right',
  label,
  ...rest
}: {
  variant?: ArrowVariant
  direction?: ArrowDirection
  label: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={'site-btn-arrow ' + variant} aria-label={label} {...rest}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        style={{ transform: 'rotate(' + ROTATION[direction] + ')' }}
      >
        <path d="M2 8h12M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
