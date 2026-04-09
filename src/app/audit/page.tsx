import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  FileText,
  Leaf,
  CheckCircle2,
  Home,
  Search,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Audit Immobilier Express Gratuit — Provence Verte & Haut-Var',
  description:
    'Identifiez tous les risques de votre bien en 2–3 minutes, avant de vendre ou d’acheter. Bilan juridique, technique et environnemental gratuit. Mandataire IAD Provence Verte.',
  alternates: { canonical: (env.siteUrl || 'https://alexlopez-provence.fr') + '/audit' },
}

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

const PILIERS = [
  {
    icon: FileText,
    titre: 'Risques juridiques',
    points: [
      'Servitudes et droits de passage',
      'Conformité du permis de construire',
      'Hypothèques et droit de préemption',
      'Situation cadastrale et bornage',
      'Copropriété : charges, travaux votés',
    ],
  },
  {
    icon: ShieldCheck,
    titre: 'Risques techniques',
    points: [
      'État de la toiture et de la charpente',
      'Électricité, plomberie, chauffage',
      'Assainissement (fosse septique, réseau)',
      'Isolation et performance énergétique',
      'Traces d’humidité, fissures structurelles',
    ],
  },
  {
    icon: Leaf,
    titre: 'Risques environnementaux',
    points: [
      'Zones inondables (PPR, PPRI)',
      'Risques sismiques et mouvements de terrain',
      'Présence d’amiante ou de plomb',
      'Proximité installations classées (ICPE)',
      'Plan de prévention des risques naturels',
    ],
  },
]

const POUR_QUI = [
  {
    icon: Home,
    titre: 'Vous vendez',
    sous: 'Anticipez les objections',
    texte:
      'Connaissez les points de vigilance de votre bien avant la première visite. Vous gagnerez en crédibilité face aux acheteurs et éviterez les négociations surprises sur des défauts que vous n’aviez pas anticipés.',
    cta: 'Obtenir mon audit vendeur',
  },
  {
    icon: Search,
    titre: 'Vous achetez',
    sous: 'Négociez en toute connaissance',
    texte:
      'Avant de signer le compromis, identifiez tous les risques du bien qui vous intéresse. Vous pourrez négocier le prix à la bonne hauteur, ou simplement éviter une mauvaise surprise coûteuse.',
    cta: 'Obtenir mon audit acheteur',
  },
]

const ETAPES = [
  { num: '01', titre: 'Lancez l’assistant', desc: 'Décrivez le bien en quelques clics — adresse, surface, type.' },
  { num: '02', titre: 'Analyse automatique', desc: 'L’outil croise les données publiques, cadastre, zonages et diagnostics.' },
  { num: '03', titre: 'Rapport personnalisé', desc: 'Vous recevez un bilan clair avec les points d’attention prioritaires.' },
  { num: '04', titre: 'On en parle', desc: 'Si vous le souhaitez, on commente ensemble les résultats — gratuit, sans engagement.' },
]

const FAQS = [
  {
    q: "L'audit immobilier express est-il vraiment gratuit ?",
    r: "Oui, entièrement gratuit et sans engagement. Il s'inscrit dans mon approche de transparence : vous devez avoir toutes les informations pour décider en connaissance de cause.",
  },
  {
    q: 'Combien de temps dure le bilan ?',
    r: "L'outil lui-même prend 2–3 minutes. Si vous souhaitez en discuter avec moi, je vous propose un échange téléphonique de 15 minutes sans frais.",
  },
  {
    q: 'L’audit remplace-t-il les diagnostics obligatoires ?',
    r: "Non. Les diagnostics réglementaires (DPE, amiante, plomb, électrique…) sont obligatoires et doivent être réalisés par des professionnels certifiés. L’audit express identifie les risques à anticiper avant ou en complément de ces diagnostics.",
  },
  {
    q: 'Je suis acheteur, pas encore propriétaire — puis-je quand même l’utiliser ?',
    r: "Oui, c’est même particulièrement utile avant de signer un compromis. En identifiant les risques en amont, vous pouvez négocier le prix ou demander des corrections avant la signature.",
  },
  {
    q: 'Ce service est-il disponible sur toute la Provence Verte ?',
    r: "Oui, j'interviens sur l'ensemble de la Provence Verte et du Haut-Var : Barjols, Aups, Rians, Salernes, Montmeyan, Quinson, Fox-Amphoux et toutes les communes limitrophes.",
  },
]

const auditJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Audit immobilier express',
      description:
        'Bilan gratuit des risques juridiques, techniques et environnementaux d’un bien immobilier en Provence Verte et Haut-Var.',
      provider: {
        '@type': 'Person',
        name: 'Alex Lopez',
        jobTitle: 'Mandataire immobilier IAD',
        telephone: PHONE_RAW,
      },
      areaServed: 'Provence Verte et Haut-Var',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Gratuit et sans engagement' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(function (f) {
        return {
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.r },
        }
      }),
    },
  ],
}

function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

export default function AuditPage() {
  const auditUrl = appUrl('/audit') || '/assistant'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(auditJsonLd)} />

      {/* ===== HERO ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-light text-brand text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-6">
              <Clock size={12} />
              Gratuit · 2–3 minutes · Sans engagement
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
              Audit immobilier
              <br />
              <span className="text-brand">express.</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-8">
              Avant de vendre ou d&apos;acheter en Provence Verte, identifiez tous les
              risques de votre bien — juridiques, techniques et environnementaux. Gratuit,
              en quelques minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button asChild variant="primary" size="lg">
                <Link
                  href={auditUrl}
                  target={auditUrl.startsWith('http') ? '_blank' : undefined}
                  rel={auditUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  Lancer mon audit <ArrowRight size={18} />
                </Link>
              </Button>
              <a href={'tel:' + PHONE_RAW}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
                <Phone size={15} />
                {PHONE_DISPLAY}
              </a>
            </div>
            <div className="flex flex-wrap gap-4">
              {['100% gratuit', 'Sans création de compte', 'Résultat immédiat'].map(function (item) {
                return (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-muted">
                    <CheckCircle2 size={15} className="text-success shrink-0" />
                    {item}
                  </div>
                )
              })}
            </div>
          </div>
          {/* Visuel — carte résumé audit */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-5">Ce que couvre l&apos;audit</p>
            <div className="space-y-4">
              {PILIERS.map(function (p) {
                const Icon = p.icon
                return (
                  <div key={p.titre} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.titre}</p>
                      <p className="text-xs text-muted mt-0.5">{p.points.length} points analysés</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted">Données croisées : cadastre, zonages PPR, diagnostics, bases publiques.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POUR QUI ===== */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-[75rem] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">Pour qui ?</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Utile que vous <span className="text-brand">vendiez ou achetiez.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {POUR_QUI.map(function (item) {
              const Icon = item.icon
              return (
                <div key={item.titre} className="bg-white rounded-2xl border border-border p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.sous}</p>
                      <p className="text-lg font-bold text-foreground">{item.titre}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-6">{item.texte}</p>
                  <Button asChild variant="primary" size="default" className="w-full">
                    <Link
                      href={auditUrl}
                      target={auditUrl.startsWith('http') ? '_blank' : undefined}
                      rel={auditUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {item.cta} <ArrowRight size={15} />
                    </Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== CE QU'ON ANALYSE ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">15+ points analysés</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Ce que couvre <span className="text-brand">l&apos;audit.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILIERS.map(function (p) {
              const Icon = p.icon
              return (
                <div key={p.titre} className="rounded-2xl border border-border bg-surface p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-brand" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{p.titre}</h3>
                  </div>
                  <ul className="space-y-2">
                    {p.points.map(function (point) {
                      return (
                        <li key={point} className="flex items-start gap-2 text-sm text-muted">
                          <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
                          {point}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">En 4 étapes</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Comment <span className="text-brand">ça marche ?</span>
            </h2>
          </div>
          <div className="space-y-6">
            {ETAPES.map(function (e) {
              return (
                <div key={e.num} className="flex gap-5 items-start">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-brand flex items-center justify-center">
                    <span className="text-sm font-extrabold text-white">{e.num}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-base font-bold text-foreground">{e.titre}</p>
                    <p className="text-sm text-muted mt-1">{e.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">Questions fréquentes</p>
            <h2 className="text-3xl font-extrabold text-foreground">
              Vos <span className="text-brand">questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(function (f) {
              return (
                <details key={f.q} className="group rounded-2xl border border-border bg-surface overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-foreground hover:text-brand transition-colors">
                    <span>{f.q}</span>
                    <span className="text-muted shrink-0 ml-4 text-xl leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-sm text-muted leading-relaxed">{f.r}</div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 px-6 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">Gratuit · 2–3 minutes</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Prêt à identifier vos risques ?
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Lancez votre audit immobilier express maintenant — sans création de compte,
            sans engagement, et complètement gratuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="primary">
              <Link
                href={auditUrl}
                target={auditUrl.startsWith('http') ? '_blank' : undefined}
                rel={auditUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                Lancer mon audit <ArrowRight size={18} />
              </Link>
            </Button>
            <a href={'tel:' + PHONE_RAW}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
              <Phone size={15} />
              {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-6 text-xs text-muted">
            Ou <Link href="/contact" className="text-brand underline">contactez-moi directement</Link> pour
            en discuter.
          </p>
        </div>
      </section>
    </>
  )
}
