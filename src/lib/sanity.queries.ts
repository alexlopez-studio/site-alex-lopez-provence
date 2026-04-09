import { client, isSanityConfigured } from './sanity.client'
import type { BlogPost } from '@/types/blog'

const authorFields = `
  author->{
    name,
    role,
    initials,
    "imageUrl": image.asset->url,
    linkedin
  }
`

const articleFields = `
  _id,
  title,
  "slug": slug.current,
  category,
  status,
  ${authorFields},
  publishedAt,
  excerpt,
  seoDescription,
  "coverImageUrl": coverImage.asset->url,
  readingTime,
  body,
  "relatedSlugs": relatedArticles[]->slug.current,
  faqs,
  keyword
`

function mapSanityToBlogPost(doc: any): BlogPost {
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    publishedAt: doc.publishedAt || '',
    excerpt: doc.excerpt || '',
    seoDescription: doc.seoDescription || doc.excerpt || '',
    coverImage: doc.coverImageUrl || '',
    readingTime: doc.readingTime || 5,
    author: doc.author?.name || '',
    authorInfo: {
      name: doc.author?.name || '',
      role: doc.author?.role || '',
      initials: doc.author?.initials || '',
      linkedinUrl: doc.author?.linkedin || '',
      image: doc.author?.imageUrl || '',
    },
    featured: false,
    relatedSlugs: doc.relatedSlugs || [],
    faqs: doc.faqs || [],
    keyword: doc.keyword || '',
    body: doc.body || [],
  }
}

export async function getPublishedArticles(): Promise<BlogPost[]> {
  if (!isSanityConfigured || !client) return []
  const articles = await client.fetch(
    `*[_type == "article" && status == "publie"] | order(publishedAt desc) { ${articleFields} }`,
    {},
    { next: { revalidate: 3600, tags: ['articles'] } }
  )
  return articles.map(mapSanityToBlogPost)
}

export async function getFeaturedArticles(limit = 3): Promise<BlogPost[]> {
  if (!isSanityConfigured || !client) return []
  const articles = await client.fetch(
    `*[_type == "article" && status == "publie"] | order(publishedAt desc) [0...$limit] { ${articleFields} }`,
    { limit },
    { next: { revalidate: 3600, tags: ['articles'] } }
  )
  return articles.map(mapSanityToBlogPost)
}

export async function getArticleBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured || !client) return null
  const article = await client.fetch(
    `*[_type == "article" && slug.current == $slug && status == "publie"][0] { ${articleFields} }`,
    { slug },
    { next: { revalidate: 3600, tags: ['articles', `article-${slug}`] } }
  )
  if (!article) return null
  return mapSanityToBlogPost(article)
}

export async function getAllArticleSlugs(): Promise<string[]> {
  if (!isSanityConfigured || !client) return []
  return client.fetch(
    `*[_type == "article" && status == "publie"].slug.current`,
    {},
    { next: { revalidate: 3600, tags: ['articles'] } }
  )
}

export async function getRelatedArticles(slugs: string[]): Promise<BlogPost[]> {
  if (!isSanityConfigured || !client || !slugs || slugs.length === 0) return []
  const articles = await client.fetch(
    `*[_type == "article" && status == "publie" && slug.current in $slugs] { ${articleFields} }`,
    { slugs },
    { next: { revalidate: 3600, tags: ['articles'] } }
  )
  return articles.map(mapSanityToBlogPost)
}
