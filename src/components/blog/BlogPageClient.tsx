'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlogPost, BlogCategory } from '@/types/blog'
import { getCategoryLabel, formatDate } from '@/lib/blog-utils'

const ALL_CATEGORIES: BlogCategory[] = [
  'conseils-vendeurs',
  'conseils-acheteurs',
  'marche-local',
  'droits-demarches',
  'temoignages',
]

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={'/blog/' + post.slug}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {post.coverImage ? (
        <div className="relative h-[160px] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-[160px] bg-brand-light flex items-center justify-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand">
            {getCategoryLabel(post.category)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-3 inline-block w-fit rounded-full bg-brand-light px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand">
          {getCategoryLabel(post.category)}
        </span>
        <h3 className="mb-3 text-[16px] font-bold leading-[1.3] text-foreground group-hover:text-brand transition-colors">
          {post.title}
        </h3>
        <p className="mb-4 flex-1 text-[13px] leading-[1.6] text-muted">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-muted/60">{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1 text-[13px] font-semibold text-brand">
            Lire <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ─── Featured ─────────────────────────────────────────────────────────────────

function FeaturedArticle({ post }: { post: BlogPost }) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-[75rem] mx-auto px-6">
        <span className="mb-6 inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          À la une
        </span>
        <Link
          href={'/blog/' + post.slug}
          className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-border md:grid-cols-2"
        >
          {post.coverImage ? (
            <div className="relative min-h-[320px] overflow-hidden">
              <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-brand-light">
              <span className="text-sm font-semibold text-brand">{getCategoryLabel(post.category)}</span>
            </div>
          )}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="mb-4 inline-block w-fit rounded-full bg-brand-light px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand">
              {getCategoryLabel(post.category)}
            </span>
            <h2 className="mb-4 text-[clamp(22px,3vw,32px)] font-bold leading-[1.3] text-foreground">
              {post.title}
            </h2>
            <p className="mb-6 text-[15px] leading-[1.7] text-muted">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="text-[13px] text-muted">
                <span className="font-semibold text-foreground">{post.author}</span>
                <span className="mx-2">·</span>
                {formatDate(post.publishedAt)}
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand group-hover:scale-110 transition-transform">
                <ArrowRight size={16} className="text-white" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [visibleCount, setVisibleCount] = useState(6)
  const articlesRef = useRef<HTMLDivElement>(null)

  const featuredPost = posts.find((p) => p.featured)
  const nonFeatured = posts.filter((p) => !p.featured)

  const filteredPosts = useMemo(() => {
    let result = nonFeatured
    if (activeCategory !== 'all') result = result.filter((p) => p.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
    }
    return result
  }, [nonFeatured, activeCategory, searchQuery])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat)
    setVisibleCount(6)
    setTimeout(() => articlesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const calUrl = process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/alex-lopez/consultation-gratuite'

  return (
    <>
      {/* Hero blog */}
      <section className="bg-surface pt-10 pb-16">
        <div className="max-w-[75rem] mx-auto px-6">
          <div className="mx-auto max-w-[800px] text-center">
            <span className="mb-5 inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              Conseils & Ressources
            </span>
            <h1 className="mb-6 text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.15] text-foreground tracking-tight">
              Tout ce que vous devez savoir
              <br />
              <span className="text-brand">pour vendre ou acheter.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-[600px] text-[16px] leading-[1.7] text-muted">
              Conseils vendeurs, acheteurs, données marché local et droits immobiliers :
              des ressources concrètes pour avancer en Provence Verte et Haut-Var.
            </p>

            {/* Search */}
            <div className="mx-auto mb-8 max-w-[520px]">
              <div className="flex items-center gap-3 rounded-full border border-border bg-white px-6 py-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6) }}
                  placeholder="Rechercher un article..."
                  className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted/50"
                />
                <Search size={18} className="text-muted shrink-0" />
              </div>
            </div>

            {/* Filtres catégories */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleCategoryClick('all')}
                className={'px-4 py-2 rounded-full text-sm font-semibold transition-colors ' +
                  (activeCategory === 'all' ? 'bg-brand text-white' : 'bg-white border border-border text-foreground hover:border-brand hover:text-brand')}
              >
                Tous ({posts.length})
              </button>
              {ALL_CATEGORIES.map((cat) => {
                const count = posts.filter((p) => p.category === cat).length
                if (count === 0) return null
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={'px-4 py-2 rounded-full text-sm font-semibold transition-colors ' +
                      (activeCategory === cat ? 'bg-brand text-white' : 'bg-white border border-border text-foreground hover:border-brand hover:text-brand')}
                  >
                    {getCategoryLabel(cat)} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featuredPost && <FeaturedArticle post={featuredPost} />}

      {/* Articles grid */}
      <section ref={articlesRef} className="scroll-mt-24 bg-white py-16">
        <div className="max-w-[75rem] mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-foreground">
              {activeCategory === 'all' ? 'Nos articles' : getCategoryLabel(activeCategory as BlogCategory)}
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[15px] text-muted">
              {filteredPosts.length} {filteredPosts.length > 1 ? 'articles disponibles' : 'article disponible'}
            </p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[16px] text-muted">Aucun article trouvé pour cette sélection.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); setVisibleCount(6) }}
                className="mt-4 text-[14px] font-semibold text-brand hover:text-brand-hover"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {visiblePosts.map((post) => <ArticleCard key={post.slug} post={post} />)}
              </div>
              {hasMore && (
                <div className="mt-12 text-center">
                  <Button variant="outline" onClick={() => setVisibleCount((c) => c + 6)}>
                    Voir plus d&apos;articles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-light py-20">
        <div className="max-w-[75rem] mx-auto px-6">
          <div className="mx-auto max-w-[700px] text-center">
            <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-extrabold text-foreground">
              Un projet immobilier <span className="text-brand">en Provence Verte ?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-[520px] text-[16px] leading-[1.7] text-muted">
              Estimation gratuite, accompagnement de A à Z. Je réponds sous 24h, sans engagement.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="primary" size="lg">
                <Link href={calUrl} target="_blank" rel="noopener noreferrer">
                  Prendre rendez-vous
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Estimer mon bien</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
