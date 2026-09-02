import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { env } from '@/lib/env'
import { LOCAL_PAGES, isKnownCommune, type LocalPage } from '@/data/local-pages'
import { ConceptMotionProvider } from '@/components/concept/ConceptMotionProvider'
import '@/components/concept/concept.css'

type PageProps = { params: Promise<{ commune: string }> }

const siteUrl = env.app.siteUrl || 'https://alexandrelopez.fr'

function formatCommune(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join('-')
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
        areaServed: [page.name, 'Haut-Var', 'Provence Verte', 'Var'],
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
    title: page?.title ?? 'Immobilier à ' + label + ' : prix, marché et estimation | Alexandre Lopez',
    description:
      page?.description ??
      'Préparez votre projet immobilier à ' +
        label +
        ' d’après les ventes DVF réelles avec Alexandre Lopez, conseiller immobilier en Provence Verte.',
    alternates: { canonical: siteUrl + '/immobilier/' + commune },
    robots: page ? undefined : { index: false, follow: true },
    openGraph: page
      ? {
          title: page.title,
          description: page.description,
          url: siteUrl + '/immobilier/' + commune,
          type: 'website',
        }
      : undefined,
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
    <div className="concept-scope">
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(buildJsonLd(page))} />
      <ConceptMotionProvider showLoader={true} loaderSubtitle={page.name}>
        <main>
          {/* 1. HERO CARD (Bleu profond #006390, Stacked Card animée) */}
          <section
            id="hero"
            style={{
              height: 'auto',
              minHeight: 'auto',
              padding: '2.5rem 1.5rem 3.5rem',
              position: 'relative',
              borderRadius: 'var(--radius-card-lg)',
            }}
          >
            {/* Navigation Bar */}
            <header
              className="nav-header flex justify-between items-center"
              style={{ position: 'relative', padding: '0 0 3rem' }}
            >
              <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                <svg
                  style={{ width: '1.25rem', height: '1.25rem' }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-base font-medium uppercase tracking-wider">Alex. Lopez | iad</span>
              </Link>
              <Link href="/vendre-sans-agence" className="btn-pill light">
                Télécharger le guide
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </header>

            <div className="max-w-4xl">
              <div
                className="eyebrow light mb-4 inview-node"
                data-inview="y:18,opacity:0,delay:60,t:180,f:24"
              >
                <div className="dot" />
                Marché Immobilier Local · Var (83)
              </div>
              <h1
                className="clip-mask"
                style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                  fontWeight: 500,
                  lineHeight: 0.96,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  margin: '1rem 0',
                }}
              >
                <span className="inner block">
                  Immobilier à {page.name} : ce que valent les maisons aujourd’hui
                </span>
              </h1>
              <p
                className="inview-node"
                data-inview="y:24,opacity:0,delay:150,t:170,f:24"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: '44rem',
                  marginTop: '1.5rem',
                }}
              >
                {page.intro}
              </p>

              <div
                className="flex flex-wrap items-center gap-4 mt-8 pt-6 inview-node"
                data-inview="y:16,opacity:0,delay:240,t:160,f:22"
                style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70">
                  <span className="w-2 h-2 rounded-full bg-[#25cfff]" />
                  Données de marché actualisées · Septembre 2026
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Ventes réelles enregistrées DGFiP (DVF)
                </div>
              </div>
            </div>
          </section>

          {/* 2. SECTION MARCHÉ DVF (Fond gris #F4F4F5 avec inview spring reveals) */}
          <section
            id="marche"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-card-lg)',
              padding: '4.5rem 1.5rem',
              marginTop: '0.75rem',
            }}
          >
            <div className="max-w-6xl mx-auto">
              <div
                className="eyebrow dark mb-3 inview-node"
                data-inview="y:16,opacity:0,delay:40,t:170,f:24"
              >
                <div className="dot" />
                Indicateurs & Analyse Foncière
              </div>
              <h2
                className="clip-mask"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                }}
              >
                <span className="inner block">
                  Le marché de {page.name} en chiffres
                </span>
              </h2>

              {/* Cartes de métriques avec hover-lift et ressorts */}
              <div
                style={{
                  marginTop: '2.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div
                  className="glass-card inview-node hover-lift"
                  data-inview="y:35,scale:0.96,opacity:0,delay:80,t:170,f:26"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--hairline)',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-card)',
                    color: 'var(--ink)',
                  }}
                >
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                    Repère Prix Moyen / m²
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: 'var(--brand-deep)',
                    }}
                  >
                    2 400 – 3 800 €
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">Variable selon terrain, vue et DPE</div>
                </div>

                <div
                  className="glass-card inview-node hover-lift"
                  data-inview="y:35,scale:0.96,opacity:0,delay:160,t:170,f:26"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--hairline)',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-card)',
                    color: 'var(--ink)',
                  }}
                >
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                    Source Officielle
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: 'var(--ink)',
                    }}
                  >
                    DVF DGFiP
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">Ventes actées chez les notaires</div>
                </div>

                <div
                  className="glass-card inview-node hover-lift"
                  data-inview="y:35,scale:0.96,opacity:0,delay:240,t:170,f:26"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--hairline)',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-card)',
                    color: 'var(--ink)',
                  }}
                >
                  <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                    Délai Moyen Constaté
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                      fontWeight: 500,
                      lineHeight: 1,
                      color: 'var(--brand-deep)',
                    }}
                  >
                    30 à 60 jours
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">Dès lors que le prix initial est juste</div>
                </div>
              </div>

              {/* Paragraphes d'analyse */}
              <div
                className="inview-node hover-scale-card"
                data-inview="y:30,opacity:0,delay:180,t:160,f:24"
                style={{
                  marginTop: '2rem',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-card)',
                  padding: '2.5rem',
                  border: '1px solid var(--hairline)',
                }}
              >
                <h3 style={{ fontSize: '1.35rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                  La réalité du terrain à {page.name}
                </h3>
                <p style={{ color: 'var(--ink-soft)', lineHeight: 1.65, fontSize: '1.025rem', maxWidth: '48rem' }}>
                  {page.priceSummary}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
                    gap: '1rem',
                    marginTop: '2rem',
                  }}
                >
                  {page.marketBullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="inview-node"
                      data-inview={`y:20,opacity:0,delay:${100 + idx * 40},t:160,f:24`}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                        background: 'var(--surface)',
                        padding: '1rem 1.25rem',
                        borderRadius: '1rem',
                      }}
                    >
                      <span
                        style={{
                          width: '0.5rem',
                          height: '0.5rem',
                          borderRadius: '50%',
                          background: 'var(--brand)',
                          marginTop: '0.45rem',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--ink)' }}>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. SECTION CE QUI FAIT LA VALEUR (Fond blanc #FFFFFF) */}
          <section
            id="valeur"
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-card-lg)',
              padding: '4.5rem 1.5rem',
              marginTop: '0.75rem',
              border: '1px solid var(--hairline)',
            }}
          >
            <div className="max-w-6xl mx-auto">
              <div
                className="eyebrow dark mb-3 inview-node"
                data-inview="y:16,opacity:0,delay:40,t:170,f:24"
              >
                <div className="dot" />
                Critères de Valorisation
              </div>
              <h2
                className="clip-mask"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                }}
              >
                <span className="inner block">
                  Ce qui fait la valeur d’une maison à {page.name}
                </span>
              </h2>
              <p
                className="inview-node"
                data-inview="y:20,opacity:0,delay:120,t:160,f:24"
                style={{ color: 'var(--ink-soft)', marginTop: '0.75rem', maxWidth: '38rem', lineHeight: 1.6 }}
              >
                Un prix moyen ne tient pas compte des spécificités de votre bien. Voici les éléments concrets examinés par
                les acheteurs sur ce secteur varois.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
                  gap: '1.75rem',
                  marginTop: '2.5rem',
                }}
              >
                <div
                  className="inview-node hover-lift"
                  data-inview="y:35,scale:0.96,opacity:0,delay:100,t:170,f:26"
                  style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-card)' }}
                >
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 500,
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--brand)' }} />
                    Typologies fréquentes de biens
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {page.propertyTypes.map((type, i) => (
                      <li
                        key={i}
                        style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: 1.55, display: 'flex', gap: '0.65rem' }}
                      >
                        <span style={{ color: 'var(--brand)', fontWeight: 700 }}>—</span>
                        <span>{type}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="inview-node hover-lift"
                  data-inview="y:35,scale:0.96,opacity:0,delay:200,t:170,f:26"
                  style={{
                    background: 'var(--brand-deep)',
                    color: '#ffffff',
                    padding: '2rem',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 500,
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--brand-light)' }}
                    />
                    Facteurs d’évaluation déterminants
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {page.estimationFactors.map((factor, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255,255,255,0.85)',
                          lineHeight: 1.55,
                          display: 'flex',
                          gap: '0.65rem',
                        }}
                      >
                        <span style={{ color: 'var(--brand-light)', fontWeight: 700 }}>✓</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {page.international && (
                <div
                  className="inview-node"
                  data-inview="y:28,opacity:0,delay:120,t:160,f:24"
                  style={{
                    marginTop: '2rem',
                    padding: '2rem',
                    borderRadius: 'var(--radius-card)',
                    background: 'linear-gradient(135deg, rgba(0,99,144,0.06), rgba(0,180,236,0.12))',
                    border: '1px solid rgba(0,180,236,0.2)',
                  }}
                >
                  <div className="eyebrow dark mb-2">
                    <div className="dot" />
                    Clientèle Internationale & Propriétés
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {page.international.title}
                  </h4>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '0.925rem', lineHeight: 1.6, maxWidth: '48rem' }}>
                    {page.international.text}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 4. SECTION VOTRE CONSEILLER (Fond bleu profond #006390 avec portrait interactif) */}
          <section
            id="conseiller"
            style={{
              background: 'var(--brand-deep)',
              color: '#ffffff',
              borderRadius: 'var(--radius-card-lg)',
              padding: '4.5rem 1.5rem',
              marginTop: '0.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
              <div
                style={{ flex: '1' }}
                className="inview-node"
                data-inview="y:30,opacity:0,delay:80,t:160,f:24"
              >
                <div className="eyebrow light mb-3">
                  <div className="dot" />
                  Expertise de Terrain
                </div>
                <h2
                  className="clip-mask"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                    fontWeight: 500,
                    lineHeight: 1.05,
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span className="inner block">
                    Votre conseiller immobilier à {page.name}
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: '1.075rem',
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.85)',
                    marginTop: '1.25rem',
                  }}
                >
                  Implanté au cœur de la Provence Verte, j’accompagne les propriétaires de {page.name} avec une méthode
                  rigoureuse : estimation factuelle appuyée sur les données DVF réelles, mise en valeur visuelle premium,
                  filtrage financier des acheteurs et suivi complet jusqu’à l’acte authentique chez le notaire.
                </p>
                <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', marginTop: '0.75rem' }}>
                  Mon objectif : vous donner une vision claire et sans complaisance pour réussir votre vente dans les
                  meilleures conditions de prix et de délai.
                </p>

                <div
                  style={{
                    marginTop: '2.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  <Link href="/vendre-sans-agence" className="iad-gelule">
                    Télécharger le guide gratuit
                  </Link>
                  <a
                    href="tel:+33613180168"
                    className="btn-pill light"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    06 13 18 01 68
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>

              <div
                style={{ width: '16rem', flexShrink: 0 }}
                className="inview-node hover-scale-card"
                data-inview="y:40,scale:0.94,opacity:0,delay:150,t:180,f:24"
              >
                <div
                  style={{
                    borderRadius: 'var(--radius-card)',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    position: 'relative',
                    aspectRatio: '3/4',
                  }}
                >
                  <Image
                    src="/concept/alexandre-photo.jpg"
                    alt="Alexandre Lopez — Conseiller Immobilier iad"
                    fill
                    className="object-cover object-top"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      left: '0.75rem',
                      right: '0.75rem',
                      background: 'rgba(17,24,39,0.75)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderRadius: '0.75rem',
                      padding: '0.65rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.925rem', fontWeight: 500, color: '#ffffff' }}>Alexandre Lopez</div>
                    <div style={{ fontSize: '0.725rem', color: 'rgba(255,255,255,0.75)' }}>Conseiller Immobilier iad</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. SECTION FAQ LOCALE (Fond gris #F4F4F5 avec cartes animées) */}
          <section
            id="faq"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-card-lg)',
              padding: '4.5rem 1.5rem',
              marginTop: '0.75rem',
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div
                className="eyebrow dark mb-3 text-center flex justify-center inview-node"
                data-inview="y:16,opacity:0,delay:40,t:170,f:24"
              >
                <div className="dot" />
                Réponses Claires
              </div>
              <h2
                className="clip-mask"
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  fontWeight: 500,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                <span className="inner block">
                  Questions fréquentes sur l’immobilier à {page.name}
                </span>
              </h2>

              <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {page.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="inview-node hover-lift"
                    data-inview={`y:28,scale:0.97,opacity:0,delay:${80 + idx * 70},t:170,f:24`}
                    style={{
                      background: '#ffffff',
                      borderRadius: 'var(--radius-card)',
                      padding: '1.75rem',
                      border: '1px solid var(--hairline)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 500,
                        color: 'var(--ink)',
                        marginBottom: '0.65rem',
                      }}
                    >
                      {item.question}
                    </h3>
                    <p style={{ fontSize: '0.925rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. SECTION COMMUNES PROCHES & FOOTER (Bleu profond #006390) */}
          <footer
            id="footer"
            style={{
              background: 'var(--brand-deep)',
              color: '#ffffff',
              borderRadius: 'var(--radius-card-lg)',
              padding: '4rem 1.5rem',
              marginTop: '0.75rem',
            }}
          >
            <div className="max-w-6xl mx-auto">
              {/* Maillage des communes proches */}
              <div
                className="inview-node"
                data-inview="y:24,opacity:0,delay:60,t:160,f:24"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '2.5rem', marginBottom: '2.5rem' }}
              >
                <div className="eyebrow light mb-3">
                  <div className="dot" />
                  Maillage Territorial
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 500, marginBottom: '1.25rem' }}>
                  Communes limitrophes en Haut-Var & Provence Verte
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {page.nearbyLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="btn-pill light"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textTransform: 'none',
                        letterSpacing: 'normal',
                        padding: '0.6rem 1.15rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      Immobilier {link.label} →
                    </Link>
                  ))}
                  <Link
                    href="/"
                    className="btn-pill light"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.25)',
                      textTransform: 'none',
                      letterSpacing: 'normal',
                      padding: '0.6rem 1.15rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    Accueil du site
                  </Link>
                </div>
              </div>

              {/* Footer 3 colonnes */}
              <div
                className="footer-cols"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
                  gap: '2.5rem',
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      style={{ width: '1.25rem', height: '1.25rem' }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Alex. Lopez
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                    Conseiller immobilier indépendant iad France · Spécialiste de la vente et de l’évaluation de maisons en
                    Provence & Côte d’Azur.
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Contact direct
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                    Téléphone :{' '}
                    <a href="tel:+33613180168" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                      06 13 18 01 68
                    </a>
                    <br />
                    Email :{' '}
                    <a
                      href="mailto:alexandre.lopez@iadfrance.fr"
                      style={{ color: '#ffffff', textDecoration: 'underline' }}
                    >
                      alexandre.lopez@iadfrance.fr
                    </a>
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Liens utiles
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <li>
                      <Link href="/vendre-sans-agence" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                        Le Guide du Vendeur (41 pages)
                      </Link>
                    </li>
                    <li>
                      <Link href="/mentions-legales" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                        Mentions légales & RSAC
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/politique-confidentialite"
                        style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
                      >
                        Politique de confidentialité
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  marginTop: '2.5rem',
                  paddingTop: '1.25rem',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.6)',
                  textAlign: 'center',
                }}
              >
                © {new Date().getFullYear()} Alexandre Lopez · Agent commercial indépendant SAS I@D France (RSAC Draguignan)
                · Tous droits réservés.
              </div>
            </div>
          </footer>
        </main>
      </ConceptMotionProvider>
    </div>
  )
}

function GenericCommunePage({ commune }: { commune: string }) {
  const label = formatCommune(commune)

  return (
    <div className="concept-scope">
      <ConceptMotionProvider showLoader={true} loaderSubtitle={label}>
        <main>
          <section
            id="hero"
            style={{
              height: 'auto',
              minHeight: 'auto',
              padding: '3rem 1.5rem 4rem',
              position: 'relative',
              borderRadius: 'var(--radius-card-lg)',
            }}
          >
            <header
              className="nav-header flex justify-between items-center"
              style={{ position: 'relative', padding: '0 0 3rem' }}
            >
              <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                <svg
                  style={{ width: '1.25rem', height: '1.25rem' }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-base font-medium uppercase tracking-wider">Alex. Lopez | iad</span>
              </Link>
              <Link href="/vendre-sans-agence" className="btn-pill light">
                Télécharger le guide
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </header>

            <div className="max-w-3xl">
              <div
                className="eyebrow light mb-4 inview-node"
                data-inview="y:18,opacity:0,delay:60,t:180,f:24"
              >
                <div className="dot" />
                Marché Local · Haut-Var & Provence Verte
              </div>
              <h1
                className="clip-mask"
                style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                  fontWeight: 500,
                  lineHeight: 0.96,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  margin: '1rem 0',
                }}
              >
                <span className="inner block">
                  Immobilier à {label}
                </span>
              </h1>
              <p
                className="inview-node"
                data-inview="y:24,opacity:0,delay:140,t:170,f:24"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: '38rem',
                  marginTop: '1.5rem',
                }}
              >
                Cette page locale est en cours d’actualisation avec les dernières données DVF. En attendant, vous pouvez
                télécharger le guide pratique pour préparer votre projet de vente à {label}.
              </p>

              <div
                className="inview-node"
                data-inview="y:20,opacity:0,delay:220,t:160,f:24"
                style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                <Link href="/vendre-sans-agence" className="iad-gelule">
                  Recevoir le guide complet
                </Link>
                <Link href="/" className="btn-pill light">
                  Retour à l’accueil
                </Link>
              </div>
            </div>
          </section>
        </main>
      </ConceptMotionProvider>
    </div>
  )
}
