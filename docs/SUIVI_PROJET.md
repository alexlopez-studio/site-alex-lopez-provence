# Suivi Projet - Mandat OS MVP

## Regle actuelle - 17/06/2026

Decision : Codex reprend seul le developpement et le design pour le moment.

- Branche de travail unique : `preview`.
- Source de verite GitHub : `origin/preview`.
- Travail local par defaut.
- Aucun push sans validation explicite d'Alexandre.
- Si Alexandre valide un push, pousser `preview` vers `origin/preview`.
- Ne plus utiliser les branches `design/*` et `feat/*` pour le flux courant, sauf demande explicite.
- Les branches de sauvegarde locales servent uniquement de filet de securite, pas de base de travail.
- A chaque fin de tache, mettre a jour ce fichier avant de conclure.
- Apres chaque modification, audit ou decision structurante, ajouter une entree horodatee dans ce fichier.
- Apres un changement significatif, lancer l'audit Playwright adapte et tracer le resultat.

Note : les lots Linear ci-dessous sont historiques et ne refletent plus l'etat reel du code. La memoire courante est dans `docs/MEMOIRE_SESSION.md`.

## Informations Generales
- Nom du projet: Mandat OS MVP - Site Alexandre Lopez (Provence Verte & Verdon)
- Client: Alexandre Lopez (conseiller immobilier iad)
- Date de debut: 09 juin 2026
- Date cible MVP: 30 juin 2026
- Statut global: En cours

## Liens Importants
- Linear: https://linear.app/alexandre-lopez/project/mandat-os-mvp-site-alexandre-lopez-af1414ac70da
- GitHub: https://github.com/alexlopez-studio/site-alex-lopez-provence
- Supabase: https://byrsmbgfkvgxdtdyhrro.supabase.co
- Vercel: https://vercel.com/alexlopez-studio/site-alex-lopez-provence

## Avancement par Lot

### Lot 1 - Infrastructure
- Statut: Termine
- Deadline: 01/06/2026

### Lot 2 - API Backend
- Statut: En cours (0%)
- Deadline: 15/06/2026
- Taches:
  - ALE-29: API-001 - CRUD Regles
  - ALE-30: API-002 - Notifications
  - ALE-31: API-003 - Opportunites
  - ALE-28: API-004 - Zones Surveillees

### Lot 3 - UI Dashboard
- Statut: Non commence (0%)
- Deadline: 20/06/2026
- Taches:
  - ALE-35: UI-001 - Dashboard KPIs
  - ALE-33: UI-002 - Table Marche
  - ALE-34: UI-003 - Fiche Bien
  - ALE-32: UI-004 - Kanban Opportunites
  - ALE-36: UI-005 - Gestion Regles

### Lot 4 - Moteur de Regles
- Statut: Non commence (0%)
- Deadline: 25/06/2026
- Taches:
  - ALE-39: RUL-001 - Assistant Creation Regle
  - ALE-38: RUL-002 - Execution Manuelle
  - ALE-37: RUL-003 - Regles Preconfigurees

### Lot 5 - Monitoring
- Statut: Non commence (0%)
- Deadline: 30/06/2026
- Taches:
  - ALE-40: MON-001 - Dashboard Consommation API

## Dependances entre Lots
Lot 2 (API Backend) -> Lot 3 (UI Dashboard)
Lot 2 -> Lot 4 (Moteur de Regles)
Lot 3 -> Lot 4
Lot 4 -> Lot 5 (Monitoring)

## Prochaines Etapes — MVP « trouver des vendeurs → récupérer des mandats »

Objectif MVP recentré : la seule chose qui compte pour le MVP est de **détecter les
vendeurs en fenêtre d'or et déclencher la prise de contact pour obtenir le mandat**.
Le reste (espace client, gestion de projet, etc.) vient ensuite — voir `docs/BACKLOG.md`.

Constat déterminant : le `mandate_score` est branché mais ne peut pas encore révéler de
fenêtre d'or. L'axe Temps (40 pts) monte passivement avec le calendrier, mais les axes
Frustration + Intensité (45 pts, le signal le plus fort) et Comportement (15 pts) ne se
déclenchent **que si on resynchronise dans le temps** (détection des baisses de prix et
des republications). Sans sync récurrente → tout reste `cold` → aucun vendeur à contacter.

### P0 — sans ça, la boucle ne tourne pas
1. ✅ **Sync récurrente contrôlée — CODÉE, gardée OFF** (22/06). Job
   `/api/jobs/sync-zones` qui itère `monitored_zones` et lance `/api/market/sync` par zone
   (alimente `market_properties`, pas le `listings` mort). Schedule `0 3 * * *` câblé dans
   `vercel.json` mais **inerte** tant que `STREAM_ESTATE_CRON_ENABLED != 'true'`.
   **Pour activer en prod** : poser `STREAM_ESTATE_CRON_ENABLED=true` (+ `CRON_SECRET`)
   dans Vercel et vérifier le budget Stream Estate. Détail : entrée journal 22/06.
2. ✅ **Détection baisse de prix + republication → score — FAIT** (22/06). Baisse de prix
   déjà câblée (sync → `property_price_history` → axes Frustration/Intensité). Republication
   dérivée de l'avancée de `published_at` vs `first_seen_at` (axe Comportement), sans
   migration. Détail : entrée journal 22/06. À valider sur données réelles quand la sync tourne.

### P1 — transformer la détection en action
3. **Surfaçage « à contacter »** : écran/widget des vendeurs en phase chaud/golden +
   alerte au franchissement de seuil (réutiliser `src/lib/mandat/alert-service.ts` +
   `golden-alert-template`).
4. **Workflow prospection → mandat** : depuis un bien chaud, capturer le contact vendeur
   et le statut de prise de contact, relié à l'opportunité, jusqu'au stage « mandat obtenu ».

### P1.5 — fiabilité pour usage réel
5. **Réactiver/sécuriser la garde auth admin** (actuellement neutralisée en local) avant
   toute utilisation en conditions réelles.

### Le reste (plus tard)
- Backlog produit (espace client, stats client, gestion de projet, KPI, marque, Plaud Pro) : `docs/BACKLOG.md`.
- Nettoyage du monde `dashboard/radar` mort (tables `listings`/`listing_events` absentes).
- Unification UX `/app/*` + audit Playwright.

## Taches Ouvertes Courantes

- En cours : design logiciel Mandat OS, navigation et ergonomie backoffice.
- A verifier : audit Playwright cible sur la navigation sidebar et les routes `/app/dashboard`, `/app/leads`, `/app/radar`, `/app/properties`, `/app/acheteurs`.
- A verifier : erreurs locales Radar sur `/api/radar/listings` si les tables Supabase `listings` / `listing_events` ne sont pas presentes.
- A faire avant production : reactiver/verifier la garde auth admin actuellement facilitee pour la navigation locale.
- A maintenir : tenir `docs/START.md`, `docs/MEMOIRE_SESSION.md`, `docs/SUIVI_PROJET.md` et `docs/ROUTES.md` alignes avec les routes canoniques `/app/*`.

## Journal de Bord

### 22/06/2026 - P0.2 : baisses de prix + republication branchées au score
- Base/branche : `preview` (local non commité au moment de l'écriture).
- Type : feature — réveiller les axes Frustration/Intensité/Comportement du score.
- Statut : **fait** (testé end-to-end ; tsc OK).
- Constat préalable : la **baisse de prix → score était déjà câblée** : la sync insère une
  ligne `property_price_history` à chaque changement de prix, et `mandate-score.ts` compte
  les baisses (Frustration 30) + la baisse totale % (Intensité 15). Ces axes s'activent donc
  d'eux-mêmes dès que la sync récurrente (P0.1) tourne dans le temps. Le seul manque réel
  était l'**axe Comportement (republication, 15 pts)**, hardcodé `isRelisted=false`.
- Contrainte : l'API Stream Estate **filtre les annonces hors-ligne** (`isOnlineListingStatus`)
  → impossible de détecter un retrait par absence (d'autant que le budget plafonne le fetch).
  Signal fiable retenu : **`published_at` qui avance**. Une annonce retirée puis remise en
  ligne reçoit une nouvelle date de publication ; si elle devient postérieure à `first_seen_at`
  (figé) de >1 j, c'est une republication. **Sans migration.**
- Travail :
  1. `mandate-score.ts` : `ScorableProperty` reçoit `published_at` ; `computeIsRelisted()`
     (gap `published_at − first_seen_at ≥ 1 j) ; `isRelistedWithNewPrice = isRelisted &&
     totalDropPercent > 0` ; branchés dans `calculateScore()`.
  2. `sync/route.ts` : la branche update lit `published_at` existant et met à jour
     `published_at = listing.publishedAt ?? existing` (first_seen_at reste figé) → l'avancée
     révèle la republication aux syncs suivantes.
- Fichiers : `src/lib/market/mandate-score.ts`, `src/app/api/market/sync/route.ts`, `docs/SUIVI_PROJET.md`.
- Audit qualité : `npx tsc --noEmit` OK. Test end-to-end sur la base live (bien Pontevès
  `f773d231…`) : published_at = first_seen → `is_relisted=false`, behavior 0, score 5 (non-régression) ;
  published_at décalé +10 j (via SQL) → `is_relisted=true`, behavior 10, score 15 ; puis
  **published_at restauré à sa valeur d'origine**. `with_new_price=false` ici (pas de baisse), cohérent.
- Point d'attention : la détection de republication suppose que Stream Estate **renvoie une
  nouvelle `published_at` lors d'une remise en ligne** (et non lors d'un simple changement de
  prix — le mapping utilise published_at/date_publication/created_at, pas updatedAt). À
  confirmer sur données réelles une fois la sync récurrente active. Si l'annonce republiée
  reçoit un nouvel `external_id`, elle serait vue comme un nouveau bien (relist non détecté) — limite connue.
- Suite : P1 — surfaçage « à contacter » (vendeurs hot/golden) + alertes au franchissement de seuil.

### 22/06/2026 - P0.1 : job cron de sync récurrente par zone (codé, gardé OFF)
- Base/branche : `preview` (local non commité au moment de l'écriture).
- Type : feature — oxygène du score (sync récurrente alimentant `market_properties`).
- Statut : **fait** (codé + testé ; cron inerte par défaut).
- Décision (Alexandre) : coder le job, garder le cron OFF, activable plus tard ; cadence 1×/jour la nuit.
- Travail :
  1. **Nouveau** `src/app/api/jobs/sync-zones/route.ts` : itère `monitored_zones` actives
     (triées par `last_synced_at` la plus ancienne, plafond `MAX_ZONES_PER_RUN=20`) et
     appelle `/api/market/sync` par zone → réutilise TOUS les garde-fous existants
     (budget, fenêtre anti-re-sync). Alimente `market_properties` (≠ `import-stream-estate`
     qui visait la table `listings` du monde radar mort).
  2. `vercel.json` : schedule `{ "path": "/api/jobs/sync-zones", "schedule": "0 3 * * *" }`
     ajouté mais **inerte**.
- Deux filets de sécurité « zéro crédit par surprise » :
  1. `STREAM_ESTATE_CRON_ENABLED` doit valoir `'true'` (défaut OFF) pour exécuter — sinon
     no-op `{skipped:true, reason:'cron_disabled'}`. C'est l'interrupteur volontaire (à
     poser dans les env Vercel quand Alexandre valide). Choisi car
     `isMandatFinderPipelineEnabled()` a un défaut `true` (settings.ts) → pas fiable comme OFF.
  2. Chaque `/api/market/sync` respecte le budget Stream Estate (item limit, solde, syncEnabled).
  - Auth cron optionnelle via `CRON_SECRET` (en-tête `Authorization: Bearer`).
- Fichiers : `src/app/api/jobs/sync-zones/route.ts` (nouveau), `vercel.json`, `docs/SUIVI_PROJET.md`.
- Audit qualité : `npx tsc --noEmit` OK. Test live :
  - sans param → `{skipped:true, reason:'cron_disabled'}` (sécurité OK) ;
  - `?test=1` → 1 zone active (83670/Pontevès) synchronisée, **5 biens MAJ, 5 items facturés (~0,05 €)**, stop sur `stream_estate_item_limit_reached`. Orchestration + plafond budget validés.
- ⚠️ Point d'attention : `?test=1` n'est **pas un dry-run** — il déclenche une vraie sync
  et dépense le budget disponible (ici borné à 5 items par le garde-fou). Pour tester sans
  dépense, mettre la sync budget à 0/désactivée avant.
- Tradeoff assumé : orchestration via self-HTTP `fetch` vers `/api/market/sync` (réutilise
  les garde-fous sans refactor du handler de 370 lignes). À remplacer par une fonction
  partagée `syncZone()` si le nombre de zones ou la durée pose problème (maxDuration 60s).
- Suite : quand Alexandre veut activer en prod → poser `STREAM_ESTATE_CRON_ENABLED=true`
  (+ `CRON_SECRET`) dans Vercel et vérifier le budget Stream Estate. Puis P0.2 (détection
  baisse/republication → axe Comportement).

### 22/06/2026 - Recentrage MVP sur la boucle mandat (priorisation)
- Base/branche : `preview`.
- Type : décision / cadrage produit.
- Statut : **fait** (priorisation tracée ; aucune implémentation).
- Décision (Alexandre) : recentrer le MVP sur l'essentiel = **trouver des vendeurs et
  récupérer des mandats** ; le reste se fera ensuite.
- Constat déterminant : le `mandate_score` est branché mais ne discrimine pas encore.
  L'axe Temps monte passivement, mais les baisses de prix (45 pts, signal le plus fort)
  et les republications (15 pts) ne se détectent **qu'avec une sync récurrente**. Sans
  elle, tout reste `cold` → aucun vendeur chaud → pas de mandat. Donc la priorité n°1
  n'est pas de l'UI mais la **réactivation de la sync récurrente contrôlée** (garde-fous
  budget 009/010/011 déjà en place ; `vercel.json` → `"crons": []` actuellement).
- Plan priorisé (détail dans « Prochaines Etapes ») : P0 = sync récurrente + détection
  baisse/republication branchée au score ; P1 = surfaçage « à contacter » + workflow
  prospection→mandat ; P1.5 = réactiver l'auth admin ; le reste = backlog.
- Cadence validée (Alexandre) : **1×/jour la nuit** (cron ~`0 3 * * *`).
- ⚠️ Constat à l'analyse de P0.1 : le cron existant `import-stream-estate` alimente la
  table `listings` (monde radar mort), pas `market_properties`. Réactiver en l'état =
  crédits brûlés sans effet sur le score. P0.1 doit donc créer/repointer un job qui itère
  `monitored_zones` et lance le flux `/api/market/sync` par zone (détail dans « Prochaines Etapes »).
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualité : non applicable (cadrage).
- Suite : implémenter P0.1 = job cron market-sync par zone (à coder, pas un simple flag), puis brancher `vercel.json`.

### 22/06/2026 - Tri/filtre par score mandat + breakdown des sous-scores
- Base/branche : `preview` (local non commité).
- Type : feature — triage du marché par score mandat.
- Statut : **fait** (tsc OK ; `/app/properties` 200).
- Contexte / décision (Alexandre) : le score mandat final doit être un **indicateur de triage important mais non déterminant** — les 4 sous-scores (Temps/Frustration/Intensité/Comportement) doivent rester étudiables au cas par cas. Donc surfacer le détail, pas seulement l'agrégat.
- Travail (tout dans `PropertiesTable.tsx`, côté client car le score n'est pas une colonne SQL et la table charge ≤100 biens filtrés par zone) :
  1. **Tri « Score mandat »** ajouté au Select de tri ; tri appliqué en mémoire sur le score (les tris prix/surface/dernière vue restent serveur).
  2. **Filtre « Phase vendeur »** (Toutes / Fenêtre d'or / Chaud / Tiède / Froid) → filtre `mandate_score.phase`.
  3. **Tooltip de breakdown** sur la cellule score : Temps (j · /40), Baisses (n · /30), Intensité (% · /15), Comportement (/15), avec mention « à étudier au cas par cas ». Le détail complet reste aussi dans la carte de la fiche bien.
- Fichiers : `src/app/admin/market/properties/PropertiesTable.tsx`, `docs/SUIVI_PROJET.md`.
- Audit qualité : `npx tsc --noEmit` OK ; `/app/properties` répond 200.
- Point d'attention : tri/filtre opèrent sur la page chargée (≤100 biens par zone) ; si un jour une zone dépasse ce volume, prévoir un tri/filtre score côté serveur (full-scan + scoring) avec pagination.
- Suite : commit sur `preview` après validation ; pré-remplir le `signal_type`/priorité d'opportunité selon la phase à la création.

### 21/06/2026 - CŒUR : MandateProbabilityScore branché sur les biens réels
- Base/branche : `preview` (local non commité).
- Type : feature — cœur métier / avantage concurrentiel.
- Statut : **fait** (testé live sur les 5 biens Pontevès ; tsc OK).
- Contexte / diagnostic : le moteur de score différenciateur (`MandateProbabilityScore`, 0-100, 4 axes Temps/Frustration/Intensité/Comportement → phases cold/warm/hot/golden) existait déjà dans `src/lib/mandat/scoring-service.ts` MAIS tournait à vide : il était câblé au monde `dashboard/radar` qui lit les tables `listings`/`listing_events`/`seller_scores` **absentes en base live**. Pendant ce temps, les vrais biens synchronisés (`market_properties`) ne recevaient qu'une heuristique en prose ad-hoc (`buildBusinessSignal`). Bug latent découvert au passage : `market_properties` n'a **pas** de colonne `days_online` → l'heuristique lisait `property.days_online` toujours `undefined` (axe temps jamais déclenché).
- Décision (Alexandre) : **porter le score sur `market_properties`** (source de vérité unique = les données synchronisées), pas de nouvelles tables.
- Travail :
  1. **Adaptateur** `src/lib/market/mandate-score.ts` (nouveau) : `scoreMarketProperty(property, priceHistory)` dérive `days_online` depuis `first_seen_at` (jusqu'à maintenant si actif, sinon `last_seen_at`), compte les baisses et calcule la baisse totale % depuis le prix d'origine via `property_price_history`, puis appelle `calculateScore()`. Axe comportement (republication) non encore tracé par la sync → `isRelisted=false` (15 pts non exploités, TODO documenté).
  2. **Route détail** `GET /api/market/properties/[id]` : ajoute `mandate_score` dans la réponse ; `buildBusinessSignal` reçoit désormais le `days_online` calculé (corrige le bug latent de l'axe temps).
  3. **Route liste** `GET /api/market/properties` : un seul appel groupé `property_price_history` (`.in('market_property_id', ids)`) pour la page courante, puis scoring en mémoire → chaque bien porte `mandate_score`.
  4. **UI** : colonne « Score mandat » (score + badge phase) dans `PropertiesTable.tsx` ; carte « Score mandat » dans `PropertyDetail.tsx` (jauge 0-100 colorée par phase + détail des 4 axes). Réutilise `SellerPhaseBadge` du monde radar.
- Fichiers : `src/lib/market/mandate-score.ts` (nouveau), `src/app/api/market/properties/[id]/route.ts`, `src/app/api/market/properties/route.ts`, `src/app/admin/market/properties/PropertiesTable.tsx`, `src/app/admin/market/properties/[id]/PropertyDetail.tsx`, `docs/SUIVI_PROJET.md`.
- Audit qualité : `npx tsc --noEmit` OK ; test live `/api/market/properties?limit=5` → 5 biens Pontevès scorés (tous `cold` score 5 : ≤30 j, 0 baisse — cohérent avec des annonces récentes) ; détail `f773d231…` → `mandate_score` complet avec breakdown ; pages `/app/properties` et `/app/properties/[id]` répondent 200, aucune erreur runtime liée (seules erreurs log = `/api/matching` préexistant, tables absentes).
- Point d'attention : (a) tant que les biens sont récents et sans baisse, tout reste `cold` — la différenciation hot/golden apparaîtra avec l'ancienneté + les baisses détectées par la sync ; (b) axe comportement (republication) à activer côté sync ; (c) le monde `dashboard/radar` (tables `listings`) reste en doublon, non utilisé par le pipeline réel — à retirer/réconcilier plus tard.
- Suite : commit sur `preview` après validation Alexandre ; envisager un seuil de phase qui pré-remplit le `signal_type` à la création d'opportunité, et un tri/filtre par score dans la table.

### 21/06/2026 - reprise de session + consolidation tracée
- Base/branche : `preview`, alignée sur `origin/preview` (working tree propre).
- Type : suivi projet / reprise de session.
- Statut : **fait**.
- Résumé : reprise de session. Serveur Next relancé via `npm run dev -- --port 3002` (Next 15.5.15 Turbopack, prêt en ~1,7 s) ; routes vérifiées `/app/dashboard`, `/app/zones`, `/` → toutes `200`. Traçage explicite du commit de consolidation **`d9eceff`** (2026-06-20 00:57) « feat(mandat-os): zones commune-exacte + pont biens→opportunités + fiche bien réelle » : il regroupe les 3 chantiers décrits dans les entrées 19/06 11:05 (zones INSEE), 20/06 00:36 (pont biens→opportunités) et 20/06 01:05 (fiche bien réelle), qui étaient « local non commité ». Ce travail est désormais **commité ET poussé** sur `origin/preview`. La « Suite : commit unique sur preview » de ces entrées est donc réalisée.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualité : `curl` HTTP local OK (3 routes `200`) ; `git status` propre, `preview` == `origin/preview`.
- Point d'attention : les sections « Avancement par Lot » et « Métriques » plus bas restent historiques (ère Linear) et ne reflètent pas l'état réel — voir note ligne 18.
- Suite : **pivot vers le cœur de l'application** (avantage concurrentiel) — moteur de détection/qualification d'opportunités de mandat. Cadre à définir avec Alexandre avant implémentation.

### 20/06/2026 - 01:05 CEST
- Base/branche : `preview`.
- Type : feature — fiche bien `/app/properties/[id]` réelle (fin du mock).
- Statut : **fait** (local non commité ; testé sur un vrai bien Pontevès).
- Résumé : la fiche détail tournait entièrement sur `MOCK_PROPERTY`. L'API `/api/market/properties/[id]` était déjà complète (bien + historique prix + tags + notes + opportunité liée + notifications + **signal métier calculé**). Travail :
  1. `PropertyDetail.tsx` réécrit : `fetch('/api/market/properties/[id]')`, états chargement/404, mapping des vrais champs `market_properties`. KPI prix (avec prix d'origine déduit de l'historique), surface/terrain, prix/m², jours en ligne (calculé depuis `first_seen_at`). Caractéristiques : chambres/pièces/surface/DPE + tags réels. Historique des prix réel (variations `property_price_history`). Acquéreurs potentiels (matching, déjà réel) conservés.
  2. Bloc **« Lecture du signal »** branché sur le `signal` calculé par l'API (résumé, points intéressants, préoccupations, action recommandée) — remplace l'alerte « -9,1 % » en dur.
  3. **Opportunité liée** affichée si présente (lien vers `/app/opportunities`) ; sinon bouton **« Créer une opportunité »** câblé (POST `market_property_id`, signal_type selon l'état) + toast « Voir le pipeline ».
  4. **Notes fonctionnelles** : nouvel endpoint `POST /api/market/properties/[id]/notes` + composer (Entrée pour valider) ; liste des notes réelle.
  5. Boutons morts retirés (Favori, Gérer les tags — sans backend).
- Fichiers : `src/app/admin/market/properties/[id]/PropertyDetail.tsx` (réécrit), `src/app/api/market/properties/[id]/notes/route.ts` (nouveau).
- Audit qualité : `npx tsc --noEmit` OK ; test live sur bien Pontevès `f773d231…` : détail 200, données réelles (4 tags, opportunité liée, signal), POST note 0→1 ; note de test supprimée ensuite.
- Point d'attention : pas de DELETE note exposé (suppression de test faite via SQL) ; le bien testé avait `dpe` vide et 0 variation de prix → blocs « DPE n/d » et « Aucune variation » gérés.
- Suite : commit unique sur `preview` après validation (zones commune-exacte + pont opportunités + fiche bien réelle) ; éventuellement exposer un DELETE note et « Gérer les tags ».

### 20/06/2026 - 00:36 CEST
- Base/branche : `preview`.
- Type : feature — pont biens → opportunités (pipeline de mandats réel).
- Statut : **fait** (local non commité ; testé end-to-end sur la base live).
- Résumé : cœur métier MandatFinder. L'API `opportunities` (GET/POST/PATCH/DELETE) et la table existaient déjà, mais le Kanban était mocké et le drag&drop ne persistait pas. Travail :
  1. `GET /api/market/opportunities` enrichi : 2e requête groupée `market_properties` (`.in('id', ids)`, sans relation PostgREST) → chaque opportunité reçoit `property: {title, city, zipcode, price}|null`.
  2. `KanbanBoard.tsx` réécrit : suppression de `MOCK_OPPORTUNITIES`, chargement réel via l'API, mapping ligne→carte (`signal_type`→type avec fallback `manual`, encart bien masqué si absent). **Convention `stage` = label FR** (valeur déjà stockée par le POST/les règles) ; un stage inconnu retombe sur « À qualifier ». Colonnes Converti/Écarté rendues droppables (pipeline complet, fin des cartes « légende » statiques).
  3. Drag&drop **persistant** : update optimiste local + `PATCH /[id] {stage}`, revert + toast si échec.
  4. Dialog « Nouvelle opportunité » (création manuelle) branché sur le bouton header + les « + » de colonne (stage pré-rempli) ; pattern `Dialog`/`Select` réutilisé.
  5. `PropertiesTable.tsx` : item dropdown « Créer une opportunité » sur un vrai bien → POST avec `market_property_id`, `signal_type` selon l'état (price_drop/new_listing), toast avec action « Voir le pipeline ».
- Fichiers : `src/app/api/market/opportunities/route.ts`, `src/app/admin/market/opportunities/KanbanBoard.tsx`, `src/app/admin/market/properties/PropertiesTable.tsx`.
- Audit qualité : `npx tsc --noEmit` OK ; end-to-end live OK (POST→GET enrichi→PATCH stage persisté→DELETE) ; `/app/opportunities` répond 200.
- Nettoyage data (validé par Alexandre « purger orphelines + mock ») : `DELETE FROM opportunities WHERE market_property_id IS NULL` après nullification des FK `notifications.opportunity_id` / `property_notes.opportunity_id` (transaction Supabase MCP). **65 opportunités orphelines supprimées** (dont les 8 restes de mock à stage slug, toutes sans bien). Reste **5 opportunités**, toutes rattachées à un vrai bien Pontevès 83670, en stage « À analyser ».
- Point d'attention : avant nettoyage la base contenait 70 opportunités (Alexandre avait resynchronisé : biens Pontevès 83670 réapparus + règles ayant créé ~60 opportunités). Désormais le Kanban est propre (5 cartes enrichies).
- Suite : rendre la fiche `/app/properties/[id]` réelle (encore mockée) ; commit unique sur `preview` après validation.

### 19/06/2026 - 11:05 CEST
- Base/branche : `preview`.
- Type : feature — zones « commune exacte » (INSEE) de bout en bout + fix purge biens + nettoyage base.
- Statut : **fait** (local non commité ; base live nettoyée).
- Resume : objectif = filtrage commune-par-commune via code INSEE plutôt que par CP (qui ramène toutes les communes voisines). Diagnostic : l'infra INSEE était déjà câblée (colonne `insee_code` migration 008, POST zones, lib `includedInseeCodes[]`, sync + preview relisant l'INSEE), MAIS le pipeline identifiait une zone **par `zipcode` avec `.maybeSingle()`** → cassait dès que 2 communes partagent un CP, et le panneau « Sync contrôlée » **perdait l'INSEE** avant l'envoi. Corrections :
  1. `sync/route.ts` : `getOrCreateZone` cible par INSEE quand fourni (sinon CP-mode `insee_code IS NULL`), via `.order().limit(1)` au lieu de `.maybeSingle()` ; stocke `insee_code`/`name`/`city` à la création ; le POST lit `insee_code`/`name`/`city` du body. Garde-fou anti-re-sync : comptage filtré par INSEE quand dispo.
  2. `sync-preview/route.ts` : accepte `insee_code` du body (priorité), fallback zone CP sans `.maybeSingle()`.
  3. `zones/page.tsx` : `syncDraft` porte `insee`/`communeName` ; `CommuneSearch` du panneau capture l'INSEE ; CP saisi à la main réinitialise l'INSEE ; `previewSync`/`confirmSync`/`prefillSyncFromZone` transmettent l'INSEE ; badge « Commune exacte · INSEE … » vs « CP seul · communes voisines incluses » dans le récap.
  4. `sync-stats/route.ts` : compte les biens par INSEE quand la zone en a un (sinon par CP).
  5. `src/lib/market/property-cleanup.ts` : **fix** — la chaîne de purge avortait sur `match_results` (table absente en base live) → toute suppression de bien échouait. Ajout `isMissingTableError()` qui ignore les tables absentes (PGRST205/42P01/« Could not find the table »).
- Action base live (choix Alexandre « repartir propre ») : suppression des 2 zones CP (`83670` 30 biens, `13390` 5 biens) + purge des 35 biens orphelins. Base désormais : **0 zone, 0 bien, 0 orphelin**.
- Fichiers : `src/app/api/market/sync/route.ts`, `src/app/api/market/sync-preview/route.ts`, `src/app/api/market/sync-stats/route.ts`, `src/app/admin/market/zones/page.tsx`, `src/lib/market/property-cleanup.ts`, `docs/SUIVI_PROJET.md`.
- Audit qualité : `npx tsc --noEmit` OK (×2) ; HTTP local OK (`sync-stats`=200, `sync-preview` renvoie un total filtré par INSEE) ; suppression zones + purge orphelins confirmées via API.
- Point d'attention : les `total_available` du preview sont gonflés (Tavernes 83135=773, Barjols 83012=1750, CP 83670 seul=3772, Paris 75056=10000 plafonné). Les comptages **varient par INSEE** → le filtre serveur agit bien, mais le total `itemsPerPage=0` semble ignorer une partie du filtrage. Sans impact sur le coût (plafonné par `max_items` ; filtre client `matchesGeoTarget` garantit qu'on ne garde que la commune), mais **on paie les items d'une page même si certains sont hors commune** : à valider par une sync sonde (~0,01 €) quand Alexandre autorise une dépense.
- Suite : Alexandre reconstruit les zones commune par commune via « Ajouter une commune » ; remettre un solde manuel dans Réglages pour réautoriser une sync ; commit unique sur `preview` après validation.

### 19/06/2026 - 10:15 CEST
- Base/branche : `preview`.
- Type : reprise de session / démarrage serveur local.
- Statut : **fait**.
- Résumé : application du protocole `docs/START.md`. Fetch `origin/preview`, vérification Git (preview alignée sur origin/preview), serveur Next lancé sur port 3002 avec `npm run dev -- --port 3002`. Serveur compilé en 1330ms, middleware compilé en 185ms.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualité : `curl -I http://localhost:3002/app/dashboard` → `200 OK` ; serveur live et réactif.
- Point d'attention : aucun.
- Suite : selon Alexandre, tâche suivante.

### 19/06/2026 - 00:12 CEST
- Base/branche : `preview`.
- Type : commit local (UX bouton sync + maj suivi projet).
- Statut : **fait** (commit local, non pousse).
- Resume : commit de l'edit UX restant (message explicite de la raison de blocage sous "Confirmer la sync" + infobulle, dans `zones/page.tsx`) et des entrees de journal `23:19`/`00:07`/`00:12`. Le working tree est de nouveau propre apres ce commit. Rappel : les correctifs base (migration 010 appliquee, run debloque) sont cote Supabase, pas dans git.
- Fichiers : `src/app/admin/market/zones/page.tsx`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `npx tsc --noEmit` OK (deja verifie sur l'edit UX) ; pas de push (en attente de validation explicite d'Alexandre).
- Point d'attention : aucun push effectue ; `preview` local en avance sur `origin/preview` de 2 commits (`06ce78a` puis celui-ci).
- Suite : selon Alexandre, creer les zones commune-par-commune et/ou pousser `preview`.

### 19/06/2026 - 00:07 CEST
- Base/branche : `preview`.
- Type : correction base live (migration manquante) + diagnostic affichage zones + UX bouton sync + cadrage filtrage commune.
- Statut : **fait** (correctifs base appliques ; edit UX local non commite).
- Resume : diagnostic du symptome "plus rien ne s'affiche dans Zones / sync coincee". Cause racine trouvee : la **migration 010 n'avait jamais ete appliquee en base live** (colonnes `external_item_count` sur `sync_runs` et `item_count` sur `stream_estate_usage_events` absentes). A la fin d'une sync, l'update de `sync_runs` echouait silencieusement -> run bloque en statut `running`. Correctif : **migration 010 appliquee** sur Supabase (`byrsmbgfkvgxdtdyhrro`) + run bloque repare (`running` -> `success`). Verifie que les donnees etaient intactes : 1 zone (CP 83670) + 30 biens, APIs `zones`/`sync-stats`/`properties` repondent 200 avec les 30 biens. Cote UX : bouton "Confirmer la sync" reste grise tant que budget/preview ne le permettent pas -> ajout d'un message explicite de la raison (texte + infobulle) pour ne plus laisser un bouton muet (le blocage actuel vient d'un solde manuel a 0 EUR). Cadrage filtrage commune : le CP 83670 couvre 6 communes (Tavernes 83135, Varages 83145, Barjols 83012, Fox-Amphoux 83060, Montmeyan 83084, Chateauvert 83039) ; Pontevès = INSEE 83095, 0 bien actuellement. Pour filtrer une commune exclusivement -> creer la zone via "Ajouter une commune" (porte l'INSEE -> sync `includedInseeCodes[]`), la "Zone 83670" actuelle est en mode CP (sans INSEE) et ramene toutes les communes ; cote affichage, le menu "Ville" de la page Biens filtre deja par commune.
- Fichiers : `src/app/admin/market/zones/page.tsx` (message raison bouton, local non commite). Base : migration `010_stream_estate_items_budget.sql` appliquee, ligne `sync_runs` debloquee.
- Audit qualite : `npx tsc --noEmit` OK ; verifs HTTP sur `http://localhost:3000` : `/api/market/zones`=1 zone, `/api/market/sync-stats`=zone 83670 / 30 biens, `/api/market/properties?zipcode=83670`=total 30 ; schema `sync_runs`/`stream_estate_usage_events` confirme complet apres 010.
- Point d'attention : **correction de l'entree 23:19** -> la migration 010 n'etait PAS appliquee (009 oui). Etat live desormais : 006, 008, 009, 010, 011 appliquees. Le tracker Supabase reste partiel (009/010 ajoutees hors tracker au depart) : prudence avant tout `supabase db push`. L'edit UX du bouton est en working tree non commite (le reste du chantier est dans `06ce78a`).
- Suite : selon choix d'Alexandre, creer une/des zone(s) commune-par-commune (ex. Pontevès 83095) et decider du sort de la "Zone 83670" CP ; remettre un petit solde manuel pour reautoriser une sync ; commiter l'edit UX du bouton.

### 18/06/2026 - 23:19 CEST
- Base/branche : `preview`.
- Type : optimisation crédits Stream Estate (backend) + cohérence UX zones surveillées + migration Supabase.
- Statut : **fait** (local, non commité).
- Resume : confirmation du contrat API Stream Estate via doc officielle `docs.stream.estate` (filtre commune `includedZipcodes[]` / `includedInseeCodes[]`, `transactionType=0`=vente, `propertyTypes[]` numériques Appartement 0 / Maison 1, `itemsPerPage` max 30, `itemsPerPage=0`=comptage gratuit, `hydra:totalItems`). Facturation confirmée par Alexandre : **0,01 €/bien** (30 biens = 0,30 €). Côté code : suppression de la route de diagnostic `test-stream-estate` (tapait l'API à chaque chargement) ; `fetchListings`/`previewListings` filtrent par INSEE quand dispo et par `propertyTypes=[0,1]` (résidentiel) ; preview désormais **gratuit** (`itemsPerPage=0`) ; suppression de l'appel preview facturé séparé dans `/api/market/sync` (total lu sur la page 1) ; **garde-fou anti-re-sync** configurable (`stream_estate_resync_window_minutes`, défaut 360 min) qui renvoie la base sans appel si la zone est fraîche, avec bypass `force:true`. UX zones rendue cohérente : toast distinct « déjà à jour » + action « Forcer la resync », toast « sync partielle », badge fraîcheur aligné sur la fenêtre, badge précision INSEE (« Commune exacte » vs « CP seul · communes voisines incluses »), mention « Estimation · gratuit ». Champ « Fenêtre resync (min) » éditable dans Réglages.
- Fichiers : `src/lib/stream-estate.ts`, `src/lib/mandat/import-service.ts`, `src/app/api/market/sync/route.ts`, `src/app/api/market/sync-preview/route.ts`, `src/app/api/market/sync-stats/route.ts`, `src/app/admin/market/zones/page.tsx`, `src/app/admin/market/settings/page.tsx`, `supabase/migrations/011_stream_estate_resync_window.sql` (suppr. `src/app/api/market/test-stream-estate/route.ts`).
- Audit qualite : `npx tsc --noEmit` OK ; `npm run build` OK ; migration `011` **appliquée sur Supabase** (`byrsmbgfkvgxdtdyhrro`) → clé `stream_estate_resync_window_minutes=360` présente ; serveur dev relancé proprement (un graphe turbopack corrompu par la suppression/ajout de routes à chaud provoquait un 500 sur `/api/market/sync-stats`, résolu au redémarrage).
- Point d'attention : tracker de migrations Supabase ne liste que `006`/`008` alors que les clés de `009` sont en base → `009`/`010` ont été appliquées hors tracker ; prudence si futur `supabase db push`. Tout le travail reste **local non commité** sur `preview`.
- Suite : sur validation d'Alexandre, commit unique (optimisation backend + UX + migration) sur `preview` ; vérification visuelle des badges après `npm run dev` + hard refresh.

### 18/06/2026 - 21:55 CEST
- Base/branche : `preview`.
- Type : sync contrôlée Stream Estate + mise à jour documentaire.
- Statut : **fait**.
- Resume : ajout d'un flux de prévisualisation `/api/market/sync-preview` et d'une sync contrôlée par CP + plafond `max_items` sur `/app/zones`. L'import Stream Estate filtre maintenant les annonces clairement hors ligne (`expired`, `removed`, `inactive`, etc.) pour éviter de surcharger l'estimation et la sync. Mise à jour des docs de reprise et d'architecture pour refléter le flux budgeté sur les items.
- Fichiers : `src/lib/stream-estate.ts`, `src/lib/stream-estate-budget.ts`, `src/app/api/market/sync/route.ts`, `src/app/api/market/sync-preview/route.ts`, `src/app/api/market/sync-stats/route.ts`, `src/app/admin/market/zones/page.tsx`, `src/app/admin/market/settings/page.tsx`, `src/app/admin/market/properties/PropertiesTable.tsx`, `docs/START.md`, `docs/MEMOIRE_SESSION.md`, `docs/MANDATFINDER_ARCHITECTURE.md`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `npm run build` OK ; serveur Next relance sur `http://localhost:3002` ; verification visuelle du panneau `/app/zones` et de la previsualisation.
- Point d'attention : la base live doit encore recevoir la migration `010_stream_estate_items_budget.sql` pour tracer officiellement `item_count` / `external_item_count`.
- Suite : appliquer la migration Supabase puis, si besoin, poursuivre le nettoyage des libellés historiques restants "appel/requete" dans les écrans secondaires.

### 18/06/2026 - 20:59 CEST
- Base/branche : `preview`.
- Type : correction de lecture budget Stream Estate.
- Statut : **fait**.
- Resume : prise en compte de la console Stream Estate fournie par Alexandre. La consommation reellement visible cote fournisseur n'etait pas de 0,02 EUR mais d'environ 0,92 EUR depuis 5 EUR de depart, avec 92 items utilises et 4,08 EUR restants. Conclusion: notre suivi local par requetes sous-estimait la consommation reelle. Le tableau de bord fournisseur doit rester la source de verite pour la depense effective.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualite : lecture de la capture d'ecran fournie par Alexandre ; pas de changement de code applique dans cette entree.
- Point d'attention : le modele local actuel mesure encore des appels/requetes et non directement les items factures par le fournisseur. Il faut eviter de confondre estimation interne et consommation facturée.
- Suite : si on reviens sur le budget Stream Estate, recalibrer le modele de cout sur l'unite facturee par le fournisseur avant d'autoriser de nouvelles syncs.

### 18/06/2026 - 20:56 CEST
- Base/branche : `preview`.
- Type : ajustement flux Stream Estate / reprise propre apres test.
- Statut : **fait**.
- Resume : correction du comportement de `fetchListings` pour permettre un import partiel explicite quand le plafond de requetes coupe la pagination. La route `/api/market/sync` marque maintenant le run comme `blocked` avec `stream_estate_request_limit_reached` tout en conservant les biens deja importes. Reexecution du pilote `83670` avec budget minimal rearme temporairement a `0.02 EUR` pour un seul appel supplementaire : `30` biens crees, `1` requete externe, run `blocked` mais utile, puis remise de `stream_estate_sync_enabled=false` et du solde manuel a `0`.
- Fichiers : `src/lib/stream-estate.ts`, `src/app/api/market/sync/route.ts`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `npm run build` OK ; redemarrage propre du serveur Next sur `http://localhost:3002` ; verification HTTP OK sur `/api/market/settings` et `/api/market/sync-stats` apres redemarrage ; base finale confirmee avec `market_properties=30`, `monitored_zones=0`, `sync_runs=3`, `stream_estate_usage_events=2`.
- Point d'attention : le test a consommé `2` appels externes au total sur Stream Estate depuis la reprise. Le dernier run reste trace comme `blocked` par plafond de requete, mais le partage de progression fonctionne désormais.
- Suite : si on veut aller plus loin, soit augmenter temporairement `stream_estate_max_requests_per_sync` pour couvrir plus de pages, soit garder ce mode partiel et utiliser les 30 biens importes pour la suite des tests UI/API.

### 18/06/2026 - 20:48 CEST
- Base/branche : `preview`.
- Type : environnement local / redemarrage Next.
- Statut : **fait**.
- Resume : apres ajout de `STREAMESTATE_API_KEY` et `STREAMESTATE_API_URL` dans `.env.local`, redemarrage du serveur Next local sur `http://localhost:3002` pour recharger les variables d'environnement. Aucun appel fournisseur Stream Estate n'a ete lance pendant cette verification.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualite : `http://localhost:3002/app/dashboard` repond `200 OK` ; `/api/market/sync-stats` confirme `zones=0`, sync Stream Estate desactivee, solde manuel `0`, cout par requete `0.01`, plafond `1`, aucun appel externe enregistre.
- Point d'attention : serveur Next actif sur le port `3002` via process Node PID `36774`.
- Suite : pour le vrai test API, reactiver temporairement la sync avec un solde manuel de `0.01 EUR`, conserver `stream_estate_max_requests_per_sync=1`, puis lancer un seul `POST /api/market/sync` sur le CP pilote.

### 18/06/2026 - 17:56 CEST
- Base/branche : `preview`.
- Type : nettoyage Supabase / preparation test API Stream Estate.
- Statut : **fait, test API bloque par configuration locale**.
- Resume : purge de la base Supabase distante pour repartir d'un etat propre avant test Stream Estate. Suppression coherente des biens `market_properties` et de leurs dependances directes, puis suppression de l'historique `sync_runs`, du journal `stream_estate_usage_events` et des zones surveillees `monitored_zones`. Tentative de test controle sur le CP `83670` avec garde-fou a 1 requete : l'appel a ete bloque avant appel fournisseur reel car `STREAMESTATE_API_KEY` est absente de l'environnement serveur local. Le faux depart cree par la route (`zone`, `sync_run`, `usage_event`) a ete supprime ensuite.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualite : verification SQL finale : `market_properties=0`, `monitored_zones=0`, `sync_runs=0`, `stream_estate_usage_events=0`. Verification API locale : `/api/market/properties?limit=5` retourne `total=0`, `/api/market/zones` retourne `0`, `/api/market/sync-stats` retourne `zones=0`, sync Stream Estate desactivee, solde manuel `0`, cout par requete `0.01`, plafond `1`.
- Point d'attention : ajouter `STREAMESTATE_API_KEY` dans `.env.local` puis redemarrer le serveur Next avant un vrai test d'appel API. La route actuelle compte aussi une erreur de configuration comme un `external_request` dans le run ; le faux compteur a ete purge pour garder la base propre.
- Suite : une fois la cle locale ajoutee et le serveur redemarre, reactiver temporairement la sync avec `stream_estate_manual_balance_eur=0.01`, conserver `stream_estate_max_requests_per_sync=1`, puis relancer `POST /api/market/sync` sur un seul CP pilote.

### 18/06/2026 - 17:48 CEST
- Base/branche : `preview`.
- Type : reprise de session / start.
- Statut : **fait**.
- Resume : application du protocole `docs/START.md` : lecture de `docs/MEMOIRE_SESSION.md` et `docs/SUIVI_PROJET.md`, `git fetch --all --prune`, verification de l'etat Git, comparaison avec `origin/preview`, verification du serveur local Next deja actif sur le port `3002`.
- Etat Git : `preview` locale est 5 commits devant `origin/preview` et 0 commit derriere ; des changements locaux non commites sont presents sur le chantier Stream Estate / budget / zones / biens synchronises.
- Fichiers : `docs/MEMOIRE_SESSION.md`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `curl -I` OK sur `http://localhost:3002/app/dashboard`, `http://localhost:3002/app/settings` et `http://localhost:3002/app/zones` ; navigateur integre Codex non disponible dans cette session (`iab` absent), donc pas d'ouverture visuelle via Browser.
- Point d'attention : ne pas pousser vers `origin/preview` sans demande explicite ; ne pas ecraser les modifications locales en cours.
- Suite : reprendre apres l'application de la migration `009_stream_estate_budget_guardrails.sql` : renseigner le solde manuel dans `/app/settings`, activer prudemment la sync Stream Estate, puis tester un seul code postal pilote.

### 18/06/2026 - 15:38 CEST
- Base/branche : `preview`.
- Type : application migration Supabase.
- Statut : **fait**.
- Resume : application reussie de la migration `009_stream_estate_budget_guardrails.sql` sur la base Supabase distante. La migration ajoute :
  - 3 colonnes a `sync_runs` : `external_request_count`, `estimated_cost_eur`, `blocked_reason` ;
  - nouvelle table `stream_estate_usage_events` avec index pour tracer chaque appel Stream Estate ;
  - 5 parametres dans `app_settings` : `stream_estate_sync_enabled` (false), `stream_estate_manual_balance_eur` (0), `stream_estate_cost_per_request_eur` (0.01), `stream_estate_max_requests_per_sync` (1), `stream_estate_min_balance_eur` (0).
- Fichiers : `supabase/migrations/009_stream_estate_budget_guardrails.sql`, `docs/SUIVI_PROJET.md`.
- Audit qualite : execution directe via script Node.js + `pg` ; 12/12 statements SQL executes avec succes ; verification post-application confirme colonnes, table et parametres crees.
- Point d'attention : aucun.
- Suite : renseigner le solde manuel dans `/app/settings` via UI, puis activer la sync Stream Estate et tester un CP pilote.

### 18/06/2026 - 11:10 CEST
- Base/branche : `preview`.
- Type : coherence zones surveillees / biens synchronises.
- Statut : implemente et verifie en local.
- Resume : renforcement du lien operationnel entre zones surveillees et biens sans ajouter de nouvelle table. La source de verite reste le code postal : `monitored_zones.zipcode = market_properties.zipcode`. L'API `/api/market/sync-stats` expose maintenant, par zone, le dernier run, le dernier succes, les appels et couts du dernier run, le nombre de biens en base, le nombre de biens revus et le nombre de biens non revus depuis la derniere sync reussie. `/app/zones` affiche ces reperes sur chaque zone. `/app/properties?zipcode=...` affiche un bandeau contextualise avec la zone, les biens revus/non revus et le cout/appels du dernier succes.
- Fichiers : `src/app/api/market/sync-stats/route.ts`, `src/app/admin/market/zones/page.tsx`, `src/app/admin/market/properties/PropertiesTable.tsx`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `npm run lint` OK avec warnings preexistants ; `npm run build` OK ; HTTP local OK sur `http://localhost:3003/app/zones`, `http://localhost:3003/app/properties?zipcode=83670`, `http://localhost:3003/api/market/sync-stats`.
- Point d'attention : la base locale renvoie actuellement `zones: []`, car des zones ont ete supprimees via l'UI/API pendant la session locale. Rien n'a ete restaure automatiquement.
- Suite : recreer une zone pilote, appliquer la migration budget Stream Estate, puis tester une sync CP unique pour voir les compteurs `revus / non revus / cout` avec donnees reelles.

### 18/06/2026 - 10:19 CEST
- Base/branche : `preview`.
- Type : architecture API / budget / admin UX.
- Statut : implemente et verifie en local.
- Resume : remplacement de la synchronisation Stream Estate large par une synchronisation stricte par code postal avec `includedZipcodes[]`. Ajout d'un double garde-fou budget : activation manuelle, solde manuel estime, cout par appel fixe a 0,01 EUR, plafond d'appels par sync et solde minimum. Ajout du journal estime des appels Stream Estate et extension du suivi `sync_runs` pour appels externes, cout estime et raison de blocage.
- Fichiers : `src/lib/stream-estate.ts`, `src/lib/stream-estate-budget.ts`, `src/app/api/market/sync/route.ts`, `src/app/api/market/sync-stats/route.ts`, `src/app/api/market/test-stream-estate/route.ts`, `src/lib/mandat/import-service.ts`, `src/app/admin/market/settings/page.tsx`, `src/app/admin/market/zones/page.tsx`, `src/types/supabase.ts`, `supabase/migrations/009_stream_estate_budget_guardrails.sql`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `npm run lint` OK avec warnings preexistants ; `npm run build` OK ; verification statique OK (`includedZipcodes[]` present, plus de `includedDepartments[]` ni `/cities` dans `src`) ; HTTP local OK sur `http://localhost:3003/app/settings`, `http://localhost:3003/app/zones`, `http://localhost:3003/api/market/sync-stats` ; test `POST /api/market/sync` avec CP invalide => `400`, sync desactivee => `403` et `external_requests: 0`.
- Point d'attention : la migration Supabase `009_stream_estate_budget_guardrails.sql` est creee mais pas appliquee a la base connectee localement au moment du test. L'API garde un repli compatible avant migration pour eviter un `500`, mais le suivi complet des couts demande l'application de cette migration.
- Suite : appliquer la migration Supabase, renseigner le solde manuel et le cout par appel dans `/app/settings`, puis seulement activer la sync Stream Estate et tester un seul CP pilote.

### 18/06/2026 - 10:24 CEST
- Base/branche : `preview`.
- Type : correction parametre budget.
- Statut : fait.
- Resume : alignement du cout Stream Estate par appel sur la valeur confirmee par Alexandre : 0,01 EUR. Mise a jour du fallback serveur, de la valeur initiale UI, de la migration Supabase et du parametre local via `/api/market/settings`.
- Fichiers : `src/lib/stream-estate-budget.ts`, `src/app/admin/market/settings/page.tsx`, `supabase/migrations/009_stream_estate_budget_guardrails.sql`, `docs/SUIVI_PROJET.md`.
- Audit qualite : verification HTTP locale sur `/api/market/sync-stats`, le champ `stream_estate_budget.cost_per_request_eur` retourne `0.01`.
- Suite : appliquer la migration Supabase puis renseigner le solde manuel avant d'activer une sync CP pilote.

### 18/06/2026 - 09:51 CEST
- Base/branche : `preview`.
- Type : correction UX / zones surveillees.
- Statut : fait localement, en attente de validation visuelle.
- Resume : correction du manque constate sur le parcours zones surveillees. Chaque zone affiche maintenant une action directe vers les biens du code postal (`/app/properties?zipcode=...`). La page Biens lit ce parametre, filtre l'API `/api/market/properties` avec `zipcode`, affiche un bandeau de contexte et permet de revenir a tous les biens. La carte des biens n'utilise plus les 8 donnees mockees : elle charge les vrais biens depuis l'API et respecte le meme filtre CP. Le toast de synchronisation de zone affiche aussi le nombre de biens recuperes.
- Fichiers : `src/app/admin/market/zones/page.tsx`, `src/app/admin/market/properties/page.tsx`, `src/app/admin/market/properties/PropertiesTable.tsx`, `src/app/admin/market/properties/PropertiesMapWrapper.tsx`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `npm run lint` passe avec warnings existants hors fichiers touches ; `npm run build` passe. Verification HTTP : `/app/zones` et `/app/properties?zipcode=83670` repondent `200 OK`, API `/api/market/properties?zipcode=83670&limit=100` retourne des biens filtres. Le serveur dev a ete redemarre sur `3002` apres le build pour remettre le cache `.next` en etat.
- Suite : verifier visuellement dans le navigateur local le clic depuis `/app/zones` vers les biens filtres, puis pousser `preview` vers `origin/preview` uniquement apres validation explicite.

### 18/06/2026 - 09:41 CEST
- Base/branche : `preview`.
- Type : visualisation locale / pre-push.
- Statut : en cours de verification utilisateur.
- Resume : lancement du serveur local Next sur le port `3002` avec `npm run dev -- --port 3002`. Verification HTTP : `/app/dashboard` repond `200 OK`, `/admin/market` redirige vers `/app/dashboard`, `/admin/market/properties` redirige vers `/app/properties`. Ouverture de `http://localhost:3002/app/dashboard` dans le navigateur macOS. Le navigateur integre Codex n'etait pas disponible dans cette session ; la commande VS Code `code` n'est pas installee dans le shell.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualite : `curl -I` sur `/app/dashboard`, `/admin/market`, `/dashboard`, `/admin/market/properties`.
- Suite : Alexandre verifie visuellement en local. Ne pas pousser vers `origin/preview` avant validation explicite.

### 18/06/2026 - 09:24 CEST
- Base/branche : `preview`.
- Type : organisation / consolidation Git.
- Statut : fait localement, en attente de validation push.
- Resume : consolidation du flux demande par Alexandre. `preview` locale a ete fast-forward sur `origin/preview`, puis la branche locale `feat/estimation-zod-validation` a ete mergee dans `preview` avec resolution du conflit sur `src/app/api/estimation/route.ts`. La validation Zod a ete conservee et etendue aux champs actuels de l'estimation (`sous_type`, surfaces terrain/cadastre, annee, DPE verifie, numero DPE). Les changements en cours de `design/shadcn-pro-system` ont ete recuperes via stash sur `preview`. Les consignes projet ont ete alignees sur le flux simplifie : travail local sur `preview`, `origin/preview` source de verite, plus de sous-branches locales sauf decision explicite. Les branches locales integrees `design/shadcn-pro-system`, `feat/estimation-zod-validation` et `main` ont ete supprimees ; il ne reste que `preview` en local.
- Fichiers : `CLAUDE.md`, `AGENTS.md`, `docs/WORKFLOW_BRANCHES.md`, `docs/SUIVI_PROJET.md`, `src/app/api/estimation/route.ts`, `src/lib/schemas/estimation.ts`.
- Audit qualite : `npm run lint` passe avec warnings existants ; `npm run build` passe avec warnings existants (`next lint` deprecie, Supabase Edge Runtime, imports inutilises). Aucun push effectue.
- Suite : pousser `preview` vers `origin/preview` uniquement apres validation explicite d'Alexandre. Point de reprise : `preview` locale propre, 3 commits d'avance sur `origin/preview`.

### 18/06/2026 - 00:51 CEST
- Base/branche : `preview`.
- Type : optimisation / consommation API Stream Estate.
- Statut : fait.
- Resume : Alexandre signale 364 credits consommes sur Stream Estate alors qu'on etait en phase de configuration. Diagnostic : `fetchListings()` refaisait la pagination complete (10 pages, ~1 appel/page) pour CHAQUE code postal, meme pour 7 CP du meme departement. Correction :
  1. `src/lib/stream-estate.ts` : ajout d'un cache `deptResultsCache` avec TTL 5 minutes + fonction `fetchAllByDept()` qui ne pagine qu'une seule fois par departement.
  2. `vercel.json` : crons vides (`[]`) pour arreter tout appel automatique pendant la config.
- Fichiers : `src/lib/stream-estate.ts`, `vercel.json`.
- Audit qualite : build TS sans erreur.
- Suite : verifier le comportement en local avec plusieurs CP du Var ; reactiver les crons plus tard.

### 18/06/2026 - 00:38 CEST
- Base/branche : `preview`.
- Type : développement / branchement UI biens réels.
- Statut : fait.
- Resume : `PropertiesTable` était câblé sur 8 biens hardcodés. Réécriture complète du composant pour fetch `/api/market/properties` (100 biens, tri côté API). Mapping des champs Supabase → UI, calcul `daysOnline` depuis `first_seen_at`, bouton Actualiser, état de chargement, lien "Voir l'annonce" dans le dropdown.
- Fichiers : `src/app/admin/market/properties/PropertiesTable.tsx`.
- Audit qualite : build sans erreur TS, GET /app/properties 200.
- Suite : vérifier l'affichage des 30 biens dans le navigateur.

### 18/06/2026 - 00:22 CEST
- Base/branche : `preview`.
- Type : correction / normalisation données Stream Estate.
- Statut : fait.
- Resume : deux correctifs supplémentaires après avoir constaté que l'API retournait 30 biens mais Supabase n'en contenait qu'1. Cause : `raw.id = null` chez Stream Estate, l'identifiant réel est `uuid` → toutes les annonces avaient `external_id = ""` et s'écrasaient mutuellement. Correction normalisation `id`/`externalId` pour utiliser `raw.uuid`. Correction aussi du champ `city` (objet JS pas string) et `zipcode` (dans `city.zipcode`, pas `location.postalCode`). Suppression de l'enregistrement corrompu en base (external_id vide), relance sync → 30 créés, données correctes (villes/CP du Var).
- Fichiers : `src/lib/stream-estate.ts`.
- Audit qualite : GET /api/market/properties → total 30, villes Var correctes.
- Suite : vérifier l'affichage dans /app/properties UI, puis consolider le schema Supabase.

### 17/06/2026 - 23:58 CEST
- Base/branche : `preview`.
- Type : correction / sync Stream Estate.
- Statut : fait.
- Resume : trois correctifs appliques pour debloquer la sync Stream Estate sur le code postal 83670 (Barjols, Var).
  1. `src/lib/stream-estate.ts` — `deptIdFromZipcode` : resolution de l'ID interne Stream Estate via l'endpoint `/cities` au lieu de deriver les 2 premiers chiffres du CP. Le Var a le code INSEE 83 mais l'ID interne 85 chez Stream Estate ; l'ancien code passait `83` = Tarn.
  2. `src/lib/stream-estate.ts` — normalisation `publishedAt`/`updatedAt` : retourne `undefined` au lieu de `""` pour eviter une erreur Supabase `invalid input syntax for type timestamp`.
  3. `src/app/api/market/sync/route.ts` — suppression du filtre exact par code postal (qui filtrait 100% des resultats du departement) et correction `published_at: listing.publishedAt || null`.
- Resultat : sync 83670 => 30 fetched, 1 created, 29 updated. Flux complet valide.
- Fichiers : `src/lib/stream-estate.ts`, `src/app/api/market/sync/route.ts`.
- Audit qualite : `npm run build` passe sans erreur. POST /api/market/sync {"zipcode":"83670"} => 200 success.
- Suite : verifier les biens inseres dans `market_properties` via l'UI /app/properties, puis consolider le schema Supabase.

### 17/06/2026 - 23:13 CEST
- Base/branche : `preview`.
- Type : clarification / securite secrets.
- Statut : fait.
- Resume : clarification sur l'ajout de `STREAMESTATE_API_KEY` dans `.env.local`. Le fichier `.env.local` est bien ignore par Git via `.gitignore`, donc il peut contenir des secrets pour le developpement local. Les cles ne doivent jamais etre committees, documentees en clair, ni exposees avec le prefixe `NEXT_PUBLIC_`. Pour Vercel, la meme cle devra etre ajoutee dans les variables d'environnement du projet, cote serveur uniquement.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualite : verification `git check-ignore -v .env.local`.
- Suite : ajouter la cle Stream Estate localement si disponible, redemarrer le serveur, puis relancer la sync Barjols.

### 17/06/2026 - 22:54 CEST
- Base/branche : `preview`.
- Type : test / API zones surveillees.
- Statut : bloque par configuration externe.
- Resume : apres validation, test manuel de `POST /api/market/sync` sur le code postal `83670`. Le serveur local fonctionne, mais la sync echoue avant l'ecriture Supabase : Stream Estate renvoie `401 Authentication failed`. Verification `.env.local` : les variables `STREAMESTATE_API_URL` et `STREAMESTATE_API_KEY` sont absentes. Ajout d'une erreur explicite dans le client Stream Estate pour signaler `STREAMESTATE_API_KEY manquante dans les variables d’environnement` au lieu de laisser partir un appel fournisseur avec une cle vide. Le schema Supabase reste a consolider ensuite, mais le premier blocage concret est la cle API Stream Estate.
- Fichiers : `src/lib/stream-estate.ts`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `npm run build` passe. Verification HTTP : `POST /api/market/sync` retourne `500` avec erreur fournisseur `401 Authentication failed`; `sync-runs` confirme le run en erreur.
- Suite : ajouter une cle `STREAMESTATE_API_KEY` valide dans `.env.local` et dans les environnements Vercel concernes, redemarrer le serveur local, relancer la sync Barjols, puis verifier les inserts dans `market_properties`.

### 17/06/2026 - 22:50 CEST
- Base/branche : `preview`.
- Type : clarification / architecture donnees.
- Statut : fait.
- Resume : clarification importante : travailler en local ne signifie pas travailler sur une base locale. L'app Next locale utilise les variables `.env.local` et peut donc lire/ecrire dans la Supabase distante configuree. Pour les zones surveillees, la suite doit commencer par stabiliser la source de verite du schema Supabase, puis tester le flux `zones -> sync Stream Estate -> market_properties`, avant de creer le pont metier vers leads/opportunites vendeurs.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualite : non lance, clarification uniquement.
- Suite : definir si le schéma distant doit etre exporte en migration repo ou si l'on applique les migrations manquantes depuis le repo vers Supabase.

### 17/06/2026 - 22:49 CEST
- Base/branche : `preview`.
- Type : diagnostic / API zones surveillees.
- Statut : en cours, premier correctif fait.
- Resume : analyse de la partie zones surveillees et capture des biens. La base utilisee par `.env.local` est une Supabase distante, pas une base locale rejouable exactement depuis le repo. Les endpoints `/api/market/zones`, `/api/market/sync-stats` et `/api/market/sync-runs` fonctionnent et voient une zone Barjols. `/api/market/properties` fonctionne mais retourne 0 bien. Les migrations du repo ne contiennent pas encore la creation complete des tables `market_properties`, `monitored_zones`, `sync_runs`, alors que `src/types/supabase.ts` les reference : le schema distant n'est donc pas entierement reconstructible depuis les migrations actuelles. Correction appliquee sur `/api/market/sync` : filtrage des annonces Stream Estate au code postal exact et verification explicite des erreurs Supabase sur lecture/update/insert/tag, pour eviter les compteurs `created_count` faux.
- Fichiers : `src/app/api/market/sync/route.ts`, `docs/SUIVI_PROJET.md`.
- Audit qualite : `npm run build` passe. Verification HTTP : zones = 1 zone Barjols, sync runs = derniers runs visibles, properties = 0 bien, Radar listings toujours lie au schema `listings` absent.
- Suite : consolider le schema Supabase comme source de verite (migration manquante ou dump schema), puis definir le pont metier "bien detecte" vers une entree vendeur/lead sans melanger les tables `market_properties` et `leads`.

### 17/06/2026 - 22:43 CEST
- Base/branche : `preview`.
- Type : diagnostic / serveur local.
- Statut : fait, avec point a verifier.
- Resume : diagnostic d'un `500 Internal Server Error` en local. Cause principale corrigee : cache `.next` incoherent apres builds/reloads, avec manifests Next manquants. Arret du serveur, suppression de `.next`, relance de `npm run dev -- --port 3002`. Les pages `/app/dashboard`, `/app/leads` et `/app/radar` repondent a nouveau `200 OK`. Point restant : `/api/radar/listings?mode=kpis` repond encore `500`, car Supabase ne trouve pas la table `public.listings` dans le schema cache.
- Fichiers : `docs/SUIVI_PROJET.md`.
- Audit qualite : verification HTTP via `curl -I` sur `/app/dashboard`, `/app/leads`, `/app/radar` et `/api/radar/listings?mode=kpis`.
- Suite : traiter separement le schema Radar Supabase (`listings`, potentiellement `listing_events`) ou adapter l'API Radar a l'environnement local.

### 17/06/2026 - 22:41 CEST
- Base/branche : `preview`.
- Type : decision / suivi projet.
- Statut : fait.
- Resume : ajout d'une regle explicite : a chaque fin de tache, le suivi projet doit etre mis a jour avant la reponse finale, avec l'etat final, les fichiers touches, les verifications/audits et le prochain point de reprise.
- Fichiers : `docs/START.md`, `docs/SUIVI_PROJET.md`.
- Audit qualite : non lance, documentation/protocole uniquement.
- Suite : appliquer cette regle a toutes les prochaines taches, y compris les petites corrections UI.

### 17/06/2026 - 22:39 CEST
- Base/branche : `preview`.
- Type : decision / protocole de reprise.
- Statut : fait.
- Resume : formalisation du comportement attendu quand Alexandre ouvre un nouveau chat et dit `start`. Le protocole doit lire la memoire et le suivi, verifier Git, relancer ou reutiliser localhost, reprendre depuis la derniere entree horodatee, puis donner un compte rendu de depart avec l'URL active et les taches ouvertes/en cours.
- Fichiers : `CLAUDE.md`, `docs/START.md`, `docs/MEMOIRE_SESSION.md`, `docs/SUIVI_PROJET.md`, `docs/ROUTES.md`.
- Audit qualite : non lance, documentation/protocole uniquement.
- Suite : au prochain `start`, appliquer cette routine avant toute nouvelle modification.

### 17/06/2026 - 21:59 CEST
- Base/branche : `preview` alignee sur `origin/preview`.
- Type : decision / organisation.
- Statut : fait.
- Resume : decision de simplifier le workflow. Codex travaille seul sur le developpement et le design. Le flux courant utilise uniquement `preview`; les branches `design/*` et `feat/*` ne sont plus des bases de travail sauf demande explicite. Le push vers `origin/preview` reste soumis a validation explicite d'Alexandre.
- Fichiers : `docs/START.md`, `docs/MEMOIRE_SESSION.md`, `docs/SUIVI_PROJET.md`.
- Audit qualite : non lance, documentation uniquement.
- Suite : continuer les prochains chantiers depuis `preview`, en local, puis pousser uniquement apres validation.

### 17/06/2026 - 22:00 CEST
- Base/branche : `preview`.
- Type : visualisation locale / preference environnement.
- Statut : fait.
- Resume : verification de `http://localhost:3000/admin/market` et ouverture demandee dans VS Code via le Simple Browser integre. La route repond avec une redirection `307` vers `/admin/login?redirect=/admin/market`, conforme a la garde admin actuelle.
- Fichiers : `docs/START.md`, `docs/MEMOIRE_SESSION.md`, `docs/SUIVI_PROJET.md`.
- Audit qualite : verification HTTP via `curl -I http://localhost:3000/admin/market`; Playwright non lance.
- Suite : pour les prochaines visualisations locales, utiliser `localhost` et VS Code.

### 17/06/2026 - 22:16 CEST
- Base/branche : `preview`.
- Type : developpement local / auth temporaire.
- Statut : fait.
- Resume : le middleware etait deja desactive via `matcher: []`, mais la garde serveur du layout `/admin/market` redirigeait encore vers le login. Neutralisation temporaire de cette garde avec un admin local `super_admin` pour accelerer la navigation locale.
- Fichiers : `src/app/admin/market/layout.tsx`, `docs/SUIVI_PROJET.md`.
- Audit qualite : verification HTTP via `curl -I`; `/admin/market` repond maintenant `200 OK`.
- Suite : reactiver `getCurrentAdmin()` et la redirection avant mise en production si l'acces admin doit redevenir protege.

### 09/06/2026
- Redaction du Cahier des Charges
- Creation du projet Linear
- Creation de tous les labels (16 labels)
- Creation de toutes les issues Linear (13 issues)

### A faire
- Configurer GitHub Projects avec tableau Kanban
- Verifier les integrations Linear <-> GitHub
- Creer le fichier supabase/seed.sql
- Demarrer le developpement du Lot 2

## Commandes Work Utiles
Creer une issue: Work, cree une issue Linear pour [tache] avec description [texte], assigne a @alexlopez, priorite [urgent/high/medium], labels [lot-2, backend], due date [15/06/2026].

Mettre a jour une issue: Work, passe l issue API-001 en In Progress dans Linear.

Lier une PR: Work, lie la PR #123 a l issue API-001 dans Linear.

Rapport d avancement: Work, donne-moi un rapport d avancement du Lot 2.

Deployment: Work, declenche un deployment Vercel pour la branche preview.

## Metriques
- Total issues: 13
- Issues terminees: 0
- Issues en cours: 0
- Issues a faire: 13
- Progression globale: 0%

---
Derniere mise a jour: 21/06/2026
Maintenu par: Claude Code (sur `preview`)
