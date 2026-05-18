'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PageTransition } from '@/components/layout/PageTransition'
import { useVendreStore } from '@/stores/vendreStore'
import { useAcheterStore } from '@/stores/acheterStore'
import { useAuditStore } from '@/stores/auditStore'

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

    const next = value
      .replaceAll('Alex Lopez', 'Alexandre Lopez')
      .replaceAll('Alex se déplace', 'Alexandre Lopez se déplace')
      .replaceAll('Alex peut', 'Alexandre Lopez peut')
      .replaceAll('par Alex concernant', 'par Alexandre Lopez concernant')
      .replaceAll('par Alex ', 'par Alexandre Lopez ')

    if (next !== value) node.nodeValue = next
  }
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
            const next = value
              .replaceAll('Alex Lopez', 'Alexandre Lopez')
              .replaceAll('Alex se déplace', 'Alexandre Lopez se déplace')
              .replaceAll('Alex peut', 'Alexandre Lopez peut')
              .replaceAll('par Alex concernant', 'par Alexandre Lopez concernant')
              .replaceAll('par Alex ', 'par Alexandre Lopez ')
            if (next !== value) textNode.nodeValue = next
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            normalizeAdvisorName(node as Element)
          }
        }
      }
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
