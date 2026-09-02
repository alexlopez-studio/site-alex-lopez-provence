# Refonte du site — brief de référence

Version définitive du 2 septembre 2026. Remplace toute version antérieure.
Décisions prises par Alexandre en session ; ce document est la source unique pour Claude Code.

**Principe directeur : un site simple, facile à maintenir.** Six pages publiques, une seule sortie
de conversion, aucun doublon. Quand un arbitrage oppose la simplicité à l'optimisation, la
simplicité gagne.

---

## 1. Le site cible — 6 pages publiques

| URL | Contenu | Origine |
|---|---|---|
| `/` | **La home.** C'est l'actuelle `/vendez-pro` — hero vidéo, portrait détouré, `ConceptVendeurPage` | Existe, à déplacer |
| `/immobilier/[commune]` | 18 pages communes | Existent, à monter au gabarit |
| `/blog` | Index du blog | Existe |
| `/blog/[slug]` | Articles, issus des chapitres du guide | Existe |
| `/vendre-sans-agence` | **Landing du guide, à créer de zéro** | À créer |
| `/mentions-legales` · `/politique-confidentialite` | Légal, obligatoire | Existent |

**En ligne mais invisibles** — jamais liées, désindexées, retirées du sitemap, accessibles par URL
directe seulement : `/outils`, `/outils/acheter`, `/outils/audit`, `/resultats/[token]`.
Ce sont des outils qui fonctionnent, `/outils/audit` étant l'outil d'audit du bien d'Alexandre.

**Hors périmètre, ne pas toucher** : `/admin/*`, `/dashboard/*`, `/espace-client/*`, `/studio/*`,
`/api/*`. C'est l'applicatif, pas le site.

---

## 2. Ce qui est supprimé

Règle sans exception : **jamais de suppression sans sa redirection 301**. Fichier de route retiré +
une ligne dans `redirects()` de `next.config`. Tout reste récupérable dans l'historique Git.

| Supprimée | 301 vers |
|---|---|
| `/vendez-pro` | `/` (son contenu devient la home) |
| `/vendre` | `/vendre-sans-agence` |
| `/avis-de-valeur-immobilier` | `/vendre-sans-agence` |
| `/audit` | `/vendre-sans-agence` |
| `/acheter` | `/` |
| `/a-propos` | `/` |
| `/avis` | `/` |
| `/contact` | `/` |
| `/immobilier` (hub) | `/` |

> ### ⚠️ Correction du 2 septembre 2026 — le tunnel du guide reste intact
>
> Une version antérieure de ce brief listait `/guide-vendeur` en suppression. **C'est une erreur.**
> Vérification faite dans le code :
>
> - `/api/guide/download` envoie un email (via **Resend** aujourd'hui) contenant un lien vers
>   `${siteUrl}/guide-vendeur` ;
> - `/guide-vendeur` rend `GuideViewer`, un lecteur de **41 planches A4** imprimables et
>   exportables en PDF par le visiteur (`window.print()`).
>
> **Il n'y a pas de PDF à héberger, et il n'en faut pas.** `/guide-vendeur` EST la livraison du
> guide. Le supprimer casserait la remise pour tous les leads. Il reste en ligne, en `noindex,
> follow`, comme prévu au §1.
>
> **Conséquence sur l'ordre des travaux : le commit d'épuration ne touche à rien du tunnel.**
> `/vendre-sans-agence` → modale → `/api/guide/download` → email → `/guide-vendeur` reste
> fonctionnel de bout en bout pendant toute la refonte.
>
> `/vendre-sans-agence` continue donc de rendre `GuideLeadLandingPage` **jusqu'à ce que la nouvelle
> landing existe**. On ne la rebranche pas sur `ConceptVendeurPage` : cette page devient `/`, et
> deux URLs identiques recréeraient la cannibalisation qu'on supprime. La refonte de la landing est
> un chantier à part, postérieur, qui attend la reprise du guide.
>
> Le passage de Resend à Brevo est une évolution du tunnel existant, pas un prérequis. Il ne bloque
> aucun commit.

**Pas de hub commune.** Les 18 pages sont reliées depuis le bloc territoire de la home, et
découvertes par le sitemap. Un hub serait une page de plus à maintenir pour rien.

**Redirections existantes à repointer** : `/guide`, `/guide-organique` et `/vendre-organique`
pointent déjà vers `/vendre-sans-agence` — inchangé. `/marche` doit être repointée vers `/` puisque
`/immobilier` disparaît ; `/marche/:commune` reste inchangée.

**Nettoyage induit, même passe** : `GuideLeadLandingPage`, `EditorialPage` et ses clés i18n
deviennent inutilisés. À supprimer aussi.

Le site public passe de **21 routes à 6**, plus 4 invisibles.

---

## 3. Vocabulaire — tranché

Sur le site : **« agent immobilier »** et **« estimation »**.

`docs/BRAND.md` prescrit l'inverse (« conseiller en immobilier », « avis de valeur »). Alexandre a
tranché en connaissance de cause. Règle de rédaction :

- « agent immobilier » sert à **nommer la recherche du visiteur** — « Vous cherchez un agent
  immobilier à Cotignac ? ». C'est ce qui capte la requête ;
- il ne sert **pas d'auto-désignation** dans une présentation, une signature, un `schema.org` ou les
  mentions légales. Là on écrit ce qu'il fait : « je vends des maisons dans le Var » ;
- les mentions légales conservent la qualité exacte : conseiller iad, mandataire indépendant, RSAC.

**Ciblage affiché** : « Provence & Côte d'Azur », toujours adossé aux secteurs nommés — Haut-Var,
Provence Verte, pays d'Aix, littoral varois.

**`src/lib/territory.ts` est à corriger en premier.** Le fichier réécrit aujourd'hui « Haut-Var » en
« Verdon » et impose `TERRITORY_LABEL = 'Provence Verte & Verdon'` sur tout le site. Un fichier, un
effet global.

---

## 4. Conversion

**Une seule sortie sur tout le site : le téléchargement du guide contre un email.**
Formulaire **prénom + email**, pas de téléphone. **Brevo**, double opt-in, email automatique de
délivrance du PDF. L'estimation vient ensuite, par la séquence de nurturing — elle n'apparaît nulle
part comme appel à l'action.

---

## 5. Design — la référence est `/vendez-pro`, telle quelle

**Référence unique : `docs/refonte/DESIGN_VENDEZ_PRO.md`.**

`ConceptVendeurPage.tsx` + `concept.css` sont la base, **gelés**. On n'ajoute rien, on ne retire
rien, et on ne corrige rien au nom d'une charte extérieure. **Aucun élément de la charte iad n'est
importé**, ni dans cette page ni ailleurs sur le site. Les codes couleur déjà présents dans la page
restent tels quels : ce sont les couleurs du site.

Aucun contenu, aucun texte, aucun terme n'est repris d'une autre page.

Toute page nouvelle se construit avec la règle de déclinaison du §7.2 de ce document : trois fonds
en alternance, sections en bandes arrondies de 2rem espacées de 0.75rem, séquence sur-titre → titre
→ contenu → appel à l'action, deux graisses (500 partout, 800 pour la gélule), un seul appel à
l'action par page.

### Hero vidéo

`public/concept/video-mer.mp4` (2,4 Mo), `video-villa.mp4` (2,3 Mo), qui alternent en fondu d'une
seconde. Image poster affichée immédiatement, vidéo en différé derrière, jamais l'élément le plus
lourd du premier affichage. Sur mobile : poster seul.

## 6. Les pages communes

18 pages en ligne : Barjols, Cotignac, Lorgues, Brignoles, Pontevès, Saint-Maximin, Aups, Salernes,
Vinon-sur-Verdon, Rians, Le Val, Carcès, Montmeyan, Fox-Amphoux, Tourtour, Sillans-la-Cascade,
Villecroze, Tavernes.

Gabarit détaillé : `docs/refonte/gabarit-page-commune.md`.
Une page sert deux intentions — « prix m2 [commune] » et « agent immobilier [commune] ».
Sortie unique : le guide.

**Trois pilotes d'abord : Barjols, Cotignac, Tavernes.** Le bloc « ce qui fait la valeur ici »
s'écrit à la main, commune par commune : c'est lui qui évite d'avoir 18 quasi-doublons. Ne pas
toucher aux 15 autres avant trois mois de Search Console.

---

## 7. Ordre des travaux

**Ordre corrigé le 2 septembre 2026** — les suppressions passent AVANT le vocabulaire.

1. **Suppressions + redirections 301 + code mort** (§2 et §10), en un seul commit sur `preview`.
2. **Vocabulaire et territoire.** Après le commit 1, `alignTerritory` n'a plus qu'un seul appel :
   `Footer.tsx` ligne 27, `alignTerritory(t('tagline'))`. Corriger directement la clé i18n
   `tagline`, puis **supprimer `alignTerritory` et `src/lib/territory.ts` en entier**. Puis passe de
   vocabulaire sur les pages conservées (§3).
3. **Extraction du design system** (§5 et §7.2 de `DESIGN_VENDEZ_PRO.md`).
4. **`/vendez-pro` devient `/`**, avec sa 301.
5. Les trois pages communes pilotes — demandent du contenu écrit à la main.
6. La landing `/vendre-sans-agence`, quand le guide Canva est prêt.

> **Pourquoi cet ordre.** `territory.ts` est importé par `/vendre`, `/acheter`, `/audit`,
> `EditorialPage` et `Footer`. Les quatre premiers sont supprimés au §2, et `ConceptVendeurPage`
> ne l'utilise pas. Traiter le vocabulaire en premier reviendrait à vérifier un libellé sur cinq
> fichiers dont quatre disparaissent immédiatement après.

## 8. Reste ouvert

1. **Le guide de 41 pages** : `public/guide-canva-bulk-data.csv` contient 8 modules avec les titres
   anglais du modèle américain (`SELLING YOUR OWN HOME`, `THE PROCESS OF PRICING`), et il existe une
   couverture, mais **aucun PDF**. Où en est le design Canva réellement ?
2. **Les vidéos du hero** sont-elles de production propre ? Si ce sont des banques d'images, elles
   contredisent l'argument de maîtrise visuelle dès la première seconde.
3. ~~**Export Search Console** avant d'appliquer les redirections.~~ **Levé le 2 septembre 2026.**
   Ce n'est PAS un prérequis. Les données connues (« alexandre lopez » : 5 impressions,
   « alexandre iad » : 1 impression) montrent que le site n'a aucune audience organique à préserver.
   Il n'y a rien à perdre en supprimant les dix pages du §2. Le contrôle reste utile un jour, il ne
   bloque aucun commit.
4. **Le nom de la page de référence** : la question disparaît, `/vendez-pro` devient `/`.

---

## 9. Documents de référence — `docs/refonte/`

**Design — une seule référence :** `DESIGN_VENDEZ_PRO.md`. Anatomie complète de la page étalon,
tokens, composants, plus la règle de déclinaison pour toutes les autres pages (§7).

Les fichiers `design-lock.md` et `design-system.md` sont obsolètes : leur contenu utile a été
intégré au §7 de `DESIGN_VENDEZ_PRO.md`. **À supprimer (`git rm`) dans le commit de refonte.**

**Les autres :**

- `listing-complet-pages.md` — toutes les routes du dépôt
- `inventaire-site.md` — analyse des pages publiques
- `gabarit-page-commune.md` — structure d'une page commune
- `guide-table-correspondance.md` — le guide face au modèle américain
- `guide-socle-juridique.md` — droit sourcé, avec les six points à ne pas affirmer

Suivi : boards Monday « Site alexandrelopez.fr — remise à plat » et « Guide vendeur ».

---

## 10. Code mort identifié — nettoyage

Analyse statique du 2 septembre 2026. **L'applicatif reste hors périmètre** ; ce qui suit est du
code objectivement inatteignable ou orphelin, pas un jugement sur l'utilité de Mandat OS.

### 10.1 Routes inatteignables

| Route | Pourquoi elle est morte |
|---|---|
| `/dashboard` et `/dashboard/radar` | `next.config` redirige `/dashboard` et `/dashboard/radar` vers `/app/*`. Les fichiers de route ne peuvent jamais être servis. Leur contenu est le **template de démonstration shadcn** (`ChartAreaInteractive`, `DataTable`, `SectionCards`, `data.json`) — du scaffolding jamais retiré. Dernière modification : 9 juin 2026 |
| `/espace-client/test` | Harnais de test (« Session test espace vendeur »), en noindex |

### 10.2 Composants qui meurent avec les pages supprimées

À retirer dans le même commit que les suppressions du §2 :

- `BotanicalGuideLandingPage` — landing de guide orpheline, aucune route ne la rend. **Supprimable
  tout de suite.**
- `GuideLeadLandingPage` — **à conserver pour l'instant** : c'est elle que rend `/vendre-sans-agence`,
  qui doit rester fonctionnelle. Elle ne sera supprimée que le jour où la nouvelle landing la
  remplace.
- `EditorialPage` et ses clés i18n — utilisé uniquement par `/vendre`, `/acheter` et `/audit`.
- `ContactFormClient` et la route `/api/contact` — le seul consommateur est la page `/contact`.

### 10.3 À vérifier avant de toucher

- `/api/audit` : aucun appel trouvé côté front. Peut être appelé autrement — **ne pas supprimer
  sans vérifier**, `/outils/audit` reste en ligne.
- `/api/estimation` : **vivante**, consommée par `resultats/[token]` et `AppChrome`.
- `/api/guide/download` : **vivante et critique**, c'est elle que `ConceptVendeurPage` appelle.

### 10.4 Ce qui n'est PAS cassé

L'alias `/app/*` est volontaire : `next.config` redirige `/admin/market/*` vers `/app/*`, puis
réécrit `/app/*` vers `/admin/market/*`. Il n'existe donc pas de dossier `src/app/app` et c'est
normal. Le `middleware.ts` protège `/admin/*`, `/dashboard/*` et `/app/*` en fail-closed, mais
**pas `/api/*`** — noté dans le fichier lui-même.

`/studio` (Sanity) reste nécessaire tant que le blog est conservé : c'est l'éditeur des articles.

---

## 11. Architecture cible — séparer le site de Mandat OS

**Chantier distinct, à lancer APRÈS la refonte du site.** Deux chantiers en parallèle, c'est ce qu'on
cherche justement à éviter. La couture est propre, elle le restera.

### 11.1 Le constat

Le site public **n'appelle déjà pas** Mandat OS. Vérifié le 2 septembre 2026 :

- les pages communes n'ont aucune dépendance runtime — données statiques de `local-pages.ts` ;
- la home n'appelle rien ;
- le blog ne parle qu'à Sanity, service externe ;
- sur l'ensemble des composants publics, deux appels API seulement : `/api/guide/download` et
  `/api/guide/save-cover`.

Ce qui couple les deux n'est donc pas le contenu, mais le fait de vivre dans la même application
Next. **Les seuls éléments publics qui traversent réellement la frontière sont les outils** —
`/outils/acheter`, `/outils/audit` et `/resultats/[token]` — qui écrivent des leads via
`/api/estimation` et `/api/leads`.

La séparation est donc **un déménagement, pas une refonte**.

### 11.2 La cible

**Le site** — `alexandrelopez.fr` : 6 pages, données statiques, Sanity pour le blog, un seul
endpoint sortant vers Brevo. Déploiement léger, qui ne casse plus quand on travaille sur l'outil.

**Mandat OS** — sous-domaine dédié : `/admin`, `/espace-client`, l'alias `/app`, les outils
`/outils/*` et `/resultats/[token]`, les 85 routes API, le middleware d'authentification.

**Le lead** ne circule plus par une API partagée : formulaire du site → Brevo → Mandat OS.
Un seul tuyau, explicite.

### 11.3 Le gain de sécurité

`src/middleware.ts` protège `/admin/*`, `/dashboard/*` et `/app/*` en fail-closed, mais
**pas `/api/*`** — c'est écrit dans le fichier lui-même. Aujourd'hui le site vitrine expose donc
49 routes API `market` sur le domaine public. Après séparation, cette surface disparaît du site.

### 11.4 Points de vigilance

- Code partagé à trancher : client Supabase, types, schémas Zod. Duplication assumée ou paquet commun.
- Redirections des anciennes URLs `/outils/*`, `/resultats/*`, `/app`, `/admin`, `/dashboard` vers
  le sous-domaine.
- Sous-domaine en `noindex` + `robots.txt` fermé : c'est un outil, pas du contenu.
- Sessions de l'espace client : vérifier le domaine des cookies après bascule.
- Variables d'environnement à répartir entre les deux projets Vercel.

Suivi : board Monday « Séparation site / Mandat OS ».

---

## 12. Le guide : source de vérité et retrait du lecteur

Décision d'Alexandre, 2 septembre 2026.

### 12.1 La source de vérité est Canva

Le guide existe aujourd'hui **en double** : 41 pages dans `GuidePagesData.ts` (rendues par
`/guide-vendeur`), et bientôt les mêmes 41 pages retravaillées dans Canva.

**La source de vérité devient Canva.** Le code du lecteur n'est plus maintenu à partir de
maintenant : il sert uniquement à relire le contenu en attendant que la version Canva soit prête.
Aucune correction de contenu n'est faite dans `GuidePagesData.ts`.

Plan de reprise du contenu : `docs/refonte/guide-plan-reprise-canva.md`.

### 12.2 Le tunnel cible

Aujourd'hui : formulaire → `/api/guide/download` → email **Resend** → lien vers `/guide-vendeur`
(lecteur de 41 planches A4, imprimables par le visiteur).

Cible : formulaire → **Brevo** → email → **lien vers le PDF hébergé**.

Une seule chose change réellement : la destination du lien. **Un lien, pas une pièce jointe** — un
guide de 41 pages mis en page pèse plusieurs Mo, ce qui dégrade la délivrabilité, empêche de savoir
qui a réellement téléchargé, et oblige à renvoyer l'email à chaque correction du document.

### 12.3 Condition de retrait de `/guide-vendeur`

`/guide-vendeur` est un **outil interne de relecture**, pas une page destinée au public.

**Ne pas la supprimer tant que le PDF Canva n'est pas hébergé et que l'email ne pointe pas dessus** :
elle assure aujourd'hui la remise du guide à tous les leads.

**Le jour où le PDF est en place**, retirer d'un bloc :

- la route `/guide-vendeur`
- `GuideViewer.tsx` (~30 Ko)
- `GuidePagesData.ts` (~41 Ko)
- `A4PageRenderer.tsx`, `Interactive3DBookMockup.tsx` et les composants du lecteur devenus orphelins

Soit environ 90 Ko de code retirés d'un site qui doit rester léger.

En attendant : en ligne, `noindex, follow`, jamais liée depuis le site.
