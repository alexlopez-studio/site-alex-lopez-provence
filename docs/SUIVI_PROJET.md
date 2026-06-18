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

## Prochaines Etapes
1. Continuer l'unification UX de Mandat OS depuis les routes canoniques `/app/*`.
2. Auditer la sidebar et les routes principales `/app/*` avec Playwright quand l'environnement de test est pret.
3. Corriger ou documenter l'etat des tables Radar Supabase (`listings`, `listing_events`) selon l'environnement cible.
4. Reactiver/verifier la garde auth admin avant toute mise en production.

## Taches Ouvertes Courantes

- En cours : design logiciel Mandat OS, navigation et ergonomie backoffice.
- A verifier : audit Playwright cible sur la navigation sidebar et les routes `/app/dashboard`, `/app/leads`, `/app/radar`, `/app/properties`, `/app/acheteurs`.
- A verifier : erreurs locales Radar sur `/api/radar/listings` si les tables Supabase `listings` / `listing_events` ne sont pas presentes.
- A faire avant production : reactiver/verifier la garde auth admin actuellement facilitee pour la navigation locale.
- A maintenir : tenir `docs/START.md`, `docs/MEMOIRE_SESSION.md`, `docs/SUIVI_PROJET.md` et `docs/ROUTES.md` alignes avec les routes canoniques `/app/*`.

## Journal de Bord

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
Derniere mise a jour: 09/06/2026
Maintenu par: Work (IA) avec Mistral
