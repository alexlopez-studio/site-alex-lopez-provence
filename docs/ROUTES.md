# Routes & Mapping des liens

## Variables d'environnement clés

| Variable | Usage |
|----------|-------|
| `NEXT_PUBLIC_ASSISTANT_APP_URL` | URL de l'app assistant (ex: `https://assistant.alexlopez-provence.fr`) |
| `NEXT_PUBLIC_CALCOM_URL` | Lien de prise de RDV Cal.com |
| `NEXT_PUBLIC_IAD_LISTINGS_URL` | URL des annonces IAD (vide = `/biens` placeholder) |
| `NEXT_PUBLIC_SITE_URL` | URL du site (pour les canonicals SEO) |

## Routes du site

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
| `/marche` | Index des communes (liste + recherche) |
| `/marche/[commune]` | Page SEO par commune (FAQ schema.org, maillage) |

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
