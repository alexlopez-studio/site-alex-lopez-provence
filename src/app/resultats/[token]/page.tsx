import ResultatsClient, { type ResultatsClientInitialData } from './resultats-client'
import { verifyMagicToken, MagicTokenError } from '@/lib/magic-token'

type Props = { params: Promise<{ token: string }> }

/**
 * /resultats/[token] — server component qui décode le magic-token JWT.
 *
 * Stratégie :
 * - Si le token décode correctement ET que c'est un dossier `vendre`,
 *   on pré-hydrate le composant client avec les données du payload
 *   (formData + results signés). Aucune lecture localStorage, aucun
 *   appel /api/estimation — le rendu est instantané et fonctionne sur
 *   n'importe quel appareil.
 * - Sinon (UUID legacy, type non supporté, signature invalide,
 *   token expiré, MAGIC_LINK_JWT_SECRET manquant), on retombe
 *   sur le flux client historique : lecture localStorage +
 *   /api/estimation. Même UX qu'avant Phase A.
 *
 * Les vues dédiées audit / acheter et l'état « lien expiré » explicite
 * sont des steps suivants.
 */
export default async function ResultatsPage({ params }: Props) {
  const { token } = await params

  let initialData: ResultatsClientInitialData | undefined
  try {
    const payload = verifyMagicToken(token)
    if (payload.type === 'vendre') {
      initialData = {
        data: payload.formData,
        est: payload.results,
      }
    }
    // audit / acheter : pas encore de vue dédiée côté client.
    // On laisse le legacy s'afficher (au pire « Estimation indisponible »,
    // même comportement qu'avant Phase A).
  } catch (err) {
    // MagicTokenError : invalid_format / invalid_signature / expired /
    // invalid_payload / missing_secret. Tout le reste : aussi legacy.
    if (!(err instanceof MagicTokenError)) {
      console.error('[/resultats/[token]] verifyMagicToken inattendu :', err)
    }
  }

  return <ResultatsClient initialData={initialData} />
}
