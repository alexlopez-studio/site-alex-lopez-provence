# Brand — Charte Graphique iad & Tokens UI

Document de référence officiel pour l'écosystème Alexandre Lopez (Site public, Portails & Outils d'acquisition).

---

## 1. Couleurs Officielles iad (Charte Nationale — Pages 17-18)

| Token CSS | Valeur HEX | Pantone / Réf | Usage | Classe Tailwind |
|-----------|------------|---------------|-------|-----------------|
| `--color-brand` | `#00B4EC` | **PANTONE 2995 C** (C.80 M.0 Y.0 K.0) | Bleu officiel iad : primaire, titres, boutons | `bg-brand`, `text-brand` |
| `--color-coral` | `#EA584A` | **PANTONE 2348 C** (C.0 M.77 Y.68 K.0) | Corail officiel iad : Gélule CTA, accents | `bg-coral`, `text-coral` |
| `--color-brand-hover` | `#008EC3` | **Blue.700** | Hover des boutons bleus officiels | `hover:bg-brand-hover` |
| `--color-brand-light` | `#CDF7FF` / `#E0F0FA` | **Blue.100** | Fonds teintés, badges doux, bloc offre | `bg-brand-light` |
| `--color-foreground` | `#000000` / `#0F172A` | **NOIR** (C.0 M.0 Y.0 K.100) | Texte courant et contrastes | `text-foreground` |
| `--color-surface` | `#F7FAFC` / `#F9F8F4` | **Surface & Alabaster** | Sections alternées, fonds de cartes | `bg-surface` |
| `--color-border` | `#E5E7EB` / `#E2E8F0` | **Gris clair** | Bordures délicates 1px | `border-border` |

### Déclinaisons de Bleu iad (Page 17) :
- `Blue.50` : `#E9FCFF`
- `Blue.100` : `#CDF7FF`
- `Blue.200` : `#95EBFF`
- `Blue.300` : `#5DDEFF`
- `Blue.400` : `#25CFFF`
- `Blue.600` : `#00A1D8`
- `Blue.700` : `#008EC3`
- `Blue.800` : `#007DAF`
- `Blue.900` : `#006B9A`
- `Blue.950` : `#006390`

---

## 2. Typographies Officielles (Pages 19-20)

* **Police de communication officielle** : **`Montserrat`** (Google Fonts)
  * `Montserrat ExtraBold Italic` (tracking `-0.025em` / `-25em`) : Titres principaux `#00B4EC`, mots d'accent en Corail `#EA584A`, texte de la Gélule CTA.
  * `Montserrat Bold Italic` : Sous-titres `#00B4EC`.
  * `Montserrat Regular` : Corps de texte (Noir `#000000`) et mentions légales.
* **Police applicative & dashboards** : `Inter` (Mandat OS) / `Plus Jakarta Sans` (Portail client).
* **Signature manuscrite** : `Buffalo Script` / `Allura` pour le nom "Alexandre Lopez".
* **Typographie éditoriale** : `Playfair Display` (maquette Botanical / Organic).

---

## 3. Éléments Signature & Formes (Pages 22-23)

### La Gélule Corail CTA (Page 22)
* **Forme** : Gélule / Pill (`rounded-full`).
* **Couleur** : **Corail `#EA584A`**.
* **Angle d'inclinaison** : **Inclinée à 10°** (`rotate-[-10deg]` ou `rotate-[10deg]`).
* **Typographie** : `Montserrat ExtraBold Italic` en blanc centré.
* **Règle d'or** : Utilisée une seule fois par page comme appel à l'action signature.

---

## 4. Règles de Vocabulaire & Mentions (Pages 6, 9, 10)

### ✅ À UTILISER STRICTEMENT :
- *"Conseiller en immobilier"* (ou *"Conseiller en immobilier indépendant"*)
- *"Avis de valeur de votre bien offert"* / *"Évaluation de votre bien offerte"*
- *"iad"* (toujours écrit en minuscules dans les textes et communications)
- Téléphone **06 13 18 01 68** toujours en texte HTML pur avec espaces simples (pas de points ni tirets).

### ❌ BANNIR ABSOLUMENT :
- *"Agent immobilier"* (Strictement interdit : mandataire indépendant)
- *"Expert immobilier"*
- *"Estimation offerte"* (utiliser *Avis de valeur offert*)
- *"I@D"* ou *"iad"* en majuscules dans la communication courante (réservé aux actes contractuels).
