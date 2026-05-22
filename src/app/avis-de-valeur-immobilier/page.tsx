import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { env } from '@/lib/env'
import { siteVisuals } from '@/lib/site-visuals'

const siteUrl = env.app.siteUrl || 'https://alexlopez-provence.fr'
const pageUrl = siteUrl + '/avis-de-valeur-immobilier'
const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

export const metadata: Metadata = {
  title: 'Avis de valeur immobilier en Provence Verte & Verdon | Alexandre Lopez iad',
  description:
    'Vous envisagez de vendre votre maison en Provence Verte & Verdon ? Obtenez un avis de valeur argumenté, local et sans engagement avec Alexandre Lopez, conseiller immobilier iad.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Avis de valeur immobilier en Provence Verte & Verdon',
    description:
      'Une analyse locale et argumentée pour comprendre la valeur réelle de votre maison avant de vendre.',
    url: pageUrl,
    type: 'website',
  },
}

const analysisItems = [
  'Ventes comparables récentes autour de votre secteur',
  'Lecture du village, de l’accès, de la vue et de l’environnement',
  'Prise en compte du terrain, de l’état, des travaux et du DPE',
  'Fourchette de valeur et points qui peuvent justifier le prix',
  'Conseils pour préparer la mise en vente et les prochaines étapes',
]

const situations = [
  'Vous envisagez de vendre dans les prochains mois',
  'Vous avez déjà une estimation mais vous voulez la vérifier',
  'Votre maison est en vente mais ne déclenche pas assez de visites',
  'Vous hésitez à vendre seul ou avec un professionnel',
  'Vous préparez une succession, une séparation ou un changement de vie',
  'Votre bien a des travaux, un DPE défavorable ou un potentiel à expliquer',
]

const communes = [
  'Barjols',
  'Cotignac',
  'Brignoles',
  'Saint-Maximin-la-Sainte-Baume',
  'Pontevès',
  'Tavernes',
  'Carcès',
  'Salernes',
  'Aups',
  'Lorgues',
  'Rians',
  'Montmeyan',
]

const faqs = [
  {
    question: 'L’avis de valeur immobilier est-il gratuit ?',
    answer:
      'Oui. La première demande d’avis de valeur est gratuite et sans engagement. Elle permet de comprendre la valeur probable de votre bien avant de prendre une décision.',
  },
  {
    question: 'Quelle différence entre une estimation en ligne et un avis de valeur ?',
    answer:
      'Une estimation en ligne donne un repère automatique. Un avis de valeur tient compte du bien réel, de son état, de son environnement, des ventes comparables et de la stratégie de mise en vente.',
  },
  {
    question: 'Combien de temps faut-il pour obtenir une première estimation ?',
    answer:
      'L’outil permet d’obtenir un premier repère rapidement. L’analyse peut ensuite être affinée avec les informations du bien, les comparables locaux et, si nécessaire, une visite.',
  },
  {
    question: 'Dois-je vendre après avoir demandé un avis de valeur ?',
    answer:
      'Non. L’objectif est d’abord de vous aider à décider. Vous pouvez demander un avis de valeur même si votre vente est prévue dans plusieurs mois.',
  },
  {
    question: 'Dans quelles communes intervenez-vous ?',
    answer:
      'J’interviens principalement en Provence Verte & Verdon, notamment autour de Barjols, Cotignac, Brignoles, Saint-Maximin-la-Sainte-Baume et Pontevès, avec une ouverture sur certains secteurs du Var intérieur et des Bouches-du-Rhône selon les projets.',
  },
  {
    question: 'Pourquoi deux estimations peuvent-elles être différentes ?',
    answer:
      'Le prix dépend de nombreux critères : état du bien, terrain, emplacement précis, rareté, demande locale, DPE, travaux, saisonnalité et stratégie de commercialisation. L’intérêt de l’avis de valeur est d’expliquer ces écarts.',
  },
]

function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['RealEstateAgent', 'LocalBusiness'],
        '@id': siteUrl + '/#business',
        name: 'Alexandre Lopez — Conseiller immobilier iad France',
        url: siteUrl,
        telephone: PHONE_RAW,
        areaServed: [
          'Provence Verte & Verdon',
          'Var intérieur',
          'Cotignac',
          'Lorgues',
          'Barjols',
          'Brignoles',
          'Saint-Maximin-la-Sainte-Baume',
          'Pays d’Aubagne',
          'Étoile',
          'Marseille Est',
        ],
        address: { '@type': 'PostalAddress', addressRegion: 'Var', addressCountry: 'FR' },
      },
      {
        '@type': 'Service',
        '@id': pageUrl + '#service',
        name: 'Avis de valeur immobilier en Provence Verte & Verdon',
        serviceType: 'Avis de valeur immobilier',
        provider: { '@id': siteUrl + '/#business' },
        areaServed: ['Provence Verte & Verdon', 'Var intérieur', 'Cotignac', 'Lorgues'],
        url: pageUrl,
        description:
          'Analyse locale et argumentée pour comprendre la valeur réelle d’une maison avant une vente.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Avis de valeur immobilier', item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(function (item) {
          return {
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          }
        }),
      },
    ],
  }
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,180,236,0.24)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_18px_40px_rgba(0,180,236,0.32)]">
      {children}
    </Link>
  )
}

function OutlinePhone() {
  return (
    <a href={'tel:' + PHONE_RAW} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/80 px-7 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-foreground">
      <Phone size={16} /> {PHONE_DISPLAY}
    </a>
  )
}

export default function AvisDeValeurPage() {
  const jsonLd = buildJsonLd()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(jsonLd)} />
      <main>
        <section className="relative min-h-[44rem] overflow-hidden px-6 pb-16 pt-28 text-white lg:min-h-screen lg:pb-24 lg:pt-36">
          <Image src={siteVisuals.sellingHouse.src} alt="Maison en Provence pour demander un avis de valeur immobilier" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101828]/90 via-[#101828]/62 to-[#101828]/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/54 via-transparent to-[#101828]/20" />
          <div className="relative mx-auto flex min-h-[32rem] max-w-7xl items-end lg:min-h-[42rem]">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur">
                <MapPin size={15} className="text-brand-light" /> Provence Verte & Verdon
              </div>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-[-0.05em] text-white md:text-6xl lg:text-7xl">
                Avis de valeur immobilier en <span className="text-brand-light">Provence Verte & Verdon</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/84 md:text-xl">
                Une analyse locale et argumentée pour comprendre la valeur réelle de votre maison, éviter les erreurs de prix et préparer une vente plus sereine.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <PrimaryLink href="/outils/vendre">Demander mon avis de valeur <ArrowRight size={18} /></PrimaryLink>
                <OutlinePhone />
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Gratuit et sans engagement', 'Analyse locale', 'Méthode claire', 'Accompagnement bilingue possible'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur">
                    <CheckCircle2 size={14} className="text-brand-light" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Pourquoi demander un avis de valeur ?</p>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Un bon prix de vente n’est pas seulement un chiffre.</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Le bon prix dépend du village, de l’adresse précise, de l’état du bien, du terrain, de la vue, des travaux, du DPE, de la rareté et de la demande réelle. Un avis de valeur sert à transformer ces éléments en décision claire.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Il vous aide à éviter deux risques fréquents : surestimer et bloquer la vente, ou sous-estimer et laisser de la valeur sur la table.
              </p>
            </div>
            <div className="rounded-[2rem] bg-[#f4f7f8] p-8 shadow-sm md:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Différent d’une estimation automatique</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Un simulateur donne un repère. L’avis de valeur explique le raisonnement : pourquoi cette fourchette, quels points peuvent tirer le prix vers le haut ou vers le bas, et comment présenter le bien au marché.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7f8] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Ce que contient l’analyse</p>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Une lecture locale, utile et exploitable.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {analysisItems.map((item) => (
                <div key={item} className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <CheckCircle2 className="mb-5 text-brand" size={24} />
                  <p className="text-sm font-semibold leading-relaxed text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative min-h-[34rem] overflow-hidden px-6 py-24 text-white md:min-h-[42rem] md:py-32">
          <Image src={siteVisuals.cotignacVillage.src} alt={siteVisuals.cotignacVillage.alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101828]/84 via-[#101828]/48 to-[#101828]/12" />
          <div className="relative mx-auto flex min-h-[24rem] max-w-7xl items-end md:min-h-[28rem]">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-light backdrop-blur">Cotignac · Lorgues · Var intérieur</p>
              <h2 className="text-4xl font-bold leading-tight tracking-[-0.045em] md:text-6xl">Valoriser les biens de caractère auprès d’une clientèle française et internationale.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/82">
                Certains villages du Var intérieur attirent des acheteurs français et internationaux. Mon accompagnement bilingue français-anglais permet de mieux présenter votre bien, répondre aux questions et sécuriser les échanges dès les premiers contacts.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1fr]">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Méthode</p>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">3 étapes simples avant de décider.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ['1', 'Vous décrivez votre bien', 'Adresse, surface, terrain, état, contexte de vente et informations utiles.'],
                ['2', 'J’analyse le marché local', 'Comparables, demande, concurrence, points forts et points de vigilance.'],
                ['3', 'Vous obtenez une lecture claire', 'Fourchette de valeur, explication du prix et prochaines étapes possibles.'],
              ].map(([number, title, desc]) => (
                <div key={number} className="rounded-2xl bg-[#f4f7f8] p-7 shadow-sm">
                  <span className="mb-7 inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-sm">{number}</span>
                  <h3 className="text-xl font-bold leading-tight tracking-[-0.025em] text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7f8] px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm md:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <Home size={28} />
              </div>
              <h2 className="text-3xl font-bold tracking-[-0.04em] text-foreground">Pour quelles situations ?</h2>
              <div className="mt-7 space-y-4">
                {situations.map((item) => (
                  <p key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={18} /> {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] bg-[#101828] p-8 text-white shadow-xl md:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-brand-light">
                <MapPin size={28} />
              </div>
              <h2 className="text-3xl font-bold tracking-[-0.04em]">Zone d’intervention</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/72">
                Mon socle principal reste la Provence Verte & Verdon, avec une spécialisation sur les villages recherchés du Var intérieur et des interventions ciblées côté Pays d’Aubagne, Étoile et Marseille Est lorsque le projet correspond à mon réseau.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {communes.map((commune) => (
                  <span key={commune} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/84">{commune}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">FAQ</p>
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Questions fréquentes avant de demander un avis de valeur.</h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-2xl bg-[#f4f7f8] p-6 shadow-sm">
                <h3 className="flex items-start gap-3 text-lg font-bold tracking-[-0.02em] text-foreground">
                  <ShieldCheck className="mt-1 shrink-0 text-brand" size={18} /> {item.question}
                </h3>
                <p className="mt-3 pl-8 text-sm leading-relaxed text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-brand to-brand-hover px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-white/80">
              <Sparkles size={14} /> Première étape
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-white md:text-5xl">Demandez votre avis de valeur et obtenez un premier repère clair.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/90">
              Lancez l’outil d’estimation, puis je pourrai affiner l’analyse selon votre bien, votre commune et votre calendrier de vente.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/outils/vendre" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand transition-colors hover:bg-[#f4f7f8]">
                Demander mon avis de valeur <ArrowRight size={16} />
              </Link>
              <a href={'tel:' + PHONE_RAW} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand">
                <Phone size={16} /> Appeler Alexandre
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
