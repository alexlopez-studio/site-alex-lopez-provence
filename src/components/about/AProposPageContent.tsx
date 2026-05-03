'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Phone, Calendar, ShieldCheck, Clock, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const EYEBROW = 'text-[13px] font-bold uppercase tracking-[0.22em]'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

const HERO_PHOTO = '/alexandre-lopez.jpg'
const CTA_BACKDROP = '/lavandes-proche.jpg'

const PARCOURS = [
  {
    period: 'Avant',
    title: 'Stratégie & organisation',
    desc: "Conseil en organisation, gestion de projets complexes, accompagnement de dirigeants. Une rigueur d'analyse et une exigence sur la qualité de l'accompagnement que je mets aujourd'hui au service de mes clients.",
  },
  {
    period: "Aujourd'hui",
    title: 'Conseiller iAD — Provence et Côte d’Azur',
    desc: "Estimation, vente et achat immobilier en Provence et sur la Côte d'Azur. Un accompagnement humain, transparent et engagé — du premier rendez-vous à la signature notaire.",
  },
] as const

const VALEURS = [
  {
    icon: ShieldCheck,
    title: 'Transparence',
    desc: "Je vous donne toutes les informations dont vous avez besoin pour décider, même celles qui ne me sont pas favorables. Un prix surestimé, des travaux sous-évalués, un marché qui se tasse : vous méritez la vérité.",
  },
  {
    icon: Clock,
    title: 'Réactivité',
    desc: "Je réponds sous 24 h, 7 jours sur 7. En immobilier, une opportunité peut se fermer en quelques heures. Être disponible quand vous en avez besoin, c'est une question de respect.",
  },
  {
    icon: MapPin,
    title: 'Ancrage local',
    desc: "Je vis et travaille en Provence et sur la Côte d'Azur. Je connais les secteurs, les micro-marchés, les prix réels des transactions récentes. Cette connaissance terrain est irremplaçable — aucun algorithme ne la remplace.",
  },
  {
    icon: Heart,
    title: 'Accompagnement complet',
    desc: "De l'estimation à la signature chez le notaire, je suis présent à chaque étape. Vous ne gérez pas seul les visites, la négociation, les diagnostics ou le suivi administratif.",
  },
] as const

export default function AProposPageContent() {
  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className="relative paper-surface pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden" aria-label="Mon approche">
        <div className="max-w-[75rem] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">

          <motion.div variants={stagger} initial="initial" animate="animate" className="order-2 lg:order-1">
            <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand mb-5'}>Mon approche</motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.05] tracking-[-0.02em] text-foreground mb-6">
              Un conseiller <span className="italic text-brand">ancré</span> en Provence<br />
              et sur la Côte d&rsquo;Azur.
            </motion.h1>
            <motion.div variants={fadeInUp} className="space-y-4 text-muted text-lg leading-relaxed mb-10 max-w-xl">
              <p>
                Je suis Alexandre Lopez, conseiller immobilier iAD France en Provence et sur la Côte d&rsquo;Azur. Après une carrière en stratégie et organisation, j&rsquo;ai choisi l&rsquo;immobilier pour une raison simple : c&rsquo;est un métier de lien, de confiance et d&rsquo;utilité concrète.
              </p>
              <p>
                Pas de discours commercial. Pas de promesses sur-estimées pour obtenir un mandat. Une estimation juste, ancrée dans les prix réels du marché local, et un accompagnement attentif jusqu&rsquo;à la signature.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-6 mb-10 max-w-md">
              <div>
                <p className="font-serif text-3xl md:text-4xl font-semibold text-brand leading-none">100 %</p>
                <p className="text-xs text-muted mt-2">Accompagnement</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-semibold text-brand leading-none">0 €</p>
                <p className="text-xs text-muted mt-2">Frais cachés</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-semibold text-brand leading-none">7 j/7</p>
                <p className="text-xs text-muted mt-2">Disponible</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">Me contacter <ArrowRight size={18} /></Link>
              </Button>
              <a href={'tel:' + PHONE_RAW}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
                <Phone size={15} />
                {PHONE_DISPLAY}
              </a>
            </motion.div>
          </motion.div>

          {/* Photo encadrée */}
          <motion.div variants={scaleIn} initial="initial" animate="animate"
            className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-xl bg-surface order-1 lg:order-2 max-w-md w-full mx-auto lg:mx-0 lg:ml-auto"
          >
            <Image
              src={HERO_PHOTO}
              alt="Alexandre Lopez"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              priority
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ===== 2. MON PARCOURS ===== */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="mb-12">
            <p className={EYEBROW + ' text-brand mb-4'}>Mon parcours</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
              D&rsquo;une carrière en organisation <span className="italic text-brand">à l&rsquo;immobilier de proximité.</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce}
            className="space-y-5 text-muted leading-relaxed text-lg mb-12">
            <p>
              Pendant plusieurs années, j&rsquo;ai travaillé dans le conseil en stratégie et l&rsquo;organisation d&rsquo;entreprise. J&rsquo;y ai développé une rigueur dans l&rsquo;analyse, une capacité à structurer des projets complexes et une exigence sur la qualité de l&rsquo;accompagnement.
            </p>
            <p>
              En m&rsquo;installant en Provence, j&rsquo;ai choisi un territoire que j&rsquo;aime profondément — ses villages, ses paysages, son rythme de vie. Et j&rsquo;ai choisi l&rsquo;immobilier pour accompagner les gens dans ce qui compte le plus : leur cadre de vie.
            </p>
            <p>
              Rejoindre iAD France m&rsquo;a permis d&rsquo;avoir accès à des outils professionnels, une formation solide et un réseau international — tout en restant un conseiller indépendant, ancré localement, disponible pour vous et uniquement pour vous.
            </p>
          </motion.div>

          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce} className="space-y-5">
            {PARCOURS.map((item) => (
              <motion.div key={item.title} variants={scaleIn}
                className="flex gap-5 items-start rounded-2xl border border-border bg-surface p-6 md:p-7">
                <div className="shrink-0 w-12 h-12 rounded-full bg-brand flex items-center justify-center">
                  <Calendar size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-1.5">{item.period}</p>
                  <p className="font-serif text-lg md:text-xl font-semibold text-foreground leading-tight mb-2">{item.title}</p>
                  <p className="text-sm md:text-base text-muted leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 3. VALEURS ===== */}
      <section className="py-28 px-6 paper-surface">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce}
            className="text-center mb-14 max-w-2xl mx-auto">
            <p className={EYEBROW + ' text-brand mb-4'}>Ce qui me guide</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
              Mes <span className="italic text-brand">valeurs</span>
            </h2>
          </motion.div>
          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALEURS.map((v) => {
              const Icon = v.icon
              return (
                <motion.div key={v.title} variants={scaleIn}
                  className="rounded-2xl border border-border bg-white p-7 md:p-8 hover:shadow-md hover:border-brand/40 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center mb-5">
                    <Icon size={20} className="text-brand" />
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-3">{v.title}</h3>
                  <p className="text-sm md:text-base text-muted leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== 4. MA ZONE (sans noms de villages) ===== */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce}>
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
                <MapPin size={16} className="text-brand" />
              </div>
              <p className={EYEBROW + ' text-brand'}>Zone d&rsquo;intervention</p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
              Provence et Côte d&rsquo;Azur, <span className="italic text-brand">mes terres.</span>
            </h2>
            <p className="text-muted leading-relaxed text-lg max-w-2xl mx-auto">
              J&rsquo;interviens sur l&rsquo;ensemble de la Provence et de la Côte d&rsquo;Azur, des plaines viticoles aux contreforts du Verdon, du littoral varois à l&rsquo;arrière-pays. Un territoire que je parcours quotidiennement et dont je connais les spécificités de chaque secteur.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== 5. CTA FINAL ===== */}
      <section className="relative py-28 px-6 overflow-hidden">
        <Image src={CTA_BACKDROP} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/75 to-foreground/55" />
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
          className="relative max-w-3xl mx-auto text-center text-white">
          <motion.p variants={fadeInUp} className={EYEBROW + ' text-brand-light mb-4'}>Travaillons ensemble</motion.p>
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-[-0.02em] mb-6">
            Un projet immobilier&nbsp;? <span className="italic text-brand-light">Je suis là.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/85 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Estimation gratuite, vente, achat ou simple question. Réponse sous 24 h, sans engagement.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">Me contacter <ArrowRight size={18} /></Link>
            </Button>
            <a href={'tel:' + PHONE_RAW}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/40 bg-transparent text-sm font-semibold text-white hover:bg-white hover:text-foreground transition-colors">
              <Phone size={15} /> {PHONE_DISPLAY}
            </a>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
