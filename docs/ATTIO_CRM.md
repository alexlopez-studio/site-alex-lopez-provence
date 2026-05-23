# Configuration Attio CRM

Attio est la destination CRM principale pour les leads vendeurs et acheteurs. Notion reste utilisé en backup et pour le pilotage projet.

## Modèle cible

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

Les pipelines sont des **listes Attio parentées à People**.

Prévoir au minimum :

- une liste vendeur ;
- une liste acheteur ;
- éventuellement une liste audit plus tard.

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
| `source` | Text / Select | Source du lead |
| `lead_type` | Select | `vendre`, `acheter`, `audit` |
| `token` | Text | Token technique du dossier |
| `magic_link` | Text / URL | Lien résultat |
| `rgpd` | Checkbox | Consentement |
| `adresse` | Text | Adresse du bien |
| `type_bien` | Text / Select | Maison, appartement, terrain… |
| `surface` | Number | Surface habitable |
| `surface_terrain` | Number | Terrain / extérieur |
| `dpe` | Text / Select | DPE |
| `delai` | Text / Select | Délai de vente |
| `estimation_mediane` | Number / Currency | Estimation médiane |
| `estimation_basse` | Number / Currency | Fourchette basse |
| `estimation_haute` | Number / Currency | Fourchette haute |
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

Attributs complémentaires utiles :

| Slug suggéré | Type | Usage |
| --- | --- | --- |
| `budget_max` | Number / Currency | Budget maximum |
| `communes` | Text | Communes ciblées |
| `criteres` | Text / Multi-select | Critères de recherche |

## Variables d’environnement Vercel

Variables obligatoires pour activer Attio :

```plain text
ATTIO_API_KEY=
ATTIO_SELLER_LIST_ID=
# ou ATTIO_SELLER_LIST_SLUG=
```

Variables pour le pipeline acheteur :

```plain text
ATTIO_BUYER_LIST_ID=
# ou ATTIO_BUYER_LIST_SLUG=
```

Variables optionnelles :

```plain text
ATTIO_AUDIT_LIST_ID=
ATTIO_AUDIT_LIST_SLUG=
ATTIO_SELLER_STAGE_ATTRIBUTE=stage
ATTIO_BUYER_STAGE_ATTRIBUTE=stage
```

## Scopes Attio recommandés

Le token Attio doit permettre :

```plain text
record_permission:read-write
object_configuration:read
list_entry:read-write
list_configuration:read
```

## Comportement du site

La synchronisation Attio est volontairement **best-effort** :

- si `ATTIO_API_KEY` manque, `/api/leads` continue et renvoie `attioSync.skipped` ;
- si la liste vendeur / acheteur manque, le contact People peut être créé, puis l’entrée pipeline est ignorée ;
- si Attio renvoie une erreur, l’estimation, le résultat, l’email et le backup Notion ne sont pas bloqués.

## Checklist de mise en service

1. Créer les listes Attio vendeur et acheteur, parentées à People.
2. Ajouter les statuts recommandés dans chaque liste.
3. Ajouter les attributs de liste avec les slugs ci-dessus ou adapter les variables / le code.
4. Créer un token Attio avec les scopes recommandés.
5. Ajouter les variables dans Vercel Preview puis Production.
6. Tester une soumission vendeur.
7. Vérifier : People créé / mis à jour + entrée dans le pipeline vendeur.
8. Tester une soumission acheteur lorsque le funnel acheteur sera branché.
