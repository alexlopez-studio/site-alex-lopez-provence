'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Home,
  Search,
  BarChart2,
  FileText,
  Star,
  TreePine,
  LayoutGrid,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlogPost, BlogCategory } from '@/types/blog'
import { formatDate } from '@/lib/blog-utils'

const CATEGORY_CONFIG: Record<BlogCategory | 'all', { label: string; icon: React.ElementType }> = {
  all: { label: 'Tous les articles', icon: LayoutGrid },
  'conseils-vendeurs': { label: 'Conseils vendeurs', icon: Home },
  'conseils-acheteurs': { label: 'Conseils acheteurs', icon: Search },
  'marche-local': { label: 'Marché local', icon: BarChart2 },
  'droits-demarches': { label: 'Droits & démarches', icon: FileText },
  temoignages: { label: 'Témoignages', icon: Star },
  'vie-provence-verte': { label: 'Vie en Provence Verte', icon: TreePine },
}

const ALL_CATEGORIES: BlogCategory[] = [
  'conseils-vendeurs',
  'conseils-acheteurs',
  'marche-local',
  'droits-demarches',
  'temoignages',
  'vie-provence-verte',
]

function ArticleCard({ post }: { post: BlogPost }) {
  const cfg = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG['all']
  const CatIcon = cfg.icon

  return (
    <Link href={'/blog/' + post.slug} className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      {post.coverImage ? (
        <div className="relative h-[170px] overflow-hidden">
          <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      ) : (
        <div className="flex h-[170px] items-center justify-center bg-brand-light"><CatIcon size={32} className="text-brand opacity-40" /></div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand"><CatIcon size={11} />{cfg.label}</span>
        <h3 className="mb-3 text-[17px] font-bold leading-[1.3] tracking-[-0.025em] text-foreground transition-colors group-hover:text-brand">{post.title}</h3>
        <p className="mb-4 flex-1 text-[13px] leading-[1.6] text-muted">{post.excerpt}</p>
        <div className="flex items-center justify-between"><span className="text-[12px] text-muted/60">{formatDate(post.publishedAt)}</span><span className="flex items-center gap-1 text-[13px] font-semibold text-brand">Lire <ArrowRight size={14} /></span></div>
      </div>
    </Link>
  )
}

function FeaturedArticle({ post }: { post: BlogPost }) {
  const cfg = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG['all']
  const CatIcon = cfg.icon

  return (
    <section className="bg-paper px-6 py-16">
      <div className="mx-auto max-w-[75rem]">
        <span className="mb-6 inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-brand">À la une</span>
        <Link href={'/blog/' + post.slug} className="group grid grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm md:grid-cols-2">
          {post.coverImage ? (
            <div className="relative min-h-[340px] overflow-hidden"><Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover transition-transform duration-500 group-hover:scale-105" /></div>
          ) : (
            <div className="flex min-h-[340px] items-center justify-center bg-brand-light"><CatIcon size={48} className="text-brand opacity-30" /></div>
          )}
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-brand"><CatIcon size={11} />{cfg.label}</span>
            <h2 className="mb-4 font-serif text-[clamp(28px,4vw,44px)] font-medium leading-tight tracking-[-0.04em] text-foreground">{post.title}</h2>
            <p className="mb-6 text-[15px] leading-[1.7] text-muted">{post.excerpt}</p>
            <div className="flex items-center justify-between"><div className="text-[13px] text-muted"><span className="font-semibold text-foreground">{post.author}</span><span className="mx-2">·</span>{formatDate(post.publishedAt)}</div><span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand transition-transform group-hover:scale-110"><ArrowRight size={16} className="text-white" /></span></div>
          </div>
        </Link>
      </div>
    </section>
  )
}

function CategoryCard({ label, icon: Icon, count, isActive, onClick }: { label: string; icon: React.ElementType; count: number; isActive: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ' + (isActive ? 'border-brand bg-brand-light shadow-sm' : 'border-border bg-white')}>
      <div className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ' + (isActive ? 'bg-brand' : 'bg-surface')}><Icon size={17} className={isActive ? 'text-white' : 'text-muted'} /></div>
      <div className="min-w-0 flex-1"><p className={'truncate text-[13px] font-semibold leading-tight ' + (isActive ? 'text-brand' : 'text-foreground')}>{label}</p><p className="mt-0.5 text-[11px] text-muted">{count} {count > 1 ? 'articles' : 'article'}</p></div>
    </button>
  )
}

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
  const availableCategories = ALL_CATEGORIES.filter((cat) => posts.some((p) => p.category === cat))

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat)
    setVisibleCount(6)
    setTimeout(() => articlesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <>
      <section className="relative overflow-hidden bg-paper px-6 pb-16 pt-16">
        <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="relative mx-auto max-w-[75rem]">
          <div className="mx-auto max-w-[800px] text-center">
            <span className="mb-5 inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Conseils & ressources</span>
            <h1 className="mb-6 font-serif text-[clamp(36px,6vw,64px)] font-medium leading-[1.05] tracking-[-0.045em] text-foreground">Comprendre avant de vendre ou d’acheter.</h1>
            <p className="mx-auto mb-10 max-w-[620px] text-[16px] leading-[1.7] text-muted">Conseils vendeurs, acheteurs, données marché local et démarches : des ressources concrètes pour avancer en Provence Verte & Verdon.</p>
            <div className="mx-auto mb-8 max-w-[520px]"><div className="flex items-center gap-3 rounded-full border border-border bg-white px-6 py-3 shadow-sm"><Search size={16} className="shrink-0 text-muted" /><input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6) }} placeholder="Rechercher un article..." className="flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted/50" /></div></div>
            <div className="grid grid-cols-1 gap-2 text-left sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <CategoryCard label={CATEGORY_CONFIG.all.label} icon={CATEGORY_CONFIG.all.icon} count={posts.length} isActive={activeCategory === 'all'} onClick={() => handleCategoryClick('all')} />
              {availableCategories.map(function (cat) {
                const cfg = CATEGORY_CONFIG[cat]
                const count = posts.filter((p) => p.category === cat).length
                return <CategoryCard key={cat} label={cfg.label} icon={cfg.icon} count={count} isActive={activeCategory === cat} onClick={() => handleCategoryClick(cat)} />
              })}
            </div>
          </div>
        </div>
      </section>

      {featuredPost && <FeaturedArticle post={featuredPost} />}

      <section ref={articlesRef} className="scroll-mt-24 bg-white px-6 py-16">
        <div className="mx-auto max-w-[75rem]">
          <div className="mb-12 text-center"><h2 className="font-serif text-[clamp(30px,4vw,48px)] font-medium tracking-[-0.04em] text-foreground">{activeCategory === 'all' ? 'Tous les articles' : CATEGORY_CONFIG[activeCategory as BlogCategory]?.label || activeCategory}</h2><p className="mx-auto mt-4 max-w-[520px] text-[15px] text-muted">{filteredPosts.length} {filteredPosts.length > 1 ? 'articles disponibles' : 'article disponible'}</p></div>
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center"><p className="text-[16px] text-muted">Aucun article trouvé pour cette sélection.</p><button onClick={() => { setActiveCategory('all'); setSearchQuery(''); setVisibleCount(6) }} className="mt-4 text-[14px] font-semibold text-brand hover:text-brand-hover">Réinitialiser les filtres</button></div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{visiblePosts.map((post) => <ArticleCard key={post.slug} post={post} />)}</div>
              {hasMore && <div className="mt-12 text-center"><Button variant="outline" onClick={() => setVisibleCount((c) => c + 6)}>Voir plus d&apos;articles</Button></div>}
            </>
          )}
        </div>
      </section>

      <section className="bg-paper px-6 py-20">
        <div className="mx-auto max-w-[75rem]"><div className="mx-auto max-w-[760px] rounded-[2rem] border border-border bg-foreground p-10 text-center text-white shadow-xl md:p-14"><h2 className="mb-4 font-serif text-[clamp(30px,4vw,48px)] font-medium tracking-[-0.04em]">Un projet immobilier en Provence Verte & Verdon ?</h2><p className="mx-auto mb-10 max-w-[520px] text-[16px] leading-[1.7] text-white/70">Utilisez les outils ou contactez-moi pour obtenir un premier repère personnalisé.</p><div className="flex flex-wrap justify-center gap-4"><Button asChild variant="primary" size="lg"><Link href="/outils">Utiliser les outils</Link></Button><Button asChild variant="outline" size="lg"><Link href="/contact">Me contacter</Link></Button></div></div></div>
      </section>
    </>
  )
}
