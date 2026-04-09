import type { BlogPost } from '@/types/blog'
import Link from 'next/link'
import { getCategoryLabel, formatDate } from '@/lib/blog-utils'

export default function RelatedArticles({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return null
  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-semibold text-foreground">Articles liés</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={'/blog/' + post.slug}
            className="group flex flex-col rounded-2xl border border-border bg-white p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              {getCategoryLabel(post.category)}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-brand transition-colors">
              {post.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted flex-1">{post.excerpt}</p>
            <span className="mt-4 text-xs text-muted">{formatDate(post.publishedAt)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
