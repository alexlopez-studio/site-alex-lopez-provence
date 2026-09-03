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

export const GUIDE_MODULES_V1 = [
  { number: 1, title: 'Préparation du Bien', pages: '7 - 12' },
  { number: 2, title: 'Stratégie de Prix', pages: '13 - 17' },
  { number: 3, title: 'Marketing & Photographie', pages: '18 - 23' },
  { number: 4, title: 'Qualification & Visites', pages: '24 - 27' },
  { number: 5, title: 'Négociation & Offres', pages: '28 - 31' },
  { number: 6, title: 'Du Dossier au Notaire', pages: '32 - 35' },
  { number: 7, title: 'Délégation & Sérénité', pages: '36 - 41' },
]

export const GUIDE_PAGES_V1: GuidePageData[] = [
  // ─── PAGE 1 : COVER (Selling Your Own Home) ───
  {
    pageNumber: 1,
    moduleNumber: 0,
    moduleTitle: 'Couverture',
    layoutType: 'cover_bedroom',
    title: 'Selling Your Own Home',
    subtitle: 'Le guide complet pour réussir votre vente en Provence Verte & Verdon',
    heroImage: '/images/provence-bastide-lavande.jpg',
  },

  // ─── PAGE 2 : TESTIMONIAL FULL PHOTO ───
  {
    pageNumber: 2,
    moduleNumber: 0,
    moduleTitle: 'Témoignage',
    layoutType: 'testimonial_dark_card',
    title: 'Témoignage Client',
    heroImage: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85',
    quoteCard: {
      stars: 5,
      text: '« Faire appel à un professionnel méthodique a transformé une vente stressante en un parcours fluide et parfaitement maîtrisé au juste prix. »',
      author: 'FAMILLE DUPONT — PROPRIÉTAIRES EN PROVENCE',
    },
  },

  // ─── PAGE 3 : WELCOME + IPHONE MOCKUP ───
  {
    pageNumber: 3,
    moduleNumber: 0,
    moduleTitle: 'Introduction',
    layoutType: 'welcome_phone',
    title: 'welcome',
    subtitle: 'I am excited to guide you through this journey!',
    paragraphs: [
      'De nombreux propriétaires choisissent l’aventure de la vente directe de particulier à particulier. Dans le monde de l’immobilier, vendre soi-même présente des avantages indéniables. Avec une préparation méticuleuse et une bonne stratégie, cette expérience peut être très gratifiante.',
      'Pour une personne expérimentée dans la valorisation et la négociation, cela fait pleinement sens. En revanche, pour un propriétaire pressé par le temps, naviguer entre estimation, marketing, conformité juridique et filtrage bancaire peut s’avérer complexe sans accompagnement.',
      'Les annonces entre particuliers sont fréquentes sur les portails. Mais vendre seul n’est pas anodin : les statistiques montrent que plus des deux tiers des vendeurs sans méthode finissent par renoncer face à l’usure des visites non qualifiées.',
      'Beaucoup de professionnels gardent leurs méthodes secrètes. Ce n’est pas ma vision. Dans ce guide, je partage avec vous l’ensemble des protocoles que j’applique au quotidien pour préparer, valoriser et vendre au juste prix en Provence.',
      'Et si au cours de cette aventure vous souhaitez vous décharger de la charge mentale pour déléguer à un partenaire de confiance, n’hésitez jamais à me joindre.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
  },

  // ─── PAGE 4 : ASK YOURSELF... (3 QUESTIONS) ───
  {
    pageNumber: 4,
    moduleNumber: 0,
    moduleTitle: 'Auto-Évaluation',
    layoutType: 'ask_yourself_badge',
    badgeText: 'ASK YOURSELF...',
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
      yesText: 'Si vous avez répondu OUI à chacune de ces 3 questions : parfait ! Passez directement à l’ÉTAPE 1.',
      noText: 'Si vous avez répondu NON à l’une de ces questions : prenez le temps d’étudier attentivement les 4 statistiques de la page suivante.',
    },
  },

  // ─── PAGE 5 : CONSIDER THIS (4 STATISTICS) ───
  {
    pageNumber: 5,
    moduleNumber: 0,
    moduleTitle: 'Statistiques',
    layoutType: 'consider_this_badge',
    badgeText: 'CONSIDER THIS',
    title: '4 Réalités Chiffrées du Marché PAP',
    subtitle: 'SI VOUS HÉSITEZ ENCORE, ANALYSEZ CES 4 DONNÉES CLÉS CONSTATÉES SUR LE MARCHÉ IMMOBILIER :',
    numberedItems: [
      {
        number: '01',
        title: 'Un écart moyen de prix constaté de 6% à 9%',
        text: 'Les études notariales montrent qu’un bien vendu en direct subit souvent une négociation plus agressive faute de concurrence organisée et d’arguments comparatifs factuels.',
      },
      {
        number: '02',
        title: 'Un délai de vente moyen rallongé de 19 jours',
        text: 'Sans diffusion multi-portails professionnelle ni vivier d’acheteurs pré-qualifiés, la mise en relation prend mécaniquement plus de temps.',
      },
      {
        number: '03',
        title: 'Le casse-tête juridique : 1ère cause d’abandon',
        text: 'La constitution du dossier Loi ALUR, les diagnostics DPE et la sécurisation des clauses suspensives de prêt représentent le principal motif de découragement des vendeurs.',
      },
      {
        number: '04',
        title: '70% des vendeurs particuliers finissent par déléguer',
        text: 'Face à l’usure des visites non qualifiées et des rétractations bancaires, plus des deux tiers des propriétaires choisissent de confier leur bien à un conseiller de confiance.',
      },
    ],
    footerNote:
      'Vendre seul peut être une expérience gratifiante si vous appliquez une méthode stricte. L’objectif de ce guide est de vous donner toutes les cartes pour réussir en toute sérénité.',
  },

  // ─── PAGE 6 : PROS & CONS ───
  {
    pageNumber: 6,
    moduleNumber: 0,
    moduleTitle: 'Avantages & Inconvénients',
    layoutType: 'pros_and_cons_2col',
    title: 'Pros & Cons',
    subtitle: 'DE LA VENTE IMMOBILIÈRE ENTRE PARTICULIERS',
    prosCons: {
      pros: [
        'Économie théorique des honoraires d’agence, préservant ainsi une marge financière sur le papier.',
        'Contrôle total sur l’ensemble du processus : calendrier des visites, choix des horaires et des supports.',
        'Vous êtes le meilleur connaisseur de votre lieu : vous connaissez chaque recoin, chaque saison et chaque détail de votre maison.',
        'Satisfaction personnelle d’avoir mené à bien une transaction patrimoniale majeure par vous-même.',
      ],
      cons: [
        'Exposition à des acheteurs non solvables qui n’ont pas fait valider leur capacité d’emprunt bancaire.',
        'Charge mentale élevée : gestion des appels à toute heure, annulations de dernière minute et week-ends bloqués.',
        'Difficulté à rester neutre lors de la négociation face à des critiques touchant votre lieu de vie.',
        'Risque de « brûler l’annonce » sur les portails si le prix initial est mal positionné dès les premiers jours.',
      ],
    },
  },

  // ─── PAGE 7 : STAGE ONE DIVIDER (Preparation of Your Home) ───
  {
    pageNumber: 7,
    moduleNumber: 1,
    moduleTitle: 'Préparation du Bien',
    layoutType: 'stage_divider',
    stageNumber: 'STAGE ONE',
    title: 'Preparation of Your Home',
    subtitle: 'La préparation méticuleuse est la clé de voûte de toute transaction réussie.',
    paragraphs: [
      'La clé d’une vente réussie réside dans la préparation en amont. Si votre bien n’est pas parfaitement prêt, il risque de stagner sur le marché et de subir une décote évitable.',
      'Dans cette première section, nous allons aborder chaque point de contrôle pour transformer votre logement en un coup de cœur évident dès la première visite.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85',
  },

  // ─── PAGE 8 : HOME PREPARATION (Split Photo / Text) ───
  {
    pageNumber: 8,
    moduleNumber: 1,
    moduleTitle: 'Préparation du Bien',
    layoutType: 'split_half_photo',
    title: 'HOME PREPARATION',
    subtitle: 'LA MÉTHODE EN 20 POINTS DE VÉRIFICATION',
    paragraphs: [
      'Nous avons développé un protocole très précis pour valoriser votre logement rapidement et au meilleur prix.',
      '20 points de contrôle peuvent sembler exigeants, mais ils constituent le socle qui vous évitera toute mauvaise surprise ou négociation agressive de l’acheteur.',
      'Ne laissez rien au hasard : suivez cette méthodologie étape par étape.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85',
  },

  // ─── PAGE 9 : PREPARING YOUR HOME (Checklist 1) ───
  {
    pageNumber: 9,
    moduleNumber: 1,
    moduleTitle: 'Préparation du Bien',
    layoutType: 'black_badges_list',
    title: 'Preparing your home',
    subtitle: 'ACTIONS PRIORITAIRES POUR SÉCURISER LA VALEUR',
    itemsWithBadges: [
      {
        badge: 'MAKE REPAIRS',
        text: 'Réparez les petits défauts accumulés avec le temps : portes qui grincent, poignées instables, plinthes décollées, robinets qui fuient et fissures légères d’enduit. Tout défaut visible induit un sentiment de négligence chez l’acheteur.',
      },
      {
        badge: 'FINISH PROJECTS',
        text: 'Terminez tous les projets en suspens : cette peinture de couloir inachevée, le luminaire non posé ou la plinthe de cuisine manquante. Un chantier inachevé déclenche systématiquement une demande de décote disproportionnée.',
      },
      {
        badge: 'CREATE CURB APPEAL',
        text: 'L’extérieur fait la première impression : tondez la pelouse, désherbez l’allée, taillez les haies et nettoyez les abords du portail. L’acheteur commence à juger le bien avant même d’être descendu de sa voiture.',
      },
      {
        badge: 'CREATE A WELCOMING ENTRYWAY',
        text: 'L’entrée doit être aérée et lumineuse : installez un paillasson neuf, videz les patères de manteaux et dégagez la vue directe vers la pièce de vie principale.',
      },
    ],
  },

  // ─── PAGE 10 : PREPARING YOUR HOME (Checklist 2 + Bottom Photo) ───
  {
    pageNumber: 10,
    moduleNumber: 1,
    moduleTitle: 'Préparation du Bien',
    layoutType: 'black_badges_bottom_photo',
    title: 'Preparing your home',
    subtitle: 'DÉPERSONNALISATION & PURIFICATION DES ESPACES',
    itemsWithBadges: [
      {
        badge: 'REMOVE PERSONAL ITEMS',
        text: 'Retirez les photos de famille, diplômes et magnets sur le réfrigérateur. L’acheteur doit pouvoir s’imaginer chez lui, et non avoir l’impression de s’introduire dans l’intimité d’un tiers.',
      },
      {
        badge: 'FIX PET ISSUES',
        text: 'Faites disparaître les gamelles, litières et coussins d’animaux avant les visites. Aérez abondamment pour éliminer toute odeur perceptible.',
      },
      {
        badge: 'WASH THE EXTERIOR',
        text: 'Nettoyez la terrasse au jet haute pression, lavez les baies vitrées pour maximiser l’entrée de lumière et dégagez les volets.',
      },
      {
        badge: 'GET A HOME INSPECTION',
        text: 'Anticipez la réalisation du Dossier de Diagnostic Technique (DPE, électricité, amiante) pour ne pas être pris de court lors d’une offre.',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 11 : EXTÉRIEURS & FINITIONS (Side Photo) ───
  {
    pageNumber: 11,
    moduleNumber: 1,
    moduleTitle: 'Préparation du Bien',
    layoutType: 'black_badges_side_photo',
    title: 'Détails & Extérieurs',
    subtitle: 'LES POINTS QUI CRÉENT LE SENTIMENT DE QUALITÉ',
    itemsWithBadges: [
      {
        badge: 'FIX FENCING',
        text: 'Réparez les clôtures affaissées, portillons déboîtés ou grillages détendus pour délimiter nettement votre propriété.',
      },
      {
        badge: 'ROOF REPAIRS',
        text: 'Vérifiez la toiture : remplacez les tuiles ébréchées et nettoyez les gouttières encombrées par les feuilles mortes.',
      },
      {
        badge: 'FIX CRACKS',
        text: 'Rebouchez les micro-fissures d’enduit sur les murets extérieurs et terrasses pour rassurer sur l’étanchéité.',
      },
      {
        badge: 'TOUCH UP ANY SCUFF MARKS',
        text: 'Passez un coup de peinture propre sur les chambranles de portes et angles de murs abîmés par les passages quotidiens.',
      },
      {
        badge: 'CONDUCT A SMELL TEST',
        text: 'Faites tester l’odeur de votre maison par un ami objectif 30 minutes après avoir aéré les pièces.',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1545083036-b175dd155a1d?auto=format&fit=crop&w=800&q=85',
  },

  // ─── PAGE 12 : STAGING YOUR HOME (Comparison VS) ───
  {
    pageNumber: 12,
    moduleNumber: 1,
    moduleTitle: 'Préparation du Bien',
    layoutType: 'staging_vs_comparison',
    title: 'staging your home',
    subtitle: 'L’IMPACT DU HOME STAGING SUR LE COUP DE CŒUR',
    beforeAfter: {
      beforeLabel: 'PROFESSIONAL STAGING',
      beforeImg: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      afterLabel: 'ZERO STAGING (ENCOMBRÉ)',
      afterImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    },
    paragraphs: [
      'Acheter un bien immobilier est un acte 100% émotionnel. Les gens achètent ce qu’ils ressentent, puis le justifient avec la logique.',
      'La mise en scène (home staging) ne consiste pas à cacher des défauts, mais à révéler le plein potentiel des volumes et la circulation de la lumière.',
      'Désencombrez, allégez le mobilier d’un tiers et disposez quelques accessoires chaleureux (plaids, plantes vertes, coussins texturés).',
    ],
  },

  // ─── PAGE 13 : STAGE TWO DIVIDER (Pricing Your Home) ───
  {
    pageNumber: 13,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'stage_divider',
    stageNumber: 'STAGE TWO',
    title: 'Pricing Your Home',
    subtitle: 'La fixation du prix est la décision la plus stratégique de votre projet.',
    paragraphs: [
      'Si vous souhaitez vendre seul avec succès, vous devez fixer un prix d’une justesse mathématique absolue.',
      'Un prix trop élevé fait fuir les meilleurs acheteurs de la première heure. Un prix trop bas vous prive d’un capital précieux.',
      'Dans ce module, découvrez les leviers pour positionner votre bien au sommet de son attractivité.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85',
  },

  // ─── PAGE 14 : THE PROCESS OF PRICING (Photo Top + 2 Col) ───
  {
    pageNumber: 14,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'two_column_photo_top',
    title: 'THE PROCESS OF PRICING',
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

  // ─── PAGE 15 : PRICING ANALYSIS & CONSIDERATIONS ───
  {
    pageNumber: 15,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'black_badges_bottom_photo',
    title: 'Analyse & Critères Clés',
    subtitle: 'LES VARIABLES QUI DÉTERMINENT LA VALEUR RÉELLE',
    itemsWithBadges: [
      {
        badge: 'ANALYSIS',
        text: 'Pour mener votre analyse comparative, concentrez-vous exclusivement sur les biens réellement vendus (base des notaires DVF) dans un périmètre proche, et non sur les annonces en cours.',
      },
      {
        badge: 'CONSIDER',
        text: 'Votre maison a-t-elle le même nombre de chambres ? Plus ou moins de terrain ? Des rénovations majeures au cours des 5 dernières années ? Le quartier est-il recherché par les familles ?',
      },
    ],
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 16 : CMA VS. APPRAISAL ───
  {
    pageNumber: 16,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'cma_vs_appraisal',
    title: 'CMA VS. APPRAISAL',
    subtitle: 'QUELLE DIFFÉRENCE ENTRE ANALYSE COMPARATIVE ET EXPERTISE ?',
    paragraphs: [
      'L’Analyse Comparative de Marché (CMA) et l’expertise vénale sont deux méthodes professionnelles qui répondent à des objectifs complémentaires.',
      'Le conseiller immobilier réalise une CMA pour déterminer le prix optimal auquel le bien trouvera preneur dans le contexte concurrentiel actuel.',
      'L’expert ou le service bancaire évalue quant à lui la valeur intrinsèque pour sécuriser l’hypothèque du prêt de l’acquéreur.',
      'Si le prix convenu dépasse largement la valeur d’expertise, la banque peut refuser le financement de votre acheteur.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  },

  // ─── PAGE 17 : PLACES TO RESEARCH YOUR HOMES VALUE ───
  {
    pageNumber: 17,
    moduleNumber: 2,
    moduleTitle: 'Stratégie de Prix',
    layoutType: 'three_column_black_banner',
    title: 'places to research',
    subtitle: 'YOUR HOME’S TRUE VALUE',
    threeColumns: [
      {
        number: '01',
        title: 'SOLD LISTINGS',
        text: 'Consultez les ventes notariées réelles (DVF). C’est le seul indicateur factuel qui prouve ce que les acheteurs ont effectivement payé.',
      },
      {
        number: '02',
        title: 'PENDING LISTINGS',
        text: 'Les biens sous compromis de vente vous indiquent ce qui a séduit le marché récemment et à quel rythme les transactions se concluent.',
      },
      {
        number: '03',
        title: 'ACTIVE LISTINGS',
        text: 'Ce sont vos concurrents directs ce week-end. Les acheteurs visiteront ces biens en même temps que le vôtre.',
      },
    ],
    bannerBox: {
      title: 'SQUARE-FOOT & SURFACE COST COMPARISONS',
      text: 'Ne vous fiez pas aveuglément à un prix au m² moyen. Une terrasse avec vue panoramique, un DPE A/B ou un garage fermé modifient sensiblement la valeur finale.',
    },
  },

  // ─── PAGE 18 : STAGE THREE DIVIDER (Marketing Your Home) ───
  {
    pageNumber: 18,
    moduleNumber: 3,
    moduleTitle: 'Marketing & Visibilité',
    layoutType: 'stage_divider',
    stageNumber: 'STAGE THREE',
    title: 'Marketing Your Home',
    subtitle: 'La visibilité ciblée transforme un simple bien en objet de désir.',
    paragraphs: [
      'Vous avez préparé votre logement et calibré votre prix. Il est temps de toucher le marché avec puissance.',
      'Ne commettez pas l’erreur de bâcler votre stratégie marketing : découvrez comment capter les meilleurs acquéreurs dès le lancement.',
    ],
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85',
  },

  // ─── PAGE 19 : THE VALUE OF PHOTOGRAPHY ───
  {
    pageNumber: 19,
    moduleNumber: 3,
    moduleTitle: 'Marketing & Visibilité',
    layoutType: 'photography_before_after',
    title: 'THE VALUE OF PHOTOGRAPHY',
    subtitle: 'L’IMPACT DES PRISES DE VUE SUR LE CLIC ET L’OFFRE',
    paragraphs: [
      'La première impression d’un acheteur est TOUJOURS visuelle. Vous ne devez pas lésiner sur ce point capital.',
      'Privilégiez les photos en grand angle raisonné, à hauteur de regard, avec une lumière naturelle abondante (ouvrez tous les volets et stores).',
      'Le shooting doit avoir lieu un jour de beau temps, idéalement en début de matinée ou en fin d’après-midi lors de la Golden Hour.',
    ],
    beforeAfter: {
      beforeLabel: 'BEFORE (PHOTO SMARTPHONE)',
      beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      afterLabel: 'AFTER (PHOTOGRAPHIE ÉDITORIALE)',
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

  // ─── STAGE FOUR (Qualification & Visites) ───
  {
    pageNumber: 24,
    moduleNumber: 4,
    moduleTitle: 'Qualification & Visites',
    layoutType: 'stage_divider',
    stageNumber: 'STAGE FOUR',
    title: 'Showings & Buyer Qualification',
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

  // ─── STAGE FIVE (Négociation & Notaire) ───
  {
    pageNumber: 28,
    moduleNumber: 5,
    moduleTitle: 'Négociation & Offres',
    layoutType: 'stage_divider',
    stageNumber: 'STAGE FIVE',
    title: 'Offers & Negotiations',
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
    subtitle: 'DEUX NOTAIRES VALENT MIEUX QU’UN',
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    twoColumnsText: {
      col1: [
        'Vendeur et acheteur peuvent chacun faire intervenir leur propre notaire sans surcoût (les honoraires légaux sont partagés équitablement).',
        'Votre notaire défend vos intérêts patrimoniaux et vérifie le respect des clauses du compromis.',
      ],
      col2: [
        'Transmettez l’ensemble des pièces (titre de propriété, diagnostics, PV d’AG) dès l’accord sur le prix pour rédiger le compromis sans délai.',
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
        text: 'Conseiller immobilier référent en Provence Verte & Verdon · 06 13 18 01 68.',
      },
    ],
  },
  {
    pageNumber: 41,
    moduleNumber: 7,
    moduleTitle: 'Quatrième de Couverture',
    layoutType: 'backcover_dark',
    title: 'ALEXANDRE LOPEZ',
    subtitle: 'Conseiller en Immobilier & Stratégie Patrimoniale · Provence Verte & Verdon',
    quoteCard: {
      stars: 5,
      text: '« Une vente immobilière réussie n’est pas le fruit du hasard. C’est la rencontre d’une stratégie précise, d’une valorisation sans concession et d’un respect absolu de votre patrimoine. »',
      author: 'Alexandre Lopez',
    },
  },
]
