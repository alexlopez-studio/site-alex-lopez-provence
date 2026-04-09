import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Home,
  Search,
  ClipboardCheck,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Lock,
  Users,
  ChevronDown,
  Send,
  Phone,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, biensUrl, env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Mandataire Immobilier Provence Verte & Haut-Var — Alex Lopez IAD',
  description:
    'Alex Lopez, mandataire IAD en Provence Verte et Haut-Var. Estimation gratuite, vente et achat immobilier. Prix du marché local + accompagnement personnalisé.',
  openGraph: {
    title: 'Alex Lopez — Mandataire IAD Provence Verte & Haut-Var',
    description:
      'Estimation gratuite, prix du marché local, accompagnement de A à Z. Réseau IAD — Barjols, Montmeyan, Quinson, Aups, Salernes, Rians.',
    url: env.siteUrl,
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

const FAQ_ITEMS = [
  {
    question: 'Quelle est la différence entre un mandataire et une agence immobilière ?',
    answer:
      "Un mandataire immobilier est un professionnel indépendant rattaché à un réseau (ici IAD France). Il propose les mêmes services qu'une agence (estimation, vente, achat) mais avec des honoraires souvent inférieurs, car il n'a pas de local commercial à entretenir.",
  },
  {
    question: 'Combien coûte une estimation immobilière en Provence Verte et Haut-Var ?',
    answer:
      "L'estimation est entièrement gratuite et sans engagement. Elle s'appuie sur les prix réels des ventes récentes dans votre secteur et la connaissance terrain de la Provence Verte et du Haut-Var.",
  },
  {
    question: 'Quelles communes couvrez-vous en Provence Verte et Haut-Var ?',
    answer:
      "J'interviens sur l'ensemble de la Provence Verte et du Haut-Var : Barjols, Montmeyan, Quinson, Fox-Amphoux, Tavernes, Rians, Aups, Salernes, Ginasservis, Varages, Esparron-de-Verdon, Artignosc-sur-Verdon et toutes les communes limitrophes.",
  },
  {
    question: 'Combien de temps faut-il pour vendre un bien en Provence Verte ?',
    answer:
      'Le délai moyen de vente dépend du bien et de son positionnement prix. Avec une estimation juste et une stratégie de diffusion adaptée, la majorité des biens en Provence Verte et Haut-Var trouvent preneur en 4 à 12 semaines.',
  },
  {
    question: "Qu'est-ce que l'audit immobilier express ?",
    answer:
      "C'est un bilan gratuit de votre bien réalisé en quelques minutes. Il identifie les points de vigilance — légaux, techniques, environnementaux — pour que vous puissiez vendre ou acheter en toute connaissance de cause, sans mauvaise surprise.",
  },
]

const USP_CHIPS = [
  { icon: CheckCircle2, label: 'Estimation gratuite' },
  { icon: TrendingUp, label: 'Prix du marché local' },
  { icon: ShieldCheck, label: 'Bilan complet du bien' },
  { icon: Clock, label: 'Réponse sous 24h' },
  { icon: Lock, label: 'Sans engagement' },
]

const SERVICES = [
  {
    icon: Home,
    title: 'Vendre votre bien',
    description:
      "Je vous aide à fixer le bon prix, valoriser votre bien et trouver le bon acheteur — rapidement et sans stress.",
    cta: 'Estimer mon bien',
    href: '/vendre',
    external: false,
  },
  {
    icon: Search,
    title: 'Acheter sereinement',
    description:
      "Je cherche pour vous, négocie à votre place et vérifie tous les points importants avant de signer.",
    cta: 'Décrire mon projet',
    href: '/acheter',
    external: false,
  },
  {
    icon: ClipboardCheck,
    title: 'Bilan immobilier gratuit',
    description:
      "Avant de vendre ou d'acheter, je passe votre bien au crible pour éviter les mauvaises surprises.",
    cta: 'Lancer le bilan',
    href: '/audit',
    external: false,
  },
  {
    icon: Users,
    title: 'Devenir mandataire IAD',
    description:
      "Vous souhaitez vous reconvertir en Provence ? Je vous accompagne de A à Z dans votre lancement.",
    cta: 'En savoir plus',
    href: 'https://www.iadfrance.fr/rejoindre-iad',
    external: true,
  },
]

const COMMUNES_TEASER = [
  'Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux', 'Tavernes',
  'Rians', 'Aups', 'Salernes', 'Ginasservis',
  'Varages', 'Esparron-de-Verdon', 'Artignosc-sur-Verdon',
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
    commune: 'Rians (83560)',
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
  { type: 'Maison de caractère', commune: 'Barjols', prix: '265 000 €' },
  { type: 'Mas provençal', commune: 'Aups', prix: '420 000 €' },
  { type: 'Villa avec piscine', commune: 'Rians', prix: '345 000 €' },
  { type: 'Maison de village', commune: 'Salernes', prix: '185 000 €' },
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
    text: "«Il connaît chaque commune de la Provence Verte. Grâce à lui, on a trouvé exactement ce qu'on cherchait, au bon prix et sans mauvaise surprise.»",
  },
  {
    name: 'Isabelle R.',
    transaction: 'VENTE',
    note: 5,
    text: "«Présent, réactif, transparent. Notre bien à Barjols a été vendu en moins d'un mois. Je recommande sans hésiter.»",
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
          'Mandataire immobilier IAD en Provence Verte et Haut-Var. Estimation gratuite, vente et achat immobilier.',
        url: siteUrl,
        telephone: PHONE_RAW,
        areaServed: [
          'Provence Verte', 'Haut-Var',
          'Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux',
          'Tavernes', 'Rians', 'Aups', 'Salernes', 'Ginasservis',
          'Varages', 'Esparron-de-Verdon',
        ],
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Var',
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

      {/* ===== HERO — layout asymétrique (inspiré Secfi) ===== */}
      <section className="min-h-[92vh] grid grid-cols-1 lg:grid-cols-[55%_45%]" aria-label="Hero">

        {/* Colonne gauche — texte left-aligné */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-20 lg:py-0 bg-white order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-5">
            Mandataire IAD — Provence Verte &amp; Haut-Var
          </p>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
            Vendez. Achetez.
            <br />
            <span className="text-brand">En toute confiance.</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed mb-10 max-w-md">
            Estimation gratuite, prix du marché local, accompagnement de A à Z
            en Provence Verte et Haut-Var.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button asChild size="lg" variant="primary">
              <Link
                href={assistantUrl}
                target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Estimer mon bien <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={env.calcomUrl} target="_blank" rel="noopener noreferrer">
                Prendre RDV
              </Link>
            </Button>
          </div>
          <a
            href={'tel:' + PHONE_RAW}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand transition-colors w-fit"
          >
            <Phone size={14} className="text-brand" />
            {PHONE_DISPLAY}
          </a>
        </div>

        {/* Colonne droite — photo + carte flottante */}
        <div className="relative bg-surface flex items-center justify-center overflow-hidden min-h-[50vh] lg:min-h-full order-1 lg:order-2">
          {/* Photo placeholder */}
          <div className="w-full h-full flex items-end justify-center px-8 pt-12 pb-0">
            <div className="w-full max-w-sm aspect-[3/4] bg-border/30 rounded-t-[3rem] flex items-center justify-center">
              <span className="text-muted text-sm">Photo Alex Lopez</span>
            </div>
          </div>

          {/* Carte flottante — estimation */}
          <div className="absolute bottom-8 left-6 lg:left-8 bg-white rounded-2xl shadow-xl p-5 w-64">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
              Estimation de votre bien
            </p>
            <p className="text-2xl font-extrabold text-foreground mb-0.5">
              245 000 €
            </p>
            <p className="text-xs text-muted mb-3">
              Basé sur 14 ventes récentes à Barjols
            </p>
            <div className="w-full bg-surface rounded-full h-1.5 mb-3">
              <div className="bg-brand h-1.5 rounded-full w-3/4" />
            </div>
            <p className="text-xs text-brand font-semibold flex items-center gap-1">
              <TrendingUp size={11} /> Marché stable · +2% sur 6 mois
            </p>
          </div>

          {/* Badge confiance */}
          <div className="absolute top-6 right-6 bg-white rounded-xl shadow-md px-3 py-2 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(function (i) {
                return <Star key={i} size={11} className="text-brand fill-brand" />
              })}
            </div>
            <span className="text-xs font-semibold text-foreground">5/5</span>
          </div>
        </div>
      </section>

      {/* ===== USP CHIPS ===== */}
      <section className="bg-white border-b border-border py-6 px-6">
        <div className="max-w-[75rem] mx-auto flex flex-wrap justify-center gap-3">
          {USP_CHIPS.map(function (chip) {
            const Icon = chip.icon
            return (
              <div
                key={chip.label}
                className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border text-sm font-medium text-foreground"
              >
                <Icon size={15} className="text-brand" />
                {chip.label}
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== MON HISTOIRE ===== */}
      <section className="py-24 px-6 bg-white" aria-label="Présentation Alex Lopez">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative rounded-2xl overflow-hidden bg-surface border border-border aspect-[4/5] flex items-center justify-center order-2 lg:order-1">
            <span className="text-muted text-sm">Photo Alex Lopez</span>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">
              Mon histoire
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight">
              Un mandataire <span className="text-brand">ancré</span> en Provence Verte.
            </h2>
            <div className="space-y-4 text-muted leading-relaxed mb-8">
              <p>
                Je suis Alex Lopez, mandataire immobilier IAD implanté en Provence Verte
                et Haut-Var. Après une carrière en stratégie et organisation, j&apos;ai
                choisi l&apos;immobilier pour une raison simple : c&apos;est un métier de
                lien, de confiance et d&apos;utilité concrète.
              </p>
              <p>
                Ici, pas de discours commercial. Je connais chaque commune de ma zone, ses
                prix réels, ses atouts et ses contraintes. Mon rôle : vous accompagner de
                l&apos;estimation à la signature, avec transparence et réactivité.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-8 text-center">
              <div>
                <p className="text-2xl font-extrabold text-brand">100%</p>
                <p className="text-xs text-muted mt-1">Accompagnement</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand">0 €</p>
                <p className="text-xs text-muted mt-1">Frais cachés</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand">7j/7</p>
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

      {/* ===== MES SERVICES — grille 2x2 ===== */}
      <section className="py-24 px-6 bg-surface" aria-labelledby="services-title">
        <div className="max-w-[75rem] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Mes services
            </p>
            <h2 id="services-title" className="text-3xl md:text-4xl font-extrabold text-foreground">
              Vente, achat, bilan :{' '}
              <span className="text-brand">je vous accompagne.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map(function (service) {
              const Icon = service.icon
              const href = service.external ? service.href : appUrl(service.href) || service.href
              return (
                <Link
                  key={service.title}
                  href={href}
                  target={service.external ? '_blank' : undefined}
                  rel={service.external ? 'noopener noreferrer' : undefined}
                  className="group bg-white rounded-2xl border border-border p-8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-5">
                    <Icon size={22} className="text-brand" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-5">{service.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-2.5 transition-all">
                    {service.cta} <ArrowRight size={15} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== MA ZONE D'INTERVENTION ===== */}
      <section className="py-24 px-6 bg-white" aria-labelledby="zone-title">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin size={18} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Zone d&apos;intervention
            </p>
          </div>
          <h2 id="zone-title" className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Provence Verte &amp; Haut-Var,{' '}
            <span className="text-brand">ma Provence.</span>
          </h2>
          <p className="text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
            J&apos;interviens sur l&apos;ensemble de la Provence Verte et du Haut-Var — de la
            plaine aux contreforts des Gorges du Verdon. Un territoire que je parcours
            quotidiennement et que je connais en profondeur.
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
      <section className="py-24 px-6 bg-surface" aria-labelledby="biens-vente-title">
        <div className="max-w-[75rem] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Biens disponibles
            </p>
            <h2 id="biens-vente-title" className="text-3xl md:text-4xl font-extrabold text-foreground">
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
                    <p className="font-extrabold text-foreground text-lg mb-1">{bien.prix}</p>
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
      <section className="py-24 px-6 bg-white" aria-labelledby="vendus-title">
        <div className="max-w-[75rem] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Références
            </p>
            <h2 id="vendus-title" className="text-3xl md:text-4xl font-extrabold text-foreground">
              Mes ventes <span className="text-brand">récentes</span>
            </h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">
              Des propriétaires accompagnés en Provence Verte et Haut-Var.
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
                  <p className="font-extrabold text-foreground text-sm">{bien.prix}</p>
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
      <section className="py-24 px-6 bg-surface" aria-labelledby="avis-title">
        <div className="max-w-[75rem] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Témoignages
            </p>
            <h2 id="avis-title" className="text-3xl md:text-4xl font-extrabold text-foreground">
              Ils m&apos;ont <span className="text-brand">fait confiance</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {AVIS.map(function (avis) {
              return (
                <div
                  key={avis.name}
                  className="p-7 rounded-2xl border border-border bg-white flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: avis.note }).map(function (_, i) {
                        return <Star key={i} size={14} className="text-brand fill-brand" />
                      })}
                    </div>
                    <span className="text-xs font-bold text-brand bg-brand-light px-2 py-0.5 rounded-full">
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
      <section className="py-24 px-6 bg-white" aria-labelledby="faq-title">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Questions fréquentes
            </p>
            <h2 id="faq-title" className="text-3xl md:text-4xl font-extrabold text-foreground">
              Ce qu&apos;on me <span className="text-brand">demande souvent</span>
            </h2>
          </div>
          <div className="space-y-3">
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

      {/* ===== CONTACT INLINE ===== */}
      <section className="py-24 px-6 bg-surface" aria-labelledby="contact-title">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div className="lg:pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">
              Me contacter
            </p>
            <h2
              id="contact-title"
              className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight"
            >
              Un projet ?{' '}
              <span className="text-brand">Parlons-en.</span>
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              Que vous souhaitiez vendre ou acheter en Provence Verte et Haut-Var,
              je vous réponds sous 24h. Sans engagement, sans pression.
            </p>
            <div className="space-y-4">
              <a
                href={'tel:' + PHONE_RAW}
                className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-brand transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <Phone size={15} className="text-brand" />
                </div>
                {PHONE_DISPLAY} — Disponible 7j/7
              </a>
              <div className="flex items-center gap-3 text-sm text-muted">
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-brand" />
                </div>
                Provence Verte &amp; Haut-Var (Var, 83)
              </div>
            </div>
          </div>

          <form
            action="/contact"
            method="GET"
            className="bg-white rounded-2xl border border-border p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-prenom" className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Prénom
                </label>
                <input
                  id="contact-prenom"
                  name="prenom"
                  type="text"
                  placeholder="Votre prénom"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="votre@email.fr"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-sujet" className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                Je souhaite
              </label>
              <select
                id="contact-sujet"
                name="sujet"
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-brand transition-colors"
              >
                <option value="">Choisir...</option>
                <option value="vendre">Vendre mon bien</option>
                <option value="acheter">Acheter un bien</option>
                <option value="estimation">Une estimation gratuite</option>
                <option value="bilan">Un bilan de mon bien</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="Décrivez votre projet en quelques mots..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand transition-colors resize-none"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Envoyer <Send size={16} />
            </Button>
            <p className="text-xs text-muted text-center">
              Sans engagement · Réponse sous 24h
            </p>
          </form>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-24 px-6 bg-brand-light" aria-label="Estimation">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">
            Gratuit · Sans engagement
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Votre projet commence ici.
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Obtenez une estimation précise de votre bien en quelques minutes,
            basée sur les prix réels du marché en Provence Verte et Haut-Var.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="primary">
              <Link
                href={assistantUrl}
                target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Estimer mon bien <ArrowRight size={18} />
              </Link>
            </Button>
            <a
              href={'tel:' + PHONE_RAW}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors"
            >
              <Phone size={15} />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
