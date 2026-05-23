import type { Metadata } from 'next'
import { getPublishedArticles } from '@/lib/sanity.queries'
import BlogPageClient from '@/components/blog/BlogPageClient'
import type { BlogPost } from '@/types/blog'

// Sanity project: x2wprhnd — Alex Lopez Provence
// revalidate: 3600s (ISR) — rebuild pour voir les nouveaux articles
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Conseils Immobiliers — Alexandre Lopez Provence Verte & Verdon',
  description:
    'Conseils vendeurs, acheteurs, droits et données marché : des ressources concrètes rédigées par Alexandre Lopez, conseiller immobilier iad France en Provence Verte & Verdon.',
  openGraph: {
    title: 'Blog Immobilier — Alexandre Lopez Provence Verte & Verdon',
    description: 'Tout ce que vous devez savoir pour vendre ou acheter en Provence Verte & Verdon.',
  },
}

const staticSellerArticle: BlogPost = {
  slug: 'vendre-sa-maison-sans-agence',
  title: 'Vendre sa maison sans agence : bonne idée ou risque à éviter ?',
  excerpt: 'Avantages, limites, erreurs de prix et alternatives avant de vendre seul en Provence Verte & Verdon.',
  category: 'conseils-vendeurs',
  author: 'Alexandre Lopez',
  publishedAt: '2026-05-23',
  featured: true,
  readingTime: 7,
  seoDescription: 'Vendre sans agence peut sembler simple. Découvrez les avantages, les risques, les erreurs de prix et les alternatives avant de vendre votre maison.',
  faqs: [],
  relatedSlugs: [],
  keyword: 'vendre sa maison sans agence',
  body: [],
}

function mergeStaticArticles(posts: BlogPost[]) {
  if (posts.some((post) => post.slug === staticSellerArticle.slug)) return posts
  return [staticSellerArticle, ...posts]
}

export default async function BlogPage() {
  const posts = await getPublishedArticles()
  return <BlogPageClient posts={mergeStaticArticles(posts)} />
}
