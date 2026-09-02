# Listing complet du site alexandrelopez.fr

Toutes les routes du dépôt, au 2 septembre 2026, branche `preview`.
La colonne **Ta décision** est vide : c'est à toi de la remplir. Ma suggestion n'est qu'une
suggestion.

---

## A. Le site public — 21 routes

C'est la seule partie qui te concerne pour la refonte.

| # | URL | Ce que c'est | Indexée ? | Ma suggestion | Ta décision |
|---|---|---|---|---|---|
| 1 | `/` | Accueil actuel | oui | Refaire au design vendez-pro | |
| 2 | `/vendez-pro` | **Ta page de référence.** Hero vidéo, portrait détouré, 1002 lignes | non (noindex, nofollow) | **Garder. Passer en indexée** | |
| 3 | `/vendre-sans-agence` | Autre landing du même guide, autre design | oui | 301 vers `/vendez-pro` | |
| 4 | `/vendre` | Page éditoriale vendeur | oui | 301 vers `/vendez-pro` | |
| 5 | `/avis-de-valeur-immobilier` | Page estimation, 362 lignes | oui | 301 vers `/vendez-pro` | |
| 6 | `/audit` | Page éditoriale audit | oui | 301 vers `/vendez-pro` | |
| 7 | `/acheter` | Page éditoriale acheteur | oui | 301 vers `/` | |
| 8 | `/a-propos` | Mon approche | oui | 301 vers `/` | |
| 9 | `/avis` | Avis clients (vide) | oui | 301 vers `/` | |
| 10 | `/contact` | Formulaire de contact | oui | 301 vers `/` | |
| 11 | `/immobilier` | Hub territoire, liste des communes | oui | Garder, réécrire | |
| 12 | `/immobilier/[commune]` | **18 pages communes** (liste plus bas) | oui | Garder, monter au gabarit | |
| 13 | `/blog` | Index du blog (Sanity) | oui | Garder | |
| 14 | `/blog/[slug]` | Articles (Sanity) | oui | Garder, alimenter par le guide | |
| 15 | `/guide-vendeur` | Lecteur du guide en ligne | non (noindex, follow) | Garder tel quel | |
| 16 | `/mentions-legales` | Légal | oui | Garder (obligatoire) | |
| 17 | `/politique-confidentialite` | Légal | oui | Garder (obligatoire) | |
| 18 | `/outils` | Hub des outils | oui | Désindexer, garder en ligne | |
| 19 | `/outils/acheter` | Questionnaire projet acheteur (299 l.) | oui | Désindexer, garder en ligne | |
| 20 | `/outils/audit` | **Ton outil d'audit du bien** (345 l.) | oui | Désindexer, garder en ligne | |
| 21 | `/resultats/[token]` | Page de résultat d'un outil, par lien unique | oui | Garder (sert les outils) | |

### Les 18 pages communes

Barjols · Cotignac · Lorgues · Brignoles · Pontevès · Saint-Maximin · Aups · Salernes ·
Vinon-sur-Verdon · Rians · Le Val · Carcès · Montmeyan · Fox-Amphoux · Tourtour ·
Sillans-la-Cascade · Villecroze · Tavernes

---

## B. Redirections déjà en place

| Depuis | Vers | Type |
|---|---|---|
| `/guide` | `/vendre-sans-agence` | 301 |
| `/guide-organique` | `/vendre-sans-agence` | 301 |
| `/vendre-organique` | `/vendre-sans-agence` | 301 |
| `/marche` | `/immobilier` | 301 |
| `/marche/:commune` | `/immobilier/:commune` | 301 |
| `/outils/vendre` | site iad (estimation) | 302 |

Si `/vendre-sans-agence` redirige vers `/vendez-pro`, les trois premières deviennent des chaînes de
redirection. À repointer directement vers `/vendez-pro`.

---

## C. L'applicatif — hors périmètre, ne pas toucher

Ce n'est pas ton site public, c'est ton outil de travail. Rien à décider ici.

| Bloc | Contenu |
|---|---|
| `/admin` | login, mot de passe oublié, reset |
| `/admin/market/*` | 20 pages : leads, clients, acheteurs, opportunités, propriétés, DVF, radar, liste chaude, matching, zones, règles, notifications, réglages, utilisateurs, assistant |
| `/dashboard`, `/dashboard/radar` | tableaux de bord |
| `/espace-client/*` | espace client : accueil, connexion, aperçu, test |
| `/studio/[[...tool]]` | Sanity Studio (l'éditeur du blog) |
| `/api/*` | une soixantaine de routes API |

---

## D. Récapitulatif de ce qui resterait

Si tu suis mes suggestions, le site public passe de **21 routes à 8** :

1. `/` — accueil
2. `/vendez-pro` — la landing du guide, ta page de référence
3. `/immobilier` — hub territoire
4. `/immobilier/[commune]` — 18 pages
5. `/blog` + `/blog/[slug]`
6. `/guide-vendeur` — lecteur
7. `/mentions-legales` + `/politique-confidentialite`
8. `/outils/*` + `/resultats/[token]` — en ligne mais désindexés

Sept pages supprimées avec redirection, trois désindexées, tout le reste conservé.

---

## E. Ce que j'attends de toi

Remplis la colonne **Ta décision** sur les 21 lignes de la section A — ou dis-moi simplement
« je valide tes suggestions » et on applique.

Un mot sur ta crainte, qui était fondée : en gardant `/vendez-pro` comme page de référence, on ne
transpose aucun contenu depuis une autre page. Le design ET les textes de `/vendez-pro` restent la
base, et c'est à partir d'eux qu'on construit la home et les pages communes. Rien ne remonte de
`/vendre-sans-agence`.
