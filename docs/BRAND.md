# Brand — Tokens UI

## Couleurs

| Token CSS | Valeur | Nom | Usage | Classe Tailwind |
|-----------|--------|-----|-------|------------------|
| `--color-brand` | `#0077B6` | Bleu Méditerranée | Accent principal, CTAs, liens actifs | `bg-brand`, `text-brand` |
| `--color-brand-hover` | `#005F96` | Bleu profond | Hover boutons primaires | `hover:bg-brand-hover` |
| `--color-brand-light` | `#E0F0FA` | Bleu clair | Fonds teintés, badges, CTA final | `bg-brand-light` |
| `--color-foreground` | `#0F172A` | Anthracite | Texte principal, titres | `text-foreground` |
| `--color-muted` | `#64748B` | Gris | Texte secondaire | `text-muted` |
| `--color-border` | `#E2E8F0` | Gris clair | Bordures, séparateurs | `border-border` |
| `--color-surface` | `#F8FAFC` | Off-white | Sections alternées, fonds de cards | `bg-surface` |
| `--color-success` | `#10B981` | Vert | Tags "VENDU", badges positifs | `bg-success`, `text-success` |
| `--color-error` | `#EF4444` | Rouge | Messages d'erreur | `text-error` |

> **Note IAD** : La couleur `#0077B6` (Bleu Méditerranée) est une déclinaison premium du bleu IAD, plus profonde et adaptée au positionnement immobilier Provence Verte.

## Typographie

- **Police principale** : **Plus Jakarta Sans** (Google Fonts, via `next/font`)
- Chargée avec les weights : 300, 400, 500, 600, 700, 800
- Variable CSS : `--font-plus-jakarta-sans`

| Élément | Weight | Usage |
|---------|--------|-------|
| H1 Hero | 800 (extrabold) | Titres principaux |
| H2 Section | 800 (extrabold) | Titres de sections |
| H3 Sous-section | 700 (bold) | Sous-titres |
| Eyebrow | 600 (semibold) | Labels uppercase |
| Corps | 400 (regular) | Texte courant |
| Corps light | 300 (light) | Sous-titres, descriptions |
| Label UI | 600 (semibold) | Boutons, navigation |

## Boutons

| Variante | Style |
|----------|-------|
| `primary` | Fond `#0077B6`, texte blanc, `rounded-full` |
| `secondary` | Fond `#0F172A`, texte blanc, `rounded-full` |
| `outline` | Bordure `border-border`, fond blanc, `rounded-full` |
| `ghost` | Transparent, texte foreground |

## Règles importantes
- Style : épuré, premium, moderne — mobile-first
- Ne jamais utiliser le mot **"agence"** (mandataire)
- CTAs : orientés action ("Estimer mon bien", "Prendre RDV")
- Téléphone **06 13 18 01 68** toujours en texte HTML pur
- Aucune section sombre — alternance blanc/surface uniquement
- CTA final : fond `bg-brand-light` (#E0F0FA)
