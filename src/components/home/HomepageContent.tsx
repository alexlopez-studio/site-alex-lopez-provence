'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
} from 'lucide-react'
import type { BlogPost } from '@/types/blog'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'
const EMAIL = 'alex@alexlopez-provence.fr'

const heroSignals = ['Estimation gratuite', 'Provence Verte & Verdon', 'Sans engagement']
const estimationSteps = [
  { icon: Home, title: 'Décrivez votre bien', desc: 'Type, surface, adresse, état général.' },
  { icon: BarChart3, title: 'Analyse locale', desc: 'Lecture du secteur et des facteurs de valeur.' },
  { icon: CheckCircle2, title: 'Premier repère', desc: 'Fourchette indicative et points à vérifier.' },
]
const sectorCards = [
  ['Brignoles', 'Chef-lieu de la Provence Verte'],
  ['Saint-Maximin', 'La Sainte-Baume'],
  ['Cotignac', 'Village de caractère'],
  ['Barjols', 'Cité des fontaines'],
]
const communes = ['Aups', 'Salernes', 'Vinon-sur-Verdon', 'Rians', 'Le Val', 'Carcès', 'Montmeyan', 'Fox-Amphoux', 'Tourtour', 'Sillans-la-Cascade', 'Villecroze', 'Tavernes']
const services = [
  { icon: BarChart3, title: 'Estimation', desc: 'Une première évaluation claire pour comprendre la valeur de votre bien avant de décider.', href: '/outils/vendre', cta: 'Estimer mon bien' },
  { icon: Home, title: 'Vente', desc: 'Une stratégie de mise en vente cohérente : positionnement, présentation, diffusion et suivi.', href: '/vendre', cta: 'Préparer ma vente' },
  { icon: Search, title: 'Achat', desc: 'Un accompagnement pour clarifier vos critères, votre budget et les secteurs les plus adaptés.', href: '/outils/acheter', cta: 'Préparer mon achat' },
]
const reasons = [
  ['Connaissance du terrain', 'Une lecture concrète des villages, des accès, de la demande et des différences de valeur d’une commune à l’autre.'],
  ['Honoraires optimisés', 'Le modèle iad permet un accompagnement professionnel sans agence physique traditionnelle.'],
  ['Disponibilité et suivi', 'Un contact direct, des réponses simples et un accompagnement jusqu’aux décisions importantes.'],
]

function formatDate(value: string) {
  if (!value) return ''
  try { return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) } catch { return '' }
}
function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,180,236,0.24)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_18px_40px_rgba(0,180,236,0.32)]">{children}</Link>
}
function OutlineLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <Link href={href} className={'inline-flex items-center justify-center rounded-full border-2 px-7 py-4 text-sm font-bold transition-all hover:-translate-y-0.5 ' + (light ? 'border-white text-white hover:bg-white hover:text-foreground' : 'border-brand text-brand hover:bg-brand hover:text-white')}>{children}</Link>
}

export default function HomepageContent({ posts }: { posts: BlogPost[] }) {
  const latestPosts = posts.slice(0, 3)
  return (
    <>
      <section className="relative overflow-hidden bg-[#f4f7f8] px-6 pb-16 pt-28 lg:min-h-screen lg:pb-24 lg:pt-36">
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <motion.div variants={stagger} initial="initial" animate="animate" className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm"><MapPin size={15} className="text-brand" /> Provence Verte & Verdon</motion.div>
            <motion.h1 variants={fadeInUp} className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.05em] text-foreground md:text-6xl lg:text-7xl">Votre expert immobilier en <span className="text-brand">Provence Verte</span></motion.h1>
            <motion.p variants={fadeInUp} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">Estimez gratuitement votre bien à Brignoles, Saint-Maximin, Barjols, Cotignac ou aux portes du Verdon. Un accompagnement de proximité par un conseiller qui connaît les villages, les écarts de valeur et les vrais leviers de décision.</motion.p>
            <motion.div variants={fadeInUp} className="mt-9 flex flex-col gap-4 sm:flex-row"><PrimaryLink href="/outils/vendre">Estimer mon bien gratuitement <ArrowRight size={18} /></PrimaryLink><OutlineLink href="#secteur">Découvrir mon secteur</OutlineLink></motion.div>
            <motion.div variants={staggerFast} className="mt-8 flex flex-wrap gap-2">{heroSignals.map((item) => <motion.span key={item} variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm"><CheckCircle2 size={14} className="text-brand" /> {item}</motion.span>)}</motion.div>
          </div>
          <motion.div variants={scaleIn} className="relative mx-auto flex min-h-[32rem] w-full max-w-[34rem] items-end justify-center lg:ml-auto">
            <div className="absolute inset-x-8 bottom-0 h-40 rounded-full bg-brand/20 blur-3xl" />
            <div className="absolute bottom-0 h-[82%] w-[82%] rounded-t-full bg-gradient-to-br from-brand-light via-white to-[#eaeef1]" />
            <Image src="/alexandre-lopez-no-background.png" alt="Alexandre Lopez, conseiller immobilier iad France en Provence Verte et Verdon" width={760} height={920} priority className="relative z-10 h-auto max-h-[35rem] w-auto object-contain drop-shadow-2xl" />
            <div className="absolute bottom-6 left-0 z-20 rounded-2xl bg-white/90 px-5 py-4 shadow-xl backdrop-blur"><p className="text-sm font-bold text-foreground">Alexandre Lopez</p><p className="text-xs text-muted">Conseiller immobilier iad France</p></div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative min-h-[34rem] overflow-hidden px-6 py-24 text-white md:min-h-[42rem] md:py-32">
        <Image src="/gorges-du-verdon.jpg" alt="Gorges du Verdon et territoire Provence Verte" fill priority={false} sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101828]/82 via-[#101828]/45 to-[#101828]/10" />
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="relative mx-auto flex min-h-[24rem] max-w-7xl items-end md:min-h-[28rem]">
          <div className="max-w-3xl">
            <motion.p variants={fadeInUp} className="mb-4 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-light backdrop-blur">Une décision locale</motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold leading-tight tracking-[-0.045em] md:text-6xl">Un projet immobilier ne se joue pas seulement sur un prix au m².</motion.h2>
            <motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/82">En Provence Verte & Verdon, deux biens similaires peuvent avoir des valeurs très différentes selon la commune, la vue, l’accès, le terrain, l’état, le charme, le DPE ou la demande locale.</motion.p>
          </div>
        </motion.div>
      </section>

      <section id="estimation" className="bg-white px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-5xl text-center">
          <motion.p variants={fadeInUp} className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Estimation gratuite</motion.p>
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Quelle est la valeur de votre bien en Provence Verte ?</motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">Maison de village, bastide, villa avec piscine ou terrain : obtenez un premier repère fiable avant d’engager une vente ou une discussion.</motion.p>
          <motion.div variants={scaleIn} className="mt-12 rounded-[2rem] bg-gradient-to-br from-[#f4f7f8] to-[#eaeef1] p-7 shadow-xl md:p-12">
            <div className="mb-10 grid gap-6 md:grid-cols-3">{estimationSteps.map((step) => { const Icon = step.icon; return <div key={step.title} className="text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-hover text-white shadow-lg"><Icon size={28} /></div><h3 className="text-lg font-bold text-foreground">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p></div> })}</div>
            <PrimaryLink href="/outils/vendre">Lancer mon estimation gratuite <ArrowRight size={18} /></PrimaryLink><p className="mt-5 text-sm text-muted">Sans engagement · 100% gratuit · Premier résultat en quelques minutes</p>
          </motion.div>
        </motion.div>
      </section>

      <section id="secteur" className="bg-[#f4f7f8] px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-7xl">
          <motion.div variants={fadeInUp} className="mb-14 text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Mon secteur</p><h2 className="text-3xl font-bold tracking-[-0.04em] text-foreground md:text-5xl">Provence Verte & Gorges du Verdon</h2><p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted">Une connaissance du territoire, de Brignoles aux portes du Verdon, pour vendre, acheter ou évaluer dans les meilleures conditions.</p></motion.div>
          <motion.div variants={staggerFast} className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{sectorCards.map(([city, label]) => <motion.div key={city} variants={scaleIn} className="rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"><div className="mb-2 text-2xl font-bold text-brand">{city}</div><p className="text-sm text-muted">{label}</p></motion.div>)}</motion.div>
          <motion.div variants={fadeInUp} className="rounded-[2rem] bg-white p-8 shadow-sm md:p-10"><div className="grid items-center gap-8 lg:grid-cols-[1fr_0.75fr]"><div><h3 className="mb-4 text-2xl font-bold text-foreground">Je couvre également</h3><div className="flex flex-wrap gap-3">{communes.map((commune) => <span key={commune} className="rounded-full bg-[#f4f7f8] px-4 py-2 text-sm font-semibold text-muted">{commune}</span>)}</div></div><div><p className="mb-6 text-lg leading-relaxed text-muted">Votre commune n’apparaît pas ? Contactez-moi pour vérifier si je peux vous accompagner.</p><PrimaryLink href="/contact">Me contacter</PrimaryLink></div></div></motion.div>
        </motion.div>
      </section>

      <section className="relative min-h-[30rem] overflow-hidden px-6 py-20 text-white md:min-h-[36rem]">
        <Image src="/lavandes-proche.jpg" alt="Lavandes en Provence Verte" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101828]/78 via-[#101828]/35 to-transparent" />
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="relative mx-auto flex min-h-[22rem] max-w-7xl items-center">
          <motion.div variants={fadeInUp} className="max-w-2xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand-light">Territoire</p><h2 className="text-3xl font-bold tracking-[-0.04em] md:text-5xl">Des villages, des paysages, des valeurs très différentes.</h2><p className="mt-5 text-lg leading-relaxed text-white/82">C’est ce niveau de lecture locale qui permet de mieux positionner un bien, préparer un achat ou identifier les points à vérifier.</p></motion.div>
        </motion.div>
      </section>

      <section id="services" className="bg-[#f4f7f8] px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-7xl"><motion.div variants={fadeInUp} className="mb-14 text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Mes services</p><h2 className="text-3xl font-bold tracking-[-0.04em] text-foreground md:text-5xl">Un accompagnement sur mesure</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">Que vous souhaitiez vendre, acheter ou simplement vous renseigner, chaque étape doit être claire.</p></motion.div><motion.div variants={staggerFast} className="grid gap-7 md:grid-cols-3">{services.map((service) => { const Icon = service.icon; return <motion.div key={service.title} variants={scaleIn} className="rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-brand"><Icon size={27} /></div><h3 className="text-xl font-bold text-foreground">{service.title}</h3><p className="mt-3 min-h-24 text-sm leading-relaxed text-muted">{service.desc}</p><Link href={service.href} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand transition-all hover:gap-3">{service.cta} <ArrowRight size={15} /></Link></motion.div> })}</motion.div></motion.div>
      </section>

      <section id="pourquoi" className="bg-white px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.9fr]"><motion.div variants={fadeInUp}><p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Pourquoi me choisir</p><h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Un expert local, la force d’un réseau national</h2><p className="mt-6 text-lg leading-relaxed text-muted">Installé en Provence Verte, je connais les nuances du territoire. Cette expertise locale, combinée à la puissance du réseau iad France, vous aide à avancer avec une vision plus juste.</p><div className="mt-9 space-y-6">{reasons.map(([title, desc]) => <div key={title} className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"><ShieldCheck size={22} /></div><div><h3 className="text-lg font-bold text-foreground">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p></div></div>)}</div></motion.div><motion.div variants={staggerFast} className="grid grid-cols-2 gap-5">{[['30+', 'Communes couvertes'], ['iad', 'Réseau immobilier national'], ['7j/7', 'À votre écoute'], ['0€', 'Estimation gratuite']].map(([value, label]) => <motion.div key={label} variants={scaleIn} className="rounded-2xl bg-[#f4f7f8] p-7 text-center"><div className="mb-2 text-4xl font-bold text-brand md:text-5xl">{value}</div><p className="text-sm font-semibold text-muted">{label}</p></motion.div>)}</motion.div></motion.div>
      </section>

      {latestPosts.length > 0 && <section className="bg-[#f4f7f8] px-6 py-20"><motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-7xl"><motion.div variants={fadeInUp} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-brand">Conseils</p><h2 className="text-3xl font-bold tracking-[-0.04em] text-foreground md:text-5xl">Comprendre avant d’agir</h2></div><Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">Voir tous les articles <ArrowRight size={15} /></Link></motion.div><motion.div variants={staggerFast} className="grid gap-5 md:grid-cols-3">{latestPosts.map((post) => <motion.article key={post.slug} variants={scaleIn} className="rounded-2xl bg-white p-6 shadow-sm"><p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-brand">{formatDate(post.publishedAt) || 'Conseil immobilier'}</p><h3 className="text-xl font-bold leading-tight text-foreground"><Link href={'/blog/' + post.slug} className="hover:text-brand">{post.title}</Link></h3><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p><Link href={'/blog/' + post.slug} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">Lire <ArrowRight size={14} /></Link></motion.article>)}</motion.div></motion.div></section>}

      <section className="bg-gradient-to-br from-brand to-brand-hover px-6 py-20"><motion.div variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-4xl text-center"><h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-white md:text-5xl">Prêt à estimer votre bien en Provence Verte ?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/90">Maison, appartement ou terrain : obtenez un premier repère gratuit ou contactez-moi pour parler de votre projet.</p><div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row"><Link href="/outils/vendre" className="rounded-full bg-white px-8 py-4 text-sm font-bold text-brand transition-colors hover:bg-[#f4f7f8]">Estimer mon bien</Link><OutlineLink href="/contact" light>Me contacter</OutlineLink></div></motion.div></section>
      <section id="contact" className="bg-[#101828] px-6 py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr]"><div><Image src="/IAD_LOGO_BLANC.png" alt="iad France" width={150} height={60} className="mb-8 h-12 w-auto object-contain" /><h2 className="text-3xl font-bold text-white md:text-4xl">Parlons de votre projet en Provence Verte</h2><p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">Basé localement, je suis disponible pour vous rencontrer à Brignoles, Saint-Maximin, dans le Verdon ou directement chez vous.</p><div className="mt-8 space-y-4"><a href={'tel:' + PHONE_RAW} className="flex items-center gap-4 text-white/80 transition-colors hover:text-brand"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10"><Phone size={20} /></span><span className="font-semibold">{PHONE_DISPLAY}</span></a><a href={'mailto:' + EMAIL} className="flex items-center gap-4 text-white/80 transition-colors hover:text-brand"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10"><Mail size={20} /></span><span className="font-semibold">{EMAIL}</span></a></div></div><div className="rounded-2xl bg-white/5 p-8"><p className="mb-5 text-xl font-bold text-white">Commencer simplement</p><div className="grid gap-3"><PrimaryLink href="/outils/vendre">Estimer mon bien <ArrowRight size={18} /></PrimaryLink><Link href="/outils/acheter" className="rounded-xl border border-white/15 px-5 py-4 font-semibold text-white/85 transition-colors hover:border-brand hover:text-brand">Préparer mon achat</Link><Link href="/outils/audit" className="rounded-xl border border-white/15 px-5 py-4 font-semibold text-white/85 transition-colors hover:border-brand hover:text-brand">Analyser un bien</Link></div></div></div></section>
    </>
  )
}
