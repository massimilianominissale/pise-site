import 'server-only'

import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/config'
import type { Brand, Footer, Home, Listing, Navigation, Setting } from '@/payload-types'

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
