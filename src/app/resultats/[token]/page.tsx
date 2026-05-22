import ResultatsClient from './resultats-client'
import EnvironmentCopyNormalizer from './environment-copy-normalizer'
import { loadEstimationFromNotionByToken } from '@/lib/notion-estimations'

/**
 * /resultats/[token]
 *
 * Mode estimation-first : Supabase est entièrement sorti du chemin critique.
 * La page tente d'abord de relire le dossier depuis le backup Notion via le
 * token du magic link. Si Notion n'est pas configuré ou ne retrouve pas le
 * dossier, le client conserve le fallback localStorage pour le parcours ouvert
 * dans le même navigateur.
 */
export default async function ResultatsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const record = await loadEstimationFromNotionByToken(token)

  return (
    <>
      <EnvironmentCopyNormalizer />
      <ResultatsClient
        initialData={
          record
            ? {
                data: record.formData,
                est: record.results,
              }
            : undefined
        }
      />
    </>
  )
}
