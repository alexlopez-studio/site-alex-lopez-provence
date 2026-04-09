'use client'

import { useState } from 'react'
import { Linkedin, LinkIcon, Check } from 'lucide-react'

const LINKEDIN_BASE = 'https://www.linkedin.com/sharing/share-offsite/?url='

export default function ShareButtons({
  url,
  title,
  layout = 'inline',
}: {
  url: string
  title: string
  layout?: 'inline' | 'sidebar'
}) {
  const [copied, setCopied] = useState(false)
  const linkedinHref = LINKEDIN_BASE + encodeURIComponent(url)

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  if (layout === 'sidebar') {
    return (
      <div className="rounded-2xl border border-border bg-white p-6">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground">Partager</p>
        <div className="flex flex-col gap-2">
          <button onClick={copyToClipboard} type="button"
            className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-brand">
            {copied ? <Check className="h-4 w-4 text-success" /> : <LinkIcon className="h-4 w-4 text-muted" />}
            {copied ? 'Lien copié !' : 'Copier le lien'}
          </button>
          <a href={linkedinHref} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-brand">
            <Linkedin className="h-4 w-4 text-muted" />
            Partager sur LinkedIn
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      <span className="text-sm font-medium text-muted">Partager :</span>
      <a href={linkedinHref} target="_blank" rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-brand hover:text-foreground"
        aria-label="Partager sur LinkedIn">
        <Linkedin className="h-4 w-4" />
      </a>
      <button onClick={copyToClipboard} type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-brand hover:text-foreground"
        aria-label="Copier le lien">
        {copied ? <Check className="h-4 w-4 text-success" /> : <LinkIcon className="h-4 w-4" />}
      </button>
    </div>
  )
}
