import '@/styles/design-tokens.css'
import type { SurfaceTone } from './Eyebrow'

/**
 * Carte de témoignage et sa grille (DESIGN_VENDEZ_PRO.md §4, section 7).
 *
 * Guillemet géant en bleu azur, signature séparée par un filet fin.
 */
export function CardGrid({ children }: { children: React.ReactNode }) {
  return <ul className="site-card-grid">{children}</ul>
}

export function TestimonialCard({
  quote,
  author,
  role,
  tone = 'dark',
}: {
  quote: string
  author: string
  role: string
  tone?: SurfaceTone
}) {
  return (
    <li className={'site-testimonial-card ' + tone}>
      <div>
        <p className="site-testimonial-mark" aria-hidden="true">
          &ldquo;
        </p>
        <p className="site-body">{quote}</p>
      </div>
      <p className="site-testimonial-author">
        {author}
        <span className="site-testimonial-role"> · {role}</span>
      </p>
    </li>
  )
}
