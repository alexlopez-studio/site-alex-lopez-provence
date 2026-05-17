'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Home,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlogPost } from '@/types/blog'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

const heroSignals = ['Estimation gratuite', 'Provence Verte & Verdon', 'Sans engagement', 'Réponse personnalisée']

const tools = [
  {
    href: '/outils/vendre',
    icon: Home,
    title: 'Estimer mon bien',
    desc: 'Obtenez une première fourchette de valeur pour votre maison, appartement ou terrain.',
    value: 'Valeur, fourchette, premiers leviers',
  },
  {
    href: '/outils/acheter',
    icon: Search,
    title: 'Préparer mon achat',
    desc: 'Clarifiez votre budget, vos critères et les communes qui correspondent vraiment à votre projet.',
    value: 'Budget, critères, secteurs ciblés',
  },
  {
    href: '/outils/audit',
    icon: ClipboardCheck,
    title: 'Analyser un bien',
    desc: 'Identifiez les points de vigilance avant une vente, un achat ou des travaux.',
    value: 'État, énergie, travaux, risques',
  },
]

const method = [
  { n: '01', title: 'Comprendre', desc: 'Votre objectif, votre timing, vos contraintes et le niveau de maturité du projet.' },
  { n: '02', title: 'Comparer', desc: 'Les biens similaires, les ventes récentes et l’écart entre prix affiché et réalité du marché.' },
  { n: '03', title: 'Analyser', desc: 'Les atouts, les points faibles, le potentiel, les risques et les leviers de valorisation.' },
  { n: '04', title: 'Décider', desc: 'Vendre, acheter, attendre, ajuster, visiter ou approfondir avec une vision claire.' },
]

const differences = [
  'Je ne donne pas un prix pour faire plaisir : je cherche une lecture réaliste.',
  'Je ne pousse pas à vendre ou acheter sans recul : le timing compte.',
  'L’outil sert de point de départ, pas de vérité absolue.',
  'Chaque projet est relu à partir du bien, du secteur et de votre situation.',
]

const localFactors = ['Commune', 'Micro-marché', 'Type de bien', 'État général', 'Terrain', 'DPE', 'Travaux', 'Exposition', 'Potentiel', 'Demande locale']
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
      <section className="relative overflow-hidden bg-paper px-6 py-20 lg:py-28">
        <div className="absolute left-0 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] translate-x-1/3 rounded-full bg-accent-light/60 blur-3xl" />

        <motion.div variants={stagger} initial="initial" animate="animate" className="relative mx-auto grid max-w-[75rem] items-center gap-12 lg:grid-cols-[1.06fr_0.94fr]">
          <div>
            <motion.p variants={fadeInUp} className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand">
              Outils immobiliers & accompagnement local
            </motion.p>
            <motion.h1 variants={fadeInUp} className="max-w-4xl font-serif text-4xl font-medium leading-[1.02] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-7xl">
              Prenez une meilleure décision immobilière.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Estimer, vendre, acheter ou analyser un bien demande plus qu’un prix au m². Commencez par un outil simple pour obtenir un premier repère, puis affinez votre projet avec une lecture locale en Provence Verte & Verdon.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="primary">
                <Link href="/outils">Commencer avec les outils <ArrowRight size={18} /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Parler de mon projet</Link>
              </Button>
            </motion.div>
            <motion.div variants={staggerFast} className="mt-8 flex flex-wrap gap-2">
              {heroSignals.map(function (item) {
                return (
                  <motion.span key={item} variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-white/85 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur">
                    <CheckCircle2 size={14} className="text-brand" /> {item}
                  </motion.span>
                )
              })}
            </motion.div>
          </div>

          <motion.aside variants={scaleIn} className="rounded-[2.2rem] border border-border bg-white/90 p-6 shadow-2xl backdrop-blur md:p-8">
            <div className="mb-7 rounded-[1.7rem] bg-brand-light p-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">La colonne vertébrale</p>
              <p className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-brand-dark">
                Des outils pour obtenir un repère. Une analyse humaine pour donner du sens.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ['1', 'Choisissez l’outil adapté'],
                ['2', 'Obtenez une première lecture'],
                ['3', 'Affinez avec un regard local'],
              ].map(function ([n, label]) {
                return (
                  <div key={n} className="flex items-center gap-3 rounded-2xl border border-border bg-paper px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-brand shadow-sm">{n}</span>
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                  </div>
                )
              })}
            </div>
          </motion.aside>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <motion.div variants={fadeInUp} className="mb-10 max-w-3xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Le point de départ</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Trois outils pour clarifier votre projet.</h2>
            <p className="mt-5 text-base leading-relaxed text-muted">Chaque outil vous aide à mieux comprendre votre situation avant d’aller plus loin. L’objectif n’est pas de remplacer l’échange, mais de préparer une discussion plus utile.</p>
          </motion.div>

          <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {tools.map(function (tool) {
              const Icon = tool.icon
              return (
                <motion.div key={tool.href} variants={scaleIn}>
                  <Link href={tool.href} className="group flex h-full flex-col rounded-[1.8rem] border border-border bg-paper p-7 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
                    <div className="mb-8 flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-2xl font-bold tracking-[-0.035em] text-foreground">{tool.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{tool.desc}</p>
                    <div className="mt-6 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground">{tool.value}</div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                      Ouvrir l’outil <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-paper px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto grid max-w-[75rem] gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div variants={fadeInUp}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">La méthode</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Une méthode claire avant toute décision.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted">Mon rôle n’est pas de vous pousser à vendre ou acheter vite. Mon rôle est de vous aider à comprendre où vous en êtes, ce que vaut réellement le bien, et quelle décision est la plus cohérente.</p>
          </motion.div>

          <motion.div variants={staggerFast} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {method.map(function (item) {
              return (
                <motion.div key={item.n} variants={scaleIn} className="rounded-[1.6rem] border border-border bg-white p-6 shadow-sm">
                  <p className="mb-4 font-serif text-4xl font-medium tracking-[-0.04em] text-brand-light">{item.n}</p>
                  <h3 className="text-xl font-bold tracking-[-0.025em] text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto grid max-w-[75rem] items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div variants={fadeInUp} className="rounded-[2rem] border border-border bg-brand-light p-8 md:p-10">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Différence</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-brand-dark md:text-5xl">
              L’outil donne un repère. L’accompagnement donne le sens.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-brand-dark/80">Un simulateur peut donner une première indication. Mais il ne voit pas tout : l’état réel du bien, son exposition, son environnement, son potentiel, la qualité de la demande locale ou la marge de négociation possible.</p>
          </motion.div>

          <motion.div variants={staggerFast} className="space-y-3">
            {differences.map(function (item) {
              return (
                <motion.div key={item} variants={fadeInUp} className="flex gap-3 rounded-2xl border border-border bg-paper p-5">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" />
                  <p className="text-sm font-medium leading-relaxed text-foreground">{item}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-paper px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <div className="grid gap-12 rounded-[2rem] border border-border bg-white p-7 shadow-sm md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div variants={fadeInUp}>
              <div className="mb-4 flex items-center gap-2 text-brand"><MapPin size={18} /><p className="text-[11px] font-semibold uppercase tracking-[0.22em]">Expertise locale</p></div>
              <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Un prix immobilier ne se résume pas à un prix au m².</h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">En Provence Verte & Verdon, deux biens de surface équivalente peuvent avoir des valeurs très différentes selon le village, l’accès, la vue, le terrain, l’état, l’exposition, les travaux, le charme, la demande locale ou le profil des acheteurs.</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {communes.map(function (commune) {
                  const slug = commune.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                  return <Link key={commune} href={'/marche/' + slug} className="rounded-full border border-border bg-paper px-3 py-1.5 text-sm text-foreground transition-colors hover:border-brand hover:text-brand">{commune}</Link>
                })}
              </div>
            </motion.div>
            <motion.div variants={staggerFast} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {localFactors.map(function (factor) {
                return (
                  <motion.div key={factor} variants={scaleIn} className="rounded-2xl border border-border bg-paper p-4 text-sm font-semibold text-foreground">
                    <BarChart3 size={16} className="mb-3 text-brand" />
                    {factor}
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <motion.div variants={fadeInUp} className="mb-10 max-w-3xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Approche</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Une approche directe, transparente et utile.</h2>
          </motion.div>
          <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              ['Pas de sur-promesse', 'Une estimation doit vous aider à décider, pas simplement vous séduire.'],
              ['Pas de pression', 'Vous pouvez utiliser les outils ou poser une question sans engagement.'],
              ['Une réponse humaine', 'Le premier repère devient une vraie décision grâce à une relecture concrète.'],
            ].map(function ([title, desc]) {
              return (
                <motion.div key={title} variants={scaleIn} className="rounded-[1.6rem] border border-border bg-paper p-7">
                  <Target size={20} className="mb-5 text-brand" />
                  <h3 className="text-xl font-bold tracking-[-0.025em] text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{desc}</p>
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
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Conseils</p>
              <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] text-foreground md:text-5xl">Comprendre avant d’agir.</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">Voir tous les articles <ArrowRight size={15} /></Link>
          </motion.div>

          {latestPosts.length > 0 ? (
            <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {latestPosts.map(function (post) {
                return (
                  <motion.article key={post.slug} variants={scaleIn} className="rounded-[1.6rem] border border-border bg-white p-6 shadow-sm">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand">{formatDate(post.publishedAt) || 'Conseil immobilier'}</p>
                    <h3 className="text-xl font-bold leading-tight tracking-[-0.025em] text-foreground"><Link href={'/blog/' + post.slug} className="transition-colors hover:text-brand">{post.title}</Link></h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                    <Link href={'/blog/' + post.slug} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">Lire <ArrowRight size={14} /></Link>
                  </motion.article>
                )
              })}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="rounded-[1.7rem] border border-border bg-white p-9 text-center shadow-sm">
              <BookOpen size={28} className="mx-auto mb-3 text-brand" />
              <p className="text-muted">Les articles seront affichés ici dès que le blog sera disponible côté production.</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce} className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-brand/20 bg-brand-light p-10 text-center shadow-xl md:p-14">
          <div className="relative">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Premier repère</p>
            <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] text-brand-dark md:text-5xl">Commencez par clarifier votre projet.</h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-brand-dark/75">Utilisez l’outil adapté à votre situation. Je pourrai ensuite vous aider à affiner l’analyse avec une lecture locale et concrète.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="primary"><Link href="/outils">Accéder aux outils <ArrowRight size={18} /></Link></Button>
              <a href={'tel:' + PHONE_RAW} className="inline-flex items-center justify-center gap-2 rounded-full border border-brand/25 bg-white px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:border-brand hover:text-brand"><Phone size={15} /> {PHONE_DISPLAY}</a>
            </div>
            <a href={'mailto:' + EMAIL} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"><Mail size={14} /> {EMAIL}</a>
          </div>
        </motion.div>
      </section>
    </>
  )
}
