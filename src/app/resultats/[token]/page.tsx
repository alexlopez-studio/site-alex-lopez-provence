import ResultatsClient from './resultats-client'

/**
 * /resultats/[token]
 *
 * Mode estimation-first : Supabase est entièrement sorti du chemin critique.
 * La page résultat se rend toujours, puis le client recalcule l'estimation à
 * partir du store local du formulaire.
 *
 * Limite assumée de cette étape : un lien email ouvert sur un autre appareil ne
 * peut pas encore relire le dossier depuis Notion. On stabilise d'abord le flux
 * preview sans Supabase, puis on branchera une lecture Notion si nécessaire.
 */
export default async function ResultatsPage() {
  return <ResultatsClient />
}
