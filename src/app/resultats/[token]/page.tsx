import ResultatsClient, {
  type ResultatsClientInitialData,
} from './resultats-client'
import { lookupLead } from './lookup'

type Props = { params: Promise<{ token: string }> }

/**
 * /resultats/[token]
 *
 * Pendant la phase estimation-first, Supabase ne doit plus bloquer l'affichage
 * des résultats. On tente encore le lookup Supabase pour les anciens liens,
 * mais si le dossier n'est pas trouvé ou si la DB est indisponible, on rend le
 * client qui sait recalculer l'estimation depuis le store local du formulaire.
 */
export default async function ResultatsPage({ params }: Props) {
  const { token } = await params
  const state = await lookupLead(token)

  if (state.kind === 'expired') {
    return (
      <ErrorScreen
        title="Lien expiré"
        message="Ce lien a dépassé sa durée de validité de 30 jours. Reprenez le simulateur pour générer une nouvelle estimation."
        cta="Refaire une estimation"
        href="/outils/vendre"
      />
    )
  }

  if (state.kind === 'ok') {
    const { lead } = state
    let initialData: ResultatsClientInitialData | undefined
    if (lead.tool === 'vendre') {
      initialData = {
        data: (lead.form_data ?? {}) as Record<string, unknown>,
        est: (lead.results ?? {}) as Record<string, unknown>,
      }
    }
    return <ResultatsClient initialData={initialData} />
  }

  return <ResultatsClient />
}

function ErrorScreen({
  title,
  message,
  cta,
  href,
}: {
  title: string
  message: string
  cta: string
  href: string
}) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm text-center">
        <h1 className="text-2xl font-semibold text-[#0F172A]">{title}</h1>
        <p className="mt-3 text-[#64748B] leading-relaxed">{message}</p>
        <a
          href={href}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#0077B6] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#005F96]"
        >
          {cta}
        </a>
      </div>
    </main>
  )
}
