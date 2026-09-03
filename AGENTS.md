# Codex instructions

Codex est prioritaire sur le design produit, l'UX, l'interface, le responsive, l'accessibilite et la coherence visuelle du logiciel.

Avant de modifier l'interface, lire :

- `docs/WORKFLOW_BRANCHES.md`
- `docs/DESIGN_UX_GUIDELINES.md`

Pour le SITE PUBLIC, la reference design unique est `docs/refonte/DESIGN_VENDEZ_PRO.md`
et le perimetre est fixe par `docs/REFONTE_2026-09.md`. La page `/vendez-pro` est gelee :
aucun element de la charte iad n'est importe dans le site.

Pour la LANDING PAGE GUIDE (`/guide-vendeur`) et le VISUALISEUR DU LIVRE (`/guide-vendeur/consulter`),
la reference strategique, le sommaire officiel et les decisions validees sont graves dans :
- `docs/GUIDE_VENDEUR_STRATEGIE_ET_SPECIFICATIONS.md`

`docs/BRAND.md` ne s'applique plus au site : il reste la reference pour les supports iad
(rapports d'estimation, flyers, reseaux sociaux, Canva).

Branche de travail :

- travailler localement sur `preview` par defaut ;
- ne rien pousser sans demande explicite d'Alexandre ;
- quand Alexandre demande explicitement une livraison, integrer `preview` vers `main` puis pousser `origin/main` ;
- ne plus creer de branches `design/*`, `ux/*`, `ui/*`, `a11y/*`, `feat/*` ou `fix/*` sauf decision explicite.

Les changements doivent rester centres sur l'experience utilisateur sauf demande explicite.
