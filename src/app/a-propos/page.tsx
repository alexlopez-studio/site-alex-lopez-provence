import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone, CheckCircle2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Mon approche — Alex Lopez, Mandataire IAD Provence Verte',
  description:
    'Mandataire immobilier IAD en Provence Verte et Haut-Var. Découvrez mon parcours, mes valeurs et ma méthode pour vous accompagner dans votre projet immobilier.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/a-propos' },
}

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alex Lopez',
  jobTitle: 'Mandataire immobilier IAD',
  description:
    'Mandataire immobilier IAD en Provence Verte et Haut-Var, spécialisé dans la vente et l\'achat de biens immobiliers.',
  telephone: PHONE_RAW,
  areaServed: [
    'Provence Verte', 'Haut-Var', 'Barjols', 'Rians', 'Aups', 'Salernes',
    'Montmeyan', 'Quinson', 'Fox-Amphoux',
  ],
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Var',
    addressCountry: 'FR',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'IAD France',
    url: 'https://www.iadfrance.fr',
  },
}

const VALEURS = [
  {
    titre: 'Transparence',
    texte:
      'Je vous donne toutes les informations dont vous avez besoin pour décider — même celles qui ne me sont pas favorables. Un prix surestimé, des travaux sous-évalués, un marché qui se tasse : vous méritez la vérité.',
  },
  {
    titre: 'Réactivité',
    texte:
      'Je réponds sous 24h, 7 jours sur 7. En immobilier, une opportunité peut se fermer en quelques heures. Être disponible quand vous en avez besoin, c\'est une question de respect.',
  },
  {
    titre: 'Ancrage local',
    texte:
      'Je vis et travaille en Provence Verte. Je connais les communes, les micro-marchés, les prix réels des ventes récentes. Cette connaissance terrain est irremplaçable — aucun algorithme ne la remplace.',
  },
  {
    titre: 'Accompagnement complet',
    texte:
      'De l\'estimation à la signature chez le notaire, je suis présent à chaque étape. Vous ne gérez pas seul les visites, la négociation, les diagnostics ou le suivi administratif.',
  },
]

const COMMUNES = [
  'Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux', 'Tavernes',
  'Rians', 'Aups', 'Salernes', 'Ginasservis',
  'Varages', 'Esparron-de-Verdon', 'Artignosc-sur-Verdon',
]

function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

export default function AProposPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(personJsonLd)} />

      {/* ===== HERO ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Photo */}
          <div className="relative rounded-2xl overflow-hidden bg-surface border border-border aspect-[4/5] flex items-center justify-center order-2 lg:order-1">
            <span className="text-muted text-sm">Photo Alex Lopez</span>
          </div>
          {/* Texte */}
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">
              Mon approche
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight">
              Un mandataire <span className="text-brand">ancré</span>
              <br />en Provence Verte.
            </h1>
            <div className="space-y-4 text-muted leading-relaxed mb-8">
              <p>
                Je suis Alex Lopez, mandataire immobilier IAD en Provence Verte et Haut-Var.
                Après une carrière en stratégie et organisation, j&apos;ai choisi
                l&apos;immobilier pour une raison simple : c&apos;est un métier de lien,
                de confiance et d&apos;utilité concrète.
              </p>
              <p>
                Ici, pas de discours commercial. Pas de promesses sur-estimées pour obtenir
                un mandat. Je vous donne une estimation juste, ancrée dans les prix
                réels du marché local, et je vous accompagne jusqu&apos;à la signature.
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
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">
                  Me contacter <ArrowRight size={16} />
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
        </div>
      </section>

      {/* ===== MON PARCOURS ===== */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">Mon parcours</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 leading-tight">
            D&apos;une carrière en organisation
            <br />
            <span className="text-brand">à l&apos;immobilier de proximité.</span>
          </h2>
          <div className="space-y-6 text-muted leading-relaxed">
            <p>
              Pendant plusieurs années, j&apos;ai travaillé dans le conseil en stratégie et
              l&apos;organisation d&apos;entreprise. J&apos;y ai développé une rigueur dans l&apos;analyse,
              une capacité à structurer des projets complexes et une exigence sur la
              qualité de l&apos;accompagnement.
            </p>
            <p>
              En m&apos;installant en Provence Verte, j&apos;ai choisi un territoire que j&apos;aime
              profondément — ses villages, ses paysages, son rythme de vie. Et
              j&apos;ai choisi l&apos;immobilier pour accompagner les gens dans ce qui compte
              le plus : leur cadre de vie.
            </p>
            <p>
              Rejoindre IAD France m&apos;a permis d&apos;avoir accès à des outils
              professionnels, une formation solide et un réseau national — tout en
              restant un mandataire indépendant, ancré localement, disponible pour
              vous et uniquement pour vous.
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-12 space-y-6">
            {[
              { periode: 'Avant', titre: 'Stratégie & organisation', desc: 'Conseil en organisation, gestion de projets complexes, accompagnement de dirigeants.' },
              { periode: "Aujourd'hui", titre: 'Mandataire IAD — Provence Verte', desc: 'Estimation, vente, achat et audit immobilier en Provence Verte et Haut-Var.' },
            ].map(function (item) {
              return (
                <div key={item.titre} className="flex gap-5 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand">
                    <Calendar size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand mb-1">{item.periode}</p>
                    <p className="text-base font-bold text-foreground">{item.titre}</p>
                    <p className="text-sm text-muted mt-1">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== MES VALEURS ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">Ce qui me guide</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Mes <span className="text-brand">valeurs</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALEURS.map(function (v) {
              return (
                <div key={v.titre} className="rounded-2xl border border-border bg-surface p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-brand" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{v.titre}</h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{v.texte}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== MA ZONE ===== */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin size={18} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Zone d&apos;intervention</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Provence Verte &amp; Haut-Var,
            <br />
            <span className="text-brand">ma Provence.</span>
          </h2>
          <p className="text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
            J&apos;interviens sur l&apos;ensemble de la Provence Verte et du Haut-Var, de la
            plaine aux contreforts des Gorges du Verdon. Un territoire que je parcours
            quotidiennement.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {COMMUNES.map(function (c) {
              const slug = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
              return (
                <Link key={c} href={'/marche/' + slug}
                  className="px-3 py-1.5 bg-white rounded-full border border-border text-sm text-foreground hover:border-brand hover:text-brand transition-colors">
                  {c}
                </Link>
              )
            })}
          </div>
          <Link href="/marche" className="inline-flex items-center gap-2 text-brand font-semibold hover:underline">
            Voir toutes les communes <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-6 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">Travaillons ensemble</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Un projet immobilier ? Je suis là.
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Estimation gratuite, vente, achat ou simple question sur le marché
            en Provence Verte. Réponse sous 24h, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="primary" size="lg">
              <Link href="/contact">Me contacter <ArrowRight size={16} /></Link>
            </Button>
            <a href={'tel:' + PHONE_RAW}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
              <Phone size={15} />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
