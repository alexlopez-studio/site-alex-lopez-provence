import ResultatsLoaderClient from './resultats-loader-client'
import EnvironmentCopyNormalizer from './environment-copy-normalizer'
import { loadEstimationFromNotionByToken } from '@/lib/notion-estimations'

const NOTION_LOOKUP_RETRIES = 12
const NOTION_LOOKUP_RETRY_DELAY_MS = 1000

/**
 * /resultats/[token]
 *
 * Mode estimation-first : Supabase est entièrement sorti du chemin critique.
 * La page tente d'abord de relire le dossier depuis le backup Notion via le
 * token du magic link. Si la soumission vient juste d'être envoyée, Notion peut
 * avoir besoin de quelques secondes : on réessaie avant de laisser le client
 * utiliser le fallback localStorage du navigateur.
 */
export default async function ResultatsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const record = await loadEstimationWithRetry(token)

  return (
    <>
      <EnvironmentCopyNormalizer />
      <ResultatsLoaderClient
        token={token}
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

async function loadEstimationWithRetry(token: string) {
  for (let attempt = 0; attempt < NOTION_LOOKUP_RETRIES; attempt += 1) {
    const record = await loadEstimationFromNotionByToken(token)
    if (record) return record

    if (attempt < NOTION_LOOKUP_RETRIES - 1) {
      await sleep(NOTION_LOOKUP_RETRY_DELAY_MS)
    }
  }

  return null
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
