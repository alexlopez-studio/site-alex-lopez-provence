'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, ChevronDown, MapPin, Phone, Star, Check,
  Search, Eye, TrendingUp, Award, ShieldCheck, MessageCircle,
  ClipboardCheck, Compass, Calendar, ExternalLink, Building2, Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const EYEBROW = 'text-[13px] font-bold uppercase tracking-[0.22em]'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

// URL de la page iAD officielle d'Alexandre Lopez. Source de verite : env.ts (deja branche).
const IAD_OFFICIAL_URL = 'https://www.iadfrance.fr/conseiller-immobilier/alexandre.lopez'

// PLACEHOLDER : photo a remplacer par un visuel Pixabay representatif d'un acheteur
// (cles de maison, visite, poignee de main).
const HERO_PHOTO = '/maison-bleue-cotignac.jpg'
const CTA_BACKDROP = '/gorges-du-verdon.jpg'
const IAD_BACKDROP = '/tonic-pics-france-3234611_1920.jpg'

const HERO_CHIPS = [
  'Réseau iAD France',
  'Recherche ciblée',
  'Disponible 7 j/7',
]

const PROMESSES = [
  { icon: Search, title: 'Recherche ciblée', desc: 'Sélection personnalisée selon vos critères exacts et votre budget.' },
  { icon: Eye, title: 'Visites organisées', desc: 'Planning optimisé et accompagnement expert sur place.' },
  { icon: Award, title: 'Négociation experte', desc: 'Défense de vos intérêts pour obtenir le meilleur prix.' },
]

const EXPERTISES = [
  {
    icon: Search,
    title: 'Recherche ciblée & sélection',
    desc: "Recherche active de biens correspondant exactement à vos critères et à votre budget. Accès privilégié aux nouvelles annonces via le réseau iAD France et présélection des opportunités les plus intéressantes pour vous, en Provence et sur la Côte d'Azur.",
    chips: ['Recherche personnalisée', 'Accès privilégié', 'Présélection experte'],
    footer: 'Alertes nouvelles opportunités',
  },
  {
    icon: Eye,
    title: 'Organisation & accompagnement visites',
    desc: 'Planification optimisée des visites selon vos disponibilités. Accompagnement personnalisé avec analyse technique du bien, de son quartier et de son potentiel. Conseil objectif sur chaque propriété visitée.',
    chips: ['Planning optimisé', 'Analyse technique', 'Conseil objectif'],
    footer: 'Disponible week-ends inclus',
  },
  {
    icon: TrendingUp,
    title: 'Négociation & analyse de prix',
    desc: "Évaluation précise de la valeur du bien et de sa marge de négociation. Stratégie de négociation adaptée au marché local et au profil du vendeur. Défense de vos intérêts pour obtenir le meilleur prix d'achat.",
    chips: ['Analyse de valeur', 'Stratégie négociation', 'Défense intérêts'],
    footer: 'Connaissance fine du marché local',
  },
] as const

const PROCESS = [
  { num: 1, icon: MessageCircle, title: 'Premier contact', desc: "Échange sur votre projet, qualification de votre recherche et capacité d'achat." },
  { num: 2, icon: Compass, title: 'Définition critères', desc: 'Cahier des charges précis : zone, surface, budget, contraintes, prioritiés.' },
  { num: 3, icon: Search, title: 'Recherche & présélection', desc: 'Accès réseau iAD, sélection des biens pertinents, alertes opportunités.' },
  { num: 4, icon: Eye, title: 'Visites accompagnées', desc: 'Planning optimisé, analyse technique et environnementale de chaque bien.' },
  { num: 5, icon: TrendingUp, title: 'Négociation', desc: 'Stratégie d’offre, défense de vos intérêts, accompagnement réflexion.' },
  { num: 6, icon: ClipboardCheck, title: 'Signature', desc: 'Coordination compromis, suivi notaire et accompagnement remise des clés.' },
] as const

const IAD_STATS = [
  { value: '18 000', label: 'Conseillers actifs', sub: 'dans 8 pays' },
  { value: '50 200', label: 'Ventes 2024', sub: 'record français' },
  { value: '17', label: 'Années', sub: 'depuis 2008' },
  { value: '4,9 / 5', label: 'Satisfaction', sub: 'note moyenne' },
] as const

const IAD_BULLETS = [
  'Expertise partagée : accès aux compétences de 18 000 conseillers dans 8 pays.',
  'Réseau étendu : base de données commune avec des milliers de biens.',
  'Double accompagnement possible : deux conseillers sur un même dossier.',
  'Réactivité renforcée : couverture géographique optimale en Provence et Côte d’Azur.',
  'Négociation experte : force de frappe collective au service de vos intérêts.',
] as const

const AVIS = [
  { name: 'Christopher D.', text: "Alexandre a été présent du début à la fin, de la recherche du logement qui nous correspondait jusqu'à la signature chez le notaire. Il a su nous rassurer, nous accompagner et nous mettre en relation avec les bonnes personnes.", date: '12.2024' },
  { name: 'Charlotte H.', text: 'Alexandre a su trouver LA maison qui correspondait à tous nos critères. Disponible, réactif, il est venu dès qu’on en a eu besoin. On a été confiants tout au long de la procédure.', date: '12.2024' },
  { name: 'Céline C.', text: "Un conseiller top : disponible, humain et sérieux, qui écoute nos besoins et nos attentes pour offrir un accompagnement de grande qualité. Réactivité et professionnalisme au rendez-vous.", date: '08.2025' },
] as const

const FAQ = [
  {
    q: "Quels sont les meilleurs secteurs pour acheter en Provence et sur la Côte d'Azur ?",
    a: "La Provence Verte (Cotignac, Carcès, Saint-Maximin, Brignoles) offre un cadre authentique avec un excellent rapport qualité/prix. Le Haut-Var (Verdon, Aups) est privilégié pour le calme et la nature. La Côte d'Azur (Saint-Raphaël, Fréjus, arrière-pays niccarrois) cible plutôt la résidence secondaire et la proximité mer. Mon rôle : vous orienter selon votre budget, votre composition familiale et vos priorités (écoles, transports, calme, mer).",
  },
  {
    q: "Comment bien négocier le prix d'achat d'un bien ?",
    a: "La négociation repose sur une analyse précise du marché local et une stratégie adaptée au contexte. Ma méthode : comparaison des prix récents dans le secteur, évaluation des défauts ou travaux à prévoir, étude du temps sur le marché, profil du vendeur, stratégie d'offre progressive. Je défends vos intérêts tout en maintenant une relation constructive avec le vendeur.",
  },
  {
    q: 'Faut-il visiter plusieurs biens avant de se décider ?',
    a: "Oui, mais sans surenchere d'offres. Une dizaine de visites bien ciblées vaut mieux que cinquante visites au hasard. C'est pour cela que je qualifie précisément vos critères en amont : on n'aligne que des biens vraiment compatibles avec votre projet. Ça vous fait gagner du temps et ça vous évite la confusion.",
  },
  {
    q: 'Comment se déroule la signature chez le notaire pour un acheteur ?',
    a: "Une fois votre offre acceptée, le compromis de vente est signé (généralement chez le notaire). Vous disposez d'un délai légal de réflexion de 10 jours. Le notaire dispose ensuite de 2 à 3 mois pour vérifier les pièces (titre de propriété, urbanisme, servitudes, copropriété si applicable) et préparer l'acte authentique. Je coordonne tous les échanges pour que vous receviez les clés sereinement.",
  },
  {
    q: 'Quels sont les frais réels à prévoir lors d’un achat ?',
    a: "Au-delà du prix du bien, anticipez : frais de notaire (environ 7 à 8 % dans l'ancien, 2 à 3 % dans le neuf), frais de garantie bancaire si prêt, éventuels travaux de remise au goût, taxe foncière et charges. Je vous fournis une estimation chiffrée dès la première visite pour que vous ayez une vision complète de votre engagement financier.",
  },
] as const

// === Animations cartes flottantes (meme pattern que /vendre)
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

const stepHover = { y: -8 }
const stepHoverTransition = { type: 'spring' as const, stiffness: 300, damping: 20 }

export default function AcheterPageContent() {
  const calcomUrl = env.app.calcomUrl

  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="relative paper-surface pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden" aria-label="Hero Acheter">
        <div className="max-w-[75rem] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">

          <motion.div variants={stagger} initial="initial" animate="animate" className="order-2 lg:order-1">
            <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand mb-5'}>
              Provence et Côte d&rsquo;Azur
            </motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-[-0.02em] text-foreground mb-6">
              Trouvez le bien immobilier <span className="italic text-brand">de vos rêves.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-muted text-lg leading-relaxed mb-10 max-w-xl">
              Conseiller iAD en Provence et sur la Côte d&rsquo;Azur, je vous accompagne sur l&rsquo;ensemble du parcours d&rsquo;achat : recherche ciblée, visites accompagnées, négociation experte et signature sécurisée.
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

          {/* Photo + 3 cartes flottantes */}
          <div className="relative order-1 lg:order-2 max-w-md w-full mx-auto lg:mx-0 lg:ml-auto">
            <motion.div
              variants={scaleIn}
              initial="initial"
              animate="animate"
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-xl bg-surface"
            >
              <Image
                src={HERO_PHOTO}
                alt="Bien immobilier en Provence"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                priority
                className="object-cover"
              />
            </motion.div>

            {/* Carte Réseau iAD France (bottom-left) */}
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

            {/* Badge Recherche ciblée (top-right) */}
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
                  <Search size={16} className="text-brand" />
                </div>
                <div>
                  <p className="font-serif text-base font-semibold text-foreground leading-none">Ciblé</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Sur-mesure</p>
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

      {/* ===== 3. EXPERTISE (3 grosses cards) ===== */}
      <section className="py-28 px-6 paper-surface">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Mon expertise</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
              Un accompagnement <span className="italic text-brand">complet</span>
            </h2>
            <p className="text-muted leading-relaxed text-lg">De la recherche à la signature, sur tous les types de biens en Provence et sur la Côte d&rsquo;Azur.</p>
          </motion.div>
          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

      {/* ===== 4. BLOC iAD OFFICIEL (redirection page iAD) ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        <Image src={IAD_BACKDROP} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand/85" />
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
          className="relative max-w-[75rem] mx-auto text-white">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">

            <div>
              <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand-light mb-4'}>Mes biens disponibles</motion.p>
              <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-[-0.02em] mb-6">
                Tous mes biens, <span className="italic text-brand-light">en direct sur iAD</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-white/85 text-lg leading-relaxed mb-8 max-w-xl">
                Retrouvez l&rsquo;ensemble des biens immobiliers que je propose actuellement à la vente sur ma page officielle iAD France. Photos, descriptifs, prix et contact direct — tout y est centralisé et mis à jour quotidiennement.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" variant="primary" className="!bg-white !text-brand-dark hover:!bg-white/90">
                  <Link href={IAD_OFFICIAL_URL} target="_blank" rel="noopener noreferrer">
                    Voir tous mes biens <ExternalLink size={16} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="!border-white/40 !text-white hover:!bg-white hover:!text-foreground">
                  <Link href="/contact">Discuter de mon projet</Link>
                </Button>
              </motion.div>
            </div>

            {/* Mini card iAD avec logo */}
            <motion.div variants={scaleIn} className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-7 shadow-2xl">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/20">
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center p-2">
                    <Image src="/IAD_LOGO_BLANC.png" alt="iAD" width={120} height={88} className="h-full w-auto" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 mb-1">Conseiller référencé</p>
                    <p className="font-serif text-lg font-semibold text-white">Alexandre Lopez</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-white/85">
                    <Building2 size={14} className="text-brand-light shrink-0" />
                    <span>Profil officiel iAD France</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/85">
                    <Home size={14} className="text-brand-light shrink-0" />
                    <span>Biens en vente actualisés</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/85">
                    <ShieldCheck size={14} className="text-brand-light shrink-0" />
                    <span>Annonces vérifiées et certifiées</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ===== 5. PROCESSUS - FRISE HORIZONTALE 6 ETAPES + HOVER ===== */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-[80rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-16 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Votre parcours d&rsquo;achat</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
              Une méthode <span className="italic text-brand">en 6 étapes</span>
            </h2>
            <p className="text-muted leading-relaxed text-lg">De la prise de contact à la remise des clés, voici le chemin que nous parcourrons ensemble.</p>
          </motion.div>

          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce} className="relative">
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

      {/* ===== 6. FORCE DU RESEAU iAD ===== */}
      <section className="py-28 px-6 paper-surface">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>L&rsquo;esprit de collaboration</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
              La force du réseau, <span className="italic text-brand">au service de votre projet</span>
            </h2>
            <p className="text-muted leading-relaxed text-lg">
              Depuis 17 ans, iAD révolutionne l&rsquo;immobilier grâce à un modèle basé sur la collaboration entre conseillers. Cette approche collective vous offre un service d&rsquo;excellence.
            </p>
          </motion.div>

          {/* Chiffres cles */}
          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {IAD_STATS.map((s) => (
              <motion.div key={s.label} variants={scaleIn}
                className="text-center p-6 rounded-2xl bg-white border border-border">
                <p className="font-serif text-4xl md:text-5xl font-semibold text-brand leading-none mb-2">{s.value}</p>
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-muted mt-1">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bullets */}
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce}
            className="max-w-3xl mx-auto bg-white rounded-2xl border border-border p-7 md:p-9">
            <ul className="space-y-4">
              {IAD_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-brand-light flex items-center justify-center mt-0.5">
                    <Check size={12} className="text-brand" />
                  </div>
                  <p className="text-sm md:text-base text-foreground leading-relaxed">{b}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ===== 7. TEMOIGNAGES ===== */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Ils m&rsquo;ont fait confiance</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
              Des acquéreurs <span className="italic text-brand">accompagnés</span>
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
                  <span className="text-[10px] font-bold text-brand bg-brand-light px-2 py-0.5 rounded-full uppercase tracking-[0.15em]">Achat</span>
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
          <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand-light mb-4'}>Prêt à concrétiser ?</motion.p>
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-[-0.02em] mb-6">
            Trouvons le bien <span className="italic text-brand-light">qui vous ressemble.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/85 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Bénéficiez de mon accompagnement complet, de la recherche à la signature. Premier contact sous 48 h, sans engagement.
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
