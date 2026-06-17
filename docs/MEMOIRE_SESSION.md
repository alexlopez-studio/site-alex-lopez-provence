# Memoire de reprise - Mandat OS / MandatFinder

Derniere mise a jour : 17/06/2026

## Regle de reprise prioritaire

Toujours repartir de la derniere branche distante `origin/preview`.

Commande courte de reprise : si Alexandre dit simplement `start`, appliquer le protocole de `docs/START.md`.

Avant toute analyse ou modification :

1. Executer `git fetch --all --prune`.
2. Comparer la branche locale avec `origin/preview`.
3. Si la branche locale est en retard ou sale, ne pas raisonner depuis l'etat local comme source de verite.
4. Ne pas ecraser les changements locaux non commites sans accord explicite.

La branche locale `preview` peut etre en retard. Au 17/06/2026, elle etait encore a `12af742` alors que `origin/preview` etait a `a2c1358`.

## Source de verite actuelle

- Branche de reference : `origin/preview`
- Commit de reference au 17/06/2026 : `a2c1358`
- Projet : `alexlopez-studio/site-alex-lopez-provence`
- Backoffice principal : `/admin/market`
- Ancienne entree `/dashboard/radar` : radar MandatFinder plus technique, a ne pas confondre avec le shell principal.
- Ancien suivi Linear : historique utile, mais ne reflete plus l'avancement reel du code.

## Ce qui est deja realise

Les lots historiques 1 a 4 ne sont plus a traiter comme non demarres. Ils ont ete realises puis prolonges.

- Infrastructure Stream Estate / Supabase.
- API backend Mandat OS : biens, sync, regles, notifications, opportunites, zones.
- UI backoffice : dashboard, marche, detail bien, opportunites, regles, notifications.
- Moteur de regles : assistant, execution manuelle, regles preconfigurees.
- Pipeline vendeurs / prospects : `/admin/market/leads`.
- Acquereurs : `/admin/market/acheteurs`.
- Matching : `/admin/market/matching`.
- Zones surveillees : `/admin/market/zones`.
- Centre de controle : `/admin/market/settings`.
- Auth Supabase admin avec roles `super_admin` / `admin`.
- Gestion utilisateurs : `/admin/market/utilisateurs`.
- Liste chaude bouche-a-oreille : `/admin/market/liste-chaude`.
- MandatFinder DDD : `src/lib/mandat/*`, migration core, radar, cron analyse.
- Pipeline MandatFinder avec toggle et cron Vercel.
- Alerting email "fenetre d'or" via Resend apres analyse.
- Corrections recentes Stream Estate : endpoint `stream.estate`, `/documents/properties`, `hydra:member`.

## Branches et organisation du travail

Le travail recent a ete organise en deux pistes paralleles :

- Piste fonctionnalites : fonctionnalites backoffice / data / auth / sync / alerting.
- Piste design : amelioration de l'interface logiciel et experience produit.

Au 17/06/2026, la piste fonctionnalites identifiable cote remote est :

- `origin/claude/wizardly-fermi-wa97uj`

Cette branche est deja integree dans `origin/preview`.

La branche design n'apparait pas sous un nom distant evident dans les refs actuellement visibles. Si une prochaine session doit reprendre le design, commencer par :

1. `git fetch --all --prune`
2. inspecter les branches distantes recentes,
3. chercher une branche design/UX/UI eventuellement supprimee ou renomme,
4. sinon creer une nouvelle branche design depuis `origin/preview`.

Ne jamais reprendre le design depuis les anciennes branches du site public (`site-homepage-design-system`, `photo-audit`, etc.) sauf demande explicite : elles concernent surtout le site vitrine, pas le logiciel.

## Coordination avec Claude Code

Alexandre travaille aussi en parallele avec Claude Code. Pour eviter tout cafouillage :

- Ne jamais faire de `git reset --hard`, rebase destructif ou checkout qui ecrase des fichiers sans accord explicite.
- Toujours verifier `git status --short --branch` avant de modifier.
- Toujours verifier si `origin/preview` a avance avec `git fetch --all --prune`.
- Travailler sur une branche dediee par piste, par exemple :
  - design logiciel : `design/mandat-os-ui`
  - fonctionnalite : `feat/<nom-court>`
- Ne pas melanger design et fonctionnalites dans la meme branche sauf demande explicite.
- Si Claude Code a pousse du nouveau travail sur `preview` ou une branche parallele, le prendre en compte avant de continuer.
- La doc du repo remplace Linear pour le suivi courant ; Linear reste seulement un historique.

## Journal d'avancement obligatoire

A chaque nouvelle action de conception, developpement, correction, audit ou decision structurante :

- mettre a jour `docs/SUIVI_PROJET.md`,
- ajouter une entree horodatee dans la section "Journal d'avancement",
- utiliser l'heure locale Europe/Paris,
- mentionner la branche ou base de travail,
- resumer ce qui a ete fait,
- noter les fichiers principaux touches,
- noter l'etat final : fait, en cours, bloque ou a verifier.

Ne pas attendre la fin d'une grosse session pour tracer les changements importants.

## Auditeur qualite Playwright

Le projet doit integrer un reflexe d'audit qualite via Playwright CLI.

Principe :

- apres chaque changement fonctionnel ou design significatif, executer un audit Playwright adapte au changement,
- utiliser `pnpm test:e2e` pour la suite e2e quand le serveur local ou `BASE_URL` est disponible,
- pour un audit cible, lancer Playwright sur le ou les tests concernes,
- conserver les traces/screenshot en cas d'echec,
- noter le resultat dans le journal d'avancement de `docs/SUIVI_PROJET.md`.

Pour le chantier design logiciel, l'auditeur doit couvrir progressivement :

- chargement des pages `/admin/market/*` principales,
- navigation sidebar,
- absence d'erreurs console critiques,
- lisibilite desktop et mobile/tablette quand pertinent,
- absence de debordement horizontal,
- verification des workflows critiques : login, dashboard, zones, settings, liste chaude, matching.

Si l'auth Supabase bloque l'e2e local, documenter le blocage et prevoir une strategie de test dediee : compte de test, mocks, storage state Playwright ou base URL preview authentifiee.

## Priorite design logiciel

Le design concerne le logiciel Mandat OS / MandatFinder, pas le site public.

Ecrans principaux a prendre en compte :

- `/admin/market`
- `/admin/market/leads`
- `/admin/market/liste-chaude`
- `/admin/market/properties`
- `/admin/market/acheteurs`
- `/admin/market/matching`
- `/admin/market/opportunities`
- `/admin/market/rules`
- `/admin/market/notifications`
- `/admin/market/zones`
- `/admin/market/settings`
- `/admin/market/utilisateurs`

Objectif design : unifier ces pages en vrai logiciel metier operationnel, pas en assemblage de templates shadcn.

Points d'attention :

- Garder une interface dense, calme, lisible, orientee decision.
- Eviter les sections marketing ou trop decoratives dans le backoffice.
- Stabiliser la navigation : sidebar, header, statut sync, role utilisateur.
- Rendre les etats metier lisibles : opportunite, baisse de prix, phase vendeur, score, fraicheur zone, alertes.
- Ne pas masquer les workflows utiles derriere des cards trop grandes.

## Etat preview recent a connaitre

Commits recents integres dans `origin/preview` :

- `d2a5e47` : CRM "Liste chaude" + import vCard/CSV.
- `3477453` : auth Supabase + roles admin/super admin + gestion utilisateurs.
- `0aa5c97` : centre de controle sync + zones branchees API.
- `2b6ceab` : communes officielles via `geo.api.gouv.fr` + cascade delete biens.
- `129229e` : toggle pipeline MandatFinder + cron analyse quotidienne.
- `840a824` : email "fenetre d'or" via Resend.
- `77dfe1b`, `768dc0e`, `bb2d9c6` : corrections sync / Stream Estate.
- `a2c1358` : route diagnostic `test-stream-estate`, a supprimer apres debug.

## Documents utiles

- `docs/SUIVI_PROJET.md` : suivi projet mis a jour.
- `docs/CAHIER_DES_CHARGES.md` : cahier des charges historique.
- `docs/MANDATFINDER_ARCHITECTURE.md` : architecture DDD MandatFinder.
- `docs/ATTIO_CRM.md` : contexte CRM externe.

## A ne pas refaire

- Ne pas repartir du suivi initial qui indiquait Lot 2/3/4 a 0%.
- Ne pas supposer que `/admin` est l'etat du logiciel : `/admin` redirige vers `/admin/market` sur la preview recente.
- Ne pas confondre design public du site vitrine et design du logiciel.
- Ne pas rebaser ou reset sans verifier les changements locaux.
