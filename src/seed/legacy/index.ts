import type { Payload, PayloadRequest } from 'payload'

import { isEmptyRich, toLexical } from '../rich'
import { LEGACY_PAGES, LEGACY_SETTINGS, LEGACY_SHOWROOM, type LegacyBlock } from './agency'
import {
  KYMO,
  LEGACY_BRANDS,
  LEGACY_RANGES,
  type LegacyBrand,
  type LegacyImage,
  type Locale,
} from './brands'
import { LEGACY_EVENTS, LEGACY_TOURS } from './events'

/**
 * Reprise des contenus de l'ancien site (agencepise.fr) : AJOUT SEUL.
 * - un document qui existe déjà n'est jamais remplacé ;
 * - sur une fiche existante, seuls les champs vides sont remplis (et leurs traductions vides) ;
 * - une fiche avec des modifications non publiées n'est pas touchée (signalée dans le journal) ;
 * - les photos viennent de l'ancien site, uniquement là où le nouveau n'en a pas.
 */

const OTHER = ['en', 'it'] as const

export type LegacyFile = { data: Buffer; mimetype: string; name: string; size: number }
export type FetchFile = (file: string) => Promise<LegacyFile | null>
export type Ctx = { payload: Payload; req?: PayloadRequest; fetchFile?: FetchFile }

export type LegacyContent = {
  brands: Record<string, LegacyBrand>
  kymo: (Omit<typeof KYMO, 'data'> & { data: LegacyBrand }) | null
  ranges: typeof LEGACY_RANGES
  events: typeof LEGACY_EVENTS
  tours: typeof LEGACY_TOURS
  settings: typeof LEGACY_SETTINGS | null
  showroom: typeof LEGACY_SHOWROOM | null
  pages: typeof LEGACY_PAGES
}

export const LEGACY: LegacyContent = {
  brands: LEGACY_BRANDS,
  kymo: KYMO,
  ranges: LEGACY_RANGES,
  events: LEGACY_EVENTS,
  tours: LEGACY_TOURS,
  settings: LEGACY_SETTINGS,
  showroom: LEGACY_SHOWROOM,
  pages: LEGACY_PAGES,
}

export type LegacyReport = {
  added: string[]
  skipped: string[]
  conflicts: string[]
  missingImages: string[]
}

/* ---------- Photos de l'ancien site ---------- */

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

/** « 57-DT-SurReality__2880x1580_Main_©DR-scaled.jpg » → nom de fichier sans caractères spéciaux. */
export const safeFileName = (file: string) =>
  (file.split('/').pop() ?? 'image')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')

/** Télécharge un fichier de wp-content/uploads ; null si l'ancien site ne répond pas. */
export const fetchLegacyFile: FetchFile = async (file) => {
  const base = process.env.LEGACY_UPLOADS_URL || 'https://agencepise.fr/wp-content/uploads/'
  const url = base + file.split('/').map(encodeURIComponent).join('/')
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = Buffer.from(await res.arrayBuffer())
      const extension = file.split('.').pop()?.toLowerCase() ?? ''
      const type = res.headers.get('content-type')?.split(';')[0]
      const mimetype = type?.startsWith('image/') ? type : (MIME[extension] ?? 'image/jpeg')
      return { data, mimetype, name: safeFileName(file), size: data.length }
    } catch {
      if (attempt < 2) await new Promise((r) => setTimeout(r, 1000))
    }
  }
  return null
}

type Run = Ctx & {
  media: Map<string, number | null>
  report: LegacyReport
  /** Échecs de téléchargement d'affilée : au-delà de 4, l'ancien site est considéré injoignable. */
  failures: number
}

const uploadImage = async (run: Run, image: LegacyImage, brand?: number) => {
  const { payload, req } = run
  if (run.media.has(image.file)) return run.media.get(image.file) ?? null
  const name = safeFileName(image.file)
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: name } },
    limit: 1,
    depth: 0,
    req,
  })
  if (docs[0]) {
    run.media.set(image.file, docs[0].id)
    return docs[0].id
  }
  const file = run.failures >= 4 ? null : await (run.fetchFile ?? fetchLegacyFile)(image.file)
  run.failures = file ? 0 : run.failures + 1
  if (!file) {
    run.report.missingImages.push(image.file)
    run.media.set(image.file, null)
    return null
  }
  const doc = await payload.create({
    collection: 'media',
    data: { alt: image.alt.fr, ...(brand ? { brand } : {}) },
    file: { ...file, name },
    locale: 'fr',
    req,
  })
  for (const locale of OTHER) {
    await payload.update({
      collection: 'media',
      id: doc.id,
      data: { alt: image.alt[locale] },
      locale,
      req,
    })
  }
  run.media.set(image.file, doc.id)
  return doc.id
}

/* ---------- Outils ---------- */

const isEmpty = (value: unknown) =>
  value == null || value === '' || (Array.isArray(value) && value.length === 0)

const brandBySlug = async ({ payload, req }: Ctx, slug: string) => {
  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { equals: slug } },
    draft: true,
    limit: 1,
    depth: 0,
    locale: 'fr',
    req,
  })
  return docs[0] ?? null
}

const brandIds = async (ctx: Ctx, slugs: string[]) => {
  const ids: number[] = []
  for (const slug of slugs) {
    const brand = await brandBySlug(ctx, slug)
    if (brand) ids.push(brand.id)
  }
  return ids
}

/* ---------- Fabricants ---------- */

const fillBrand = async (run: Run, slug: string, data: LegacyBrand) => {
  const { payload, req } = run
  const brand = await brandBySlug(run, slug)
  if (!brand) {
    run.report.skipped.push(`Fabricant absent du site : ${slug}`)
    return
  }
  if (brand._status !== 'published') {
    run.report.conflicts.push(
      `Fabricant ${brand.name} : modifications non publiées en cours, fiche laissée telle quelle`,
    )
    return
  }

  const patch: Record<string, unknown> = {}
  const filled = new Set<string>()
  const fill = (field: string, current: unknown, value: unknown) => {
    if (value === undefined || !isEmpty(current)) return
    patch[field] = value
    filled.add(field)
  }
  fill('tagline', brand.tagline, data.tagline?.fr)
  fill('country', brand.country, data.country?.fr)
  fill('certifications', brand.certifications, data.certifications?.fr)
  fill('website', brand.website, data.website)
  fill('foundedYear', brand.foundedYear, data.foundedYear)
  if (data.story && isEmptyRich(brand.story)) {
    patch.story = toLexical(data.story.fr)
    filled.add('story')
  }
  if (data.keyFigures?.length && isEmpty(brand.keyFigures)) {
    patch.keyFigures = data.keyFigures.map((f) => ({ label: f.label.fr, value: f.value.fr }))
    filled.add('keyFigures')
  }
  if (data.logo && isEmpty(brand.logo)) {
    const logo = await uploadImage(run, data.logo, brand.id)
    if (logo) {
      patch.logo = logo
      filled.add('logo')
    }
  }
  if (!filled.size) {
    run.report.skipped.push(`Fabricant ${brand.name} : déjà renseigné`)
    return
  }

  const updated = await payload.update({
    collection: 'brands',
    id: brand.id,
    data: { ...patch, _status: 'published' },
    locale: 'fr',
    req,
  })

  // Traductions des seuls champs remplis ci-dessus, et seulement si elles sont vides.
  for (const locale of OTHER) {
    const current = await payload.findByID({
      collection: 'brands',
      id: brand.id,
      locale,
      fallbackLocale: false,
      depth: 0,
      req,
    })
    const translated: Record<string, unknown> = {}
    if (filled.has('tagline') && isEmpty(current.tagline))
      translated.tagline = data.tagline![locale]
    if (filled.has('country') && isEmpty(current.country))
      translated.country = data.country![locale]
    if (filled.has('certifications') && isEmpty(current.certifications))
      translated.certifications = data.certifications![locale]
    if (filled.has('story') && isEmptyRich(current.story))
      translated.story = toLexical(data.story![locale])
    if (filled.has('keyFigures'))
      translated.keyFigures = (updated.keyFigures ?? []).map((row, i) => ({
        id: row.id,
        label: data.keyFigures![i]!.label[locale],
        value: data.keyFigures![i]!.value[locale],
      }))
    if (Object.keys(translated).length) {
      await payload.update({
        collection: 'brands',
        id: brand.id,
        data: { ...translated, _status: 'published' },
        locale,
        req,
      })
    }
  }
  run.report.added.push(`Fabricant ${brand.name} : ${[...filled].join(', ')}`)
}

const importBrands = async (run: Run, content: LegacyContent) => {
  for (const [slug, data] of Object.entries(content.brands)) await fillBrand(run, slug, data)

  const { kymo } = content
  if (!kymo) return
  if (!(await brandBySlug(run, kymo.slug))) {
    await run.payload.create({
      collection: 'brands',
      data: {
        name: kymo.name,
        slug: kymo.slug,
        universes: kymo.universes,
        order: kymo.order,
        _status: 'published',
      },
      locale: 'fr',
      req: run.req,
    })
    run.report.added.push(`Fabricant créé : ${kymo.name}`)
  }
  await fillBrand(run, kymo.slug, kymo.data)
}

/* ---------- Collections (Noon, Decibel) ---------- */

const importRanges = async (run: Run, content: LegacyContent) => {
  const { payload, req } = run
  for (const range of content.ranges) {
    const brand = await brandBySlug(run, range.brand)
    if (!brand) {
      run.report.skipped.push(`Collection ${range.name} : fabricant ${range.brand} absent`)
      continue
    }
    const existing = await payload.count({
      collection: 'ranges',
      where: {
        and: [
          { brand: { equals: brand.id } },
          { or: [{ slug: { equals: range.slug } }, { name: { equals: range.name } }] },
        ],
      },
      req,
    })
    if (existing.totalDocs) {
      run.report.skipped.push(`Collection ${range.name} : déjà présente`)
      continue
    }
    const heroImage = await uploadImage(run, range.image, brand.id)
    const doc = await payload.create({
      collection: 'ranges',
      data: {
        name: range.name,
        slug: range.slug,
        brand: brand.id,
        designer: range.designer,
        summary: range.summary.fr,
        description: toLexical(range.description.fr) as never,
        ...(heroImage ? { heroImage } : {}),
        _status: 'published',
      },
      locale: 'fr',
      req,
    })
    for (const locale of OTHER) {
      await payload.update({
        collection: 'ranges',
        id: doc.id,
        data: {
          summary: range.summary[locale],
          description: toLexical(range.description[locale]) as never,
          _status: 'published',
        },
        locale,
        req,
      })
    }
    run.report.added.push(`Collection créée : ${brand.name} › ${range.name}`)
  }
}

/* ---------- Salons ---------- */

const importEvents = async (run: Run, content: LegacyContent) => {
  const { payload, req } = run
  for (const event of content.events) {
    const existing = await payload.count({
      collection: 'events',
      where: { slug: { equals: event.slug } },
      locale: 'fr',
      req,
    })
    if (existing.totalDocs) {
      run.report.skipped.push(`Salon ${event.name.fr} : déjà présent`)
      continue
    }
    const image = event.image ? await uploadImage(run, event.image) : null
    const doc = await payload.create({
      collection: 'events',
      data: {
        name: event.name.fr,
        slug: event.slug,
        startDate: event.startDate,
        endDate: event.endDate,
        city: event.city,
        venue: event.venue,
        booth: event.booth,
        address: event.address,
        summary: event.summary.fr,
        website: event.website,
        registrationUrl: event.registrationUrl,
        brands: await brandIds(run, event.brands),
        ...(image ? { image } : {}),
        _status: 'published',
      },
      locale: 'fr',
      req,
    })
    for (const locale of OTHER) {
      await payload.update({
        collection: 'events',
        id: doc.id,
        data: {
          name: event.name[locale],
          summary: event.summary[locale],
          slug: event.slug,
          _status: 'published',
        },
        locale,
        req,
      })
    }
    run.report.added.push(`Salon créé : ${event.name.fr}`)
  }
}

/* ---------- Visites IMRSIVO ---------- */

const importTours = async (run: Run, content: LegacyContent) => {
  const { payload, req } = run
  for (const tour of content.tours) {
    const existing = await payload.count({
      collection: 'virtual-tours',
      where: { or: [{ embedUrl: { equals: tour.embedUrl } }, { slug: { equals: tour.slug.fr } }] },
      locale: 'fr',
      req,
    })
    if (existing.totalDocs) {
      run.report.skipped.push(`Visite ${tour.title.fr} : déjà présente`)
      continue
    }
    const thumbnail = tour.thumbnail ? await uploadImage(run, tour.thumbnail) : null
    const doc = await payload.create({
      collection: 'virtual-tours',
      data: {
        title: tour.title.fr,
        slug: tour.slug.fr,
        kind: tour.kind,
        availability: 'live',
        embedUrl: tour.embedUrl,
        location: tour.location,
        summary: tour.summary.fr,
        brands: await brandIds(run, tour.brands),
        order: tour.order,
        ...(thumbnail ? { thumbnail } : {}),
        _status: 'published',
      },
      locale: 'fr',
      req,
    })
    for (const locale of OTHER) {
      await payload.update({
        collection: 'virtual-tours',
        id: doc.id,
        data: {
          title: tour.title[locale],
          summary: tour.summary[locale],
          slug: tour.slug[locale],
          _status: 'published',
        },
        locale,
        req,
      })
    }
    run.report.added.push(`Visite créée : ${tour.title.fr}`)
  }
}

/* ---------- Coordonnées, showroom ---------- */

const importSettings = async (run: Run, content: LegacyContent) => {
  const { payload, req } = run
  const { settings } = content
  if (!settings) return
  const current = await payload.findGlobal({ slug: 'settings', locale: 'fr', depth: 0, req })
  const patch: Record<string, unknown> = {}
  const filled: string[] = []
  if (isEmpty(current.legalName)) {
    patch.legalName = settings.legalName
    filled.push('raison sociale')
  }
  const contact: Record<string, unknown> = { ...(current.contact ?? {}) }
  for (const [field, value] of Object.entries(settings.contact)) {
    if (!isEmpty(contact[field])) continue
    contact[field] = value
    filled.push(field)
  }
  if (filled.some((f) => f in settings.contact)) patch.contact = contact
  if (isEmpty(current.socials)) {
    patch.socials = settings.socials
    filled.push('réseaux sociaux')
  }
  if (!filled.length) {
    run.report.skipped.push('Réglages : coordonnées déjà renseignées')
    return
  }
  await payload.updateGlobal({ slug: 'settings', data: patch, locale: 'fr', req })
  run.report.added.push(`Réglages : ${filled.join(', ')}`)
}

const importShowroom = async (run: Run, content: LegacyContent) => {
  const { payload, req } = run
  const { showroom } = content
  if (!showroom) return
  const existing = await payload.count({
    collection: 'showrooms',
    where: { 'address.city': { equals: showroom.address.city } },
    req,
  })
  if (existing.totalDocs) {
    run.report.skipped.push(`Showroom de ${showroom.address.city} : déjà présent`)
    return
  }
  await payload.create({ collection: 'showrooms', data: showroom, req })
  run.report.added.push(`Showroom créé : ${showroom.name}`)
}

/* ---------- Pages ---------- */

type SavedBlock = { id?: string | null; links?: { id?: string | null }[] | null }

/** Les blocs sont communs aux langues : la traduction reprend leurs identifiants. */
const withIds = (blocks: LegacyBlock[], saved: SavedBlock[]) =>
  blocks.map((block, i) => ({
    ...block,
    id: saved[i]?.id,
    ...(block.blockType === 'cta'
      ? { links: block.links.map((row, j) => ({ ...row, id: saved[i]?.links?.[j]?.id })) }
      : {}),
  }))

const importPages = async (run: Run, content: LegacyContent) => {
  const { payload, req } = run
  const ids = new Map<string, number>()
  for (const page of content.pages) {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug.fr } },
      draft: true,
      limit: 1,
      depth: 0,
      locale: 'fr',
      req,
    })
    if (docs[0]) {
      ids.set(page.key, docs[0].id)
      run.report.skipped.push(`Page ${page.title.fr} : déjà présente`)
      continue
    }
    const parent = page.parent ? ids.get(page.parent) : undefined
    if (page.parent && !parent) {
      run.report.conflicts.push(`Page ${page.title.fr} : page parente introuvable, non créée`)
      continue
    }
    const doc = await payload.create({
      collection: 'pages',
      data: {
        title: page.title.fr,
        slug: page.slug.fr,
        parent,
        layout: page.layout('fr') as never,
        _status: 'published',
      },
      locale: 'fr',
      req,
    })
    ids.set(page.key, doc.id)
    for (const locale of OTHER) {
      await payload.update({
        collection: 'pages',
        id: doc.id,
        data: {
          title: page.title[locale],
          slug: page.slug[locale],
          layout: withIds(
            page.layout(locale as Locale),
            (doc.layout ?? []) as SavedBlock[],
          ) as never,
          _status: 'published',
        },
        locale,
        req,
      })
    }
    run.report.added.push(`Page créée : ${page.title.fr}`)
  }
}

/* ---------- Point d'entrée ---------- */

export const importLegacy = async (ctx: Ctx, content: LegacyContent = LEGACY) => {
  const run: Run = {
    ...ctx,
    media: new Map(),
    failures: 0,
    report: { added: [], skipped: [], conflicts: [], missingImages: [] },
  }
  await importBrands(run, content)
  await importRanges(run, content)
  await importEvents(run, content)
  await importTours(run, content)
  await importSettings(run, content)
  await importShowroom(run, content)
  await importPages(run, content)

  const { logger } = ctx.payload
  for (const line of run.report.added) logger.info(`Ancien site › ajouté · ${line}`)
  for (const line of run.report.skipped) logger.info(`Ancien site › ignoré · ${line}`)
  for (const line of run.report.conflicts) logger.warn(`Ancien site › à vérifier · ${line}`)
  for (const file of run.report.missingImages)
    logger.warn(`Ancien site › photo non récupérée · ${file}`)
  return run.report
}
