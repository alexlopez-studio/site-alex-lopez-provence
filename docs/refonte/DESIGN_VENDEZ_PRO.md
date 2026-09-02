# Guide de Référence Design — Le Master Design du Site Public

> **Statut : RÉFÉRENCE MAÎTRESSE UNIQUE DU SITE PUBLIC.**  
> Fait autorité pour toutes les pages publiques (Accueil, Communes, Guide).  
> Version : 2.0 (Validée Septembre 2026 — Design Maître & Zéro Corail).

---

## 1. Philosophie & Principes Directeurs

Ce document constitue la **référence esthétique et technique absolue** de l'ensemble du site internet. Il tranche radicalement avec les sites d'agences immobilières conventionnels en adoptant une approche **éditoriale haut de gamme, cinématique et épurée** inspirée des meilleures interfaces SaaS et médias de luxe contemporains.

### Les 3 principes fondateurs :
1. **L'aspect « Cartes empilées » (*Stacked Cards*) :** La page ne défile pas comme un ruban continu mais comme une suite de cartes autonomes à angles très arrondis (`border-radius: 2rem`), posées dans un cadre périphérique avec une marge visible.
2. **Le minimalisme typographique :** Une seule famille typographique (*Montserrat*), et quasiment une seule graisse (*Medium 500*), même sur les titres titanesques. Ce choix confère une tonalité éditoriale et institutionnelle plutôt que criarde.
3. **Le contraste cinématique :** Une alternance rigoureuse de 3 couleurs de fond (Bleu profond `#006390`, Gris doux `#F4F4F5`, Blanc pur `#FFFFFF`) complétée par des vidéos immersives en arrière-plan et des effets de verre dépoli (*glassmorphism*).

---

## 2. Système de Design & Tokens Chromatiques

### 2.1 Palette de Couleurs

| Token CSS | Code HEX | Usage exclusif sur la page |
|---|---|---|
| `--brand-deep` | `#006390` | **Couleur maîtresse.** Fond des sections fortes (Hero, Trust, Statistiques, Footer), du menu burger et de la gélule CTA principale. |
| `--brand` | `#00B4EC` | **Bleu primaire iad.** Pastilles des sur-titres clairs, boutons pleins (`.btn-pill.solid`), accent-color des cases RGPD, survol de la gélule CTA. |
| `--brand-light` | `#25CFFF` | **Bleu azur.** Survols interactifs, focus des champs de formulaire, pastille sur fond sombre, guillemets des avis. |
| *(Corail retiré)* | *Supprimé* | **Politique Zéro Corail.** La couleur corail iad `#EA584A` a été totalement bannie du site public pour une identité visuelle épurée et souveraine. |
| `--surface` | `#F4F4F5` | Fond des sections secondaires (Pain points, Sommaire) et fond neutre des cartes. |
| `--background` | `#FFFFFF` | Fond des sections claires de respiration (Approche, Avis) et des modales. |
| `--ink` | `#000000` | Texte principal sombre, icônes et boutons flèches solides. |
| `--ink-soft` | `#717784` | Sous-titres, descriptions secondaires et labels de champs. |
| `--hairline` | `#E5E7EB` | Bordures fines (1px), séparateurs horizontaux des lignes de programme. |

> [!IMPORTANT]
> **Règle des trois fonds :**  
> Le rythme vertical de la page suit scrupuleusement la séquence :  
> **Bleu profond** *(Hero)* → **Gris** *(Pain points)* → **Bleu profond** *(Trust & Expert)* → **Gris** *(Sommaire)* → **Blanc** *(Approche)* → **Bleu profond** *(Statistiques)* → **Blanc** *(Avis)* → **Bleu profond** *(Footer)*.  
> *Deux sections identiques peuvent se succéder exceptionnellement, jamais trois.*

---

### 2.2 Typographie (Montserrat exclusif)

- **Police unique :** `Montserrat`, `sans-serif`
- **Règle des deux graisses :**
  - **`font-weight: 500` (Medium) :** 95% de l'interface (titres géants, sous-titres, boutons, corps de texte, chiffres).
  - **`font-weight: 800` (ExtraBold Italic) :** Exclusivement pour la gélule corail iad (`.iad-gelule`).

#### Échelle typographique et interlettrage :

| Niveau / Rôle | Taille | Casse | Interligne (`line-height`) | Interlettrage (`letter-spacing`) |
|---|---|---|---|---|
| **H1 Hero** | `clamp(2.25rem, 7.5vw, 6.8rem)` | MAJUSCULES | `0.92` (ultra-serré) | `-0.02em` |
| **H2 Manifeste / Trust** | `7vw` à `8.2vw` | MAJUSCULES | `1.02` | `-0.02em` |
| **H2 Sections courantes** | `text-4xl sm:text-5xl` (2.25rem à 3rem) | Normal / Maj début | `1.1` (compact) | `-0.02em` |
| **Accroche Hero (Tagline)** | `2rem` à `2.4rem` | Normal | `0.95` | `-0.02em` |
| **Menu plein écran** | `3rem` à `4.5rem` | Normal | `0.95` | `-0.02em` |
| **Chiffres Statistiques** | `text-5xl sm:text-6xl` (3rem à 3.75rem) | Chiffres | `1.0` | `-0.02em` |
| **Sur-titre (Eyebrow)** | `0.75rem` (`text-xs`) | MAJUSCULES | `1.0` | `+0.22em` (très espacé) |
| **Labels formulaires** | `0.75rem` (`text-xs`) | MAJUSCULES | `1.0` | `+0.18em` |
| **Boutons pilules** | `0.875rem` (`text-sm`) | MAJUSCULES | `1.0` | `+0.05em` |
| **Corps de texte** | `0.875rem` à `1rem` | Normal | `1.6` (aéré) | Standard |

> [!TIP]
> **Règle mnémotechnique :**  
> Tout ce qui est grand est **serré** (`-0.02em`) pour un impact graphique fort.  
> Tout ce qui est petit est en **majuscules et très espacé** (`+0.18em` à `+0.22em`) pour une lisibilité technique irréprochable.

---

### 2.3 Rayons, Ombres & Matériaux de Verre

- **Rayons de courbure (`border-radius`) :**
  - Sections (`--radius-card-lg`) : `2rem` (32px)
  - Cartes de contenu (`--radius-card`) : `1.5rem` (24px)
  - Champs et légendes : `0.75rem` (12px)
  - Boutons et pastilles (`--radius-pill`) : `62.5rem` / `9999px` (forme pilule parfaite)
- **Ratios d'image imposés :**
  - Toutes les cartes visuelles portrait adoptent le ratio d'affiche **`3/4`**.
- **Glassmorphism (Effet dépoli) :**
  - Cartes posées sur vidéo : `background: rgba(255, 255, 255, 0.1)`, bordure `1px solid rgba(255, 255, 255, 0.15)`, `backdrop-filter: blur(12px)`.
  - Légendes flottantes et modales : `background: rgba(17, 24, 39, 0.6)`, `backdrop-filter: blur(8px)`.
- **Courbes d'animation :**
  - Rebond signature (gélule corail & bouton play vidéo) : `cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - Durée standard des transitions d'opacité et de couleur : `0.3s ease`.

---

## 3. Primitives de Composants UI

### 1. L'Eyebrow (`.eyebrow`)
Sur-titre distinctif précédant chaque titre de section, composé d'une pastille ronde animée de 6px (`.dot`) et d'un texte espacé.
- **Variante `.dark` (sur fond clair) :** texte gris `--ink-soft`, pastille bleue `--brand`.
- **Variante `.light` (sur fond sombre) :** texte blanc semi-transparent `rgba(255,255,255,0.7)`, pastille azur `--brand-light`.

### 2. Le Bouton Pilule (`.btn-pill`)
Bouton d'action galbé en pilule, majuscules, padding `0.875rem 1.75rem`, avec icône flèche SVG animée.
- **`.btn-pill.solid` :** Fond bleu officiel `--brand`, texte blanc, hover bleu profond `--brand-deep`.
- **`.btn-pill.light` :** Fond blanc pur, texte bleu profond `--brand-deep`, hover azur `--brand-light`.

### 3. La Gélule d'Action (`.iad-gelule`)
Le composant d'appel à l'action d'impact (Zéro Corail) :
- Couleur de fond : Bleu profond de marque `--brand-deep` (`#006390`).
- Typographie : Montserrat 800 italique, casse normale, taille `1.25rem`.
- Ombre portée diffuse : `0 15px 30px -5px rgba(0, 99, 144, 0.4)`.
- Animation au survol : grossissement `scale(1.05)`, bascule en bleu vif `--brand` (`#00B4EC`) avec rebond élastique `cubic-bezier(0.34, 1.56, 0.64, 1)` et halo lumineux `0 20px 40px -5px rgba(0, 180, 236, 0.5)`.

### 4. Le Bouton Fléché Circulaire (`.btn-arrow`)
Bouton rond de 3.5rem (56px) centré sur une flèche directionnelle SVG.
- **`.outline` :** fond transparent, liseré fin `1px solid var(--hairline)`, hover bordure noire.
- **`.solid` :** fond noir `--ink`, texte blanc, hover bleu profond `--brand-deep`.

### 5. Les Cartes en Verre (`.glass-card`)
Composant d'accroche posé directement au bas du hero vidéo. Rehausse l'interactivité sans occulter le dynamisme de la vidéo d'arrière-plan grâce à sa translucidité contrôlée et son flou d'arrière-plan de 12px.

---

## 4. Découpage et Anatomie Détaillée des Sections

### Section 0 : En-tête & Barre de Navigation (`header.nav-header`)
- **Positionnement :** Absolu, calé au sommet du hero, texte blanc.
- **Gauche :** Liens d'ancrage textuels fluides (*Au Sommaire*, *Mon Approche*) et déclencheur pop-up *Vidéo (1 min)* avec pastille ronde semi-transparente.
- **Centre :** Identité épurée avec icône maison iad et typographie `Alex. Lopez | iad`.
- **Droite :** Bouton texte souligné *Télécharger le guide* + bouton burger minimaliste à 2 barres fines (`.burger-btn`).

---

### Section 1 : Le Hero Cinématique Interactif (`#hero`)
- **Hauteur :** Plein écran adaptatif `calc(100svh - 1rem)` (min-height: 36rem).
- **Fond vidéo à double flux alterné :**
  - Deux balises `<video>` superposées en boucle continue sans coupure :
    1. **Vidéo 1 :** Bastide provençale (`/concept/video-villa.mp4`).
    2. **Vidéo 2 :** Vue aérienne mer & Côte d'Azur (`/concept/video-mer.mp4`).
  - Transition : Dès qu'une vidéo s'achève (`onEnded`), un fondu enchaîné d'1 seconde passe à la seconde vidéo automatiquement.
  - Dégradé sombre protecteur (`#hero-bg-overlay`) garantissant la lisibilité des textes blancs.
- **Portrait détouré d'Alexandre Lopez (`#hero-portrait`) :**
  - Image PNG détourée (`/concept/alexandre-hero.png`) positionnée en surimpression sur la vidéo.
  - Traitement CSS : Ombre projetée puissante (`drop-shadow: 0 20px 40px rgba(0,0,0,0.6)`) et masque dégradé inférieur (`mask-image: linear-gradient`) pour fondre la base du buste sans rupture brutale.
  - Responsivité intelligente :
    - Sur Desktop : Buste calé en bas au centre-droit (hauteur 80% à 88% du hero).
    - Sur Mobile : Portrait réduit et relogé en haut à droite (hauteur 140px à 210px) pour libérer l'espace pour les textes.
- **Typographie H1 :**  
  `VENDEZ`  
  `COMME UN PRO`  
  en typographie titanesque `clamp(2.25rem, 7.5vw, 6.8rem)`.
- **Tagline basse :** *« Sans agence. Sans commission. Le guide 100% gratuit. »*
- **Deux cartes flottantes en verre au bas du Hero :**
  1. *Carte Vidéo de présentation :* Miniature photo avec bouton Play + sous-titre expliquant la méthode en 1 minute.
  2. *Carte Guide Ultime :* Badge *Nouveau*, note 4.9/5 (150+ avis), aperçu miniature 3D du livre et bouton blanc de téléchargement immédiat.

---

### Section 2 : La Réalité du Terrain / Pain Points (`#pain-points`)
- **Fond :** Gris `--surface` (`#F4F4F5`), padding `py-20 px-6 sm:px-10`.
- **En-tête :** Eyebrow *« La réalité du terrain »*, Titre *« Vendre seul paraît idéal. Jusqu'à ce que... »*, description soulignant que près de 70% des vendeurs particuliers abandonnent.
- **Grille de 3 cartes de friction psychologique (`.test-grid`) :**
  - **Carte 01 — Le bien "grillé" :** Erreur d'estimation affective conduisant à brûler l'annonce sur les portails.
  - **Carte 02 — Le défilé des curieux :** Visites chronophages avec des acheteurs non solvables ou sans dossier validé.
  - **Carte 03 — L'anxiété juridique :** Diagnostics, clauses de compromis et risques de rétractation.
  - *Comportement :* Cartes blanches avec surélévation au survol (`hover:-translate-y-2`) et numéros d'étape gris clair géants (`01.`, `02.`, `03.`).
- **Pied de section :** Phrase de synthèse + **la gélule corail iad** centrale (`.iad-gelule`) *« Contactez-moi ! »*.

---

### Section 3 : Le Manifeste & Mot d'Expert (`#trust`)
- **Fond :** Bleu profond `--brand-deep` (`#006390`), padding `6rem 2.5rem`.
- **Haut de section :**
  - À gauche : Macaron circulaire à liseré fin affichant **100%** / *Gratuit & Sans Engagement*.
  - À droite : Carte en verre dépoli avec citation d'Alexandre expliquant pourquoi il offre ce guide sans forcer la main.
- **Typographie de fond géante :**  
  L'expression *« Vendez Comme Un Pro. »* est écrite en lettres géantes (8.2vw) au centre, le mot *« Un »* en blanc pur et les autres en blanc estompé (*ghost* à 50% d'opacité).
- **La carte coach inclinée (`.coach-card`) :**
  - Carte format 3/4 avec portrait d'Alexandre, inclinée à **6° de rotation**.
  - Posée au centre géométrique de la section en Desktop.
  - Bouton Play blanc translucide au centre avec effet rebond au survol qui ouvre la vidéo de présentation.

---

### Section 4 : Au Sommaire du Guide (`#sommaire`)
- **Fond :** Gris `--surface` (`#F4F4F5`), conteneur centré `max-w-7xl`.
- **Titre :** *« Ce que vous allez découvrir »*.
- **Liste interactive des 4 modules (`.program-row`) :**
  1. **01 — Le secret de l'estimation parfaite :** Méthode pour susciter le coup de cœur sans brader.
  2. **02 — L'art de la mise en valeur :** Techniques de home-staging pour viser la fourchette haute.
  3. **03 — Filtrer et convaincre :** Scripts de qualification et qualification financière des acquéreurs.
  4. **04 — Négociation & Sécurisation :** Défense du prix net vendeur et verrouillage notarié.
- **Interactivité :** Chaque ligne s'illumine de blanc au survol (`hover:bg-white/60`) avec une flèche circulaire (`.prog-arrow-circle`) et déclenche l'ouverture de la modale de téléchargement du guide.

---

### Section 5 : Mon Approche / L'Alternative Pro (`#approche`)
- **Fond :** Blanc pur `--background` (`#FFFFFF`).
- **Disposition asymétrique en 2 colonnes (`.fac-grid`) :**
  - **Colonne gauche :** Miniature carrée d'un intérieur d'architecte, titre percutant *« Et si vous aviez besoin d'aide ? »*, et paragraphe expliquant que le guide rend autonome mais qu'Alexandre est disponible si le temps manque.
  - **Colonne droite :** Deux visuels 3/4 en quinconce (décalage vertical de la 2nde carte sur Desktop avec `sm:mb-8`) :
    - *Carte 1 :* Diffusion Puissante (SeLoger, Leboncoin, portails majeurs) avec légende sombre dépolie.
    - *Carte 2 :* Accompagnement Premium (suivi sur-mesure de l'estimation à l'acte authentique) avec légende dépolie bleu iad.

---

### Section 6 : Bilan Chiffré & Statistiques (`#stats`)
- **Fond :** Bleu profond `--brand-deep` (`#006390`), texte blanc.
- **En-tête :** Eyebrow clair *« Mon Bilan »*, Titre *« Un conseiller engagé »*.
- **Grille de 4 compteurs (`.stats-grid`) :**
  - **45+** : Familles accompagnées.
  - **100%** : Avis positifs.
  - **30** : Jours : délai moyen de vente.
  - **1** : Interlocuteur unique dédié.
- **Design :** Liseré supérieur blanc semi-transparent (`border-t border-white/20`), chiffres massifs Montserrat 500 (`text-5xl sm:text-6xl`), libellés discrets en blanc 70%.

---

### Section 7 : Témoignages Clients (`#avis`)
- **Fond :** Blanc pur `--background` (`#FFFFFF`).
- **En-tête :** Eyebrow *« Avis clients »*, Titre *« Ils m'ont fait confiance »*.
- **Grille de 3 cartes de retours d'expérience (`.test-grid`) :**
  - Guillemets géants en bleu azur (`#25CFFF`).
  - Avis 1 : Vendeurs passés de la vente PAP au mandat exclusif vendu en 2 semaines.
  - Avis 2 : Acquéreur saluant l'écoute, la disponibilité et la justesse de l'estimation.
  - Avis 3 : Vendeuse débloquée par la valorisation de son appartement.
  - Signatures avec séparateur fin : Nom des clients et mention de leur qualité (*Vendeurs*, *Acquéreur*).

---

### Section 8 : Pied de Page & Appel Final (`footer#contact`)
- **Fond :** Bleu profond `--brand-deep` (`#006390`), texte blanc.
- **Bandeau CTA supérieur (`.footer-cta`) :**
  - Titre monumental *« Prêt à vendre ? »*.
  - Bouton pilule blanc (`.btn-pill.light`) ouvrant la modale de téléchargement du guide.
- **Colonnes d'informations (`.footer-cols`) en 3 blocs :**
  1. *Identité professionnelle :* Conseiller immobilier indépendant iad France, adresse email directe cliquable.
  2. *Plan de la page :* Liens d'ancrage doux (*Le Sommaire*, *Mon Approche*, *Avis Clients*, *Contact*).
  3. *Réseaux & Mentions :* Liens externes vers le profil LinkedIn, la carte numérique iad France, et liens internes vers les Mentions légales et la Politique de confidentialité.
- **Copyright bas de page :** Mention dynamique avec année en cours.

---

## 5. Modales & Overlays Interactifs

### 5.1 Modale de Téléchargement du Guide (Lead Capture)
- **Déclenchement :** Bouton du header, cartes du hero, lignes du sommaire, CTA du footer.
- **Structure :** Fenêtre modale centrée (max-width: 32rem), fond blanc, coins arrondis `rounded-3xl` (24px).
- **Champs de formulaire :**
  - Nom complet (séparé automatiquement côté API en prénom + nom).
  - Adresse email.
  - Message optionnel sur le projet immobilier.
  - Case à cocher de **consentement RGPD obligatoire** (accentuée en bleu iad `--brand`).
- **Sécurisation & API :** Soumission directe à `/api/guide/download` avec validation des erreurs en rouge corail (`--corail`).
- **Écran de succès :** Pastille verte avec coche animée, message personnalisé avec le prénom saisi et bouton de fermeture.

### 5.2 Modale Lecteur Vidéo (16:9 Cinéma)
- **Déclenchement :** Clic sur la carte vidéo du hero ou la carte coach inclinée de la section Trust.
- **Structure :** Fond obscurci à 90% (`bg-black/90`) avec flou d'arrière-plan, cadre vidéo 16:9 haute définition avec coins arrondis et contrôles natifs de lecture.
- **Comportement :** Lancement automatique de la vidéo à l'ouverture, mise en pause automatique à la fermeture.

### 5.3 Menu Plein Écran Burger
- **Déclenchement :** Clic sur l'icône burger de l'en-tête.
- **Style :** Voile intégral bleu profond (`#006390`), typographie de menu géante (3rem à 4.5rem) avec survol azur `--brand-light`.
- **Fonctionnalité :** Défilement fluide automatique vers la section sélectionnée et fermeture instantanée du menu.

---

## 6. Moteur d'Interaction & Confort de Navigation

1. **Défilement Ultra-Fluide (Smooth Scroll Lenis) :**
   - Intégration native de `lenis` avec un paramétrage optimisé (`duration: 1.2`, `smoothWheel: true`).
   - Verrouillage total du scroll d'arrière-plan (`lenis.stop()` + `overflow: hidden`) dès qu'une modale ou le menu burger est ouvert.
2. **Accessibilité & Raccourcis clavier :**
   - Écoute globale de la touche `Échap` (`Escape`) pour refermer immédiatement toute modale active.
   - Attributs ARIA complets (`role="dialog"`, `aria-modal="true"`, `aria-label`).
3. **Optimisation Mobile First :**
   - Remplacement des flex-rows par des flex-cols sur petits écrans.
   - Adaptation proportionnelle des polices grâce aux unités dynamiques `clamp()` et `vw`.
   - Repositionnement ergonomique du portrait d'Alexandre en haut à droite sur mobile pour éviter de chevaucher le H1.

---

## 7. Portée du document & règle de déclinaison

*Ajouté le 2 septembre 2026. Ce document est l'unique référence design du site.*

### 7.1 La page est gelée

`/vendez-pro` est la référence, **telle qu'elle est**. On n'y ajoute rien, on n'en retire rien,
et on ne la corrige pas au nom d'une charte extérieure. Aucun élément de la charte iad n'est
importé dans cette page ni dans le reste du site : la seule source de vérité visuelle est ce qui
est décrit aux sections 1 à 6 ci-dessus.

*Précision utile pour éviter un malentendu : les codes couleur déjà présents dans la page restent
tels quels. Ce sont les couleurs de la page, elles ne bougent pas.*

### 7.2 La règle de déclinaison — construire une autre page

Pour toute autre page du site — home, page commune, landing du guide, article de blog — on applique
la même grille, sans jamais l'élargir :

1. Choisir le fond de chaque section parmi les **trois autorisés**, en alternant (§2.1).
2. Chaque section : bande arrondie `2rem`, marge `0.75rem`, padding `4-6rem` vertical /
   `1.5rem` → `2.5rem` horizontal.
3. Dans chaque section, toujours cet ordre : **sur-titre → titre → contenu → appel à l'action**.
4. Deux graisses seulement : 500 partout, 800 pour la seule gélule.
5. Un seul appel à l'action principal par page — **le guide**.
6. Aucun token, aucune taille, aucune ombre, aucune courbe d'animation en dehors de ce document.

> **Si un besoin ne rentre pas dans cette grille, on ne modifie pas la grille : on reformule le
> besoin.**

### 7.3 Point de vigilance — les chiffres affichés

La page annonce **45+ familles accompagnées**, **100% d'avis positifs**, **30 jours de délai moyen**,
et sur la carte du hero **4,9/5 sur 150+ avis**. Cette page devient la page d'accueil du site : ces
chiffres doivent être vérifiables avant mise en ligne, la page `/avis` étant vide à ce jour.
C'est le seul point de contenu à revoir — il ne concerne pas le design.

---

## 8. Moteur d'Animation et de Physique d'« Untitled » (Obligatoire sur tout le site)

> [!IMPORTANT]
> **Le fichier prototype `Downloads/untitled/index.html` est l'étalon absolu de la physique et des animations.**  
> Aucune page du site public ne doit être livrée en HTML statique sans son moteur d'animations physiques. Chaque page doit partager les mêmes comportements interactifs, fluides et vivants :

### 8.1 Les 5 Piliers du Moteur Physique d'Untitled

1. **Le Smooth Scroll Lenis (`new Lenis({ smoothWheel: true })`) :**
   - Défilement inertiel doux synchronisé sur la boucle principale `requestAnimationFrame`.
   - Les liens d'ancrage internes `#...` défilent via `lenis.scrollTo(target, { offset: -20 })`.

2. **Le Moteur à Ressorts (*Spring Engine*) :**
   - Moteur custom de calcul physique calculé par sous-étapes numériques (`sdt = dt / 2`) pour éviter toute instabilité :  
     `vel += (-tension * (val - target) - friction * vel) * sdt; val += vel * sdt;`
   - Supporte les translations (`x`, `y`), l'échelle (`scale`), la rotation (`rotate`) et l'opacité (`opacity`).
   - Fournit `setSpring(obj, prop, target, tension, friction)` et `setSpringImmediate(obj, prop, val)`.

3. **Les Révélations d'Apparition au Scroll (*Inview Reveals*) :**
   - Tout élément interactif (carte, statistique, bloc de texte, carte témoignage, portrait) porte la classe `.inview-node` et un attribut `data-inview` :  
     `data-inview="y:35,scale:0.96,opacity:0,delay:100,t:170,f:26"`
   - À l'entrée dans le viewport (`IntersectionObserver`, `threshold: 0.1`), un ressort physique anime l'élément vers sa position finale (`y: 0, scale: 1, opacity: 1`).

4. **Les Révélations Textuelles sous Masque (*Clip-Mask Reveals*) :**
   - Les titres majeurs (H1, H2) sont encapsulés dans un conteneur masqué `.clip-mask` (overflow hidden) avec un élément intérieur `.inner`.
   - L'élément intérieur passe de `translateY(115%)` à `translateY(0%)` avec un easing `easeOutExpo` staggéré sur chaque ligne.

5. **La Physique de Survol Desktop (*Desktop Hover Physics*) :**
   - `.hover-scale-card` : Zoom élastique doux à `scale(1.03)` au survol, retour à `scale(1)`.
   - `.hover-lift` : Élévation verticale `translateY(-8px)` avec tension 300 / friction 22.
   - `.btn-pill` : Déplacement latéral de la flèche SVG de `5px` au survol (`x: 5, tension: 320, friction: 20`).
   - `.btn-arrow` : Grossissement de l'icône à `scale(1.15)`.
   - `.hover-arrow-row` : Flèche glissant de `8px` avec montée d'opacité.

