# Mémoire de session — Mandat OS MVP

**Date** : 31 mai → 1er juin 2026  
**Dernier commit** : `234c424` (pushé sur `main` et `preview`)  
**Preview Vercel** : https://site-alex-lopez-provence-4gskmtyuu-alexlopez-studio.vercel.app

---

## 1. Projet & Architecture

- **Un seul repo** : `site-alex-lopez-provence` → contient site vitrine + Mandat OS
- **L'ancien dépôt `app-alex-lopez-provence`** est ignoré (obsolète)
- **Stack** : Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase, Stream Estate
- **Hébergement** : Vercel (projet `alexlopez-studio/site-alex-lopez-provence`)
- **Vercel CLI** 54.6.1 installé et connecté

## 2. Supabase

- **URL** : `https://byrsmbgfkvgxdtdyhrro.supabase.co`
- **Tables existantes** : prospects, leads, lead_events, admin_users (Phase B)
- **Tables Mandat OS** (déjà créées dans Supabase) :
  - `monitored_zones`
  - `market_properties` (source: stream_estate)
  - `property_price_history`
  - `property_tags`
  - `management_rules`
  - `notifications`
  - `opportunities`
  - `property_notes`
  - `sync_runs`
- **Client** : `src/lib/supabase.ts` (lazy Proxy, supabaseAdmin pour les API routes)

## 3. Fichiers créés

| Fichier | Description |
|---|---|
| `src/types/supabase.ts` | Types TypeScript pour toutes les tables (Phase B + Mandat OS) |
| `src/lib/env.ts` | Ajout de `streamEstate` (apiUrl, apiKey) |
| `src/lib/stream-estate.ts` | Client Stream Estate : `fetchListings()`, `fetchListingById()` + normalisation |
| `src/app/api/market/properties/route.ts` | `GET /api/market/properties` — liste filtrée (zipcode, city, price, dpe, tag, pagination...) |
| `src/app/api/market/sync/route.ts` | `POST /api/market/sync` — sync par code postal + moteur de règles intégré |
| `src/app/api/market/properties/[id]/route.ts` | `GET /api/market/properties/[id]` — détail + historique prix + signal métier + `PATCH` |

## 4. Ce qu'il reste à faire (TODO)

### Lot 2 — API routes restantes
- [ ] API CRUD règles : `GET/POST/PATCH/DELETE /api/market/rules`
- [ ] API notifications : `GET /api/market/notifications`, `PATCH /api/market/notifications/[id]`
- [ ] API opportunités : `GET/POST/PATCH /api/market/opportunities`
- [ ] API zones : `GET/POST/DELETE /api/market/zones`

### Lot 3 — Pages UI (interface utilisateur)
- [ ] **Dashboard** : page d'accueil Mandat OS (KPIs, alertes, actions)
- [ ] **Table marché** : page principale avec table filtrable (TanStack Table recommandé)
- [ ] **Détail bien** : page fiche bien enrichie
- [ ] **Kanban opportunités** : pipeline glisser-déposer
- [ ] **Règles** : liste + assistant création 4 étapes
- [ ] **Notifications** : volet latéral accessible depuis toutes les pages
- [ ] **Vendeurs** : pipeline vendeur / prospects
- [ ] **Estimation** : gestion des demandes estimation

### Lot 4 — Moteur de règles (déjà partiellement fait dans sync)
- [ ] Assistant création règle UI (4 étapes : déclencheur → conditions → actions → activation)
- [ ] Exécution manuelle d'une règle
- [ ] Règles préconfigurées à insérer en seed

### Lot 5 — Suivi conso API
- [ ] Dashboard consommation Stream Estate (items/jour, coût estimé)

## 5. Déploiement

- **Commit et push sur `main`** → déclenche build **Production**
- **Pour Preview** : `vercel deploy --yes` (déjà fait, build OK)
- **Variables Vercel** : STREAMESTATE_API_URL et STREAMESTATE_API_KEY sont en mode Preview + Production (pas Development)
- **Pour tester en local** : ajouter manuellement dans `.env.local` :
  ```
  STREAMESTATE_API_URL=<demander à Alexandre>
  STREAMESTATE_API_KEY=<demander à Alexandre>
  ```

## 6. Conventions de code

- API routes : `src/app/api/market/[resource]/route.ts`
- Client Stream Estate : `src/lib/stream-estate.ts`
- Types : dans `src/types/supabase.ts` (format Row/Insert/Update/Relationships)
- Supabase : utiliser `supabaseAdmin` (service_role) pour les API routes
- Aucun multi-tenant (single tenant pour Alexandre)