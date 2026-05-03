import ResultatsClient, {
  type ResultatsClientInitialData,
} from './resultats-client'
import { lookupLead } from './lookup'

type Props = { params: Promise<{ token: string }> }

/**
 * /resultats/[token] — server component qui lookup le lead via Supabase.
 *
 * Phase B (Step 4) : le `token` est l'UUID `id` de la ligne `leads` créée
 * par /api/leads v2. On résout via `getLeadById` puis on affiche :
 *   - les résultats pré-hydratés pour `vendre`
 *   - un fallback ResultatsClient pour `audit`/`acheter` (vues dédiées à venir)
 *   - un écran d'erreur friendly pour invalide / expiré / introuvable / erreur
 *
 * Plus de fallback localStorage : un lien direct reçu par email doit suffire.
 */
export default async function ResultatsPage({ params }: Props) {
  const { token } = await params
  const state = await lookupLead(token)

  if (state.kind === 'invalid-format' || state.kind === 'not-found') {
    return (
      <ErrorScreen
        title="Lien invalide"
        message="Ce lien ne correspond à aucun dossier. Il a peut-être été modifié, supprimé ou mal copié. Refais une demande pour recevoir un nouveau lien par email."
        cta="Refaire une demande"
        href="/"
      />
    )
  }

  if (state.kind === 'expired') {
    return (
      <ErrorScreen
        title="Lien expiré"
        message="Ce lien a dépassé sa durée de validité de 30 jours. Demande un nouveau lien depuis le formulaire et tu en recevras un par email immédiatement."
        cta="Demander un nouveau lien"
        href="/"
      />
    )
  }

  if (state.kind === 'error') {
    return (
      <ErrorScreen
        title="Erreur temporaire"
        message="Nous n'arrivons pas à charger ton dossier pour le moment. Réessaie dans quelques instants."
        cta="Réessayer"
        href="."
      />
    )
  }

  const { lead } = state
  let initialData: ResultatsClientInitialData | undefined
  if (lead.tool === 'vendre') {
    initialData = {
      data: (lead.form_data ?? {}) as Record<string, unknown>,
      est: (lead.results ?? {}) as Record<string, unknown>,
    }
  }
  // audit / acheter : pas de pré-hydratation pour l'instant.
  // Le ResultatsClient affichera son état legacy minimal jusqu'aux vues dédiées.

  return <ResultatsClient initialData={initialData} />
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
