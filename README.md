# Site Alex Lopez Provence

Site marketing & SEO — Alex Lopez, mandataire IAD Provence.

> **Ce repo est uniquement le site marketing/SEO.** La logique assistant/CRM est dans un repo séparé.

## Stack

- **Next.js 15** App Router (React 19)
- **TypeScript** strict
- **Tailwind CSS v4**
- **shadcn/ui**
- **Hébergement** : Vercel

## Setup rapide

```bash
# 1. Cloner et installer
pnpm i

# 2. Variables d'environnement
cp .env.example .env.local
# Compléter les valeurs dans .env.local

# 3. Démarrer
pnpm dev
```

## Scripts

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Démarrage en développement (Turbopack) |
| `pnpm build` | Build de production |
| `pnpm start` | Serveur de production |
| `pnpm lint` | Linting ESLint |

## Structure du projet

```
src/
├── app/                    # Routes Next.js App Router
│   ├── layout.tsx          # Layout global
│   ├── page.tsx            # Homepage /
│   ├── assistant/          # Hub assistant
│   ├── contact/            # Contact + RDV
│   ├── a-propos/           # Mon approche
│   ├── avis/               # Avis clients
│   ├── marche/             # SEO communes
│   │   └── [commune]/
│   ├── blog/               # Blog MDX
│   │   └── [slug]/
│   ├── biens/              # Placeholder biens
│   ├── mentions-legales/
│   ├── politique-confidentialite/
│   ├── sitemap.ts          # Sitemap dynamique
│   └── robots.ts
├── components/
│   ├── layout/             # Header, Footer
│   └── ui/                 # Composants UI
├── lib/
│   ├── utils.ts            # cn() helper
│   ├── env.ts              # Variables d'env typées
│   └── blog.ts             # Helpers MDX
data/
│   └── communes.json       # Données communes (statiques → CMS plus tard)
content/
│   └── blog/               # Articles MDX
docs/
│   ├── ROUTES.md           # Carte des routes
│   └── BRAND.md            # Tokens UI
```

## Variables d'environnement

Voir `.env.example` pour la liste complète.

## Déploiement

Connectez le repo à Vercel. Les variables d'env sont à configurer dans le dashboard Vercel.

---

*Alex Lopez — Mandataire IAD Provence*
