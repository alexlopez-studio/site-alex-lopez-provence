import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Home, ShieldCheck, TriangleAlert } from 'lucide-react'
import { env } from '@/lib/env'

const siteUrl = env.app.siteUrl || 'https://alexlopez-provence.fr'
const pageUrl = siteUrl + '/blog/vendre-sa-maison-sans-agence'

const faqs = [
  {
    question: 'Peut-on vendre sa maison sans agence ?',
    answer: 'Oui, un propriétaire peut vendre seul. Il faut toutefois gérer le prix, l’annonce, les demandes, les visites, les diagnostics, la négociation et la coordination avec le notaire.',
  },
  {
    question: 'Quel est le principal risque d’une vente sans agence ?',
    answer: 'Le principal risque est de mal positionner le prix : trop haut, le bien reste visible trop longtemps ; trop bas, le vendeur laisse de la valeur sur la table.',
  },
  {
    question: 'Faut-il faire estimer son bien avant de vendre seul ?',
    answer: 'Oui. Même en vente entre particuliers, un avis de valeur permet de partir d’une fourchette réaliste, argumentée par les comparables et les caractéristiques du bien.',
  },
  {
    question: 'Une agence est-elle obligatoire pour vendre ?',
    answer: 'Non. L’agence n’est pas obligatoire. Son intérêt dépend du temps disponible, du niveau de préparation, de la complexité du bien et de la capacité à filtrer les acquéreurs.',
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
        '@type': 'Article',
        headline: 'Vendre sa maison sans agence : bonne idée ou risque à éviter ?',
        description: 'Avantages, limites, erreurs de prix et alternatives avant de vendre sa maison sans agence en Provence Verte & Verdon.',
        author: { '@type': 'Person', name: 'Alexandre Lopez' },
        publisher: { '@type': 'Organization', name: 'Alexandre Lopez — Conseiller immobilier iad France', url: siteUrl },
        datePublished: '2026-05-23',
        mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: siteUrl + '/blog' },
          { '@type': 'ListItem', position: 3, name: 'Vendre sa maison sans agence', item: pageUrl },
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

export const metadata: Metadata = {
  title: 'Vendre sa maison sans agence : avantages, risques et alternatives',
  description: 'Vendre sans agence peut sembler simple. Découvrez les avantages, les risques, les erreurs de prix et les alternatives avant de vendre votre maison.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Vendre sa maison sans agence : bonne idée ou risque à éviter ?',
    description: 'Un guide clair pour décider si vous pouvez vendre seul ou si un accompagnement peut sécuriser votre vente.',
    url: pageUrl,
    type: 'article',
    publishedTime: '2026-05-23',
  },
}

function CtaBlock() {
  return (
    <div className="my-10 rounded-[2rem] bg-gradient-to-br from-brand to-brand-hover p-8 text-white shadow-xl md:p-10">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-white/80">Avant de choisir</p>
      <h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">Commencez par connaître la vraie valeur de votre maison.</h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/86">Que vous vendiez seul ou accompagné, le point de départ reste le même : une fourchette de prix réaliste, expliquée et cohérente avec le marché local.</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href="/avis-de-valeur-immobilier" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand transition-colors hover:bg-[#f4f7f8]">Demander un avis de valeur <ArrowRight size={16} /></Link>
        <Link href="/outils/vendre" className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand">Estimer mon bien</Link>
      </div>
    </div>
  )
}

export default function VendreSansAgencePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(buildJsonLd())} />
      <main>
        <section className="relative overflow-hidden bg-[#f4f7f8] px-6 pb-16 pt-28 lg:pb-24 lg:pt-36">
          <div className="absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-brand">Conseils vendeurs</p>
            <h1 className="text-4xl font-bold leading-tight tracking-[-0.05em] text-foreground md:text-6xl">Vendre sa maison sans agence : bonne idée ou risque à éviter ?</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">Vendre seul peut permettre d’économiser des honoraires. Mais le vrai sujet n’est pas seulement l’économie : c’est votre capacité à fixer le bon prix, filtrer les acquéreurs et sécuriser chaque étape.</p>
          </div>
        </section>

        <article className="bg-white px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-xl leading-relaxed text-foreground">En Provence Verte & Verdon, deux maisons proches sur la carte peuvent se vendre à des prix très différents. Vue, terrain, état, DPE, accès, travaux, stationnement ou rareté locale changent fortement la perception d’un acheteur.</p>

            <CtaBlock />

            <h2 className="mt-12 text-3xl font-bold tracking-[-0.04em] text-foreground">Pourquoi certains propriétaires veulent vendre seuls</h2>
            <p className="mt-4 leading-relaxed text-muted">La motivation est compréhensible : éviter les honoraires, garder la main sur les visites, gérer le calendrier soi-même et parler directement avec les acheteurs. Pour un bien simple, bien placé, au bon prix et avec un vendeur disponible, la vente entre particuliers peut fonctionner.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                'Économie apparente sur les honoraires.',
                'Contact direct avec les acquéreurs.',
                'Contrôle du rythme des visites.',
                'Liberté dans la négociation.',
              ].map((item) => <p key={item} className="flex gap-3 rounded-2xl bg-[#f4f7f8] p-4 text-sm font-medium text-foreground"><CheckCircle2 className="shrink-0 text-brand" size={18} />{item}</p>)}
            </div>

            <h2 className="mt-12 text-3xl font-bold tracking-[-0.04em] text-foreground">Le premier risque : partir avec le mauvais prix</h2>
            <p className="mt-4 leading-relaxed text-muted">Le prix est souvent le point le plus sensible. Une surestimation peut donner l’impression de “tester le marché”, mais elle peut surtout user l’annonce, réduire l’urgence et faire entrer le bien dans une logique de négociation. À l’inverse, une sous-estimation peut accélérer la vente tout en laissant une partie de la valeur au bénéfice de l’acheteur.</p>
            <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-6">
              <div className="flex items-start gap-3">
                <TriangleAlert className="mt-1 shrink-0 text-orange-600" size={22} />
                <div>
                  <h3 className="font-bold text-foreground">Un prix moyen au m² ne suffit pas.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">Une maison de village à rafraîchir, une maison avec terrain, une bastide rénovée ou un bien avec DPE défavorable ne se comparent pas avec la même grille. L’avis de valeur sert à expliquer ces écarts.</p>
                </div>
              </div>
            </div>

            <h2 className="mt-12 text-3xl font-bold tracking-[-0.04em] text-foreground">Les autres points à gérer si vous vendez seul</h2>
            <div className="mt-6 space-y-4">
              {[
                ['Préparer les documents', 'Diagnostics, titre de propriété, taxe foncière, travaux, servitudes, copropriété éventuelle : un dossier incomplet ralentit les échanges.'],
                ['Rédiger une annonce crédible', 'Il faut valoriser sans survendre, montrer les points forts et ne pas masquer les sujets que l’acheteur découvrira ensuite.'],
                ['Filtrer les demandes', 'Toutes les prises de contact ne se valent pas. Il faut vérifier le projet, le financement, le calendrier et la cohérence de la visite.'],
                ['Négocier sans perdre le fil', 'Une négociation ne porte pas seulement sur le prix : délai, conditions suspensives, mobilier, travaux et calendrier comptent aussi.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-[#f4f7f8] p-6">
                  <h3 className="flex items-center gap-3 text-lg font-bold text-foreground"><FileText className="text-brand" size={20} />{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-3xl font-bold tracking-[-0.04em] text-foreground">Vendre seul, avec mandat simple ou avec exclusivité ?</h2>
            <p className="mt-4 leading-relaxed text-muted">Il n’y a pas une réponse unique. Le bon choix dépend de votre disponibilité, de la complexité du bien, de votre connaissance du marché et du niveau de confiance que vous souhaitez créer auprès des acquéreurs.</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
                {[
                  ['Vente seul', 'Souple, économique en apparence, mais demande du temps et une bonne méthode.'],
                  ['Mandat simple', 'Plusieurs canaux possibles, mais le bien peut perdre en cohérence si le prix ou les annonces divergent.'],
                  ['Exclusivité', 'Plus engageant, mais peut renforcer la stratégie, le suivi, la qualité de présentation et la négociation.'],
                ].map(([title, text]) => (
                  <div key={title} className="p-6">
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="mt-12 text-3xl font-bold tracking-[-0.04em] text-foreground">La méthode prudente avant de décider</h2>
            <ol className="mt-6 space-y-4">
              {[
                'Obtenir une première fourchette de valeur réaliste.',
                'Comparer avec les biens réellement concurrents dans la commune.',
                'Identifier les points qui peuvent freiner : DPE, travaux, accès, terrain, stationnement.',
                'Choisir une stratégie : vendre seul, tester avec méthode, ou confier le bien avec un cadre clair.',
              ].map((item, index) => <li key={item} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{index + 1}</span><span className="pt-1 text-muted">{item}</span></li>)}
            </ol>

            <h2 className="mt-12 text-3xl font-bold tracking-[-0.04em] text-foreground">Et en Provence Verte & Verdon ?</h2>
            <p className="mt-4 leading-relaxed text-muted">Les marchés de <Link href="/marche/barjols" className="font-semibold text-brand underline">Barjols</Link>, <Link href="/marche/cotignac" className="font-semibold text-brand underline">Cotignac</Link>, <Link href="/marche/lorgues" className="font-semibold text-brand underline">Lorgues</Link>, <Link href="/marche/brignoles" className="font-semibold text-brand underline">Brignoles</Link> ou <Link href="/marche/ponteves" className="font-semibold text-brand underline">Pontevès</Link> ne se lisent pas de la même façon. Un village recherché, une ville centre, une maison avec terrain ou un bien à travaux n’attirent pas les mêmes acheteurs.</p>
            <p className="mt-4 leading-relaxed text-muted">Avant de choisir votre mode de vente, commencez par clarifier la valeur, les points forts et les freins. Vous pourrez ensuite décider plus sereinement si la vente seule est réaliste ou si un accompagnement peut vous faire gagner en efficacité.</p>

            <CtaBlock />

            <section className="mt-14">
              <h2 className="text-3xl font-bold tracking-[-0.04em] text-foreground">Questions fréquentes</h2>
              <div className="mt-6 space-y-4">
                {faqs.map((item) => (
                  <div key={item.question} className="rounded-2xl bg-[#f4f7f8] p-6">
                    <h3 className="flex items-start gap-3 text-lg font-bold text-foreground"><ShieldCheck className="mt-1 shrink-0 text-brand" size={18} />{item.question}</h3>
                    <p className="mt-3 pl-8 text-sm leading-relaxed text-muted">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>
      </main>
    </>
  )
}
