# Mémoire de session — Mandat OS MVP

**Date** : 31 mai → 1er juin 2026  
**Dernier commit** : `4e219d5` (pushé sur `main`)  
**Preview Vercel** : https://site-alex-lopez-provence-4gskmtyuu-alexlopez-studio.vercel.app

---

## 1. Projet & Architecture

- **Un seul repo** : `site-alex-lopez-provence` → contient site vitrine + Mandat OS
- **L'ancien dépôt `app-alex-lopez-provence`** est ignoré (obsolète)
- **Stack** : Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase, Stream Estate
- **Hébergement** : Vercel (projet `alexlopez-studio/site-alex-lopez-provence`)
- **Vercel CLI** 54.6.1 installé et connecté
- **Specify CLI (Spec Kit)** v0.9.0 installé via `uv tool install specify-cli`

## 2. GitHub Spec Kit — Spec-Driven Development

Le **Spec Kit** est installé et initialisé dans le projet. Il permet de décrire ce qu'on veut construire (le "quoi" et le "pourquoi") et génère automatiquement des specs, plans et tâches.

### Commandes disponibles (slash commands dans le coding agent) :

| Commande | Usage |
|---|---|
| `/speckit.constitution` | Établir les principes du projet et les guidelines |
| `/speckit.specify` | Créer une spécification baseline |
| `/speckit.plan` | Créer un plan d'implémentation technique |
| `/speckit.tasks` | Générer des tâches actionnables |
| `/speckit.implement` | Exécuter l'implémentation |
| `/speckit.clarify` | Questions structurées pour lever les ambiguïtés |
| `/speckit.analyze` | Rapport de cohérence cross-artefacts |
| `/speckit.checklist` | Checklist qualité |

### Installation :
- `uv` (Python package manager) installé
- `specify` CLI installé (v0.9.0)
- Projet initialisé avec intégration **copilot**
- Fichiers dans `.specify/` et `.github/`

## 3. Supabase

- **URL** : `https://byrsmbgfkvgxdtdyhrro.supabase.co`
- **Tables existantes** : prospects, leads, lead_events, admin_users (Phase B)
- **Tables Mandat OS** (déjà créées dans Supabase) :
  - `monitored_zones`, `market_properties`, `property_price_history`, `property_tags`
  - `management_rules`, `notifications`, `opportunities`, `property_notes`, `sync_runs`
- **Client** : `src/lib/supabase.ts` (lazy Proxy, supabaseAdmin pour les API routes)

## 4. Fichiers créés

### Lot 1 — Infrastructure & synchronisation

| Fichier | Description |
|---|---|
| `src/types/supabase.ts` | Types TypeScript pour toutes les tables (Phase B + Mandat OS) |
| `src/lib/env.ts` | Ajout de `streamEstate` (apiUrl, apiKey) |
| `src/lib/stream-estate.ts` | Client Stream Estate : `fetchListings()`, `fetchListingById()` + normalisation |
| `src/app/api/market/properties/route.ts` | `GET /api/market/properties` — liste filtrée |
| `src/app/api/market/properties/[id]/route.ts` | `GET/PATCH /api/market/properties/[id]` — détail + signal métier |
| `src/app/api/market/sync/route.ts` | `POST /api/market/sync` — sync par code postal + moteur de règles |
| `docs/MEMOIRE_SESSION.md` | Mémoire de session pour transfert entre chats |

### Lot 2 — API routes CRUD (créées le 01/06/2026)

| Fichier | Méthodes | Description |
|---|---|---|
| `src/app/api/market/rules/route.ts` | `GET`, `POST` | Liste + création règles de gestion |
| `src/app/api/market/rules/[id]/route.ts` | `GET`, `PATCH`, `DELETE` | Détail, modification, suppression règle |
| `src/app/api/market/notifications/route.ts` | `GET`, `PATCH` | Liste + mise à jour groupée notifications |
| `src/app/api/market/notifications/[id]/route.ts` | `PATCH` | Mise à jour status notification individuelle |
| `src/app/api/market/opportunities/route.ts` | `GET`, `POST` | Liste + création opportunités |
| `src/app/api/market/opportunities/[id]/route.ts` | `GET`, `PATCH`, `DELETE` | Détail, modification, suppression opportunité |
| `src/app/api/market/zones/route.ts` | `GET`, `POST` | Liste + création zones surveillées |
| `src/app/api/market/zones/[id]/route.ts` | `GET`, `PATCH`, `DELETE` | Détail, modification, suppression zone |

## 5. Ce qui a été fait

### Lot 3 — Pages UI (interface utilisateur) ✅
- [x] **Dashboard** : page d'accueil Mandat OS (KPIs, alertes, actions récentes, tendances prix par zone)
- [x] **Table marché** : page principale avec table filtrable (recherche, status, ville, type, tri)
- [x] **Détail bien** : page fiche bien enrichie (caractéristiques, historique prix, DPE, opportunités liées)
- [x] **Kanban opportunités** : pipeline 7 colonnes (À qualifier → Mandat potentiel), cartes type/signal/priorité
- [x] **Règles** : liste avec toggle activation, badges déclencheurs, exécution manuelle
- [x] **Notifications** : Sheet latéral accessible depuis topbar, badges de priorité

### Lot 4 — Moteur de règles ✅
- [x] Assistant création règle UI (4 étapes : déclencheur → conditions → actions → activation)
- [x] Route API exécution manuelle `POST /api/market/rules/[id]/execute`
- [x] Règles préconfigurées en seed SQL (6 règles)
- [x] Bouton exécuter avec spinner + toast dans RulesList

### Autres corrections
- [x] Header/footer supprimés de la zone admin
- [x] Route /dashboard avec redirection vers /admin/market
- [x] Middleware protège /dashboard + /admin
- [x] Variables CSS shadcn dans @theme
- [x] Spec Kit reconfiguré pour Claude (était Copilot)
- [x] Button.tsx : variant primary rétabli

### Fichiers créés

#### Lot 1 — Infrastructure & synchronisation

| Fichier | Description |
|---|---|
| `src/types/supabase.ts` | Types TypeScript pour toutes les tables (Phase B + Mandat OS) |
| `src/lib/env.ts` | Ajout de `streamEstate` (apiUrl, apiKey) |
| `src/lib/stream-estate.ts` | Client Stream Estate : `fetchListings()`, `fetchListingById()` + normalisation |
| `src/app/api/market/properties/route.ts` | `GET /api/market/properties` — liste filtrée |
| `src/app/api/market/properties/[id]/route.ts` | `GET/PATCH /api/market/properties/[id]` — détail + signal métier |
| `src/app/api/market/sync/route.ts` | `POST /api/market/sync` — sync par code postal + moteur de règles |

#### Lot 2 — API routes CRUD

| Fichier | Méthodes | Description |
|---|---|---|
| `src/app/api/market/rules/route.ts` | `GET`, `POST` | Liste + création règles de gestion |
| `src/app/api/market/rules/[id]/route.ts` | `GET`, `PATCH`, `DELETE` | Détail, modification, suppression règle |
| `src/app/api/market/notifications/route.ts` | `GET`, `PATCH` | Liste + mise à jour groupée notifications |
| `src/app/api/market/notifications/[id]/route.ts` | `PATCH` | Mise à jour status notification individuelle |
| `src/app/api/market/opportunities/route.ts` | `GET`, `POST` | Liste + création opportunités |
| `src/app/api/market/opportunities/[id]/route.ts` | `GET`, `PATCH`, `DELETE` | Détail, modification, suppression opportunité |
| `src/app/api/market/zones/route.ts` | `GET`, `POST` | Liste + création zones surveillées |
| `src/app/api/market/zones/[id]/route.ts` | `GET`, `PATCH`, `DELETE` | Détail, modification, suppression zone |

#### Lot 3 — Pages UI

| Fichier | Description |
|---|---|
| `src/app/admin/market/layout.tsx` | Layout avec sidebar navigation (Pilotage + Configuration), topbar, NotificationsSheet |
| `src/app/admin/market/page.tsx` | Dashboard — page d'accueil |
| `src/app/admin/market/DashboardContent.tsx` | KPIs (biens, prix/m², opportunités, alertes), tendances par zone, alertes récentes, derniers biens, actions rapides |
| `src/app/admin/market/properties/page.tsx` | Table marché — page liste |
| `src/app/admin/market/properties/PropertiesTable.tsx` | Table filtrable avec recherche, status/ville/type, tri prix/jours/surface |
| `src/app/admin/market/properties/[id]/page.tsx` | Détail bien — page fiche |
| `src/app/admin/market/properties/[id]/PropertyDetail.tsx` | Fiche enrichie : prix, surface, DPE, caractéristiques, historique prix, opportunités, alertes |
| `src/app/admin/market/opportunities/page.tsx` | Kanban — page pipeline |
| `src/app/admin/market/opportunities/KanbanBoard.tsx` | Kanban 7 colonnes, cartes avec type/signal/priorité/propriété liée |
| `src/app/admin/market/rules/page.tsx` | Règles — page liste |
| `src/app/admin/market/rules/RulesList.tsx` | Liste en grille avec toggle, badges déclencheur, exécution manuelle via API |
| `src/components/admin/NotificationsSheet.tsx` | Sheet latéral notifications avec badges priorité, actions marquer/archiver |
| `src/app/dashboard/page.tsx` | Route /dashboard → redirection vers /admin/market |

#### Lot 4 — Moteur de règles

| Fichier | Description |
|---|---|
| `src/app/api/market/rules/[id]/execute/route.ts` | `POST /api/market/rules/[id]/execute` — exécution manuelle |
| `src/components/admin/RuleWizard.tsx` | Assistant création 4 étapes (déclencheur → conditions → actions → activation) |
| `src/app/admin/market/rules/new/page.tsx` | Route `/admin/market/rules/new` |
| `supabase/migrations/003_seed_rules.sql` | 6 règles préconfigurées (baisse >5%, nouveau bien, sous-évalué, stagnation, baisse modérée, expiration) |

### Routes disponibles

| URL | Description |
|---|---|
| `/dashboard` | Redirige vers `/admin/market` |
| `/admin/market` | Dashboard Mandat OS |
| `/admin/market/properties` | Tableau du marché |
| `/admin/market/properties/[id]` | Détail d'un bien |
| `/admin/market/opportunities` | Kanban pipeline |
| `/admin/market/rules` | Liste des règles |
| `/admin/market/rules/new` | Assistant création de règle |

## 6. Ce qu'il reste à faire (TODO)

### Lot 5 — Suivi conso API
- [ ] Dashboard consommation Stream Estate (items/jour, coût estimé)

### Pages restantes
- [ ] Pipeline vendeurs / prospects
- [ ] Gestion des demandes d'estimation

## 6. Déploiement

- **Commit et push sur `main`** → déclenche build **Production**
- **Pour Preview** : `vercel deploy --yes` (build OK)
- **Variables Vercel** : STREAMESTATE_API_URL et STREAMESTATE_API_KEY en mode Preview + Production (pas Development)
- **Pour tester en local** : ajouter manuellement dans `.env.local` :
  ```
  STREAMESTATE_API_URL=<demander à Alexandre>
  STREAMESTATE_API_KEY=<demander à Alexandre>
  ```

## 7. Conventions de code

- API routes : `src/app/api/market/[resource]/route.ts`
- Client Stream Estate : `src/lib/stream-estate.ts`
- Types : dans `src/types/supabase.ts` (format Row/Insert/Update/Relationships)
- Supabase : utiliser `supabaseAdmin` (service_role) pour les API routes
- Aucun multi-tenant (single tenant pour Alexandre)
- Pour les updates typés, utiliser `Database['public']['Tables'][table]['Update']` comme type