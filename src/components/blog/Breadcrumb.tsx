import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function Breadcrumb({
  backHref = '/blog',
  backLabel = 'Retour aux articles',
}: {
  backHref?: string
  backLabel?: string
}) {
  return (
    <nav role="navigation" aria-label="Fil d'Ariane" className="mb-8">
      <Link
        href={backHref}
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        aria-label={backLabel}
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
        {backLabel}
      </Link>
    </nav>
  )
}
