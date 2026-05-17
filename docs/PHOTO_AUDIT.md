# Audit photos — alexlopez-provence.fr

Date : 17 mai 2026  
Branche de travail : `feat/photo-audit-step1` → `preview`

## Objectif

Renforcer la cohérence visuelle du site autour d’un univers plus local, immobilier et premium : Provence Verte & Verdon, villages, rues, maisons, façades, bâti provençal, avec le portrait d’Alexandre comme élément de confiance.

## Principes validés

- Priorité aux villages, rues, maisons, façades et détails de bâti.
- Les paysages Verdon / lavandes / vignes restent possibles, mais seulement en respiration.
- Éviter les images hors territoire ou trop Côte d’Azur.
- Ne pas surutiliser les mêmes images d’une page à l’autre.
- Optimiser les images lourdes avant usage intensif.

## Inventaire initial

| Image | Poids approx. | Diagnostic | Action recommandée |
| --- | ---: | --- | --- |
| `alexandre-lopez-no-background.png` | 1,16 Mo | Très pertinent pour la confiance, mais lourd | Garder, optimiser en WebP/AVIF |
| `alexandre-lopez.jpg` | 1,95 Mo | Portrait potentiellement utile, lourd | Évaluer visuellement, compresser si gardé |
| `alexandre-lopez-face.jpg` | 2,42 Mo | Redondant et lourd | Archiver ou compresser fortement |
| `village-cotignac.jpg` | 3,35 Mo | Très local, très pertinent, mais trop répété | Garder comme image territoire principale, optimiser |
| `maison-bleue-cotignac.jpg` | 1,70 Mo | Excellent asset immobilier / village | Garder, optimiser, utiliser pour habitat / achat / audit transitoire |
| `vignobles-var.jpg` | 2,06 Mo | Joli mais trop paysage pour l’audit | Remplacer sur `/audit` |
| `lver-south-4790158_1920.jpg` | 955 Ko | Ambiance Provence correcte, peu incarnée | Remplacer à terme sur `/a-propos` |
| `gorges-du-verdon.jpg` | 3,35 Mo | Très territoire, mais touristique et lourd | Usage ponctuel uniquement, optimisation obligatoire |
| `lavandes-proche.jpg` | 1,69 Mo | Provence générique | Usage secondaire |
| `geertd-lavende-2287924_1920.jpg` | 844 Ko | Provence générique | Usage secondaire ou archive |
| `hans-olive-tree-1595493_1920.jpg` | 1,19 Mo | Ambiance locale possible, peu immobilier | Usage secondaire |
| `Saint-Tropez.jpg` | 1,99 Mo | Hors territoire, trop littoral | Ne pas utiliser sur le site public |

## Changement immédiat de ce lot

- `/audit` ne s’appuie plus sur `vignobles-var.jpg`.
- Le visuel audit passe temporairement sur `maison-bleue-cotignac.jpg`, plus cohérent avec le bâti, la maison et la décision immobilière.
- `next.config.ts` autorise désormais `images.pexels.com` et `cdn.pixabay.com` pour faciliter des tests de visuels gratuits en remote si nécessaire.

## Shortlist gratuite initiale

### Habitat / immobilier

- https://www.pexels.com/photo/exterior-of-a-house-13935476/
- https://www.pexels.com/photo/charming-rustic-house-in-provence-france-32802440/
- https://www.pexels.com/photo/charming-provence-house-with-green-shutters-36403734/

### Villages / rues provençales

- https://www.pexels.com/photo/charming-buildings-in-provence-alpes-cote-d-azur-29864399/
- https://pixabay.com/images/search/village%20de%20provence/

### Verdon / territoire

- https://pixabay.com/images/search/verdon/
- https://pixabay.com/photos/esparron-de-verdon-lake-provence-5358921/
- https://pixabay.com/photos/france-the-gorge-of-verdon-3234611/

## Prochain lot recommandé

1. Télécharger 3 à 5 candidats depuis Pexels / Pixabay.
2. Les convertir en WebP optimisé.
3. Remplacer progressivement : `/vendre`, `/a-propos`, diversification homepage.
4. Ajouter un registre interne des crédits / sources.
