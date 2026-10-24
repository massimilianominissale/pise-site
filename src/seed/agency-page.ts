import { type Locale, LOCALES, localizedPath } from '../i18n/config'
import { type Ctx, findSeedMedia } from './brands'
import { importImage } from './legacy'
import type { LegacyImage } from './legacy/brands'
import { a, b, h2, p, type RichNode, toLexical, ul } from './rich'

/**
 * Page « L'agence » réécrite pour le référencement et les assistants IA (demande de PISE du
 * 24/10) : chaque section répond à une question précise, cite marques et lieux, et commence par
 * une phrase factuelle. La page existante est REMPLACÉE (demande explicite), sauf si elle a des
 * modifications non publiées. Les versions précédentes restent dans l'historique du back-office.
 * Ajoute aussi le showroom Johanson Design (255 rue de Vaugirard) et les questions fréquentes.
 */

type T = Record<Locale, string>

const brand = (locale: Locale, slug: string, name: string) =>
  a(name, localizedPath(locale, 'brands', slug))

export const AGENCY_META: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: 'Agence PISE · Agent commercial mobilier contract et luminaires',
    description:
      'Agent commercial de fabricants de mobilier, d’acoustique et de luminaires pour l’hôtellerie, les bureaux et l’outdoor. Showrooms Paris 15e, siège Orléans.',
  },
  en: {
    title: 'Agence PISE · Contract furniture and lighting sales agent',
    description:
      'Sales agent for furniture, acoustics and lighting makers serving hotels, offices and outdoor projects. Showrooms in Paris 15th, head office in Orléans.',
  },
  it: {
    title: 'Agence PISE · Agente di arredo contract e illuminazione',
    description:
      'Agente di produttori di arredo, acustica e illuminazione per hotel, uffici e outdoor in Francia. Showroom a Parigi 15°, sede a Orléans.',
  },
}

const HERO: Record<Locale, { title: string; lead: string }> = {
  fr: {
    title: 'Agence PISE, agent commercial en mobilier contract et luminaires',
    lead: 'Depuis 2013, l’Agence PISE est l’agent commercial en France de fabricants de mobilier, de solutions acoustiques et de luminaires pour l’hôtellerie, les bureaux et les espaces extérieurs : Nardi, Johanson Design, Decibel, Bürotime, System180, Maffei, Fabbian, Axolight, Milla & Milli et Pot à Porter. Nous accompagnons architectes, architectes d’intérieur, décorateurs, maîtres d’ouvrage, distributeurs et entreprises de design & build.',
  },
  en: {
    title: 'Agence PISE, sales agent for contract furniture and lighting',
    lead: 'Since 2013, Agence PISE has been the sales agent in France for manufacturers of furniture, acoustic solutions and lighting for hospitality, offices and outdoor spaces: Nardi, Johanson Design, Decibel, Bürotime, System180, Maffei, Fabbian, Axolight, Milla & Milli and Pot à Porter. We work with architects, interior architects, decorators, project owners, distributors and design & build companies.',
  },
  it: {
    title: 'Agence PISE, agente di commercio per arredo contract e illuminazione',
    lead: 'Dal 2013 l’Agence PISE è l’agente di commercio in Francia di produttori di arredo, soluzioni acustiche e illuminazione per hotel, uffici e spazi esterni: Nardi, Johanson Design, Decibel, Bürotime, System180, Maffei, Fabbian, Axolight, Milla & Milli e Pot à Porter. Affianchiamo architetti, architetti d’interni, decoratori, committenti, distributori e aziende di design & build.',
  },
}

/** Sections de la page, dans l'ordre : un bloc de texte par question. */
const SECTIONS = (l: Locale): RichNode[][] => {
  const nardi = brand(l, 'nardi', 'Nardi')
  const johanson = brand(l, 'johanson-design', 'Johanson Design')
  const decibel = brand(l, 'decibel', 'Decibel')
  const burotime = brand(l, 'burotime', 'Bürotime')
  const system180 = brand(l, 'system180', 'System180')
  const maffei = brand(l, 'maffei', 'Maffei')
  const fabbian = brand(l, 'fabbian', 'Fabbian')
  const axolight = brand(l, 'axolight', 'Axolight')
  const milla = brand(l, 'milla-et-milli', 'Milla & Milli')
  const appointment = localizedPath(l, 'appointment')

  if (l === 'en')
    return [
      [
        h2('What we do: sales agent for furniture manufacturers'),
        p(
          'Agence PISE represents its manufacturers to interior design professionals in France. We present the ranges, advise specifiers on products and finishes, and follow each project with the distributor or the design & build company through to delivery. We do not sell to private individuals or to professional end clients: to buy, we direct you to the distributor in your region.',
        ),
      ],
      [
        h2('Furniture, acoustics and lighting for hospitality, offices and outdoor spaces'),
        ul(
          [
            b('Hospitality and restaurants: '),
            'lobbies, guest rooms, restaurants and terraces, with ',
            johanson,
            ', ',
            milla,
            ', ',
            nardi,
            ', ',
            maffei,
            ', Pot à Porter and lighting by ',
            fabbian,
            ' and ',
            axolight,
            '.',
          ],
          [
            b('Offices: '),
            'workstations and soft seating by ',
            burotime,
            ', collaborative and executive spaces by ',
            johanson,
            ', modular furniture by ',
            system180,
            '.',
          ],
          [
            b('Acoustics: '),
            'acoustic panels and solutions by ',
            decibel,
            ' for offices, meeting rooms, hotels and restaurants, developed with Ecophon (Saint-Gobain), in the same RAL colours as Johanson Design furniture.',
          ],
          [
            b('Education and coworking: '),
            'tiered seating, creative rooms and dividers by ',
            system180,
            ', seating and tables by ',
            burotime,
            ' and ',
            johanson,
            '.',
          ],
          [
            b('Professional outdoor: '),
            'outdoor furniture by ',
            nardi,
            ', parasols by ',
            maffei,
            ' and handmade planters by Pot à Porter.',
          ],
        ),
      ],
      [
        h2('Custom furniture and special projects'),
        p(
          'When a project goes beyond the catalogue, we find the manufacturer able to make the piece: steel, HPL, wood, fabric, lighting. The ',
          system180,
          ' modular system also lets architects design their own furniture, from reception desks to tiered seating.',
        ),
      ],
      [
        h2('Nearly 40 years of furniture experience'),
        p(
          'The agency’s founder, Pierre-Christophe Prot, ran DESIO, a French sofa manufacturer founded in 1988 and awarded the VIA label. He led it for over twenty years, with a team of around thirty and a presence at international trade fairs. He then opened an interior design shop in Orléans and an interior furnishing business. This dual culture, manufacturing and interior fit-out, shapes our advice.',
        ),
      ],
      [
        h2('Where we work in France'),
        p('We cover the whole of France for most of our brands, with two exceptions:'),
        ul(
          [nardi, ': Paris and northern France.'],
          [axolight, ': all of France except Rhône-Alpes and the South-East.'],
        ),
        p('Outside these areas, we put you in touch with the right contact for your region.'),
      ],
      [
        h2('Showrooms in Paris and head office in Orléans'),
        p(
          'Our ranges can be seen in our two Paris showrooms, both in the 15th arrondissement: 3 avenue du Maine, and the showroom dedicated exclusively to Johanson Design at 255 rue de Vaugirard. Our head office is at 76 rue de la Cigogne, 45100 Orléans. ',
          a('Appointments', appointment),
          ' by video call (30 min), in a showroom (1 h), as a guided virtual tour (45 min) or at the factory on request.',
        ),
      ],
    ]

  if (l === 'it')
    return [
      [
        h2('Il nostro mestiere: agente di commercio di produttori di arredo'),
        p(
          'L’Agence PISE rappresenta i suoi produttori presso i professionisti dell’arredamento in Francia. Presentiamo le linee, consigliamo i progettisti nella scelta di prodotti e finiture e seguiamo ogni progetto con il distributore o l’azienda di design & build fino alla consegna. Non vendiamo ai privati né ai clienti finali professionali: per acquistare, vi indirizziamo al distributore della vostra regione.',
        ),
      ],
      [
        h2('Arredo, acustica e illuminazione per hotel, uffici e outdoor'),
        ul(
          [
            b('Hotel e ristorazione: '),
            'lobby, camere, ristoranti e terrazze, con ',
            johanson,
            ', ',
            milla,
            ', ',
            nardi,
            ', ',
            maffei,
            ', Pot à Porter e l’illuminazione di ',
            fabbian,
            ' e ',
            axolight,
            '.',
          ],
          [
            b('Uffici e terziario: '),
            'postazioni di lavoro e soft seating ',
            burotime,
            ', spazi collaborativi e direzionali ',
            johanson,
            ', arredo modulare ',
            system180,
            '.',
          ],
          [
            b('Acustica: '),
            'pannelli e soluzioni acustiche ',
            decibel,
            ' per uffici, sale riunioni, hotel e ristoranti, sviluppati con Ecophon (Saint-Gobain), negli stessi colori RAL dell’arredo Johanson Design.',
          ],
          [
            b('Scuole e coworking: '),
            'gradonate, creative room e divisori ',
            system180,
            ', sedute e tavoli ',
            burotime,
            ' e ',
            johanson,
            '.',
          ],
          [
            b('Outdoor professionale: '),
            'arredo per esterni ',
            nardi,
            ', ombrelloni ',
            maffei,
            ' e vasi fatti a mano Pot à Porter.',
          ],
        ),
      ],
      [
        h2('Arredo su misura e progetti speciali'),
        p(
          'Per i progetti che vanno oltre il catalogo, troviamo il produttore in grado di realizzare il pezzo: acciaio, HPL, legno, tessuto, illuminazione. Il sistema modulare ',
          system180,
          ' permette inoltre all’architetto di disegnare il proprio arredo, dal banco reception alle gradonate.',
        ),
      ],
      [
        h2('Quasi 40 anni di esperienza nell’arredo'),
        p(
          'Il fondatore dell’agenzia, Pierre-Christophe Prot, ha diretto DESIO, produttore francese di divani fondato nel 1988 e premiato con il marchio VIA. L’ha guidato per oltre vent’anni, con una trentina di persone e una presenza nelle fiere internazionali. Ha poi aperto a Orléans un negozio di decorazione e un’attività di arredatore. Questa doppia cultura, produzione e allestimento, guida i nostri consigli.',
        ),
      ],
      [
        h2('Zone di intervento in Francia'),
        p(
          'Interveniamo in tutta la Francia per la maggior parte dei nostri marchi, con due eccezioni:',
        ),
        ul(
          [nardi, ': Parigi e Nord della Francia.'],
          [axolight, ': tutta la Francia tranne Rhône-Alpes e Sud-Est.'],
        ),
        p('Al di fuori di queste zone, vi indirizziamo all’interlocutore della vostra regione.'),
      ],
      [
        h2('Showroom a Parigi e sede a Orléans'),
        p(
          'Le nostre linee sono visibili nei nostri due showroom parigini, entrambi nel 15° arrondissement: in 3 avenue du Maine e nello showroom dedicato esclusivamente a Johanson Design, in 255 rue de Vaugirard. La sede è in 76 rue de la Cigogne, 45100 Orléans. ',
          a('Appuntamenti', appointment),
          ' in videochiamata (30 min), in showroom (1 h), in visita virtuale guidata (45 min) o in fabbrica su richiesta.',
        ),
      ],
    ]

  return [
    [
      h2('Notre métier : agent commercial de fabricants de mobilier'),
      p(
        'L’Agence PISE représente ses fabricants auprès des professionnels de l’aménagement en France. Nous présentons les collections, conseillons les prescripteurs sur le choix des produits et des finitions, et suivons chaque projet avec le distributeur ou l’entreprise de design & build jusqu’à la livraison. Nous ne vendons pas aux particuliers, ni aux clients finaux professionnels : pour acheter, nous vous orientons vers le distributeur de votre région.',
      ),
    ],
    [
      h2('Mobilier, acoustique et luminaires pour l’hôtellerie, les bureaux et l’outdoor'),
      ul(
        [
          b('Hôtellerie et restauration : '),
          'lobbies, chambres, restaurants et terrasses, avec ',
          johanson,
          ', ',
          milla,
          ', ',
          nardi,
          ', ',
          maffei,
          ', Pot à Porter et l’éclairage ',
          fabbian,
          ' et ',
          axolight,
          '.',
        ],
        [
          b('Bureaux et tertiaire : '),
          'postes de travail et soft seating ',
          burotime,
          ', espaces collaboratifs et de direction ',
          johanson,
          ', mobilier modulaire ',
          system180,
          '.',
        ],
        [
          b('Acoustique : '),
          'panneaux et solutions acoustiques ',
          decibel,
          ' pour bureaux, salles de réunion, hôtels et restaurants, en partenariat avec Ecophon (Saint-Gobain), dans les mêmes teintes RAL que le mobilier Johanson Design.',
        ],
        [
          b('Éducation et coworking : '),
          'gradins, creative rooms et séparateurs ',
          system180,
          ', assises et tables ',
          burotime,
          ' et ',
          johanson,
          '.',
        ],
        [
          b('Outdoor professionnel : '),
          'mobilier d’extérieur ',
          nardi,
          ', parasols ',
          maffei,
          ' et pots faits main Pot à Porter.',
        ],
      ),
    ],
    [
      h2('Mobilier sur mesure et projets spéciaux'),
      p(
        'Pour les projets qui sortent du catalogue, nous trouvons le fabricant capable de réaliser la pièce : acier, HPL, bois, tissu, luminaire. Le système modulaire ',
        system180,
        ' permet aussi à l’architecte de dessiner son propre mobilier, du comptoir d’accueil aux gradins.',
      ),
    ],
    [
      h2('Près de 40 ans d’expérience du mobilier'),
      p(
        'Le fondateur de l’agence, Pierre-Christophe Prot, a dirigé DESIO, fabricant français de canapés créé en 1988 et labellisé VIA. Il l’a dirigé plus de vingt ans, avec une trentaine de personnes et une présence sur les salons internationaux. Il a ensuite ouvert à Orléans un magasin de décoration et une activité de décorateur ensemblier. Cette double culture, fabrication et aménagement, guide nos conseils.',
      ),
    ],
    [
      h2('Zones d’intervention en France'),
      p(
        'Nous intervenons dans toute la France pour la plupart de nos marques, à deux exceptions près :',
      ),
      ul(
        [nardi, ' : Paris et le Nord de la France.'],
        [axolight, ' : toute la France, hors Rhône-Alpes et Sud-Est.'],
      ),
      p('En dehors de ces zones, nous vous orientons vers l’interlocuteur de votre région.'),
    ],
    [
      h2('Showrooms à Paris et bureau à Orléans'),
      p(
        'Nos collections sont visibles dans nos deux showrooms parisiens, tous deux dans le 15e arrondissement : au 3 avenue du Maine, et dans le showroom dédié exclusivement à Johanson Design, au 255 rue de Vaugirard. Le siège est au 76 rue de la Cigogne, 45100 Orléans. ',
        a('Rendez-vous', appointment),
        ' possibles en visio (30 min), en showroom (1 h), en visite virtuelle accompagnée (45 min) ou en usine sur demande.',
      ),
    ],
  ]
}

/** Questions fréquentes (balisées FAQPage par le bloc). */
export const AGENCY_FAQS: { question: T; answer: T }[] = [
  {
    question: {
      fr: 'Qu’est-ce qu’un agent commercial en mobilier ?',
      en: 'What is a furniture sales agent?',
      it: 'Che cos’è un agente di commercio di arredo?',
    },
    answer: {
      fr: 'Un professionnel qui représente des fabricants sur un territoire. Il conseille les prescripteurs et les distributeurs ; la vente passe par un revendeur.',
      en: 'A professional who represents manufacturers in a territory. They advise specifiers and distributors; the sale goes through a reseller.',
      it: 'Un professionista che rappresenta dei produttori su un territorio. Consiglia progettisti e distributori; la vendita passa da un rivenditore.',
    },
  },
  {
    question: {
      fr: 'Quelles marques représentez-vous ?',
      en: 'Which brands do you represent?',
      it: 'Quali marchi rappresentate?',
    },
    answer: {
      fr: 'Nardi, Johanson Design, Decibel, Bürotime, System180, Maffei, Fabbian, Axolight, Pot à Porter et Milla & Milli.',
      en: 'Nardi, Johanson Design, Decibel, Bürotime, System180, Maffei, Fabbian, Axolight, Pot à Porter and Milla & Milli.',
      it: 'Nardi, Johanson Design, Decibel, Bürotime, System180, Maffei, Fabbian, Axolight, Pot à Porter e Milla & Milli.',
    },
  },
  {
    question: {
      fr: 'Où acheter du mobilier Nardi à Paris ou dans le Nord ?',
      en: 'Where can I buy Nardi furniture in Paris or northern France?',
      it: 'Dove acquistare arredo Nardi a Parigi o nel Nord della Francia?',
    },
    answer: {
      fr: 'Chez nos distributeurs partenaires. Contactez-nous : nous vous orientons vers le distributeur de votre région.',
      en: 'From our partner distributors. Contact us and we will direct you to the distributor in your region.',
      it: 'Presso i nostri distributori partner. Contattateci: vi indirizziamo al distributore della vostra regione.',
    },
  },
  {
    question: {
      fr: 'Vendez-vous aux particuliers ?',
      en: 'Do you sell to private individuals?',
      it: 'Vendete ai privati?',
    },
    answer: {
      fr: 'Non. Nous orientons les particuliers vers un revendeur.',
      en: 'No. We direct private individuals to a reseller.',
      it: 'No. Indirizziamo i privati verso un rivenditore.',
    },
  },
  {
    question: {
      fr: 'Peut-on voir les collections à Paris ?',
      en: 'Can I see the ranges in Paris?',
      it: 'Si possono vedere le linee a Parigi?',
    },
    answer: {
      fr: 'Oui, dans nos showrooms du 15e arrondissement, sur rendez-vous.',
      en: 'Yes, in our showrooms in the 15th arrondissement, by appointment.',
      it: 'Sì, nei nostri showroom del 15° arrondissement, su appuntamento.',
    },
  },
  {
    question: {
      fr: 'Faites-vous du sur mesure ?',
      en: 'Do you offer custom furniture?',
      it: 'Realizzate arredi su misura?',
    },
    answer: {
      fr: 'Oui, avec nos fabricants et le système modulaire System180.',
      en: 'Yes, with our manufacturers and the System180 modular system.',
      it: 'Sì, con i nostri produttori e il sistema modulare System180.',
    },
  },
  {
    question: {
      fr: 'Proposez-vous des solutions acoustiques ?',
      en: 'Do you offer acoustic solutions?',
      it: 'Proponete soluzioni acustiche?',
    },
    answer: {
      fr: 'Oui, avec Decibel : panneaux et solutions acoustiques pour bureaux, hôtels et restaurants, coordonnés au mobilier Johanson Design.',
      en: 'Yes, with Decibel: acoustic panels and solutions for offices, hotels and restaurants, matched to Johanson Design furniture.',
      it: 'Sì, con Decibel: pannelli e soluzioni acustiche per uffici, hotel e ristoranti, coordinati con l’arredo Johanson Design.',
    },
  },
  {
    question: {
      fr: 'Fournissez-vous les fiches techniques et les EPD ?',
      en: 'Do you provide data sheets and EPDs?',
      it: 'Fornite schede tecniche ed EPD?',
    },
    answer: {
      fr: 'Oui, téléchargeables sur chaque fiche produit, lorsque le fabricant les fournit.',
      en: 'Yes, downloadable from each product page, when the manufacturer provides them.',
      it: 'Sì, scaricabili da ogni scheda prodotto, quando il produttore le fornisce.',
    },
  },
]

const FAQ_TITLE: T = {
  fr: 'Questions fréquentes',
  en: 'Frequently asked questions',
  it: 'Domande frequenti',
}

const CTA: Record<Locale, { title: string; appointment: string; tour: string }> = {
  fr: {
    title: 'Voir nos collections',
    appointment: 'Prendre rendez-vous',
    tour: 'Visiter un showroom virtuel',
  },
  en: {
    title: 'See our ranges',
    appointment: 'Book an appointment',
    tour: 'Visit a virtual showroom',
  },
  it: {
    title: 'Scoprite le nostre linee',
    appointment: 'Prendere appuntamento',
    tour: 'Visitare uno showroom virtuale',
  },
}

/** Showroom dédié à Johanson Design, ajouté s'il n'existe pas encore. */
export const JOHANSON_SHOWROOM = {
  name: 'Showroom Johanson Design',
  address: {
    street: '255 rue de Vaugirard',
    postalCode: '75015',
    city: 'Paris',
    country: 'France',
  },
  description: {
    fr: 'Showroom dédié exclusivement à Johanson Design, sur rendez-vous.',
    en: 'Showroom dedicated exclusively to Johanson Design, by appointment.',
    it: 'Showroom dedicato esclusivamente a Johanson Design, su appuntamento.',
  },
  brands: ['johanson-design', 'noon', 'decibel'],
  order: 2,
}

/* ---------- Visuels et équipe ---------- */

const TEAM_PHOTO: LegacyImage = {
  file: 'equipe-salon.jpg',
  repo: true,
  alt: {
    fr: 'Merima Vasse, Benoit Marchione-Morel et Pierre-Christophe Prot devant le logo de l’Agence PISE',
    en: 'Merima Vasse, Benoit Marchione-Morel and Pierre-Christophe Prot in front of the Agence PISE logo',
    it: 'Merima Vasse, Benoit Marchione-Morel e Pierre-Christophe Prot davanti al logo dell’Agence PISE',
  },
}

/** Photos de la médiathèque (déjà importées) pour les secteurs et le sur-mesure. */
const SECTOR_PHOTOS = ['milla-archetype.jpg', 'system180-forest.jpg', 'maffei-piscine.jpg']
const CUSTOM_PHOTO = 'system180-comptoir.jpg'

type Member = {
  name: string
  jobTitle?: T
  zone?: T
  phone: string
  email: string
  file: string
  bookable: boolean
}

/** L'équipe, d'après la planche de portraits illustrés fournie par PISE. */
export const TEAM: Member[] = [
  {
    name: 'Mahault Sanson',
    jobTitle: { fr: 'Back-office', en: 'Back office', it: 'Back office' },
    phone: '02 38 42 00 42',
    email: 'contact1@agencepise.com',
    file: 'equipe-mahault-sanson.png',
    bookable: false,
  },
  {
    name: 'Pierre-Christophe Prot',
    jobTitle: { fr: 'Fondateur', en: 'Founder', it: 'Fondatore' },
    zone: {
      fr: 'Paris & Sud France',
      en: 'Paris & southern France',
      it: 'Parigi e Sud della Francia',
    },
    phone: '06 09 49 81 76',
    email: 'pcp@agencepise.com',
    file: 'equipe-pierre-christophe-prot.png',
    bookable: true,
  },
  {
    name: 'Merima Vasse',
    jobTitle: { fr: 'Prescription', en: 'Specification', it: 'Prescrizione' },
    zone: { fr: 'Paris', en: 'Paris', it: 'Parigi' },
    phone: '06 43 04 58 55',
    email: 'merima@agencepise.com',
    file: 'equipe-merima-vasse.png',
    bookable: true,
  },
  {
    name: 'Benoit Marchione-Morel',
    zone: { fr: 'Province Nord', en: 'Northern France', it: 'Nord della Francia' },
    phone: '06 23 02 13 61',
    email: 'benoit@agencepise.com',
    file: 'equipe-benoit-marchione-morel.png',
    bookable: true,
  },
]

const TEAM_BLOCK: Record<Locale, { title: string; text: string }> = {
  fr: {
    title: 'L’équipe',
    text: 'Quatre interlocuteurs entre Paris, Orléans et la province : chacun suit ses prescripteurs et ses projets, du premier rendez-vous à la livraison.',
  },
  en: {
    title: 'The team',
    text: 'Four contacts between Paris, Orléans and the regions: each one follows their specifiers and projects, from the first meeting to delivery.',
  },
  it: {
    title: 'Il team',
    text: 'Quattro interlocutori tra Parigi, Orléans e le regioni: ognuno segue i propri progettisti e progetti, dal primo appuntamento alla consegna.',
  },
}

type Visuals = {
  faqs: number[]
  team: number[]
  teamPhoto: number | null
  sectors: number[]
  custom: number | null
}

/** Titre (premier intertitre) et texte d'une section, pour un bloc image et texte. */
const split = (nodes: RichNode[]) => {
  const [first, ...rest] = nodes
  return first?.kind === 'h'
    ? { title: first.text, body: toLexical(rest) }
    : { title: undefined, body: toLexical(nodes) }
}

/**
 * Mise en page : en-tête, métier (photo d'équipe), secteurs | expérience (deux colonnes), trois
 * photos, sur mesure (photo), équipe (portraits), zones | showrooms, questions, appel à l'action.
 * Les blocs gardent le même ordre dans chaque langue : `ids` reprend leurs identifiants.
 */
const layout = (
  locale: Locale,
  v: Visuals,
  ids: (string | undefined)[],
  linkIds: (string | undefined)[],
) => {
  const [metier, secteurs, surMesure, experience, zones, showrooms] = SECTIONS(locale)
  const content = (nodes: RichNode[]) => ({ blockType: 'content' as const, body: toLexical(nodes) })
  // Deux sections côte à côte (une seule colonne sur mobile).
  const columns = (left: RichNode[], right: RichNode[]) => ({
    blockType: 'columns' as const,
    left: toLexical(left),
    right: toLexical(right),
  })
  const media = (nodes: RichNode[], image: number | null, imagePosition: 'left' | 'right') =>
    image
      ? { blockType: 'mediaText' as const, image, imagePosition, ...split(nodes) }
      : content(nodes)
  const blocks = [
    { blockType: 'hero' as const, ...HERO[locale] },
    media(metier, v.teamPhoto, 'left'),
    columns(secteurs, experience),
    ...(v.sectors.length ? [{ blockType: 'gallery' as const, images: v.sectors }] : []),
    media(surMesure, v.custom, 'right'),
    ...(v.team.length
      ? [{ blockType: 'team' as const, ...TEAM_BLOCK[locale], members: v.team }]
      : []),
    columns(zones, showrooms),
    { blockType: 'faq' as const, title: FAQ_TITLE[locale], faqs: v.faqs },
    {
      blockType: 'cta' as const,
      title: CTA[locale].title,
      links: [
        { url: '/rendez-vous', label: CTA[locale].appointment },
        { url: '/espaces-virtuels', label: CTA[locale].tour },
      ].map((link, i) => ({
        ...(linkIds[i] ? { id: linkIds[i] } : {}),
        link: { type: 'external' as const, url: link.url, label: link.label, newTab: false },
      })),
    },
  ]
  return blocks.map((block, i) => (ids[i] ? { id: ids[i], ...block } : block))
}

const ensureTeam = async (ctx: Ctx) => {
  const { payload, req } = ctx
  const ids: number[] = []
  for (const [i, member] of TEAM.entries()) {
    const existing = await payload.find({
      collection: 'team-members',
      where: { name: { equals: member.name } },
      limit: 1,
      depth: 0,
      req,
    })
    if (existing.docs[0]) {
      ids.push(existing.docs[0].id)
      continue
    }
    const photo = await importImage(ctx, {
      file: member.file,
      repo: true,
      alt: {
        fr: `Portrait illustré de ${member.name}`,
        en: `Illustrated portrait of ${member.name}`,
        it: `Ritratto illustrato di ${member.name}`,
      },
    })
    const doc = await payload.create({
      collection: 'team-members',
      locale: 'fr',
      data: {
        name: member.name,
        jobTitle: member.jobTitle?.fr,
        zone: member.zone?.fr,
        phone: member.phone,
        email: member.email,
        photo,
        bookable: member.bookable,
        order: i + 1,
      },
      req,
    })
    for (const locale of LOCALES.filter((l) => l !== 'fr')) {
      if (!member.jobTitle && !member.zone) continue
      await payload.update({
        collection: 'team-members',
        id: doc.id,
        locale,
        data: { jobTitle: member.jobTitle?.[locale], zone: member.zone?.[locale] },
        req,
      })
    }
    ids.push(doc.id)
  }
  payload.logger.info(`Page L’agence : équipe (${ids.length} membres)`)
  return ids
}

const createFaqs = async ({ payload, req }: Ctx) => {
  const ids: number[] = []
  for (const [i, faq] of AGENCY_FAQS.entries()) {
    const existing = await payload.find({
      collection: 'faqs',
      where: { question: { equals: faq.question.fr } },
      locale: 'fr',
      limit: 1,
      depth: 0,
      req,
    })
    if (existing.docs[0]) {
      ids.push(existing.docs[0].id)
      continue
    }
    const doc = await payload.create({
      collection: 'faqs',
      locale: 'fr',
      data: { question: faq.question.fr, answer: faq.answer.fr, topic: 'general', order: 100 + i },
      req,
    })
    for (const locale of LOCALES.filter((l) => l !== 'fr')) {
      await payload.update({
        collection: 'faqs',
        id: doc.id,
        locale,
        data: { question: faq.question[locale], answer: faq.answer[locale] },
        req,
      })
    }
    ids.push(doc.id)
  }
  return ids
}

const addShowroom = async ({ payload, req }: Ctx) => {
  const existing = await payload.find({
    collection: 'showrooms',
    where: { 'address.street': { like: 'Vaugirard' } },
    limit: 1,
    depth: 0,
    req,
  })
  if (existing.totalDocs) return
  const brands = await payload.find({
    collection: 'brands',
    where: { slug: { in: JOHANSON_SHOWROOM.brands } },
    limit: 10,
    depth: 0,
    req,
  })
  const doc = await payload.create({
    collection: 'showrooms',
    locale: 'fr',
    data: {
      name: JOHANSON_SHOWROOM.name,
      address: JOHANSON_SHOWROOM.address,
      description: JOHANSON_SHOWROOM.description.fr,
      brands: brands.docs.map((d) => d.id),
      order: JOHANSON_SHOWROOM.order,
    },
    req,
  })
  for (const locale of LOCALES.filter((l) => l !== 'fr')) {
    await payload.update({
      collection: 'showrooms',
      id: doc.id,
      locale,
      data: { description: JOHANSON_SHOWROOM.description[locale] },
      req,
    })
  }
  payload.logger.info('Page L’agence : showroom Johanson Design (255 rue de Vaugirard) ajouté')
}

export const rewriteAgencyPage = async (ctx: Ctx) => {
  const { payload, req } = ctx
  await addShowroom(ctx)

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'agence' } },
    locale: 'fr',
    limit: 1,
    depth: 0,
    draft: true,
    req,
  })
  const page = docs[0]
  if (!page) {
    payload.logger.warn('Page L’agence introuvable : rien réécrit')
    return false
  }
  if (page._status === 'draft') {
    payload.logger.warn('Page L’agence : modifications non publiées en cours, rien réécrit')
    return false
  }

  const sectors = await Promise.all(SECTOR_PHOTOS.map((file) => findSeedMedia(ctx, file)))
  const visuals: Visuals = {
    faqs: await createFaqs(ctx),
    team: await ensureTeam(ctx),
    teamPhoto: await importImage(ctx, TEAM_PHOTO),
    sectors: sectors.filter((id): id is number => id != null),
    custom: await findSeedMedia(ctx, CUSTOM_PHOTO),
  }

  let ids: (string | undefined)[] = []
  let linkIds: (string | undefined)[] = []
  for (const locale of LOCALES) {
    const saved = await payload.update({
      collection: 'pages',
      id: page.id,
      locale,
      depth: 0,
      data: {
        layout: layout(locale, visuals, ids, linkIds) as never,
        meta: { ...AGENCY_META[locale] },
        _status: 'published',
      },
      req,
    })
    // Mêmes blocs d'une langue à l'autre : les traductions s'attachent à leur identifiant.
    if (locale === 'fr') {
      const blocks = saved.layout ?? []
      ids = blocks.map((block) => block.id ?? undefined)
      const cta = blocks.find((block) => block.blockType === 'cta')
      linkIds = cta && 'links' in cta ? (cta.links ?? []).map((row) => row.id ?? undefined) : []
    }
  }
  payload.logger.info(
    'Page L’agence réécrite (FR, EN, IT) : visuels, équipe et questions fréquentes',
  )
  return true
}
