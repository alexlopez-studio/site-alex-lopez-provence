'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, ChevronDown, MapPin, Phone, Star, Check, Clock,
  Home, TrendingUp, Search, Calculator, ClipboardCheck, FileText,
  Award, Eye, Lock, ShieldCheck, MessageCircle, BarChart2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

// Eyebrow partagé (même style que la home)
const EYEBROW = 'text-[13px] font-bold uppercase tracking-[0.22em]'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

const HERO_BACKDROP = '/vignobles-var.jpg'
const CTA_BACKDROP = '/village-cotignac.jpg'

// Réactiver quand de vraies ventes récentes seront fournies par Alexandre.
const SHOW_RECENT_SALES = false

const HERO_STATS = [
  { value: '0\u00a0\u20ac', label: 'estimation' },
  { value: '48\u202fh', label: 'délai réponse' },
  { value: 'iAD', label: 'réseau France' },
]

const HERO_CHIPS = [
  'Réseau iAD France',
  'Estimation gratuite',
  'Disponible 7\u202fj/7',
]

const PROMESSES = [
  { icon: TrendingUp, title: 'Estimation précise', desc: 'Analyse du marché local et expertise patrimoniale.' },
  { icon: Award, title: 'Vente optimisée', desc: 'Stratégie commerciale personnalisée, sur-mesure.' },
  { icon: Lock, title: '100\u202f% confidentiel', desc: 'Transaction sécurisée et accompagnement total.' },
]

const EXPERTISES = [
  {
    icon: Calculator,
    title: 'Estimation immobilière gratuite',
    desc: "\u00c9valuation pr\u00e9cise de votre bien gr\u00e2ce \u00e0 des outils performants, une strat\u00e9gie de positionnement claire et une connaissance approfondie du march\u00e9 en Provence et sur la C\u00f4te d'Azur. Analyse comparative des ventes r\u00e9centes et \u00e9tude personnalis\u00e9e de votre propri\u00e9t\u00e9.",
    chips: ['Gratuit & sans engagement', 'Analyse du marché', 'Rapport détaillé'],
    footer: 'Délai de réponse : 48\u202fh maximum',
  },
  {
    icon: Home,
    title: 'Vente de biens immobiliers',
    desc: 'Stratégie de vente personnalisée adaptée à votre bien et au marché local. Marketing ciblé, visites qualifiées et négociation experte pour obtenir le meilleur prix dans les meilleurs délais. Maisons de village, mas provençaux, villas avec piscine, terrains, programmes neufs.',
    chips: ['Marketing digital', 'Négociation experte', 'Suivi personnalisé'],
    footer: "Accompagnement jusqu'\u00e0 la signature",
  },
  {
    icon: Eye,
    title: 'Qualification des acquéreurs',
    desc: 'Vérification complète des acquéreurs potentiels. Contrôle du financement, visites organisées avec des profils qualifiés, conseil objectif et négociation du prix. Votre vente est sécurisée du premier contact au compromis.',
    chips: ['Profils vérifiés', 'Conseil objectif', 'Négociation prix'],
    footer: 'Réseau iAD France à votre service',
  },
  {
    icon: ClipboardCheck,
    title: 'Accompagnement juridique & administratif',
    desc: "Je pr\u00e9pare l'ensemble du dossier notaire pour la r\u00e9daction du compromis, centralise les documents n\u00e9cessaires et coordonne avec toutes les parties prenantes. Suivi de A \u00e0 Z jusqu'\u00e0 la signature d\u00e9finitive, pour une transaction sereine et sans perte de temps.",
    chips: ['Dossier notaire', 'Coordination notaires', 'Suivi complet'],
    footer: "R\u00e9seau d'experts partenaires",
  },
] as const

const PROCESS = [
  { num: 1, icon: MessageCircle, title: 'Premier contact & échange', desc: "Discussion de votre projet, vos attentes et contraintes. Explication de ma m\u00e9thode et planification de la visite d'expertise dans les 48\u202fh.", chips: ['Gratuit & sans engagement', 'Conseil personnalisé'] },
  { num: 2, icon: Eye, title: 'Visite approfondie du bien', desc: "Inspection d\u00e9taill\u00e9e de votre propri\u00e9t\u00e9 : surface, \u00e9tat g\u00e9n\u00e9ral, \u00e9quipements, exposition, environnement proche et potentiel d'am\u00e9lioration.", chips: ['Analyse technique', "Points d'am\u00e9lioration", 'Visite 60-90\u202fmin'] },
  { num: 3, icon: BarChart2, title: 'Analyse comparative du marché', desc: "Examen des transactions r\u00e9centes dans votre secteur et comparaison avec des biens toujours en vente. L'objectif : positionner votre bien au bon niveau, en \u00e9vitant les erreurs de prix qui bloquent la vente.", chips: ['Données locales', 'Tendances marché', 'Positionnement précis'] },
  { num: 4, icon: FileText, title: 'Estimation précise & rapport', desc: "Calcul du prix de vente optimal bas\u00e9 sur mon expertise et les donn\u00e9es du march\u00e9. Remise d'un rapport d\u00e9taill\u00e9 avec fourchette de prix et recommandations concr\u00e8tes.", chips: ['Expertise patrimoniale', 'Rapport écrit', 'Fourchette précise'] },
  { num: 5, icon: TrendingUp, title: 'Stratégie de mise en vente', desc: 'Définition de la stratégie commerciale : prix de lancement, mise en valeur du bien, planning des visites et campagne marketing ciblée.', chips: ['Home staging conseil', 'Marketing digital', 'Réseau iAD'] },
  { num: 6, icon: ClipboardCheck, title: 'Suivi & finalisation', desc: "Accompagnement jusqu'\u00e0 la signature : n\u00e9gociation, coordination avec les notaires, suivi administratif et conseil post-vente.", chips: ['Négociation experte', 'Suivi notarial', 'Disponible 7\u202fj/7'] },
] as const

const PILIERS = [
  { icon: Award, title: 'Expertise immobilière', desc: "\u00c9valuation rigoureuse et conseils avis\u00e9s gr\u00e2ce \u00e0 des outils d'analyse performants et une m\u00e9thodologie \u00e9prouv\u00e9e." },
  { icon: MapPin, title: 'Connaissance locale', desc: "Parfaite ma\u00eetrise du march\u00e9 en Provence et sur la C\u00f4te d'Azur, et de ses sp\u00e9cificit\u00e9s de quartier." },
  { icon: ShieldCheck, title: 'Transparence totale', desc: "Aucun frais cach\u00e9, estimation gratuite et accompagnement jusqu'au bout." },
] as const

const AVIS = [
  { name: 'Marie & Pierre', text: "Alexandre nous a accompagn\u00e9s avec \u00e9coute et clart\u00e9 du premier contact \u00e0 la signature. Estimation juste, vente rapide et professionnalisme \u00e0 toute \u00e9preuve.", date: '08.2025' },
  { name: 'Sophie L.', text: "Bilan complet avant la mise en vente, conseils pr\u00e9cis pour valoriser la maison. R\u00e9sultat : vendue au prix souhait\u00e9 en moins de 3 mois. Je recommande.", date: '06.2025' },
  { name: 'Jean-Marc R.', text: "Pas de blabla, du concret. Alexandre ma\u00eetrise son sujet et son march\u00e9. Communication impeccable, transaction s\u00e9curis\u00e9e. Que du positif.", date: '04.2025' },
] as const

const FAQ = [
  {
    q: "Comment obtenir une estimation immobili\u00e8re gratuite et fiable en Provence ?",
    a: "Mon estimation gratuite repose sur une analyse approfondie du march\u00e9 local en Provence et sur la C\u00f4te d'Azur : ventes r\u00e9centes comparables, \u00e9tat du bien et du quartier, tendances de march\u00e9 et outils d'analyse performants. Je me d\u00e9place \u00e0 votre domicile sous 48\u202fh et vous restitue un avis de valeur \u00e9crit dans les 48\u202fh suivantes. Sans engagement, sans frais cach\u00e9s.",
  },
  {
    q: "Combien de temps faut-il pour vendre un bien en Provence ou sur la C\u00f4te d'Azur ?",
    a: "Le d\u00e9lai d\u00e9pend du prix de mise sur le march\u00e9, de l'\u00e9tat du bien, du secteur et de la strat\u00e9gie marketing. En moyenne, un bien correctement positionn\u00e9 se vend entre 2 et 5 mois. Les cl\u00e9s : un prix juste d\u00e8s le d\u00e9part, une valorisation soign\u00e9e, du marketing cibl\u00e9 et des visites qualifi\u00e9es.",
  },
  {
    q: "Quels sont les frais \u00e0 pr\u00e9voir lors de la vente d'un bien ?",
    a: "C\u00f4t\u00e9 vendeur, les principaux frais \u00e0 anticiper sont : les diagnostics techniques obligatoires (DPE, \u00e9lectricit\u00e9, gaz, plomb, amiante, termites selon zone), l'\u00e9ventuelle plus-value immobili\u00e8re, et les honoraires du conseiller. Pas de frais cach\u00e9s : vous savez tout d\u00e8s le premier rendez-vous.",
  },
  {
    q: "Quels avantages d'un mandataire iAD plut\u00f4t qu'une agence traditionnelle ?",
    a: "Le r\u00e9seau iAD compte plus de 18\u202f000 conseillers en France et \u00e0 l'international, avec des outils digitaux performants et une couverture nationale. Avantages : disponibilit\u00e9 7\u202fj/7, accompagnement personnalis\u00e9, honoraires optimis\u00e9s (pas de frais de structure d'agence), expertise locale et formation continue.",
  },
  {
    q: 'Comment se déroule la signature chez le notaire ?',
    a: "Une fois le compromis sign\u00e9, le notaire dispose d'environ 2 \u00e0 3 mois pour v\u00e9rifier les pi\u00e8ces (titre de propri\u00e9t\u00e9, urbanisme, hypoth\u00e8ques, etc.) et pr\u00e9parer l'acte authentique. Je coordonne les \u00e9changes entre vous, l'acqu\u00e9reur et les notaires pour que tout soit pr\u00eat \u00e0 temps. La signature de l'acte d\u00e9finitif officialise la vente.",
  },
  {
    q: 'Faut-il faire un home staging avant la vente ?',
    a: "Pas syst\u00e9matiquement, mais quelques gestes simples augmentent fortement l'attractivit\u00e9 : d\u00e9sencombrer, d\u00e9personnaliser, soigner la lumi\u00e8re, rafra\u00eechir les peintures ab\u00eem\u00e9es, mettre en valeur les ext\u00e9rieurs. Je vous donne mes recommandations pr\u00e9cises lors de la visite d'expertise, adapt\u00e9es \u00e0 votre bien et \u00e0 votre budget.",
  },
] as const

export default function VendrePageContent() {
  const calcomUrl = env.app.calcomUrl

  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden" aria-label="Hero Vendre">
        <Image src={HERO_BACKDROP} alt="Paysage de vignobles en Provence" fill priority
          sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/70 to-foreground/55" />

        <motion.div variants={stagger} initial="initial" animate="animate"
          className="relative max-w-[75rem] mx-auto w-full px-6 py-32 md:py-40 text-white">
          <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand-light mb-5'}>
            Provence et Côte d&rsquo;Azur
          </motion.p>
          <motion.h1 variants={fadeInUp}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-[-0.02em] max-w-4xl mb-8">
            Estimer et vendre votre bien <span className="italic text-brand-light">en toute sérénité.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-white/85 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
            Je m&rsquo;appuie sur une analyse fine du marché local et une véritable stratégie de positionnement pour valoriser votre bien, optimiser sa commercialisation et vous accompagner jusqu&rsquo;à la signature.
          </motion.p>

          <motion.div variants={stagger} className="grid grid-cols-3 gap-6 max-w-xl mb-10 py-6 border-y border-white/20">
            {HERO_STATS.map((s) => (
              <motion.div key={s.label} variants={scaleIn}>
                <p className="font-serif text-3xl md:text-4xl font-semibold text-brand-light leading-none">{s.value}</p>
                <p className="text-xs text-white/75 mt-2 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button asChild size="lg" variant="primary">
              <Link href={calcomUrl} target="_blank" rel="noopener noreferrer">
                Prendre rendez-vous <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="!border-white/40 !text-white hover:!bg-white hover:!text-foreground">
              <Link href="/contact">Me contacter</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
            {HERO_CHIPS.map((chip) => (
              <span key={chip} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/25 text-xs font-semibold text-white backdrop-blur-sm">
                <Check size={13} className="text-brand-light" />
                {chip}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== 2. PROMESSES (3 cards) ===== */}
      <motion.section variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
        className="py-14 px-6 bg-white border-b border-border">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROMESSES.map((p) => {
            const Icon = p.icon
            return (
              <motion.div key={p.title} variants={scaleIn}
                className="flex items-start gap-4 p-5 rounded-2xl bg-surface border border-border">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center">
                  <Icon size={20} className="text-brand" />
                </div>
                <div>
                  <p className="font-serif text-lg font-semibold text-foreground mb-1">{p.title}</p>
                  <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* ===== 3. EXPERTISE (4 grosses cards) ===== */}
      <section className="py-28 px-6 paper-surface">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Mon expertise immobilière</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
              Un accompagnement <span className="italic text-brand">personnalisé</span>
            </h2>
            <p className="text-muted leading-relaxed text-lg">Pour tous vos projets de vente immobilière en Provence et sur la Côte d&rsquo;Azur.</p>
          </motion.div>
          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EXPERTISES.map((e) => {
              const Icon = e.icon
              return (
                <motion.article key={e.title} variants={scaleIn}
                  className="flex flex-col rounded-2xl bg-white border border-border p-8 hover:shadow-md hover:border-brand/40 transition-all duration-200">
                  <div className="w-14 h-14 rounded-xl bg-brand-light flex items-center justify-center mb-6">
                    <Icon size={24} className="text-brand" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 leading-tight">{e.title}</h3>
                  <p className="text-muted leading-relaxed mb-6 flex-1">{e.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {e.chips.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium text-foreground">
                        <Check size={11} className="text-brand" />
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-brand uppercase tracking-wider pt-4 border-t border-border">{e.footer}</p>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== 4. VENTES RÉCENTES — MASQUÉE (drapeau SHOW_RECENT_SALES) ===== */}
      {SHOW_RECENT_SALES && (
        <section className="py-28 px-6 bg-white">
          <div className="max-w-[75rem] mx-auto">
            <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14">
              <p className={EYEBROW + ' text-brand mb-4'}>Mes ventes récentes</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
                Quelques <span className="italic text-brand">réussites</span>
              </h2>
            </motion.div>
            <p className="text-center text-muted">À venir.</p>
          </div>
        </section>
      )}

      {/* ===== 5. PROCESSUS EN 6 ÉTAPES ===== */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Mon processus</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
              Une méthode <span className="italic text-brand">en 6 étapes</span>
            </h2>
            <p className="text-muted leading-relaxed text-lg">Une approche éprouvée qui garantit l&rsquo;estimation la plus juste et la stratégie de vente optimale pour votre bien.</p>
          </motion.div>
          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROCESS.map((step) => {
              const Icon = step.icon
              return (
                <motion.article key={step.num} variants={scaleIn}
                  className="relative flex flex-col rounded-2xl bg-surface border border-border p-7 hover:shadow-md hover:border-brand/40 transition-all duration-200">
                  <span className="absolute top-5 right-5 font-serif text-5xl font-medium text-brand/20 leading-none">{step.num.toString().padStart(2, '0')}</span>
                  <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center mb-5">
                    <Icon size={20} className="text-brand" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3 leading-tight pr-12">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-5 flex-1">{step.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.chips.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-border text-[11px] font-medium text-foreground">
                        <Check size={10} className="text-brand" />
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== 6. POURQUOI ÇA FONCTIONNE (3 piliers) ===== */}
      <section className="py-28 px-6 paper-surface">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Pourquoi ça fonctionne</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
              Les clés de mon <span className="italic text-brand">approche</span>
            </h2>
          </motion.div>
          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PILIERS.map((pi) => {
              const Icon = pi.icon
              return (
                <motion.div key={pi.title} variants={scaleIn}
                  className="text-center p-8 rounded-2xl bg-white border border-border">
                  <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
                    <Icon size={22} className="text-brand" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{pi.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{pi.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== 7. TÉMOIGNAGES ===== */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Ils ont vendu avec succès</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
              Des clients <span className="italic text-brand">qui recommandent</span>
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AVIS.map((a) => (
              <motion.div key={a.name} variants={scaleIn}
                className="p-8 rounded-2xl border border-border bg-surface flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-accent fill-accent" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-brand bg-brand-light px-2 py-0.5 rounded-full uppercase tracking-[0.15em]">Vente</span>
                </div>
                <p className="font-serif text-lg italic text-foreground leading-relaxed flex-1 mb-5">« {a.text} »</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-foreground">— {a.name}</p>
                  <p className="text-xs text-muted">{a.date}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 8. FAQ ===== */}
      <section className="py-28 px-6 paper-surface">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14">
            <p className={EYEBROW + ' text-brand mb-4'}>Questions fréquentes</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
              Tout ce qu&rsquo;il faut <span className="italic text-brand">savoir</span>
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="space-y-3">
            {FAQ.map((item) => (
              <motion.details key={item.q} variants={fadeInUp}
                className="group rounded-2xl border border-border bg-white overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-foreground hover:text-brand transition-colors">
                  <span className="pr-6">{item.q}</span>
                  <ChevronDown size={18} className="text-muted shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-sm text-muted leading-relaxed">{item.a}</div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 9. CTA FINAL ===== */}
      <section className="relative py-28 px-6 overflow-hidden">
        <Image src={CTA_BACKDROP} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/75 to-foreground/55" />
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
          className="relative max-w-3xl mx-auto text-center text-white">
          <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand-light mb-4'}>Une question sur votre projet ?</motion.p>
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-[-0.02em] mb-6">
            Parlons de votre <span className="italic text-brand-light">bien.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/85 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Contactez-moi pour un conseil personnalisé et une réponse adaptée à votre situation. Estimation gratuite, sans engagement, sous 48\u202fh.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" variant="primary">
              <Link href={calcomUrl} target="_blank" rel="noopener noreferrer">
                Prendre rendez-vous <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="!border-white/40 !text-white hover:!bg-white hover:!text-foreground">
              <Link href="/contact">Me contacter</Link>
            </Button>
          </motion.div>
          <motion.a variants={fadeInUp} href={'tel:' + PHONE_RAW}
            className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-white/85 hover:text-white transition-colors">
            <Phone size={14} className="text-brand-light" />
            {PHONE_DISPLAY}
          </motion.a>
        </motion.div>
      </section>
    </>
  )
}
