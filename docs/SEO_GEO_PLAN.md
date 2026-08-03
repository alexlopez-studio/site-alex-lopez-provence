# Plan SEO/GEO — alexlopez-provence.fr

## Objectif

Structurer l’acquisition locale autour d’une logique simple :

```plain text
Requête vendeur locale
→ page marché / page conseil
→ landing avis de valeur
→ outil /outils/vendre
→ CRM / relance
```

Le site ne doit pas seulement capter des recherches génériques comme `estimation immobilière`. Il doit répondre aux intentions concrètes des propriétaires vendeurs en Provence Verte & Verdon : comprendre le prix de leur maison, éviter une erreur de mise en vente, choisir une stratégie et demander un avis de valeur.

## Principes de priorisation

1. **Priorité vendeur** : les requêtes liées à l’estimation, l’avis de valeur et la vente sont prioritaires.
2. **Local d’abord** : les pages locales doivent être utiles pour chaque commune, pas des duplications avec un nom de ville remplacé.
3. **Conversion éditoriale** : la page `/avis-de-valeur-immobilier` est le hub de persuasion ; `/outils/vendre` est le formulaire.
4. **Cluster avant volume** : une requête faible mais locale et transactionnelle vaut mieux qu’un mot-clé générique très concurrentiel.
5. **Suivi par intention** : SE Ranking doit suivre des groupes de mots-clés par intention, pas seulement une liste brute.
6. **Extension contrôlée** : le Pays d’Aubagne / Étoile / Marseille Est reste une extension opportuniste, pas un second positionnement principal.

## Pages cibles actuelles

| Page | Rôle SEO/GEO | CTA principal |
| --- | --- | --- |
| `/avis-de-valeur-immobilier` | Landing de conversion vendeur | `/outils/vendre` |
| `/marche` | Index territorial Provence Verte & Verdon | pages communes + `/avis-de-valeur-immobilier` |
| `/marche/[commune]` | Pages locales par commune | `/avis-de-valeur-immobilier` puis `/outils/vendre` |
| `/blog/[slug]` | Requêtes conseils vendeurs / longue traîne | `/avis-de-valeur-immobilier` |
| `/contact` | Contact direct | téléphone / formulaire |

## Clusters d’intention

### 1. Avis de valeur / estimation maison

**Objectif :** capter les propriétaires proches de la décision.

| Requête cible | Page cible | Priorité | Notes |
| --- | --- | --- | --- |
| avis de valeur immobilier | `/avis-de-valeur-immobilier` | P0 | Mot-clé principal de la landing |
| estimation maison Provence Verte | `/avis-de-valeur-immobilier` | P0 | À intégrer dans H2 / contenu |
| estimation maison Var | `/avis-de-valeur-immobilier` | P1 | Plus large, concurrence plus forte |
| combien vaut ma maison | article + landing | P1 | Requête pédagogique forte |
| faire estimer sa maison | article + landing | P1 | Bon angle guide |
| estimation gratuite maison | landing + pages locales | P2 | Très concurrentiel / banal, à traiter avec prudence |

### 2. Pages locales prioritaires

**Objectif :** capter les recherches géolocalisées à intention vendeur.

| Commune | Page cible | Requêtes principales | Priorité | Angle éditorial |
| --- | --- | --- | --- | --- |
| Barjols | `/marche/barjols` | estimation maison Barjols, prix immobilier Barjols, vendre maison Barjols | P0 | Marché accessible, maisons de village, biens avec terrain, vendeurs locaux |
| Cotignac | `/marche/cotignac` | estimation maison Cotignac, prix immobilier Cotignac, vendre maison Cotignac | P0 | Village recherché, biens de caractère, clientèle française/internationale |
| Lorgues | `/marche/lorgues` | estimation maison Lorgues, prix immobilier Lorgues | P1 | Axe premium / clientèle internationale |
| Brignoles | `/marche/brignoles` | estimation maison Brignoles, prix immobilier Brignoles, vendre maison Brignoles | P1 | Ville centre, marché plus large, maisons + appartements |
| Saint-Maximin-la-Sainte-Baume | `/marche/saint-maximin` | estimation maison Saint-Maximin, prix immobilier Saint-Maximin | P1 | Bassin dynamique, accès Aix/Marseille, familles |
| Pontevès | `/marche/ponteves` | estimation maison Pontevès, prix immobilier Pontevès | P1 | Ancrage local Alexandre, proximité Barjols |

### 3. Conseils vendeurs

**Objectif :** construire l’autorité, alimenter la landing et préparer les vendeurs.

| Sujet | Page cible | Priorité | CTA |
| --- | --- | --- | --- |
| Vendre sa maison sans agence : avantages, risques et limites | `/blog/vendre-sa-maison-sans-agence` | P0 | avis de valeur |
| Mandat simple ou exclusif : que choisir ? | `/blog/mandat-simple-ou-exclusif` | P0 | avis de valeur |
| Pourquoi ma maison ne se vend pas ? | `/blog/pourquoi-ma-maison-ne-se-vend-pas` | P1 | avis de valeur |
| Vendre une maison avec travaux | `/blog/vendre-maison-avec-travaux` | P1 | avis de valeur |
| Vendre avec un DPE F ou G | `/blog/vendre-maison-dpe-f-g` | P1 | audit + avis de valeur |
| Combien de temps faut-il pour vendre une maison ? | `/blog/delai-vente-maison` | P2 | avis de valeur |

### 4. GEO / extraction IA

**Objectif :** rendre les pages facilement exploitables par Google SGE, ChatGPT, Perplexity et autres moteurs génératifs.

Chaque page locale doit contenir :

- une réponse courte en haut de page ;
- un bloc “À retenir” ;
- des listes structurées ;
- une FAQ locale ;
- des données ou repères chiffrés sourcés quand disponibles ;
- des formulations directes : “Pour estimer une maison à Barjols…” ;
- un CTA clair vers l’avis de valeur.

### 5. Extension opportuniste Aubagne / Étoile / Marseille Est

**Objectif :** préparer l’extension, mais ne pas diluer le socle Provence Verte & Verdon.

Document dédié : `docs/AUBAGNE_ETOILE_EXTENSION.md`.

| Secteur | Page potentielle | Priorité | Condition |
| --- | --- | --- | --- |
| Aubagne | `/marche/aubagne` | P2 | seulement si signal Search Console, lead réel ou volonté commerciale explicite |
| La Destrousse | `/marche/la-destrousse` | P2 | si opportunité Pays de l’Étoile confirmée |
| Roquevaire | `/marche/roquevaire` | P2 | si logique maison / terrain confirmée |
| Auriol | `/marche/auriol` | P2 | si signal local ou réseau activé |
| Marseille Est micro-zones | à définir | P3 | uniquement micro-zone, éviter arrondissement générique |

## Premiers concurrents SERP observés

### Barjols

SERP dominée par portails de prix / estimation :

- Efficity : prix maison affiché autour de 2 880 €/m² sur les maisons en vente.
- Netvendeur : prix maisons autour de 3 245 €/m², appartements autour de 1 627 €/m².
- Meilleurs Agents : prix moyen tous biens autour de 1 651 €/m² selon extrait observé.
- SeLoger : maisons autour de 2 783 €/m², appartements autour de 1 699 €/m².
- PAP, RealAdvisor, Agence.immo, Immo-Diffusion.

**Opportunité :** les résultats donnent des chiffres mais peu de lecture terrain. La page Alexandre doit expliquer les écarts : maison de village, terrain, état, travaux, accès, DPE, rareté.

### Cotignac

SERP plus premium / village recherché :

- Meilleurs Agents : prix moyen tous biens autour de 3 363 €/m² ; maisons autour de 3 670 €/m².
- Netvendeur : maisons autour de 4 199 €/m², appartements autour de 2 550 €/m².
- Efficity : maisons autour de 3 760 €/m² avec une large fourchette.
- PAP : mention d’un délai moyen de vente observé sur PAP.
- RealAdvisor, Figaro Immobilier, SeLoger, JDN.

**Opportunité :** créer une page orientée “biens de caractère / clientèle internationale / valorisation du cachet”.

### Brignoles

SERP plus concurrentielle et plus large :

- PAP : prix moyen autour de 2 673 €/m², source DVF/PAP.
- RealAdvisor : prix moyen autour de 3 157 €/m².
- Netvendeur : maisons autour de 3 202 €/m², appartements autour de 3 129 €/m².
- Efficity : maisons autour de 2 970 €/m².
- Meilleurs Agents : prix moyen autour de 2 552 €/m².
- ORPI, Nestenn, Solvimo.

**Opportunité :** page plus “ville centre” : quartiers, appartements, maisons familiales, accès, bassin d’emploi, demande locale.

## Structure recommandée des pages locales

### H1

```plain text
Immobilier à [Commune] : prix, estimation et conseils pour vendre
```

### Introduction courte

- une réponse directe sur le marché ;
- mention Provence Verte & Verdon ;
- positionnement Alexandre ;
- CTA discret vers l’avis de valeur.

### Sections

1. **À retenir sur le marché immobilier à [Commune]**
   - 3 à 5 bullets simples.
2. **Prix immobilier à [Commune] : pourquoi les estimations varient**
   - expliquer les fourchettes de portails ;
   - insister sur l’adresse, l’état, le terrain, le DPE, la rareté.
3. **Quels biens se vendent à [Commune] ?**
   - maisons de village, maisons avec terrain, appartements, biens à travaux, selon commune.
4. **Comment obtenir une estimation fiable à [Commune] ?**
   - ventes comparables ;
   - concurrence actuelle ;
   - caractéristiques du bien ;
   - avis de valeur.
5. **Alexandre Lopez, conseiller immobilier iad en Provence Verte & Verdon**
   - approche locale, claire, humaine ;
   - pas de ton “agence”.
6. **FAQ locale**
   - prix au m² ;
   - estimation ;
   - délai ;
   - vendre seul ou accompagné ;
   - DPE / travaux.
7. **CTA final**
   - “Demander mon avis de valeur”.

## Maillage interne

### Depuis la landing avis de valeur

Ajouter progressivement des liens vers :

- `/marche/barjols`
- `/marche/cotignac`
- `/marche/lorgues`
- `/marche/brignoles`
- `/marche/saint-maximin`
- `/blog/vendre-sa-maison-sans-agence`
- `/blog/mandat-simple-ou-exclusif`

### Depuis les pages locales

Chaque page locale doit renvoyer vers :

- `/avis-de-valeur-immobilier`
- `/outils/vendre`
- `/contact`
- 2 autres communes proches ;
- 1 à 2 articles conseils vendeurs.

### Depuis les articles

Chaque article vendeur doit renvoyer vers :

- `/avis-de-valeur-immobilier` ;
- une page locale pertinente si l’exemple est territorialisé ;
- `/outils/vendre` en CTA secondaire.

## Suivi SE Ranking

### Groupes de mots-clés à créer

1. `Avis de valeur / estimation`
2. `Barjols`
3. `Cotignac`
4. `Lorgues`
5. `Brignoles`
6. `Saint-Maximin`
7. `Pontevès`
8. `Conseils vendeurs`
9. `DPE / travaux`
10. `Mandats immobiliers`
11. `Concurrents locaux`
12. `Aubagne / Étoile opportuniste`

### Mots-clés de départ

```plain text
avis de valeur immobilier
avis de valeur maison
estimation maison Provence Verte
estimation maison Var
estimation maison Barjols
prix immobilier Barjols
vendre maison Barjols
estimation maison Cotignac
prix immobilier Cotignac
vendre maison Cotignac
estimation maison Lorgues
prix immobilier Lorgues
vendre maison Lorgues
estimation maison Brignoles
prix immobilier Brignoles
vendre maison Brignoles
estimation maison Saint-Maximin-la-Sainte-Baume
prix immobilier Saint-Maximin-la-Sainte-Baume
estimation maison Pontevès
vendre sa maison sans agence
mandat simple ou exclusif
pourquoi ma maison ne se vend pas
vendre maison avec travaux
vendre maison DPE F
combien de temps pour vendre une maison
```

### Indicateurs à suivre

| Indicateur | Fréquence | Objectif |
| --- | --- | --- |
| Position par mot-clé | hebdomadaire | détecter les pages à renforcer |
| Impressions Search Console | mensuelle | repérer les requêtes émergentes |
| CTR par page | mensuelle | améliorer titles/meta |
| Clics vers `/avis-de-valeur-immobilier` | mensuelle | mesurer le maillage |
| Clics vers `/outils/vendre` | mensuelle | mesurer la conversion |
| Formulaires envoyés | mensuelle | relier SEO → leads |
| Appels téléphone | mensuelle | mesurer la conversion directe |

## Roadmap recommandée

### Sprint SEO/GEO 1 — Pages locales socles

1. Créer / enrichir `/marche/barjols`.
2. Créer / enrichir `/marche/cotignac`.
3. Ajouter un bloc de maillage depuis `/avis-de-valeur-immobilier` vers ces deux pages.
4. Mettre à jour sitemap si nécessaire.

### Sprint SEO/GEO 2 — Ville centre et ancrage local

1. Enrichir `/marche/brignoles`.
2. Enrichir `/marche/ponteves`.
3. Ajouter un article court “Combien vaut ma maison en Provence Verte ?”.

### Sprint SEO/GEO 3 — Contenus vendeurs

1. Article “Vendre sa maison sans agence”.
2. Article “Mandat simple ou exclusif”.
3. Article “Pourquoi ma maison ne se vend pas ?”.

### Sprint SEO/GEO 4 — Axe premium international

1. Enrichir `/marche/lorgues`.
2. Renforcer `/marche/cotignac` avec un bloc clientèle internationale.
3. Ajouter un contenu “Vendre une maison de caractère dans le Var intérieur”.

### Sprint SEO/GEO 5 — Extension opportuniste

1. Observer Search Console et les leads hors territoire principal.
2. Si signal réel : produire `/marche/aubagne` ou un hub `/marche/pays-aubagne-etoile`.
3. Ne pas élargir Marseille Est avant preuve de pertinence.

## Prochaine action concrète recommandée

Après les pages Barjols, Cotignac et Lorgues, la priorité la plus cohérente est :

1. **Enrichir Brignoles ou Pontevès** pour consolider Provence Verte ; ou
2. **Créer un article vendeur fort** pour soutenir toutes les pages locales ; ou
3. **Observer les premiers signaux de tracking** avant de produire l’extension Aubagne / Étoile.

---

# Audit d'écart — 3 août 2026

> Constats relevés sur le site en production et sur la fiche Google Business.
> **Sujet volontairement mis en attente** : à reprendre comme projet dédié, ce
> n'est pas la priorité actuelle. Rien n'a été modifié sur le site.
>
> Méthode : lecture du sitemap public, de `data/communes.json`, du JSON-LD servi
> en production et de la fiche Google Business. **Sans accès à la Search
> Console** — impossible donc de savoir sur quelles requêtes le site apparaît
> déjà, ni à quelle position. Cette donnée changerait probablement les
> priorités ci-dessous.

## Point de départ mesuré

Sur `conseiller immobilier provence verte` : 1re page, 3e résultat.

## Écart 1 — Dix communes sur quinze sont invisibles

`data/communes.json` déclare **15 communes**. Le sitemap n'en expose que **5** :
Barjols, Cotignac, Lorgues, Brignoles, Pontevès.

Les autres (Varages, Tavernes, Rians, Montmeyan, Vinon-sur-Verdon, Quinson,
Fox-Amphoux, Ginasservis, Saint-Julien-le-Montagnier, La Verdière,
Esparron-de-Verdon) répondent en HTTP 200 mais ne figurent dans aucun sitemap
et retombent sur le `generateMetadata` générique — sans le contenu éditorial
prévu par `LOCAL_PAGES`.

**Saint-Maximin-la-Sainte-Baume est classée P1 dans le présent plan mais absente
du sitemap.** Deux slugs répondent par ailleurs en 200 — `/marche/saint-maximin`
et `/marche/saint-maximin-la-sainte-baume` — ce qui pose une question de contenu
dupliqué à trancher avant d'enrichir la page.

C'est le gisement le plus direct : des pages à moitié construites, sur des
communes peu concurrentielles.

## Écart 2 — La fiche Google Business est le maillon faible

Sur les requêtes locales, le pack Maps capte l'essentiel des clics avant les
résultats classiques. Or la fiche « Alexandre Lopez IAD France » (Pontevès,
Place ID `ChIJr7Z_oQi_HAkR0Zgulp06NTc`) présente deux manques :

- **zéro avis**, face à des conseillers iad du même secteur à 24 et 35 avis ;
- **aucun lien vers le site** — le champ est vide.

Le nombre d'avis est un facteur de premier plan du classement local. L'outil
`avis.alexandrelopez.fr`, livré le 3 août, adresse précisément ce point. Le lien
manquant, lui, se corrige en deux minutes depuis le tableau de bord Google.

Ces deux actions relèvent d'Alexandre, pas du code, et pèsent probablement plus
que l'ensemble des optimisations techniques listées ici.

## Écart 3 — Pas de balisage d'entité locale

Le JSON-LD servi en production expose `FAQPage`, `Question`, `Answer` et
`PostalAddress`. Il **manque un type `RealEstateAgent` ou `LocalBusiness`**
déclarant l'entité, sa zone d'intervention et ses coordonnées.

Conséquence double :

- en SEO classique, perte de résultats enrichis ;
- en GEO, les moteurs génératifs s'appuient sur des entités structurées pour
  identifier qui fait quoi et où. Sans ce balisage, le site reste du texte parmi
  d'autres. C'est le point le plus directement lié à l'objectif GEO du plan.

## Vocabulaire : « conseiller » ou « agent immobilier »

`agent immobilier` se recherche nettement plus que `conseiller immobilier`.
Mais le titre est réglementé par la loi Hoguet et ne correspond pas au statut de
mandataire indépendant — les mentions légales du site indiquent bien « agent
commercial de la SAS I@D France ». La charte iad 2025 le proscrit également.

**Il n'est pas nécessaire de revendiquer le titre pour se positionner dessus.**
Le classement sur `agent immobilier + commune` tient à la pertinence locale
(fiche Google, avis, proximité, page dédiée), pas à la présence exacte du terme
dans la balise titre.

Piste éditoriale légitime : un article **« Agent immobilier ou conseiller iad :
quelle différence ? »**. Il capte la requête à fort volume, explique honnêtement
la distinction, et sert de page de conversion — sans s'attribuer un titre qui
n'est pas le bon.

## Territoire : Provence Verte comme marque, communes comme requêtes

Le label « Provence Verte & Verdon » est un territoire touristique peu tapé tel
quel. Les requêtes réelles sont `maison à vendre Barjols`, `estimation
appartement Brignoles`, `immobilier Haut-Var`, `prix immobilier Var`.

Le blog cible déjà correctement le Var (`prix-immobilier-var-2026`,
`dpe-f-g-var-vendre-2026`, `vivre-cotignac-guide-haut-var`). Le décalage porte
sur les pages **structurelles** — accueil et pages communes — toutes cadrées
Provence Verte & Verdon.

Orientation : conserver Provence Verte & Verdon comme positionnement de marque,
et laisser les pages communes porter les requêtes réelles. **Le nom de la
commune est le mot-clé**, pas le label régional.

## Ordre d'attaque proposé

| # | Action | Qui | Effort |
| --- | --- | --- | --- |
| 1 | Ajouter le lien du site sur la fiche Google Business | Alexandre | 2 min |
| 2 | Diffuser l'outil d'avis auprès des clients | Alexandre | continu |
| 3 | Trancher le doublon de slug Saint-Maximin, puis enrichir la page | Code | faible |
| 4 | Compléter les 10 communes manquantes et les ajouter au sitemap | Code + rédaction | moyen |
| 5 | Ajouter le balisage `RealEstateAgent` avec zone d'intervention | Code | faible |
| 6 | Écrire l'article agent / conseiller | Rédaction | moyen |

## Préalable avant de rouvrir le sujet

Les données de la **Search Console**. Sans elles, on ignore les requêtes sur
lesquelles le site apparaît déjà et leurs positions. Une page bloquée en 2e page
sur une requête à fort volume vaudrait mieux que dix nouvelles pages — et
l'ordre ci-dessus s'en trouverait modifié.

La propriété est **déjà vérifiée** : un enregistrement DNS
`google-site-verification` est en place sur `alexandrelopez.fr`. De la donnée
s'accumule donc depuis la mise en ligne, il n'y aura pas de délai d'amorçage.

Aucun accès permanent n'est nécessaire — trois exports CSV suffisent :

| Export | Ce qu'il tranche |
| --- | --- |
| Performances → Requêtes, 6 mois | Les termes réellement générateurs d'impressions, leur position et leur taux de clic. Peut renverser l'ordre d'attaque ci-dessus. |
| Performances → Pages | Quelles pages travaillent déjà, lesquelles sont inertes. |
| Indexation → Pages | **Le plus déterminant** : les 10 communes hors sitemap sont-elles indexées ou non ? L'écart 1 repose sur l'hypothèse qu'elles ne le sont pas ou mal ; cet export la confirme ou l'infirme. |
