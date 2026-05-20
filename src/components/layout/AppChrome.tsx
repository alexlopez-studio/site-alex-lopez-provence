'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PageTransition } from '@/components/layout/PageTransition'
import { useVendreStore } from '@/stores/vendreStore'
import { useAcheterStore } from '@/stores/acheterStore'
import { useAuditStore } from '@/stores/auditStore'

const CAL_BOOKING_URL = 'https://cal.com/alexandre-lopez-iad/30min'

function normalizePublicCopy(value: string): string {
  return value
    .replaceAll('Alex Lopez', 'Alexandre Lopez')
    .replaceAll('Alex se déplace', 'Alexandre Lopez se déplace')
    .replaceAll('Alex peut', 'Alexandre Lopez peut')
    .replaceAll('par Alex concernant', 'par Alexandre Lopez concernant')
    .replaceAll('par Alex ', 'par Alexandre Lopez ')
    .replaceAll('Profil environnement calculé automatiquement — enrichissement Overpass à venir', 'Profil environnement indicatif — calme, accès et services à confirmer avec l’avis terrain')
    .replaceAll('Vue exceptionnelle', 'Vue remarquable — panorama dégagé')
    .replaceAll('Votre estimation', 'Votre pré-estimation')
    .replaceAll('Prix optimal estimé', 'Première valeur estimée')
    .replaceAll('voici votre prix optimal estimé', 'voici votre première valeur estimée')
    .replaceAll('Ajuster l’estimation', 'Affiner votre scénario')
    .replaceAll("Ajuster l'estimation", 'Affiner votre scénario')
    .replaceAll('Oui : après le résultat, certaines variables peuvent être modifiées pour tester un scénario plus réaliste sans recommencer tout le formulaire.', 'Vous pouvez tester quelques scénarios indicatifs sans recommencer tout le formulaire. La valeur finale reste à confirmer par une analyse locale et une visite du bien.')
    .replaceAll('Estimation recalculée avec ces variables.', 'Scénario recalculé avec ces variables.')
    .replaceAll('Recalculer avec ces variables', 'Actualiser ce scénario')
    .replaceAll('Prix calculé', 'Pré-estimation calculée')
    .replaceAll('Affiner cette estimation ?', 'Confirmer cette pré-estimation ?')
    .replaceAll('Chaque bien est unique. Alexandre Lopez peut adapter cette stratégie selon les spécificités locales et votre situation personnelle.', 'Chaque bien est unique. Alexandre Lopez peut confirmer cette pré-estimation avec les spécificités locales, l’état réel du bien et votre situation personnelle.')
}

function normalizeAdvisorName(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  let current = walker.nextNode()

  while (current) {
    nodes.push(current as Text)
    current = walker.nextNode()
  }

  for (const node of nodes) {
    const value = node.nodeValue
    if (!value) continue

    const next = normalizePublicCopy(value)
    if (next !== value) node.nodeValue = next
  }
}

function isTimestamp(value: string | null | undefined) {
  return /^\d{2}:\d{2}$/.test((value ?? '').trim())
}

function looksLikeUserBubble(element: HTMLElement) {
  const className = typeof element.className === 'string' ? element.className : ''
  const style = window.getComputedStyle(element)
  const parentStyle = element.parentElement?.parentElement ? window.getComputedStyle(element.parentElement.parentElement) : null
  const hasTimestampSibling = isTimestamp(element.nextElementSibling?.textContent)
  const isRightAlignedRow = parentStyle?.justifyContent === 'flex-end'
  const isBrandBubble = style.backgroundColor === 'rgb(0, 119, 182)' || className.includes('bg-brand')
  const isBubbleShape = style.borderTopLeftRadius !== '0px' && style.borderBottomRightRadius !== style.borderBottomLeftRadius

  return hasTimestampSibling && (isRightAlignedRow || isBrandBubble || isBubbleShape)
}

function looksLikeAdvisorBubble(element: HTMLElement) {
  const className = typeof element.className === 'string' ? element.className : ''
  const style = window.getComputedStyle(element)
  const parentStyle = element.parentElement?.parentElement ? window.getComputedStyle(element.parentElement.parentElement) : null
  const hasTimestampSibling = isTimestamp(element.nextElementSibling?.textContent)
  const isLeftRow = parentStyle?.justifyContent !== 'flex-end'
  const isWhiteBubble = style.backgroundColor === 'rgb(255, 255, 255)' || className.includes('bg-white')

  return hasTimestampSibling && isLeftRow && isWhiteBubble
}

function applyImportantStyle(element: HTMLElement, styles: Record<string, string>) {
  for (const [property, value] of Object.entries(styles)) {
    element.style.setProperty(property, value, 'important')
  }
}

function patchToolChatBubbles(root: ParentNode) {
  const elements = root instanceof HTMLElement
    ? [root, ...Array.from(root.querySelectorAll<HTMLElement>('div'))]
    : Array.from(root.querySelectorAll<HTMLElement>('div'))

  for (const element of elements) {
    const text = element.textContent?.trim()
    if (!text) continue

    if (looksLikeUserBubble(element)) {
      const isShortAnswer = text.length <= 24 && !text.includes('\n')
      applyImportantStyle(element, {
        display: 'inline-block',
        width: 'max-content',
        'min-width': '0',
        'max-width': 'min(28rem, calc(100vw - 7rem))',
        padding: '0.78rem 1rem',
        'border-radius': '1rem 1rem 0.35rem 1rem',
        'line-height': '1.45',
        'text-align': 'left',
        'white-space': isShortAnswer ? 'nowrap' : 'pre-wrap',
        'word-break': 'keep-all',
        'overflow-wrap': isShortAnswer ? 'normal' : 'break-word',
      })
    }

    if (looksLikeAdvisorBubble(element)) {
      applyImportantStyle(element, {
        'max-width': 'min(34rem, 86vw)',
        padding: '0.9rem 1rem',
        'border-radius': '1rem 1rem 1rem 0.35rem',
        'line-height': '1.55',
        'white-space': 'pre-wrap',
        'word-break': 'normal',
        'overflow-wrap': 'break-word',
      })
    }
  }
}

function patchAppointmentLinks(root: ParentNode) {
  root.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach(function (link) {
    const label = (link.textContent ?? '').toLowerCase()
    const isAppointmentCta = label.includes('rappel') || label.includes('06 13 18 01 68') || label.includes('06 13')
    if (!isAppointmentCta) return

    link.href = CAL_BOOKING_URL
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = 'Prendre rendez-vous'
  })
}

function patchResultsWaitingStep() {
  const text = document.body.textContent ?? ''
  if (!text.includes('Recherche des ventes récentes...')) return
  if (!text.includes('Analyse du marché local')) return
  if (document.querySelector('[data-results-prep-step="true"]')) return

  const rows = Array.from(document.querySelectorAll<HTMLElement>('div')).filter(function (element) {
    return element.textContent?.trim() === 'Calcul de votre estimation' && element.style.display === 'flex'
  })
  const lastRow = rows[rows.length - 1]
  if (!lastRow?.parentElement) return

  const newRow = lastRow.cloneNode(true) as HTMLElement
  newRow.dataset.resultsPrepStep = 'true'
  const label = newRow.querySelector('span')
  if (label) label.textContent = 'Préparation de vos résultats'

  const icon = newRow.firstElementChild as HTMLElement | null
  if (icon) {
    icon.style.backgroundColor = '#E2E8F0'
    icon.innerHTML = ''
  }

  lastRow.parentElement.insertBefore(newRow, lastRow.nextSibling)
}

function readVendreAnswers(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem('vendre-store')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const state = parsed?.state ?? parsed
    const answers = state?.answers
    return answers && typeof answers === 'object' ? answers : null
  } catch {
    return null
  }
}

function updateVendreAnswers(updates: Record<string, unknown>) {
  try {
    const raw = localStorage.getItem('vendre-store')
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (parsed?.state?.answers && typeof parsed.state.answers === 'object') {
      parsed.state.answers = { ...parsed.state.answers, ...updates }
      parsed.state.updatedAt = Date.now()
    } else if (parsed?.answers && typeof parsed.answers === 'object') {
      parsed.answers = { ...parsed.answers, ...updates }
      parsed.updatedAt = Date.now()
    } else {
      return
    }
    localStorage.setItem('vendre-store', JSON.stringify(parsed))
  } catch {
    // Ne bloque jamais le parcours outil.
  }
}

function resetToolStoreForPath(pathname: string) {
  if (pathname === '/outils/vendre') {
    useVendreStore.getState().reset()
  } else if (pathname === '/outils/acheter') {
    useAcheterStore.getState().reset()
  } else if (pathname === '/outils/audit') {
    useAuditStore.getState().reset()
  }
}

function isToolStartPath(pathname: string) {
  return pathname === '/outils/vendre' || pathname === '/outils/acheter' || pathname === '/outils/audit'
}

function patchToolsFetch() {
  const win = window as typeof window & { __alexToolsFetchPatched?: boolean }
  if (win.__alexToolsFetchPatched) return
  win.__alexToolsFetchPatched = true

  const originalFetch = window.fetch.bind(window)

  window.fetch = async function patchedFetch(input: RequestInfo | URL, init?: RequestInit) {
    let nextInit = init
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url

    if (url.includes('/api/estimation') && init?.body && typeof init.body === 'string') {
      try {
        const body = JSON.parse(init.body) as Record<string, unknown>
        const answers = readVendreAnswers()
        const annee = answers?.annee_construction
        const numeroDpe = answers?.numero_dpe
        const dpeVerifie = Boolean(numeroDpe)
        const sousType = answers?.sous_type
        const surfaceTerrain = answers?.surface_terrain
        const cadastreSurface = answers?.cadastre_surface

        nextInit = {
          ...init,
          body: JSON.stringify({
            ...body,
            ...(typeof sousType === 'string' ? { sous_type: sousType } : {}),
            ...(typeof surfaceTerrain === 'number' ? { surface_terrain: surfaceTerrain } : {}),
            ...(typeof cadastreSurface === 'number' ? { cadastre_surface: cadastreSurface } : {}),
            ...(typeof annee === 'number' ? { annee_construction: annee } : {}),
            ...(dpeVerifie ? { dpe_verifie: true, numero_dpe: numeroDpe } : {}),
          }),
        }
      } catch {
        nextInit = init
      }
    }

    const response = await originalFetch(input, nextInit)

    if (url.includes('/api/adresse-infos')) {
      response.clone().json().then((data) => {
        const dpe = data?.dpe
        if (!dpe || typeof dpe !== 'object') return

        const updates: Record<string, unknown> = {}
        if (typeof dpe.annee_construction === 'number') updates.annee_construction = dpe.annee_construction
        if (typeof dpe.numero === 'string' && dpe.numero.length > 0) updates.numero_dpe = dpe.numero
        if (typeof dpe.lettre === 'string' && /^[A-G]$/.test(dpe.lettre)) updates.dpe_verifie = true

        if (Object.keys(updates).length > 0) updateVendreAnswers(updates)
      }).catch(() => null)
    }

    return response
  }
}

export function AppChrome({
  children,
  header,
  footer,
}: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}) {
  const pathname = usePathname()
  const isToolsMiniApp = pathname === '/outils' || pathname.startsWith('/outils/') || pathname.startsWith('/resultats/')

  useEffect(function () {
    normalizeAdvisorName(document.body)
    patchAppointmentLinks(document.body)
    patchToolChatBubbles(document.body)
    patchResultsWaitingStep()
    patchToolsFetch()

    function handleToolStartClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest('a') : null
      const href = target?.getAttribute('href')
      if (!href) return

      try {
        const url = new URL(href, window.location.origin)
        if (url.origin !== window.location.origin) return
        if (!isToolStartPath(url.pathname)) return

        // Quand un visiteur relance un outil depuis la page outils ou depuis une page résultat,
        // on repart d’un formulaire vierge au lieu de rouvrir l’ancienne conversation persistée.
        resetToolStoreForPath(url.pathname)
      } catch {
        // Ignore les href non standards.
      }
    }

    document.addEventListener('click', handleToolStartClick, true)

    const observer = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text
            const value = textNode.nodeValue
            if (!value) continue
            const next = normalizePublicCopy(value)
            if (next !== value) textNode.nodeValue = next
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            normalizeAdvisorName(node as Element)
            patchAppointmentLinks(node as Element)
            patchToolChatBubbles(node as Element)
          }
        }
      }
      patchToolChatBubbles(document.body)
      patchResultsWaitingStep()
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return function () {
      document.removeEventListener('click', handleToolStartClick, true)
      observer.disconnect()
    }
  }, [pathname])

  if (isToolsMiniApp) {
    return (
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
    )
  }

  return (
    <>
      {header}
      <PageTransition>
        <main className="pt-20">{children}</main>
      </PageTransition>
      {footer}
    </>
  )
}
