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

const trustItems = ['Réseau iad France', 'Avis de valeur offert', 'Disponible 7j/7']

const stats = [
  { value: '100%', label: 'accompagnement' },
  { value: '0€', label: 'frais cachés' },
  { value: '24h', label: 'réponse' },
]

const services = [
  {
    href: '/outils/vendre',
    icon: Home,
    eyebrow: 'Estimer',
    title: 'Obtenir un premier avis de valeur',
    desc: 'Un repère simple pour comprendre votre prix de marché avant d’aller plus loin.',
    cta: 'Estimer mon bien',
  },
  {
    href: '/vendre',
    icon: Sparkles,
    eyebrow: 'Vendre',
    title: 'Préparer une vente claire et bien positionnée',
    desc: 'Prix, présentation, diffusion, visites et négociation : chaque étape est structurée.',
    cta: 'Préparer ma vente',
  },
  {
    href: '/acheter',
    icon: Search,
    eyebrow: 'Acheter',
    title: 'Trouver le bon bien sans perdre de temps',
    desc: 'Un projet cadré, des communes ciblées et une lecture objective des biens visités.',
    cta: 'Cadrer mon projet',
  },
  {
    href: '/outils/audit',
    icon: ClipboardCheck,
    eyebrow: 'Analyser',
    title: 'Faire un point rapide sur un bien',
    desc: 'Avant une vente, un achat ou des travaux, identifiez les points à vérifier.',
    cta: 'Lancer l’audit',
  },
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
      <section className="relative overflow-hidden bg-paper px-6 py-20 lg:py-24">
        <div className="absolute left-0 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand-light/65 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-1/3 rounded-full bg-accent-light/70 blur-3xl" />

        <motion.div variants={stagger} initial="initial" animate="animate" className="relative mx-auto grid max-w-[75rem] items-center gap-12 lg:grid-cols-[1fr_0.78fr]">
          <div>
            <motion.p variants={fadeInUp} className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
              Provence Verte & Verdon
            </motion.p>
            <motion.h1 variants={fadeInUp} className="max-w-4xl font-serif text-4xl font-medium leading-[1.02] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-7xl">
              Votre mandataire immobilier de confiance.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Vente, achat, estimation : je vous accompagne avec une méthode claire, une connaissance locale du marché et une relation simple, directe, sans discours inutile.
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
                  <motion.span key={item} variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur">
                    <CheckCircle2 size={14} className="text-brand" />
                    {item}
                  </motion.span>
                )
              })}
            </motion.div>
          </div>

          <motion.aside variants={scaleIn} className="rounded-[2rem] border border-border bg-white/85 p-6 shadow-2xl backdrop-blur md:p-8">
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">AL</div>
              <div>
                <p className="text-lg font-bold tracking-[-0.03em] text-foreground">Alexandre Lopez</p>
                <p className="text-sm text-muted">Conseiller immobilier iad</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map(function (stat) {
                return (
                  <div key={stat.label} className="rounded-2xl bg-paper p-4 text-center">
                    <p className="font-serif text-3xl font-medium tracking-[-0.04em] text-brand">{stat.value}</p>
                    <p className="mt-1 text-[11px] font-medium leading-tight text-muted">{stat.label}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-7 rounded-2xl bg-foreground p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-light">Point de départ</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">Une estimation, une recherche ou un point sur un bien : commencez par l’outil le plus adapté.</p>
              <Link href="/outils" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-light hover:underline">
                Accéder aux outils <ArrowRight size={14} />
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-18 lg:py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto grid max-w-[75rem] gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <motion.div variants={fadeInUp}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">À propos</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground md:text-5xl">
              Clarté, honnêteté, accompagnement.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              Mon rôle n’est pas de complexifier votre projet, mais de vous aider à décider avec les bons repères : valeur réelle, contexte local, délai, points de vigilance et prochaines étapes.
            </p>
            <Link href="/a-propos" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
              En savoir plus sur mon approche <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {services.map(function (service) {
              const Icon = service.icon
              return (
                <motion.div key={service.href} variants={scaleIn}>
                  <Link href={service.href} className="group flex h-full flex-col rounded-[1.7rem] border border-border bg-paper p-7 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
                    <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
                      <Icon size={21} />
                    </div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">{service.eyebrow}</p>
                    <h3 className="text-xl font-bold leading-tight tracking-[-0.03em] text-foreground">{service.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{service.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                      {service.cta} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-paper px-6 py-18 lg:py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <div className="grid items-center gap-10 rounded-[2rem] border border-border bg-white p-7 shadow-sm md:p-10 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div variants={fadeInUp}>
              <div className="mb-4 flex items-center gap-2 text-brand">
                <MapPin size={18} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">Zone d’intervention</p>
              </div>
              <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground md:text-5xl">
                Provence Verte & Verdon.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                Un territoire ciblé pour rester précis : villages de Provence Verte, communes du Verdon, maisons de village, biens avec terrain et projets de vie.
              </p>
            </motion.div>
            <motion.div variants={staggerFast} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {communes.map(function (commune) {
                const slug = commune.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                return (
                  <motion.div key={commune} variants={scaleIn}>
                    <Link href={'/marche/' + slug} className="block rounded-2xl border border-border bg-paper px-4 py-4 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand">
                      {commune}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-18 lg:py-20">
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
            <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {latestPosts.map(function (post) {
                return (
                  <motion.article key={post.slug} variants={scaleIn} className="rounded-[1.6rem] border border-border bg-paper p-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">{formatDate(post.publishedAt) || 'Conseil immobilier'}</p>
                    <h3 className="text-xl font-bold leading-tight tracking-[-0.025em] text-foreground">
                      <Link href={'/blog/' + post.slug} className="transition-colors hover:text-brand">{post.title}</Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                    <Link href={'/blog/' + post.slug} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                      Lire <ArrowRight size={14} />
                    </Link>
                  </motion.article>
                )
              })}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="rounded-[1.7rem] border border-border bg-paper p-9 text-center">
              <BookOpen size={28} className="mx-auto mb-3 text-brand" />
              <p className="text-muted">Les articles seront affichés ici dès que le blog sera disponible côté production.</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      <section className="bg-paper px-6 py-20">
        <motion.div variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce} className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-foreground p-10 text-center text-white shadow-2xl md:p-14">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 blur-3xl" />
          <div className="relative">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-light">Premier échange</p>
            <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] md:text-5xl">On part de votre projet.</h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/70">
              Utilisez les outils pour obtenir un premier repère, ou contactez-moi directement pour une réponse personnalisée.
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
