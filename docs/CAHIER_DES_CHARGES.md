# Cahier des charges — Site Alex Lopez Provence & Backoffice Mandat OS

**Version** : 1.0 — État des lieux (généré le 14/06/2026)
**Domaine** : alexlopez-provence.fr
**Porteur du projet** : Alexandre Lopez, mandataire immobilier iad — Provence Verte & Verdon

> Ce document décrit l'état fonctionnel et technique actuel du projet, tel qu'implémenté dans le repo `site-alex-lopez-provence`. Il sert de référentiel pour le pilotage, les évolutions et l'onboarding de nouveaux intervenants.

---

## 1. Contexte et objectifs

### 1.1 Présentation

Le projet regroupe **deux applications dans un seul repo Next.js** :

1. **Site vitrine / marketing & SEO** — public, destiné aux prospects vendeurs et acheteurs en Provence Verte & Verdon (Var).
2. **Backoffice "Mandat OS"** — interface privée (`/admin`) destinée à Alexandre Lopez pour piloter ses leads, le marché immobilier local, les opportunités commerciales et les acquéreurs.

### 1.2 Objectifs métier

- Générer des leads qualifiés **vendeurs** (estimation immobilière) et **acheteurs** (recherche de bien).
- Asseoir une autorité locale via le SEO/GEO (positionnement Provence Verte & Verdon : Barjols, Cotignac, Lorgues, Brignoles, Saint-Maximin, Pontevès...).
- Convertir les visiteurs via un parcours "outil" conversationnel (estimation, recherche, audit).
- Outiller Alexandre pour suivre ses prospects (CRM léger), détecter des opportunités de mandat (annonces en baisse de prix, stagnantes, republiées) et faire du matching acheteur/vendeur.

### 1.3 Positionnement de marque

- Vocabulaire : **"mandataire"**, jamais **"agence"**.
- Ton : épuré, premium, humain, orienté action ("Estimer mon bien", "Prendre RDV").
- Couleur d'accent : Bleu Méditerranée `#0077B6` (déclinaison premium du bleu IAD).
- Police : Plus Jakarta Sans.
- Téléphone affiché : 06 13 18 01 68.

---

## 2. Stack technique

| Composant | Choix |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript strict |
| UI | Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion, Lucide |
| État client | Zustand (stores parcours vendre/acheter/audit) |
| Formulaires | React Hook Form + Zod |
| Base de données | Supabase (PostgreSQL), accès via `supabaseAdmin` (service role) |
| CMS éditorial | Sanity.io (Studio embarqué sur `/studio`) |
| Emails | Resend |
| Cartographie | Leaflet |
| Graphiques | Recharts |
| Drag & drop (Kanban) | dnd-kit |
| i18n | next-intl (FR par défaut, EN) |
| Tests | Vitest |
| Hébergement | Vercel (CI/CD sur push) |
| CRM externe | Attio (sync best-effort) |
| Backup données | Notion (best-effort) |
| Données DVF | API Cerema (primaire) + cquest (fallback) |
| Données cadastre/DPE | API officielle adresse.data.gouv.fr |
| Prise de RDV | Cal.com (lien externe) |

---

## 3. Site vitrine — Périmètre fonctionnel

### 3.1 Pages de conversion

| Route | Rôle |
|---|---|
| `/` | Page d'accueil — héros + CTA (estimer / appeler), FAQ, articles de blog récents, données structurées LocalBusiness + FAQPage |
| `/vendre` | Page éditoriale "vendre" (FR/EN), FAQ, CTA → `/outils/vendre` |
| `/acheter` | Page éditoriale "acheter", FAQ, CTA → `/outils/acheter` |
| `/audit` | Page éditoriale "audit immobilier", FAQ, CTA → `/outils/audit` |
| `/avis-de-valeur-immobilier` | Landing de conversion principale : argumentaire "avis de valeur" (humain vs algorithme), contenu de l'analyse, cas d'usage, zones d'intervention, FAQ, CTA final → `/outils/vendre`. Données structurées Service + LocalBusiness + FAQPage + BreadcrumbList |
| `/a-propos` | Présentation d'Alexandre Lopez, approche, branding personnel |
| `/avis` | Page avis clients (placeholder en attente d'avis vérifiés), CTA → `/contact` |
| `/contact` | Formulaire de contact libre + sidebar coordonnées + bouton de prise de RDV Cal.com |

### 3.2 Outils interactifs ("Mandat OS" côté public)

Hub `/outils`, point d'entrée vers 3 parcours conversationnels (type chatbot) :

#### `/outils/vendre` — Estimation immobilière

Parcours pas-à-pas avec stepper visuel (4 étapes : Bien / Détails / Projet / Contact) :

1. Saisie de l'adresse (autocomplétion via API adresse.gouv.fr) → récupération DPE et données cadastrales.
2. Type de bien, puis sous-type (si maison).
3. Surface habitable (curseur).
4. Surface du terrain (si maison/terrain).
5. Nombre de pièces (curseur).
6. État général du bien (6 niveaux).
7. DPE (A à G + non communiqué).
8. Équipements (sélection multiple, 8 types).
9. Délai de vente souhaité (5 options).
10. Récapitulatif de la saisie.
11. Coordonnées (civilité, prénom, nom, email, téléphone, case RGPD obligatoire).

États techniques : `chat` (questionnaire) → `calcul` (animation de chargement ~3 étapes) → `verification` (si écart entre surface terrain déclarée et surface cadastrale IGN, demande de confirmation) → redirection vers `/resultats/[token]`.

Soumission → `POST /api/leads` (`type: vendre`) → calcul de l'estimation (fourchette basse/médiane/haute via données DVF + comparables), email "magic link" (Resend), enregistrement Notion + Attio (best-effort), upsert Supabase `seller_properties`.

#### `/outils/acheter` — Recherche acquéreur

Questionnaire : type de bien recherché, communes ciblées, budget max, surface minimale, nombre de pièces minimal, critères/équipements souhaités, coordonnées + RGPD.

Soumission → `POST /api/leads` (`type: acheter`) → upsert `buyer_criteria`, alimente le moteur de matching avec les biens du marché et les biens vendeurs.

#### `/outils/audit` — Audit immobilier express

Questionnaire orienté diagnostic du bien (contexte, caractéristiques) → `POST /api/leads` (`type: audit`) → calcul d'un audit synthétique, mêmes mécanismes de notification/CRM.

#### `/resultats/[token]`

Page d'affichage du résultat (estimation, audit ou synthèse acheteur) via lien magique envoyé par email. Récupération des données depuis Notion (avec retries), avec repli sur `localStorage` côté client si indisponible.

### 3.3 Contenu éditorial — Blog (Sanity CMS)

| Route | Rôle |
|---|---|
| `/blog` | Liste des articles publiés (ISR, revalidation 1h) |
| `/blog/[slug]` | Détail d'un article |

Modèle de contenu Sanity :
- **Article** : titre, slug, catégorie, statut (brouillon / relecture / publié), auteur, date de publication, extrait, image de couverture, temps de lecture, mot-clé SEO, meta description, corps riche (texte, images, encarts info, tableaux, étapes numérotées, FAQ), articles liés, FAQ associée.
- **Auteur** : profils des rédacteurs.
- Blocs réutilisables : `infoBox`, `articleTable`, `numberedSteps`, `faq`.
- Catégories : Conseils vendeurs, Conseils acheteurs, Marché local, Droits & démarches, Témoignages, Vie en Provence Verte & Haut-Var.
- Studio Sanity accessible sur `/studio` (édition par Alexandre / éditeurs).

### 3.4 Pages SEO/GEO locales — "Marché"

| Route | Rôle |
|---|---|
| `/marche` | Index territorial Provence Verte & Verdon — grille de 16 communes (Brignoles, Saint-Maximin, Barjols, Cotignac, Aups, Salernes, Vinon-sur-Verdon, Rians, Le Val, Carcès, Montmeyan, Fox-Amphoux, Tourtour, Sillans-la-Cascade, Villecroze, Tavernes) |
| `/marche/[commune]` | Page locale par commune (structure H1 "Immobilier à [Commune] : prix, estimation et conseils pour vendre", repères marché, FAQ locale, maillage vers communes voisines, articles et CTA `/avis-de-valeur-immobilier` puis `/outils/vendre`) |

Stratégie éditoriale détaillée dans `docs/SEO_GEO_PLAN.md` (clusters de mots-clés, priorités P0/P1/P2, structure des pages, maillage interne) et extension opportuniste Aubagne/Étoile/Marseille Est cadrée dans `docs/AUBAGNE_ETOILE_EXTENSION.md` (non productive tant que les conditions de lancement ne sont pas réunies).

### 3.5 Pages légales

- `/mentions-legales`
- `/politique-confidentialite`

### 3.6 Internationalisation

- Locales : `fr` (par défaut) et `en`, via `next-intl`.
- Fichiers de traduction : `messages/fr.json`, `messages/en.json`.
- Cookie `NEXT_LOCALE`.
- Concerne principalement les pages éditoriales (vendre/acheter/audit).

### 3.7 SEO technique & données structurées

- Sitemap dynamique (`sitemap.ts`) et `robots.ts`.
- Données structurées JSON-LD : `LocalBusiness`, `FAQPage`, `Service`, `BreadcrumbList` selon les pages.
- Métadonnées (title/description/OG) par page, optimisées par cluster d'intention.

### 3.8 Suivi & tracking conversion

- **GA4** optionnel (`NEXT_PUBLIC_GA_MEASUREMENT_ID`), aucun script chargé si absent.
- Événements client : `page_view`, `cta_click`, `contact_click`, `phone_click`, `appointment_click`, `local_page_click`.
- Événements serveur (sans données personnelles) : `lead_submit`, `lead_submit_error`.
- Respect vie privée : tracking optionnel, non bloquant, pas de données personnelles dans les logs.

---

## 4. Backoffice "Mandat OS" — Périmètre fonctionnel

### 4.1 Authentification

- Accès via `/admin/login`.
- Authentification simple par mot de passe unique (`ADMIN_PASSWORD`), pose d'un cookie `admin-session` (httpOnly, 7 jours).
- Table Supabase `admin_users` : liste blanche d'emails autorisés (actuellement `alexlopez.studio@gmail.com`).
- Middleware Next.js protégeant `/admin/*` et `/dashboard`.
- `/dashboard` redirige vers `/admin/market`.

### 4.2 Tableau de bord — `/admin/market`

- KPIs : nombre de biens suivis, prix moyen au m², nombre d'opportunités, nombre d'alertes.
- Tendances de prix par zone surveillée.
- Liste des alertes / notifications récentes.
- Derniers biens ajoutés au marché.
- Raccourcis vers les actions fréquentes.

### 4.3 Gestion des leads — `/admin/market/leads`

- Table paginée (20 lignes/page) des prospects issus des outils (`vendre`, `acheter`, `audit`) et du formulaire contact.
- Colonnes : contact (email/téléphone), outil utilisé, statut, commune, statut d'envoi du magic link, date de création, actions.
- Filtres : recherche texte (email/nom), statut, outil.
- Cartes de statistiques (`LeadStatsCards`) : répartition par statut, indicateurs de conversion.
- Statuts du pipeline vendeur : `nouveau → contacté → R1 → mandat → sous-compromis → vendu / perdu`.
- Page détail `/admin/market/leads/[id]` : historique du dossier (`lead_events` — notes, changements de statut, renvois de magic link, suppressions RGPD), actions de mise à jour de statut, renvoi de l'email magic link.

### 4.4 Marché immobilier (annonces) — `/admin/market/properties`

- Table filtrable (recherche, statut, ville, type de bien, tri par prix/jours en ligne/surface) + vue carte (Leaflet).
- Page détail `/admin/market/properties/[id]` : fiche enrichie (prix, surface, DPE, caractéristiques, historique des prix, opportunités liées, alertes liées), action de mise à jour de "signal" métier.
- Alimentation : import automatisé depuis l'API **Stream Estate** (cron `/api/jobs/import-stream-estate`), filtré par codes postaux des zones surveillées.
- Historisation quotidienne (snapshots) pour reconstruire les courbes de prix et détecter les changements.

### 4.5 Détection d'opportunités — "MandatFinder"

Moteur d'analyse batch quotidien (`/api/jobs/analyze-listings`) :

- **Détection d'événements** sur chaque annonce : `price_drop`, `price_increase`, `listing_removed`, `listing_relisted`, `stagnation_90` (90j+ sans changement), `overpriced` (V2, comparaison DVF).
- **Score de probabilité de mandat** (`MandateProbabilityScore`, 0–100) calculé sur 4 axes :
  - Temps en ligne (jusqu'à 40 pts)
  - Frustration / nombre de baisses de prix (jusqu'à 30 pts)
  - Intensité de la dernière baisse (jusqu'à 15 pts)
  - Comportement (republication) (jusqu'à 15 pts)
- Classification en phases : `cold`, `warm`, `hot`, `golden`.
- Page `/admin/dashboard/radar` : tableau de bord "Radar" avec KPIs, filtres, table des annonces scorées et badges de phase vendeur.

### 4.6 Pipeline d'opportunités — `/admin/market/opportunities`

- Vue Kanban (drag & drop, dnd-kit) à 7 colonnes représentant le pipeline (de "À qualifier" à "Mandat potentiel").
- Cartes affichant : type d'opportunité, signal déclencheur, niveau de priorité, bien lié.
- CRUD complet via API (`/api/market/opportunities`).

### 4.7 Moteur de règles d'automatisation — `/admin/market/rules`

- Liste des règles de gestion avec activation/désactivation (toggle), badges de déclencheur, exécution manuelle (avec spinner + notification toast).
- Assistant de création en 4 étapes (`/admin/market/rules/new`) : déclencheur → conditions → actions → activation.
- 6 règles préconfigurées en seed SQL : baisse de prix > 5 %, nouveau bien, bien sous-évalué, stagnation, baisse modérée, expiration d'annonce.
- Exécution manuelle via `POST /api/market/rules/[id]/execute`.

### 4.8 Acquéreurs — `/admin/market/acheteurs`

- Liste des acquéreurs enregistrés (issus de `/outils/acheter` ou saisie manuelle).
- Création manuelle (`/admin/market/acheteurs/nouveau`).
- Détail acquéreur (`/admin/market/acheteurs/[id]`) : critères de recherche, budget, biens correspondants.

### 4.9 Matching acheteur / vendeur — `/admin/market/matching`

- Visualisation du moteur d'appariement entre `buyer_criteria` (critères acheteurs) et `seller_properties` / `listings` (biens marché ou vendeurs).
- Scores de correspondance (`match_results`) calculés sur : commune, type de bien, budget, surface, nombre de pièces.
- Notification possible lorsqu'un nouveau match est trouvé.

### 4.10 Zones surveillées — `/admin/market/zones`

- Gestion des périmètres géographiques (codes postaux / communes) sur lesquels portent l'import des annonces et les règles d'automatisation.
- CRUD via `/api/market/zones`.

### 4.11 Notifications — `/admin/market/notifications`

- Panneau latéral (Sheet) accessible depuis la barre supérieure de l'admin.
- Badges de priorité, actions "marquer comme lu" / "archiver".
- Alimenté par le moteur de règles et la détection d'événements marché.

### 4.12 Paramètres — `/admin/market/settings`

- Paramètres généraux du backoffice (configuration des intégrations, préférences).

---

## 5. Flux de données — Capture de leads

```
Visiteur remplit un outil (/outils/vendre | /outils/acheter | /outils/audit)
        ou le formulaire de contact (/contact)
        │
        ▼
   POST /api/leads  (ou /api/contact pour le formulaire libre)
        │
        ├─ Calcul du résultat (estimation, audit, ou synthèse de recherche)
        │
        ├─ Email "magic link" via Resend → prospect
        ├─ Backup Notion (best-effort, si configuré)
        ├─ Synchronisation Attio CRM (best-effort, si configuré)
        └─ Upsert Supabase :
              - prospects / leads / lead_events  (toujours)
              - seller_properties (si type = vendre)
              - buyer_criteria   (si type = acheter)
        │
        ▼
   Réponse { token, magicLinkUrl, results, emailSent, notionBackup, attioSync }
        │
        ▼
   Client : sauvegarde localStorage + redirection /resultats/[token]
```

Principes :
- **Estimation-first** : aucun service externe (Notion, Attio) ne bloque la réponse au prospect ; tout échec est dégradé en mode "best-effort".
- **RGPD** : consentement obligatoire (case à cocher) avant toute soumission, horodatage du consentement (`rgpd_consent_at`), possibilité de suppression (`lead_event` de type `rgpd_delete`).
- **Email de réception interne** : alexlopez.studio@gmail.com.

---

## 6. Modèle de données (Supabase)

| Table | Rôle | Origine |
|---|---|---|
| `prospects` | Annuaire des contacts (email unique, nom, téléphone, consentement RGPD) | Migration 002 |
| `leads` | Une ligne par soumission de formulaire (outil, statut, données brutes, résultats, commune, magic link) | Migration 001 puis refonte 002 |
| `lead_events` | Journal d'audit par lead (notes, changements de statut, renvoi magic link, suppression RGPD, événements système) | Migration 002 |
| `admin_users` | Liste blanche des emails autorisés sur le backoffice | Migration 002 |
| `buyer_criteria` | Critères de recherche acquéreur (budget, communes, surface, pièces, équipements) | Migration 004 |
| `seller_properties` | Données du bien vendeur (adresse géolocalisée, surfaces, état, DPE, équipements, prix estimé) | Migration 004 |
| `match_results` | Résultats du moteur de matching (score, critères correspondants) | Migration 004 |
| `listings` | Annonces marché importées (Stream Estate) — prix, surface, DPE, statut, géoloc, images | Migration 005 |
| `listing_snapshots` | Historisation quotidienne de l'état de chaque annonce | Migration 005 |
| `listing_events` | Événements détectés (baisse/hausse de prix, retrait, republication, stagnation, surcote) | Migration 005 |
| `seller_scores` | Score quotidien de probabilité de mandat + phase (cold/warm/hot/golden) par annonce | Migration 005 |
| `monitored_zones`, `market_properties`, `property_price_history`, `property_tags`, `management_rules`, `notifications`, `opportunities`, `property_notes`, `sync_runs` | Tables Mandat OS (configuration des zones, règles, opportunités, notifications, journal de synchronisation) | Lots Mandat OS |

---

## 7. Intégrations tierces

| Service | Usage | Mode |
|---|---|---|
| **Resend** | Envoi des emails (magic link résultats, formulaire de contact) | Actif, requis |
| **Sanity.io** | CMS du blog (articles, auteurs, blocs éditoriaux) | Actif, requis |
| **Supabase** | Base de données (leads, marché, matching) | Actif, accès `service_role` côté serveur uniquement |
| **Notion** | Backup des estimations/dossiers (lecture pour `/resultats/[token]`) | Best-effort, optionnel |
| **Attio** | CRM — synchronisation des contacts (People) et, à terme, des pipelines vendeur/acheteur | Best-effort, optionnel, modes progressifs (`people_only` → `people_and_lists`) |
| **Stream Estate** | Source des annonces immobilières du marché local | Actif (cron quotidien) |
| **DVF (Cerema / cquest)** | Ventes comparables pour le calcul d'estimation | Cerema primaire, cquest fallback, dégradation propre vers fallback métier |
| **API adresse.data.gouv.fr** | Autocomplétion d'adresse, DPE, données cadastrales (IGN) | Actif |
| **Cal.com** | Prise de rendez-vous (lien externe intégré sur `/contact`) | Actif |
| **Google Analytics 4** | Mesure d'audience et conversions | Optionnel, désactivé si variable absente |

---

## 8. API — Inventaire des routes

| Route | Méthodes | Rôle |
|---|---|---|
| `/api/leads` | POST | Soumission d'un outil (vendre/acheter/audit) — calcul + notifications + persistance |
| `/api/leads/list` | GET | Liste paginée des leads (admin) |
| `/api/leads/[id]` | GET, PUT | Détail / mise à jour d'un lead (statut, notes) |
| `/api/leads/[id]/resend` | POST | Renvoi du magic link |
| `/api/leads/stats` | GET | Statistiques agrégées des leads |
| `/api/contact` | POST | Formulaire de contact → email |
| `/api/audit` | POST | Calcul de l'audit immobilier |
| `/api/estimation` | POST | Calcul d'estimation (legacy) |
| `/api/adresse-infos` | GET | DPE + cadastre via coordonnées/adresse |
| `/api/environment-profile` | GET | Profil environnemental d'un secteur |
| `/api/admin/login` | POST | Authentification admin |
| `/api/market/properties`, `/[id]` | GET, POST, PATCH, DELETE | CRUD annonces marché |
| `/api/market/opportunities`, `/[id]` | GET, POST, PATCH, DELETE | CRUD opportunités |
| `/api/market/buyers`, `/[id]` | GET, POST, PUT, DELETE | CRUD acquéreurs |
| `/api/market/rules`, `/[id]`, `/[id]/execute` | GET, POST, PATCH, DELETE, POST | CRUD règles + exécution manuelle |
| `/api/market/matching`, `/buyers`, `/migrate` | GET, POST | Moteur de matching |
| `/api/market/notifications`, `/[id]` | GET, POST, PATCH | CRUD notifications |
| `/api/market/zones`, `/[id]` | GET, POST, PATCH, DELETE | CRUD zones surveillées |
| `/api/market/sync` | POST | Synchronisation manuelle des annonces |
| `/api/jobs/import-stream-estate` | POST (cron) | Import quotidien des annonces |
| `/api/jobs/analyze-listings` | POST (cron) | Analyse + scoring quotidien |
| `/api/radar/listings` | GET | Requêtes filtrées pour le dashboard Radar |
| `/api/outils/checks` | GET | Vérifications/diagnostics des outils |

---

## 9. Contraintes techniques & opérationnelles

- **Crons Vercel** : limite de 2 jobs/jour sur le plan actuel (Hobby) — import et analyse doivent être mutualisés ou nécessitent un passage au plan Pro.
- **Single-tenant** : aucune logique multi-utilisateurs pour le moment (un seul mandataire, un seul compte admin).
- **Robustesse DVF** : si les sources (Cerema, cquest) sont indisponibles, l'estimation bascule sur un fallback métier interne — jamais d'échec bloquant.
- **RGPD** : opt-in obligatoire, pas de données personnelles dans les logs d'événements serveur, droit à la suppression via `lead_event` dédié.
- **Mode estimation-first** : les services externes (Notion, Attio, GA4) sont tous optionnels et n'empêchent jamais la réponse au prospect.

---

## 10. Pistes d'évolution identifiées (roadmap)

| Lot | Évolution |
|---|---|
| Marché V2 | Enrichissement DVF (prix/m² de référence par commune), détection de surcote/décote dans le scoring, intégration cadastre/PLU |
| Marché V3 | Notifications Telegram, recommandations IA (DeepSeek), prédiction de mandat |
| Pipeline | Dashboard de consommation API Stream Estate (volume/jour, coût estimé) |
| Acquisition | Pipeline vendeurs/prospects enrichi, gestion fine des demandes d'estimation |
| CRM | Passage Attio en mode `people_and_lists` puis `full` (attributs détaillés vendeur/acheteur) |
| SEO/GEO | Enrichissement progressif des pages communes (Brignoles, Pontevès...), nouveaux articles "conseils vendeurs", extension contrôlée Aubagne/Étoile/Marseille Est selon signaux Search Console |
| Pages locales | Enrichissement du contenu `/marche/[commune]` (repères marché, FAQ locale, maillage) |
| Avis clients | Remplissage de `/avis` avec témoignages vérifiés |

---

## 11. Glossaire

- **Mandat OS** : nom interne du backoffice de pilotage commercial/marché.
- **MandatFinder** : sous-système de détection d'opportunités de mandat à partir des signaux d'annonces publiques.
- **Magic link** : lien unique envoyé par email permettant au prospect de consulter son résultat sans authentification.
- **DVF** : Demandes de Valeurs Foncières (base de données des transactions immobilières en France).
- **Phase vendeur** : classification `cold` / `warm` / `hot` / `golden` selon la probabilité d'obtenir un mandat.
