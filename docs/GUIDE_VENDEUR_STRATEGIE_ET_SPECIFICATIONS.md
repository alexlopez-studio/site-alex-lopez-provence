# Spécifications & Mémoire Stratégique : Landing Page & Guide Vendeur Particulier

> **Date d'ancrage :** 3 Septembre 2026  
> **Auteur :** Alexandre Lopez & Codex  
> **Périmètre :** Landing page officielle `/guide-vendeur` et Visualiseur de consultation `/guide-vendeur/consulter` (avec redirection 301 automatique depuis `/vendre-sans-agence`)  
> **Branche de travail :** `preview`

---

## 1. Vision & Positionnement

* **Cible :** Propriétaires vendeurs en Provence & Côte d'Azur (segment prioritaire 400 k€ à 1,5 M€).
* **Proposition de valeur :** Apporter un protocole professionnel transparent, rigoureux et 100% offert pour réussir sa vente entre particuliers sans commettre d'erreurs coûteuses.
* **Tonalité de marque :** *Quiet Luxury*, artisanat d'exception, rigueur notariale, transparence déontologique, aucune agressivité commerciale ni jargon négatif.
* **Stratégie Nurturing :** Le téléchargement du livret initie une séquence d'emails à forte valeur ajoutée (conseils marché, repères de vente) avec désinscription en 1 clic. Les termes anxiogènes (*« harcèlement »*, *« appels commerciaux »*, *« démarchage intrusif »*) sont formellement bannis de la landing page et de la FAQ.

---

## 2. La Landing Page `/guide-vendeur` (Spécifications Validées)

### A. Le Header & Sticky Navigation
* **Header initial (dans le Hero) :** Deux ancres percutantes (`Les 3 Difficultés`, `La Méthode`), logo AL et bouton d'action *« Recevoir le guide »*. Aucune navigation externe pour éviter les fuites de trafic.
* **Sticky Header au scroll (Capsule en Verre Poli) :**
  * Se déclenche dès que l'on quitte le Hero (`scrollY > 420px`).
  * Finition verre dépoli `bg-white/82 backdrop-blur-md` avec biseau supérieur satiné et ombre subtile bleutée.
  * Maintien stable (sans rétraction en second temps pour une lisibilité calme et sereine).
  * Logo AL, navigation par ancres directes (`Les 3 Difficultés`, `La Méthode`).
  * Bouton d'action directe bleu marque `#006390` : *« Recevoir le guide »* équipé d'une micro-pastille cyan pulsante (`animate-ping`).

### B. Le Hero Section
* **Titre H1 :**  
  `PARTICULIER,`  
  `COMMENT VENDRE VOTRE BIEN ?` *(avec « Votre Bien ? » en cyan `#25cfff`)*.
* **Promesse & Sous-titre :** Le guide pratique complet et 100% offert pour réussir votre vente en Provence & Côte d'Azur.
* **Bouton CTA principal :** Forme pilule blanche contrastée, micro-bulle cyan pulsante, libellé *« Recevoir le guide »*.
* **Réassurances intégrées :**
  * `100% Offert · Sans engagement`
  * `Lecture simple & claire`
* **Visuel Hero (Modélisation 3D du Livre) :**
  * Véritable livre 3D physique avec perspective 1200px, dos toilé ivoire avec reliure verticale dorée : `2026 · Particulier, Comment Vendre Votre Bien ? · Alexandre Lopez`.
  * Tranche de pages empilées réaliste et ombre portée douce.
  * Couverture : photo haute définition fusionnant Bastide provençale en pierres sèches et mer Méditerranée turquoise avec pins parasols (`/images/guide/provence-cote-dazur-cover.jpg`).
  * Titre du livre strictement identique au Hero : `PARTICULIER, COMMENT VENDRE VOTRE BIEN ?`.
  * Animation calme et stable (angle isométrique 3/4 sans oscillation continue, micro-lift satiné au survol).

### C. Le Diagnostic des 3 Réalités du Terrain (`#realites`)
* **Titre de section :** *« Ce qui fait échouer ou ralentir une vente entre particuliers : 3 difficultés qui coûtent du temps, de l’énergie et de l’argent »*.
3 cartes au format direct, aéré, sans tiroir coulissant ni accordéon :
1. **La mauvaise fixation du prix (La Fixation du Prix) :**
   * *L’estimation au feeling :* Se fier aux prix affichés en vitrine plutôt qu’aux actes notariés réellement signés.
   * *Le premier mois gaspillé :* Zéro appel sérieux lors des 30 premiers jours, pourtant cruciaux pour créer l’engouement.
   * *L’annonce grillée :* Le bien stagne sur les portails et finit par être bradé dans l’urgence.
2. **Photos insuffisantes et annonce mal rédigée :**
   * *Photos sombres ou insuffisantes :* Angles maladroits qui rétrécissent les pièces au lieu de révéler les volumes.
   * *Le zapping en 3 secondes :* Sur smartphone, 9 acheteurs qualifiés sur 10 passent au bien suivant.
   * *Une annonce noyée dans la masse :* Un texte purement technique sans émotion ni coup de cœur.
3. **Acheteurs non qualifiés et visites sans filtre :**
   * *Intrusion dans l’intimité :* Faire entrer de parfaits inconnus chez soi sans vérifier leur identité.
   * *Le défilé de promeneurs :* Visiteurs sans budget vérifié, ni accord bancaire, ni projet mûr.
   * *Visites mal exécutées :* S’épuiser à bloquer ses week-ends pour des visites sans issue.

### D. Passerelle, Sommaire & Formulaire Final
* Passerelle engageante : *« Envie de surmonter chacune de ces difficultés ? Découvrez les méthodes détaillées dans votre livret offert »*.
* Sommaire interactif présentant les grands modules du guide.
* Formulaire express de téléchargement final (Prénom + Email).

---

## 3. Page d'Atterrissage Réseaux Sociaux (`/bio`)

Conçue comme une alternative *Quiet Luxury* propriétaire à Linktree :
* **URL officielle :** `/bio`
* **Identité :** Avatar officiel, statut vert pulsant, badge de vérification officiel.
* **Lead Magnet :** Carte vedette blanche contrastée redirigeant vers `/guide-vendeur`.
* **Immobilier & Business :** Lien direct vers les annonces et la vitrine iad.
* **Carte de visite virtuelle :** Téléchargement instantané vCard (`.vcf`) via `/api/vcard`.
* **Actions directes :** Téléphone en 1 clic, WhatsApp direct, Email direct.
* **Réseaux sociaux :** Instagram (`@alexandrelopez_iad`), LinkedIn, Facebook.
* **Réassurance :** Note Google 5.0 étoiles.

---

## 4. Le Sommaire Officiel & Définitif du Guide (V2)

### **Préambule · Le Manifeste d’Alexandre Lopez (Pages 1 à 6)**
* **Page 01 · Couverture Officielle :** `Particulier, Comment Vendre Votre Bien ?` (Auteur : Alexandre Lopez).
* **Page 02 · Témoignage d'ouverture :** Pleine page sur la sérénité d'une vente maîtrisée au juste prix.
* **Page 03 · L’Édito d'autorité :**
  * L'enjeu patrimonial majeur (une maison n'est pas un bien de consommation courante).
  * La méthode vs l'improvisation : pourquoi 70% des vendeurs sans protocole échouent ou bradent leur bien.
  * La transparence absolue : le partage sans filtre des méthodes de terrain d'Alexandre Lopez.
  * Le contrat d'exigence avec le lecteur (45 minutes de lecture rigoureuse).
* **Page 04 · Auto-évaluation :** Les 3 questions essentielles (Temps 40-60h, Outils marketing digitaux, Neutralité en négociation).
* **Page 05 · Statistiques du marché :** Les 4 réalités chiffrées de la vente PAP (-6% à -9% de décote, délai +19j, casse-tête juridique, 70% délèguent).
* **Page 06 · Pros & Cons :** Tableau lucide des avantages et des exigences de la vente en direct.

---

### **Chapitre 01 · Penser son Projet dans sa Globalité (Vente ➔ Achat)**
* Le dilemme classique : *Vendre d’abord ou acheter d’abord ?*
* La synchronisation des calendriers : la vente longue (délai de 4 à 6 mois entre compromis et acte) et la convention d'occupation temporaire.
* Le calcul du capital net vendeur réinvestissable *(Prix de vente − capital restant dû − mainlevée d'hypothèque − frais de notaire de la future acquisition)*.
* **Point fiscalité obligatoire :** Résidence principale *(exonération à 100%)* vs Résidence secondaire / locative *(calcul préalable de la plus-value avec le notaire pour éviter les mauvaises surprises)*.

---

### **Chapitre 02 · Le Dossier Juridique & Technique Préalable**
* **La checklist des pièces indispensables avant toute annonce :**
  * Titre de propriété complet et dernière taxe foncière.
  * Factures des travaux majeurs, assurances décennales et conformité d'urbanisme délivrée par la mairie (DAACT).
  * Assainissement : conformité tout-à-l'égout ou diagnostic SPANC obligatoire de moins de 3 ans pour fosse septique.
  * Dossier de Diagnostic Technique (DDT complet : DPE, amiante, plomb, électricité, gaz, termites/ERP).
  * **Actualité réglementaire :** Audit Énergétique Réglementaire obligatoire si la maison est classée F ou G au DPE.
  * Si copropriété ou lotissement : les 3 derniers PV d'AG, le carnet d'entretien et le pré-état daté.

---

### **Chapitre 03 · L'Estimation au Juste Prix & la Boîte à Outils**
* Les risques symétriques : surévaluer *(brûler son bien sur les portails)* vs sous-évaluer *(perte sèche)*.
* La méthode comparative rigoureuse basée sur les actes authentiques récents.
* **Les meilleurs outils d'accès public détaillés :**
  * **DVF (app.dvf.etalab.gouv.fr) :** Comment explorer les vraies ventes signées dans son voisinage.
  * **Cadastre.gouv.fr & Géoportail :** Limites parcellaires réelles, servitudes et zonages PLU.
* Pourquoi les simulateurs d’estimation en ligne automatisés se trompent de 10% à 20% sur les biens en Provence.

---

### **Chapitre 04 · Valorisation, Diffusion & l’IA Commerciale**
* Préparation des lieux : désencombrement d'un tiers du mobilier, home staging sans frais et soigner le curb appeal.
* Photographie : lumière naturelle, Golden Hour, prises de vue en grand angle raisonné à hauteur d'yeux.
* **L’IA au service de votre vente (avec parcimonie & éthique) :**
  * Sublimer la lumière naturelle et le ciel provençal sans altérer la façade.
  * Virtual Staging pour projeter les volumes des pièces vides.
  * Rédaction assistée d'accroches immersives (méthode AIDA).
  * *La ligne rouge légale :* Interdiction formelle de gommer un défaut visible ou juridique (risque de litige pour dol et vice caché).
* Canaux de diffusion (Leboncoin, PAP, bouche-à-oreille local) et **gestion du raz-de-marée des appels d’agences les premières 48h**.

---

### **Chapitre 05 · Qualification des Acheteurs & Sécurité des Visites**
* **Le filtrage téléphonique en 4 questions indispensables :**
  1. *Timing & motivation :* Horizon d'emménagement et état de la recherche.
  2. *Financement :* Exigence d'une attestation de faisabilité financière de moins de 30 jours (banque ou courtier).
  3. *Situation :* Locataire ou bien à vendre en préalable ?
  4. *Décisionnaires :* Présence de l'ensemble des décisionnaires lors de la visite.
* Conduire la visite avec recul : laisser l'acheteur respirer en silence, mettre à disposition le classeur vendeur.
* Sécurité du domicile : mise à l'abri des bijoux, clés, cartes grises et vérification de l'identité des visiteurs.

---

### **Chapitre 06 · Négociation, Offres & Notaire**
* Anatomie d’une offre d’achat écrite conforme (prix formalisé, plan de financement, validité stricte 48-72h).
* Répondre à une offre basse : la contre-proposition écrite argumentée.
* Le piège de l’acquéreur qui doit vendre son bien en amont (comment encadrer cette condition suspensive).
* **Le parcours notarié sans accroc :**
  * L'intérêt de faire intervenir son propre notaire (sans surcoût légal).
  * Compromis de vente, versement du séquestre (5% à 10%) et purge du délai SRU (10 jours).
  * La chronologie des 3 mois (instruction prêt, DIA mairie, offre de prêt, appel de fonds).
  * La remise des clés le jour de l'acte authentique : relevé contradictoire des compteurs eau/élec et transmission des dossiers.

---

### **Chapitre 07 · L’Alternative de la Délégation Sérénité**
* Bilan objectif de la charge mentale d’une vente en direct (40 à 60 heures de travail effectif).
* Tableau comparatif transparent : *Vendre seul vs Déléguer avec mandat d'exigence Alexandre Lopez*.
* L'approche sur-mesure d'Alexandre Lopez en Provence & Côte d'Azur (reportage photo d'architecte, espace client 7j/7, négociation experte).
* Carnet d’adresses et coordonnées directes.

---

## 4. Méthodologie d'Implémentation du Guide

1. **Sauvegarde V1 intouchable :** L'ancienne version est archivée dans `GuidePagesDataV1.ts` et consultable via le bouton `[ V1 (Archive) ]` sur `/guide-vendeur`.
2. **Travail pas à pas :** Rédaction et mise en page chapitre par chapitre dans `GuidePagesData.ts` (V2), avec validation explicite d'Alexandre à chaque étape.
3. **Synchronisation finale :** Mise à jour du composant de sommaire sur la landing page `/vendre-sans-agence` une fois le guide entièrement validé.
