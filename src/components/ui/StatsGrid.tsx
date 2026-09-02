import '@/styles/design-tokens.css'
import type { SurfaceTone } from './Eyebrow'

/**
 * Grille de compteurs (DESIGN_VENDEZ_PRO.md §4, section 6).
 *
 * Deux colonnes, quatre au-delà de 1024px. Chiffres en Montserrat 500 serré.
 *
 * Les valeurs affichées doivent être vérifiables : le §7.3 signale que la page
 * étalon annonce des chiffres dont la page /avis, aujourd'hui supprimée, était
 * la seule justification.
 */
export type Stat = { value: string; label: string }

export function StatsGrid({ stats, tone = 'light' }: { stats: ReadonlyArray<Stat>; tone?: SurfaceTone }) {
  return (
    <ul className={'site-stats-grid ' + tone}>
      {stats.map(function (stat) {
        return (
          <li key={stat.label}>
            <p className="site-stat-value">{stat.value}</p>
            <p className="site-stat-label">{stat.label}</p>
          </li>
        )
      })}
    </ul>
  )
}
