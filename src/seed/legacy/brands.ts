import { h3, p, type RichNode } from '../rich'

/**
 * Fiches fabricants de l'ancien site (agencepise.fr, portfolio WordPress), reprises en octobre 2026.
 * Textes français repris tels quels (orthographe et coupures de paragraphes corrigées),
 * traduits en anglais et en italien. Seuls les champs encore vides sont remplis.
 */

export type Locale = 'fr' | 'en' | 'it'
export type T = Record<Locale, string>
export const same = (value: string): T => ({ fr: value, en: value, it: value })

/**
 * Photo à importer : fichier de l'ancien site (chemin relatif à wp-content/uploads/), ou fichier
 * du dépôt (src/seed/images) quand `repo` est vrai.
 */
export type LegacyImage = { file: string; alt: T; repo?: boolean }

/** Photo déjà importée depuis le Drive (src/seed/brands.ts), retrouvée par son fichier d'origine. */
export type SeedImage = { seed: string }

export type LegacyBrand = {
  tagline?: T
  story?: Record<Locale, RichNode[]>
  country?: T
  website?: string
  foundedYear?: number
  certifications?: T
  keyFigures?: { label: T; value: T }[]
  logo?: LegacyImage
}

const logo = (file: string, name: string): LegacyImage => ({
  file,
  alt: { fr: `Logo ${name}`, en: `${name} logo`, it: `Logo ${name}` },
})

const ITALY: T = { fr: 'Italie', en: 'Italy', it: 'Italia' }

const sectorNorthWest: T = {
  fr: 'L’Agence PISE est en charge des parasols Maffei pour le Nord et l’Ouest de la France : toute société dont le siège social y est situé peut s’adresser à nous pour son suivi commercial.',
  en: 'Agence PISE handles Maffei parasols for the north and west of France: any company with its registered office in this area can contact us for commercial follow-up.',
  it: 'L’Agence PISE segue gli ombrelloni Maffei per il nord e l’ovest della Francia: ogni società con sede legale in quest’area può rivolgersi a noi per il seguito commerciale.',
}

/** Fabricants déjà présents sur le nouveau site, par identifiant d'URL. */
export const LEGACY_BRANDS: Record<string, LegacyBrand> = {
  burotime: {
    tagline: { fr: 'Mobilier tertiaire', en: 'Office furniture', it: 'Arredo per ufficio' },
    website: 'https://www.burotime.com/fr/',
    foundedYear: 1984,
    certifications: {
      fr: 'Déclarations environnementales de produits (EPD)',
      en: 'Environmental Product Declarations (EPD)',
      it: 'Dichiarazioni ambientali di prodotto (EPD)',
    },
    keyFigures: [
      {
        label: { fr: 'Présence commerciale', en: 'Sales presence', it: 'Presenza commerciale' },
        value: { fr: 'Plus de 50 pays', en: '50+ countries', it: 'Oltre 50 paesi' },
      },
      {
        label: { fr: 'Site de production', en: 'Production site', it: 'Sito produttivo' },
        value: { fr: '150 000 m²', en: '150,000 m²', it: '150.000 m²' },
      },
      {
        label: { fr: 'Références', en: 'Product references', it: 'Referenze' },
        value: { fr: 'Plus de 2 800', en: '2,800+', it: 'Oltre 2.800' },
      },
    ],
    logo: logo('2026/05/burotime-logo.webp', 'Bürotime'),
    story: {
      fr: [
        p(
          'Fondée en 1984 en Turquie, Bürotime s’est imposée en quatre décennies comme l’un des fabricants de mobilier de bureau les plus importants d’Europe et du Moyen-Orient, avec une présence commerciale dans plus de 50 pays. Intégralement intégrée verticalement — de la fonderie à l’assemblage final — sur un site de production de 150 000 m², l’entreprise maîtrise l’ensemble de sa chaîne de valeur, ce qui lui confère une compétitivité tarifaire structurelle rare sur le marché européen.',
        ),
        p(
          'Son catalogue de plus de 2 800 références couvre l’intégralité des besoins d’un projet d’aménagement tertiaire : sièges opérateurs et de direction, mobilier lounge, bureaux et postes de travail, rangements modulaires, solutions acoustiques et accessoires de connectivité. Les collections sont développées en collaboration avec des designers européens et récompensées dans les grands salons internationaux du secteur, dont Orgatec. Engagée dans une démarche de responsabilité environnementale, Bürotime publie des déclarations environnementales de produits (EPD) et intègre des matériaux recyclables dans ses gammes clés.',
        ),
        p(
          'C’est dans ce contexte que Bürotime engage son développement sur le marché français, avec l’ambition d’y apporter une alternative sérieuse aux marques premium établies — un niveau de qualité et de design équivalent, pour un investissement sensiblement inférieur.',
        ),
      ],
      en: [
        p(
          'Founded in 1984 in Türkiye, Bürotime has grown over four decades into one of the largest office furniture manufacturers in Europe and the Middle East, with a commercial presence in more than 50 countries. Fully vertically integrated — from the foundry to final assembly — on a 150,000 m² production site, the company controls its entire value chain, which gives it a structural price competitiveness that is rare on the European market.',
        ),
        p(
          'Its catalogue of more than 2,800 references covers every need of an office fit-out project: task and executive chairs, lounge furniture, desks and workstations, modular storage, acoustic solutions and connectivity accessories. The collections are developed with European designers and have won awards at the sector’s major international fairs, including Orgatec. Committed to environmental responsibility, Bürotime publishes Environmental Product Declarations (EPD) and uses recyclable materials in its key ranges.',
        ),
        p(
          'Against this backdrop, Bürotime is now expanding into the French market, aiming to offer a serious alternative to the established premium brands — equivalent quality and design, for a significantly lower investment.',
        ),
      ],
      it: [
        p(
          'Fondata nel 1984 in Turchia, in quattro decenni Bürotime si è affermata come uno dei principali produttori di arredi per ufficio d’Europa e del Medio Oriente, con una presenza commerciale in oltre 50 paesi. Completamente integrata verticalmente — dalla fonderia all’assemblaggio finale — su un sito produttivo di 150.000 m², l’azienda controlla l’intera catena del valore, il che le conferisce una competitività di prezzo strutturale rara sul mercato europeo.',
        ),
        p(
          'Il suo catalogo di oltre 2.800 referenze copre tutte le esigenze di un progetto di allestimento per uffici: sedute operative e direzionali, arredi lounge, scrivanie e postazioni di lavoro, contenitori modulari, soluzioni acustiche e accessori di connettività. Le collezioni sono sviluppate con designer europei e premiate nelle principali fiere internazionali del settore, tra cui Orgatec. Impegnata sul fronte della responsabilità ambientale, Bürotime pubblica dichiarazioni ambientali di prodotto (EPD) e integra materiali riciclabili nelle sue gamme principali.',
        ),
        p(
          'In questo contesto Bürotime avvia il proprio sviluppo sul mercato francese, con l’ambizione di offrire un’alternativa seria ai marchi premium affermati: lo stesso livello di qualità e design, per un investimento sensibilmente inferiore.',
        ),
      ],
    },
  },

  maffei: {
    country: ITALY,
    tagline: {
      fr: 'Parasols et housses de protection',
      en: 'Parasols and protective covers',
      it: 'Ombrelloni e coperture protettive',
    },
    website: 'https://www.maffeisrl.com/fr/',
    foundedYear: 1953,
    logo: logo('2025/07/LOGO-1-pdf-300x212.jpg', 'Maffei'),
    story: {
      fr: [
        h3('Fabricant italien de parasols depuis 1953'),
        p(
          'Maffei srl est un fabricant italien de parasols reconnu pour son savoir-faire familial depuis plus de 70 ans. Fondée officiellement en 1953, l’entreprise trouve ses origines dès 1906 avec l’ouverture d’une première boutique de chapeaux et de parapluies. Depuis les années 1980, Maffei s’est spécialisée dans la fabrication de parasols haut de gamme pour les particuliers et les professionnels.',
        ),
        p(
          'Installée en Italie, l’usine Maffei propose une large gamme de parasols design et durables, déclinés en plusieurs formes, tailles et coloris. Deux lignes distinctes sont développées : Maffei (lignes classiques) et Mapro (gamme professionnelle). Chaque parasol est pensé pour créer une harmonie esthétique entre les modèles, grâce à une cohérence dans les teintes de tissus, les structures et les finitions.',
        ),
        h3('Une qualité au cœur de chaque produit'),
        p(
          'Maffei sélectionne soigneusement les tissus et collabore avec des fournisseurs spécialisés pour les structures. Cette approche permet de proposer une grande variété de modèles tout en garantissant un excellent rapport qualité/prix. La gamme couvre aussi bien les petits parasols de terrasse que les modèles plus grands pour piscines ou restaurants.',
        ),
        h3('Flexibilité et services sur mesure'),
        p(
          'L’usine est capable de répondre à des demandes spécifiques, même en petites quantités, notamment pour les housses personnalisées. Maffei travaille aussi bien avec des grandes marques qu’avec de petits distributeurs.',
        ),
        h3('SAV et pièces détachées'),
        p(
          'Maffei assure un service après-vente efficace avec une disponibilité des pièces détachées pendant au moins 3 ans après la fin de commercialisation d’un modèle.',
        ),
        p(sectorNorthWest.fr),
      ],
      en: [
        h3('Italian parasol manufacturer since 1953'),
        p(
          'Maffei srl is an Italian parasol manufacturer renowned for more than 70 years of family know-how. Officially founded in 1953, the company’s origins go back to 1906, when it opened its first hat and umbrella shop. Since the 1980s, Maffei has specialised in high-end parasols for private and professional customers.',
        ),
        p(
          'Based in Italy, the Maffei factory offers a wide range of durable design parasols in several shapes, sizes and colours. Two distinct lines are developed: Maffei (classic lines) and Mapro (professional range). Every parasol is designed to create aesthetic harmony across the models, through consistent fabric colours, structures and finishes.',
        ),
        h3('Quality at the heart of every product'),
        p(
          'Maffei carefully selects its fabrics and works with specialist suppliers for the structures. This approach makes it possible to offer a wide variety of models while guaranteeing excellent value for money. The range covers everything from small terrace parasols to larger models for pools and restaurants.',
        ),
        h3('Flexibility and bespoke services'),
        p(
          'The factory can meet specific requests, even in small quantities, especially for custom covers. Maffei works with major brands and small retailers alike.',
        ),
        h3('After-sales service and spare parts'),
        p(
          'Maffei provides efficient after-sales service, with spare parts available for at least 3 years after a model is discontinued.',
        ),
        p(sectorNorthWest.en),
      ],
      it: [
        h3('Produttore italiano di ombrelloni dal 1953'),
        p(
          'Maffei srl è un produttore italiano di ombrelloni rinomato per un savoir-faire familiare di oltre 70 anni. Fondata ufficialmente nel 1953, l’azienda affonda le sue radici nel 1906, con l’apertura di un primo negozio di cappelli e ombrelli. Dagli anni Ottanta Maffei si è specializzata nella produzione di ombrelloni di alta gamma per privati e professionisti.',
        ),
        p(
          'Con sede in Italia, lo stabilimento Maffei propone un’ampia gamma di ombrelloni di design e durevoli, declinati in diverse forme, misure e colori. Sono sviluppate due linee distinte: Maffei (linee classiche) e Mapro (gamma professionale). Ogni ombrellone è pensato per creare un’armonia estetica tra i modelli, grazie alla coerenza delle tinte dei tessuti, delle strutture e delle finiture.',
        ),
        h3('La qualità al centro di ogni prodotto'),
        p(
          'Maffei seleziona con cura i tessuti e collabora con fornitori specializzati per le strutture. Questo approccio permette di proporre una grande varietà di modelli garantendo un ottimo rapporto qualità/prezzo. La gamma comprende sia i piccoli ombrelloni da terrazza sia i modelli più grandi per piscine o ristoranti.',
        ),
        h3('Flessibilità e servizi su misura'),
        p(
          'Lo stabilimento è in grado di rispondere a richieste specifiche, anche in piccole quantità, in particolare per le coperture personalizzate. Maffei lavora sia con grandi marchi sia con piccoli distributori.',
        ),
        h3('Assistenza post-vendita e ricambi'),
        p(
          'Maffei garantisce un servizio post-vendita efficiente, con ricambi disponibili per almeno 3 anni dopo la fine della commercializzazione di un modello.',
        ),
        p(sectorNorthWest.it),
      ],
    },
  },

  'milla-et-milli': {
    country: { fr: 'Croatie', en: 'Croatia', it: 'Croazia' },
    tagline: same('Luxury Living'),
    website: 'https://millamilli.com/',
    logo: logo('2024/02/LOGO-MILLA-MILLI.png', 'Milla & Milli'),
    story: {
      fr: [
        h3('Une proclamation d’amour'),
        p(
          'Milla & Milli est née de l’idée originale de deux amateurs d’art ; le rêve partagé de deux âmes amoureuses du design, du bois et l’une de l’autre. Et à ce jour, cet amour et cette passion sont toujours clairement incarnés dans chaque création.',
        ),
        h3('Une ode à Mère Nature'),
        p(
          'Ils se voient d’abord comme des réalisateurs, ensuite comme des communicateurs. Leur message n’est donc pas exprimé par des mots, mais par des actions authentiques et déterminées. Ils vous invitent à participer à cette démarche. Leur promesse est de donner naissance à un nouvel environnement, en plantant un arbre pour chaque meuble vendu. De cette manière, la forêt qui s’étend autour de leurs locaux devient un témoignage vivant de leur objectif partagé : sauvegarder et honorer la nature.',
        ),
      ],
      en: [
        h3('A declaration of love'),
        p(
          'Milla & Milli was born from the original idea of two art lovers: the shared dream of two souls in love with design, with wood and with each other. To this day, that love and passion are still clearly embodied in every piece.',
        ),
        h3('An ode to Mother Nature'),
        p(
          'They see themselves first as makers, then as communicators. Their message is therefore expressed not in words but through authentic, determined action, and they invite you to take part. Their promise is to give rise to a new environment by planting a tree for every piece of furniture sold. In this way, the forest that grows around their premises becomes a living testimony to their shared goal: to protect and honour nature.',
        ),
      ],
      it: [
        h3('Una dichiarazione d’amore'),
        p(
          'Milla & Milli nasce dall’idea originale di due amanti dell’arte: il sogno condiviso di due anime innamorate del design, del legno e l’una dell’altra. Ancora oggi questo amore e questa passione si ritrovano chiaramente in ogni creazione.',
        ),
        h3('Un’ode a Madre Natura'),
        p(
          'Si considerano prima di tutto realizzatori, poi comunicatori. Il loro messaggio non si esprime quindi a parole, ma con azioni autentiche e determinate, a cui vi invitano a partecipare. La loro promessa è dare vita a un nuovo ambiente piantando un albero per ogni mobile venduto. Così la foresta che si estende intorno alla loro sede diventa una testimonianza vivente del loro obiettivo comune: salvaguardare e onorare la natura.',
        ),
      ],
    },
  },

  axolight: {
    tagline: {
      fr: 'Luminaires décoratifs haut de gamme',
      en: 'High-end decorative lighting',
      it: 'Illuminazione decorativa di alta gamma',
    },
    website: 'https://www.axolight.it/en/',
    logo: logo('2015/02/LOGO-AXOLIGHT-8.png', 'Axolight'),
    story: {
      fr: [
        p(
          'Axolight, une entreprise d’éclairage italo-américaine, met l’accent sur la responsabilité créative, l’éthique et la durabilité dans la production de lampes design haut de gamme. Chaque modèle est minutieusement fabriqué à la main à Scorzè, Venise, incarnant le concept de « Design That Lasts ». Axolight privilégie la qualité, la responsabilité créative et un faible impact environnemental, utilisant des matériaux tels que le nylon recyclé, la fibre de verre et l’aluminium dans leurs lampes. L’entreprise respecte les réglementations internationales pour la protection individuelle et environnementale, fusionnant l’artisanat italien avec les technologies d’éclairage avancées.',
        ),
        h3('Responsabilité créative, éthique et durabilité : les valeurs signature d’Axolight'),
        p(
          '« Pour obtenir des produits de qualité supérieure, nous investissons dans les idées et mettons l’accent sur une éthique de travail, en maintenant le niveau culturel de notre personnel élevé et l’impact environnemental aussi bas que possible », explique le PDG Giuseppe Scaturro.',
        ),
        p(
          'Regarder l’avenir avec une approche responsable, éthique et durable : voilà les valeurs fondamentales d’Axolight, une entreprise d’éclairage avec des branches en Italie et aux États-Unis qui conçoit et produit des lampes de designer haut de gamme.',
        ),
        p(
          'Chaque modèle Axolight, aussi bien les produits en série que les articles sur mesure, est conçu, développé, testé et assemblé à la main dans l’atelier de l’entreprise à Scorzè, Venise. L’accent sur la qualité se reflète dans l’attention minutieuse portée aux détails qui caractérise chaque lampe Axolight. L’entreprise est l’ambassadrice du concept de « Design That Lasts », produisant des objets de designer destinés à être transmis de génération en génération, alliant une durabilité signature, une fonctionnalité structurelle contemporaine et une gestion efficace de la luminosité et du confort visuel.',
        ),
        p(
          'Pour créer ses produits, Axolight travaille avec une douzaine de matériaux, principalement des métaux, des tissus et du verre. La qualité de chaque lampe est façonnée par la responsabilité créative de notre équipe de designers, pour la plupart des femmes, dans laquelle l’entreprise croit et investit en récompensant leurs efforts. Cela crée un environnement de travail stimulant, créant un terrain fertile pour que les idées les plus originales soient transformées en lumières qui apportent une contribution unique et surprenante à la décoration.',
        ),
        p(
          'La qualité et la responsabilité créative ne peuvent exister sans une approche durable et un désir de minimiser l’impact environnemental. En 2018, nous avons présenté au marché Jewel, notre premier produit fabriqué à partir de nylon recyclé et de fibre de verre et d’aluminium, et 2020 a vu le lancement de l’emblématique Bul-Bo, dont la finition polie de la tige en aluminium est obtenue à l’aide d’un processus de brossage particulier plutôt que d’électroplacage. Tous les produits Axolight sont fabriqués conformément aux réglementations internationales garantissant le respect des individus et la protection de l’environnement.',
        ),
        p(
          'Les collections de luminaires Axolight intègrent exclusivement l’expertise de l’artisanat italien, la combinant avec les technologies d’éclairage les plus avancées, représentant le chemin emprunté par une entreprise qui regarde vers l’avenir avec une approche animée par l’innovation et le changement.',
        ),
      ],
      en: [
        p(
          'Axolight, an Italian-American lighting company, puts the emphasis on creative responsibility, ethics and sustainability in the production of high-end designer lamps. Every model is carefully handmade in Scorzè, Venice, embodying the concept of “Design That Lasts”. Axolight prioritises quality, creative responsibility and a low environmental impact, using materials such as recycled nylon, fibreglass and aluminium in its lamps. The company complies with international regulations on personal and environmental protection, combining Italian craftsmanship with advanced lighting technologies.',
        ),
        h3('Creative responsibility, ethics and sustainability: Axolight’s signature values'),
        p(
          '“To achieve superior quality products, we invest in ideas and focus on a work ethic, keeping the cultural level of our staff high and the environmental impact as low as possible,” explains CEO Giuseppe Scaturro.',
        ),
        p(
          'Looking to the future with a responsible, ethical and sustainable approach: these are the core values of Axolight, a lighting company with branches in Italy and the United States that designs and produces high-end designer lamps.',
        ),
        p(
          'Every Axolight model, from series production to custom pieces, is designed, developed, tested and assembled by hand in the company’s workshop in Scorzè, Venice. The focus on quality shows in the meticulous attention to detail that characterises every Axolight lamp. The company is an ambassador of the “Design That Lasts” concept, producing designer objects meant to be handed down from generation to generation, combining signature durability, contemporary structural functionality and efficient management of brightness and visual comfort.',
        ),
        p(
          'To create its products, Axolight works with a dozen materials, mainly metals, fabrics and glass. The quality of each lamp is shaped by the creative responsibility of our team of designers, most of them women, in whom the company believes and invests by rewarding their efforts. This creates a stimulating working environment, fertile ground for the most original ideas to be turned into lights that make a unique and surprising contribution to interior design.',
        ),
        p(
          'Quality and creative responsibility cannot exist without a sustainable approach and a desire to minimise environmental impact. In 2018 we brought Jewel to market, our first product made from recycled nylon, fibreglass and aluminium, and 2020 saw the launch of the iconic Bul-Bo, whose polished aluminium stem finish is obtained through a special brushing process rather than electroplating. All Axolight products are manufactured in accordance with international regulations guaranteeing respect for people and protection of the environment.',
        ),
        p(
          'Axolight’s lighting collections draw exclusively on the expertise of Italian craftsmanship, combining it with the most advanced lighting technologies — the path taken by a company that looks to the future with an approach driven by innovation and change.',
        ),
      ],
      it: [
        p(
          'Axolight, azienda di illuminazione italo-americana, pone l’accento sulla responsabilità creativa, sull’etica e sulla sostenibilità nella produzione di lampade di design di alta gamma. Ogni modello è realizzato a mano con cura a Scorzè, Venezia, e incarna il concetto di “Design That Lasts”. Axolight privilegia la qualità, la responsabilità creativa e un basso impatto ambientale, utilizzando nelle sue lampade materiali come il nylon riciclato, la fibra di vetro e l’alluminio. L’azienda rispetta le normative internazionali per la tutela delle persone e dell’ambiente, unendo l’artigianato italiano alle tecnologie di illuminazione più avanzate.',
        ),
        h3('Responsabilità creativa, etica e sostenibilità: i valori distintivi di Axolight'),
        p(
          '«Per ottenere prodotti di qualità superiore investiamo nelle idee e puntiamo su un’etica del lavoro, mantenendo alto il livello culturale del nostro personale e l’impatto ambientale il più basso possibile», spiega l’amministratore delegato Giuseppe Scaturro.',
        ),
        p(
          'Guardare al futuro con un approccio responsabile, etico e sostenibile: sono questi i valori fondamentali di Axolight, azienda di illuminazione con sedi in Italia e negli Stati Uniti che progetta e produce lampade di design di alta gamma.',
        ),
        p(
          'Ogni modello Axolight, sia di serie sia su misura, è progettato, sviluppato, testato e assemblato a mano nel laboratorio dell’azienda a Scorzè, Venezia. L’attenzione alla qualità si riflette nella cura minuziosa dei dettagli che caratterizza ogni lampada Axolight. L’azienda è ambasciatrice del concetto di “Design That Lasts” e produce oggetti di design destinati a essere tramandati di generazione in generazione, unendo una durabilità distintiva, una funzionalità strutturale contemporanea e una gestione efficace della luminosità e del comfort visivo.',
        ),
        p(
          'Per creare i suoi prodotti Axolight lavora con una dozzina di materiali, principalmente metalli, tessuti e vetro. La qualità di ogni lampada nasce dalla responsabilità creativa del nostro team di designer, composto per lo più da donne, in cui l’azienda crede e investe premiandone l’impegno. Ne deriva un ambiente di lavoro stimolante, terreno fertile perché le idee più originali si trasformino in luci che apportano un contributo unico e sorprendente all’arredamento.',
        ),
        p(
          'Qualità e responsabilità creativa non possono esistere senza un approccio sostenibile e la volontà di ridurre al minimo l’impatto ambientale. Nel 2018 abbiamo presentato sul mercato Jewel, il nostro primo prodotto realizzato in nylon riciclato, fibra di vetro e alluminio, e il 2020 ha visto il lancio dell’iconica Bul-Bo, la cui finitura lucida dello stelo in alluminio si ottiene con un particolare processo di spazzolatura anziché con la galvanizzazione. Tutti i prodotti Axolight sono fabbricati nel rispetto delle normative internazionali che garantiscono il rispetto delle persone e la tutela dell’ambiente.',
        ),
        p(
          'Le collezioni di illuminazione Axolight si basano esclusivamente sulla maestria dell’artigianato italiano, unita alle tecnologie di illuminazione più avanzate: il percorso di un’azienda che guarda al futuro con un approccio guidato dall’innovazione e dal cambiamento.',
        ),
      ],
    },
  },

  fabbian: {
    tagline: {
      fr: 'Systèmes d’éclairage et de décors lumineux',
      en: 'Lighting systems and decorative lighting',
      it: 'Sistemi di illuminazione e decorazioni luminose',
    },
    website: 'https://www.fabbian.com/en',
    foundedYear: 1961,
    logo: logo('2015/02/LOGO-FABBIAN-1200x1200.png', 'Fabbian'),
    story: {
      fr: [
        p(
          'Fabbian a été fondée en 1961 en tant qu’entreprise fabriquant des appareils d’éclairage à usage résidentiel et commercial. Cette culture, associée à la tradition et à la qualité, a toujours inspiré nos produits, permettant à l’entreprise d’obtenir une reconnaissance et une notoriété internationales. De grands résultats ont été obtenus grâce à une recherche continue visant à interpréter la demande du marché, tout en mettant en œuvre des stratégies marketing et publicitaires spécifiques.',
        ),
        p(
          'L’entreprise est basée dans le nord-est de l’Italie, où toutes les collections sont conçues, développées et fabriquées. Grâce à la collaboration avec des architectes et des designers renommés et à une usine de production technologiquement avancée, tous les produits ont leur propre design distinctif.',
        ),
        p(
          'Depuis mai 2018, Fabbian a changé de propriétaire : elle a été acquise par l’entrepreneur Luca Pellegrino, qui a apporté une nouvelle vision d’entreprise remplie de nouveaux projets, et a transformé tous les produits en produits à faible consommation d’énergie et respectueux de l’environnement, combinant ainsi design et durabilité.',
        ),
        p(
          'L’entreprise est basée en Italie, où toutes les collections sont fabriquées. Grâce à la collaboration avec de nombreux designers internationaux, l’entreprise réinterprète personnellement le design moderne à travers différents styles et une technologie de production de pointe.',
        ),
        p(
          'La qualité élevée et les composants fiables sont une partie essentielle des produits. La construction, l’assemblage et le câblage des produits sont réalisés avec soin, grâce à des systèmes flexibles. Chaque étape du cycle de production est contrôlée afin d’obtenir des produits conformes aux réglementations de sécurité standard. En effet, les produits Fabbian répondent aux strictes exigences imposées par les principales autorités de certification internationales.',
        ),
        p(
          'De plus, l’entreprise propose un service après-vente. Non seulement Fabbian fournit des informations et des solutions concernant l’utilisation de ses produits, mais elle soutient également les clients grâce à un service efficace de pièces de rechange.',
        ),
        p(
          'Fabbian commercialise ses produits grâce à un réseau bien établi d’agents et de détaillants en Europe, au Moyen-Orient et en Asie. Quant au marché américain, Fabbian atteint ses clients grâce à une société affiliée basée à New York.',
        ),
      ],
      en: [
        p(
          'Fabbian was founded in 1961 as a manufacturer of lighting fixtures for residential and commercial use. This culture, combined with tradition and quality, has always inspired our products and earned the company international recognition and renown. Great results have been achieved through continuous research aimed at interpreting market demand, while implementing specific marketing and advertising strategies.',
        ),
        p(
          'The company is based in north-eastern Italy, where all the collections are designed, developed and manufactured. Thanks to collaborations with renowned architects and designers and a technologically advanced production plant, every product has its own distinctive design.',
        ),
        p(
          'Since May 2018 Fabbian has had a new owner: it was acquired by entrepreneur Luca Pellegrino, who brought a new business vision full of new projects and turned the entire range into low-energy, environmentally friendly products, combining design and sustainability.',
        ),
        p(
          'The company is based in Italy, where all the collections are manufactured. Working with many international designers, it offers its own interpretation of modern design through different styles and state-of-the-art production technology.',
        ),
        p(
          'High quality and reliable components are an essential part of the products. Construction, assembly and wiring are carried out with care, using flexible systems. Every stage of the production cycle is checked to ensure products comply with standard safety regulations. Fabbian products meet the strict requirements of the leading international certification bodies.',
        ),
        p(
          'The company also offers an after-sales service. Fabbian not only provides information and solutions on the use of its products, but also supports customers with an efficient spare parts service.',
        ),
        p(
          'Fabbian sells its products through a well-established network of agents and retailers in Europe, the Middle East and Asia. In the American market, Fabbian reaches its customers through an affiliated company based in New York.',
        ),
      ],
      it: [
        p(
          'Fabbian è stata fondata nel 1961 come azienda produttrice di apparecchi di illuminazione per uso residenziale e commerciale. Questa cultura, unita alla tradizione e alla qualità, ha sempre ispirato i nostri prodotti, permettendo all’azienda di ottenere riconoscimento e notorietà internazionali. Grandi risultati sono stati raggiunti grazie a una ricerca continua volta a interpretare la domanda del mercato, insieme a strategie di marketing e comunicazione mirate.',
        ),
        p(
          'L’azienda ha sede nel nord-est dell’Italia, dove tutte le collezioni vengono progettate, sviluppate e prodotte. Grazie alla collaborazione con architetti e designer di fama e a uno stabilimento produttivo tecnologicamente avanzato, ogni prodotto ha un design distintivo.',
        ),
        p(
          'Da maggio 2018 Fabbian ha un nuovo proprietario: è stata acquisita dall’imprenditore Luca Pellegrino, che ha portato una nuova visione aziendale ricca di progetti e ha trasformato tutti i prodotti in prodotti a basso consumo energetico e rispettosi dell’ambiente, unendo design e sostenibilità.',
        ),
        p(
          'L’azienda ha sede in Italia, dove vengono prodotte tutte le collezioni. Grazie alla collaborazione con numerosi designer internazionali, reinterpreta il design moderno attraverso stili diversi e una tecnologia produttiva all’avanguardia.',
        ),
        p(
          'L’alta qualità e l’affidabilità dei componenti sono parte essenziale dei prodotti. Costruzione, assemblaggio e cablaggio sono eseguiti con cura, grazie a sistemi flessibili. Ogni fase del ciclo produttivo è controllata per ottenere prodotti conformi alle norme di sicurezza. I prodotti Fabbian soddisfano infatti i severi requisiti dei principali enti di certificazione internazionali.',
        ),
        p(
          'L’azienda offre inoltre un servizio post-vendita. Fabbian non solo fornisce informazioni e soluzioni sull’uso dei suoi prodotti, ma assiste anche i clienti con un efficiente servizio ricambi.',
        ),
        p(
          'Fabbian commercializza i suoi prodotti attraverso una rete consolidata di agenti e rivenditori in Europa, Medio Oriente e Asia. Sul mercato americano raggiunge i clienti tramite una società affiliata con sede a New York.',
        ),
      ],
    },
  },

  'johanson-design': {
    tagline: {
      fr: 'Mobilier éco-responsable',
      en: 'Eco-responsible furniture',
      it: 'Arredi eco-responsabili',
    },
    website: 'https://johansondesign.com/fr',
    foundedYear: 1953,
    certifications: same('ISO 14001, Möbelfakta'),
    keyFigures: [
      {
        label: { fr: 'Collaborateurs', en: 'Employees', it: 'Collaboratori' },
        value: { fr: 'Plus de 100', en: '100+', it: 'Oltre 100' },
      },
      {
        label: { fr: 'Chiffre d’affaires annuel', en: 'Annual turnover', it: 'Fatturato annuo' },
        value: { fr: 'Environ 25 M€', en: 'About €25m', it: 'Circa 25 M€' },
      },
    ],
    logo: logo('2015/02/LOGO-JOHANSON-8.png', 'Johanson Design'),
    story: {
      fr: [
        p(
          'L’histoire JOHANSON DESIGN a débuté en 1953 lorsque Börje Johanson a créé une entreprise de fabrication de coussins. Au fil des ans, nous nous sommes concentrés sur le design scandinave et la fabrication artisanale, ce qui nous a permis d’atteindre un public international. Les collections JOHANSON DESIGN sont développées en collaboration avec d’éminents designers européens, qui apportent leur créativité à nos produits. Nous avons un contrôle total sur la fabrication de nos meubles, de la coupe à l’assemblage, dans nos usines en Suède. La qualité, l’environnement et les normes de durabilité sont essentielles pour nous, et nous sommes certifiés ISO 14001 et Möbelfakta. Avec plus de 100 employés, JOHANSON DESIGN réalise un chiffre d’affaires annuel d’environ 25 millions d’euros. Nos designs scandinaves intemporels sont très demandés dans le monde entier, et nous visons à croître tout en maintenant la qualité et le service pour nos clients fidèles.',
        ),
      ],
      en: [
        p(
          'The JOHANSON DESIGN story began in 1953, when Börje Johanson set up a company making cushions. Over the years we have focused on Scandinavian design and craftsmanship, which has allowed us to reach an international audience. JOHANSON DESIGN collections are developed with leading European designers, who bring their creativity to our products. We have full control over the manufacturing of our furniture, from cutting to assembly, in our factories in Sweden. Quality, environmental and sustainability standards are essential to us, and we are ISO 14001 and Möbelfakta certified. With more than 100 employees, JOHANSON DESIGN has an annual turnover of around €25 million. Our timeless Scandinavian designs are in demand all over the world, and we aim to grow while maintaining quality and service for our loyal customers.',
        ),
      ],
      it: [
        p(
          'La storia di JOHANSON DESIGN è iniziata nel 1953, quando Börje Johanson fondò un’azienda produttrice di cuscini. Nel corso degli anni ci siamo concentrati sul design scandinavo e sulla produzione artigianale, raggiungendo così un pubblico internazionale. Le collezioni JOHANSON DESIGN sono sviluppate in collaborazione con importanti designer europei, che portano la loro creatività nei nostri prodotti. Controlliamo interamente la produzione dei nostri mobili, dal taglio all’assemblaggio, nei nostri stabilimenti in Svezia. Qualità, ambiente e sostenibilità sono essenziali per noi e siamo certificati ISO 14001 e Möbelfakta. Con oltre 100 dipendenti, JOHANSON DESIGN realizza un fatturato annuo di circa 25 milioni di euro. I nostri design scandinavi senza tempo sono richiesti in tutto il mondo e puntiamo a crescere mantenendo qualità e servizio per i nostri clienti fedeli.',
        ),
      ],
    },
  },

  nardi: {
    tagline: { fr: 'Mobilier outdoor', en: 'Outdoor furniture', it: 'Arredo outdoor' },
    website: 'https://www.nardioutdoor.com/fr',
    keyFigures: [
      { label: { fr: 'Usines', en: 'Factories', it: 'Stabilimenti' }, value: same('3') },
      {
        label: { fr: 'Presses à injection', en: 'Injection presses', it: 'Presse a iniezione' },
        value: same('26'),
      },
      {
        label: { fr: 'Produits en stock', en: 'Products in stock', it: 'Prodotti a magazzino' },
        value: same('195'),
      },
    ],
    logo: logo('2015/02/LOGO-NARDI.png', 'Nardi'),
    story: {
      fr: [
        p(
          'Nardi fabrique depuis 30 ans du mobilier outdoor en résine. Le site industriel situé à Chiampo, au nord de Venise, est totalement intégré et regroupe au sein de ses 3 usines 26 presses à injection, ainsi qu’un atelier de fabrication pour les moules et un atelier dédié au travail de l’aluminium. Les entrepôts de stockage sont également largement dimensionnés et permettent de maintenir en stock la totalité des 195 produits, qui sont fabriqués sur place. Les délais sont ainsi garantis. La direction de la société affiche clairement une volonté de préservation de l’environnement, avec une démarche éco-responsable tant sur l’utilisation de matières recyclées et recyclables qu’en optimisant les dépenses énergétiques.',
        ),
        p(
          'L’Agence PISE est en charge de Nardi Outdoor pour le Nord de la France : toute société dont le siège social y est situé peut s’adresser à nous pour son suivi commercial.',
        ),
      ],
      en: [
        p(
          'Nardi has been making resin outdoor furniture for 30 years. Its fully integrated industrial site in Chiampo, north of Venice, brings together 26 injection presses across its 3 factories, along with a mould-making workshop and a workshop dedicated to aluminium. The warehouses are also generously sized, so that all 195 products, made on site, are kept in stock — which guarantees lead times. The management is clearly committed to protecting the environment, with an eco-responsible approach covering both the use of recycled and recyclable materials and the optimisation of energy use.',
        ),
        p(
          'Agence PISE handles Nardi Outdoor for the north of France: any company with its registered office in this area can contact us for commercial follow-up.',
        ),
      ],
      it: [
        p(
          'Da 30 anni Nardi produce arredi outdoor in resina. Il sito industriale di Chiampo, a nord di Venezia, è completamente integrato e riunisce nei suoi 3 stabilimenti 26 presse a iniezione, oltre a un’officina per la costruzione degli stampi e a un reparto dedicato alla lavorazione dell’alluminio. Anche i magazzini sono ampiamente dimensionati e permettono di tenere a stock tutti i 195 prodotti, fabbricati in sede: i tempi di consegna sono così garantiti. La direzione dell’azienda mostra una chiara volontà di tutelare l’ambiente, con un approccio eco-responsabile sia nell’uso di materiali riciclati e riciclabili sia nell’ottimizzazione dei consumi energetici.',
        ),
        p(
          'L’Agence PISE segue Nardi Outdoor per il nord della Francia: ogni società con sede legale in quest’area può rivolgersi a noi per il seguito commerciale.',
        ),
      ],
    },
  },

  system180: {
    tagline: {
      fr: 'Solutions de mobilier agiles et évolutives',
      en: 'Agile, adaptable furniture solutions',
      it: 'Soluzioni d’arredo agili ed evolutive',
    },
    website: 'https://www.system180.com/en/',
    logo: logo('2015/02/LOGO-SYSTEM-180-8-1200x159.png', 'System180'),
    story: {
      fr: [
        p(
          'Système 180 est une entreprise berlinoise spécialisée dans le mobilier de bureau modulaire, offrant des solutions d’aménagement sur mesure pour les espaces de vie et de travail. Elle combine design et fonctionnalité pour équilibrer les zones individuelles et communautaires dans les bureaux modernes. Leur gamme inclut des systèmes de partitionnement statiques et mobiles, adaptés à différents styles architecturaux. En plus, Système 180 propose des meubles de rangement modulables, des tables variées et des accessoires pour des solutions de travail collaboratif et créatif. Leur approche est centrée sur la flexibilité, l’innovation et la qualité, répondant aux besoins dynamiques des environnements de travail contemporains.',
        ),
      ],
      en: [
        p(
          'System 180 is a Berlin-based company specialising in modular office furniture, offering tailored layout solutions for living and working spaces. It combines design and functionality to balance individual and shared areas in modern offices. Its range includes static and mobile partitioning systems suited to different architectural styles. System 180 also offers modular storage furniture, a variety of tables and accessories for collaborative and creative working. Its approach centres on flexibility, innovation and quality, meeting the dynamic needs of contemporary workplaces.',
        ),
      ],
      it: [
        p(
          'System 180 è un’azienda berlinese specializzata in arredi modulari per ufficio, che offre soluzioni di allestimento su misura per gli spazi di vita e di lavoro. Unisce design e funzionalità per bilanciare zone individuali e comuni negli uffici moderni. La sua gamma comprende sistemi di partizione statici e mobili, adatti a diversi stili architettonici. System 180 propone inoltre contenitori modulari, tavoli di vario tipo e accessori per soluzioni di lavoro collaborativo e creativo. Il suo approccio è incentrato su flessibilità, innovazione e qualità, per rispondere alle esigenze dinamiche degli ambienti di lavoro contemporanei.',
        ),
      ],
    },
  },
}

export type LegacyRange = {
  brand: string
  name: string
  slug: string
  designer?: string
  summary: T
  description: Record<Locale, RichNode[]>
  image: LegacyImage
}

/** Noon et Decibel, marques du groupe Johanson : collections de Johanson Design. */
export const LEGACY_RANGES: LegacyRange[] = [
  {
    brand: 'johanson-design',
    name: 'Noon',
    slug: 'noon',
    designer: 'Alexander Lervik',
    summary: {
      fr: 'Luminaires personnalisables dans 200 couleurs RAL.',
      en: 'Customisable lighting in 200 RAL colours.',
      it: 'Lampade personalizzabili in 200 colori RAL.',
    },
    image: {
      file: '2024/12/ORI-RETAILL3E-1.jpg',
      alt: { fr: 'Luminaire Noon Ori', en: 'Noon Ori light', it: 'Lampada Noon Ori' },
    },
    description: {
      fr: [
        h3('Une nouvelle vision de l’éclairage scandinave'),
        p(
          'Noon révolutionne l’industrie de l’éclairage avec une approche unique mêlant innovation, design scandinave et une flexibilité inégalée en matière de couleurs. Grâce à une palette impressionnante de 200 teintes différentes, Noon permet de créer des ambiances intérieures uniques, qu’il s’agisse de maisons ou d’espaces publics.',
        ),
        p(
          'Sous la direction artistique d’Alexander Lervik et en collaboration avec d’autres designers, Noon propose des créations qui oscillent entre des formes classiques intemporelles et des œuvres lumineuses audacieuses. Cet équilibre reflète les forces du design scandinave : diversité d’expression et recherche de la fonctionnalité esthétique.',
        ),
        p(
          'Avec Noon, les luminaires traditionnels noirs, blancs ou gris cèdent la place à une explosion de couleurs, intégrée au cœur du design.',
        ),
        p(
          'En parallèle, Noon intègre les dernières innovations technologiques et s’engage dans une production véritablement circulaire, contribuant ainsi à un avenir durable. Laissez-vous inspirer par des solutions lumineuses qui transforment chaque espace en une expérience visuelle et sensorielle inédite.',
        ),
        p('Découvrez Noon, où l’art de l’éclairage rencontre la liberté de création.'),
      ],
      en: [
        h3('A new vision of Scandinavian lighting'),
        p(
          'Noon is shaking up the lighting industry with a unique approach combining innovation, Scandinavian design and unrivalled colour flexibility. With an impressive palette of 200 different shades, Noon makes it possible to create unique interiors, in homes and public spaces alike.',
        ),
        p(
          'Under the artistic direction of Alexander Lervik and in collaboration with other designers, Noon offers pieces that range from timeless classic shapes to bold light works. This balance reflects the strengths of Scandinavian design: diversity of expression and the pursuit of aesthetic functionality.',
        ),
        p(
          'With Noon, traditional black, white or grey luminaires give way to an explosion of colour, built into the very heart of the design.',
        ),
        p(
          'Noon also integrates the latest technological innovations and is committed to truly circular production, contributing to a sustainable future. Let yourself be inspired by lighting solutions that turn every space into a new visual and sensory experience.',
        ),
        p('Discover Noon, where the art of lighting meets creative freedom.'),
      ],
      it: [
        h3('Una nuova visione dell’illuminazione scandinava'),
        p(
          'Noon rivoluziona il settore dell’illuminazione con un approccio unico che unisce innovazione, design scandinavo e una flessibilità cromatica senza pari. Grazie a una straordinaria palette di 200 tinte diverse, Noon permette di creare atmosfere uniche, sia nelle abitazioni sia negli spazi pubblici.',
        ),
        p(
          'Sotto la direzione artistica di Alexander Lervik e in collaborazione con altri designer, Noon propone creazioni che spaziano da forme classiche senza tempo a opere luminose audaci. Un equilibrio che riflette i punti di forza del design scandinavo: varietà di espressione e ricerca della funzionalità estetica.',
        ),
        p(
          'Con Noon, le tradizionali lampade nere, bianche o grigie lasciano il posto a un’esplosione di colori, integrata nel cuore del design.',
        ),
        p(
          'Noon integra inoltre le ultime innovazioni tecnologiche e si impegna in una produzione davvero circolare, contribuendo a un futuro sostenibile. Lasciatevi ispirare da soluzioni luminose che trasformano ogni spazio in un’esperienza visiva e sensoriale inedita.',
        ),
        p('Scoprite Noon, dove l’arte dell’illuminazione incontra la libertà creativa.'),
      ],
    },
  },
  {
    brand: 'johanson-design',
    name: 'Decibel',
    slug: 'decibel',
    summary: {
      fr: 'Solutions acoustiques du groupe Johanson, conçues avec Saint-Gobain Ecophon.',
      en: 'Acoustic solutions from the Johanson group, developed with Saint-Gobain Ecophon.',
      it: 'Soluzioni acustiche del gruppo Johanson, sviluppate con Saint-Gobain Ecophon.',
    },
    image: {
      file: '2015/02/bell_02_miljoDIM-scaled.jpg',
      alt: {
        fr: 'Mobilier acoustique Decibel',
        en: 'Decibel acoustic furniture',
        it: 'Arredo acustico Decibel',
      },
    },
    description: {
      fr: [
        p(
          'Depuis 2017, Decibel, filiale de Johanson, collabore avec Saint-Gobain Ecophon, un leader mondial des solutions acoustiques pour espaces intérieurs. Ecophon développe, fabrique et commercialise des solutions contribuant à améliorer le bien-être et la performance au travail. Présent dans plus de 20 pays, Ecophon a permis à Decibel d’intégrer ces solutions de pointe dans ses designs uniques. Ensemble, ils visent à révolutionner l’industrie de l’ameublement avec des produits au design raffiné et une absorption acoustique inégalée, offrant à leurs clients la possibilité de créer des environnements esthétiques tout en assurant un niveau sonore optimal.',
        ),
      ],
      en: [
        p(
          'Since 2017, Decibel, a Johanson subsidiary, has been working with Saint-Gobain Ecophon, a world leader in acoustic solutions for indoor spaces. Ecophon develops, manufactures and markets solutions that help improve well-being and performance at work. Present in more than 20 countries, Ecophon has enabled Decibel to build these cutting-edge solutions into its unique designs. Together, they aim to transform the furniture industry with refined designs and unrivalled sound absorption, giving their customers the opportunity to create beautiful environments while ensuring optimal sound levels.',
        ),
      ],
      it: [
        p(
          'Dal 2017 Decibel, società del gruppo Johanson, collabora con Saint-Gobain Ecophon, leader mondiale delle soluzioni acustiche per gli spazi interni. Ecophon sviluppa, produce e commercializza soluzioni che contribuiscono a migliorare il benessere e le prestazioni sul lavoro. Presente in oltre 20 paesi, Ecophon ha permesso a Decibel di integrare queste soluzioni d’avanguardia nei suoi design unici. Insieme puntano a rivoluzionare il settore dell’arredo con prodotti dal design raffinato e un assorbimento acustico senza pari, offrendo ai clienti la possibilità di creare ambienti estetici garantendo al tempo stesso un livello sonoro ottimale.',
        ),
      ],
    },
  },
]
