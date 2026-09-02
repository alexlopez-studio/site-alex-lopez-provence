import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, Globe2, Home, Languages, MapPin, ShieldCheck } from 'lucide-react'
import { env } from '@/lib/env'

import { notFound } from 'next/navigation'

import { LOCAL_PAGES, isKnownCommune, type LocalPage } from '@/data/local-pages'

type PageProps = { params: Promise<{ commune: string }> }

const siteUrl = env.app.siteUrl || 'https://alexandrelopez.fr'


function formatCommune(slug: string) {
  return slug.split('-').filter(Boolean).map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1) }).join('-')
}

function buildJsonLd(page: LocalPage) {
  const url = siteUrl + '/immobilier/' + page.slug
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: page.name, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map(function (item) {
          return {
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          }
        }),
      },
      {
        '@type': ['RealEstateAgent', 'LocalBusiness'],
        '@id': siteUrl + '/#business',
        name: 'Alexandre Lopez — Conseiller immobilier iad France',
        url: siteUrl,
        telephone: '+33613180168',
        areaServed: [page.name, 'Provence Verte & Verdon', 'Var'],
      },
    ],
  }
}

function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { commune } = await params
  const page = LOCAL_PAGES[commune]
  const label = page?.name ?? formatCommune(commune)
  return {
    title: page?.title ?? 'Immobilier à ' + label + ' — Alexandre Lopez',
    description: page?.description ?? 'Préparez votre projet immobilier à ' + label + ' avec Alexandre Lopez, conseiller immobilier iad en Provence Verte & Verdon.',
    alternates: { canonical: siteUrl + '/immobilier/' + commune },
    // Une commune sans contenu rédigé ne rend qu'un gabarit d'attente : on la
    // garde accessible et suivable, mais hors index tant qu'elle est mince.
    robots: page ? undefined : { index: false, follow: true },
    openGraph: page ? {
      title: page.title,
      description: page.description,
      url: siteUrl + '/immobilier/' + commune,
      type: 'website',
    } : undefined,
  }
}

export default async function CommunePage({ params }: PageProps) {
  const { commune } = await params
  const page = LOCAL_PAGES[commune]

  if (!page) {
    if (!isKnownCommune(commune)) notFound()
    return <GenericCommunePage commune={commune} />
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(buildJsonLd(page))} />
      <main>
        <section className="relative overflow-hidden bg-[#f4f7f8] px-6 pb-16 pt-28 lg:pb-24 lg:pt-36">
          <div className="absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-6 flex items-center justify-center gap-2 text-brand"><MapPin size={18} /><p className="text-sm font-bold uppercase tracking-[0.22em]">Marché local · Provence Verte & Verdon</p></div>
            <h1 className="text-4xl font-bold leading-tight tracking-[-0.05em] text-foreground md:text-6xl lg:text-7xl">Immobilier à {page.name}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted">{page.intro}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/vendre-sans-agence" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Télécharger le guide <ArrowRight size={16} /></Link>
              <Link href="/vendre-sans-agence" className="inline-flex items-center justify-center rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">Télécharger le guide</Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">À retenir</p>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Le marché immobilier de {page.name} ne se résume pas à un prix moyen.</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">{page.priceSummary}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {page.marketBullets.map((item) => (
                <div key={item} className="rounded-2xl bg-[#f4f7f8] p-6 shadow-sm">
                  <CheckCircle2 className="mb-4 text-brand" size={22} />
                  <p className="text-sm font-medium leading-relaxed text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7f8] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Biens et critères</p>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Quels biens comparer avant de vendre à {page.name} ?</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                <Home className="mb-6 text-brand" size={30} />
                <h3 className="text-2xl font-bold tracking-[-0.03em] text-foreground">Typologies fréquentes</h3>
                <div className="mt-6 space-y-4">
                  {page.propertyTypes.map((item) => <p key={item} className="flex gap-3 text-sm leading-relaxed text-muted"><CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={18} />{item}</p>)}
                </div>
              </div>
              <div className="rounded-[2rem] bg-[#101828] p-8 text-white shadow-xl">
                <BarChart3 className="mb-6 text-brand-light" size={30} />
                <h3 className="text-2xl font-bold tracking-[-0.03em]">Ce qui fait varier l’estimation</h3>
                <div className="mt-6 space-y-4">
                  {page.estimationFactors.map((item) => <p key={item} className="flex gap-3 text-sm leading-relaxed text-white/78"><CheckCircle2 className="mt-0.5 shrink-0 text-brand-light" size={18} />{item}</p>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {page.international ? <InternationalSection page={page} /> : null}

        <section className="bg-white px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1fr]">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Avis de valeur</p>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Obtenir une estimation fiable à {page.name}.</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">Un avis de valeur doit expliquer la fourchette, pas seulement donner un chiffre. Je croise les ventes comparables, les caractéristiques du bien, les points forts, les points de vigilance et votre calendrier de vente.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/vendre-sans-agence" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Télécharger le guide <ArrowRight size={16} /></Link>
                <Link href="/vendre-sans-agence" className="inline-flex items-center justify-center rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">Télécharger le guide</Link>
              </div>
            </div>
            <div className="rounded-[2rem] bg-[#f4f7f8] p-8 shadow-sm">
              <h3 className="text-xl font-bold tracking-[-0.02em] text-foreground">Communes proches à comparer</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {page.nearbyLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:text-brand">{link.label}</Link>)}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7f8] px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">FAQ locale</p>
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">Questions fréquentes sur l’immobilier à {page.name}.</h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {page.faq.map((item) => (
              <div key={item.question} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="flex items-start gap-3 text-lg font-bold tracking-[-0.02em] text-foreground"><ShieldCheck className="mt-1 shrink-0 text-brand" size={18} />{item.question}</h3>
                <p className="mt-3 pl-8 text-sm leading-relaxed text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-brand to-brand-hover px-6 py-20 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] md:text-5xl">Vous vendez à {page.name} ? Commencez par un avis de valeur clair.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/88">L’objectif : fixer une stratégie réaliste, comprendre les comparables et éviter les erreurs de prix avant la mise en vente.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/vendre-sans-agence" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand transition-colors hover:bg-[#f4f7f8]">Télécharger le guide <ArrowRight size={16} /></Link>
              <Link href="/vendre-sans-agence" className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand">Télécharger le guide</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function InternationalSection({ page }: { page: LocalPage }) {
  if (!page.international) return null

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1fr]">
        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Globe2 size={28} />
          </div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Biens de caractère · FR/EN</p>
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">{page.international.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">{page.international.text}</p>
        </div>
        <div className="rounded-[2rem] bg-[#101828] p-8 text-white shadow-xl">
          <Languages className="mb-6 text-brand-light" size={30} />
          <h3 className="text-2xl font-bold tracking-[-0.03em]">Valorisation bilingue et approche internationale</h3>
          <div className="mt-6 space-y-4">
            {page.international.bullets.map((item) => <p key={item} className="flex gap-3 text-sm leading-relaxed text-white/78"><CheckCircle2 className="mt-0.5 shrink-0 text-brand-light" size={18} />{item}</p>)}
          </div>
        </div>
      </div>
    </section>
  )
}

async function GenericCommunePage({ commune }: { commune: string }) {
  const label = formatCommune(commune)

  return (
    <main>
      <section className="relative overflow-hidden bg-[#f4f7f8] px-6 pb-16 pt-28 lg:pb-24 lg:pt-36">
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-brand"><MapPin size={18} /><p className="text-sm font-bold uppercase tracking-[0.22em]">Marché local · Provence Verte & Verdon</p></div>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.05em] text-foreground md:text-6xl lg:text-7xl">Immobilier à {label}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">Cette page locale sera enrichie progressivement. En attendant, vous pouvez demander un premier avis de valeur pour préparer votre projet de vente à {label}.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/vendre-sans-agence" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Télécharger le guide <ArrowRight size={16} /></Link>
            <Link href="/vendre-sans-agence" className="inline-flex items-center justify-center rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">Télécharger le guide</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
