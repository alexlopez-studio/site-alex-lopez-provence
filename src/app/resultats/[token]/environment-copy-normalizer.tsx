'use client'

import { useEffect } from 'react'

type EnvironmentProfile = {
  title: string
  subtitle: string
  highlight: string
  items: Array<{ label: string; text: string }>
  footer: string
}

type VendreStoreState = {
  state?: {
    answers?: {
      lat?: number
      lng?: number
      adresse?: string
    }
  }
}

const COPY_REPLACEMENTS = new Map<string, string>([
  // Lot 1 — wording estimation vendeur
  ['Votre estimation', 'Votre première estimation'],
  ['Prix optimal estimé', 'Repère central indicatif'],
  ['Haute précision', 'Fiabilité élevée'],
  ['Précision moyenne', 'Fiabilité moyenne'],
  ['Pourquoi une fourchette ? Le prix final se décide avec vous, sur place — pas par un algorithme.', 'Cette estimation donne un premier repère de marché. Le prix de mise en vente recommandé dépendra de l’état réel du bien, de son environnement immédiat, de la concurrence active et de votre objectif de délai.'],
  ['Stratégie de prix', 'Simulation de positionnement'],
  ['Le prix de vente influence directement votre délai de transaction. Un prix attractif génère plus de visites et d’offres, tandis qu’un prix élevé nécessite patience et négociation.', 'Cette simulation montre comment le positionnement prix peut influencer le délai, les visites et la négociation. Elle ne remplace pas une stratégie de vente construite après analyse du bien et du marché concurrentiel.'],
  ['Affinez votre stratégie avec un expert', 'Transformer cette estimation en avis de valeur complet'],
  ['Chaque bien est unique. Alex peut adapter cette stratégie selon les spécificités locales et votre situation personnelle.', 'Je vérifie les données, l’état réel du bien, la concurrence actuelle et la stratégie de prix la plus adaptée à votre situation.'],
  ['Être rappelé', 'Demander un avis de valeur complet'],
  ['Affiner cette estimation ?', 'Transformer cette estimation en avis de valeur complet'],
  ['Alex se déplace gratuitement · Sans engagement · Sous 48h', 'Je vérifie les données, l’état réel du bien et la stratégie de prix adaptée à votre situation.'],

  // Fallback environnement — ne pas affirmer un cadre calme sans donnée terrain
  ['Environnement Calme', 'Environnement à vérifier'],
  ['Cadre résidentiel et naturel', 'Cadre, accès et nuisances à confirmer'],
  ["Idéal pour les amateurs de tranquillité et d’espaces préservés", 'Analyse environnementale indicative : accès, services, bruit et cadre à confirmer avec l’avis terrain'],
  ['Nature', 'Cadre'],
  ['Environnement préservé', 'À confirmer selon le secteur exact'],
  ['Calme', 'Nuisances'],
  ["Loin de l’agitation urbaine", 'Routes, bruit et voisinage à vérifier'],
  ['Résidentiel', 'Secteur'],
  ['Quartier paisible', 'Contexte local à confirmer'],
  ['Mobilité', 'Accès'],
  ['Accès véhicule recommandé', 'Accès, stationnement et axes routiers à vérifier'],
  ['Profil environnement calculé automatiquement — enrichissement Overpass à venir', 'Profil environnement indicatif — accès, services et nuisances à confirmer avec l’avis terrain'],
])

const ENVIRONMENT_SOURCES = {
  title: ['Environnement Calme', 'Environnement à vérifier', 'Environnement urbain', 'Environnement résidentiel', 'Environnement naturel', 'Environnement à vigilance'],
  subtitle: ['Cadre résidentiel et naturel', 'Cadre, accès et nuisances à confirmer', 'Services, accès et nuisances à équilibrer', 'Cadre villageois ou résidentiel à confirmer', 'Cadre naturel avec accès à vérifier', 'Axe routier / nuisances possibles à vérifier'],
  highlight: ["Idéal pour les amateurs de tranquillité et d’espaces préservés", 'Analyse environnementale indicative : accès, services, bruit et cadre à confirmer avec l’avis terrain', 'Le secteur semble plutôt urbain : la valeur dépendra de l’accès, des services, du bruit et de la qualité de l’adresse exacte.', 'Le secteur semble résidentiel : la valeur dépendra du calme réel, de l’accès, du stationnement et de la proximité des services.', 'Le secteur semble bénéficier d’un cadre plus naturel. L’accès, l’isolement, les services et les éventuelles contraintes doivent être confirmés.', 'Le secteur semble demander une vérification attentive du bruit, des accès et de l’environnement immédiat.'],
  footer: ['Profil environnement calculé automatiquement — enrichissement Overpass à venir', 'Profil environnement indicatif — accès, services et nuisances à confirmer avec l’avis terrain', 'Profil environnement indicatif — attractivité urbaine et nuisances à confirmer avec l’avis terrain', 'Profil environnement indicatif — cadre, accès et services à confirmer avec l’avis terrain', 'Profil environnement indicatif — cadre naturel, accès et contraintes à confirmer avec l’avis terrain', 'Profil environnement indicatif — bruit, accès et voisinage à confirmer avec l’avis terrain'],
  labels: ['Nature', 'Cadre', 'Calme', 'Nuisances', 'Résidentiel', 'Secteur', 'Mobilité', 'Accès', 'Services', 'Bruit', 'Contexte'],
  texts: ['Environnement préservé', 'À confirmer selon le secteur exact', "Loin de l’agitation urbaine", 'Routes, bruit et voisinage à vérifier', 'Quartier paisible', 'Contexte local à confirmer', 'Accès véhicule recommandé', 'Accès, stationnement et axes routiers à vérifier', 'Commerces et équipements à vérifier', 'Mobilité et stationnement à analyser', 'Bruit et trafic à confirmer sur place', 'Ambiance résidentielle à confirmer', 'Commerces et écoles à situer précisément', 'Présence d’éléments naturels détectée', 'Temps d’accès et voirie à vérifier', 'Éloignement possible des commodités', 'Nuisances routières à vérifier sur place', 'Accès véhicule potentiellement favorable', 'Commodités possibles à proximité'],
}

function normalizeResultCopy(root: ParentNode = document): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode
    if (node instanceof Text) nodes.push(node)
  }

  for (const node of nodes) {
    const original = node.nodeValue ?? ''
    const trimmed = original.trim()
    const replacement = COPY_REPLACEMENTS.get(trimmed)
    if (!replacement) continue

    node.nodeValue = original.replace(trimmed, replacement)
  }
}

function replaceText(sources: string[], replacement: string): void {
  const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT)
  const sourceSet = new Set(sources)

  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!(node instanceof Text)) continue

    const original = node.nodeValue ?? ''
    const trimmed = original.trim()
    if (!sourceSet.has(trimmed)) continue

    node.nodeValue = original.replace(trimmed, replacement)
    return
  }
}

function applyEnvironmentProfile(profile: EnvironmentProfile): void {
  replaceText(ENVIRONMENT_SOURCES.title, profile.title)
  replaceText(ENVIRONMENT_SOURCES.subtitle, profile.subtitle)
  replaceText(ENVIRONMENT_SOURCES.highlight, profile.highlight)
  replaceText(ENVIRONMENT_SOURCES.footer, profile.footer)

  for (let index = 0; index < Math.min(profile.items.length, 4); index += 1) {
    const item = profile.items[index]
    replaceText(ENVIRONMENT_SOURCES.labels, item.label)
    replaceText(ENVIRONMENT_SOURCES.texts, item.text)
  }
}

function readAddressContext() {
  try {
    const raw = window.localStorage.getItem('vendre-store')
    if (!raw) return null

    const parsed = JSON.parse(raw) as VendreStoreState
    const answers = parsed.state?.answers
    if (!answers) return null

    const { lat, lng, adresse } = answers
    if (typeof lat !== 'number' || typeof lng !== 'number') return null

    return { lat, lng, address: adresse ?? '' }
  } catch {
    return null
  }
}

async function loadAdaptiveEnvironment(): Promise<void> {
  const context = readAddressContext()
  if (!context) return

  const params = new URLSearchParams({
    lat: String(context.lat),
    lng: String(context.lng),
  })
  if (context.address) params.set('address', context.address)

  try {
    const response = await fetch('/api/environment-profile?' + params.toString())
    if (!response.ok) return

    const profile = await response.json() as EnvironmentProfile
    applyEnvironmentProfile(profile)
  } catch {
    // Le fallback neutre reste affiché.
  }
}

export default function EnvironmentCopyNormalizer() {
  useEffect(function () {
    normalizeResultCopy()
    void loadAdaptiveEnvironment()

    const observer = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof Text) {
            const original = node.nodeValue ?? ''
            const trimmed = original.trim()
            const replacement = COPY_REPLACEMENTS.get(trimmed)
            if (replacement) node.nodeValue = original.replace(trimmed, replacement)
          } else if (node instanceof Element) {
            normalizeResultCopy(node)
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return function cleanup() {
      observer.disconnect()
    }
  }, [])

  return null
}
