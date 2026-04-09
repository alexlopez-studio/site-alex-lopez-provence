import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, Phone,
  Search, MapPin, ShieldCheck, HandshakeIcon,
  FileSignature, TreePine,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Acheter en Provence Verte & Haut-Var — Alex Lopez IAD',
  description:
    'Trouvez le bien idéal en Provence Verte et Haut-Var. Recherche personnalisée, négociation au juste prix, vérifications clés avant signature. Mandataire IAD — accompagnement gratuit pour l’acheteur.',
  alternates: { canonical: (env.siteUrl || 'https://alexlopez-provence.fr') + '/acheter' },
}

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

const ETAPES = [
  {
    icon: Search,
    num: '01',
    titre: 'Définir votre projet',
    desc: 'On commence par un échange de 30 minutes pour cadrer votre projet : budget, type de bien, secteur, critiques et non-négociables. Plus votre brief est clair, plus la recherche est efficace.',
  },
  {
    icon: MapPin,
    num: '02',
    titre: 'Recherche ciblée',
    desc: 'Je cherche pour vous dans tout le territoire Provence Verte et Haut-Var — biens sur le marché et hors-marché. Vous ne perdez pas de temps à filtrer des dizaines d’annonces hors critères.',
  },
  {
    icon: ShieldCheck,
    num: '03',
    titre: 'Vérifications avant visite',
    desc: 'Avant de vous déplacer, je vérifie les points clés : situation légale, diagnostics disponibles, charges de copropriété, zonages. Seuls les biens sans risque majeur font l’objet d’une visite.',
  },
  {
    icon: HandshakeIcon,
    num: '04',
    titre: 'Négociation',
    desc: 'Je négocie à votre place avec le vendeur ou son mandataire. Mon objectif : obtenir le juste prix, en tenant compte de l’état du bien, du marché local et du rapport de force.',
  },
  {
    icon: FileSignature,
    num: '05',
    titre: 'Compromis & signature',
    desc: 'Je vous accompagne jusqu’à l’acte notarié : relecture du compromis, suivi des conditions suspensives, coordination avec le notaire.',
  },
]

const ATOUTS = [
  'Connaissance précise des communes et micro-marchés',
  'Accès aux biens hors-marché via le réseau IAD',
  'Audit immobilier express inclus avant signature',
  'Analyse des ventes récentes pour négocier juste',
  'Réseau d’artisans locaux pour estimer les travaux',
  'Accompagnement de A à Z, 7j/7',
]

const COMMUNES = [
  'Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux', 'Tavernes',
  'Rians', 'Aups', 'Salernes', 'Ginasservis', 'Varages',
]

const FAQS = [
  {
    q: 'L’accompagnement acheteur est-il payant ?',
    r: 'Non. En tant que mandataire, mes honoraires sont à la charge du vendeur (ou inclus dans le prix de vente selon le mandat). En tant qu’acheteur, vous bénéficiez de mon accompagnement sans frais supplémentaires.',
  },
  {
    q: 'Puis-je acheter même si je n’ai pas encore de financement validé ?',
    r: 'Oui, on peut tout à fait démarrer la recherche en parallèle de votre démarche de financement. Je peux vous orienter vers des courtiers partenaires si besoin.',
  },
  {
    q: 'Intervenez-vous sur toute la Provence Verte ?',
    r: 'Oui, sur l’ensemble de la Provence Verte et du Haut-Var : Barjols, Aups, Rians, Salernes, Montmeyan, Quinson, Fox-Amphoux, Varages, Ginasservis et toutes les communes limitrophes.',
  },
  {
    q: 'Que se passe-t-il si je ne trouve pas de bien qui me convient ?',
    r: 'La recherche prend parfois du temps, surtout en zone rurale où le stock est limité. Je reste à l’écoute des nouvelles opportunités et vous alerte dès qu’un bien correspondant à vos critères arrive sur le marché.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Recherche et achat immobilier — Provence Verte & Haut-Var',
      description: 'Accompagnement acheteur en Provence Verte et Haut-Var : recherche personnalisée, négociation, vérifications et suivi jusqu’à la signature.',
      provider: { '@type': 'Person', name: 'Alex Lopez', jobTitle: 'Mandataire immobilier IAD', telephone: PHONE_RAW },
      areaServed: 'Provence Verte et Haut-Var',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Gratuit pour l’acheteur' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
    },
  ],
}

function buildInnerHtml(data: object) { return { __html: JSON.stringify(data) } }

export default function AcheterPage() {
  const rechercheUrl = appUrl('/acheter') || '/assistant'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(serviceJsonLd)} />

      {/* HERO */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-5">Acheter en Provence Verte</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
              Trouvez le bien <span className="text-brand">qui vous ressemble.</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-8">
              Recherche personnalisée, négociation au juste prix, vérifications
              avant signature — accompagnement complet et gratuit pour l’acheteur
              en Provence Verte et Haut-Var.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button asChild variant="primary" size="lg">
                <Link href={rechercheUrl} target={rechercheUrl.startsWith('http') ? '_blank' : undefined}
                  rel={rechercheUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  Décrire mon projet <ArrowRight size={18} />
                </Link>
              </Button>
              <a href={'tel:' + PHONE_RAW}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
                <Phone size={15} />{PHONE_DISPLAY}
              </a>
            </div>
            <div className="flex flex-wrap gap-4">
              {['Gratuit pour l’acheteur', 'Accès biens hors-marché', 'Audit express inclus'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-muted">
                  <CheckCircle2 size={15} className="text-success shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
          {/* Atouts */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-5">Mes atouts pour vous</p>
            <ul className="space-y-3">
              {ATOUTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 size={15} className="text-brand shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <Button asChild variant="primary" size="default" className="w-full">
                <Link href={rechercheUrl} target={rechercheUrl.startsWith('http') ? '_blank' : undefined}
                  rel={rechercheUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  Démarrer ma recherche <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">De A à Z</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Comment je vous <span className="text-brand">accompagne ?</span>
            </h2>
          </div>
          <div className="space-y-6">
            {ETAPES.map((e) => {
              const Icon = e.icon
              return (
                <div key={e.num} className="flex gap-5 items-start bg-white rounded-2xl border border-border p-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-brand flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-brand/60 uppercase tracking-wider">Étape {e.num}</span>
                    </div>
                    <p className="text-base font-bold text-foreground">{e.titre}</p>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ZONE */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TreePine size={18} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Secteur couvert</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Provence Verte &amp; Haut-Var —{' '}
            <span className="text-brand">je connais chaque commune.</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            Ce territoire, je le parcours quotidiennement. Je connais les prix réels,
            les micro-marchés, les biens qui restent trop longtemps et ceux qui partent
            en 48h. Cette connaissance terrain fait la différence dans votre recherche.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {COMMUNES.map((c) => (
              <Link key={c}
                href={'/marche/' + c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}
                className="px-3 py-1.5 bg-surface rounded-full border border-border text-sm text-foreground hover:border-brand hover:text-brand transition-colors">
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">Questions fréquentes</p>
            <h2 className="text-3xl font-extrabold text-foreground">Vos <span className="text-brand">questions</span></h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-white overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-foreground hover:text-brand transition-colors">
                  <span>{f.q}</span>
                  <span className="text-muted shrink-0 ml-4 text-xl leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-muted leading-relaxed">{f.r}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">Gratuit pour l’acheteur</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Prêt à trouver <span className="text-brand">votre bien ?</span>
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Décrivez votre projet en quelques minutes. Je prends contact avec vous
            sous 24h pour démarrer la recherche.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="primary">
              <Link href={rechercheUrl} target={rechercheUrl.startsWith('http') ? '_blank' : undefined}
                rel={rechercheUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                Décrire mon projet <ArrowRight size={18} />
              </Link>
            </Button>
            <a href={'tel:' + PHONE_RAW}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
              <Phone size={15} />{PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
