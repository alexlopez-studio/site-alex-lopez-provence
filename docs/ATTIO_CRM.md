# Configuration Attio CRM

Attio est la destination CRM principale pour les leads vendeurs et acheteurs. Notion reste utilisé en backup et pour le pilotage projet.

## Phase actuelle : API + Vercel d’abord

Pour l’instant, on active uniquement la connexion API Attio et la synchronisation **People**.

Objectif : vérifier que le site peut créer / mettre à jour un contact Attio sans dépendre des colonnes de pipelines.

```plain text
/api/leads
→ calcul résultat
→ Attio People
→ email + backup Notion
```

Variables Vercel à configurer maintenant :

```plain text
ATTIO_API_KEY=
ATTIO_SYNC_MODE=people_only
```

Ne pas encore renseigner `ATTIO_SELLER_LIST_ID`, `ATTIO_BUYER_LIST_ID` ou leurs slugs tant que les attributs des listes ne sont pas prêts.

Avec ce mode, `/api/leads` renvoie un objet `attioSync` du type :

```json
{
  "ok": true,
  "skipped": true,
  "reason": "people_only_mode",
  "mode": "people_only",
  "personRecordId": "..."
}
```

`skipped: true` signifie seulement que l’entrée de pipeline est volontairement ignorée. Le contact People, lui, a bien été créé ou mis à jour si `ok: true` et `personRecordId` est présent.

## Redéploiement Preview

Dernier redéploiement demandé pour recharger les variables Attio Vercel : 2026-05-23 18:23 Europe/Paris.

## Phase suivante : People + listes / pipelines

Quand les colonnes Attio seront prêtes, passer en :

```plain text
ATTIO_SYNC_MODE=people_and_lists
ATTIO_SELLER_LIST_ID=
ATTIO_BUYER_LIST_ID=
```

Modèle cible complet :

```plain text
Formulaire vendeur / acheteur
→ /api/leads
→ calcul résultat
→ Attio People
→ liste / pipeline Attio
→ email + backup Notion en best-effort
```

## Objets Attio

### People

Chaque prospect est créé ou mis à jour dans **People** via son email.

Champs utilisés côté People :

- `email_addresses`
- `name`
- `phone_numbers`
- `description`

### Lists / pipelines

Les pipelines seront des **listes Attio parentées à People**.

Prévoir au minimum :

- une liste vendeur ;
- une liste acheteur ;
- éventuellement une liste audit plus tard.

## Nom du dossier CRM

Le code alimente un champ `nom_dossier` pour rendre les pipelines lisibles quand `ATTIO_SYNC_MODE=people_and_lists` sera activé.

Format vendeur :

```plain text
Estimation — Maison à Barjols — Jean Dupont
```

Format acheteur :

```plain text
Recherche — Maison — 450k€ — Cotignac, Lorgues — Sarah Smith
```

Le nom de la personne reste dans People. Le `nom_dossier` sert à identifier rapidement l’opportunité immobilière dans le pipeline.

## Pipeline vendeur recommandé

Statuts recommandés :

1. `Estimation demandée`
2. `À qualifier`
3. `RDV à programmer`
4. `Avis de valeur à réaliser`
5. `Mandat potentiel`
6. `Mandat signé`
7. `Perdu / non prioritaire`

Attributs de liste recommandés :

| Slug suggéré | Type | Usage |
| --- | --- | --- |
| `stage` | Status | Étape du pipeline |
| `nom_dossier` | Text | Nom lisible du dossier CRM |
| `source` | Text / Select | Source du lead |
| `lead_type` | Select | `vendre`, `acheter`, `audit` |
| `token` | Text | Token technique du dossier |
| `magic_link` | Text / URL | Lien résultat |
| `rgpd` | Checkbox | Consentement |
| `adresse` | Text | Adresse du bien |
| `commune` | Text | Commune du bien |
| `type_bien` | Text / Select | Maison, appartement, terrain… |
| `surface` | Number | Surface habitable |
| `surface_terrain` | Number | Terrain / extérieur |
| `dpe` | Text / Select | DPE |
| `delai` | Text / Select | Délai de vente |
| `estimation_mediane` | Number / Currency | Estimation médiane |
| `estimation_basse` | Number / Currency | Fourchette basse |
| `estimation_haute` | Number / Currency | Fourchette haute |
| `criteres` | Text | Équipements / critères utiles |
| `notes` | Text | Snapshot JSON du dossier |

## Pipeline acheteur recommandé

Statuts recommandés :

1. `Recherche reçue`
2. `À qualifier`
3. `Budget vérifié`
4. `Biens à proposer`
5. `Visites`
6. `Offre potentielle`
7. `Achat conclu`
8. `Perdu / pause`

Attributs de liste recommandés :

| Slug suggéré | Type | Usage |
| --- | --- | --- |
| `stage` | Status | Étape du pipeline |
| `nom_dossier` | Text | Nom lisible du dossier CRM |
| `source` | Text / Select | Source du lead |
| `lead_type` | Select | `vendre`, `acheter`, `audit` |
| `token` | Text | Token technique du dossier |
| `magic_link` | Text / URL | Lien résultat |
| `rgpd` | Checkbox | Consentement |
| `budget_max` | Number / Currency | Budget maximum |
| `communes` | Text | Communes ciblées |
| `type_bien` | Text / Select | Type de bien recherché |
| `surface` | Number | Surface souhaitée |
| `surface_terrain` | Number | Terrain souhaité |
| `criteres` | Text / Multi-select | Critères de recherche |
| `delai` | Text / Select | Délai d’achat |
| `notes` | Text | Snapshot JSON du dossier |

## Checklist de mise en service API/Vercel

1. Créer un token Attio.
2. Ajouter `ATTIO_API_KEY` dans Vercel Preview.
3. Ajouter `ATTIO_SYNC_MODE=people_only` dans Vercel Preview.
4. Redéployer la Preview.
5. Faire une soumission vendeur depuis la Preview.
6. Vérifier dans Attio qu’un contact People est créé ou mis à jour.
7. Si OK, copier les mêmes variables en Production.
8. Plus tard seulement : créer les attributs de listes, renseigner les IDs de listes, puis passer à `people_and_lists`.

## Scopes Attio recommandés

Pour la phase People-only, le token doit permettre :

```plain text
record_permission:read-write
object_configuration:read
```

Pour la phase People + pipelines, ajouter aussi :

```plain text
list_entry:read-write
list_configuration:read
```

## Comportement du site

La synchronisation Attio est volontairement **best-effort** :

- si `ATTIO_API_KEY` manque, `/api/leads` continue et renvoie `attioSync.skipped` ;
- en `people_only`, seul People est synchronisé ;
- en `people_and_lists`, l’entrée pipeline est créée si la liste et les attributs existent ;
- si Attio renvoie une erreur, l’estimation, le résultat, l’email et le backup Notion ne sont pas bloqués.
