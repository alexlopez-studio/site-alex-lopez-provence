'use client'

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
    desc: 'Préparer la vente, obtenir un avis de valeur et avancer avec une stratégie claire.',
  },
  {
    href: '/acheter',
    icon: Search,
    title: 'Acheter',
    desc: 'Cadrer votre recherche, vos critères et les communes à privilégier.',
  },
  {
    href: '/outils',
    icon: ClipboardCheck,
    title: 'Outils',
    desc: 'Estimation, recherche ou analyse : choisissez le parcours adapté à votre projet.',
  },
  {
    href: '/blog',
    icon: BookOpen,
    title: 'Blog',
    desc: 'Lire les conseils pratiques pour mieux comprendre le marché local.',
  },
  {
    href: '/contact',
    icon: Mail,
    title: 'Contact',
    desc: 'Me transmettre votre demande ou prévoir un premier échange.',
  },
]

const trustItems = [
  'Provence Verte & Haut-Var',
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

  return (
    <>
      <section className="bg-white px-6 pb-20 pt-24 lg:pb-24 lg:pt-28">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mx-auto grid max-w-[75rem] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <motion.p variants={fadeInUp} className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              Conseiller immobilier iad — Provence Verte & Haut-Var
            </motion.p>
            <motion.h1 variants={fadeInUp} className="max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
              Vendre, acheter ou estimer un bien avec un accompagnement local et clair.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Je vous aide à prendre les bonnes décisions immobilières en Provence Verte et dans le Haut-Var : avis de valeur, projet d’achat, bilan d’un bien et conseils de terrain.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                  <motion.span key={item} variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground">
                    <CheckCircle2 size={14} className="text-brand" />
                    {item}
                  </motion.span>
                )
              })}
            </motion.div>
          </div>

          <motion.div variants={scaleIn} className="rounded-[2rem] border border-border bg-surface p-5 shadow-sm lg:p-6">
            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand">Point de départ</p>
              <h2 className="text-2xl font-extrabold tracking-[-0.035em] text-foreground">Quel est votre projet ?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Choisissez le parcours qui correspond à votre situation. Les outils vous donnent un premier repère avant un échange humain.
              </p>
              <div className="mt-5 space-y-3">
                {['Estimer un bien', 'Préparer une recherche', 'Faire un point sur un bien'].map(function (label) {
                  return (
                    <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground">
                      <Sparkles size={15} className="text-brand" />
                      {label}
                    </div>
                  )
                })}
              </div>
              <Link href="/outils" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                Accéder aux outils <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-y border-border bg-surface px-6 py-16">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <motion.div variants={fadeInUp} className="mb-8 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Avancer simplement</p>
            <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">Choisissez votre entrée.</h2>
          </motion.div>

          <motion.div variants={staggerFast} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {entryPoints.map(function (entry) {
              const Icon = entry.icon
              return (
                <motion.div key={entry.href} variants={scaleIn}>
                  <Link href={entry.href} className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light text-brand">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold tracking-[-0.02em] text-foreground">{entry.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{entry.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                      Ouvrir <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <div className="grid items-center gap-10 rounded-[2rem] border border-border bg-[#F7F8FA] p-6 md:p-8 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div variants={fadeInUp}>
              <div className="mb-4 flex items-center gap-2 text-brand">
                <MapPin size={18} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">Zone d’intervention</p>
              </div>
              <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.03em] text-foreground md:text-4xl">
                Une présence locale en Provence Verte et Haut-Var.
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Un projet immobilier dépend beaucoup du secteur, du type de bien et du niveau de demande. Mon rôle est de vous aider à lire ces éléments simplement.
              </p>
            </motion.div>
            <motion.div variants={staggerFast} className="flex flex-wrap gap-2">
              {communes.map(function (commune) {
                const slug = commune.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                return (
                  <motion.div key={commune} variants={fadeInUp}>
                    <Link href={'/marche/' + slug} className="block rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand">
                      {commune}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="bg-surface px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <motion.div variants={fadeInUp} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Derniers conseils</p>
              <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">Comprendre avant de décider.</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
              Voir tous les articles <ArrowRight size={15} />
            </Link>
          </motion.div>

          {latestPosts.length > 0 ? (
            <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {latestPosts.map(function (post) {
                return (
                  <motion.article key={post.slug} variants={scaleIn} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                      {formatDate(post.publishedAt) || 'Conseil immobilier'}
                    </p>
                    <h3 className="text-xl font-bold leading-tight tracking-[-0.025em] text-foreground">
                      <Link href={'/blog/' + post.slug} className="hover:text-brand transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                    <Link href={'/blog/' + post.slug} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                      Lire l’article <ArrowRight size={14} />
                    </Link>
                  </motion.article>
                )
              })}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="rounded-2xl border border-border bg-white p-8 text-center">
              <BookOpen size={26} className="mx-auto mb-3 text-brand" />
              <p className="text-muted">Les articles seront affichés ici dès que le blog sera disponible côté production.</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-brand-light p-8 text-center md:p-10">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Premier échange</p>
          <h2 className="font-serif text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">Vous voulez avancer ?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted leading-relaxed">
            Utilisez les outils pour obtenir un premier repère, ou contactez-moi directement pour parler de votre projet.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <Link href="/outils">Commencer avec les outils <ArrowRight size={18} /></Link>
            </Button>
            <a href={'tel:' + PHONE_RAW} className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand">
              <Phone size={15} /> {PHONE_DISPLAY}
            </a>
          </div>
          <a href={'mailto:' + EMAIL} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
            <Mail size={14} /> {EMAIL}
          </a>
        </motion.div>
      </section>
    </>
  )
}
