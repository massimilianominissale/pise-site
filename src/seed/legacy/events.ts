import { type LegacyImage, same, type T } from './brands'

/**
 * Salons de l'ancien site (articles « Salons passés »), avec leurs dates officielles,
 * et visites IMRSIVO vers lesquelles il renvoyait.
 */

export type LegacyEvent = {
  slug: string
  name: T
  startDate: string
  endDate: string
  city: string
  venue?: string
  booth?: string
  address?: string
  summary: T
  image?: LegacyImage
  website?: string
  registrationUrl?: string
  /** Identifiants d'URL des fabricants présents (ceux absents du site sont ignorés). */
  brands: string[]
}

const fairVisual = (file: string, name: string): LegacyImage => ({
  file,
  alt: { fr: `Visuel du salon ${name}`, en: `${name} visual`, it: `Visual della fiera ${name}` },
})

const day = (date: string) => `${date}T12:00:00.000Z`

export const LEGACY_EVENTS: LegacyEvent[] = [
  {
    slug: 'maison-objet-2024',
    name: same('Maison&Objet 2024'),
    startDate: day('2024-01-18'),
    endDate: day('2024-01-22'),
    city: 'Paris',
    venue: 'Paris Nord Villepinte',
    booth: 'Hall 6',
    brands: ['nardi'],
    image: fairVisual('2023/10/card_MO24_1200x1200.jpg', 'Maison&Objet 2024'),
    summary: {
      fr: 'Nous avons exposé la collection Nardi de mobilier outdoor en polypropylène recyclé, dans le hall 6.',
      en: 'We exhibited Nardi’s outdoor furniture collection in recycled polypropylene, in hall 6.',
      it: 'Abbiamo esposto la collezione di arredi outdoor Nardi in polipropilene riciclato, nel padiglione 6.',
    },
  },
  {
    slug: 'stockholm-furniture-fair-2024',
    name: same('Stockholm Furniture Fair 2024'),
    startDate: day('2024-02-06'),
    endDate: day('2024-02-10'),
    city: 'Stockholm',
    venue: 'Stockholmsmässan',
    brands: ['johanson-design'],
    image: fairVisual('2023/10/sff-square.jpg', 'Stockholm Furniture Fair'),
    summary: {
      fr: 'Le showroom et le stand Johanson Design, créés par Teklan Severin, coloriste et designer. Nouveautés signées Alexander Lervik, Färg & Blanche, Johan Lindstén et Böttcher Kayser.',
      en: 'Johanson Design’s showroom and stand, created by colourist and designer Teklan Severin. New pieces by Alexander Lervik, Färg & Blanche, Johan Lindstén and Böttcher Kayser.',
      it: 'Lo showroom e lo stand Johanson Design, creati da Teklan Severin, colorista e designer. Novità firmate Alexander Lervik, Färg & Blanche, Johan Lindstén e Böttcher Kayser.',
    },
  },
  {
    slug: 'salone-del-mobile-2024',
    name: same('Salone del Mobile 2024'),
    startDate: day('2024-04-16'),
    endDate: day('2024-04-21'),
    city: 'Milan',
    venue: 'Rho Fiera Milano',
    brands: ['milla-et-milli', 'nardi'],
    image: fairVisual('2024/01/isaloni.jpg', 'Salone del Mobile'),
    summary: {
      fr: 'La grand-messe annuelle du design et de la création. Nous y étions présents avec plusieurs stands : Innova, Milla & Milli et Nardi.',
      en: 'The annual high point of design and creativity. We were there on several stands: Innova, Milla & Milli and Nardi.',
      it: 'Il grande appuntamento annuale del design e della creatività. Eravamo presenti con diversi stand: Innova, Milla & Milli e Nardi.',
    },
  },
  {
    slug: '3-days-of-design-2024',
    name: same('3 Days of Design 2024'),
    startDate: day('2024-06-12'),
    endDate: day('2024-06-14'),
    city: 'Copenhague',
    venue: 'Framing, Odd Fellow Palace',
    address: 'Bredgade 28, 1260 Copenhague',
    website: 'https://www.3daysofdesign.dk/exhibitors/johanson-design-ab',
    brands: ['johanson-design'],
    image: fairVisual('2024/05/images.png', '3 Days of Design'),
    summary: {
      fr: 'Johanson Design dans un décor orchestré par Tuklan, au beau milieu des plus grandes marques internationales de design.',
      en: 'Johanson Design in a setting orchestrated by Tuklan, surrounded by the biggest international design brands.',
      it: 'Johanson Design in un allestimento curato da Tuklan, tra i più grandi marchi internazionali del design.',
    },
  },
  {
    slug: 'paris-design-week-2024',
    name: same('Paris Design Week 2024'),
    startDate: day('2024-09-05'),
    endDate: day('2024-09-14'),
    city: 'Paris',
    venue: 'Portobello',
    address: '32 rue du Roi de Sicile, 75004 Paris',
    registrationUrl: 'https://portobellodecoration.com/cocktail-paris-design-week-2024/',
    brands: ['johanson-design'],
    image: fairVisual('2024/08/PDW-2024-MaJ-ModeleWeb-Exe_Bilingue_SYT.png', 'Paris Design Week'),
    summary: {
      fr: 'Johanson Design présenté chez Portobello, le showroom de Rebecca Felsey, qui accueillait également Gervasoni et Mattiazzi.',
      en: 'Johanson Design on show at Portobello, Rebecca Felsey’s showroom, alongside Gervasoni and Mattiazzi.',
      it: 'Johanson Design presentato da Portobello, lo showroom di Rebecca Felsey, insieme a Gervasoni e Mattiazzi.',
    },
  },
  {
    slug: 'orgatec-2024',
    name: same('Orgatec 2024'),
    startDate: day('2024-10-22'),
    endDate: day('2024-10-25'),
    city: 'Cologne',
    venue: 'Koelnmesse',
    brands: ['johanson-design', 'nardi'],
    image: fairVisual('2024/09/Orgatec-2024.png', 'Orgatec 2024'),
    summary: {
      fr: 'Toute l’équipe de l’Agence PISE était à Cologne pour présenter Johanson Design et Nardi.',
      en: 'The whole Agence PISE team was in Cologne to present Johanson Design and Nardi.',
      it: 'Tutto il team dell’Agence PISE era a Colonia per presentare Johanson Design e Nardi.',
    },
  },
  {
    slug: 'equip-hotel-2024',
    name: same('Equip’Hotel 2024'),
    startDate: day('2024-11-03'),
    endDate: day('2024-11-07'),
    city: 'Paris',
    venue: 'Paris Expo Porte de Versailles',
    brands: ['nardi'],
    image: fairVisual('2024/05/original.jpeg', 'Equip’Hotel'),
    summary: {
      fr: 'Nardi et Innova sur le salon de l’hôtellerie et de la restauration, à Paris Porte de Versailles.',
      en: 'Nardi and Innova at the hospitality and food-service fair, Paris Porte de Versailles.',
      it: 'Nardi e Innova alla fiera dell’hôtellerie e della ristorazione, a Paris Porte de Versailles.',
    },
  },
  {
    slug: 'maison-objet-2025',
    name: same('Maison&Objet 2025'),
    startDate: day('2025-01-16'),
    endDate: day('2025-01-20'),
    city: 'Paris',
    venue: 'Paris Nord Villepinte',
    brands: ['nardi'],
    image: fairVisual(
      '2024/12/57-DT-SurReality__2880x1580_Main_©DR-scaled.jpg',
      'Maison&Objet 2025',
    ),
    summary: {
      fr: 'Les collections Nardi, dont Maximo, primé d’un Archiproducts Design Award dans la catégorie Sustainability.',
      en: 'Nardi’s collections, including Maximo, winner of an Archiproducts Design Award in the Sustainability category.',
      it: 'Le collezioni Nardi, tra cui Maximo, premiato con un Archiproducts Design Award nella categoria Sustainability.',
    },
  },
  {
    slug: 'workspace-2025',
    name: same('Workspace 2025'),
    startDate: day('2025-03-25'),
    endDate: day('2025-03-27'),
    city: 'Paris',
    venue: 'Paris Expo Porte de Versailles',
    booth: 'I63',
    brands: [],
    image: fairVisual('2025/03/visuel-carre-1.png', 'Workspace 2025'),
    summary: {
      fr: 'Place au digital et à l’IA : les showrooms immersifs développés avec IMRSIVO, start-up de Station F, et le calcul du type et du nombre de panneaux acoustiques pour qu’un espace réponde aux normes européennes.',
      en: 'Digital and AI take centre stage: immersive showrooms developed with IMRSIVO, a Station F start-up, and how to calculate the type and number of acoustic panels a space needs to meet European standards.',
      it: 'Spazio al digitale e all’IA: gli showroom immersivi sviluppati con IMRSIVO, start-up di Station F, e il calcolo del tipo e del numero di pannelli acustici necessari perché uno spazio rispetti le norme europee.',
    },
  },
  {
    slug: 'salone-del-mobile-2025',
    name: same('Salone del Mobile 2025'),
    startDate: day('2025-04-08'),
    endDate: day('2025-04-13'),
    city: 'Milan',
    venue: 'Rho Fiera Milano',
    brands: ['nardi', 'johanson-design', 'milla-et-milli', 'axolight', 'fabbian'],
    image: fairVisual('2024/01/isaloni.jpg', 'Salone del Mobile'),
    summary: {
      fr: 'Revivez nos stands en photos 360° immersives réalisées avec IMRSIVO : Nardi, Johanson, Innova, Milla & Milli, Axolight et Fabbian.',
      en: 'Relive our stands in immersive 360° photos produced with IMRSIVO: Nardi, Johanson, Innova, Milla & Milli, Axolight and Fabbian.',
      it: 'Rivivete i nostri stand in foto immersive a 360° realizzate con IMRSIVO: Nardi, Johanson, Innova, Milla & Milli, Axolight e Fabbian.',
    },
  },
  {
    slug: '3-days-of-design-2025',
    name: same('3 Days of Design 2025'),
    startDate: day('2025-06-18'),
    endDate: day('2025-06-20'),
    city: 'Copenhague',
    venue: 'Showroom Magnus Olesen',
    website: 'https://www.3daysofdesign.dk/exhibition/magnus-olesen',
    brands: [],
    image: fairVisual('2025/04/3days-design-1.webp', '3 Days of Design 2025'),
    summary: {
      fr: '« Keep it real » : le thème 2025 célèbre l’expression individuelle. Magnus Olesen présentait ses collections dans son showroom.',
      en: '“Keep it real”: the 2025 theme celebrates individual expression. Magnus Olesen presented its collections in its showroom.',
      it: '«Keep it real»: il tema 2025 celebra l’espressione individuale. Magnus Olesen ha presentato le sue collezioni nel proprio showroom.',
    },
  },
]

export type LegacyTour = {
  slug: T
  title: T
  kind: 'brand-showroom' | 'pise-showroom' | 'venue' | 'trade-fair'
  embedUrl: string
  location?: string
  summary: T
  thumbnail?: LegacyImage
  brands: string[]
  order: number
}

const standSummary: T = {
  fr: 'Revivez notre stand du Salone del Mobile 2025 en photos 360° immersives.',
  en: 'Relive our Salone del Mobile 2025 stand in immersive 360° photos.',
  it: 'Rivivete il nostro stand al Salone del Mobile 2025 in foto immersive a 360°.',
}

const stand = (
  brand: string,
  name: string,
  embedUrl: string,
  screenshot: string,
  order: number,
): LegacyTour => ({
  slug: same(`salone-2025-${brand}`),
  title: {
    fr: `Stand ${name} · Salone del Mobile 2025`,
    en: `${name} stand · Salone del Mobile 2025`,
    it: `Stand ${name} · Salone del Mobile 2025`,
  },
  kind: 'trade-fair',
  embedUrl,
  location: 'Milan',
  summary: standSummary,
  thumbnail: {
    file: screenshot,
    alt: {
      fr: `Visite virtuelle du stand ${name}`,
      en: `Virtual tour of the ${name} stand`,
      it: `Visita virtuale dello stand ${name}`,
    },
  },
  brands: [brand],
  order,
})

export const LEGACY_TOURS: LegacyTour[] = [
  {
    slug: {
      fr: 'showroom-virtuel-pise',
      en: 'pise-virtual-showroom',
      it: 'showroom-virtuale-pise',
    },
    title: {
      fr: 'Showroom virtuel PISE',
      en: 'PISE virtual showroom',
      it: 'Showroom virtuale PISE',
    },
    kind: 'pise-showroom',
    embedUrl: 'https://imrsivo.com/Player/index.php?projectId=604&userId=306&spaceName=LOBBY-1',
    summary: {
      fr: 'Les produits distribués par l’agence, présentés dans différents univers : déplacez-vous d’un espace à l’autre et ouvrez la fiche de chaque produit.',
      en: 'The products the agency represents, shown in a range of settings: move from one space to the next and open each product’s sheet.',
      it: 'I prodotti distribuiti dall’agenzia, presentati in diversi ambienti: spostatevi da uno spazio all’altro e aprite la scheda di ogni prodotto.',
    },
    brands: [],
    order: 1,
  },
  {
    slug: same('showroom-system-180'),
    title: { fr: 'Showroom System 180', en: 'System 180 showroom', it: 'Showroom System 180' },
    kind: 'brand-showroom',
    embedUrl: 'https://imrsivo.com/Player/index.php?projectId=704&userId=306&spaceName=S180-1',
    summary: {
      fr: 'Visitez le showroom de System 180 en 3D.',
      en: 'Explore the System 180 showroom in 3D.',
      it: 'Visitate lo showroom di System 180 in 3D.',
    },
    brands: ['system180'],
    order: 2,
  },
  stand(
    'nardi',
    'Nardi',
    'https://imrsivo.com/Player/index.php?projectId=708&userId=306&spaceName=07',
    '2024/12/Capture-decran-2025-05-14-a-16.55.40.png',
    3,
  ),
  stand(
    'johanson-design',
    'Johanson Design',
    'https://imrsivo.com/Player/index.php?projectId=707&userId=306&spaceName=JOHANSON3',
    '2024/12/Capture-decran-2025-05-14-a-16.46.25.png',
    4,
  ),
  stand(
    'milla-et-milli',
    'Milla & Milli',
    'https://imrsivo.com/Player/index.php?draft=cHJvamVjdElkPTcwNyZ1c2VySWQ9MzA2JnNwYWNlTmFtZT1NSUxMQTM=',
    '2024/12/Capture-decran-2025-05-14-a-16.49.55.png',
    5,
  ),
  stand(
    'fabbian',
    'Fabbian',
    'https://imrsivo.com/Player/index.php?draft=cHJvamVjdElkPTcwNyZ1c2VySWQ9MzA2JnNwYWNlTmFtZT1GQUJCSUFO',
    '2024/12/Capture-decran-2025-05-14-a-17.40.57.png',
    6,
  ),
]
