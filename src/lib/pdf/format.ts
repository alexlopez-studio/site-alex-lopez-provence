/**
 * Formatters purs pour les rendus PDF (Estimation / Audit).
 * Toutes les fonctions sont deterministes, sans side-effect, et compatibles
 * avec react-pdf (pas de DOM, pas de Intl absent).
 */

const eurFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('fr-FR')

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const FALLBACK = '\u2014' // em-dash

export function formatEur(n: number): string {
  if (!Number.isFinite(n)) return FALLBACK
  return eurFormatter.format(n)
}

export function formatEurPerM2(n: number): string {
  if (!Number.isFinite(n)) return FALLBACK
  return `${numberFormatter.format(Math.round(n))} \u20ac/m\u00b2`
}

export function formatSignedEur(n: number): string {
  if (!Number.isFinite(n)) return FALLBACK
  if (n > 0) return `+${formatEur(n)}`
  return formatEur(n)
}

export function formatSignedPct(pct: number): string {
  if (!Number.isFinite(pct)) return FALLBACK
  if (pct > 0) return `+${pct}%`
  return `${pct}%`
}

export function formatDateFr(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return dateFormatter.format(d)
}

/**
 * Sanitise une chaine destinee a un nom de fichier ASCII safe.
 * - Conserve [a-zA-Z0-9._-]
 * - Remplace tout autre caractere par _
 * - Collapse les _ multiples
 * - Trim les _ en bord
 */
export function sanitizeFilename(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
}
