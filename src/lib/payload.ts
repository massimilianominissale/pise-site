import 'server-only'

import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import { DEFAULT_LOCALE, type Locale, LOCALES } from '@/i18n/config'
import type {
  Brand,
  Document,
  Footer,
  Home,
  Listing,
  Navigation,
  Product,
  Project,
  Range,
  Setting,
  VirtualTour,
} from '@/payload-types'

/** Client Payload partagé (API locale : lecture directe en base, sans appel réseau). */
export const getPayloadClient = cache(async () => getPayload({ config }))

/** Brouillons visibles seulement en mode aperçu (activé depuis l'administration). */
export const isDraft = async () => (await draftMode()).isEnabled

type Globals = {
  home: Home
  navigation: Navigation
  footer: Footer
  settings: Setting
  listings: Listing
}

/** Réglage global dans la langue demandée (brouillon de l'accueil visible en mode aperçu). */
export const getGlobal = cache(
  async <T extends keyof Globals>(slug: T, locale: Locale): Promise<Globals[T]> => {
    const payload = await getPayloadClient()
    const draft = slug === 'home' ? await isDraft() : false
    const doc = await payload.findGlobal({
      slug,
      locale,
      depth: 2,
      draft,
      // Fabricants et collections liés : seulement ce qu'affichent les gabarits.
      populate: {
        brands: {
          name: true,
          slug: true,
          universes: true,
          country: true,
          cardImage: true,
          heroImage: true,
        },
        ranges: { name: true, slug: true, brand: true },
      },
    })
    return doc as unknown as Globals[T]
  },
)

export const getBrands = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const draft = await isDraft()
  const { docs } = await payload.find({
    collection: 'brands',
    locale,
    draft,
    depth: 1,
    limit: 100,
    sort: 'order',
    joins: false,
    where: draft ? undefined : { _status: { equals: 'published' } },
  })
  return docs as Brand[]
})

export const getBrandBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const draft = await isDraft()
  const { docs } = await payload.find({
    collection: 'brands',
    locale,
    draft,
    depth: 2,
    limit: 1,
    joins: false,
    populate: { brands: { name: true, slug: true } },
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  })
  return (docs[0] as Brand | undefined) ?? null
})

export const getRangesOfBrand = cache(async (brandId: number, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'ranges',
    locale,
    depth: 1,
    limit: 50,
    sort: 'order',
    joins: false,
    populate: { brands: { name: true, slug: true } },
    where: { and: [{ brand: { equals: brandId } }, { _status: { equals: 'published' } }] },
  })
  return docs
})

export const getProductsOfBrand = cache(async (brandId: number, locale: Locale, limit = 8) => {
  const payload = await getPayloadClient()
  const { docs, totalDocs } = await payload.find({
    collection: 'products',
    locale,
    depth: 1,
    limit,
    sort: ['-featured', 'name'],
    populate: { brands: { name: true, slug: true }, ranges: { name: true, slug: true } },
    where: { and: [{ brand: { equals: brandId } }, { _status: { equals: 'published' } }] },
  })
  return { docs, totalDocs }
})

export const getProjects = cache(
  async (locale: Locale, { brandId, limit = 6 }: { brandId?: number; limit?: number } = {}) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'projects',
      locale,
      depth: 1,
      limit,
      sort: ['order', '-year'],
      populate: { brands: { name: true, slug: true } },
      where: {
        and: [
          { _status: { equals: 'published' } },
          ...(brandId ? [{ brands: { contains: brandId } }] : []),
        ],
      },
    })
    return docs
  },
)

export const getVirtualTours = cache(
  async (
    locale: Locale,
    {
      brandId,
      limit = 6,
      liveOnly = true,
    }: { brandId?: number; limit?: number; liveOnly?: boolean } = {},
  ) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'virtual-tours',
      locale,
      depth: 1,
      limit,
      sort: 'order',
      populate: { brands: { name: true, slug: true } },
      where: {
        and: [
          { _status: { equals: 'published' } },
          ...(liveOnly ? [{ availability: { equals: 'live' } }] : []),
          ...(brandId ? [{ brands: { contains: brandId } }] : []),
        ],
      },
    })
    return docs
  },
)

export const getUpcomingEvents = cache(async (locale: Locale, limit = 2) => {
  const payload = await getPayloadClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { docs } = await payload.find({
    collection: 'events',
    locale,
    depth: 1,
    limit,
    sort: 'startDate',
    where: {
      and: [
        { _status: { equals: 'published' } },
        {
          or: [
            { endDate: { greater_than_equal: today.toISOString() } },
            { startDate: { greater_than_equal: today.toISOString() } },
          ],
        },
      ],
    },
  })
  return docs
})

export const getPublicDocumentsOfBrand = cache(async (brandId: number, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'documents',
    locale,
    depth: 0,
    limit: 20,
    overrideAccess: false,
    where: { brand: { equals: brandId } },
  })
  return docs
})

/** Annonces actives à cette date, pour le bandeau du haut. */
export const getActiveAnnouncement = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const now = new Date().toISOString()
  const { docs } = await payload.find({
    collection: 'announcements',
    locale,
    depth: 1,
    limit: 1,
    sort: '-startsAt',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { format: { equals: 'bar' } },
        { or: [{ startsAt: { exists: false } }, { startsAt: { less_than_equal: now } }] },
        { or: [{ endsAt: { exists: false } }, { endsAt: { greater_than: now } }] },
      ],
    },
  })
  return docs[0] ?? null
})

/* ---------- Catalogue ---------- */

/** Ce que les cartes et fiches affichent des fabricants et collections liés. */
const catalogPopulate = {
  brands: { name: true, slug: true, referent: true },
  ranges: { name: true, slug: true, brand: true },
  'product-categories': { name: true, slug: true },
  sectors: { name: true, slug: true },
} as const

const publishedUnlessDraft = (draft: boolean, ...conditions: Where[]): Where => ({
  and: [...conditions, ...(draft ? [] : [{ _status: { equals: 'published' } } as Where])],
})

export const getProductBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const draft = await isDraft()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    draft,
    depth: 2,
    limit: 1,
    populate: {
      ...catalogPopulate,
      // Les documents sont relus avec les droits du public (voir getPublicDocuments).
      documents: { title: true },
      products: {
        name: true,
        slug: true,
        brand: true,
        range: true,
        images: true,
        _status: true,
      },
    },
    where: publishedUnlessDraft(draft, { slug: { equals: slug } }),
  })
  return (docs[0] as Product | undefined) ?? null
})

/** Produit par sa référence (lien permanent /p/[référence]), insensible à la casse. */
export const getProductByReference = cache(async (reference: string) => {
  const payload = await getPayloadClient()
  for (const candidate of new Set([reference, reference.toUpperCase()])) {
    const { docs } = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 1,
      select: { slug: true, reference: true },
      where: publishedUnlessDraft(false, { reference: { equals: candidate } }),
    })
    if (docs[0]) return docs[0]
  }
  return null
})

/** Documents d'une fiche, filtrés par les droits d'un visiteur anonyme (les documents pro restent cachés). */
export const getPublicDocuments = cache(async (ids: number[], locale: Locale) => {
  if (!ids.length) return []
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'documents',
    locale,
    depth: 0,
    limit: ids.length,
    overrideAccess: false,
    where: { id: { in: ids } },
  })
  // Ordre choisi dans le back-office.
  return ids.map((id) => docs.find((d) => d.id === id)).filter((d): d is Document => Boolean(d))
})

export type ProductFilters = { brand?: string; category?: string; page?: number }

export const PRODUCTS_PER_PAGE = 24

export const getProducts = cache(
  async (locale: Locale, { brand, category, page = 1 }: ProductFilters = {}) => {
    const payload = await getPayloadClient()
    const conditions: Where[] = []
    if (brand) conditions.push({ 'brand.slug': { equals: brand } })
    if (category) conditions.push({ 'categories.slug': { equals: category } })
    const result = await payload.find({
      collection: 'products',
      locale,
      depth: 1,
      limit: PRODUCTS_PER_PAGE,
      page,
      sort: ['-featured', 'name'],
      populate: catalogPopulate,
      where: publishedUnlessDraft(false, ...conditions),
    })
    return result
  },
)

/** Catégories et fabricants qui ont au moins un produit publié (pour les filtres du catalogue). */
export const getCatalogFacets = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    depth: 1,
    limit: 1000,
    pagination: false,
    select: { brand: true, categories: true },
    populate: catalogPopulate,
    where: publishedUnlessDraft(false),
  })
  const brands = new Map<string, { slug: string; name: string }>()
  const categories = new Map<string, { slug: string; name: string; order: number }>()
  for (const doc of docs) {
    const b = doc.brand
    if (b && typeof b === 'object' && b.slug) brands.set(b.slug, { slug: b.slug, name: b.name })
    for (const c of doc.categories ?? []) {
      if (c && typeof c === 'object' && c.slug) {
        categories.set(c.slug, { slug: c.slug, name: c.name, order: c.order ?? 0 })
      }
    }
  }
  return {
    brands: [...brands.values()].sort((a, b) => a.name.localeCompare(b.name, locale)),
    categories: [...categories.values()].sort((a, b) => a.order - b.order),
  }
})

export const getRange = cache(async (brandSlug: string, rangeSlug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const draft = await isDraft()
  const brand = await getBrandBySlug(brandSlug, locale)
  if (!brand) return null
  const { docs } = await payload.find({
    collection: 'ranges',
    locale,
    draft,
    depth: 1,
    limit: 1,
    joins: false,
    populate: catalogPopulate,
    where: publishedUnlessDraft(
      draft,
      { brand: { equals: brand.id } },
      { slug: { equals: rangeSlug } },
    ),
  })
  const range = (docs[0] as Range | undefined) ?? null
  return range ? { range, brand } : null
})

export const getProductsOfRange = cache(async (rangeId: number, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    depth: 1,
    limit: 100,
    sort: ['-featured', 'name'],
    populate: catalogPopulate,
    where: publishedUnlessDraft(false, { range: { equals: rangeId } }),
  })
  return docs
})

/* ---------- Documents à identifiant traduit ---------- */

/**
 * Document dont l'identifiant d'URL est traduit (réalisations, visites, actualités, pages) :
 * cherché dans la langue demandée, puis dans les autres, pour qu'un lien copié depuis une autre
 * langue (ou le sélecteur de langue) retrouve la page. La page redirige ensuite vers le bon slug.
 */
const findLocalized = async <T extends { id: number }>(
  locale: Locale,
  find: (l: Locale) => Promise<T | undefined>,
  byId: (id: number) => Promise<T>,
): Promise<T | null> => {
  const direct = await find(locale)
  if (direct) return direct
  for (const other of LOCALES) {
    if (other === locale) continue
    const found = await find(other)
    if (found) return byId(found.id)
  }
  return null
}

type LocalizedSlugCollection = 'projects' | 'virtual-tours' | 'posts' | 'pages' | 'events'

/** Identifiant d'URL d'un document dans chaque langue (balises hreflang). */
export const getLocalizedSlugs = cache(
  async (
    collection: LocalizedSlugCollection,
    id: number,
  ): Promise<Record<Locale, string | null>> => {
    const payload = await getPayloadClient()
    const doc = (await payload.findByID({
      collection,
      id,
      locale: 'all',
      depth: 0,
    })) as unknown as {
      slug?: Partial<Record<Locale, string | null>> | string | null
    }
    const slug = doc.slug
    const pick = (l: Locale) =>
      slug && typeof slug === 'object' ? (slug[l] ?? slug[DEFAULT_LOCALE] ?? null) : (slug ?? null)
    return { fr: pick('fr'), en: pick('en'), it: pick('it') }
  },
)

/* ---------- Réalisations ---------- */

export type ProjectFilters = { sector?: string; brand?: string; region?: string; page?: number }

export const PROJECTS_PER_PAGE = 9

const projectPopulate = {
  brands: { name: true, slug: true },
  sectors: { name: true, slug: true },
  products: { name: true, slug: true, brand: true, range: true, images: true, _status: true },
  'virtual-tours': {
    title: true,
    slug: true,
    kind: true,
    thumbnail: true,
    availability: true,
    location: true,
    summary: true,
    credit: true,
  },
} as const

/** Réalisations publiées ; « Voir plus » agrandit la liste (page 2 = 18 projets). */
export const getProjectsList = cache(
  async (locale: Locale, { sector, brand, region, page = 1 }: ProjectFilters = {}) => {
    const payload = await getPayloadClient()
    const conditions: Where[] = []
    if (sector) conditions.push({ 'sectors.slug': { equals: sector } })
    if (brand) conditions.push({ 'brands.slug': { equals: brand } })
    if (region) conditions.push({ region: { equals: region } })
    return payload.find({
      collection: 'projects',
      locale,
      depth: 1,
      limit: PROJECTS_PER_PAGE * page,
      // Projet à la une d'abord, puis l'ordre choisi, puis les plus récents.
      sort: ['-featured', 'order', '-year', '-createdAt'],
      populate: projectPopulate,
      where: publishedUnlessDraft(false, ...conditions),
    })
  },
)

/** Secteurs, fabricants et régions présents dans les réalisations publiées (filtres). */
export const getProjectFacets = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    locale,
    depth: 1,
    pagination: false,
    select: { sectors: true, brands: true, region: true, featured: true },
    populate: projectPopulate,
    where: publishedUnlessDraft(false),
  })
  const sectors = new Map<string, { slug: string; name: string; order: number }>()
  const brands = new Map<string, { slug: string; name: string }>()
  const regions = new Set<string>()
  for (const doc of docs) {
    for (const s of doc.sectors ?? []) {
      if (s && typeof s === 'object' && s.slug)
        sectors.set(s.slug, { slug: s.slug, name: s.name, order: s.order ?? 0 })
    }
    for (const b of doc.brands ?? []) {
      if (b && typeof b === 'object' && b.slug) brands.set(b.slug, { slug: b.slug, name: b.name })
    }
    if (doc.region) regions.add(doc.region)
  }
  return {
    sectors: [...sectors.values()].sort((a, b) => a.order - b.order),
    brands: [...brands.values()].sort((a, b) => a.name.localeCompare(b.name, locale)),
    regions: [...regions].sort((a, b) => a.localeCompare(b, locale)),
  }
})

export const getProjectBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const draft = await isDraft()
  const options = {
    collection: 'projects' as const,
    draft,
    depth: 2,
    populate: {
      ...projectPopulate,
      ...catalogPopulate,
      brands: {
        name: true,
        slug: true,
        cardImage: true,
        heroImage: true,
        universes: true,
        country: true,
        sectors: true,
        tagline: true,
      },
    } as const,
  }
  return findLocalized<Project>(
    locale,
    async (l) =>
      (
        await payload.find({
          ...options,
          locale: l,
          limit: 1,
          where: publishedUnlessDraft(draft, { slug: { equals: slug } }),
        })
      ).docs[0] as Project | undefined,
    async (id) => (await payload.findByID({ ...options, id, locale })) as Project,
  )
})

/* ---------- Espaces virtuels ---------- */

export const getAllVirtualTours = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'virtual-tours',
    locale,
    depth: 1,
    pagination: false,
    sort: ['order', '-createdAt'],
    populate: { brands: { name: true, slug: true } },
    where: publishedUnlessDraft(false),
  })
  return docs
})

export const getTourBySlug = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const draft = await isDraft()
  const options = {
    collection: 'virtual-tours' as const,
    draft,
    depth: 2,
    populate: {
      ...catalogPopulate,
      products: { name: true, slug: true, brand: true, range: true, images: true, _status: true },
    } as const,
  }
  return findLocalized<VirtualTour>(
    locale,
    async (l) =>
      (
        await payload.find({
          ...options,
          locale: l,
          limit: 1,
          where: publishedUnlessDraft(draft, { slug: { equals: slug } }),
        })
      ).docs[0] as VirtualTour | undefined,
    async (id) => (await payload.findByID({ ...options, id, locale })) as VirtualTour,
  )
})

/** Réalisations liées à une visite (pour la page de la visite). */
export const getProjectsOfTour = cache(async (tourId: number, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    locale,
    depth: 1,
    limit: 3,
    populate: projectPopulate,
    where: publishedUnlessDraft(false, { virtualTour: { equals: tourId } }),
  })
  return docs
})

/* ---------- Intégrations ---------- */

/** Réglages des outils intégrés (lecture serveur : le global n'est pas public). */
export const getIntegrations = cache(async () => {
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'integrations', depth: 0 })
  return {
    mobilia: {
      enabled: Boolean(doc.mobilia?.enabled && doc.mobilia?.embedUrl),
      embedUrl: doc.mobilia?.embedUrl ?? null,
    },
    frameOrigins: (doc.frameOrigins ?? []).filter(Boolean) as string[],
  }
})
