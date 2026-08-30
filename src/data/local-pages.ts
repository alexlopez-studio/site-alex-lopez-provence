/**
 * Contenu éditorial des pages communes (/immobilier/[commune]).
 *
 * Sorti du fichier de page pour que le sitemap, le maillage interne et la
 * future génération de nouvelles communes lisent tous la même source.
 * Les communes sans entrée ici retombent sur la page générique.
 */

import communes from '@/data/communes.json'

export type LocalPage = {
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

export const LOCAL_PAGES: Record<string, LocalPage> = {
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
      { href: '/immobilier/cotignac', label: 'Cotignac' },
      { href: '/immobilier/brignoles', label: 'Brignoles' },
      { href: '/immobilier/ponteves', label: 'Pontevès' },
    ],
    faq: [
      { question: 'Quel est le prix immobilier à Barjols ?', answer: 'Les estimations publiques varient fortement selon les sources et le type de bien. Pour une maison à Barjols, les portails affichent souvent des repères autour de 2 700 à 3 200 €/m², mais une maison de village à travaux et une maison avec terrain ne se comparent pas directement.' },
      { question: 'Comment estimer une maison à Barjols ?', answer: 'Il faut croiser les ventes comparables, l’état du bien, la surface, le terrain, l’accès, le stationnement, le DPE et la concurrence actuelle. Un prix moyen au m² ne suffit pas pour décider d’un prix de mise en vente.' },
      { question: 'Quels biens se vendent à Barjols ?', answer: 'On trouve notamment des maisons de village, des maisons avec terrain, des biens anciens à rénover et des résidences secondaires. Les acheteurs regardent beaucoup l’état général, l’extérieur, la facilité de stationnement et le coût des travaux.' },
      { question: 'Pourquoi demander un avis de valeur à Barjols ?', answer: 'Un avis de valeur permet d’expliquer la fourchette de prix, de repérer les points forts et les freins, puis de choisir une stratégie de mise en vente réaliste pour éviter de bloquer la vente.' },
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
      { href: '/immobilier/lorgues', label: 'Lorgues' },
      { href: '/immobilier/barjols', label: 'Barjols' },
      { href: '/immobilier/salernes', label: 'Salernes' },
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
      { question: 'Quel est le prix immobilier à Cotignac ?', answer: 'Les portails affichent souvent des niveaux supérieurs à beaucoup de communes voisines, avec des maisons fréquemment autour de 3 600 à 4 200 €/m² selon les sources. Mais les écarts sont importants selon la vue, l’état, le terrain, le cachet et la rareté.' },
      { question: 'Comment estimer une maison à Cotignac ?', answer: 'L’estimation doit tenir compte des comparables récents, mais aussi de la qualité de rénovation, du terrain, de la vue, du stationnement, de l’accès, du DPE et de la demande pour les biens de caractère.' },
      { question: 'Cotignac attire-t-il une clientèle internationale ?', answer: 'Oui, certains biens de caractère peuvent intéresser une clientèle extérieure ou internationale. Une présentation claire, des informations fiables et un accompagnement bilingue peuvent aider à sécuriser les échanges.' },
      { question: 'Pourquoi demander un avis de valeur à Cotignac ?', answer: 'Parce qu’un prix trop haut peut bloquer une vente, même sur un marché recherché. L’avis de valeur aide à justifier la fourchette, à valoriser les points forts et à choisir une stratégie de mise en vente cohérente.' },
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
      { href: '/immobilier/cotignac', label: 'Cotignac' },
      { href: '/immobilier/salernes', label: 'Salernes' },
      { href: '/immobilier/brignoles', label: 'Brignoles' },
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
      { question: 'Quel est le prix immobilier à Lorgues ?', answer: 'Les sources publiques placent souvent les maisons de Lorgues autour de 3 300 à 3 800 €/m², mais les écarts sont importants. Une maison de village, une villa familiale et une propriété avec terrain, piscine ou dépendances ne se comparent pas avec la même grille.' },
      { question: 'Comment estimer une maison à Lorgues ?', answer: 'Il faut qualifier le type de bien, le secteur exact, le terrain, les prestations, l’état technique, le DPE, les dépendances et les comparables réellement pertinents. Pour les biens de caractère, le prix moyen au m² est souvent insuffisant.' },
      { question: 'Lorgues attire-t-il des acheteurs internationaux ?', answer: 'Oui, notamment sur les bastides, villas avec piscine, propriétés avec terrain et biens de caractère. La qualité de présentation et la capacité à répondre en anglais peuvent aider à capter et rassurer ces acheteurs.' },
      { question: 'Pourquoi demander un avis de valeur à Lorgues ?', answer: 'Parce que le marché est segmenté. Un avis de valeur permet de distinguer une maison classique d’une propriété plus rare, d’expliquer la fourchette de prix et de choisir une stratégie adaptée au type d’acheteur visé.' },
    ],
  },
  brignoles: {
    slug: 'brignoles',
    name: 'Brignoles',
    title: 'Immobilier à Brignoles : prix, estimation maison et marché local',
    description: 'Vous vendez à Brignoles ? Repères de marché, maisons, appartements, quartiers et avis de valeur local avec Alexandre Lopez iad en Provence Verte.',
    intro: 'Brignoles joue un rôle de ville centre en Provence Verte. Le marché y est plus large et plus hétérogène que dans les villages : appartements, maisons de ville, pavillons familiaux, terrains et biens proches des axes ne se comparent pas avec la même méthode.',
    priceSummary: 'Les repères publics placent souvent Brignoles autour de 2 500 à 3 200 €/m² selon les sources, avec des maisons qui ressortent fréquemment plus haut que les appartements. Les écarts tiennent au quartier, à l’état, au terrain, au stationnement, au DPE et à la proximité des services.',
    marketBullets: [
      'Ville centre de Provence Verte avec une demande portée par les services, les écoles, les commerces et les accès.',
      'Marché plus liquide que certains villages, mais très variable selon les quartiers et la typologie.',
      'Les maisons familiales avec extérieur ne se comparent pas directement aux appartements ou maisons de centre ancien.',
      'Le bon prix dépend aussi de la concurrence active au moment de la mise en vente.',
    ],
    propertyTypes: [
      'Appartements en centre-ville ou proches des commodités, sensibles à la copropriété et au stationnement.',
      'Maisons de ville avec contraintes d’accès, d’extérieur ou de rénovation.',
      'Maisons familiales avec jardin, garage ou piscine dans les secteurs résidentiels.',
      'Terrains et biens à travaux où le coût de remise à niveau influence fortement le prix.',
    ],
    estimationFactors: [
      'Quartier précis, accès, nuisances éventuelles et proximité des services',
      'Présence d’un extérieur, d’un garage, d’un stationnement ou d’une piscine',
      'État général, rénovation, toiture, électricité, chauffage et DPE',
      'Copropriété, charges et étage pour les appartements',
      'Comparaison avec les biens actuellement en vente, pas seulement avec les prix moyens',
      'Calendrier vendeur et marge de négociation acceptable',
    ],
    nearbyLinks: [
      { href: '/immobilier/barjols', label: 'Barjols' },
      { href: '/immobilier/ponteves', label: 'Pontevès' },
      { href: '/immobilier/cotignac', label: 'Cotignac' },
    ],
    faq: [
      { question: 'Quel est le prix immobilier à Brignoles ?', answer: 'Les sources publiques situent souvent Brignoles autour de 2 500 à 3 200 €/m² selon le type de bien. Les maisons peuvent dépasser les appartements, mais le quartier, l’état, le terrain et le stationnement créent de grands écarts.' },
      { question: 'Comment estimer une maison à Brignoles ?', answer: 'Il faut comparer des biens vraiment proches : même secteur, même surface, extérieur comparable, état similaire, DPE cohérent et niveau de prestations équivalent. Un prix moyen ne suffit pas pour fixer un prix de vente.' },
      { question: 'Quels biens se vendent à Brignoles ?', answer: 'Brignoles propose des appartements, maisons de ville, pavillons familiaux, terrains et biens à travaux. La demande varie selon l’accès aux écoles, commerces, axes routiers, stationnement et espaces extérieurs.' },
      { question: 'Pourquoi demander un avis de valeur à Brignoles ?', answer: 'Parce que le marché est hétérogène. L’avis de valeur permet de positionner le bien face à sa vraie concurrence, d’éviter une surestimation et de préparer une mise en vente plus efficace.' },
    ],
  },
  ponteves: {
    slug: 'ponteves',
    name: 'Pontevès',
    title: 'Immobilier à Pontevès : estimation maison et marché village',
    description: 'Vous vendez une maison à Pontevès ? Repères de prix, maisons avec terrain, village proche Barjols et avis de valeur local avec Alexandre Lopez iad.',
    intro: 'Pontevès est un marché de village, très lié à Barjols et aux communes voisines. La valeur d’une maison dépend moins d’un prix moyen que de l’adresse, du terrain, de l’état, de la vue, du calme, de l’accès et du niveau de travaux à prévoir.',
    priceSummary: 'Les repères publics situent souvent Pontevès autour de 2 100 à 2 700 €/m² selon les sources, avec des fourchettes très larges. Une maison habitable avec terrain, une maison de village à rénover et une propriété plus rare ne se valorisent pas avec la même grille.',
    marketBullets: [
      'Commune de village où la majorité du parc est composée de maisons, avec une forte sensibilité au terrain et à l’état.',
      'Marché plus confidentiel que Brignoles ou Barjols : peu de comparables peuvent suffire à fausser un prix moyen.',
      'L’environnement immédiat, la vue, le calme et l’accès peuvent peser autant que la surface habitable.',
      'La proximité de Barjols crée des comparaisons utiles, mais Pontevès doit garder sa lecture propre.',
    ],
    propertyTypes: [
      'Maisons de village avec charme, parfois à rénover ou avec extérieur limité.',
      'Maisons avec terrain, vues ou environnement calme, recherchées par des acheteurs en quête d’espace.',
      'Biens à travaux où le budget rénovation et le DPE influencent directement la négociation.',
      'Résidences principales ou secondaires autour de Barjols et de la Provence Verte.',
    ],
    estimationFactors: [
      'Terrain, vue, exposition et calme',
      'Accès, stationnement, pente et praticité quotidienne',
      'État du bâti, toiture, humidité, assainissement et travaux',
      'Surface réellement exploitable et potentiel d’aménagement',
      'Comparaison avec Barjols, Tavernes et les ventes récentes du secteur',
      'Rareté du bien et cohérence du prix avec la demande locale',
    ],
    nearbyLinks: [
      { href: '/immobilier/barjols', label: 'Barjols' },
      { href: '/immobilier/cotignac', label: 'Cotignac' },
      { href: '/immobilier/brignoles', label: 'Brignoles' },
    ],
    faq: [
      { question: 'Quel est le prix immobilier à Pontevès ?', answer: 'Les portails affichent souvent des repères autour de 2 100 à 2 700 €/m² selon les méthodes, mais la fourchette est large. Le terrain, la vue, l’état, les travaux et la rareté du bien peuvent changer fortement la valeur.' },
      { question: 'Comment estimer une maison à Pontevès ?', answer: 'Il faut croiser les comparables locaux avec Barjols et les villages proches, puis ajuster selon le terrain, l’accès, le calme, l’état technique, le DPE et les travaux éventuels.' },
      { question: 'Pontevès se compare-t-il directement à Barjols ?', answer: 'Pas toujours. Barjols donne un repère utile, mais Pontevès a sa propre logique de village, avec moins de biens comparables et une sensibilité particulière à l’environnement, à la vue et au terrain.' },
      { question: 'Pourquoi demander un avis de valeur à Pontevès ?', answer: 'Parce qu’un marché de village peut être difficile à lire avec un simple simulateur. L’avis de valeur aide à justifier une fourchette réaliste et à préparer une mise en vente adaptée.' },
    ],
  },
}

export const LOCAL_PAGE_SLUGS = Object.keys(LOCAL_PAGES)

/**
 * Communes de la zone d'intervention affichées sur le hub /immobilier.
 *
 * Le slug est écrit en dur plutôt que dérivé du nom : une slugification à la
 * volée fait dépendre l'URL d'une transformation de chaîne (accents, tirets),
 * et une URL ne doit pas pouvoir bouger par effet de bord.
 */
export const TERRITORY_COMMUNES: ReadonlyArray<{ slug: string; name: string }> = [
  { slug: 'brignoles', name: 'Brignoles' },
  { slug: 'saint-maximin', name: 'Saint-Maximin' },
  { slug: 'barjols', name: 'Barjols' },
  { slug: 'cotignac', name: 'Cotignac' },
  { slug: 'aups', name: 'Aups' },
  { slug: 'salernes', name: 'Salernes' },
  { slug: 'vinon-sur-verdon', name: 'Vinon-sur-Verdon' },
  { slug: 'rians', name: 'Rians' },
  { slug: 'le-val', name: 'Le Val' },
  { slug: 'carces', name: 'Carcès' },
  { slug: 'montmeyan', name: 'Montmeyan' },
  { slug: 'fox-amphoux', name: 'Fox-Amphoux' },
  { slug: 'tourtour', name: 'Tourtour' },
  { slug: 'sillans-la-cascade', name: 'Sillans-la-Cascade' },
  { slug: 'villecroze', name: 'Villecroze' },
  { slug: 'tavernes', name: 'Tavernes' },
]

/**
 * Communes que le site reconnaît, qu'elles aient ou non une page rédigée.
 *
 * Sert de garde-fou à /immobilier/[commune] : sans cette liste, n'importe quel
 * slug renvoie une page 200 auto-canonicalisée, ce qui fabrique un ensemble
 * non borné de pages minces indexables. Les slugs présents ici mais absents de
 * LOCAL_PAGES rendent la page générique, en noindex tant qu'elle n'est pas
 * rédigée ; tout ce qui n'est pas dans la liste renvoie 404.
 */
export const KNOWN_COMMUNE_SLUGS: ReadonlySet<string> = new Set([
  ...LOCAL_PAGE_SLUGS,
  ...communes.map(function (commune) {
    return commune.slug
  }),
  ...TERRITORY_COMMUNES.map(function (commune) {
    return commune.slug
  }),
])

export function isKnownCommune(slug: string) {
  return KNOWN_COMMUNE_SLUGS.has(slug)
}
