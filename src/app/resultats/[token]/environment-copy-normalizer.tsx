'use client'

import { useEffect } from 'react'

const COPY_REPLACEMENTS = new Map<string, string>([
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

function normalizeEnvironmentCopy(root: ParentNode = document): void {
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

export default function EnvironmentCopyNormalizer() {
  useEffect(function () {
    normalizeEnvironmentCopy()

    const observer = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof Text) {
            const original = node.nodeValue ?? ''
            const trimmed = original.trim()
            const replacement = COPY_REPLACEMENTS.get(trimmed)
            if (replacement) node.nodeValue = original.replace(trimmed, replacement)
          } else if (node instanceof Element) {
            normalizeEnvironmentCopy(node)
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
