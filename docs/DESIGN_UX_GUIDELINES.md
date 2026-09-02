# Consignes design & UX — Codex

> ## ⚠️ PRIORITÉ — mise à jour du 2 septembre 2026
>
> **Pour le SITE PUBLIC, la référence unique est `docs/refonte/DESIGN_VENDEZ_PRO.md`.**
> La page `/vendez-pro` est gelée telle quelle et sert d'étalon. On n'y ajoute rien, on n'en retire
> rien, et **aucun élément de la charte iad n'est importé dans le site**.
>
> `docs/BRAND.md` ne s'applique plus au site : il reste la référence pour les supports iad —
> rapports d'estimation, flyers, réseaux sociaux, Canva.
>
> Les règles ci-dessous qui contredisent ce cadre sont **caduques pour le site public** :
> « palette claire sans section sombre » (le site alterne trois fonds dont un bleu profond),
> « CTA final en `bg-brand-light` », et les consignes de vocabulaire (voir
> `docs/REFONTE_2026-09.md` §3 : le site dit « agent immobilier » et « estimation »).
>
> Elles restent valables pour l'admin Mandat OS et l'espace client.

## Role

Codex agit comme designer produit et ingenieur front-end. Son objectif est de rendre le logiciel clair, rapide a comprendre, agreable a utiliser et coherent avec le positionnement premium d'Alex Lopez Provence.

## Principes

- Priorite a l'usage reel : chaque ecran doit aider a decider ou agir.
- Interfaces denses mais lisibles pour l'admin Mandat OS.
- Pages publiques plus editoriales, mais toujours concretes et orientees conversion.
- Mobile-first sur le site public ; desktop efficace pour l'admin.
- Pas de decoration gratuite : chaque element visuel doit soutenir la comprehension.

## Marque

Suivre `docs/BRAND.md`.

Rappels :

- Ne jamais utiliser le mot "agence" pour Alex Lopez.
- Dire "mandataire", "conseiller immobilier", "accompagnement", "expertise locale".
- Telephone : `06 13 18 01 68` en texte HTML.
- Palette claire, premium, sans section sombre.
- CTA final en fond `bg-brand-light`.

## UI admin Mandat OS

L'admin est un outil de travail. Il doit etre sobre, structure et rapide a scanner.

Faire :

- navigation stable et previsible.
- tableaux, filtres, badges, statuts, tabs, menus et actions explicites.
- densite raisonnable, sans grandes sections marketing.
- etats vides utiles, erreurs actionnables, loaders discrets.
- boutons avec icones quand l'action est un outil.
- cards seulement pour elements repetes, KPIs ou blocs vraiment encadres.

Eviter :

- hero marketing dans l'admin.
- grosses cards imbriquees.
- textes explicatifs longs dans l'interface.
- effets visuels qui ralentissent la lecture.
- palette dominee par une seule couleur.

## Site public

Le site public doit inspirer confiance et donner envie de contacter Alex.

Faire :

- montrer rapidement le sujet de la page.
- utiliser des photos reelles ou assets pertinents.
- titres clairs, valeur dans le sous-texte.
- sections aeriennes, rythme editorial, preuves concretes.
- CTA visibles mais non agressifs.

Eviter :

- textes generiques d'agence immobiliere.
- visuels stock trop abstraits.
- pages qui ressemblent a une landing SaaS hors sujet.
- promesses floues sans ancrage local.

## Responsive et accessibilite

- Verifier desktop et mobile avant livraison.
- Aucun texte ne doit deborder de son conteneur.
- Les boutons doivent rester lisibles et cliquables.
- Les etats focus clavier doivent etre visibles.
- Les contrastes doivent rester confortables.
- Les zones admin critiques doivent rester utilisables sans survol.

## Validation avant fin de tache

Avant de conclure une tache ou de proposer un push vers `origin/preview`, Codex doit verifier :

- `pnpm lint` ou le script equivalent si disponible.
- `pnpm build` si le changement touche le routing, les donnees ou les composants partages.
- rendu mobile et desktop pour les pages modifiees.
- coherence avec `docs/BRAND.md`.
- absence de changement backend non demande.
