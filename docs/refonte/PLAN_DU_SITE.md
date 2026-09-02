# Plan du site — validé le 2 septembre 2026

Six pages publiques. Une seule sortie de conversion sur chacune : **le guide**.

---

## L'arborescence

```
alexandrelopez.fr
│
├── /                                   ← ACCUEIL
│   Contenu et design de l'actuelle /vendez-pro, gelée telle quelle.
│   Hero vidéo · 8 sections · sortie : le guide
│   Porte le bloc territoire qui relie les 18 pages communes
│
├── /vendre-sans-agence                 ← LANDING DU GUIDE (à créer de zéro)
│   Page dédiée, utilisée en démarchage leboncoin et sur les flyers
│   Formulaire prénom + email → Brevo → PDF par email
│
├── /immobilier/[commune]               ← 18 PAGES COMMUNES
│   Barjols · Cotignac · Lorgues · Brignoles · Pontevès · Saint-Maximin
│   Aups · Salernes · Vinon-sur-Verdon · Rians · Le Val · Carcès
│   Montmeyan · Fox-Amphoux · Tourtour · Sillans-la-Cascade
│   Villecroze · Tavernes
│   Pilotes : Barjols, Cotignac, Tavernes
│   Sortie : le guide
│
├── /blog                               ← INDEX DU BLOG (Sanity)
│   └── /blog/[slug]                    ← ARTICLES
│       Issus des chapitres du guide. Aucun article avant que le guide existe
│       Sortie : le guide
│
├── /mentions-legales                   ← LÉGAL (obligatoire)
└── /politique-confidentialite          ← LÉGAL (obligatoire)
```

## En ligne mais invisibles

Jamais liées, désindexées, retirées du sitemap. Accessibles par URL directe uniquement.

```
/outils
/outils/acheter          questionnaire projet acheteur
/outils/audit            outil d'audit du bien
/resultats/[token]       page de résultat des outils
```

## Supprimé, avec redirection 301

| Supprimée | Redirige vers |
|---|---|
| `/vendez-pro` | `/` |
| `/vendre` | `/vendre-sans-agence` |
| `/avis-de-valeur-immobilier` | `/vendre-sans-agence` |
| `/audit` | `/vendre-sans-agence` |
| `/guide-vendeur` | `/vendre-sans-agence` |
| `/acheter` | `/` |
| `/a-propos` | `/` |
| `/avis` | `/` |
| `/contact` | `/` |
| `/immobilier` (hub) | `/` |

Redirections existantes à conserver : `/guide`, `/guide-organique`, `/vendre-organique` →
`/vendre-sans-agence` · `/marche/:commune` → `/immobilier/:commune`.
**À repointer** : `/marche` → `/` (puisque `/immobilier` disparaît).

## Hors périmètre — ne pas toucher

```
/admin/*  ·  /dashboard/*  ·  /espace-client/*  ·  /studio/*  ·  /api/*
```

---

## Le parcours

```
        flyers · leboncoin · réseaux sociaux
                      │
                      ▼
          /vendre-sans-agence  ──┐
                                 │
   recherche Google              │
   « prix m2 [commune] »         ├──►  formulaire prénom + email
   « agent immobilier [commune] »│              │
                      │          │              ▼
                      ▼          │           Brevo
          /immobilier/[commune] ─┤              │
                                 │              ▼
   marque · bouche-à-oreille     │      guide PDF par email
                      │          │              │
                      ▼          │              ▼
                     /  ─────────┘      séquence de nurturing
                                                │
                                                ▼
                                     demande d'estimation
                                                │
                                                ▼
                                             mandat
```

L'estimation n'apparaît nulle part sur le site comme appel à l'action. Elle est la deuxième étape,
portée par la séquence email.

---

## Ce qui reste à produire

| Quoi | État |
|---|---|
| Le guide (noyau 6-8 pages, puis complet) | à écrire |
| La landing `/vendre-sans-agence` | à créer de zéro |
| Le bloc « ce qui fait la valeur ici » × 3 communes pilotes | à écrire à la main |
| Le compte Brevo et l'email de délivrance | à configurer |
| Le PDF hébergé | dépend du guide |

Références : `docs/REFONTE_2026-09.md` (périmètre et ordre des travaux) ·
`docs/refonte/DESIGN_VENDEZ_PRO.md` (design, référence unique) ·
`docs/refonte/gabarit-page-commune.md` (structure d'une page commune).
