'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Home,
  Search,
  BarChart2,
  FileText,
  Star,
  TreePine,
  LayoutGrid,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlogPost, BlogCategory } from '@/types/blog'
import { formatDate } from '@/lib/blog-utils'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

// Eyebrow signature charte homepage : text-[13px] font-bold uppercase tracking-[0.22em]
const EYEBROW = 'text-[13px] font-bold uppercase tracking-[0.22em]'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

// Spring smooth pour hover lift (même ressenti que les cards homepage)
const hoverCard = { y: -6, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
const hoverFilter = { y: -2 }
const tapFilter = { scale: 0.97 as number }

// ─── Config catégories ──────────────────────────────────────────────
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

// ─── Article Card ──────────────────────────────────────────────────
function ArticleCard({ post }: { post: BlogPost }) {
  const cfg = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG['all']
  const CatIcon = cfg.icon

  return (
    <motion.div variants={scaleIn} whileHover={hoverCard}>
      <Link
        href={'/blog/' + post.slug}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white"
      >
        {post.coverImage ? (
          <div className="relative h-[200px] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ) : (
          <div className="h-[200px] bg-brand-light flex items-center justify-center">
            <CatIcon size={36} className="text-brand opacity-40" />
          </div>
        )}
        <div className="flex flex-1 flex-col p-7">
          <span className="mb-4 inline-flex items-center gap-1.5 w-fit text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
            <CatIcon size={11} />
            {cfg.label}
          </span>
          <h3 className="mb-3 font-serif text-xl font-medium leading-[1.2] tracking-[-0.01em] text-foreground group-hover:text-brand transition-colors">
            {post.title}
          </h3>
          <p className="mb-5 flex-1 text-sm text-muted leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted">{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-brand uppercase tracking-[0.1em]">
              Lire <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Featured « À la une » — postcard XL plein bleed ───────────────────────────────
function FeaturedArticle({ post }: { post: BlogPost }) {
  const cfg = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG['all']
  const CatIcon = cfg.icon

  return (
    <section className="relative h-[78vh] md:h-[80vh] overflow-hidden" aria-label="Article à la une">
      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-brand" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/80" />
      <div className="relative h-full flex items-end max-w-[75rem] mx-auto px-6 pb-16 md:pb-24">
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={vpOnce}
          className="max-w-3xl"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6 flex-wrap">
            <span className={EYEBROW + ' text-brand-light'}>À la une</span>
            <span className="h-px w-8 bg-white/40" />
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
              <CatIcon size={11} />
              {cfg.label}
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="font-serif italic text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-[-0.02em] drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)] mb-6"
          >
            {post.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/90 text-base md:text-lg leading-relaxed mb-8 max-w-2xl"
          >
            {post.excerpt}
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
            <Link
              href={'/blog/' + post.slug}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-foreground text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
            >
              Lire l&apos;article <ArrowRight size={15} />
            </Link>
            <span className="text-xs text-white/80">
              <span className="font-semibold">{post.author}</span>
              <span className="mx-2 opacity-60">·</span>
              {formatDate(post.publishedAt)}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Category filter card ────────────────────────────────────────────────
function CategoryCard({
  label,
  icon: Icon,
  count,
  isActive,
  onClick,
}: {
  label: string
  icon: React.ElementType
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      variants={scaleIn}
      onClick={onClick}
      whileHover={hoverFilter}
      whileTap={tapFilter}
      className={
        'flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors w-full ' +
        (isActive
          ? 'border-brand bg-brand-light shadow-sm'
          : 'border-border bg-white hover:border-brand/40')
      }
    >
      <div
        className={
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ' +
          (isActive ? 'bg-brand' : 'bg-surface')
        }
      >
        <Icon size={17} className={isActive ? 'text-white' : 'text-muted'} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={
            'text-sm font-semibold leading-tight truncate ' +
            (isActive ? 'text-brand' : 'text-foreground')
          }
        >
          {label}
        </p>
        <p className="text-[11px] text-muted mt-0.5">
          {count} {count > 1 ? 'articles' : 'article'}
        </p>
      </div>
    </motion.button>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────
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
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      )
    }
    return result
  }, [nonFeatured, activeCategory, searchQuery])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat)
    setVisibleCount(6)
    setTimeout(
      () => articlesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      100
    )
  }

  const calUrl =
    process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/alex-lopez/consultation-gratuite'
  const availableCategories = ALL_CATEGORIES.filter((cat) => posts.some((p) => p.category === cat))

  return (
    <>
      {/* ===== HERO ÉDITORIAL ===== */}
      <section className="bg-white pt-32 md:pt-40 pb-16 px-6">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="max-w-[75rem] mx-auto text-center"
        >
          <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand mb-5'}>
            Conseils & Ressources
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6 max-w-3xl mx-auto"
          >
            Tout ce que vous devez savoir{' '}
            <span className="italic text-brand">pour vendre ou acheter.</span>
          </motion.h1>
          <motion.div variants={fadeInUp} className="flex justify-center mb-8">
            <div className="h-px w-16 bg-brand/40" aria-hidden="true" />
          </motion.div>
          <motion.p
            variants={fadeInUp}
            className="text-muted leading-relaxed text-lg max-w-2xl mx-auto mb-12"
          >
            Conseils vendeurs, acheteurs, données marché local et droits immobiliers — des
            ressources concrètes rédigées pour avancer en Provence Verte et Haut-Var.
          </motion.p>

          {/* Search bar */}
          <motion.div variants={fadeInUp} className="mx-auto max-w-[560px]">
            <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-6 py-3.5 focus-within:border-brand transition-colors">
              <Search size={17} className="text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setVisibleCount(6)
                }}
                placeholder="Rechercher un article..."
                aria-label="Rechercher un article"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted/60"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FILTRES CATÉGORIES ===== */}
      <section className="bg-white pb-16 md:pb-20 px-6">
        <motion.div
          variants={staggerFast}
          initial="initial"
          whileInView="animate"
          viewport={vpOnce}
          className="max-w-[75rem] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <CategoryCard
            label={CATEGORY_CONFIG['all'].label}
            icon={CATEGORY_CONFIG['all'].icon}
            count={posts.length}
            isActive={activeCategory === 'all'}
            onClick={() => handleCategoryClick('all')}
          />
          {availableCategories.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat]
            const count = posts.filter((p) => p.category === cat).length
            return (
              <CategoryCard
                key={cat}
                label={cfg.label}
                icon={cfg.icon}
                count={count}
                isActive={activeCategory === cat}
                onClick={() => handleCategoryClick(cat)}
              />
            )
          })}
        </motion.div>
      </section>

      {/* ===== FEATURED — POSTCARD XL ===== */}
      {featuredPost && <FeaturedArticle post={featuredPost} />}

      {/* ===== ARTICLES GRID ===== */}
      <section ref={articlesRef} className="scroll-mt-24 paper-surface py-28 px-6">
        <div className="max-w-[75rem] mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={vpOnce}
            className="text-center mb-16"
          >
            <p className={EYEBROW + ' text-brand mb-4'}>
              {activeCategory === 'all' ? 'Toutes les lectures' : 'Catégorie'}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
              {activeCategory === 'all' ? (
                <>
                  Lectures <span className="italic text-brand">à explorer.</span>
                </>
              ) : (
                <span className="italic text-brand">
                  {CATEGORY_CONFIG[activeCategory as BlogCategory]?.label || activeCategory}
                </span>
              )}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm text-muted leading-relaxed">
              {filteredPosts.length}{' '}
              {filteredPosts.length > 1 ? 'articles disponibles' : 'article disponible'}
            </p>
          </motion.div>

          {filteredPosts.length === 0 ? (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={vpOnce}
              className="py-16 text-center"
            >
              <p className="text-base text-muted">Aucun article trouvé pour cette sélection.</p>
              <button
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                  setVisibleCount(6)
                }}
                className="mt-4 text-sm font-semibold text-brand hover:text-brand-hover underline-offset-4 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={staggerFast}
                initial="initial"
                whileInView="animate"
                viewport={vpOnce}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {visiblePosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </motion.div>
              {hasMore && (
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={vpOnce}
                  className="mt-14 text-center"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setVisibleCount((c) => c + 6)}
                  >
                    Voir plus d&apos;articles <ArrowRight size={16} />
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <motion.section
        variants={scaleIn}
        initial="initial"
        whileInView="animate"
        viewport={vpOnce}
        className="py-28 px-6 bg-brand-light"
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className={EYEBROW + ' text-brand mb-4'}>Un projet ?</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6 leading-[1.05] tracking-[-0.02em]">
            Discutons de votre <span className="italic text-brand">projet immobilier.</span>
          </h2>
          <p className="text-muted mb-10 leading-relaxed text-lg">
            Estimation gratuite, accompagnement de A à Z. Je réponds sous 24h, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="primary">
              <Link href={calUrl} target="_blank" rel="noopener noreferrer">
                Prendre rendez-vous <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">Estimer mon bien</Link>
            </Button>
            <a
              href={'tel:' + PHONE_RAW}
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-brand transition-colors"
            >
              <Phone size={15} className="text-brand" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </motion.section>
    </>
  )
}
