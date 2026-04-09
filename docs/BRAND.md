# Brand — Tokens UI

## Couleurs IAD France (officielles)

| Token CSS | Valeur | Nom IAD | Usage | Classe Tailwind |
|-----------|--------|---------|-------|-----------------|
| `--color-brand` | `#00B4EC` | Cerulean | Accent principal, CTAs, liens actifs | `bg-brand`, `text-brand` |
| `--color-brand-hover` | `#0099CC` | Cerulean sombre | Hover boutons primaires | `hover:bg-brand-hover` |
| `--color-brand-light` | `#E0F5FD` | Cerulean clair | Fonds teintés, badges, CTA final | `bg-brand-light` |
| `--color-foreground` | `#0F172A` | — | Texte principal, titres | `text-foreground` |
| `--color-muted` | `#64748B` | — | Texte secondaire | `text-muted` |
| `--color-border` | `#E2E8F0` | — | Bordures, séparateurs | `border-border` |
| `--color-surface` | `#F8FAFC` | — | Sections alternées, fonds de cards | `bg-surface` |
| `--color-success` | `#10B981` | — | Tags "VENDU", badges positifs | `bg-success`, `text-success` |
| `--color-error` | `#EF4444` | — | Messages d'erreur | `text-error` |

> **Note :** La couleur secondaire IAD (Danube `#6192D4`) peut être utilisée pour des éléments décoratifs ou des dégradés, mais pas comme couleur d'action principale.

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
| `primary` | Fond `#00B4EC`, texte blanc, `rounded-full` |
| `secondary` | Fond `#0F172A`, texte blanc, `rounded-full` |
| `outline` | Bordure `border-border`, fond blanc, `rounded-full` |
| `ghost` | Transparent, texte foreground |

## Composants clés

### Cards
```
fond blanc, rounded-2xl, padding 28-32px
bordure 1px solid #E2E8F0
hover : shadow-md + -translate-y-0.5
transition : 200ms ease
```

### Navbar
```
sticky fixed top-0 z-50
défaut : bg-white, border-b transparent, py-5
scrollé > 48px : bg-white/95 backdrop-blur-md, shadow-sm, border-b border-border, py-3
transition : duration-300
```

### Sections
```
alternance bg-white / bg-surface (#F8FAFC)
padding vertical : py-24 (96px)
container : max-w-[75rem] mx-auto px-6
```

## Règles importantes
- Style : épuré, premium, moderne — mobile-first
- Ne jamais utiliser le mot **"agence"** (mandataire)
- CTAs : orientés action ("Estimer mon bien", "Lancer l'assistant", "Prendre RDV")
- Téléphone **06 13 18 01 68** toujours en texte HTML pur (indexable)
- Aucune section sombre — alternance blanc/surface uniquement
- CTA final : fond `bg-brand-light` (#E0F5FD)
