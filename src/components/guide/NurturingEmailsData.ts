export interface NurturingEmail {
  id: number
  timing: string
  dayOffset: number
  phase: string
  subjectA: string
  subjectB: string
  preheader: string
  goal: string
  psychologyNote: string
  body: string
}

export const NURTURING_EMAILS: NurturingEmail[] = [
  {
    id: 1,
    timing: 'J+0 (Immédiat après téléchargement)',
    dayOffset: 0,
    phase: 'Délivrance & Prise de Conscience',
    subjectA: 'Votre Guide Vendeur est prêt (+ une mise en garde importante)',
    subjectB: 'Téléchargement : Le Guide Stratégique de votre Vente Immobilière',
    preheader: 'Voici votre accès complet et le piège n°1 qui brûle 80% des annonces en semaine 1.',
    goal: 'Délivrer le guide immédiatement, valoriser son exhaustivité et alerter sur le danger d’un lancement raté.',
    psychologyNote: 'Le vendeur est très réceptif. Il faut lui donner une valeur perçue maximale sans lui vendre une prestation, mais en le rendant vigilant dès les premières heures.',
    body: `Bonjour {Prénom},

Votre guide complet « Vendre entre Particuliers — Édition Propriétaire » est disponible en téléchargement direct via le lien ci-dessous :

👉 [Télécharger le Guide du Vendeur Particulier (PDF)]

Prenez le temps de le parcourir à tête reposée, idéalement sur un grand écran ou en l'imprimant.

Avant que vous ne plongiez dans sa lecture, je tenais à attirer votre attention sur un phénomène que j’observe constamment sur le marché local : **le piège de la première semaine**.

Lorsqu'une annonce paraît, les portails immobiliers lui accordent une visibilité maximale pendant 7 à 10 jours. C'est votre "lune de miel" algorithmique.

Si votre prix est fixé ne serait-ce que 6% à 8% au-dessus du marché réel ou si votre première photo ne déclenche pas le coup de cœur immédiat :
1. Les acheteurs les plus sérieux (ceux qui connaissent parfaitement les prix et sont prêts à acheter) passent leur chemin.
2. Votre bien s'installe dans la durée.
3. Les semaines suivantes, les acquéreurs ne se demandent plus "Est-ce un beau bien ?", mais "Pourquoi n'est-il toujours pas vendu ?".

La page 15 du guide vous détaille la courbe exacte de ce phénomène et comment l'éviter dès le premier jour.

Je reste à votre disposition si vous souhaitez éclaircir un point technique de votre projet.

Bien cordialement,

Alexandre Lopez
Conseiller en Immobilier & Stratégie Patrimoniale
Provence Verte & Verdon
📞 06 13 18 01 68 · 🌐 alexandrelopez.fr`
  },
  {
    id: 2,
    timing: 'J+2',
    dayOffset: 2,
    phase: 'Lucidité & Stratégie de Prix',
    subjectA: 'Pourquoi les estimations en ligne vous mentent (sans le vouloir)',
    subjectB: 'L’algorithme vs la réalité de votre maison en Provence',
    preheader: 'La différence entre un algorithme automatisé et le prix réel acté chez le notaire.',
    goal: 'Casser l’illusion des simulateurs automatiques et positionner l’avis de valeur terrain comme seul repère fiable.',
    psychologyNote: 'Le propriétaire est tenté de choisir l’estimation en ligne la plus haute. On lui explique avec bienveillance la mécanique des bases de données DVF.',
    body: `Bonjour {Prénom},

Si vous avez déjà testé des simulateurs d'estimation sur internet pour votre bien, vous avez sans doute remarqué une chose frappante :

Entre le site A et le site B, l'écart d'estimation pour une même adresse atteint régulièrement 30 000 €, 50 000 € voire 80 000 €.

Pourquoi un tel écart ?

Ces outils reposent sur des moyennes mathématiques au mètre carré. Mais un algorithme ne peut pas voir :
- L’orientation exacte de votre terrasse et l'absence totale de vis-à-vis.
- La qualité réelle d'une rénovation ou les finitions soignées d'une cuisine.
- Une servitude de passage ou une légère nuisance sonore à 100 mètres.
- La dynamique micro-locale propre à votre commune ou votre quartier.

Résultat ? Deux scénarios dangereux :
1. **Vous sous-estimez** : vous perdez de l'argent sur votre propre patrimoine.
2. **Vous surestimez** : vous bloquez la vente pendant 6 mois pour finir par accepter une offre bien inférieure au prix que vous auriez pu obtenir au début.

À la page 16 de votre guide, je vous explique comment croiser les données DVF (Demandes de Valeurs Foncières) avec l'analyse concurrentielle active pour déterminer votre prix de frappe idéal.

Si vous souhaitez obtenir une analyse comparative réelle basée sur les dernières ventes notariées de votre secteur précis, faites-moi signe en répondant simplement à cet e-mail.

Excellente journée,

Alexandre Lopez`
  },
  {
    id: 3,
    timing: 'J+5',
    dayOffset: 5,
    phase: 'Sécurité & Filtrage Acquéreurs',
    subjectA: 'Les 7 questions à poser avant d’ouvrir votre porte à un inconnu',
    subjectB: 'Visites immobilières : comment repérer les touristes ?',
    preheader: 'Ne perdez plus vos samedis après-midi avec des curieux qui n’ont pas le budget.',
    goal: 'Fournir un script de qualification concret pour éviter les visites inutiles et les risques de défaillance bancaire.',
    psychologyNote: 'Le vendeur commence à recevoir des appels ou se prépare à publier. Il redoute les curieux et les désistements.',
    body: `Bonjour {Prénom},

L'un des aspects les plus épuisants de la vente entre particuliers est ce que l'on appelle dans notre jargon les **"visiteurs du dimanche"** :
- Les voisins curieux qui veulent comparer avec leur propre maison.
- Les personnes en début de réflexion qui "se promènent" sans projet d'achat à court terme.
- Et surtout, les acquéreurs de bonne foi qui ont un coup de cœur... mais dont la banque refusera le prêt 6 semaines plus tard.

Votre temps et votre intimité sont précieux. Vous n'avez pas à ranger votre maison de fond en comble pour des personnes qui ne peuvent pas acheter.

À la page 24 du guide, vous trouverez mon **script de filtrage en 7 questions**.

Voici la question la plus importante à poser systématiquement dès le premier échange téléphonique :

> *« Avez-vous déjà fait valider votre capacité d'emprunt auprès de votre banque ou d'un courtier sous la forme d'une attestation récente ? »*

Un acheteur sérieux et prêt à s'engager ne sera jamais offusqué par cette question ; au contraire, cela prouve votre sérieux et protège les deux parties.

Appliquez ce filtre dès votre premier appel entrant.

À très vite pour la suite,

Alexandre Lopez`
  },
  {
    id: 4,
    timing: 'J+9',
    dayOffset: 9,
    phase: 'Image & Marketing Émotionnel',
    subjectA: 'L’impact d’une photo sur votre prix de vente final',
    subjectB: 'Pourquoi les photos au smartphone coûtent cher aux vendeurs',
    preheader: 'Comment transformer un simple clic en coup de cœur instantané.',
    goal: 'Expliquer le lien direct entre qualité perçue de l’annonce et capacité de négociation du vendeur.',
    psychologyNote: 'Démontrer que des photos de mauvaise qualité n’attirent que des négociateurs agressifs.',
    body: `Bonjour {Prénom},

Aujourd'hui, 95% des projets d'achat démarrent sur un écran de smartphone, au milieu de centaines d'autres annonces consultées en quelques secondes.

L'œil humain met environ **1,5 seconde** pour décider s'il clique sur une annonce ou s'il continue de faire défiler son fil.

Voici ce qui se passe lorsqu'une annonce présente des photos prises au smartphone avec contre-jour, pièces sombres ou lignes déformées :
1. L'acheteur perçoit inconsciemment le bien comme étant de qualité moyenne.
2. Le bien attire des "chasseurs de bonnes affaires" qui viennent expressément pour négocier à la baisse.
3. Vous perdez la clientèle exigeante et solvable qui cherche le coup de cœur.

À l'inverse, une mise en valeur soignée (respect des verticales, luminosité naturelle de la Golden Hour, mise en scène des espaces de vie) crée une sensation d'évidence et de standing.

Dans le guide (pages 19 et 20), je vous partage mes techniques simples pour réaliser vos prises de vue comme un pro avec la lumière naturelle.

Prenez le temps de soigner cette étape : c'est le premier euro investi dans votre rentabilité finale.

Bien à vous,

Alexandre Lopez`
  },
  {
    id: 5,
    timing: 'J+14',
    dayOffset: 14,
    phase: 'Négociation & Psychologie',
    subjectA: 'Vous avez reçu une offre basse ? Ne la refusez pas tout de suite',
    subjectB: 'Négociation immobilière : l’erreur que font 7 vendeurs sur 10',
    preheader: 'Comment transformer une offre décevante en une vente réussie au bon prix.',
    goal: 'Donner la méthode pour contre-attaquer intelligemment lors d’une offre d’achat sans bloquer l’acheteur.',
    psychologyNote: 'À 2 semaines, le vendeur a peut-être reçu sa première offre agressive ou craint d’en recevoir une. Il faut dédramatiser l’émotion.',
    body: `Bonjour {Prénom},

Recevoir une offre d'achat nettement inférieure à son prix affiché est souvent vécu comme une agression ou un manque de respect par les propriétaires.

C'est une réaction humaine : vous vendez un lieu chargé de souvenirs et de valeur personnelle.

Mais en matière de négociation immobilière, **l'émotion est votre pire ennemie**.

Une offre basse n'est pas une insulte : c'est un point de départ. Elle prouve qu'un acheteur s'intéresse concrètement à votre bien et qu'il a pris le temps de formaliser son intérêt par écrit.

Voici la règle d'or (détaillée en page 29 du guide) :  
**Ne refusez jamais une offre par un simple "Non". Répondez toujours par une contre-proposition écrite et argumentée.**

Par exemple :
- Rappelez les points forts uniques de votre bien et les prestations récentes.
- Proposez un ajustement symbolique avec un délai de validité court (48h).
- Exigez en retour une garantie de financement irréprochable ou des conditions suspensives allégées.

70% des acheteurs qui font une offre basse disposent en réalité d'un budget supérieur et testent simplement la solidité du vendeur. Gardez la main sur l'échange.

Des questions sur la rédaction d'une contre-offre ? Répondez-moi simplement à cet e-mail.

Bien cordialement,

Alexandre Lopez`
  },
  {
    id: 6,
    timing: 'J+21',
    dayOffset: 21,
    phase: 'Diagnostic de Vitalité (Mi-Parcours)',
    subjectA: '3 semaines de mise en vente : l’heure du bilan lucide',
    subjectB: 'Votre vente stagne ? Faisons le test des 3 ratios',
    preheader: 'Si vous n’avez pas d’offre solide après 21 jours, voici exactement ce qu’il faut analyser.',
    goal: 'Aider le propriétaire à faire un diagnostic objectif avant que le bien ne devienne obsolète sur les portails.',
    psychologyNote: 'À 3 semaines, l’effet nouveauté s’estompe. Le vendeur ressent le premier doute réel. Le moment est parfait pour être présent en conseiller bienveillant.',
    body: `Bonjour {Prénom},

Si votre bien est en vente depuis environ 3 semaines, vous devez observer l'un de ces 3 scénarios :

**Scénario A : Vous avez des offres sérieuses en cours.**  
Félicitations ! Veillez à vérifier scrupuleusement l'attestation bancaire de l'acquéreur avant de signer quoi que ce soit (reportez-vous à la page 30 du guide pour éviter les blocages chez le notaire).

**Scénario B : Vous avez eu des visites, mais aucune offre.**  
Le problème ne vient pas de votre visibilité, mais du décalage entre l'annonce et la visite sur place. Soit le prix est jugé trop haut par rapport aux biens concurrents visités, soit une objection récurrente (travaux, agencement, luminosité) n'a pas été anticipée et chiffrée.

**Scénario C : Vous n'avez quasiment pas d'appels ni de visites.**  
L'annonce ne capte pas l'attention ou le prix affiché dépasse le seuil psychologique de recherche des acquéreurs de votre secteur.

À la page 18 du guide, vous avez la matrice exacte pour repositionner votre bien avant que l'annonce ne soit considérée comme "brûlée" par le marché.

Prenez 10 minutes pour faire ce bilan en toute objectivité.

Chaleureusement,

Alexandre Lopez`
  },
  {
    id: 7,
    timing: 'J+28',
    dayOffset: 28,
    phase: 'Offre d’Échange & Regard Extérieur',
    subjectA: 'Et si nous prenions un café pour analyser votre stratégie ?',
    subjectB: 'Un regard extérieur (et sans engagement) sur votre vente',
    preheader: '30 minutes d’échange pour débloquer votre situation et sécuriser votre projet.',
    goal: 'Proposer un audit gratuit et sans engagement pour nouer un contact physique ou téléphonique direct.',
    psychologyNote: 'Le vendeur commence à ressentir la fatigue des week-ends bloqués et des démarches. Une proposition douce et sans pression convertit très fort.',
    body: `Bonjour {Prénom},

Vendre son bien par soi-même demande une énergie considérable : répondre aux appels à toute heure, organiser les visites le week-end, gérer les désistements de dernière minute et naviguer dans la complexité juridique du dossier notaire.

C’est un véritable second métier.

Si votre vente avance comme vous le souhaitez, j'en suis sincèrement ravi et je vous souhaite une excellente signature chez votre notaire.

En revanche, si vous ressentez une stagnation, de la fatigue ou si vous avez simplement un doute sur la suite des démarches, je vous propose une chose très simple :

**Un Audit "Regard Extérieur" de 30 minutes, 100% offert et sans aucun engagement.**

Autour d'un café ou directement chez vous :
1. Nous analysons ensemble les retours de vos premières visites.
2. Nous confrontons votre prix aux toutes dernières ventes réelles de votre quartier.
3. Je vous donne 3 axes concrets et immédiats pour relancer l'intérêt des acheteurs.

Si vous souhaitez continuer seul après notre échange, vous garderez mes conseils et nous en resterons là, en toute liberté.

Pour convenir d'un créneau, répondez simplement à cet e-mail avec vos disponibilités ou appelez-moi directement au **06 13 18 01 68**.

À votre écoute,

Alexandre Lopez
Conseiller en Immobilier · Provence Verte & Verdon`
  },
  {
    id: 8,
    timing: 'J+35 (Relance Douce / Clôture)',
    dayOffset: 35,
    phase: 'Sérénité & Porte Ouverte',
    subjectA: 'Une dernière réflexion sur votre projet immobilier',
    subjectB: 'Vendre vite, au bon prix, ou continuer d’attendre ?',
    preheader: 'Pourquoi la sérénité n’a pas de prix dans un projet de vie.',
    goal: 'Dernière prise de contact non intrusive, rappelant que la délégation est l’option de la sérénité.',
    psychologyNote: 'Respect total du choix du prospect. Aucun sentiment de harcèlement, ce qui suscite une immense sympathie et fidélité.',
    body: `Bonjour {Prénom},

Je ne vais pas encombrer davantage votre boîte de réception.

Je voulais simplement vous laisser avec cette réflexion :

Une transaction immobilière réussie n'est pas seulement une question d'argent économisé sur des honoraires. C'est surtout :
- Du temps préservé pour votre famille et votre quotidien.
- L'assurance de ne pas subir un litige juridique post-vente pour un vice caché ou un diagnostic incomplet.
- La certitude que le prix net que vous toucherez chez le notaire a été défendu par un professionnel aguerri.

Si à un moment donné vous souhaitez déléguer l'intégralité de ces démarches pour retrouver votre liberté d'esprit, ma porte vous est grande ouverte.

Conservez précieusement votre guide PDF : il vous accompagnera jusqu'au bout.

Je vous souhaite le meilleur pour la concrétisation de vos projets patrimoniaux.

Bien sincèrement,

Alexandre Lopez
Conseiller Immobilier & Stratégie Patrimoniale
📞 06 13 18 01 68
🌐 alexandrelopez.fr`
  }
]
