export type PageLayoutType =
  | 'cover_bedroom'
  | 'testimonial_dark_card'
  | 'welcome_phone'
  | 'ask_yourself_badge'
  | 'consider_this_badge'
  | 'pros_and_cons_2col'
  | 'stage_divider'
  | 'split_half_photo'
  | 'black_badges_list'
  | 'black_badges_bottom_photo'
  | 'black_badges_side_photo'
  | 'staging_vs_comparison'
  | 'two_column_photo_top'
  | 'three_column_black_banner'
  | 'cma_vs_appraisal'
  | 'photography_before_after'
  | 'standard_article_photo'
  | 'backcover_dark'

export interface GuidePageData {
  pageNumber: number
  moduleNumber: number
  moduleTitle: string
  layoutType: PageLayoutType
  stageNumber?: string
  badgeText?: string
  title: string
  subtitle?: string
  heroImage?: string
  secondaryImage?: string
  paragraphs?: string[]
  itemsWithBadges?: { badge: string; text: string }[]
  numberedItems?: { number: string; title: string; text: string }[]
  prosCons?: { pros: string[]; cons: string[] }
  threeColumns?: { number: string; title: string; text: string }[]
  bannerBox?: { title: string; text: string }
  quoteCard?: { stars: number; text: string; author: string }
  footerNote?: string
  footerConditions?: { yesText: string; noText: string }
  beforeAfter?: { beforeLabel: string; beforeImg: string; afterLabel: string; afterImg: string }
  twoColumnsText?: { col1: string[]; col2: string[] }
  checklistItems?: { id: string; label: string; note?: string }[]
}

export const GUIDE_MODULES = [
  { number: 1, title: 'Penser son Projet (Vente ➔ Achat)', pages: '7 - 11' },
  { number: 2, title: 'Dossier Juridique & Technique', pages: '12 - 16' },
  { number: 3, title: 'L’Estimation au Juste Prix', pages: '17 - 21' },
  { number: 4, title: 'Valorisation, Diffusion & IA', pages: '22 - 27' },
  { number: 5, title: 'Qualification & Visites', pages: '28 - 31' },
  { number: 6, title: 'Négociation, Offres & Notaire', pages: '32 - 35' },
  { number: 7, title: 'Délégation & Sérénité', pages: '36 - 41' },
]

export const GUIDE_PAGES: GuidePageData[] = [
  // ─── PAGE 1 : COVER (Particulier, Comment Vendre Votre Bien ?) ───
  {
    pageNumber: 1,
    moduleNumber: 0,
    moduleTitle: 'Couverture',
    layoutType: 'cover_bedroom',
    title: 'Particulier, Comment Vendre Votre Bien ?',
    subtitle: 'Le guide complet pour réussir votre vente entre particuliers en Provence & Côte d’Azur',
    heroImage: '/images/guide/provence-cote-dazur-cover.jpg',
  },

  // ─── PAGE 2 : TÉMOIGNAGE D'OUVERTURE (Pleine Page Sérénité) ───
  {
    pageNumber: 2,
    moduleNumber: 0,
    moduleTitle: 'Témoignage',
    layoutType: 'testimonial_dark_card',
    title: 'Témoignage d’Ouverture',
    heroImage: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85',
    quoteCard: {
      stars: 5,
      text: '« Vendre notre maison n’était pas une simple transaction, c’était quinze ans de souvenirs de famille. Ce qui a tout changé, c’est d’avoir suivi une méthode rigoureuse et factuelle : cela nous a permis de préserver notre valeur, d’éviter les pièges et de signer au juste prix en totale sérénité. »',
      author: 'M. & MME CHAUVIN — PROPRIÉTAIRES EN PROVENCE',
    },
  },

  // ─── PAGE 3 : L’ÉDITO D'AUTORITÉ D'ALEXANDRE LOPEZ ───
  {
    pageNumber: 3,
    moduleNumber: 0,
    moduleTitle: 'Introduction',
    layoutType: 'welcome_phone',
    title: 'Édito d’Autorité',
    subtitle: 'Pourquoi j’ai choisi de vous transmettre l’intégralité de mes méthodes',
    paragraphs: [
      'Votre maison n’est pas un bien de consommation courante. C’est le fruit d’années d’efforts, un lieu de vie chargé d’émotion et, très souvent, l’actif le plus précieux de votre patrimoine familial. Pourtant, chaque année en France, 70% des propriétaires qui tentent de vendre seuls sans protocole finissent par abandonner ou brader leur bien.',
      'Ce n’est pas un manque d’enthousiasme : c’est le piège de l’improvisation. Entre l’estimation au feeling, l’usure de l’annonce sur les portails, le défilé de curieux non solvables et l’extrême complexité juridique, une vente immobilière exige une rigueur méthodique absolue.',
      'Beaucoup de professionnels gardent jalousement leurs secrets. Ce n’est pas ma vision. Je crois qu’un propriétaire éclairé prend de bien meilleures décisions. Dans ce livret, je partage avec vous, en toute transparence et sans filtre, les protocoles exacts que j’applique sur le terrain en Provence & Côte d’Azur.',
      'Mon seul contrat d’exigence avec vous : accordez à ces pages 45 minutes de lecture attentive. C’est l’investissement le plus rentable de votre projet pour aborder votre vente avec lucidité, maîtrise et souveraineté.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  },

  // ─── PAGE 4 : AUTO-ÉVALUATION (3 QUESTIONS ESSENTIELLES) ───
  {
    pageNumber: 4,
    moduleNumber: 0,
    moduleTitle: 'Auto-Évaluation',
    layoutType: 'ask_yourself_badge',
    badgeText: 'AUTO-ÉVALUATION',
    title: 'Posez-vous ces 3 questions essentielles',
    subtitle: 'AVANT D’ALLER PLUS LOIN ET DE VOUS LANCER DANS CETTE AVENTURE, PRENEZ QUELQUES MINUTES POUR RÉPONDRE EN TOUTE FRANCHISE.',
    numberedItems: [
      {
        number: '01',
        title: 'Avez-vous la disponibilité mentale et le temps nécessaire ?',
        text: 'Gérer une vente entre particuliers exige 40 à 60 heures de travail effectif : répondre aux appels à toute heure, organiser les visites le week-end et gérer les formalités administratives du plus important actif de votre vie.',
      },
      {
        number: '02',
        title: 'Maîtrisez-vous les outils digitaux et le marketing visuel ?',
        text: 'Aujourd’hui, 95% des acquéreurs effectuent leur premier tri sur écran. Savez-vous mettre en valeur votre bien comme un magazine d’architecture pour capter les acheteurs les plus solvables ?',
      },
      {
        number: '03',
        title: 'Êtes-vous prêt à négocier face à des acheteurs exigeants ?',
        text: 'Les acquéreurs en direct négocient souvent avec insistance en pointant chaque imperfection. Serez-vous capable de filtrer leur solvabilité bancaire et de défendre votre prix sans laisser parler vos émotions ?',
      },
    ],
    footerConditions: {
      yesText: 'Si vous avez répondu OUI à chacune de ces 3 questions : parfait ! Passez directement au CHAPITRE 1.',
      noText: 'Si vous avez répondu NON à l’une de ces questions : prenez le temps d’étudier attentivement les 4 repères de la page suivante.',
    },
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 5 : REPÈRES DU MARCHÉ (4 STATISTIQUES RÉELLES) ───
  {
    pageNumber: 5,
    moduleNumber: 0,
    moduleTitle: 'Statistiques',
    layoutType: 'consider_this_badge',
    badgeText: 'REPÈRES DE MARCHÉ',
    title: '4 Réalités Chiffrées du Marché PAP',
    subtitle: 'SI VOUS HÉSITEZ ENCORE, ANALYSEZ CES 4 DONNÉES CLÉS CONSTATÉES SUR LE MARCHÉ IMMOBILIER :',
    numberedItems: [
      {
        number: '01',
        title: 'Un écart moyen de prix constaté de 6% à 9%',
        text: 'Les études notariales et analyses de terrain démontrent qu’un bien vendu en direct sans concurrence organisée subit une négociation plus agressive faute d’arguments comparatifs factuels.',
      },
      {
        number: '02',
        title: 'L’usure de l’annonce : le piège des 30 premiers jours',
        text: 'Sur les portails de diffusion, l’attractivité maximale se joue le premier mois. Un bien mal positionné qui stagne perd son effet de nouveauté et attire des propositions d’achat très décotées.',
      },
      {
        number: '03',
        title: 'Le dossier juridique et technique : 1ère cause de retard',
        text: 'DPE, assainissement collectif ou autonome, conformité d’urbanisme, servitudes : la rigueur documentaire représente le motif principal d’échec ou de blocage lors du compromis notarié.',
      },
      {
        number: '04',
        title: '70% des vendeurs sans méthode finissent par déléguer',
        text: 'Face à l’usure des visites non qualifiées, aux curieux du dimanche et aux désistements de prêt tardifs, plus de deux tiers des propriétaires se tournent finalement vers un accompagnement.',
      },
    ],
    footerNote:
      'Vendre son bien immobilier sans intermédiaire en Provence peut être une démarche gratifiante si vous appliquez une méthode rigoureuse. Vous conservez la maîtrise directe de votre calendrier et préservez votre capital financier.\n\nEn revanche, l’absence de filtre acheteur, les erreurs d’estimation initiale et la négociation affective conduisent trop souvent au blocage ou à des décotes lourdes. Ce guide a été conçu pour vous apporter tous les outils d’un professionnel.',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 6 : ATOUTS & EXIGENCES (PROS & CONS) ───
  {
    pageNumber: 6,
    moduleNumber: 0,
    moduleTitle: 'Avantages & Inconvénients',
    layoutType: 'pros_and_cons_2col',
    title: 'Pros & Cons',
    subtitle: 'OF SELLING ON YOUR OWN HOME',
    prosCons: {
      pros: [
        'Économie théorique des honoraires d’agence, préservant ainsi une marge financière sur le papier.',
        'Contrôle total sur l’ensemble du processus : calendrier des visites, choix des horaires et des supports.',
        'Vous êtes le meilleur connaisseur intime de votre lieu : son histoire, chaque saison et son art de vivre.',
        'Satisfaction personnelle et fierté légitime d’avoir mené à bien une transaction patrimoniale majeure par vous-même.',
      ],
      cons: [
        'Exposition à des acheteurs non solvables qui n’ont pas fait valider formellement leur capacité d’emprunt bancaire.',
        'Charge mentale élevée : gestion des appels à toute heure, annulations de dernière minute et week-ends bloqués.',
        'Difficulté naturelle à garder une neutralité affective lors de la négociation face à des critiques touchant votre foyer.',
        'Risque majeur de « brûler l’annonce » sur les portails si le prix de lancement est déconnecté de la réalité DVF.',
      ],
    },
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 7 : CHAPITRE 01 DIVIDER (Penser son Projet dans sa Globalité) ───
  {
    pageNumber: 7,
    moduleNumber: 1,
    moduleTitle: 'Penser son Projet',
    layoutType: 'stage_divider',
    stageNumber: 'CHAPITRE 01',
    title: 'Penser son Projet dans sa Globalité',
    subtitle: 'La réussite d’une vente commence par la maîtrise sereine de l’après.',
    paragraphs: [
      'Vendre une maison en Provence n’est presque jamais un acte isolé. C’est le pivot central d’une nouvelle trajectoire de vie : acquisition d’un nouveau bien, installation en village, retraite ou rapprochement familial.',
      'Aborder la mise en vente sans avoir synchronisé les calendriers et le capital financier avec votre future acquisition est la première cause de stress, de double déménagement et de décisions prises dans l’urgence.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
  },

  // ─── PAGE 8 : LE DILEMME FONDAMENTAL (Vendre ou Acheter d'abord ?) ───
  {
    pageNumber: 8,
    moduleNumber: 1,
    moduleTitle: 'Penser son Projet',
    layoutType: 'two_column_photo_top',
    title: 'VENDRE OU ACHETER D’ABORD ?',
    subtitle: 'ARBITRER ENTRE SÉCURITÉ FINANCIÈRE ET SÉRÉNITÉ DU RELOGEMENT',
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    twoColumnsText: {
      col1: [
        'ACHETER AVANT DE VENDRE : Le mirage du coup de cœur. Cette option nécessite un prêt relais dont les taux d’intérêt pèsent lourdement sur le budget familial.',
        'La banque accorde 12 à 24 mois maximum. Au fil des mois sans acheteur, la pression psychologique devient intenable, obligeant souvent à brader son bien dans l’urgence pour solder le crédit.',
      ],
      col2: [
        'VENDRE AVANT D’ACHETER : La sécurité financière absolue. Vous connaissez votre budget d’acquisition au centime près et négociez votre futur bien en position de force, sans clause suspensive de vente.',
        'L’appréhension du « où vais-je habiter entre les deux ? » se désamorce très simplement grâce aux deux dispositifs juridiques présentés en page suivante.',
      ],
    },
  },

  // ─── PAGE 9 : SYNCHRONISATION DES CALENDRIERS (Vente Longue & Occupation) ───
  {
    pageNumber: 9,
    moduleNumber: 1,
    moduleTitle: 'Penser son Projet',
    layoutType: 'black_badges_list',
    title: 'Synchronisation des Calendriers',
    subtitle: 'LES LEVIERS JURIDIQUES POUR ÉVITER LE DOUBLE DÉMÉNAGEMENT',
    itemsWithBadges: [
      {
        badge: 'LA VENTE LONGUE (4 À 6 MOIS)',
        text: 'Négociez dès l’offre un délai prolongé entre le compromis et l’acte authentique (au lieu des 3 mois habituels). Cela vous offre le temps nécessaire pour visiter, faire une offre et synchroniser votre futur achat.',
      },
      {
        badge: 'CONVENTION D’OCCUPATION',
        text: 'Insérez une convention d’occupation précaire dans l’acte authentique : vous touchez l’intégralité des fonds de la vente le jour J tout en restant dans les lieux 2 à 4 semaines moyennant indemnité séquestrée.',
      },
      {
        badge: 'CLAUSE SUSPENSIVE D’ACHAT',
        text: 'En cas de chaîne de transactions, le notaire peut encadrer la date limite de libération des lieux pour faire coïncider les deux actes le même jour dans la même étude notariale.',
      },
      {
        badge: 'ÉVITER LE GARDE-MEUBLE',
        text: 'Une planification rigoureuse dès le premier jour de mise en vente permet d’éviter les coûts et la fatigue d’un déménagement temporaire et la location d’un box de stockage.',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 10 : CALCUL DU CAPITAL NET VENDEUR RÉINVESTISSABLE ───
  {
    pageNumber: 10,
    moduleNumber: 1,
    moduleTitle: 'Penser son Projet',
    layoutType: 'three_column_black_banner',
    title: 'Le Capital Net Réinvestissable',
    subtitle: 'CALCULER VOTRE CAPACITÉ DE RÉINVESTISSEMENT AU CENTIME PRÈS',
    threeColumns: [
      {
        number: '01',
        title: 'CAPITAL RESTANT DÛ',
        text: 'Le solde de votre prêt immobilier en cours auprès de votre banque, augmenté des éventuelles indemnités de remboursement anticipé (IRA, légalement plafonnées à 3% du capital ou 6 mois d’intérêts).',
      },
      {
        number: '02',
        title: 'MAINLEVÉE D’HYPOTHÈQUE',
        text: 'Si votre bien est garanti par une hypothèque ou un PPD, prévoyez environ 0,3% à 0,5% du montant initial du crédit pour radier l’inscription au service de publicité foncière.',
      },
      {
        number: '03',
        title: 'IMPÔT SUR LA PLUS-VALUE',
        text: 'Si le bien vendu n’est pas votre résidence principale, l’impôt sur la plus-value et les prélèvements sociaux sont directement calculés et retenus à la source par le notaire le jour de la signature finale.',
      },
    ],
    bannerBox: {
      title: 'LA FORMULE DU CAPITAL RÉINVESTISSABLE RÉEL',
      text: 'Prix de vente acte − Remboursement crédit − Mainlevée − Coûts diagnostics − Fiscalité = Votre apport cash réel. Sur votre future acquisition, n’oubliez jamais d’anticiper environ 7% à 8% de frais d’acte notarié.',
    },
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 11 : CADRAGE FISCAL OBLIGATOIRE (RP vs Secondaire) ───
  {
    pageNumber: 11,
    moduleNumber: 1,
    moduleTitle: 'Penser son Projet',
    layoutType: 'black_badges_bottom_photo',
    title: 'Cadrage Fiscal : RP vs Secondaire',
    subtitle: 'ANTICIPER LA PLUS-VALUE POUR ÉVITER LES MAUVAISES SURPRISES',
    itemsWithBadges: [
      {
        badge: 'RÉSIDENCE PRINCIPALE',
        text: 'Exonération totale à 100% d’impôt sur le revenu et de prélèvements sociaux. Condition : occupation effective au moment de la vente (délai normal d’inoccupation admis généralement fixé à 1 an max).',
      },
      {
        badge: 'RÉSIDENCE SECONDAIRE',
        text: 'Taxation globale de 36,2% (19% IR + 17,2% prélèvements sociaux). L’exonération totale d’IR n’intervient qu’après 22 ans de détention, et 30 ans pour les prélèvements sociaux.',
      },
      {
        badge: 'DÉDUCTION DES TRAVAUX',
        text: 'Vous pouvez majorer le prix d’achat du montant des travaux réels réalisés par des entreprises qualifiées (factures avec fourniture et pose), ou appliquer le forfait fiscal de 15% après 5 ans de détention.',
      },
      {
        badge: 'SIMULATION NOTARIÉE PRÉALABLE',
        text: 'Règle d’or : demandez à votre notaire de calculer le montant exact de la plus-value AVANT de fixer votre prix pour ne pas découvrir une retenue de 30 000 € à 60 000 € le jour de la signature.',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 12 : LA MISE EN VALEUR DES VOLUMES ───
  {
    pageNumber: 12,
    moduleNumber: 1,
    moduleTitle: 'Préparation du Bien',
    layoutType: 'staging_vs_comparison',
    title: 'La mise en valeur des volumes',
    subtitle: 'L’IMPACT DU HOME STAGING SUR LE COUP DE CŒUR',
    beforeAfter: {
      beforeLabel: 'MISE EN VALEUR ÉPURÉE',
      beforeImg: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      afterLabel: 'ESPACE SURCHARGÉ',
      afterImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    },
    paragraphs: [
      'Acheter un bien immobilier est un acte 100% émotionnel. Les gens achètent ce qu’ils ressentent, puis le justifient avec la logique.',
      'La mise en scène (home staging) ne consiste pas à cacher des défauts, mais à révéler le plein potentiel des volumes et la circulation de la lumière.',
      'Désencombrez, allégez le mobilier d’un tiers et disposez quelques accessoires chaleureux (plaids, plantes vertes, coussins texturés).',
    ],
  },

  // ─── PAGE 13 : ÉTAPE 2 DIVIDER (Fixer votre prix) ───
  {
    pageNumber: 13,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'stage_divider',
    stageNumber: 'ÉTAPE 2',
    title: 'Fixer votre prix',
    subtitle: 'La fixation du prix est la décision la plus stratégique de votre projet.',
    paragraphs: [
      'Si vous souhaitez vendre seul avec succès, vous devez fixer un prix d’une justesse mathématique absolue.',
      'Un prix trop élevé fait fuir les meilleurs acheteurs de la première heure. Un prix trop bas vous prive d’un capital précieux.',
      'Dans ce module, découvrez les leviers pour positionner votre bien au sommet de son attractivité.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
  },

  // ─── PAGE 14 : LA DYNAMIQUE DE PRIX (Photo Top + 2 Col) ───
  {
    pageNumber: 14,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'two_column_photo_top',
    title: 'La dynamique de prix',
    subtitle: 'COMMENT LE MARCHÉ RÉAGIT À VOTRE VALEUR AFFICHÉE',
    heroImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    twoColumnsText: {
      col1: [
        'Le prix de votre maison est l’élément le plus décisif de l’ensemble du processus. Une maison affichée au-dessus du marché stagnera pendant de longs mois.',
        'Durant ce temps, vous continuez à supporter les charges, taxes et frais d’entretien. Plus grave : les acheteurs supposeront que le bien a un problème caché car il ne s’est pas vendu rapidement.',
      ],
      col2: [
        'À l’inverse, certains vendeurs particuliers sous-estiment leur bien par méconnaissance des ventes récentes de leur secteur.',
        'Les acquéreurs aguerris surveillent les alertes chaque matin : en fixant le juste prix, vous suscitez de l’émulation et obtenez des offres au prix sans négociation subie.',
      ],
    },
  },

  // ─── PAGE 15 : ANALYSE FACTUELLE & CRITÈRES CLÉS ───
  {
    pageNumber: 15,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'black_badges_bottom_photo',
    title: 'Analyse & Critères Clés',
    subtitle: 'LES VARIABLES QUI DÉTERMINENT LA VALEUR RÉELLE',
    itemsWithBadges: [
      {
        badge: 'ANALYSE FACTUELLE (DVF)',
        text: 'Concentrez-vous exclusivement sur les ventes réelles enregistrées par les notaires (DVF) dans un périmètre strict de moins de 1 km sur les 18 derniers mois, et jamais sur les prix affichés en vitrine.',
      },
      {
        badge: 'CARACTÉRISTIQUES DU BÂTI',
        text: 'Surface Carrez utile, plain-pied vs étages, exposition sud, luminosité naturelle, état de la toiture, conformité de l’assainissement (tout-à-l’égout ou fosse) et note DPE (l’impact direct des classes F/G).',
      },
      {
        badge: 'AGRÉMENTS & CADRE DE VIE',
        text: 'Calme absolu sans vis-à-vis, vue dégagée sur les collines ou le Luberon, taille et topographie du terrain, présence d’une piscine aux normes et proximité immédiate des commodités de village.',
      },
      {
        badge: 'CONCURRENCE DIRECTE ACTIVE',
        text: 'Analysez les biens comparables en vente actuellement dans votre secteur. Vos futurs acquéreurs les visiteront le même week-end que le vôtre et compareront chaque écart de prestation.',
      },
    ],
    bannerBox: {
      title: 'LE CONSEIL D’ARBITRAGE D’ALEXANDRE LOPEZ',
      text: 'Un acheteur ne paie pas le potentiel que vous imaginez, mais l’état réel qu’il constate le jour de la visite. Chaque défaut visible ou incertitude technique est converti en offre décotée.',
    },
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 16 : LES 4 SOURCES DE PRIX (DVF, SIMULATEURS, PRO, EXPERTISE) ───
  {
    pageNumber: 16,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'cma_vs_appraisal',
    title: 'Les 4 Sources de Prix',
    subtitle: 'CE QU’ELLES VALENT RÉELLEMENT SUR LE MARCHÉ PROVENÇAL',
    paragraphs: [
      '1. Les bases notariales DVF (Demande de Valeur Foncière) : L’unique source factuelle des ventes authentiques réellement enregistrées par l’administration fiscale. C’est le socle objectif incontestable pour connaître les prix nets signés.',
      '2. Les simulateurs d’estimation en ligne : Basés sur des algorithmes statistiques génériques, ils ignorent la vue, le calme, l’exposition et l’état réel du bâti. En Provence, leur marge d’erreur oscille souvent entre 10% et 20%.',
      '3. L’avis de valeur d’un professionnel du secteur : Il croise les actes DVF récents avec les critères qualitatifs de terrain et la concurrence active pour définir le prix d’attractivité maximal.',
      '4. L’expertise judiciaire ou vénale agréée : Réalisée par un expert assermenté, elle est obligatoire lors de successions complexes ou pour sécuriser le prêt hypothécaire d’un acquéreur auprès de son comité bancaire.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 17 : LES 3 SIGNAUX DU MARCHÉ & LE PIÈGE DU M² ───
  {
    pageNumber: 17,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'three_column_black_banner',
    title: 'Les 3 Signaux du Marché',
    subtitle: 'COMMENT DÉCODER LA RÉALITÉ SANS VOUS LAISSER PIÉGER',
    threeColumns: [
      {
        number: '01',
        title: 'VENTES CONCLUES (DVF)',
        text: 'Les actes authentiques signés des 6 à 12 derniers mois. C’est la seule preuve juridique de ce que les acheteurs ont effectivement accepté de débourser.',
      },
      {
        number: '02',
        title: 'CONCURRENCE ACTIVE',
        text: 'Les annonces en ligne aujourd’hui. Attention : ce sont des prix demandés par des vendeurs, pas des prix vendus. C’est votre concurrence directe ce week-end.',
      },
      {
        number: '03',
        title: 'ANNONCES EN SOUFFRANCE',
        text: 'Les biens en ligne depuis plus de 90 jours ou avec baisses de prix répétées. C’est le signal limpide que le marché rejette leur positionnement initial.',
      },
    ],
    bannerBox: {
      title: 'LE PIÈGE DU PRIX AU M² EN PROVENCE',
      text: 'Appliquer un prix au m² moyen sur une maison est un leurre : la qualité du terrain, la vue dégagée, l’absence de vis-à-vis, la piscine, l’assainissement et la note DPE créent des écarts de valeur pouvant dépasser 30% à surface habitable identique.',
    },
  },

  // ─── PAGE 18 : ÉTAPE 3 DIVIDER (Faire connaître votre bien) ───
  {
    pageNumber: 18,
    moduleNumber: 3,
    moduleTitle: 'Marketing & Visibilité',
    layoutType: 'stage_divider',
    stageNumber: 'ÉTAPE 3',
    title: 'Faire connaître votre bien',
    subtitle: 'La visibilité ciblée transforme un simple bien en objet de désir.',
    paragraphs: [
      'Vous avez préparé votre logement et calibré votre prix. Il est temps de toucher le marché avec puissance.',
      'Ne commettez pas l’erreur de bâcler votre stratégie marketing : découvrez comment capter les meilleurs acquéreurs dès le lancement.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85',
  },

  // ─── PAGE 19 : LA FORCE DE LA PHOTOGRAPHIE ───
  {
    pageNumber: 19,
    moduleNumber: 3,
    moduleTitle: 'Marketing & Visibilité',
    layoutType: 'photography_before_after',
    title: 'La force de la photographie',
    subtitle: 'L’IMPACT DES PRISES DE VUE SUR LE CLIC ET L’OFFRE',
    paragraphs: [
      'La première impression d’un acheteur est TOUJOURS visuelle. Vous ne devez pas lésiner sur ce point capital.',
      'Privilégiez les photos en grand angle raisonné, à hauteur de regard, avec une lumière naturelle abondante (ouvrez tous les volets et stores).',
      'Le shooting doit avoir lieu un jour de grand ciel bleu, idéalement en début de matinée ou en fin d’après-midi lors de la Golden Hour.',
    ],
    beforeAfter: {
      beforeLabel: 'PHOTO SMARTPHONE AMATEUR',
      beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      afterLabel: 'PRISE DE VUE PROFESSIONNELLE',
      afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
  },

  // ─── PAGE 20 À 41 : COMPLÉMENTS MODULES 3 À 8 ───
  {
    pageNumber: 20,
    moduleNumber: 3,
    moduleTitle: 'Marketing & Visibilité',
    layoutType: 'black_badges_list',
    title: 'Rédiger une Annonce Magnétique',
    subtitle: 'LA MÉTHODE AIDA POUR SUSCITER L’ENVIE D’APPELER',
    itemsWithBadges: [
      {
        badge: 'ACCROCHE',
        text: 'Titrez sur le mode de vie et la rareté du bien : « Villa lumineuse au calme absolu, vue dégagée sur les collines provençales ».',
      },
      {
        badge: 'INTÉRÊT',
        text: 'Détaillez la disposition avec fluidité : vaste pièce de vie traversante, suite parentale en rez-de-chaussée, cuisine ouverte équipée.',
      },
      {
        badge: 'DÉSIR',
        text: 'Mentionnez les prestations de confort : climatisation réversible, terrasse ombragée, garage carrelé, piscine sécurisée.',
      },
      {
        badge: 'ACTION',
        text: 'Invitez à un premier échange qualifié par téléphone avant d’organiser une visite privée.',
      },
    ],
  },
  {
    pageNumber: 21,
    moduleNumber: 3,
    moduleTitle: 'Marketing & Visibilité',
    layoutType: 'two_column_photo_top',
    title: 'OÙ DIFFUSER VOTRE ANNONCE',
    subtitle: 'CHOISIR LES BONS CANAUX POUR TOUCHER LES ACHETEURS',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    twoColumnsText: {
      col1: [
        'Leboncoin et PAP restent les carrefours indispensables de la vente entre particuliers. Ils génèrent un volume de vues important dès les premières 48 heures.',
        'Prévoyez un budget de remontée en tête de liste pour maintenir la visibilité après les 10 premiers jours.',
      ],
      col2: [
        'Ne négligez pas le bouche-à-oreille et les réseaux sociaux locaux : le voisinage est souvent le premier prescripteur pour des proches en recherche.',
        'Les portails professionnels (SeLoger, Bien’ici) restent toutefois réservés aux mandataires agréés.',
      ],
    },
  },
  {
    pageNumber: 22,
    moduleNumber: 3,
    moduleTitle: 'Marketing & Visibilité',
    layoutType: 'black_badges_bottom_photo',
    title: 'Le Panneau « À Vendre »',
    subtitle: 'VISIBILITÉ DE PROXIMITÉ & CONSIGNES DE SÉCURITÉ',
    itemsWithBadges: [
      {
        badge: 'EMPLACEMENT',
        text: 'Placez le panneau à hauteur des yeux, bien visible depuis la rue sans empiéter sur le domaine public communal.',
      },
      {
        badge: 'SÉCURITÉ',
        text: 'Ne recevez JAMAIS une personne qui sonne à l’improviste : exigez systématiquement un appel et un rendez-vous planifié.',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    pageNumber: 23,
    moduleNumber: 3,
    moduleTitle: 'Marketing & Visibilité',
    layoutType: 'split_half_photo',
    title: 'LA FICHE DE VISITE',
    subtitle: 'LE DOCUMENT À REMETTRE EN MAIN PROPRE',
    paragraphs: [
      'À la fin de la visite, remettez un document papier soigné récapitulant les surfaces, le plan, le DPE et le montant des taxes.',
      'Ce geste professionnel permet à votre maison de rester en évidence sur la table des acquéreurs le soir même.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=85',
  },

  // ─── ÉTAPE 4 (Qualification & Visites) ───
  {
    pageNumber: 24,
    moduleNumber: 4,
    moduleTitle: 'Qualification & Visites',
    layoutType: 'stage_divider',
    stageNumber: 'ÉTAPE 4',
    title: 'Visites & Qualification',
    subtitle: 'Filtrer les curieux pour consacrer votre énergie aux vrais acheteurs.',
    paragraphs: [
      'Faire visiter sa maison à des inconnus demande méthode et sécurité.',
      'Découvrez comment poser les bonnes questions dès le premier appel et mener vos visites avec l’aisance d’un professionnel.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85',
  },
  {
    pageNumber: 25,
    moduleNumber: 4,
    moduleTitle: 'Qualification & Visites',
    layoutType: 'black_badges_list',
    title: 'Filtrage Téléphonique en 4 Points',
    subtitle: 'LES QUESTIONS À POSER AVANT DE FIXER UN RENDEZ-VOUS',
    itemsWithBadges: [
      {
        badge: 'TIMING',
        text: '« Depuis combien de temps êtes-vous en recherche et sous quel délai souhaitez-vous emménager ? »',
      },
      {
        badge: 'FINANCEMENT',
        text: '« Avez-vous déjà fait valider votre budget par votre banque ou un courtier sous forme d’attestation ? »',
      },
      {
        badge: 'SITUATION',
        text: '« Êtes-vous actuellement locataire ou devez-vous vendre un bien avant d’acheter ? »',
      },
      {
        badge: 'DÉCISIONNAIRES',
        text: '« Tous les décisionnaires seront-ils présents lors de cette première visite ? »',
      },
    ],
  },
  {
    pageNumber: 26,
    moduleNumber: 4,
    moduleTitle: 'Qualification & Visites',
    layoutType: 'two_column_photo_top',
    title: 'L’ART DE CONDUIRE LA VISITE',
    subtitle: 'LAISSER L’ACHETEUR S’APPROPRIER LES LIEUX EN SILENCE',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    twoColumnsText: {
      col1: [
        'Ouvrez les portes, indiquez la fonction de chaque pièce, puis mettez-vous en retrait en marchant toujours derrière les visiteurs.',
        'Ne comblez pas les silences : l’acquéreur a besoin de calme pour se projeter mentalement dans son futur quotidien.',
      ],
      col2: [
        'Répondez avec franchise et précision aux questions techniques, sans jamais sur-vendre ni justifier chaque détail.',
        'Mettez à disposition votre classeur vendeur avec l’ensemble des diagnostics et factures d’énergie.',
      ],
    },
  },
  {
    pageNumber: 27,
    moduleNumber: 4,
    moduleTitle: 'Qualification & Visites',
    layoutType: 'black_badges_bottom_photo',
    title: 'Sécurité & Débriefing',
    subtitle: 'PROTÉGER SON FOYER ET RECUEILLIR LES AVIS',
    itemsWithBadges: [
      {
        badge: 'SÉCURITÉ',
        text: 'Ranger hors de vue bijoux, clés de voiture, ordinateurs portables et papiers d’identité sensibles.',
      },
      {
        badge: 'DÉBRIEFING',
        text: 'Faites remplir une courte fiche d’avis à chaud pour identifier d’éventuelles objections récurrentes à corriger.',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── ÉTAPE 5 (Négociation & Offres) ───
  {
    pageNumber: 28,
    moduleNumber: 5,
    moduleTitle: 'Négociation & Offres',
    layoutType: 'stage_divider',
    stageNumber: 'ÉTAPE 5',
    title: 'Offres & Négociation',
    subtitle: 'Défendre la vraie valeur de votre bien sans céder à l’émotion.',
    paragraphs: [
      'Recevoir une offre d’achat est le moment le plus intense d’une vente.',
      'Dans cette section, vous apprendrez à analyser la solidité juridique d’une offre et à mener une contre-proposition gagnante.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1400&q=85',
  },
  {
    pageNumber: 29,
    moduleNumber: 5,
    moduleTitle: 'Négociation & Offres',
    layoutType: 'black_badges_list',
    title: 'Anatomie d’une Offre Conforme',
    subtitle: 'LES MENTIONS JURIDIQUES INDISPENSABLES',
    itemsWithBadges: [
      {
        badge: 'PRIX FORMALISÉ',
        text: 'Montant stipulé en toutes lettres et chiffres, précisant clairement s’il s’agit d’un prix net vendeur.',
      },
      {
        badge: 'PLAN FINANCEMENT',
        text: 'Apport personnel chiffré, montant de l’emprunt, taux d’intérêt maximum et durée envisagée.',
      },
      {
        badge: 'VALIDITÉ COURTE',
        text: 'Une durée de validité stricte de 48h à 72h. Bannissez les offres ouvertes sans date limite.',
      },
      {
        badge: 'CONDITIONS SUSPENSIVES',
        text: 'Prêt bancaire encadré, délai de réalisation et éventuelle vente préalable d’un autre bien.',
      },
    ],
  },
  {
    pageNumber: 30,
    moduleNumber: 5,
    moduleTitle: 'Négociation & Offres',
    layoutType: 'split_half_photo',
    title: 'RÉPONDRE À UNE OFFRE BASSE',
    subtitle: 'LA CONTRE-PROPOSITION STRATÉGIQUE',
    paragraphs: [
      'Ne refusez jamais une offre basse par un simple non : répondez toujours par une contre-proposition écrite argumentée.',
      'Rappelez la qualité des prestations, proposez un effort symbolique avec un délai court de 48h et exigez en retour une garantie de financement irréprochable.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    pageNumber: 31,
    moduleNumber: 5,
    moduleTitle: 'Négociation & Offres',
    layoutType: 'black_badges_bottom_photo',
    title: 'Vérification de Solvabilité',
    subtitle: 'ÉVITER LES REFUS DE PRÊT TARDIFS',
    itemsWithBadges: [
      {
        badge: 'ATTESTATION BANCAIRE',
        text: 'Exigez une attestation de faisabilité financière de moins de 30 jours établie par une banque ou un courtier.',
      },
      {
        badge: 'TAUX D’ENDETTEMENT',
        text: 'Assurez-vous que le projet respecte les normes HCSF (35% d’endettement maximum assurance incluse).',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── MODULE 6 (Notaire & Signatures) ───
  {
    pageNumber: 32,
    moduleNumber: 6,
    moduleTitle: 'Du Dossier au Notaire',
    layoutType: 'two_column_photo_top',
    title: 'LE RÔLE DU NOTAIRE & LE COMPROMIS',
    subtitle: 'SÉCURITÉ JURIDIQUE & ANTICIPATION DES PIÈCES',
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    twoColumnsText: {
      col1: [
        'Vendeur et acheteur peuvent chacun faire intervenir leur propre notaire : cela ne vous coûte rien de plus, les émoluments réglementés étant partagés entre les deux études.',
        'Votre notaire défend exclusivement vos intérêts patrimoniaux, calcule l’éventuelle plus-value (si résidence secondaire) et verrouille la rédaction des conditions suspensives.',
      ],
      col2: [
        'Préparez votre dossier en amont : titre de propriété complet, taxe foncière, factures décennales de travaux et conformités d’urbanisme (DAACT mairie).',
        'Le DDT complet (DPE, amiante, plomb, électricité, termites, attestation OLD et contrôle SPANC) doit être annexé dès le compromis pour faire courir le délai de rétractation sans nullité.',
      ],
    },
  },
  {
    pageNumber: 33,
    moduleNumber: 6,
    moduleTitle: 'Du Dossier au Notaire',
    layoutType: 'black_badges_list',
    title: 'Délai SRU & Séquestre',
    subtitle: 'LES 10 JOURS DE RÉTRACTATION LÉGALE',
    itemsWithBadges: [
      {
        badge: 'DÉLAI SRU',
        text: 'L’acheteur bénéficie de 10 jours calendaires pour se rétracter sans pénalité à compter de la notification officielle du compromis.',
      },
      {
        badge: 'SÉQUESTRE',
        text: 'Versement de 5% à 10% du prix sur le compte séquestre de l’étude notariale, gage de son engagement ferme.',
      },
      {
        badge: 'PURGE DU DÉLAI',
        text: 'À l’issue des 10 jours, l’engagement devient définitif sous réserve de l’obtention du prêt bancaire.',
      },
    ],
  },
  {
    pageNumber: 34,
    moduleNumber: 6,
    moduleTitle: 'Du Dossier au Notaire',
    layoutType: 'three_column_black_banner',
    title: 'Chronologie des 3 Mois',
    subtitle: 'DU COMPROMIS À L’ACTE DÉFINITIF',
    threeColumns: [
      {
        number: 'MOIS 1',
        title: 'INSTRUCTION BANCAIRE',
        text: 'Dépôt des dossiers de prêt par l’acheteur et purge de la déclaration d’intention d’aliéner (DIA) en mairie.',
      },
      {
        number: 'MOIS 2',
        title: 'OFFRE DE PRÊT',
        text: 'Édition de l’offre de prêt officielle et respect du délai de réflexion Scrivener de 11 jours.',
      },
      {
        number: 'MOIS 3',
        title: 'APPEL DE FONDS',
        text: 'Vérification hypothécaire, virement bancaire sur le compte du notaire et signature de l’acte authentique.',
      },
    ],
    bannerBox: {
      title: 'VISITE DE COURTOISIE LE JOUR J',
      text: 'Effectuez un relevé contradictoire des compteurs (eau, électricité) le matin même de la signature finale avant de remettre les clés.',
    },
  },
  {
    pageNumber: 35,
    moduleNumber: 6,
    moduleTitle: 'Du Dossier au Notaire',
    layoutType: 'black_badges_bottom_photo',
    title: 'La Remise des Clés',
    subtitle: 'CLÔTURE OFFICIELLE DE LA TRANSACTION',
    itemsWithBadges: [
      {
        badge: 'COMPTEURS',
        text: 'Noter les index d’eau, d’électricité et de gaz sur le document de transmission pour résilier vos abonnements.',
      },
      {
        badge: 'JEUX DE CLÉS',
        text: 'Rassembler tous les jeux de clés, bips de portail, notices techniques d’appareils et coordonnées des artisans.',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── MODULE 7 (Délégation & Assistance) ───
  {
    pageNumber: 36,
    moduleNumber: 7,
    moduleTitle: 'Délégation & Sérénité',
    layoutType: 'split_half_photo',
    title: 'CHARGE MENTALE & SÉRÉNITÉ',
    subtitle: 'ÊTES-VOUS PRÊT À CONSACRER 50H À VOTRE VENTE ?',
    paragraphs: [
      'Gérer une vente seul est un second métier exigeant qui mobilise vos soirs et vos week-ends.',
      'Si vous en avez l’énergie, ce guide vous donne toutes les clés pour réussir.',
      'Si vous souhaitez déléguer en toute confiance pour préserver votre tranquillité, une alternative sur-mesure existe.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
  },
  {
    pageNumber: 37,
    moduleNumber: 7,
    moduleTitle: 'Délégation & Sérénité',
    layoutType: 'pros_and_cons_2col',
    title: 'Vendre Seul vs Déléguer',
    subtitle: 'COMPARAISON TRANSPARENTE DES DEUX APPROCHES',
    prosCons: {
      pros: [
        'VENTE SEUL EN DIRECT :',
        'Économie théorique d’honoraires.',
        'Contact direct sans intermédiaire.',
        'Liberté de calendrier.',
      ],
      cons: [
        'ACCOMPAGNEMENT SIGNATURE ALEXANDRE LOPEZ :',
        'Prix net vendeur défendu par un expert impartial.',
        '100% des acheteurs qualifiés financièrement avant visite.',
        'Marketing d’architecte et espace client en temps réel.',
        'Sérénité absolue et sécurité juridique totale.',
      ],
    },
  },
  {
    pageNumber: 38,
    moduleNumber: 7,
    moduleTitle: 'Délégation & Sérénité',
    layoutType: 'two_column_photo_top',
    title: 'L’APPROCHE ALEXANDRE LOPEZ',
    subtitle: 'L’EXIGENCE DU SUR-MESURE EN PROVENCE',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    twoColumnsText: {
      col1: [
        'Une valorisation photographique haut de gamme pour faire ressortir l’émotion et l’élégance de votre propriété.',
        'Un réseau d’acheteurs sérieux et vérifiés prêts à se positionner rapidement.',
      ],
      col2: [
        'Un suivi transparent via votre espace client digitalisé disponible 7j/7.',
        'Une négociation experte pour protéger votre patrimoine au prix le plus juste.',
      ],
    },
  },
  {
    pageNumber: 39,
    moduleNumber: 7,
    moduleTitle: 'Délégation & Sérénité',
    layoutType: 'testimonial_dark_card',
    title: 'Étude de Cas Réelle',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
    quoteCard: {
      stars: 5,
      text: '« Après 2 mois sans résultat entre particuliers, Alexandre a repositionné notre maison avec des photos magnifiques. Vendue en 18 jours au prix net espéré ! »',
      author: 'JEAN-MARC & CLAIRE — COTIGNAC',
    },
  },
  {
    pageNumber: 40,
    moduleNumber: 7,
    moduleTitle: 'Délégation & Sérénité',
    layoutType: 'black_badges_list',
    title: 'Vos Contacts Utiles',
    subtitle: 'LES NUMÉROS CLÉS À CONSERVER',
    itemsWithBadges: [
      {
        badge: 'DIAGNOSTIQUEUR',
        text: 'Pour planifier le DDT complet (DPE, électricité, assainissement).',
      },
      {
        badge: 'NOTAIRE',
        text: 'Pour préparer l’avant-contrat et vérifier les titres de propriété.',
      },
      {
        badge: 'ALEXANDRE LOPEZ',
        text: 'Conseiller immobilier référent en Provence & Côte d’Azur · 06 13 18 01 68.',
      },
    ],
  },
  {
    pageNumber: 41,
    moduleNumber: 7,
    moduleTitle: 'Quatrième de Couverture',
    layoutType: 'backcover_dark',
    title: 'ALEXANDRE LOPEZ',
    subtitle: 'Conseiller en Immobilier & Stratégie Patrimoniale · Provence & Côte d’Azur',
    quoteCard: {
      stars: 5,
      text: '« Une vente immobilière réussie n’est pas le fruit du hasard. C’est la rencontre d’une stratégie précise, d’une valorisation sans concession et d’un respect absolu de votre patrimoine. »',
      author: 'Alexandre Lopez',
    },
  },
]
