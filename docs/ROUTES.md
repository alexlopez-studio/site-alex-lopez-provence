# Routes & Mapping des liens

## Variables d'environnement clés

| Variable | Usage |
|----------|-------|
| `NEXT_PUBLIC_ASSISTANT_APP_URL` | URL de l'app assistant (ex: `https://assistant.alexlopez-provence.fr`) |
| `NEXT_PUBLIC_CALCOM_URL` | Lien de prise de RDV Cal.com |
| `NEXT_PUBLIC_IAD_LISTINGS_URL` | URL des annonces IAD (vide = `/biens` placeholder) |
| `NEXT_PUBLIC_SITE_URL` | URL du site (pour les canonicals SEO) |

## Architecture cible domaines

Decision du 03/07/2026 :

- Le repo actuel reste la source unique pour le site public, Mandat OS, le portail client et les APIs.
- Domaine public cible : `alexandrelopez.fr`.
- Sous-domaine applicatif cible : `app.alexandrelopez.fr`.
- Sur `app.alexandrelopez.fr`, conserver deux surfaces avec auth et usages distincts :
  - `/app/*` : Mandat OS interne.
  - `/espace-client/*` : portail vendeur.
- Avant configuration DNS/Vercel, unifier le design applicatif dans ce repo avec une base commune
  `app-product`, puis rattacher le sous-domaine.

## Routes du site

### Logiciel Mandat OS

Routes canoniques de navigation locale et backoffice :

| Route | Description |
|-------|-------------|
| `/app/dashboard` | Vue d'ensemble Mandat OS |
| `/app/radar` | Radar vendeurs / MandatFinder |
| `/app/leads` | Contacts vendeurs et acquereurs |
| `/app/clients` | Dossiers clients vendeurs et acquereurs |
| `/app/clients/[id]` | Detail dossier client |
| `/app/liste-chaude` | Reseau relationnel |
| `/app/properties` | Biens du marche |
| `/app/properties/[id]` | Detail d'un bien |
| `/app/acheteurs` | Acquereurs |
| `/app/acheteurs/[id]` | Detail acquereur |
| `/app/acheteurs/nouveau` | Creation acquereur |
| `/app/matching` | Matching biens / acquereurs |
| `/app/opportunities` | Opportunites vendeurs et acquereurs |
| `/app/rules` | Regles d'automatisation |
| `/app/rules/new` | Creation de regle |
| `/app/notifications` | Notifications |
| `/app/zones` | Zones surveillees |
| `/app/settings` | Parametres et controle sync |
| `/app/utilisateurs` | Gestion utilisateurs admin |
| `/espace-client/test` | Session test locale espace client vendeur |

Référence processus : `docs/SMQ_PROCESSUS_VENDEUR.md` définit le parcours vendeur cible, avec l'opportunité comme fiche pivot, la recherche anti-doublon avant création et le statut `Veille annonce` pour les annonces sans vendeur exploitable.

Routes historiques conservees en redirection/rewrite :

| Ancienne route | Nouvelle route |
|----------------|----------------|
| `/admin/market` | `/app/dashboard` |
| `/admin/market/:path*` | `/app/:path*` |
| `/dashboard/radar` | `/app/radar` |
| `/app/dashboard/:path+` | `/app/:path*` |

### Pages conversion

| Route | Description | Lien vers |
|-------|-------------|-----------|
| `/` | Homepage | — |
| `/assistant` | Hub de choix (Vendre / Acheter / Audit) | Liens vers `NEXT_PUBLIC_ASSISTANT_APP_URL` |
| `/contact` | Formulaire + RDV | `NEXT_PUBLIC_CALCOM_URL` |
| `/a-propos` | Mon approche — personal branding | — |
| `/avis` | Avis clients | — |

### SEO GEO

| Route | Description |
|-------|-------------|
| `/immobilier` | Index des communes (liste + recherche) |
| `/immobilier/[commune]` | Page SEO par commune (FAQ schema.org, maillage) |

### Blog

| Route | Description |
|-------|-------------|
| `/blog` | Index des articles |
| `/blog/[slug]` | Article MDX (dans `content/blog/*.mdx`) |

### Légal

| Route | Description |
|-------|-------------|
| `/mentions-legales` | Mentions légales |
| `/politique-confidentialite` | Politique de confidentialité |

### Biens

| Route | Description |
|-------|-------------|
| `/biens` | Placeholder "Bientôt disponible" → redirigera vers `NEXT_PUBLIC_IAD_LISTINGS_URL` |

## Navigation Header

Ordre des items de nav :

| Item | Lien |
|------|------|
| Vendre | `${NEXT_PUBLIC_ASSISTANT_APP_URL}/vendre` (ou `/assistant` si non configuré) |
| Acheter | `${NEXT_PUBLIC_ASSISTANT_APP_URL}/acheter` (ou `/assistant`) |
| Audit immobilier express | `${NEXT_PUBLIC_ASSISTANT_APP_URL}/audit` (ou `/assistant`) |
| Mon approche | `/a-propos` |
| Devenir conseiller | `https://www.iadfrance.fr/rejoindre-iad` |
| Contact | `/contact` |
| Consulter les biens | `NEXT_PUBLIC_IAD_LISTINGS_URL` ou `/biens` |
| **CTA** Lancer l'assistant | `NEXT_PUBLIC_ASSISTANT_APP_URL` ou `/assistant` |
