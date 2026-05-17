import type { Metadata } from 'next'
import { getPublishedArticles } from '@/lib/sanity.queries'
import BlogPageClient from '@/components/blog/BlogPageClient'

// Sanity project: x2wprhnd — Alex Lopez Provence
// revalidate: 3600s (ISR) — rebuild pour voir les nouveaux articles
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Conseils Immobiliers — Alex Lopez Provence Verte & Verdon',
  description:
    'Conseils vendeurs, acheteurs, droits et données marché : des ressources concrètes rédigées par Alex Lopez, mandataire IAD en Provence Verte et Verdon.',
  openGraph: {
    title: 'Blog Immobilier — Alex Lopez Provence Verte & Verdon',
    description: 'Tout ce que vous devez savoir pour vendre ou acheter en Provence Verte et Verdon.',
  },
}

export default async function BlogPage() {
  const posts = await getPublishedArticles()
  return <BlogPageClient posts={posts} />
}
