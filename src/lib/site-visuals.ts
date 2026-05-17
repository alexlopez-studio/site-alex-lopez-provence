export type SiteVisual = {
  src: string
  alt: string
  credit?: string
  sourceUrl?: string
  recommendedUse: string
}

export const siteVisuals = {
  portraitCutout: {
    src: '/alexandre-lopez-no-background.png',
    alt: 'Alexandre Lopez, conseiller immobilier iad France en Provence Verte et Verdon',
    recommendedUse: 'Heroes relationnels : accueil, contact, à propos, pages outils',
  },
  cotignacVillage: {
    src: '/village-cotignac.jpg',
    alt: 'Village de Cotignac en Provence Verte et Verdon',
    recommendedUse: 'Territoire, marché local, ancrage Provence Verte & Verdon',
  },
  cotignacHouse: {
    src: '/maison-bleue-cotignac.jpg',
    alt: 'Maison et ruelle à Cotignac en Provence Verte et Verdon',
    recommendedUse: 'Habitat local, achat, audit, projection immobilière',
  },
  aboutLocalPath: {
    src: '/maison-bleue-cotignac.jpg',
    alt: 'Ruelle et maison de village en Provence Verte et Verdon',
    recommendedUse: 'Approche locale, parcours, immobilier de proximité',
  },
  verdonLandscape: {
    src: '/gorges-du-verdon.jpg',
    alt: 'Gorges du Verdon en Provence Verte et Verdon',
    recommendedUse: 'Respiration territoire uniquement, usage secondaire',
  },
  vineyardLandscape: {
    src: '/vignobles-var.jpg',
    alt: 'Vignobles dans le Var',
    recommendedUse: 'Ambiance secondaire uniquement, éviter pour audit immobilier',
  },
} satisfies Record<string, SiteVisual>

export const editorialVisuals = {
  vendre: {
    image: siteVisuals.cotignacVillage.src,
    alt: siteVisuals.cotignacVillage.alt,
    label: 'Vente immobilière',
    note: 'Positionner, valoriser, négocier avec méthode.',
    focus: 'Vendre au bon prix, avec une stratégie claire.',
  },
  acheter: {
    image: siteVisuals.cotignacHouse.src,
    alt: siteVisuals.cotignacHouse.alt,
    label: 'Projet d’achat',
    note: 'Cadrer la recherche et sécuriser chaque étape.',
    focus: 'Acheter avec des critères solides et un budget cohérent.',
  },
  audit: {
    image: siteVisuals.cotignacHouse.src,
    alt: 'Maison de village à observer pour un audit immobilier',
    label: 'Audit immobilier',
    note: 'Observer le bâti, repérer les points utiles et décider avec recul.',
    focus: 'Repérer les points de vigilance avant de vous engager.',
  },
} as const
