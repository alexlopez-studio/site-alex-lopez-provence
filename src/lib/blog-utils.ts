import type { BlogCategory } from '@/types/blog'

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getAuthorInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

const categoryLabels: Record<string, string> = {
  'conseils-vendeurs': 'CONSEILS VENDEURS',
  'conseils-acheteurs': 'CONSEILS ACHETEURS',
  'marche-local': 'MARCHÉ LOCAL',
  'droits-demarches': 'DROITS & DÉMARCHES',
  temoignages: 'TÉMOIGNAGES',
}

export function getCategoryLabel(category: BlogCategory | string): string {
  return categoryLabels[category] || category.toUpperCase()
}

export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alexlopez-provence.fr'
  return baseUrl + (path.startsWith('/') ? path : '/' + path)
}

export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
