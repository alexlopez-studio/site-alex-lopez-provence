# Brand — Tokens UI

## Couleurs

| Token CSS | Valeur | Usage | Classe Tailwind |
|-----------|--------|-------|------------------|
| `--color-brand` | `#0066FF` | Bleu IAD primaire | `bg-brand`, `text-brand` |
| `--color-brand-hover` | `#0052CC` | Hover bleu | `hover:bg-brand-hover` |
| `--color-foreground` | `#1A1A2E` | Titres, texte principal | `text-foreground` |
| `--color-muted` | `#64748B` | Texte secondaire | `text-muted` |
| `--color-success` | `#10B981` | CTA vert, succès | `bg-success`, `text-success` |
| `--color-success-hover` | `#059669` | Hover vert | `hover:bg-success-hover` |
| `--color-border` | `#E2E8F0` | Bordures, séparateurs | `border-border` |
| `--color-surface` | `#F8FAFC` | Fonds de sections alternées | `bg-surface` |

## Typographie

- **Police** : Inter (Google Fonts, via `next/font`)
- **Titres** : `font-black` (900) ou `font-extrabold` (800)
- **Corps** : `font-normal` (400)
- **Labels** : `font-semibold` (600)

## Boutons

| Variante | Style |
|----------|-------|
| `primary` | Fond vert `#10B981`, texte blanc, arrondi `rounded-full` |
| `secondary` | Fond bleu `#0066FF`, texte blanc, arrondi `rounded-full` |
| `outline` | Bordure bleue, texte bleu, fond transparent, arrondi `rounded-full` |
| `ghost` | Transparent, texte `foreground` |

## Composants clés

### Cards
```
fond blanc, rounded-2xl, padding 28-32px
bordure 1px solid #E2E8F0
shadow subtile : shadow-sm
hover : shadow-md + -translate-y-0.5
transition : 200ms ease
```

### Hero
```
texte centré
titres très gras (font-black), taille clamp
séparateur : fine bande colored
```

### Sections
```
alternance bg-white / bg-surface
padding vertical : py-16 md:py-24
max-width : max-w-6xl mx-auto px-4 md:px-8
```

## Règles importantes
- Style : sobre, professionnel, humain, mobile-first
- Ne jamais utiliser le mot **"agence"** (mandataire)
- CTAs : orientés action ("Lancer l'assistant", "Prendre RDV", "Estimer maintenant")
- Inspiration : structure humaine + confiance + CTA (cf. ludovichiart.com)
