'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Home,
  Mail,
  MapPin,
  Phone,
  Search,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlogPost } from '@/types/blog'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

const entryPoints = [
  {
    href: '/vendre',
    icon: Home,
    title: 'Vendre',
    eyebrow: 'Propriétaire',
    desc: 'Préparer la vente, obtenir un avis de valeur et avancer avec une stratégie claire.',
  },
  {
    href: '/acheter',
    icon: Search,
    title: 'Acheter',
    eyebrow: 'Projet de vie',
    desc: 'Cadrer votre recherche, vos critères et les communes à privilégier.',
  },
  {
    href: '/outils',
    icon: ClipboardCheck,
    title: 'Outils',
    eyebrow: 'Premier repère',
    desc: 'Estimation, recherche ou analyse : choisissez le parcours adapté à votre projet.',
  },
]

const secondaryEntryPoints = [
  { href: '/blog', icon: BookOpen, title: 'Blog', desc: 'Conseils pratiques et lecture du marché local.' },
  { href: '/contact', icon: Mail, title: 'Contact', desc: 'Un échange direct pour parler de votre projet.' },
]

const trustItems = [
  'Provence Verte & Verdon',
  'Avis de valeur offert',
  'Réponse personnalisée',
]

const communes = ['Barjols', 'Montmeyan', 'Quinson', 'Tavernes', 'Rians', 'Aups', 'Salernes', 'Varages']

function formatDate(value: string) {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
  } catch {
    return ''
  }
}

export default function HomepageContent({ posts }: { posts: BlogPost[] }) {
  const latestPosts = posts.slice(0, 3)
  const leadPost = latestPosts[0]
  const sidePosts = latestPosts.slice(1, 3)

  return (
    <>
      <section className="relative overflow-hidden bg-paper px-6 pb-20 pt-24 lg:pb-28 lg:pt-28">
        <div className="absolute left-0 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-brand-light/60 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 rounded-full bg-accent-light/70 blur-3xl" />

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="relative mx-auto grid max-w-[75rem] items-center gap-12 lg:grid-cols-[0.96fr_1.04fr]"
        >
          <div>
            <motion.p variants={fadeInUp} className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
              Conseiller immobilier iad — Provence Verte & Verdon
            </motion.p>
            <motion.h1 variants={fadeInUp} className="max-w-3xl font-serif text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-7xl">
              Un projet immobilier, traité avec méthode et sens du lieu.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Vente, achat, estimation ou premier avis : je vous aide à prendre les bonnes décisions en Provence Verte & Verdon, avec une lecture claire du marché local.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="primary">
                <Link href="/outils">
                  Utiliser les outils <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Me contacter</Link>
              </Button>
            </motion.div>

            <motion.div variants={staggerFast} className="mt-8 flex flex-wrap gap-2">
              {trustItems.map(function (item) {
                return (
                  <motion.span key={item} variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-white/75 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur">
                    <CheckCircle2 size={14} className="text-brand" />
                    {item}
                  </motion.span>
                )
              })}
            </motion.div>
          </div>

          <motion.div variants={scaleIn} className="relative min-h-[30rem] lg:min-h-[38rem]">
            <div className="absolute inset-x-6 bottom-0 top-10 overflow-hidden rounded-[2.2rem] border border-white/70 shadow-2xl">
              <Image src="/gorges-du-verdon.jpg" alt="Gorges du Verdon et Provence Verte" fill priority sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-foreground/10 to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">Territoire</p>
                <p className="font-serif text-3xl font-medium leading-tight tracking-[-0.03em]">Provence Verte & Verdon</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">Des villages, des biens et des micro-marchés à lire avec précision.</p>
              </div>
            </div>
            <div className="absolute left-0 top-0 rounded-[1.5rem] border border-border bg-white/90 p-5 shadow-xl backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Point de départ</p>
              <p className="mt-2 max-w-[13rem] text-sm font-semibold leading-snug text-foreground">Estimer, acheter ou faire un point sur un bien.</p>
              <Link href="/outils" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                Accéder aux outils <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <motion.div variants={fadeInUp} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Avancer simplement</p>
              <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] text-foreground md:text-5xl">Choisissez le bon point d’entrée.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">Une architecture volontairement courte : pas de faux biens, pas de faux avis, uniquement les parcours utiles pour démarrer.</p>
          </motion.div>

          <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {entryPoints.map(function (entry, index) {
              const Icon = entry.icon
              return (
                <motion.div key={entry.href} variants={scaleIn}>
                  <Link href={entry.href} className="group relative flex min-h-[18rem] overflow-hidden rounded-[2rem] border border-border bg-paper p-7 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-2xl">
                    <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-brand-light/70 blur-2xl" />
                    <div className="relative flex h-full flex-col">
                      <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
                          <Icon size={21} />
                        </div>
                        <span className="font-serif text-5xl font-medium text-foreground/10">0{index + 1}</span>
                      </div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">{entry.eyebrow}</p>
                      <h3 className="text-2xl font-bold tracking-[-0.035em] text-foreground">{entry.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{entry.desc}</p>
                      <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                        Ouvrir <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div variants={staggerFast} className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {secondaryEntryPoints.map(function (entry) {
              const Icon = entry.icon
              return (
                <motion.div key={entry.href} variants={fadeInUp}>
                  <Link href={entry.href} className="group flex items-center justify-between gap-5 rounded-[1.5rem] border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-brand"><Icon size={19} /></div>
                      <div>
                        <h3 className="text-lg font-bold tracking-[-0.02em] text-foreground">{entry.title}</h3>
                        <p className="mt-1 text-sm text-muted">{entry.desc}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-brand-dark px-6 py-24 text-white">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto grid max-w-[75rem] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div variants={fadeInUp}>
            <div className="mb-5 flex items-center gap-2 text-brand-light">
              <MapPin size={18} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">Zone d’intervention</p>
            </div>
            <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">
              Provence Verte & Verdon, sans dispersion.
            </h2>
            <p className="mt-6 max-w-xl text-white/75 leading-relaxed">
              Un territoire cohérent : villages de Provence Verte, communes de Provence Verdon, marchés résidentiels, maisons de village, biens avec terrain et projets de vie.
            </p>
          </motion.div>
          <motion.div variants={staggerFast} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {communes.map(function (commune) {
              const slug = commune.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
              return (
                <motion.div key={commune} variants={scaleIn}>
                  <Link href={'/marche/' + slug} className="block rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:border-brand-light hover:bg-white/15">
                    {commune}
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-paper px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <motion.div variants={fadeInUp} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Derniers conseils</p>
              <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] text-foreground md:text-5xl">Comprendre avant de décider.</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
              Voir tous les articles <ArrowRight size={15} />
            </Link>
          </motion.div>

          {latestPosts.length > 0 ? (
            <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.75fr]">
              {leadPost && (
                <motion.article variants={scaleIn} className="rounded-[2rem] border border-border bg-white p-7 shadow-sm">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-brand">{formatDate(leadPost.publishedAt) || 'Conseil immobilier'}</p>
                  <h3 className="max-w-2xl font-serif text-3xl font-medium leading-tight tracking-[-0.035em] text-foreground md:text-4xl">
                    <Link href={'/blog/' + leadPost.slug} className="hover:text-brand transition-colors">{leadPost.title}</Link>
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{leadPost.excerpt}</p>
                  <Link href={'/blog/' + leadPost.slug} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                    Lire l’article <ArrowRight size={14} />
                  </Link>
                </motion.article>
              )}
              <div className="space-y-5">
                {sidePosts.map(function (post) {
                  return (
                    <motion.article key={post.slug} variants={fadeInUp} className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">{formatDate(post.publishedAt) || 'Conseil immobilier'}</p>
                      <h3 className="text-xl font-bold leading-tight tracking-[-0.025em] text-foreground">
                        <Link href={'/blog/' + post.slug} className="hover:text-brand transition-colors">{post.title}</Link>
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                    </motion.article>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="rounded-[2rem] border border-border bg-white p-10 text-center shadow-sm">
              <BookOpen size={28} className="mx-auto mb-3 text-brand" />
              <p className="text-muted">Les articles seront affichés ici dès que le blog sera disponible côté production.</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce} className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.2rem] border border-border bg-foreground p-10 text-center text-white shadow-2xl md:p-14">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 blur-3xl" />
          <div className="relative">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-light">Premier échange</p>
            <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] md:text-5xl">Un projet en Provence Verte & Verdon ?</h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70 leading-relaxed">
              Utilisez les outils pour obtenir un premier repère, ou contactez-moi directement pour parler de votre projet.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="primary">
                <Link href="/outils">Commencer avec les outils <ArrowRight size={18} /></Link>
              </Button>
              <a href={'tel:' + PHONE_RAW} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15">
                <Phone size={15} /> {PHONE_DISPLAY}
              </a>
            </div>
            <a href={'mailto:' + EMAIL} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-light hover:underline">
              <Mail size={14} /> {EMAIL}
            </a>
          </div>
        </motion.div>
      </section>
    </>
  )
}
