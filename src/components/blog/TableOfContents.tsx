'use client'

import { useEffect, useState } from 'react'

interface TocItem { id: string; text: string }

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const article = document.querySelector('[data-article-content]')
    if (!article) return
    const h2s = article.querySelectorAll('h2[id]')
    setHeadings(Array.from(h2s).map((h2) => ({ id: h2.id, text: h2.textContent || '' })))
  }, [])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    )
    headings.forEach((h) => { const el = document.getElementById(h.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Sommaire" className="rounded-2xl border border-border bg-surface p-6">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground">Sommaire</p>
      <ul className="flex flex-col gap-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={'#' + h.id}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setActiveId(h.id)
              }}
              className={'block border-l-2 py-1.5 pl-4 text-[13px] leading-[1.4] transition-colors ' +
                (activeId === h.id ? 'border-brand font-semibold text-foreground' : 'border-transparent text-muted hover:text-foreground')}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
