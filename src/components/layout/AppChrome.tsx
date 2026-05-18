'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PageTransition } from '@/components/layout/PageTransition'

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
    return function () { observer.disconnect() }
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
