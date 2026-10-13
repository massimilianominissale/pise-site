import path from 'path'
import type { Payload, PayloadRequest } from 'payload'

/**
 * Données de départ : les six secteurs et les huit fabricants présentés dans les maquettes,
 * avec leurs photos (dossier « PISE 2026 » du Drive).
 *
 * Seules les informations connues sont renseignées : les textes de présentation, logos,
 * sites officiels et pays non confirmés restent vides, à compléter par PISE.
 * L'import est idempotent : un secteur ou un fabricant déjà présent n'est pas recréé.
 */

type Locale = 'fr' | 'en' | 'it'
type Localized = Record<Locale, string>

const IMAGES_DIR = path.resolve(process.cwd(), 'src/seed/images')

export const SECTORS: { slug: string; name: Localized; order: number }[] = [
  { slug: 'bureaux', name: { fr: 'Bureaux', en: 'Offices', it: 'Uffici' }, order: 1 },
  { slug: 'hotellerie', name: { fr: 'Hôtellerie', en: 'Hospitality', it: 'Ospitalità' }, order: 2 },
  {
    slug: 'restauration',
    name: { fr: 'Restauration', en: 'Restaurants', it: 'Ristorazione' },
    order: 3,
  },
  { slug: 'education', name: { fr: 'Éducation', en: 'Education', it: 'Istruzione' }, order: 4 },
  { slug: 'coworking', name: { fr: 'Coworking', en: 'Coworking', it: 'Coworking' }, order: 5 },
  { slug: 'outdoor', name: { fr: 'Outdoor', en: 'Outdoor', it: 'Outdoor' }, order: 6 },
]

type SeedImage = { file: string; alt: string; credit?: string }

type SeedBrand = {
  name: string
  slug: string
  universes: ('furniture' | 'lighting' | 'outdoor' | 'acoustics')[]
  country?: Localized
  order: number
  card: SeedImage
  hero: SeedImage
  gallery: SeedImage[]
}

const SWEDEN: Localized = { fr: 'Suède', en: 'Sweden', it: 'Svezia' }
const ITALY: Localized = { fr: 'Italie', en: 'Italy', it: 'Italia' }
const TURKEY: Localized = { fr: 'Turquie', en: 'Türkiye', it: 'Turchia' }
const GERMANY: Localized = { fr: 'Allemagne', en: 'Germany', it: 'Germania' }

export const BRANDS: SeedBrand[] = [
  {
    name: 'Johanson Design',
    slug: 'johanson-design',
    universes: ['furniture'],
    country: SWEDEN,
    order: 1,
    card: { file: 'johanson-split.jpg', alt: 'Tabourets Split rouges devant un mur vert' },
    hero: {
      file: 'johanson-showroom-salon.jpg',
      alt: 'Salon du showroom Johanson Design, canapé et table basse jaune',
    },
    gallery: [
      {
        file: 'johanson-showroom-accueil.jpg',
        alt: 'Espace d’accueil du showroom Johanson Design',
      },
      {
        file: 'johanson-showroom-portrait.jpg',
        alt: 'Banquette et cloisons colorées dans le showroom Johanson Design',
      },
      { file: 'johanson-split-detail.jpg', alt: 'Détail d’assise du tabouret Split' },
      { file: 'johanson-lyon-detail.jpg', alt: 'Détail de la collection Lyon' },
    ],
  },
  {
    name: 'Milla & Milli',
    slug: 'milla-et-milli',
    universes: ['furniture'],
    order: 2,
    card: {
      file: 'milla-iris.jpg',
      alt: 'Table et chaises Milla & Milli dans un patio aux arches blanches',
    },
    hero: {
      file: 'milla-archetype.jpg',
      alt: 'Salon aux fauteuils arrondis et tables basses en bois, collection Archetype',
    },
    gallery: [
      { file: 'milla-chambre.jpg', alt: 'Chambre aux tons sombres meublée par Milla & Milli' },
    ],
  },
  {
    name: 'Nardi',
    slug: 'nardi',
    universes: ['outdoor', 'furniture'],
    country: ITALY,
    order: 3,
    card: { file: 'nardi-rio.jpg', alt: 'Table Rio et chaises Nardi sur une terrasse en bois' },
    hero: { file: 'nardi-net-lounge.jpg', alt: 'Fauteuils Net Lounge de Nardi en extérieur' },
    gallery: [
      { file: 'nardi-doga.jpg', alt: 'Fauteuils Doga rouges autour d’une table sur gravier' },
      { file: 'nardi-maximo.jpg', alt: 'Canapés Maximo dans un jardin d’hiver' },
      { file: 'nardi-sipario.jpg', alt: 'Cloisons végétalisées Sipario sur une terrasse' },
      { file: 'nardi-tevere.jpg', alt: 'Table Tevere dressée en extérieur' },
    ],
  },
  {
    name: 'Bürotime',
    slug: 'burotime',
    universes: ['furniture'],
    country: TURKEY,
    order: 4,
    card: { file: 'burotime-nova.jpg', alt: 'Chaises et tabourets de la gamme Nova de Bürotime' },
    hero: { file: 'burotime-opera.jpg', alt: 'Table de réunion Opera de Bürotime vue du dessus' },
    gallery: [
      { file: 'burotime-days.jpg', alt: 'Tables et banquettes de la gamme Days de Bürotime' },
      { file: 'burotime-days-vue-dessus.jpg', alt: 'Banquette modulaire Days vue du dessus' },
    ],
  },
  {
    name: 'System180',
    slug: 'system180',
    universes: ['furniture'],
    country: GERMANY,
    order: 5,
    card: { file: 'system180-comptoir.jpg', alt: 'Comptoir modulaire System180 corail' },
    hero: { file: 'system180-forest.jpg', alt: 'Rangements modulaires System180 vert forêt' },
    gallery: [{ file: 'system180-forest-2.jpg', alt: 'Mobilier modulaire System180 vert forêt' }],
  },
  {
    name: 'Fabbian',
    slug: 'fabbian',
    universes: ['lighting'],
    country: ITALY,
    order: 6,
    card: { file: 'fabbian-cloudy.jpg', alt: 'Suspensions Cloudy de Fabbian' },
    hero: {
      file: 'fabbian-acustica.jpg',
      alt: 'Restaurant éclairé par les suspensions acoustiques Acustica de Fabbian',
    },
    gallery: [
      { file: 'fabbian-xyz.jpg', alt: 'Luminaires XY Z de Fabbian au-dessus d’une salle' },
      { file: 'fabbian-brotas.jpg', alt: 'Suspension Brotas de Fabbian devant un mur ondulé' },
    ],
  },
  {
    name: 'Axolight',
    slug: 'axolight',
    universes: ['lighting'],
    country: ITALY,
    order: 7,
    card: { file: 'axolight-paralela.jpg', alt: 'Luminaire Paralela d’Axolight' },
    hero: {
      file: 'axolight-euroluce.jpg',
      alt: 'Stand Axolight au salon Euroluce 2023',
      credit: 'Michele Mescolin',
    },
    gallery: [
      { file: 'axolight-layers.jpg', alt: 'Suspensions Layers d’Axolight dans un hall' },
      {
        file: 'axolight-manifesto.jpg',
        alt: 'Applique Manifesto d’Axolight sur un mur sombre',
        credit: 'Timo Ripatti, Kibou Studio',
      },
    ],
  },
  {
    name: 'Maffei',
    slug: 'maffei',
    universes: ['outdoor'],
    order: 8,
    card: { file: 'maffei-piscine.jpg', alt: 'Parasols Maffei au bord d’une piscine' },
    hero: {
      file: 'maffei-bord-de-mer.jpg',
      alt: 'Parasol Maffei et bains de soleil face à la mer',
    },
    gallery: [
      {
        file: 'maffei-piscine-vue-dessus.jpg',
        alt: 'Parasols Maffei vus du dessus au bord d’une piscine',
      },
      { file: 'maffei-detail.jpg', alt: 'Détail de la structure d’un parasol Maffei' },
    ],
  },
]

type Ctx = { payload: Payload; req?: PayloadRequest }

const uploadImage = async ({ payload, req }: Ctx, image: SeedImage, brandId?: number) => {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: image.alt, credit: image.credit, brand: brandId },
    filePath: path.join(IMAGES_DIR, image.file),
    locale: 'fr',
    req,
  })
  return doc.id
}

export const seedSectors = async (ctx: Ctx) => {
  const { payload, req } = ctx
  for (const sector of SECTORS) {
    const existing = await payload.find({
      collection: 'sectors',
      where: { slug: { equals: sector.slug } },
      limit: 1,
      req,
    })
    if (existing.totalDocs > 0) continue
    const doc = await payload.create({
      collection: 'sectors',
      data: { name: sector.name.fr, slug: sector.slug, order: sector.order },
      locale: 'fr',
      req,
    })
    for (const locale of ['en', 'it'] as const) {
      await payload.update({
        collection: 'sectors',
        id: doc.id,
        data: { name: sector.name[locale] },
        locale,
        req,
      })
    }
  }
}

export const seedBrands = async (ctx: Ctx) => {
  const { payload, req } = ctx
  for (const brand of BRANDS) {
    const existing = await payload.find({
      collection: 'brands',
      where: { slug: { equals: brand.slug } },
      limit: 1,
      draft: true,
      req,
    })
    if (existing.totalDocs > 0) {
      payload.logger.info(`Fabricant déjà présent, ignoré : ${brand.name}`)
      continue
    }

    const created = await payload.create({
      collection: 'brands',
      data: {
        name: brand.name,
        slug: brand.slug,
        universes: brand.universes,
        country: brand.country?.fr,
        order: brand.order,
        _status: 'published',
      },
      locale: 'fr',
      req,
    })

    const cardImage = await uploadImage(ctx, brand.card, created.id)
    const heroImage = await uploadImage(ctx, brand.hero, created.id)
    const gallery: number[] = []
    for (const image of brand.gallery) gallery.push(await uploadImage(ctx, image, created.id))

    await payload.update({
      collection: 'brands',
      id: created.id,
      data: { cardImage, heroImage, gallery, _status: 'published' },
      locale: 'fr',
      req,
    })

    if (brand.country) {
      for (const locale of ['en', 'it'] as const) {
        await payload.update({
          collection: 'brands',
          id: created.id,
          data: { country: brand.country[locale], _status: 'published' },
          locale,
          req,
        })
      }
    }
    payload.logger.info(`Fabricant créé : ${brand.name} (${brand.gallery.length + 2} images)`)
  }
}

export const unseedBrands = async ({ payload, req }: Ctx) => {
  const slugs = BRANDS.map((b) => b.slug)
  const brands = await payload.find({
    collection: 'brands',
    where: { slug: { in: slugs } },
    limit: 100,
    draft: true,
    req,
  })
  const ids = brands.docs.map((d) => d.id)
  if (ids.length) {
    await payload.delete({ collection: 'media', where: { brand: { in: ids } }, req })
    await payload.delete({ collection: 'brands', where: { id: { in: ids } }, req })
  }
  await payload.delete({
    collection: 'sectors',
    where: { slug: { in: SECTORS.map((s) => s.slug) } },
    req,
  })
}
