import type { BlogPost, FAQ } from '@/types/blog'
import { getCanonicalUrl } from './blog-utils'

const SITE_NAME = 'Alex Lopez — Mandataire IAD'

export function generateArticleJsonLd(post: BlogPost) {
  const authorName = post.authorInfo ? post.authorInfo.name : post.author
  const authorRole = post.authorInfo ? post.authorInfo.role : undefined
  const authorLinkedin = post.authorInfo ? post.authorInfo.linkedinUrl : undefined
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alexandrelopez.fr'

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorRole && { jobTitle: authorRole }),
      ...(authorLinkedin && { sameAs: [authorLinkedin] }),
    },
    datePublished: post.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getCanonicalUrl('/blog/' + post.slug),
    },
    ...(post.coverImage && { image: post.coverImage }),
  }
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFaqJsonLd(faqs: FAQ[]) {
  if (!faqs || faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
