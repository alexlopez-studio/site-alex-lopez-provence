export interface Author {
  name: string
  role: string
  initials: string
  linkedinUrl?: string
  image?: string
}

export interface FAQ {
  question: string
  answer: string
}

export type BlogCategory =
  | 'conseils-vendeurs'
  | 'conseils-acheteurs'
  | 'marche-local'
  | 'droits-demarches'
  | 'temoignages'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  author: string
  publishedAt: string
  featured: boolean
  readTime?: number
  coverImage?: string
  seoDescription?: string
  authorInfo?: Author
  readingTime?: number
  faqs?: FAQ[]
  relatedSlugs?: string[]
  keyword?: string
  body?: any[]
}
