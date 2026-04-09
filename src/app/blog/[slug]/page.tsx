import type { Metadata } from 'next'
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getRelatedArticles,
} from '@/lib/sanity.queries'
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
} from '@/lib/seo-blog'
import { getCanonicalUrl, getCategoryLabel } from '@/lib/blog-utils'
import { notFound } from 'next/navigation'
import ArticleHeader from '@/components/blog/ArticleHeader'
import ArticleFAQ from '@/components/blog/ArticleFAQ'
import RelatedArticles from '@/components/blog/RelatedArticles'
import ShareButtons from '@/components/blog/ShareButtons'
import ArticleSidebar from '@/components/blog/ArticleSidebar'
import JsonLd from '@/components/blog/JsonLd'
import { PortableTextRenderer } from '@/components/blog/PortableTextRenderer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alexlopez-provence.fr'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getArticleBySlug(slug)
  if (!post) return { title: 'Article introuvable' }

  const canonicalUrl = getCanonicalUrl('/blog/' + slug)
  const authorName = post.authorInfo ? post.authorInfo.name : post.author
  const categoryLabel = getCategoryLabel(post.category)

  return {
    title: post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [authorName],
      url: canonicalUrl,
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      }),
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getArticleBySlug(slug)
  if (!post) notFound()

  const relatedPosts =
    post.relatedSlugs && post.relatedSlugs.length > 0
      ? await getRelatedArticles(post.relatedSlugs)
      : []

  const postUrl = SITE_URL + '/blog/' + post.slug
  const categoryUrl = SITE_URL + '/blog?category=' + post.category

  const articleJsonLd = generateArticleJsonLd(post)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Accueil', url: SITE_URL },
    { name: 'Blog', url: SITE_URL + '/blog' },
    { name: getCategoryLabel(post.category), url: categoryUrl },
    { name: post.title, url: postUrl },
  ])
  const faqJsonLd = post.faqs && post.faqs.length > 0 ? generateFaqJsonLd(post.faqs) : null

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <div className="max-w-[75rem] mx-auto px-6 pt-10 pb-20">
        <ArticleHeader post={post} />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">
          <article data-article-content>
            {post.body && post.body.length > 0 ? (
              <PortableTextRenderer content={post.body} slug={post.slug} />
            ) : (
              <p className="text-muted leading-relaxed">Contenu en cours de rédaction...</p>
            )}

            <div className="lg:hidden">
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {post.faqs && post.faqs.length > 0 && <ArticleFAQ faqs={post.faqs} />}
            {relatedPosts.length > 0 && <RelatedArticles posts={relatedPosts} />}
          </article>

          <ArticleSidebar url={postUrl} title={post.title} />
        </div>
      </div>
    </>
  )
}
