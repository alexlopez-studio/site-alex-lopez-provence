'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, ChevronDown, MapPin, Phone, Star, Check,
  Home, TrendingUp, Calculator, ClipboardCheck, FileText,
  Award, Eye, Lock, ShieldCheck, MessageCircle, BarChart2, Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const EYEBROW = 'text-[13px] font-bold uppercase tracking-[0.22em]'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

// PLACEHOLDER : photo a remplacer par un visuel Pixabay representatif d'une vente immobiliere
// (cles, poignee de main, signature de contrat). En attendant, maison-bleue-cotignac evoque
// le bien immobilier.
const HERO_PHOTO = '/maison-bleue-cotignac.jpg'
const CTA_BACKDROP = '/village-cotignac.jpg'

const SHOW_RECENT_SALES = false

const HERO_CHIPS = [
  'Réseau iAD France',
  'Estimation gratuite',
  'Disponible 7 j/7',
]

const PROMESSES = [
  { icon: TrendingUp, title: 'Estimation précise', desc: 'Analyse du marché local et expertise patrimoniale.' },
  { icon: Award, title: 'Vente optimisée', desc: 'Stratégie commerciale personnalisée, sur-mesure.' },
  { icon: Lock, title: '100 % confidentiel', desc: 'Transaction sécurisée et accompagnement total.' },
]

const EXPERTISES = [
  {
    icon: Calculator,
    title: 'Estimation immobilière gratuite',
    desc: "Évaluation précise de votre bien grâce à des outils performants, une stratégie de positionnement claire et une connaissance approfondie du marché en Provence et sur la Côte d'Azur. Analyse comparative des ventes récentes et étude personnalisée de votre propriété.",
    chips: ['Gratuit & sans engagement', 'Analyse du marché', 'Rapport détaillé'],
    footer: 'Délai de réponse : 48 h maximum',
  },
  {
    icon: Home,
    title: 'Vente de biens immobiliers',
    desc: 'Stratégie de vente personnalisée adaptée à votre bien et au marché local. Marketing ciblé, visites qualifiées et négociation experte pour obtenir le meilleur prix dans les meilleurs délais. Maisons de village, mas provençaux, villas avec piscine, terrains, programmes neufs.',
    chips: ['Marketing digital', 'Négociation experte', 'Suivi personnalisé'],
    footer: "Accompagnement jusqu'à la signature",
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
    desc: "Je prépare l'ensemble du dossier notaire pour la rédaction du compromis, centralise les documents nécessaires et coordonne avec toutes les parties prenantes. Suivi de A à Z jusqu'à la signature définitive, pour une transaction sereine et sans perte de temps.",
    chips: ['Dossier notaire', 'Coordination notaires', 'Suivi complet'],
    footer: "Réseau d'experts partenaires",
  },
] as const

const PROCESS = [
  { num: 1, icon: MessageCircle, title: 'Premier contact', desc: "Échange sur votre projet et planification de la visite d'expertise sous 48 h." },
  { num: 2, icon: Eye, title: 'Visite du bien', desc: "Inspection détaillée : surface, état, équipements, environnement, potentiel." },
  { num: 3, icon: BarChart2, title: 'Analyse marché', desc: "Comparaison des transactions récentes et positionnement précis de votre bien." },
  { num: 4, icon: FileText, title: 'Estimation & rapport', desc: "Prix optimal calculé, rapport écrit avec fourchette et recommandations." },
  { num: 5, icon: TrendingUp, title: 'Mise en vente', desc: "Marketing ciblé, mise en valeur du bien, planning des visites qualifiées." },
  { num: 6, icon: ClipboardCheck, title: 'Signature', desc: "Négociation, coordination notaires et accompagnement jusqu'à l'acte définitif." },
] as const

const PILIERS = [
  { icon: Award, title: 'Expertise immobilière', desc: "Évaluation rigoureuse et conseils avisés grâce à des outils d'analyse performants et une méthodologie éprouvée." },
  { icon: MapPin, title: 'Connaissance locale', desc: "Parfaite maîtrise du marché en Provence et sur la Côte d'Azur, et de ses spécificités de quartier." },
  { icon: ShieldCheck, title: 'Transparence totale', desc: "Aucun frais caché, estimation gratuite et accompagnement jusqu'au bout." },
] as const

const AVIS = [
  { name: 'Marie & Pierre', text: "Alexandre nous a accompagnés avec écoute et clarté du premier contact à la signature. Estimation juste, vente rapide et professionnalisme à toute épreuve.", date: '08.2025' },
  { name: 'Sophie L.', text: "Bilan complet avant la mise en vente, conseils précis pour valoriser la maison. Résultat : vendue au prix souhaité en moins de 3 mois. Je recommande.", date: '06.2025' },
  { name: 'Jean-Marc R.', text: "Pas de blabla, du concret. Alexandre maîtrise son sujet et son marché. Communication impeccable, transaction sécurisée. Que du positif.", date: '04.2025' },
] as const

const FAQ = [
  {
    q: "Comment obtenir une estimation immobilière gratuite et fiable en Provence ?",
    a: "Mon estimation gratuite repose sur une analyse approfondie du marché local en Provence et sur la Côte d'Azur : ventes récentes comparables, état du bien et du quartier, tendances de marché et outils d'analyse performants. Je me déplace à votre domicile sous 48 h et vous restitue un avis de valeur écrit dans les 48 h suivantes. Sans engagement, sans frais cachés.",
  },
  {
    q: "Combien de temps faut-il pour vendre un bien en Provence ou sur la Côte d'Azur ?",
    a: "Le délai dépend du prix de mise sur le marché, de l'état du bien, du secteur et de la stratégie marketing. En moyenne, un bien correctement positionné se vend entre 2 et 5 mois. Les clés : un prix juste dès le départ, une valorisation soignée, du marketing ciblé et des visites qualifiées.",
  },
  {
    q: "Quels sont les frais à prévoir lors de la vente d'un bien ?",
    a: "Côté vendeur, les principaux frais à anticiper sont : les diagnostics techniques obligatoires (DPE, électricité, gaz, plomb, amiante, termites selon zone), l'éventuelle plus-value immobilière, et les honoraires du conseiller. Pas de frais cachés : vous savez tout dès le premier rendez-vous.",
  },
  {
    q: "Quels avantages d'un mandataire iAD plutôt qu'une agence traditionnelle ?",
    a: "Le réseau iAD compte plus de 18 000 conseillers en France et à l'international, avec des outils digitaux performants et une couverture nationale. Avantages : disponibilité 7 j/7, accompagnement personnalisé, honoraires optimisés (pas de frais de structure d'agence), expertise locale et formation continue.",
  },
  {
    q: 'Comment se déroule la signature chez le notaire ?',
    a: "Une fois le compromis signé, le notaire dispose d'environ 2 à 3 mois pour vérifier les pièces (titre de propriété, urbanisme, hypothèques, etc.) et préparer l'acte authentique. Je coordonne les échanges entre vous, l'acquéreur et les notaires pour que tout soit prêt à temps. La signature de l'acte définitif officialise la vente.",
  },
  {
    q: 'Faut-il faire un home staging avant la vente ?',
    a: "Pas systématiquement, mais quelques gestes simples augmentent fortement l'attractivité : désencombrer, dépersonnaliser, soigner la lumière, rafraîchir les peintures abîmées, mettre en valeur les extérieurs. Je vous donne mes recommandations précises lors de la visite d'expertise, adaptées à votre bien et à votre budget.",
  },
] as const

// Animations cartes flottantes (meme pattern que la home)
const floatingCardInitial = { opacity: 0, x: -20, y: 20 }
const floatingCardAnimate = { opacity: 1, x: 0, y: 0 }
const floatingCardTransition = { delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }

const badgeInitial = { opacity: 0, scale: 0.8 }
const badgeAnimate = { opacity: 1, scale: 1 }
const badgeTransitionTopRight = { delay: 0.85, duration: 0.4 }
const badgeTransitionBottomRight = { delay: 1.05, duration: 0.4 }

const floatLoopA = { y: [0, -10, 0] }
const floatLoopATransition = { duration: 4.2, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.4 }
const floatLoopB = { y: [0, -7, 0] }
const floatLoopBTransition = { duration: 3.6, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.8 }
const floatLoopC = { y: [0, -8, 0] }
const floatLoopCTransition = { duration: 4.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 2.0 }

// Hover frise: lift + spring
const stepHover = { y: -8 }
const stepHoverTransition = { type: 'spring' as const, stiffness: 300, damping: 20 }

export default function VendrePageContent() {
  const calcomUrl = env.app.calcomUrl

  return (
    <>
      {/* ===== 1. HERO (split + photo encadree + 3 cartes flottantes) ===== */}
      <section className="relative paper-surface pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden" aria-label="Hero Vendre">
        <div className="max-w-[75rem] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">

          {/* Bloc texte */}
          <motion.div variants={stagger} initial="initial" animate="animate" className="order-2 lg:order-1">
            <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand mb-5'}>
              Provence et Côte d&rsquo;Azur
            </motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-[-0.02em] text-foreground mb-6">
              Estimer et vendre votre bien <span className="italic text-brand">en toute sérénité.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-muted text-lg leading-relaxed mb-10 max-w-xl">
              Je m&rsquo;appuie sur une analyse fine du marché local et une véritable stratégie de positionnement pour valoriser votre bien, optimiser sa commercialisation et vous accompagner jusqu&rsquo;à la signature.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" variant="primary">
                <Link href={calcomUrl} target="_blank" rel="noopener noreferrer">
                  Prendre rendez-vous <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Me contacter</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Photo encadree + 3 cartes flottantes */}
          <div className="relative order-1 lg:order-2 max-w-md w-full mx-auto lg:mx-0 lg:ml-auto">
            <motion.div
              variants={scaleIn}
              initial="initial"
              animate="animate"
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-xl bg-surface"
            >
              <Image
                src={HERO_PHOTO}
                alt="Maison à vendre en Provence"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                priority
                className="object-cover"
              />
            </motion.div>

            {/* Carte flottante Reseau iAD France (bottom-left) */}
            <motion.div
              initial={floatingCardInitial}
              animate={floatingCardAnimate}
              transition={floatingCardTransition}
              className="absolute -bottom-6 -left-4 sm:-left-8 z-20"
            >
              <motion.div
                animate={floatLoopA}
                transition={floatLoopATransition}
                className="bg-white rounded-2xl shadow-xl px-5 py-4 w-56 border border-border flex items-center gap-3"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-dark flex items-center justify-center p-2">
                  <Image src="/IAD_LOGO_BLANC.png" alt="" width={120} height={88} className="h-full w-auto" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-[0.16em] mb-0.5">Réseau</p>
                  <p className="font-serif text-base font-semibold text-foreground leading-tight">iAD France</p>
                  <p className="text-[11px] text-muted mt-0.5">+18 000 conseillers</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Badge Estimation gratuite (top-right) */}
            <motion.div
              initial={badgeInitial}
              animate={badgeAnimate}
              transition={badgeTransitionTopRight}
              className="absolute -top-4 -right-3 sm:-right-6 z-20"
            >
              <motion.div
                animate={floatLoopB}
                transition={floatLoopBTransition}
                className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2.5 border border-border"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
                  <Calculator size={16} className="text-brand" />
                </div>
                <div>
                  <p className="font-serif text-base font-semibold text-foreground leading-none">0 €</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Estimation</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Badge Disponible 7j/7 (right milieu) */}
            <motion.div
              initial={badgeInitial}
              animate={badgeAnimate}
              transition={badgeTransitionBottomRight}
              className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 z-20"
            >
              <motion.div
                animate={floatLoopC}
                transition={floatLoopCTransition}
                className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2.5 border border-border"
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
                  <Calendar size={16} className="text-brand" />
                </div>
                <div>
                  <p className="font-serif text-base font-semibold text-foreground leading-none">7 j/7</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Disponible</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Chips deplacees sous le hero */}
        <div className="max-w-[75rem] mx-auto px-6 mt-16 lg:mt-20 flex flex-wrap justify-center gap-3">
          {HERO_CHIPS.map((chip) => (
            <span key={chip} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-xs font-semibold text-foreground shadow-sm">
              <Check size={13} className="text-brand" />
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* ===== 2. PROMESSES ===== */}
      <motion.section variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
        className="py-14 px-6 bg-white border-y border-border">
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

      {/* ===== 3. EXPERTISE ===== */}
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

      {/* ===== 4. VENTES RECENTES (masquees) ===== */}
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

      {/* ===== 5. PROCESSUS - FRISE HORIZONTALE 6 ETAPES + HOVER ===== */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-[80rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-16 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Mon processus</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
              Une méthode <span className="italic text-brand">en 6 étapes</span>
            </h2>
            <p className="text-muted leading-relaxed text-lg">De la prise de contact à la signature, voici le chemin que nous parcourrons ensemble.</p>
          </motion.div>

          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="hidden md:block absolute left-0 right-0 top-12 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent z-0"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-3 relative z-10">
              {PROCESS.map((step) => {
                const Icon = step.icon
                return (
                  <motion.article
                    key={step.num}
                    variants={scaleIn}
                    whileHover={stepHover}
                    transition={stepHoverTransition}
                    className="group flex flex-col items-center text-center px-2 cursor-pointer"
                  >
                    <div className="relative w-24 h-24 rounded-full bg-white border-2 border-brand flex flex-col items-center justify-center shadow-md mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:shadow-xl group-hover:shadow-brand/30">
                      <Icon size={20} className="text-brand transition-colors duration-300 group-hover:text-white" />
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider mt-1 transition-colors duration-300 group-hover:text-white">
                        Étape {step.num.toString().padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="font-serif text-base lg:text-[15px] font-semibold text-foreground mb-2 leading-tight transition-colors duration-300 group-hover:text-brand">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.article>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 6. POURQUOI CA FONCTIONNE ===== */}
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

      {/* ===== 7. TEMOIGNAGES ===== */}
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
                <p className="font-serif text-lg italic text-foreground leading-relaxed flex-1 mb-5">« {a.text} »</p>
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
          <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand-light mb-4'}>Une question sur votre projet ?</motion.p>
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-[-0.02em] mb-6">
            Parlons de votre <span className="italic text-brand-light">bien.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/85 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Contactez-moi pour un conseil personnalisé et une réponse adaptée à votre situation. Estimation gratuite, sans engagement, sous 48 h.
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
