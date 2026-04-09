import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Search,
  ClipboardCheck,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  BarChart2,
  Gift,
  Lock,
  Users,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, biensUrl, env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Mandataire Immobilier Haut-Var & Verdon — Alex Lopez IAD',
  description:
    'Alex Lopez, mandataire IAD basé à Varages (83670). Estimation gratuite, vente et achat immobilier en Haut-Var et Verdon. Données DVF + analyse des risques.',
  openGraph: {
    title: 'Alex Lopez — Mandataire IAD Haut-Var & Verdon',
    description:
      'Estimation gratuite, données DVF, analyse des risques. Réseau IAD — Varages, Barjols, Montmeyan, Quinson, Aups, Salernes.',
    url: env.siteUrl,
  },
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Évite les double-accolades JSX pour dangerouslySetInnerHTML */
function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={buildInnerHtml(data)}
    />
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: 'Quelle est la différence entre un mandataire et une agence immobilière ?',
    answer:
      "Un mandataire immobilier est un professionnel indépendant rattaché à un réseau (ici IAD France). Il propose les mêmes services qu'une agence (estimation, vente, achat) mais avec des honoraires souvent inférieurs, car il n'a pas de local commercial à entretenir.",
  },
  {
    question: 'Combien coûte une estimation immobilière dans le Haut-Var ?',
    answer:
      "L'estimation est entièrement gratuite et sans engagement. Elle s'appuie sur les données DVF (Demandes de Valeurs Foncières) officielles et la connaissance terrain du Haut-Var et du Verdon.",
  },
  {
    question: 'Quelles communes couvrez-vous en Provence ?',
    answer:
      "J'interviens principalement sur le Haut-Var et les communes limitrophes des Alpes-de-Haute-Provence : Varages, Barjols, Montmeyan, Quinson, Fox-Amphoux, Tavernes, Rians, Aups, Salernes, Ginasservis, et tout le périmètre des Gorges du Verdon.",
  },
  {
    question: 'Combien de temps faut-il pour vendre un bien dans le Haut-Var ?',
    answer:
      'Le délai moyen de vente dépend du bien et de son positionnement prix. Avec une estimation juste et une stratégie de diffusion adaptée, la majorité des biens trouvent preneur en 4 à 12 semaines.',
  },
  {
    question: "Qu'est-ce que l'audit immobilier express ?",
    answer:
      "C'est un outil gratuit qui analyse en 2–3 minutes les risques juridiques, techniques et environnementaux d'un bien. Il vous permet de négocier en toute connaissance de cause, que vous soyez vendeur ou acheteur.",
  },
]

const USP_CHIPS = [
  { icon: Gift, label: 'Estimation offerte' },
  { icon: BarChart2, label: 'Données DVF officielles' },
  { icon: ShieldCheck, label: 'Analyse des risques' },
  { icon: Clock, label: '2–3 min chrono' },
  { icon: CheckCircle2, label: 'Gratuit' },
  { icon: Lock, label: 'Sécurisé' },
]

const SERVICES = [
  {
    icon: Home,
    title: 'Vendre votre bien',
    description:
      'Estimation ancrée dans les données DVF réelles, stratégie de mise en valeur et commercialisation ciblée pour vendre au juste prix, sans stress.',
    bullets: [
      'Estimation offerte et argumentée (comparables locaux)',
      'Valorisation du bien : conseils home staging',
      'Diffusion multi-portails + réseau IAD France',
      "Suivi transparent à chaque étape jusqu'à l'acte",
    ],
    cta: 'Estimer mon bien',
    href: '/vendre',
    external: false,
    bg: 'bg-white',
  },
  {
    icon: Search,
    title: 'Acheter sereinement',
    description:
      'Brief clair, visites pertinentes, négociation au juste prix. Une connaissance fine du Haut-Var et du Verdon pour sécuriser votre acquisition.',
    bullets: [
      'Recherche personnalisée sur toute la zone',
      'Négociation et sécurisation du prix',
      'Vérifications clés : diagnostics, travaux, syndic',
      "Réseau d'artisans locaux recommandés",
    ],
    cta: 'Décrire mon projet',
    href: '/acheter',
    external: false,
    bg: 'bg-surface',
  },
  {
    icon: ClipboardCheck,
    title: 'Audit immobilier express',
    description:
      "Avant de vendre ou d'acheter, identifiez les risques juridiques, techniques et environnementaux pour négocier en toute confiance.",
    bullets: [
      'Risques juridiques et servitudes',
      'Points de vigilance techniques et travaux',
      'Risques environnementaux (zones inondables, etc.)',
      'Rapport clair en 2–3 minutes, gratuit',
    ],
    cta: "Lancer l'audit",
    href: '/audit',
    external: false,
    bg: 'bg-white',
  },
  {
    icon: Users,
    title: 'Devenir mandataire IAD',
    description:
      'Vous souhaitez vous reconvertir ou démarrer une activité indépendante en immobilier ? Je vous accompagne dans votre lancement en Provence.',
    bullets: [
      "Parcours d'intégration structuré et clair",
      'Formation à la vente et accompagnement terrain',
      'Outils digitaux et process éprouvés',
      'Revenus à la hauteur de votre engagement',
    ],
    cta: 'En savoir plus',
    href: 'https://www.iadfrance.fr/rejoindre-iad',
    external: true,
    bg: 'bg-surface',
  },
]

const COMMUNES_TEASER = [
  'Varages', 'Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux',
  'Tavernes', 'Rians', 'Aups', 'Salernes',
  'Ginasservis', 'Esparron-de-Verdon', 'Artignosc-sur-Verdon',
]

const BIENS_VENTE = [
  {
    tag: 'NOUVEAU',
    tagColor: 'bg-success text-white',
    type: 'Maison de village',
    commune: 'Barjols (83670)',
    prix: '245 000 €',
    surface: '110 m²',
    pieces: '4 pièces',
  },
  {
    tag: 'NOUVEAU',
    tagColor: 'bg-success text-white',
    type: 'Bastide provençale',
    commune: 'Varages (83670)',
    prix: '385 000 €',
    surface: '180 m²',
    pieces: '6 pièces',
  },
  {
    tag: 'BAISSE DE PRIX',
    tagColor: 'bg-brand text-white',
    type: 'Maison avec terrain',
    commune: 'Montmeyan (83670)',
    prix: '198 000 €',
    surface: '95 m²',
    pieces: '3 pièces',
  },
]

const BIENS_VENDUS = [
  { type: 'Maison de caractère', commune: 'Varages', prix: '265 000 €' },
  { type: 'Mas provençal', commune: 'Barjols', prix: '420 000 €' },
  { type: 'Villa avec piscine', commune: 'Rians', prix: '345 000 €' },
  { type: 'Maison de village', commune: 'Aups', prix: '185 000 €' },
]

const AVIS = [
  {
    name: 'Sophie M.',
    transaction: 'VENTE',
    note: 5,
    text: "«Alex a su estimer notre maison au juste prix. Vendu en 3 semaines, sans stress. Une présence et une transparence exemplaires tout au long du processus.»",
  },
  {
    name: 'Pierre & Marion L.',
    transaction: 'ACHAT',
    note: 5,
    text: "«L'assistant nous a permis de préparer la visite parfaitement. Alex connaît chaque commune du Haut-Var — un vrai avantage pour trouver le bon bien au bon prix.»",
  },
  {
    name: 'Isabelle R.',
    transaction: 'VENTE',
    note: 5,
    text: "«Présent, réactif, transparent. Exactement ce qu'on cherchait. Notre bien à Barjols a été vendu en moins d'un mois. Je recommande sans hésiter.»",
  },
]

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function buildJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['RealEstateAgent', 'LocalBusiness'],
        '@id': siteUrl + '/#business',
        name: 'Alex Lopez — Mandataire Immobilier IAD',
        description:
          'Mandataire immobilier IAD basé à Varages (83670), spécialisé en Haut-Var et Verdon. Estimation gratuite, vente, achat et audit immobilier en Provence.',
        url: siteUrl,
        areaServed: [
          'Varages', 'Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux',
          'Tavernes', 'Rians', 'Aups', 'Salernes', 'Haut-Var', 'Verdon',
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Varages',
          postalCode: '83670',
          addressRegion: "Provence-Alpes-Côte d'Azur",
          addressCountry: 'FR',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          reviewCount: '3',
          bestRating: '5',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(function (item) {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const assistantUrl = appUrl('') || '/assistant'
  const biens = biensUrl()
  const jsonLd = buildJsonLd(env.siteUrl)

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ===== HERO — travaillé en parallèle, placeholder conservé ===== */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 bg-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-6">
          Mandataire IAD — Provence, Haut-Var, Verdon
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight max-w-3xl mb-6">
          Vendez. Achetez.
          <br />
          <span className="text-brand">En toute confiance.</span>
        </h1>
        <p className="text-lg text-muted max-w-xl leading-relaxed mb-10">
          Estimation gratuite ancrée dans les données réelles, analyse des risques,
          accompagnement personnalisé. Lancé en 2–3 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="primary">
            <Link
              href={assistantUrl}
              target={assistantUrl.startsWith('http') ? '_blank' : undefined}
              rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              Lancer l&apos;assistant <ArrowRight size={18} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={env.calcomUrl} target="_blank" rel="noopener noreferrer">
              Prendre RDV
            </Link>
          </Button>
        </div>
      </section>

      {/* ===== USP CHIPS ===== */}
      <section className="bg-surface py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {USP_CHIPS.map(function (chip) {
            const Icon = chip.icon
            return (
              <div
                key={chip.label}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-border text-sm font-medium text-foreground shadow-sm"
              >
                <Icon size={15} className="text-brand" />
                {chip.label}
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== MON HISTOIRE ===== */}
      <section className="py-20 px-4 bg-white" aria-label="Présentation Alex Lopez">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden bg-surface border border-border aspect-[4/5] flex items-center justify-center order-2 lg:order-1">
            <span className="text-muted text-sm">Photo Alex Lopez</span>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">
              Mon histoire
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight">
              Un mandataire <span className="text-brand">ancré</span> dans sa Provence.
            </h2>
            <div className="space-y-4 text-muted leading-relaxed mb-8">
              <p>
                Je suis Alex Lopez, mandataire immobilier IAD basé à Varages, au cœur du
                Haut-Var. Après une carrière en stratégie et organisation, j&apos;ai choisi
                l&apos;immobilier pour une raison simple : c&apos;est un métier de lien, de
                confiance et d&apos;utilité concrète.
              </p>
              <p>
                Ici, pas de discours commercial. Je connais chaque commune de ma zone, ses
                spécificités de marché, ses atouts et ses contraintes. Mon rôle : vous
                accompagner de l&apos;estimation à la signature, avec transparence et
                réactivité.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-8 text-center">
              <div>
                <p className="text-2xl font-black text-brand">100%</p>
                <p className="text-xs text-muted mt-1">Accompagnement</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand">0 €</p>
                <p className="text-xs text-muted mt-1">Frais cachés</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand">7j/7</p>
                <p className="text-xs text-muted mt-1">Disponible</p>
              </div>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link href="/a-propos">
                Mon parcours <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== MES SERVICES ===== */}
      <section className="py-20 px-4 bg-surface" aria-labelledby="services-title">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Mes services
            </p>
            <h2 id="services-title" className="text-3xl md:text-4xl font-black text-foreground">
              Vente, achat, audit :{' '}
              <span className="text-brand">je vous accompagne.</span>
            </h2>
          </div>
          <div className="space-y-6">
            {SERVICES.map(function (service) {
              const Icon = service.icon
              return (
                <div
                  key={service.title}
                  className={service.bg + ' rounded-2xl border border-border p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start'}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-brand" />
                      </div>
                      <h3 className="text-xl font-black text-foreground">{service.title}</h3>
                    </div>
                    <p className="text-muted leading-relaxed mb-5 max-w-2xl">{service.description}</p>
                    <ul className="space-y-2">
                      {service.bullets.map(function (b) {
                        return (
                          <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                            <CheckCircle2 size={15} className="text-success mt-0.5 shrink-0" />
                            {b}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="shrink-0">
                    <Button
                      asChild
                      variant={service.external ? 'outline' : 'primary'}
                      size="default"
                    >
                      <Link
                        href={service.external ? service.href : appUrl(service.href) || service.href}
                        target={service.external ? '_blank' : undefined}
                        rel={service.external ? 'noopener noreferrer' : undefined}
                      >
                        {service.cta} <ArrowRight size={15} />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== MA ZONE D'INTERVENTION ===== */}
      <section className="py-20 px-4 bg-white" aria-labelledby="zone-title">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin size={18} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Zone d&apos;intervention
            </p>
          </div>
          <h2 id="zone-title" className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Haut-Var &amp; Verdon,{' '}
            <span className="text-brand">ma Provence.</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            Basé à <strong>Varages (83670)</strong>, j&apos;interviens sur l&apos;ensemble du
            Haut-Var et des communes limitrophes des Alpes-de-Haute-Provence, jusqu&apos;aux
            Gorges du Verdon. Une zone que je parcours quotidiennement, que je connais en
            profondeur.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {COMMUNES_TEASER.map(function (c) {
              const slug = c
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
              return (
                <Link
                  key={c}
                  href={'/marche/' + slug}
                  className="px-3 py-1.5 bg-surface rounded-full border border-border text-sm text-foreground hover:border-brand hover:text-brand transition-colors"
                >
                  {c}
                </Link>
              )
            })}
            <span className="px-3 py-1.5 text-sm text-muted">&amp; bien d&apos;autres…</span>
          </div>
          <Link
            href="/marche"
            className="inline-flex items-center gap-2 text-brand font-semibold hover:underline"
          >
            Voir toutes les communes <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===== MES BIENS EN VENTE ===== */}
      <section className="py-20 px-4 bg-surface" aria-labelledby="biens-vente-title">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Biens disponibles
            </p>
            <h2 id="biens-vente-title" className="text-3xl md:text-4xl font-black text-foreground">
              Mes biens <span className="text-brand">actuellement en vente</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {BIENS_VENTE.map(function (bien) {
              return (
                <div
                  key={bien.type + bien.commune}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="aspect-[4/3] bg-surface flex items-center justify-center relative">
                    <Home size={32} className="text-border" />
                    <span className={'absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ' + bien.tagColor}>
                      {bien.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-black text-foreground text-lg mb-1">{bien.prix}</p>
                    <p className="font-semibold text-foreground text-sm mb-1">{bien.type}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mb-3">
                      <MapPin size={11} /> {bien.commune}
                    </p>
                    <div className="flex gap-3 text-xs text-muted">
                      <span>{bien.surface}</span>
                      <span>·</span>
                      <span>{bien.pieces}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {biens && (
            <div className="text-center">
              <Button asChild variant="outline">
                <Link href={biens} target="_blank" rel="noopener noreferrer">
                  Consulter tous les biens <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===== MES VENTES RÉCENTES ===== */}
      <section className="py-20 px-4 bg-white" aria-labelledby="vendus-title">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Références
            </p>
            <h2 id="vendus-title" className="text-3xl md:text-4xl font-black text-foreground">
              Mes ventes <span className="text-brand">récentes</span>
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">
              Des propriétaires accompagnés dans le Haut-Var et le Verdon.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BIENS_VENDUS.map(function (bien) {
              return (
                <div
                  key={bien.type + bien.commune}
                  className="rounded-2xl border border-border bg-surface p-5 relative"
                >
                  <span className="absolute top-3 right-3 text-xs font-bold text-success bg-green-50 px-2 py-0.5 rounded-full">
                    VENDU
                  </span>
                  <div className="aspect-[4/3] bg-white rounded-xl flex items-center justify-center mb-4 border border-border">
                    <Home size={24} className="text-border" />
                  </div>
                  <p className="font-black text-foreground text-sm">{bien.prix}</p>
                  <p className="text-xs text-foreground font-medium mt-0.5">{bien.type}</p>
                  <p className="text-xs text-muted flex items-center gap-1 mt-1">
                    <MapPin size={10} /> {bien.commune}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== ILS M'ONT FAIT CONFIANCE ===== */}
      <section className="py-20 px-4 bg-surface" aria-labelledby="avis-title">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Témoignages
            </p>
            <h2 id="avis-title" className="text-3xl md:text-4xl font-black text-foreground">
              Ils m&apos;ont <span className="text-brand">fait confiance</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {AVIS.map(function (avis) {
              return (
                <div
                  key={avis.name}
                  className="p-6 rounded-2xl border border-border bg-white flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: avis.note }).map(function (_, i) {
                        return <Star key={i} size={14} className="text-brand fill-brand" />
                      })}
                    </div>
                    <span className="text-xs font-bold text-brand bg-blue-50 px-2 py-0.5 rounded-full">
                      {avis.transaction}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed flex-1 mb-4">
                    {avis.text}
                  </p>
                  <p className="text-xs font-semibold text-muted">{avis.name}</p>
                </div>
              )
            })}
          </div>
          <div className="text-center">
            <Link
              href="/avis"
              className="inline-flex items-center gap-2 text-brand font-semibold hover:underline"
            >
              Voir tous les avis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 px-4 bg-white" aria-labelledby="faq-title">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Questions fréquentes
            </p>
            <h2 id="faq-title" className="text-3xl md:text-4xl font-black text-foreground">
              Ce qu&apos;on me <span className="text-brand">demande souvent</span>
            </h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map(function (item) {
              return (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-border bg-surface overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-foreground hover:text-brand transition-colors">
                    <span>{item.question}</span>
                    <ChevronDown
                      size={18}
                      className="text-muted shrink-0 ml-4 transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="px-6 pb-6 text-sm text-muted leading-relaxed">{item.answer}</div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 px-4 bg-foreground" aria-label="Contact">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50 mb-4">
            Un projet immobilier ?
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Parlons-en simplement,
            <br />
            sans engagement.
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Estimation gratuite, analyse des risques, ou juste une question sur le marché
            Haut-Var. Je suis là.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="primary">
              <Link
                href={assistantUrl}
                target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Lancer l&apos;assistant <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={env.calcomUrl} target="_blank" rel="noopener noreferrer">
                Prendre RDV
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
