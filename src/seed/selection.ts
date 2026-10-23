import { LOCALES } from '../i18n/config'
import type { Brand, Product, Range } from '../payload-types'
import type { Ctx } from './brands'
import { isEmptyRich } from './rich'

/**
 * « Notre sélection » (demande de PISE du 22/10) : la page fabricant ne présente plus des
 * collections mais des produits. AJOUT SEUL, rien n'est supprimé :
 * - chaque collection sans fiche produit devient une fiche produit (nom, photos, textes,
 *   designer et ordre repris ; référence provisoire FABRICANT-NOM) ;
 * - une collection qui a déjà sa fiche (Net → Net Lounge chez Nardi…) y est fusionnée :
 *   seul l'ordre d'affichage, s'il est vide, est repris ;
 * - Noon et Decibel, marques « by Johanson », deviennent des fabricants rattachés à
 *   Johanson Design.
 * Les collections restent en base, masquées ; leur ancienne adresse redirige vers la fiche.
 */

const OTHER = LOCALES.filter((l) => l !== 'fr')

/** Marques « by » : collection (fabricant/slug) → univers de la nouvelle marque. */
export const SUB_BRANDS: Record<string, { parent: string; universes: Brand['universes'] }> = {
  'johanson-design/noon': { parent: 'johanson-design', universes: ['lighting'] },
  'johanson-design/decibel': { parent: 'johanson-design', universes: ['acoustics'] },
}

/** Référence provisoire, sur le modèle de celles de Nardi (NARDI-NET-LOUNGE). */
export const provisionalReference = (brandSlug: string, slug: string) =>
  `${brandSlug.replace(/-design$/, '').replace(/-et-/g, '-')}-${slug}`.toUpperCase()

export type SelectionReport = {
  products: string[]
  brands: string[]
  merged: string[]
  skipped: string[]
}

const relId = (value: unknown) =>
  typeof value === 'number'
    ? value
    : value && typeof value === 'object' && 'id' in value
      ? (value as { id: number }).id
      : null

const ids = (values: unknown[] | null | undefined) =>
  (values ?? []).map(relId).filter((id): id is number => id != null)

const localized = async ({ payload, req }: Ctx, id: number) => {
  const out = {} as Record<(typeof LOCALES)[number], Range>
  for (const locale of LOCALES) {
    out[locale] = await payload.findByID({
      collection: 'ranges',
      id,
      locale,
      fallbackLocale: false,
      depth: 0,
      draft: false,
      req,
    })
  }
  return out
}

const toBrand = async (ctx: Ctx, range: Range, brand: Brand, report: SelectionReport) => {
  const { payload, req } = ctx
  const key = `${brand.slug}/${range.slug}`
  const existing = await payload.find({
    collection: 'brands',
    where: { slug: { equals: range.slug } },
    limit: 1,
    depth: 0,
    draft: true,
    req,
  })
  if (existing.totalDocs) {
    report.skipped.push(`${range.name} : un fabricant « ${range.slug} » existe déjà`)
    return
  }
  const texts = await localized(ctx, range.id)
  const parent = await payload.findByID({
    collection: 'brands',
    id: brand.id,
    locale: 'all',
    depth: 0,
    req,
  })
  const country = (parent.country ?? {}) as unknown as Record<string, string | undefined>
  const image = relId(range.heroImage)
  // Le designer de la collection devient un chiffre clé (« Design · Alexander Lervik »).
  const keyFigures = range.designer ? [{ label: 'Design', value: range.designer }] : []

  const doc = await payload.create({
    collection: 'brands',
    locale: 'fr',
    data: {
      name: range.name,
      slug: range.slug,
      parent: brand.id,
      universes: SUB_BRANDS[key].universes,
      country: country.fr ?? null,
      tagline: texts.fr.summary ?? null,
      story: isEmptyRich(texts.fr.description) ? null : texts.fr.description,
      keyFigures,
      heroImage: image,
      cardImage: image,
      gallery: ids(range.gallery),
      referent: relId(parent.referent),
      order: range.order ?? null,
      _status: 'published',
    },
    req,
  })
  for (const locale of OTHER) {
    const saved = await payload.findByID({ collection: 'brands', id: doc.id, depth: 0, req })
    await payload.update({
      collection: 'brands',
      id: doc.id,
      locale,
      data: {
        country: country[locale] ?? null,
        tagline: texts[locale].summary ?? null,
        ...(isEmptyRich(texts[locale].description) ? {} : { story: texts[locale].description }),
        // Mêmes lignes de chiffres clés : la traduction s'attache à leur identifiant.
        keyFigures: (saved.keyFigures ?? []).map((row) => ({
          id: row.id,
          label: row.label,
          value: row.value,
        })),
        _status: 'published',
      },
      req,
    })
  }
  report.brands.push(`${range.name} (by ${brand.name})`)
}

const toProduct = async (ctx: Ctx, range: Range, brand: Brand, report: SelectionReport) => {
  const { payload, req } = ctx
  const reference = provisionalReference(brand.slug ?? '', range.slug ?? '')
  const clash = await payload.find({
    collection: 'products',
    where: { or: [{ slug: { equals: range.slug } }, { reference: { equals: reference } }] },
    limit: 1,
    depth: 0,
    draft: true,
    req,
  })
  if (clash.totalDocs) {
    report.skipped.push(`${range.name} : une fiche « ${range.slug} » ou ${reference} existe déjà`)
    return
  }
  const texts = await localized(ctx, range.id)
  const images = [relId(range.heroImage), ...ids(range.gallery)].filter(
    (id, i, all): id is number => id != null && all.indexOf(id) === i,
  )
  const doc = await payload.create({
    collection: 'products',
    locale: 'fr',
    data: {
      name: range.name,
      slug: range.slug,
      reference,
      brand: brand.id,
      range: range.id,
      shortDescription: texts.fr.summary ?? null,
      description: isEmptyRich(texts.fr.description) ? null : texts.fr.description,
      images,
      designer: range.designer ?? null,
      featured: Boolean(range.featured),
      order: range.order ?? null,
      _status: 'published',
    },
    req,
  })
  for (const locale of OTHER) {
    const summary = texts[locale].summary
    const description = isEmptyRich(texts[locale].description) ? null : texts[locale].description
    if (!summary && !description) continue
    await payload.update({
      collection: 'products',
      id: doc.id,
      locale,
      data: {
        ...(summary ? { shortDescription: summary } : {}),
        ...(description ? { description } : {}),
        _status: 'published',
      },
      req,
    })
  }
  report.products.push(`${brand.name} · ${range.name} (${reference})`)
}

/** Fiche déjà liée à la collection : on reprend seulement l'ordre d'affichage, s'il est vide. */
const merge = async (ctx: Ctx, range: Range, product: Product, report: SelectionReport) => {
  const { payload, req } = ctx
  if (product.order == null && range.order != null) {
    const latest = await payload.findByID({
      collection: 'products',
      id: product.id,
      depth: 0,
      draft: true,
      req,
    })
    if (latest._status === 'draft') {
      report.skipped.push(`${product.name} : modifications non publiées, ordre non repris`)
    } else {
      await payload.update({
        collection: 'products',
        id: product.id,
        data: { order: range.order, _status: 'published' },
        req,
      })
    }
  }
  report.merged.push(`${range.name} → ${product.name}`)
}

export const buildSelection = async (ctx: Ctx): Promise<SelectionReport> => {
  const { payload, req } = ctx
  const report: SelectionReport = { products: [], brands: [], merged: [], skipped: [] }
  const { docs: ranges } = await payload.find({
    collection: 'ranges',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    limit: 0,
    pagination: false,
    depth: 1,
    locale: 'fr',
    req,
  })

  for (const range of ranges) {
    const brand = range.brand && typeof range.brand === 'object' ? range.brand : null
    if (!brand?.slug || !range.slug) continue
    const key = `${brand.slug}/${range.slug}`
    if (SUB_BRANDS[key]) {
      await toBrand(ctx, range, brand, report)
      continue
    }
    const linked = await payload.find({
      collection: 'products',
      where: { range: { equals: range.id } },
      limit: 1,
      depth: 0,
      req,
    })
    if (linked.docs[0]) await merge(ctx, range, linked.docs[0], report)
    else await toProduct(ctx, range, brand, report)
  }

  const { logger } = payload
  for (const line of report.products) logger.info(`Notre sélection › fiche produit créée · ${line}`)
  for (const line of report.brands) logger.info(`Notre sélection › marque créée · ${line}`)
  for (const line of report.merged) logger.info(`Notre sélection › déjà en fiche · ${line}`)
  for (const line of report.skipped) logger.warn(`Notre sélection › ignoré · ${line}`)
  return report
}
