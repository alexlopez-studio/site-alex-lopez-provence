import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, Globe2, Home, Languages, MapPin, ShieldCheck } from 'lucide-react'
import { env } from '@/lib/env'

type PageProps = { params: Promise<{ commune: string }> }

type LocalPage = {
  slug: string
  name: string
  title: string
  description: string
  intro: string
  priceSummary: string
  marketBullets: string[]
  propertyTypes: string[]
  estimationFactors: string[]
  nearbyLinks: Array<{ href: string; label: string }>
  international?: {
    title: string
    text: string
    bullets: string[]
  }
  faq: Array<{ question: string; answer: string }>
}

const siteUrl = env.app.siteUrl || 'https://alexlopez-provence.fr'

const LOCAL_PAGES: Record<string, LocalPage> = {
  barjols: {
    slug: 'barjols',
    name: 'Barjols',
    title: 'Immobilier à Barjols : prix, estimation et conseils pour vendre',
    description: 'Vous vendez une maison à Barjols ? Repères de marché, critères de prix et avis de valeur local avec Alexandre Lopez, conseiller immobilier iad en Provence Verte & Verdon.',
    intro: 'À Barjols, le marché immobilier mélange maisons de village, biens avec travaux, maisons avec terrain et résidences secondaires. Pour vendre au bon prix, il faut dépasser le simple prix moyen au m² et lire précisément l’adresse, l’état du bien, la surface, le terrain, le DPE et la concurrence actuelle.',
    priceSummary: 'Les portails de prix affichent souvent des repères très variables à Barjols : certaines sources situent les maisons autour de 2 700 à 3 200 €/m², tandis que les appartements apparaissent souvent plus bas. Cet écart montre qu’un avis de valeur local est indispensable avant de fixer un prix de mise en vente.',
    marketBullets: [
      'Commune de Provence Verte & Verdon avec un marché plus accessible que certains villages très recherchés du Var intérieur.',
      'Forte différence de valeur entre une maison de village à rénover, une maison habitable avec extérieur et un bien rare avec vue ou terrain.',
      'Les travaux, le stationnement, l’accès, la luminosité et le DPE peuvent fortement modifier la perception du prix.',
      'La proximité de Pontevès, Tavernes, Varages et Cotignac crée des comparaisons utiles mais pas toujours équivalentes.',
    ],
    propertyTypes: [
      'Maisons de village avec cachet, parfois sans extérieur ou avec stationnement limité.',
      'Maisons familiales avec terrain dans les secteurs plus résidentiels.',
      'Biens à rafraîchir ou à rénover, sensibles au coût des travaux et au DPE.',
      'Résidences secondaires recherchées pour le calme, la Provence Verte et la proximité du Verdon.',
    ],
    estimationFactors: [
      'Adresse précise et facilité d’accès',
      'Surface habitable réellement exploitable',
      'Présence d’un jardin, d’une terrasse, d’un garage ou d’un stationnement',
      'État toiture, façade, menuiseries, électricité et humidité',
      'DPE, travaux à prévoir et capacité à rassurer l’acheteur',
      'Ventes comparables récentes dans un rayon cohérent',
    ],
    nearbyLinks: [
      { href: '/marche/cotignac', label: 'Cotignac' },
      { href: '/marche/brignoles', label: 'Brignoles' },
      { href: '/marche/ponteves', label: 'Pontevès' },
    ],
    faq: [
      {
        question: 'Quel est le prix immobilier à Barjols ?',
        answer: 'Les estimations publiques varient fortement selon les sources et le type de bien. Pour une maison à Barjols, les portails affichent souvent des repères autour de 2 700 à 3 200 €/m², mais une maison de village à travaux et une maison avec terrain ne se comparent pas directement.',
      },
      {
        question: 'Comment estimer une maison à Barjols ?',
        answer: 'Il faut croiser les ventes comparables, l’état du bien, la surface, le terrain, l’accès, le stationnement, le DPE et la concurrence actuelle. Un prix moyen au m² ne suffit pas pour décider d’un prix de mise en vente.',
      },
      {
        question: 'Quels biens se vendent à Barjols ?',
        answer: 'On trouve notamment des maisons de village, des maisons avec terrain, des biens anciens à rénover et des résidences secondaires. Les acheteurs regardent beaucoup l’état général, l’extérieur, la facilité de stationnement et le coût des travaux.',
      },
      {
        question: 'Pourquoi demander un avis de valeur à Barjols ?',
        answer: 'Un avis de valeur permet d’expliquer la fourchette de prix, de repérer les points forts et les freins, puis de choisir une stratégie de mise en vente réaliste pour éviter de bloquer la vente.',
      },
    ],
  },
  cotignac: {
    slug: 'cotignac',
    name: 'Cotignac',
    title: 'Immobilier à Cotignac : estimation maison et marché international',
    description: 'Marché immobilier de Cotignac : biens de caractère, maisons avec vue, clientèle française et internationale, estimation locale avec Alexandre Lopez iad.',
    intro: 'Cotignac fait partie des villages les plus recherchés du Var intérieur. Le marché y est plus sélectif : le cachet, la vue, la qualité de rénovation, l’extérieur et la capacité à séduire une clientèle française ou internationale peuvent créer de grands écarts de prix.',
    priceSummary: 'Les portails de prix affichent souvent des repères élevés à Cotignac : les maisons ressortent fréquemment autour de 3 600 à 4 200 €/m² selon les sources, avec des fourchettes très larges. Le prix dépend fortement de la rareté, de l’état, de la vue, du terrain et du positionnement du bien.',
    marketBullets: [
      'Village classé parmi les Plus Beaux Villages de France, avec une image forte auprès des acheteurs en recherche d’art de vivre provençal.',
      'Écart important entre appartement, maison de village, maison avec extérieur, bastide, propriété avec vue ou bien à rénover.',
      'La clientèle peut être locale, nationale ou internationale : la présentation, les informations techniques et la capacité à répondre en anglais comptent beaucoup.',
      'Le prix doit intégrer la rareté, mais rester lisible face aux comparables et aux biens concurrents.',
    ],
    propertyTypes: [
      'Maisons de village rénovées ou à rafraîchir, avec cachet et contraintes d’accès possibles.',
      'Maisons avec terrain, piscine ou vue, plus sensibles à la qualité de présentation.',
      'Bastides et biens de caractère nécessitant une stratégie de valorisation spécifique.',
      'Résidences secondaires ou projets patrimoniaux recherchés par une clientèle extérieure.',
    ],
    estimationFactors: [
      'Vue, calme, exposition et qualité de l’environnement immédiat',
      'Cachet architectural et cohérence des rénovations',
      'Terrain, piscine, terrasse, stationnement et accès',
      'État général, DPE, travaux et coûts d’entretien prévisibles',
      'Niveau de concurrence sur les biens similaires à Cotignac et autour',
      'Capacité à présenter le bien clairement en français et en anglais si nécessaire',
    ],
    nearbyLinks: [
      { href: '/marche/lorgues', label: 'Lorgues' },
      { href: '/marche/barjols', label: 'Barjols' },
      { href: '/marche/salernes', label: 'Salernes' },
    ],
    international: {
      title: 'Un positionnement utile pour les biens de caractère et les acheteurs internationaux.',
      text: 'Sur Cotignac, certains biens ne se vendent pas uniquement sur un prix au m². La qualité de présentation, les informations disponibles, la traduction des points clés et la capacité à rassurer une clientèle non locale peuvent faire la différence dès les premiers contacts.',
      bullets: [
        'Présentation claire du bien, de son état, de ses travaux et de son environnement.',
        'Capacité à échanger en français et en anglais avec des acheteurs extérieurs.',
        'Mise en avant du village, du cadre de vie, des accès, de la vue et du potentiel de résidence secondaire.',
        'Discours vendeur structuré pour éviter la surexposition d’un bien mal positionné.',
      ],
    },
    faq: [
      {
        question: 'Quel est le prix immobilier à Cotignac ?',
        answer: 'Les portails affichent souvent des niveaux supérieurs à beaucoup de communes voisines, avec des maisons fréquemment autour de 3 600 à 4 200 €/m² selon les sources. Mais les écarts sont importants selon la vue, l’état, le terrain, le cachet et la rareté.',
      },
      {
        question: 'Comment estimer une maison à Cotignac ?',
        answer: 'L’estimation doit tenir compte des comparables récents, mais aussi de la qualité de rénovation, du terrain, de la vue, du stationnement, de l’accès, du DPE et de la demande pour les biens de caractère.',
      },
      {
        question: 'Cotignac attire-t-il une clientèle internationale ?',
        answer: 'Oui, certains biens de caractère peuvent intéresser une clientèle extérieure ou internationale. Une présentation claire, des informations fiables et un accompagnement bilingue peuvent aider à sécuriser les échanges.',
      },
      {
        question: 'Pourquoi demander un avis de valeur à Cotignac ?',
        answer: 'Parce qu’un prix trop haut peut bloquer une vente, même sur un marché recherché. L’avis de valeur aide à justifier la fourchette, à valoriser les points forts et à choisir une stratégie de mise en vente cohérente.',
      },
    ],
  },
  lorgues: {
    slug: 'lorgues',
    name: 'Lorgues',
    title: 'Immobilier à Lorgues : estimation maison, bastide et propriété de caractère',
    description: 'Vous vendez une maison à Lorgues ? Repères de marché, biens de caractère, clientèle internationale et avis de valeur avec Alexandre Lopez iad.',
    intro: 'Lorgues attire une demande variée : familles locales, retraités, acheteurs de résidences secondaires et clientèle internationale en recherche de calme, de terrain, de piscine ou de propriété de caractère. Pour vendre une maison à Lorgues, la stratégie doit tenir compte du secteur, du niveau de prestations et de la concurrence premium.',
    priceSummary: 'Les repères publics situent souvent les maisons de Lorgues autour de 3 300 à 3 800 €/m², avec de fortes variations selon les quartiers, l’état, la vue, le terrain et les prestations. Certaines propriétés de caractère ou villas avec dépendances, piscine ou grand terrain sortent largement de la logique du prix moyen.',
    marketBullets: [
      'Marché diversifié : centre ancien, villas, bastides, propriétés avec terrain, secteurs résidentiels et biens de prestige.',
      'Les quartiers et l’environnement immédiat pèsent fortement dans l’estimation : accès, calme, vue, proximité du village ou isolement recherché.',
      'La clientèle internationale s’intéresse davantage aux biens d’exception, aux dépendances, aux terrains, piscines et vues dégagées.',
      'Le positionnement doit être précis pour éviter de confondre maison familiale classique et propriété patrimoniale.',
    ],
    propertyTypes: [
      'Maisons de village ou maisons proches du centre avec accès aux commerces et au marché.',
      'Villas familiales avec jardin, piscine ou garage dans les secteurs résidentiels.',
      'Bastides, mas, propriétés bourgeoises ou domaines avec terrain, oliviers, vignes ou dépendances.',
      'Biens de prestige recherchés par une clientèle française ou internationale.',
    ],
    estimationFactors: [
      'Secteur exact : centre, campagne, quartier recherché, accès et environnement immédiat',
      'Terrain, piscine, dépendances, vue, calme et potentiel de réception',
      'Qualité des rénovations, matériaux, cohérence architecturale et état technique',
      'DPE, chauffage, climatisation, assainissement et coûts d’entretien',
      'Comparables réellement pertinents : maison classique, villa ou propriété de caractère',
      'Présentation en français et en anglais pour toucher les acheteurs extérieurs quand le bien s’y prête',
    ],
    nearbyLinks: [
      { href: '/marche/cotignac', label: 'Cotignac' },
      { href: '/marche/salernes', label: 'Salernes' },
      { href: '/marche/brignoles', label: 'Brignoles' },
    ],
    international: {
      title: 'Un axe fort pour les propriétés, bastides et maisons de caractère.',
      text: 'Lorgues fait partie des communes où l’acheteur peut chercher autant un bien qu’un mode de vie : calme, espace, extérieur, accès au village, authenticité provençale et proximité des grands axes du Var. Pour ces biens, la commercialisation doit être claire, qualitative et capable de parler à une clientèle non locale.',
      bullets: [
        'Mettre en avant l’art de vivre : marché, gastronomie, campagne, accès au village et au littoral varois.',
        'Présenter les points techniques sans les masquer : assainissement, travaux, entretien, DPE, dépendances.',
        'Préparer les éléments utiles pour des acheteurs à distance : plans, vidéos, informations de charges et contexte local.',
        'Adapter le discours en français et en anglais pour sécuriser les premiers échanges.',
      ],
    },
    faq: [
      {
        question: 'Quel est le prix immobilier à Lorgues ?',
        answer: 'Les sources publiques placent souvent les maisons de Lorgues autour de 3 300 à 3 800 €/m², mais les écarts sont importants. Une maison de village, une villa familiale et une propriété avec terrain, piscine ou dépendances ne se comparent pas avec la même grille.',
      },
      {
        question: 'Comment estimer une maison à Lorgues ?',
        answer: 'Il faut qualifier le type de bien, le secteur exact, le terrain, les prestations, l’état technique, le DPE, les dépendances et les comparables réellement pertinents. Pour les biens de caractère, le prix moyen au m² est souvent insuffisant.',
      },
      {
        question: 'Lorgues attire-t-il des acheteurs internationaux ?',
        answer: 'Oui, notamment sur les bastides, villas avec piscine, propriétés avec terrain et biens de caractère. La qualité de présentation et la capacité à répondre en anglais peuvent aider à capter et rassurer ces acheteurs.',
      },
      {
        question: 'Pourquoi demander un avis de valeur à Lorgues ?',
        answer: 'Parce que le marché est segmenté. Un avis de valeur permet de distinguer une maison classique d’une propriété plus rare, d’expliquer la fourchette de prix et de choisir une stratégie adaptée au type d’acheteur visé.',
      },
    ],
  },
}

function formatCommune(slug: string) {
  return slug.split('-').filter(Boolean).map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1) }).join('-')
}

function buildJsonLd(page: LocalPage) {
  const url = siteUrl + '/marche/' + page.slug
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Marché immobilier', item: siteUrl + '/marche' },
          { '@type': 'ListItem', position: 3, name: page.name, item: url },
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
    alternates: { canonical: siteUrl + '/marche/' + commune },
    openGraph: page ? {
      title: page.title,
      description: page.description,
      url: siteUrl + '/marche/' + commune,
      type: 'website',
    } : undefined,
  }
}

export default async function CommunePage({ params }: PageProps) {
  const { commune } = await params
  const page = LOCAL_PAGES[commune]

  if (!page) return <GenericCommunePage commune={commune} />

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
              <Link href="/avis-de-valeur-immobilier" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Demander un avis de valeur <ArrowRight size={16} /></Link>
              <Link href="/outils/vendre" className="inline-flex items-center justify-center rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">Estimer mon bien</Link>
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
                <Link href="/avis-de-valeur-immobilier" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Comprendre l’avis de valeur <ArrowRight size={16} /></Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">Me contacter</Link>
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
              <Link href="/outils/vendre" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand transition-colors hover:bg-[#f4f7f8]">Estimer mon bien <ArrowRight size={16} /></Link>
              <Link href="/avis-de-valeur-immobilier" className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand">Voir la méthode</Link>
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
            <Link href="/avis-de-valeur-immobilier" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Demander un avis de valeur <ArrowRight size={16} /></Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">Me contacter</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
