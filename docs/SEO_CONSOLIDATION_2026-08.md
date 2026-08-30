# Consolidation SEO — août 2026

Note de reprise. État exact du chantier au 29/08/2026, pour repartir sans
réexpliquer le contexte.

Travail fait depuis Claude (Cowork), en local sur `preview`, **rien de poussé,
rien de commité**.

---

## 1. Pourquoi ce chantier

Point de départ : un brief SEO de deux pages (home + guide vendeur) rédigé sans
avoir lu le code. Sa relecture a fait apparaître un problème plus en amont que
celui qu'il traitait.

**Le constat.** Quatre URLs indexables servaient le même lead magnet, par paires
de doublons stricts — deux URLs distinctes rendant le *même composant*, chacune
se canonicalisant sur elle-même :

| URL | Composant | Sort |
|---|---|---|
| `/guide` | `GuideLeadLandingPage` | 301 → `/vendre-sans-agence` |
| `/vendre-sans-agence` | `GuideLeadLandingPage` | **conservée** |
| `/guide-organique` | `BotanicalGuideLandingPage` | 301 → `/vendre-sans-agence` |
| `/vendre-organique` | `BotanicalGuideLandingPage` | 301 → `/vendre-sans-agence` |
| `/guide-vendeur` | `GuideViewer` | `noindex, follow` |
| `/vendez-pro` | `ConceptVendeurPage` | déjà `noindex` — inchangée |
| `/vendre` | page commerciale i18n | inchangée |

Google devait arbitrer entre des quasi-doublons légitimes ; l'autorité se
divisait. C'est l'hypothèse la plus économique pour expliquer l'absence de
trafic non-marque — non vérifiée faute de baseline, voir §5.

## 2. Décisions prises (par Alexandre)

1. **URL des pages communes : `/immobilier/[commune]`**, en segment. Conserve un
   hub `/immobilier`, permet un fil d'Ariane. Le format plat `/immobilier-barjols`
   proposé par le brief a été écarté.
2. **Landing guide conservée : `/vendre-sans-agence`.** C'est la seule des quatre
   qui porte une intention de recherche réelle, et elle colle au positionnement
   du guide (vente de particulier à particulier). Créer une cinquième URL
   (`/guide-vendre-maison-var`) a été écarté.
3. **`BotanicalGuideLandingPage` est conservé sans route.** C'est la variante de
   design botanique : base d'un futur A/B derrière l'URL unique. Sujet Codex, pas
   SEO. Ne pas le supprimer en croyant nettoyer du code mort.

## 3. Ce qui est fait

**Redirections** (`next.config.ts`, toutes en `permanent: true`)

- `/guide`, `/guide-organique`, `/vendre-organique` → `/vendre-sans-agence`
- `/marche` → `/immobilier`, `/marche/:commune` → `/immobilier/:commune`

**Routes**

- `src/app/marche/` → `src/app/immobilier/` (via `git mv`, historique conservé)
- `/guide-vendeur` : ajout de `robots: { index: false, follow: true }`

**Data**

- `LOCAL_PAGES` et le type `LocalPage` sortis de
  `src/app/immobilier/[commune]/page.tsx` vers **`src/data/local-pages.ts`**,
  qui exporte aussi `LOCAL_PAGE_SLUGS`. Les pages, le sitemap et la future
  génération de communes lisent désormais la même source.

**Sitemap** (`src/app/sitemap.ts`, réécrit)

- Routes communes générées depuis `LOCAL_PAGE_SLUGS` au lieu d'une liste en dur
- URLs redirigées ou en `noindex` retirées
- `lastModified: new Date()` remplacé par `STATIC_CONTENT_UPDATED_AT`, constante
  datée à mettre à jour à la main. Dater tout le site à l'instant du build
  revient à le déclarer entièrement modifié à chaque déploiement : le signal
  `lastmod` ne vaut alors plus rien.

**Liens internes** — réécrits partout, pour qu'aucun lien interne ne transite
par une 301 :

- `src/app/a-propos/page.tsx`, `src/app/immobilier/page.tsx`, maillage entre
  communes dans `src/data/local-pages.ts`, `src/lib/analytics.ts`
- `GuideViewer.tsx` : bouton « Landing Page » `/guide` → `/vendre-sans-agence`
- `AppChrome.tsx` : `isGuideArea` nettoyé des routes supprimées

**Docs mises à jour** — `ROUTES.md`, `SEO_GEO_PLAN.md`,
`AUBAGNE_ETOILE_EXTENSION.md`, `TRACKING_CONVERSION.md` (URLs `/marche` → `/immobilier`).

**Vérification** : `npx tsc --noEmit` passe. **Le build n'a pas été lancé** (voir §6).

## 3 bis. Garde-fou `/immobilier/[commune]` (ajouté le 29/08)

Trouvé en vérifiant le chantier, non listé dans la note initiale — et de la même
famille que le problème qu'elle traite.

`src/app/immobilier/[commune]/page.tsx` n'avait ni `generateStaticParams` ni
`notFound()` : **n'importe quel slug renvoyait un 200**. `/immobilier/nimportequoi`
affichait « Immobilier à Nimportequoi » via `GenericCommunePage` — une page d'une
seule phrase — et `generateMetadata` lui posait un **canonical auto-référent sans
`noindex`**. Le site exposait donc un ensemble non borné de pages minces
indexables et auto-canonicalisées : exactement le motif éliminé sur les URLs du
guide, reconstitué à l'échelle des communes.

Le `nearbyLinks` vers `/immobilier/salernes` signalé au §4 n'était pas un cas
isolé, mais la partie visible de ce trou.

**Correctif.** Trois niveaux dans `src/data/local-pages.ts` :

- slug dans `LOCAL_PAGES` (5) → page rédigée, indexable, au sitemap ;
- slug reconnu mais sans contenu (20) → page générique en `noindex, follow`,
  hors sitemap ;
- tout le reste → `notFound()` (404).

**Effet de bord rattrapé au passage.** Le hub `/immobilier` portait une
**troisième** liste de communes, slugifiée à la volée
(`toLowerCase().normalize('NFD')…`). Six de ses seize liens seraient tombés en
404 : `saint-maximin` (commune P1 du plan SEO), `le-val`, `carces`, `tourtour`,
`sillans-la-cascade`, `villecroze`. Le hub lit désormais `TERRITORY_COMMUNES`
depuis `local-pages.ts`, avec des slugs écrits en dur — une URL ne doit pas
dépendre d'une transformation de chaîne. Il ne reste plus de liste de communes
en dur dans un composant.

Décompte après correctif : **25 slugs reconnus, 5 indexables, 0 lien interne en 404.**

**Vérifié en exécution**, pas seulement au typecheck — serveur de production local,
`npm run build` puis `npm run start` :

| URL | Attendu | Obtenu |
|---|---|---|
| `/immobilier/barjols`, `/cotignac` | 200, indexable | 200, aucune balise robots |
| `/immobilier/salernes`, `/saint-maximin`, `/tourtour` | 200, hors index | 200 + `noindex, follow` |
| `/immobilier/nimportequoi` | 404 | 404 |
| `/guide`, `/guide-organique`, `/vendre-organique` | → `/vendre-sans-agence` | 308 |
| `/marche`, `/marche/barjols` | → `/immobilier*` | 308 |
| `/guide-vendeur` | hors index | `noindex, follow` |
| `sitemap.xml` | 5 communes rédigées | barjols, cotignac, lorgues, brignoles, ponteves |

À noter : les redirections sortent en **308**, pas 301 — c'est ce que Next.js
émet pour `permanent: true`. Google les traite à l'identique ; la note initiale
les décrivait comme des 301, c'est le seul écart entre l'intention et le résultat.

## 4. Ce qui reste

**Lot 3 — Home en hub.** La fiche 1 du brief est réutilisable, mais recalée sur
les vraies URLs (`/immobilier/*`, `/vendre-sans-agence`). Deux points bloquants
à trancher avec Alexandre avant rédaction :

- l'ancienneté réelle (le brief propose « après 5 ans d'accompagnement » — à ne
  pas publier sans vérification) ;
- les formulations comparatives sur les honoraires face aux agences
  traditionnelles : publicité comparative, à faire relire côté conformité iad ;
- le brief contient aussi « Erreur n°2 : négocier les honoraires du mandat
  exclusif ». À retirer : expliquer à ses propres prospects de négocier ses
  honoraires est un contresens commercial.

Note : le H1 proposé par le brief porte « en 2025 ».

**Lot 4 — Communes manquantes.** `src/data/communes.json` contient 15 entrées,
`local-pages.ts` en couvre 5, et **un seul slug est commun aux deux** (barjols) :

- avec page, absentes de communes.json : cotignac, lorgues, brignoles, ponteves
- dans communes.json, sans page : varages, montmeyan, quinson, fox-amphoux,
  tavernes, ginasservis, rians, saint-julien-le-montagnier, la-verdiere,
  vinon-sur-verdon, esparron-de-verdon, saint-martin-de-bromes, aups, salernes

Il y avait en réalité **trois** sources, pas deux : `communes.json` (15),
`LOCAL_PAGES` (5) et une liste en dur dans le hub `/immobilier` (16). Le §3 bis
les réconcilie côté *routage* — 25 slugs reconnus, plus aucune liste en dur dans
un composant. Reste à réconcilier côté *éditorial* : décider quelles communes
méritent une page rédigée.

Générer **2 ou 3 pages pilotes**, pas vingt : vingt pages sur le même moule avec
du texte permuté, c'est du contenu mince, et ça se retourne contre le site. Les
communes sans page rédigée ne sont plus un risque d'indexation (elles sont en
`noindex`), donc rien ne presse : le choix peut être commercial, pas défensif.

**Lot 5 — Mesure.** Préalable à tout le reste, détaillé au §5.

## 5. Le point de mesure, à traiter en premier

`src/app/layout.tsx` charge **GTM (`GTM-T3P59HCW`) en dur** *et*
`AnalyticsScripts.tsx` injecte **un gtag GA4 direct** via
`NEXT_PUBLIC_GA_MEASUREMENT_ID`. Si la balise GA4 est également posée dans le
conteneur GTM, chaque page vue est comptée deux fois.

Non vérifié à ce jour — cela demande d'ouvrir la config GTM, ou de regarder les
requêtes vers `google-analytics.com/g/collect` dans l'onglet Réseau.

Tant que ce point n'est pas tranché, toute analyse d'audience porte sur des
chiffres potentiellement faux. Prendre la baseline GA4 × Search Console **avant**
de publier le lot 3, sinon l'effet des changements sera inmesurable.

Ordre de grandeur à garder en tête sur les volumes cités par le brief :
« conseiller immobilier var » est donné à 10 rech./mois, et les données Search
Console invoquées reposent sur **5 impressions** et **1 impression**. À ce
niveau, ce ne sont pas des données. Le volume réel est dans l'agrégation de la
longue traîne communale.

## 6. Pièges de reprise

1. ~~**Le build n'a jamais tourné.**~~ **Levé le 29/08.** `npm run build` passe
   (113/113 pages). Il échouait d'abord sur `ENOSPC: no space left on device` —
   le volume était à 100 %, 1,8 Gio libres. Supprimer le `.next` corrompu par
   l'échec a suffi à repartir. **Le disque reste tendu (~6 Gio) : à surveiller
   avant chaque build.**
2. ~~**`_to_delete/` à la racine**~~ **Supprimé le 29/08**, après vérification que
   les quatre fichiers sont récupérables depuis l'historique (`25cd46a`,
   `e2ffa78`, `9fa98b2`).
3. **Le working tree contenait déjà du travail non commité** avant ce chantier :
   `package.json`, `package-lock.json`, `AppChrome.tsx`, et non suivis
   `src/app/vendez-pro/`, `src/components/concept/`, `public/concept/`. Les
   modifications SEO s'y mélangent, dont une sur `AppChrome.tsx`. Trier avant de
   commiter. **Toujours d'actualité.**
4. ~~**Deux lockfiles coexistent.**~~ **Tranché le 29/08 en faveur de npm** :
   `pnpm-lock.yaml` supprimé (suppression non stagée). Le risque était concret et
   non théorique : `lenis`, ajouté à `package.json` et importé par
   `ConceptVendeurPage.tsx`, est présent dans `package-lock.json` et **absent de
   `pnpm-lock.yaml`** (figé au 17/06). Si Vercel avait résolu vers pnpm, l'install
   n'aurait pas fourni la dépendance et le build aurait cassé.
5. Les redirections `/marche/*` doivent rester en place durablement : les
   supprimer casserait les liens déjà indexés ou partagés.

## 7. Après publication

- Soumettre le nouveau sitemap dans Search Console
- Contrôler dans le rapport d'indexation que les anciennes URLs passent bien en
  « Page avec redirection » et non en erreur
- Re-mesurer à 6 semaines, pas avant
