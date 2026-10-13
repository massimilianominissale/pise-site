import { type Ctx, findSeedMedia } from './brands'

/**
 * Contenus de départ du site : collections connues par les photos du Drive, page d'accueil,
 * menu, pied de page, réglages et page « Nos fabricants », avec les textes des maquettes.
 *
 * Chaque bloc n'est rempli que s'il est encore vide : rien de ce que PISE a saisi n'est écrasé.
 */

type Locale = 'fr' | 'en' | 'it'
type T = Record<Locale, string>
const LOCALES: Locale[] = ['fr', 'en', 'it']

/** Collections dont le nom figure sur les photos fournies (désigners, années et textes à compléter). */
export const RANGES: { brand: string; name: string; image: string }[] = [
  { brand: 'johanson-design', name: 'Split', image: 'johanson-split-detail.jpg' },
  { brand: 'johanson-design', name: 'Lyon', image: 'johanson-lyon-detail.jpg' },
  { brand: 'milla-et-milli', name: 'Archetype', image: 'milla-archetype.jpg' },
  { brand: 'milla-et-milli', name: 'Iris', image: 'milla-iris.jpg' },
  { brand: 'nardi', name: 'Net', image: 'nardi-net-lounge.jpg' },
  { brand: 'nardi', name: 'Doga', image: 'nardi-doga.jpg' },
  { brand: 'nardi', name: 'Maximo', image: 'nardi-maximo.jpg' },
  { brand: 'nardi', name: 'Rio', image: 'nardi-rio.jpg' },
  { brand: 'nardi', name: 'Sipario', image: 'nardi-sipario.jpg' },
  { brand: 'nardi', name: 'Tevere', image: 'nardi-tevere.jpg' },
  { brand: 'burotime', name: 'Days', image: 'burotime-days.jpg' },
  { brand: 'burotime', name: 'Nova', image: 'burotime-nova.jpg' },
  { brand: 'burotime', name: 'Opera', image: 'burotime-opera.jpg' },
  { brand: 'fabbian', name: 'Cloudy', image: 'fabbian-cloudy.jpg' },
  { brand: 'fabbian', name: 'Brotas', image: 'fabbian-brotas.jpg' },
  { brand: 'axolight', name: 'Layers', image: 'axolight-layers.jpg' },
  { brand: 'axolight', name: 'Manifesto', image: 'axolight-manifesto.jpg' },
  { brand: 'axolight', name: 'Paralela', image: 'axolight-paralela.jpg' },
]

type Tile = {
  image: string
  brand: string
  range?: string
  label?: T
  size: '1x1' | '2x1' | '1x2' | '2x2'
  isNew?: boolean
  pulse?: boolean
}

/** Mosaïque de l'accueil, dans l'ordre de la grille de la maquette. */
const MOSAIC: Tile[] = [
  {
    image: 'milla-archetype.jpg',
    brand: 'milla-et-milli',
    range: 'Archetype',
    size: '2x2',
    isNew: true,
    pulse: true,
  },
  {
    image: 'axolight-euroluce.jpg',
    brand: 'axolight',
    label: { fr: 'Euroluce 2023', en: 'Euroluce 2023', it: 'Euroluce 2023' },
    size: '1x2',
  },
  { image: 'fabbian-cloudy.jpg', brand: 'fabbian', range: 'Cloudy', size: '1x1' },
  {
    image: 'maffei-detail.jpg',
    brand: 'maffei',
    label: {
      fr: 'Parasols professionnels',
      en: 'Professional parasols',
      it: 'Ombrelloni professionali',
    },
    size: '1x1',
  },
  { image: 'johanson-split.jpg', brand: 'johanson-design', range: 'Split', size: '1x1' },
  {
    image: 'system180-comptoir.jpg',
    brand: 'system180',
    label: { fr: 'Comptoir modulaire', en: 'Modular counter', it: 'Bancone modulare' },
    size: '2x1',
  },
  {
    image: 'nardi-net-lounge.jpg',
    brand: 'nardi',
    range: 'Net',
    label: { fr: 'Net Lounge', en: 'Net Lounge', it: 'Net Lounge' },
    size: '1x2',
    pulse: true,
  },
  { image: 'burotime-days.jpg', brand: 'burotime', range: 'Days', size: '2x1' },
  {
    image: 'johanson-showroom-salon.jpg',
    brand: 'johanson-design',
    label: { fr: 'Showroom Copenhague', en: 'Copenhagen showroom', it: 'Showroom di Copenaghen' },
    size: '1x1',
  },
]

const HOME = {
  manifestoEyebrow: {
    fr: 'Agence PISE · depuis 2013',
    en: 'Agence PISE · since 2013',
    it: 'Agence PISE · dal 2013',
  },
  manifesto: {
    fr: 'Ambassadeur de marques européennes de mobilier et de luminaires contemporains.',
    en: 'Ambassador for European brands of contemporary furniture and lighting.',
    it: 'Ambasciatore di marchi europei di arredo e illuminazione contemporanei.',
  },
  manifestoLead: {
    fr: 'Nous accompagnons architectes, décorateurs et prescripteurs dans leurs projets d’hôtellerie, de bureaux et d’outdoor, avec une sélection de fabricants européens engagés et un service de sourcing sur mesure.',
    en: 'We support architects, interior designers and specifiers on hospitality, office and outdoor projects, with a selection of committed European manufacturers and a bespoke sourcing service.',
    it: 'Accompagniamo architetti, decoratori e prescrittori nei progetti di hospitality, uffici e outdoor, con una selezione di produttori europei impegnati e un servizio di sourcing su misura.',
  },
  generatorTitle: {
    fr: 'Visualisez votre espace avant de le meubler',
    en: 'See your space before you furnish it',
    it: 'Visualizzate il vostro spazio prima di arredarlo',
  },
  generatorText: {
    fr: 'Salle de réunion, lobby d’hôtel, coworking : composez la pièce avec les collections que nous représentons, puis exportez un visuel légendé avec les références.',
    en: 'Meeting room, hotel lobby, coworking: lay out the room with the collections we represent, then export a captioned visual with the product references.',
    it: 'Sala riunioni, lobby d’albergo, coworking: componete l’ambiente con le collezioni che rappresentiamo, poi esportate un’immagine con i riferimenti dei prodotti.',
  },
  generatorSteps: [
    {
      fr: 'Choisissez le type de pièce et ses dimensions',
      en: 'Choose the room type and its dimensions',
      it: 'Scegliete il tipo di ambiente e le dimensioni',
    },
    {
      fr: 'Placez le mobilier de nos fabricants',
      en: 'Place furniture from our brands',
      it: 'Posizionate gli arredi dei nostri marchi',
    },
    {
      fr: 'Exportez le visuel et demandez un devis',
      en: 'Export the visual and request a quote',
      it: 'Esportate l’immagine e richiedete un preventivo',
    },
  ] as T[],
  imrsivoTitle: {
    fr: 'IMRSIVO × Agence PISE',
    en: 'IMRSIVO × Agence PISE',
    it: 'IMRSIVO × Agence PISE',
  },
  imrsivoText: {
    fr: 'Depuis Station F, IMRSIVO conçoit nos showrooms et salons virtuels : des espaces 3D où prescripteurs et clients découvrent les collections à distance.',
    en: 'From Station F, IMRSIVO designs our virtual showrooms and trade fairs: 3D spaces where specifiers and clients discover the collections remotely.',
    it: 'Da Station F, IMRSIVO progetta i nostri showroom e fiere virtuali: spazi 3D dove prescrittori e clienti scoprono le collezioni a distanza.',
  },
  appointmentsTitle: {
    fr: 'Parlons de votre projet',
    en: 'Let’s talk about your project',
    it: 'Parliamo del vostro progetto',
  },
  appointmentsText: {
    fr: 'Choisissez un créneau avec l’un de nos collaborateurs, selon votre région et les marques qui vous intéressent.',
    en: 'Book a slot with one of our team, based on your region and the brands you are interested in.',
    it: 'Scegliete un orario con uno dei nostri collaboratori, in base alla vostra regione e ai marchi che vi interessano.',
  },
  newsletterTitle: {
    fr: 'Nouveautés, salons et réalisations, une fois par mois',
    en: 'New products, trade fairs and projects, once a month',
    it: 'Novità, fiere e progetti, una volta al mese',
  },
}

type NavLink = { url: string; label: T }

const NAV: NavLink[] = [
  { url: '/fabricants', label: { fr: 'Fabricants', en: 'Brands', it: 'Marchi' } },
  { url: '/generateur', label: { fr: 'Générateur', en: 'Space planner', it: 'Generatore' } },
  {
    url: '/espaces-virtuels',
    label: { fr: 'Espaces virtuels', en: 'Virtual spaces', it: 'Spazi virtuali' },
  },
  { url: '/realisations', label: { fr: 'Réalisations', en: 'Projects', it: 'Progetti' } },
  { url: '/agence', label: { fr: 'L’agence', en: 'The agency', it: 'L’agenzia' } },
]

const FOOTER_COLUMNS: { title: T; links: NavLink[] }[] = [
  {
    title: { fr: 'Découvrir', en: 'Discover', it: 'Scoprire' },
    links: [
      { url: '/fabricants', label: { fr: 'Fabricants', en: 'Brands', it: 'Marchi' } },
      {
        url: '/generateur',
        label: { fr: 'Générateur de visuels', en: 'Space planner', it: 'Generatore di ambienti' },
      },
      {
        url: '/espaces-virtuels',
        label: { fr: 'Espaces virtuels', en: 'Virtual spaces', it: 'Spazi virtuali' },
      },
      { url: '/realisations', label: { fr: 'Réalisations', en: 'Projects', it: 'Progetti' } },
    ],
  },
  {
    title: { fr: 'L’agence', en: 'The agency', it: 'L’agenzia' },
    links: [
      { url: '/agence', label: { fr: 'Qui sommes-nous', en: 'About us', it: 'Chi siamo' } },
      { url: '/agence/equipe', label: { fr: 'L’équipe', en: 'Our team', it: 'Il team' } },
      { url: '/agence/showrooms', label: { fr: 'Showrooms', en: 'Showrooms', it: 'Showroom' } },
      { url: '/actualites', label: { fr: 'Blog', en: 'Blog', it: 'Blog' } },
    ],
  },
  {
    title: { fr: 'Contact', en: 'Contact', it: 'Contatti' },
    links: [
      {
        url: '/rendez-vous',
        label: {
          fr: 'Prendre rendez-vous',
          en: 'Book an appointment',
          it: 'Prendi un appuntamento',
        },
      },
      { url: '/contact', label: { fr: 'Nous écrire', en: 'Write to us', it: 'Scriveteci' } },
      { url: '/pro', label: { fr: 'Espace pro', en: 'Trade area', it: 'Area pro' } },
    ],
  },
]

const LEGAL: NavLink[] = [
  {
    url: '/mentions-legales',
    label: { fr: 'Mentions légales', en: 'Legal notice', it: 'Note legali' },
  },
  { url: '/confidentialite', label: { fr: 'Confidentialité', en: 'Privacy', it: 'Privacy' } },
]

const TAGLINE: T = {
  fr: 'Mobilier et luminaires européens pour l’hôtellerie, les bureaux et l’outdoor.',
  en: 'European furniture and lighting for hospitality, offices and outdoor spaces.',
  it: 'Arredi e illuminazione europei per hospitality, uffici e outdoor.',
}

const BRANDS_PAGE = {
  title: { fr: 'Nos fabricants', en: 'Our brands', it: 'I nostri marchi' },
  lead: {
    fr: 'Des maisons européennes de mobilier et de luminaires, choisies pour leur savoir-faire et leur tenue dans les lieux qui reçoivent du public. Chaque marque a un référent PISE.',
    en: 'European furniture and lighting makers, chosen for their craftsmanship and how well they hold up in public spaces. Each brand has a dedicated PISE contact.',
    it: 'Aziende europee di arredo e illuminazione, scelte per il loro saper fare e la resistenza negli spazi aperti al pubblico. Ogni marchio ha un referente PISE.',
  },
  sourcingTitle: {
    fr: 'Vous ne trouvez pas la pièce qu’il vous faut ?',
    en: 'Can’t find the piece you need?',
    it: 'Non trovate il pezzo che cercate?',
  },
  sourcingText: {
    fr: 'Accessoires, textiles, pièces spéciales : notre équipe cherche pour vous auprès de son réseau de fabricants européens.',
    en: 'Accessories, textiles, special pieces: our team sources them for you from its network of European makers.',
    it: 'Accessori, tessili, pezzi speciali: il nostro team li cerca per voi nella sua rete di produttori europei.',
  },
}

const external = (url: string) => ({ type: 'external' as const, url })

const brandIds = async ({ payload, req }: Ctx) => {
  const { docs } = await payload.find({
    collection: 'brands',
    limit: 100,
    depth: 0,
    draft: true,
    req,
  })
  return new Map(docs.map((d) => [d.slug ?? '', d.id]))
}

export const seedRanges = async (ctx: Ctx) => {
  const { payload, req } = ctx
  const brands = await brandIds(ctx)
  const counters = new Map<string, number>()
  for (const range of RANGES) {
    const brand = brands.get(range.brand)
    if (!brand) continue
    const order = (counters.get(range.brand) ?? 0) + 1
    counters.set(range.brand, order)
    const existing = await payload.find({
      collection: 'ranges',
      where: { and: [{ brand: { equals: brand } }, { name: { equals: range.name } }] },
      limit: 1,
      draft: true,
      req,
    })
    if (existing.totalDocs > 0) continue
    const heroImage = await findSeedMedia(ctx, range.image)
    await payload.create({
      collection: 'ranges',
      data: { name: range.name, brand, heroImage, order, _status: 'published' },
      locale: 'fr',
      req,
    })
  }
}

const rangeIds = async ({ payload, req }: Ctx) => {
  const { docs } = await payload.find({
    collection: 'ranges',
    limit: 500,
    depth: 1,
    draft: true,
    req,
  })
  return new Map(
    docs.map(
      (d) => [`${typeof d.brand === 'object' ? d.brand.slug : ''}/${d.name}`, d.id] as const,
    ),
  )
}

/** Remplit un tableau dans les trois langues : les lignes gardent leur identifiant d'une langue à l'autre. */
type Row = { id?: string | null } & Record<string, unknown>

export const seedGlobals = async (ctx: Ctx) => {
  const { payload, req } = ctx
  const brands = await brandIds(ctx)
  const ranges = await rangeIds(ctx)

  // Accueil
  const home = await payload.findGlobal({ slug: 'home', depth: 0, draft: true, req })
  if (!home.mosaic?.length) {
    const tiles = []
    for (const tile of MOSAIC) {
      const image = await findSeedMedia(ctx, tile.image)
      if (!image) continue
      tiles.push({ tile, image })
    }
    const generatorImage = await findSeedMedia(ctx, 'burotime-opera.jpg')
    const appointmentsImage = await findSeedMedia(ctx, 'johanson-showroom-portrait.jpg')
    let rows: Row[] = []
    let steps: Row[] = []
    for (const locale of LOCALES) {
      const saved = await payload.updateGlobal({
        slug: 'home',
        locale,
        depth: 0,
        req,
        data: {
          _status: 'published',
          mosaic: tiles.map(({ tile, image }, i) => ({
            ...(rows[i]?.id ? { id: rows[i].id } : {}),
            image,
            brand: brands.get(tile.brand) ?? null,
            range: tile.range ? (ranges.get(`${tile.brand}/${tile.range}`) ?? null) : null,
            label: tile.label?.[locale] ?? null,
            size: tile.size,
            isNew: Boolean(tile.isNew),
            pulse: Boolean(tile.pulse),
          })),
          manifestoEyebrow: HOME.manifestoEyebrow[locale],
          manifesto: HOME.manifesto[locale],
          manifestoLead: HOME.manifestoLead[locale],
          generator: {
            title: HOME.generatorTitle[locale],
            text: HOME.generatorText[locale],
            image: generatorImage,
            steps: HOME.generatorSteps.map((step, i) => ({
              ...(steps[i]?.id ? { id: steps[i].id } : {}),
              title: step[locale],
            })),
          },
          imrsivo: { title: HOME.imrsivoTitle[locale], text: HOME.imrsivoText[locale] },
          appointments: {
            title: HOME.appointmentsTitle[locale],
            text: HOME.appointmentsText[locale],
            image: appointmentsImage,
          },
          newsletter: { title: HOME.newsletterTitle[locale] },
        },
      })
      rows = (saved.mosaic ?? []) as Row[]
      steps = (saved.generator?.steps ?? []) as Row[]
    }
  }

  // Menu principal
  const navigation = await payload.findGlobal({ slug: 'navigation', depth: 0, req })
  if (!navigation.items?.length) {
    let rows: Row[] = []
    for (const locale of LOCALES) {
      const saved = await payload.updateGlobal({
        slug: 'navigation',
        locale,
        depth: 0,
        req,
        data: {
          items: NAV.map((item, i) => ({
            ...(rows[i]?.id ? { id: rows[i].id } : {}),
            link: { ...external(item.url), label: item.label[locale] },
          })),
          proLabel: { fr: 'Espace pro', en: 'Trade area', it: 'Area pro' }[locale],
          appointmentLabel: { fr: 'Rendez-vous', en: 'Appointment', it: 'Appuntamento' }[locale],
        },
      })
      rows = (saved.items ?? []) as Row[]
    }
  }

  // Pied de page
  const footer = await payload.findGlobal({ slug: 'footer', depth: 0, req })
  if (!footer.columns?.length) {
    let columns: (Row & { links?: Row[] | null })[] = []
    let legal: Row[] = []
    for (const locale of LOCALES) {
      const saved = await payload.updateGlobal({
        slug: 'footer',
        locale,
        depth: 0,
        req,
        data: {
          banner: {
            text: {
              fr: 'Visitez nos espaces virtuels',
              en: 'Visit our virtual spaces',
              it: 'Visitate i nostri spazi virtuali',
            }[locale],
            credit: {
              fr: 'Réalisés par IMRSIVO',
              en: 'Produced by IMRSIVO',
              it: 'Realizzati da IMRSIVO',
            }[locale],
            link: external('/espaces-virtuels'),
          },
          tagline: TAGLINE[locale],
          columns: FOOTER_COLUMNS.map((column, i) => ({
            ...(columns[i]?.id ? { id: columns[i].id } : {}),
            title: column.title[locale],
            links: column.links.map((link, j) => ({
              ...(columns[i]?.links?.[j]?.id ? { id: columns[i].links![j].id } : {}),
              link: { ...external(link.url), label: link.label[locale] },
            })),
          })),
          legalLinks: LEGAL.map((link, i) => ({
            ...(legal[i]?.id ? { id: legal[i].id } : {}),
            link: { ...external(link.url), label: link.label[locale] },
          })),
        },
      })
      columns = (saved.columns ?? []) as typeof columns
      legal = (saved.legalLinks ?? []) as Row[]
    }
  }

  // Réglages généraux
  const settings = await payload.findGlobal({ slug: 'settings', depth: 0, req })
  if (!settings.description) {
    for (const locale of LOCALES) {
      await payload.updateGlobal({
        slug: 'settings',
        locale,
        depth: 0,
        req,
        data: { foundingYear: 2013, description: HOME.manifestoLead[locale] },
      })
    }
  }

  // Page « Nos fabricants »
  const listings = await payload.findGlobal({ slug: 'listings', depth: 0, req })
  if (!listings.brands?.title) {
    const sourcingImage = await findSeedMedia(ctx, 'milla-chambre.jpg')
    for (const locale of LOCALES) {
      await payload.updateGlobal({
        slug: 'listings',
        locale,
        depth: 0,
        req,
        data: {
          brands: {
            title: BRANDS_PAGE.title[locale],
            lead: BRANDS_PAGE.lead[locale],
            sourcing: {
              title: BRANDS_PAGE.sourcingTitle[locale],
              text: BRANDS_PAGE.sourcingText[locale],
              image: sourcingImage,
            },
          },
        },
      })
    }
  }
}

/** Retire les collections de départ (les réglages globaux restent : ils n'ont pas d'état « vide » sûr). */
export const unseedRanges = async ({ payload, req }: Ctx) => {
  await payload.delete({
    collection: 'ranges',
    where: { name: { in: RANGES.map((r) => r.name) } },
    req,
  })
}
