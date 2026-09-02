# Inventaire du site alexandrelopez.fr

Relevé fait dans le repo (branche `preview`) le 2 septembre 2026. Il manque la couche Search Console,
que je n'ai pas — c'est la seule chose à ajouter pour finir l'inventaire.

---

## Trois constats avant le tableau

### 1. Sept pages se disputent l'intention « vendre »

`/`, `/vendre`, `/vendre-sans-agence`, `/avis-de-valeur-immobilier`, `/audit`, `/outils/audit`,
`/immobilier`. Toutes indexées, toutes autour du même sujet. Aucune ne peut se détacher tant que
c'est le cas — c'est le problème n°1 du site, et il ne se règle pas en écrivant plus, mais en
supprimant.

**Ma recommandation : trois intentions, trois pages, pas une de plus.**

- **Vendre avec toi** → une seule page pilier. Aujourd'hui il y a deux candidates, `/vendre` et
  `/avis-de-valeur-immobilier` (362 lignes, la plus travaillée du site). Il faut en tuer une.
  Je garderais `/avis-de-valeur-immobilier` pour le contenu, en 301 depuis `/vendre`.
- **Vendre seul** → `/vendre-sans-agence`, la landing du guide. Déjà en place.
- **Le marché local** → `/immobilier` et les pages communes.

Le reste part en redirection ou en noindex : `/audit` fait doublon d'intention avec
`/outils/audit`, `/vendez-pro` est une ancienne landing de guide, `/outils` est un hub dont
l'utilité reste à démontrer.

### 2. Le vocabulaire est verrouillé par une fonction — et c'est une bonne nouvelle

`src/lib/territory.ts` contient ceci :

```
export const TERRITORY_LABEL = 'Provence Verte & Verdon'

export function alignTerritory(value: string): string {
  return value
    .replace(/Provence Verte & Haut-Var/g, 'Provence Verte & Verdon')
    .replace(/Haut-Var/g, 'Verdon')
}
```

Le site **réécrit automatiquement « Haut-Var » en « Verdon »** sur toutes les pages éditoriales.
C'est l'exact inverse de la règle que tu m'as donnée, et ça explique pourquoi « Provence Verte &
Verdon » apparaît partout — accueil, à-propos, avis, blog, zone d'intervention.

La bonne nouvelle : **c'est un seul fichier**. Changer cette fonction, et le libellé bascule sur
tout le site d'un coup. C'est probablement la modification au meilleur rapport effort/effet de tout
le chantier.

Deuxième point de vocabulaire, plus diffus : « conseiller immobilier » est dans presque tous les
titres, alors que ta règle dit « agent immobilier ».

### 3. La landing promet un guide de 41 pages qui n'est pas hébergé

`/vendre-sans-agence` affiche en sous-titre : *« Guide Stratégique du Vendeur Particulier — 41 Pages
de Méthodes & Checklists A4 »*. Or il n'y a aucun PDF dans `public/`.

En revanche il y a `public/guide-canva-bulk-data.csv` — 8 modules pour un publipostage Canva — et
`public/images/guide-cover-provence.jpg`. Le guide est donc **déjà commencé**, plus avancé que ce
que notre conversation laissait penser.

Mais son contenu actuel est une transposition directe du modèle américain, titres anglais compris :
`SELLING YOUR OWN HOME`, `PREPARATION OF YOUR HOME`, `THE PROCESS OF PRICING`, `PHOTOGRAPHY BEFORE`.
C'est précisément ce que la table de correspondance recommandait de ne pas faire.

**Deux questions pour toi :** où en est le design Canva réellement, et le guide de 41 pages
existe-t-il quelque part sous forme aboutie ? Selon la réponse, on repart du noyau ou on reprend
l'existant.

---

## Le tableau

| URL | Ce que c'est | Index | Verdict proposé |
|---|---|---|---|
| `/` | Accueil — « Conseiller immobilier iad — Provence Verte & Verdon » | oui | Garder, réécrire (territoire, vocabulaire, CTA guide) |
| `/vendre` | Page éditoriale vendeur (i18n) | oui | **301 vers la page pilier vente** |
| `/avis-de-valeur-immobilier` | 362 lignes, la page la plus travaillée | oui | **Garder comme pilier vente.** Contenu à passer en « estimation ». URL à renommer plus tard |
| `/vendre-sans-agence` | Landing du guide, promet 41 pages | oui | **Garder — c'est LA landing.** Réaligner sur le guide réellement livré |
| `/vendez-pro` | Ancienne landing « Vendez Comme Un Pro » | non (noindex, nofollow) | 301 vers `/vendre-sans-agence` |
| `/guide-vendeur` | Lecteur du guide | non (noindex, follow) | Garder tel quel |
| `/audit` | Page éditoriale audit (i18n) | oui | Fusionner dans le pilier vente, ou 301 vers `/outils/audit` |
| `/outils/audit` | Questionnaire d'audit du bien, 345 lignes | oui | Garder comme outil, **pas comme page SEO** |
| `/outils/acheter` | Questionnaire projet acheteur, 299 lignes | oui | Idem |
| `/outils` | Hub des outils | oui | À justifier ou supprimer |
| `/outils/vendre` | Redirection 302 vers iad | — | Passer en 301, ou supprimer |
| `/immobilier` | Hub territoire — « Provence Verte & Verdon » | oui | Garder, réécrire le territoire |
| `/immobilier/[commune]` | **18 pages communes déjà en ligne** | oui | Garder. Monter 3 pilotes au gabarit avant de toucher aux 15 autres |
| `/acheter` | Page éditoriale acheteur | oui | Garder, hors périmètre vendeur |
| `/blog` + `/blog/[slug]` | Blog sur Sanity | oui | Garder. Articles issus du guide, plus tard |
| `/a-propos` | Mon approche | oui | Garder, passe de vocabulaire |
| `/avis` | Avis clients | oui | Garder — à alimenter avec de vrais témoignages |
| `/contact` | Contact | oui | Garder |
| `/mentions-legales`, `/politique-confidentialite` | Légal | oui | Garder |

**Les 18 communes en ligne** : Barjols, Cotignac, Lorgues, Brignoles, Pontevès, Saint-Maximin, Aups,
Salernes, Vinon-sur-Verdon, Rians, Le Val, Carcès, Montmeyan, Fox-Amphoux, Tourtour,
Sillans-la-Cascade, Villecroze, Tavernes.

---

## Ce qui est déjà propre, et qu'il ne faut pas casser

Le travail existant est sérieux, ce n'est pas un site à refaire :

- redirections de consolidation déjà en place — `/guide`, `/guide-organique`, `/vendre-organique`
  vers `/vendre-sans-agence`, et `/marche/:commune` vers `/immobilier/:commune` ;
- `sitemap.ts` avec un `lastmod` tenu à la main plutôt qu'au build, et un commentaire qui explique
  pourquoi — c'est du travail de quelqu'un qui sait ce qu'il fait ;
- exclusions volontaires du sitemap déjà documentées ;
- les pages communes générées depuis une source unique : ajouter une commune ne demande qu'une ligne.

---

## Ce qu'il manque pour finir

**Les données Search Console.** Impressions, position moyenne et requêtes par page sur 3 à 6 mois.
Sans elles, je te propose des fusions sur la logique éditoriale seule — or si une des pages que je
propose de rediriger reçoit déjà des impressions, la décision change. Exporte-moi le rapport
Performances par page et je complète le tableau.

## Les trois décisions à prendre

1. Quelle page devient le pilier « vendre avec moi » : `/vendre` ou `/avis-de-valeur-immobilier` ?
2. Que deviennent `/audit`, `/outils` et `/outils/vendre` ?
3. Le guide de 41 pages : il existe où, et sous quelle forme ?
