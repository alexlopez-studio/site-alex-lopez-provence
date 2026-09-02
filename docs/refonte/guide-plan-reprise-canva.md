# Guide vendeur — plan de reprise pour Canva

Source : `src/components/guide/GuidePagesData.ts`, 41 pages structurées, visibles sur `/guide-vendeur`.
Comparé au sommaire validé (`guide-table-correspondance.md`).

---

## Ce qui est déjà fait — et c'est beaucoup plus que prévu

Le guide n'est pas un brouillon. **L'adaptation au droit français est largement faite**, ce que je
ne savais pas quand j'ai écrit la table de correspondance :

- **Module 5 — Négociation** contient « Anatomie d'une Offre Conforme » : c'est la page que
  j'avais identifiée comme la plus importante du guide, celle qui explique qu'accepter une offre
  écrite engage. Elle existe.
- **Module 6 — Du Dossier au Notaire** est entièrement français : rôle du notaire, compromis,
  délai SRU, séquestre, chronologie des trois mois, remise des clés. Aucune trace d'escrow ou de
  title insurance.
- **Module 4 — Qualification & Visites** contient « Filtrage téléphonique en 4 points » et
  « Sécurité & Débriefing » : les deux ajouts que je recommandais, déjà là.
- Module 3 est adapté : rédaction d'annonce en AIDA, où diffuser, le panneau « à vendre », la
  fiche de visite.

**Et la séquence de nurturing est écrite** — `NurturingEmailsData.ts` : timing, objets A/B,
préheader, objectif et corps de chaque email. Prête à charger dans Brevo.

Il reste donc quatre chantiers, pas une réécriture.

---

## Chantier A — Traduire les titres restés en anglais

Ce sont des reliquats du gabarit américain. Le contenu dessous est en français.

| Page | Titre actuel | À remplacer par |
|---|---|---|
| 1 | Selling Your Own Home | **Vendre sa maison dans le Sud** |
| 3 | welcome | Bienvenue |
| 7 | Preparation of Your Home | Préparer votre bien |
| 12 | staging your home | La mise en scène de votre bien |
| 13 | Pricing Your Home | Fixer votre prix |
| 14 | THE PROCESS OF PRICING | Comment le marché réagit à votre prix |
| 18 | Marketing Your Home | Faire connaître votre bien |
| 19 | THE VALUE OF PHOTOGRAPHY | Ce que valent vos photos |
| 24 | Showings & Buyer Qualification | Visites et qualification des acheteurs |
| 28 | Offers & Negotiations | Offres et négociation |

Page 1, sous-titre : « en Provence Verte & Verdon » → **« en Provence & Côte d'Azur »**.

## Chantier B — Deux pages à remplacer, elles n'existent pas en France

**Page 16 — « CMA VS. APPRAISAL ».** Concept américain sans équivalent.
→ Remplacer par **« Les quatre sources de prix, et ce qu'elles valent »** : les ventes DVF
enregistrées par l'administration fiscale, les estimateurs en ligne, l'avis d'un agent, l'expertise
d'un expert agréé. C'est la page qui montre que tu travailles sur des données publiques et
vérifiables.

**Page 17 — « places to research : SOLD / PENDING / ACTIVE LISTINGS » + « SQUARE-FOOT COMPARISONS ».**
Vocabulaire MLS, inexistant ici.
→ Remplacer par les **trois vraies sources françaises** : les ventes réellement conclues (DVF), les
annonces en cours qui sont de la concurrence et non des prix de vente, et — le vrai signal — les
annonces retirées ou baissées. Plus une mise en garde sur le prix au m² en maison, que le terrain,
les annexes et l'état font éclater.

## Chantier C — Le point critique : les statistiques de la page 5

La page « 4 Réalités Chiffrées du Marché PAP » annonce un écart de prix de 6 à 9 %, un délai
rallongé de 19 jours, et 70 % de vendeurs qui finissent par déléguer.

**Ces chiffres viennent du gabarit américain.** Les 19 jours sont repris tels quels de l'étude NAR
citée dans le modèle d'origine. Ce sont des données de partie prenante, anciennes, et sur un marché
qui n'est pas le tien. Tu ne peux pas les défendre en rendez-vous si un vendeur te les oppose.

→ **À remplacer par tes propres chiffres**, que personne d'autre ne peut publier : l'écart entre
les prix affichés sur les portails et les prix réellement enregistrés en DVF, calculé sur tes
communes. Sourcé, local, à toi, avec le nombre de ventes observées affiché à côté.

C'est le chiffre qui rend le guide incontestable. C'est aussi le seul travail de fond de la reprise.

## Chantier D — Le chapitre qui manque entièrement

Les 41 pages ne contiennent **aucune page sur les spécificités locales**. Les diagnostics sont
mentionnés quatre fois en passant ; le débroussaillement, l'assainissement non collectif, la
piscine, l'eau et les terrains agricoles n'apparaissent nulle part.

C'est pourtant la seule partie qu'aucun guide national ne contient, et celle qui prouve que tu
connais le terrain. **Trois pages à créer**, à insérer dans le module 6 :

1. **Le dossier de diagnostics (DDT)** — checklist : DPE et audit énergétique selon la classe, ERP,
   amiante, plomb, termites, gaz, électricité, assainissement. Avec les durées de validité.
2. **Ce qui est particulier ici** — débroussaillement et PPRIF, assainissement non collectif et
   contrôle SPANC, piscine et dispositif de sécurité, puits et forage.
3. **Les pièges qui font échouer une vente dans le Sud** — constructions non régularisées (cabanon,
   extension, pool house), terrain agricole et SAFER, servitudes et bornage, confort d'été.

Socle juridique sourcé et à jour : `docs/refonte/guide-socle-juridique.md`. Il contient aussi les
six points à ne pas affirmer sans vérification.

---

## Deux arbitrages à trancher

**Doublon.** La page 6 « Pros & Cons de la vente entre particuliers » et la page 37 « Vendre seul vs
déléguer » disent la même chose, à trente pages d'écart. La 6 sert le diagnostic, la 37 sert le
pitch. → Garder la 6 telle quelle, transformer la 37 en « Ce que je fais concrètement », factuel.

**Le témoignage en page 2.** Il grille la posture pédagogique dès l'ouverture et ressemble à une
publicité. → Le déplacer en fin, avec la page 39. Et vérifier que la page 39 « Étude de cas réelle »
repose sur un dossier réel.

---

## Le sommaire cible

| Module | Pages | Statut |
|---|---|---|
| 0 · Ouverture et auto-diagnostic | 1 à 6 | Traduire p1 et p3, refaire p5, déplacer p2 |
| 1 · Préparer votre bien | 7 à 12 | Traduire p7 et p12 |
| 2 · Fixer votre prix | 13 à 17 | Traduire p13-14, **remplacer p16 et p17** |
| 3 · Faire connaître votre bien | 18 à 23 | Traduire p18 et p19 |
| 4 · Visites et qualification | 24 à 27 | Traduire p24 |
| 5 · Offres et négociation | 28 à 31 | Traduire p28 |
| 6 · Du dossier au notaire | 32 à 35 | **+ 3 pages : DDT, spécificités du Sud, pièges locaux** |
| 7 · Si vous préférez déléguer | 36 à 41 | Refondre p37, vérifier p39 |

**41 pages → 44.** Aucune suppression, trois créations, deux remplacements, dix traductions.

---

## Par quoi commencer

1. **Le chantier D** — les trois pages manquantes. C'est le contenu différenciant, et il ne dépend
   de rien : le socle juridique est déjà sourcé.
2. **Le chantier C** — le calcul DVF vs annonces sur tes communes. C'est le seul qui demande de la
   donnée.
3. **Les chantiers A et B** — mécaniques, à faire en dernier, directement dans Canva.

Le guide peut partir en démarchage dès que C et D sont faits, même si quelques titres sont encore
en anglais à l'intérieur.
