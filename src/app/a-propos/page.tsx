import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, CheckCircle2, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Mon approche — Alex Lopez, Mandataire IAD Provence Verte & Verdon',
  description:
    'Mandataire immobilier IAD en Provence Verte et Verdon. Découvrez mon parcours, mes valeurs et ma méthode pour vous accompagner dans votre projet immobilier.',
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
    'Mandataire immobilier IAD en Provence Verte et Verdon, spécialisé dans la vente et l\'achat de biens immobiliers.',
  telephone: PHONE_RAW,
  areaServed: ['Provence Verte', 'Verdon', 'Provence Verdon', 'Barjols', 'Rians', 'Aups', 'Salernes', 'Montmeyan', 'Quinson'],
  address: { '@type': 'PostalAddress', addressRegion: 'Var', addressCountry: 'FR' },
  worksFor: { '@type': 'Organization', name: 'IAD France', url: 'https://www.iadfrance.fr' },
}

const VALEURS = [
  { titre: 'Transparence', texte: 'Un avis clair, argumenté, sans prix gonflé pour obtenir un mandat.' },
  { titre: 'Méthode', texte: 'Une lecture des données, du terrain et des contraintes réelles de chaque bien.' },
  { titre: 'Ancrage local', texte: 'Une présence en Provence Verte & Verdon, avec une attention portée aux micro-marchés.' },
  { titre: 'Suivi', texte: 'Un accompagnement humain, de la première question jusqu’à la signature.' },
]

const COMMUNES = ['Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux', 'Tavernes', 'Rians', 'Aups', 'Salernes', 'Varages', 'Esparron-de-Verdon']

function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

export default function AProposPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(personJsonLd)} />

      <section className="relative overflow-hidden bg-paper px-6 py-20 lg:py-24">
        <div className="absolute right-0 top-0 h-80 w-80 translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-[75rem] items-center gap-12 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="order-2 lg:order-1">
            <div className="relative min-h-[32rem] overflow-hidden rounded-[2.2rem] border border-white/70 bg-foreground shadow-2xl">
              <Image src="/alexandre-lopez.jpg" alt="Alexandre Lopez, conseiller immobilier iad" fill sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Alexandre Lopez</p>
                <p className="mt-2 font-serif text-3xl font-medium tracking-[-0.035em]">Conseiller immobilier iad</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Mon approche</p>
            <h1 className="font-serif text-4xl font-medium leading-[1.03] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
              Une approche locale, claire et exigeante.
            </h1>
            <div className="mt-7 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                Je suis Alex Lopez, mandataire immobilier iad en Provence Verte & Verdon. Mon rôle est simple : vous aider à décider avec les bonnes informations, au bon moment.
              </p>
              <p>
                Ici, pas de discours artificiel. Un projet immobilier demande une lecture précise du bien, du marché local, du délai et de vos objectifs.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-border bg-white p-4"><p className="text-2xl font-bold text-brand">100%</p><p className="mt-1 text-xs text-muted">Accompagnement</p></div>
              <div className="rounded-2xl border border-border bg-white p-4"><p className="text-2xl font-bold text-brand">0 €</p><p className="mt-1 text-xs text-muted">Avis initial</p></div>
              <div className="rounded-2xl border border-border bg-white p-4"><p className="text-2xl font-bold text-brand">24h</p><p className="mt-1 text-xs text-muted">Réponse</p></div>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="primary" size="lg"><Link href="/contact">Me contacter <ArrowRight size={16} /></Link></Button>
              <Button asChild variant="outline" size="lg"><a href={'tel:' + PHONE_RAW}><Phone size={16} /> {PHONE_DISPLAY}</a></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-[75rem] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Ce qui me guide</p>
            <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] text-foreground md:text-5xl">Des repères simples pour avancer.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {VALEURS.map(function (v) {
              return (
                <div key={v.titre} className="rounded-[1.6rem] border border-border bg-paper p-7">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-sm"><CheckCircle2 size={18} /></div>
                  <h3 className="text-xl font-bold tracking-[-0.02em] text-foreground">{v.titre}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{v.texte}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand-dark px-6 py-24 text-white">
        <div className="mx-auto grid max-w-[75rem] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-light"><Calendar size={14} /> Parcours</p>
            <h2 className="font-serif text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">De la stratégie à l’immobilier de proximité.</h2>
            <p className="mt-6 max-w-xl leading-relaxed text-white/75">
              Mon parcours en stratégie et organisation m’a donné une méthode : structurer, comparer, décider. Je l’applique aujourd’hui à l’immobilier, avec une approche humaine et ancrée localement.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6 backdrop-blur"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-light">Avant</p><p className="mt-2 text-xl font-bold">Stratégie & organisation</p><p className="mt-2 text-sm text-white/70">Analyse, accompagnement, structuration de projets complexes.</p></div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6 backdrop-blur"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-light">Aujourd’hui</p><p className="mt-2 text-xl font-bold">iad — Provence Verte & Verdon</p><p className="mt-2 text-sm text-white/70">Estimation, vente, achat et accompagnement immobilier local.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-paper px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-brand"><MapPin size={18} /><p className="text-xs font-semibold uppercase tracking-[0.18em]">Zone d’intervention</p></div>
          <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] text-foreground md:text-5xl">Provence Verte & Verdon</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">J’interviens sur les communes de Provence Verte et du Verdon, avec une lecture locale des biens, des prix et des attentes des acquéreurs.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-2">
            {COMMUNES.map(function (c) {
              const slug = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
              return <Link key={c} href={'/marche/' + slug} className="rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground transition-colors hover:border-brand hover:text-brand">{c}</Link>
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.2rem] border border-border bg-foreground p-10 text-center text-white shadow-2xl md:p-14">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-light">Travaillons ensemble</p>
          <h2 className="font-serif text-3xl font-medium tracking-[-0.04em] md:text-5xl">Un projet immobilier ?</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/70">Estimation, vente, achat ou simple question sur le marché en Provence Verte & Verdon. Réponse personnalisée, sans engagement.</p>
          <div className="mt-8"><Button asChild variant="primary" size="lg"><Link href="/outils">Commencer avec les outils <ArrowRight size={16} /></Link></Button></div>
        </div>
      </section>
    </>
  )
}
