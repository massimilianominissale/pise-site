import path from 'path'

import { type Ctx, findSeedMedia } from './brands'
import { forgetUploadedFile } from './uploads'

/**
 * Produits de départ : les quatre produits Nardi identifiés sur les photos du Drive,
 * pour que la fiche produit, la page collection et le catalogue aient un contenu réel.
 *
 * Références provisoires (NARDI-…) : à remplacer par celles de PISE avant de les utiliser
 * dans Mobilia, puisque le lien /p/[référence] ne doit plus changer ensuite.
 * Dimensions, matériaux et textes détaillés restent vides, à compléter par PISE.
 * Import idempotent : un produit déjà présent (même référence) n'est pas recréé.
 */

type Locale = 'fr' | 'en' | 'it'
type T = Record<Locale, string>

const IMAGES_DIR = path.resolve(process.cwd(), 'src/seed/images')

export const CATEGORIES: { slug: string; name: T; order: number }[] = [
  {
    slug: 'fauteuils-lounge',
    name: { fr: 'Fauteuils lounge', en: 'Lounge chairs', it: 'Poltrone lounge' },
    order: 1,
  },
  { slug: 'fauteuils', name: { fr: 'Fauteuils', en: 'Armchairs', it: 'Poltrone' }, order: 2 },
  { slug: 'tables', name: { fr: 'Tables', en: 'Tables', it: 'Tavoli' }, order: 3 },
]

/** Questions sur le fonctionnement de PISE (pas sur le produit lui-même) : à relire par PISE. */
const FAQS: { key: string; question: T; answer: T; topic: 'appointments' | 'pro' }[] = [
  {
    key: 'voir-avant-commande',
    topic: 'appointments',
    question: {
      fr: 'Peut-on voir le produit avant de commander ?',
      en: 'Can I see the product before ordering?',
      it: 'È possibile vedere il prodotto prima di ordinare?',
    },
    answer: {
      fr: 'Oui. Prenez rendez-vous dans l’un de nos showrooms, réservez une visite virtuelle accompagnée ou retrouvez-nous sur un salon. Votre référent prépare les finitions qui vous intéressent.',
      en: 'Yes. Book a visit to one of our showrooms, a guided virtual tour, or meet us at a trade fair. Your contact will prepare the finishes you are interested in.',
      it: 'Sì. Prenotate una visita in uno dei nostri showroom, una visita virtuale guidata oppure incontrateci in fiera. Il vostro referente preparerà le finiture che vi interessano.',
    },
  },
  {
    key: 'tarifs-documents',
    topic: 'pro',
    question: {
      fr: 'Où trouver les tarifs et la documentation technique ?',
      en: 'Where can I find prices and technical documents?',
      it: 'Dove trovo i prezzi e la documentazione tecnica?',
    },
    answer: {
      fr: 'Les documents publics se téléchargent depuis la fiche produit. Tarifs, conditions et documents complets sont dans l’espace pro, ouvert aux professionnels après validation de leur compte.',
      en: 'Public documents can be downloaded from the product page. Prices, terms and full documentation are in the trade area, open to professionals once their account is approved.',
      it: 'I documenti pubblici si scaricano dalla scheda prodotto. Prezzi, condizioni e documentazione completa sono nell’area professionisti, aperta ai professionisti dopo la convalida dell’account.',
    },
  },
]

type SeedFinish = { name: T; swatch: string; image: string }

type SeedProduct = {
  reference: string
  name: string
  slug: string
  range: string
  category: string
  sectors: string[]
  outdoor?: boolean
  featured?: boolean
  shortDescription: T
  /** Fichiers déjà importés avec les fabricants (src/seed/brands.ts). */
  images: string[]
  finishes?: SeedFinish[]
  related?: string[]
  faqs?: string[]
}

/** Photos propres aux finitions (dossier Nardi du Drive, nommées par coloris). */
export const FINISH_IMAGES: Record<string, { alt: T; credit?: string }> = {
  'nardi-net-lounge-anthracite.jpg': {
    alt: {
      fr: 'Détail de l’assise ajourée du fauteuil Net Lounge anthracite, plaid rayé sur l’accoudoir',
      en: 'Detail of the perforated seat of the anthracite Net Lounge chair, striped throw on the armrest',
      it: 'Dettaglio della seduta traforata della poltrona Net Lounge antracite, plaid a righe sul bracciolo',
    },
  },
  'nardi-net-lounge-moutarde.jpg': {
    alt: {
      fr: 'Deux fauteuils Net Lounge moutarde avec coussin d’appui-tête et une table basse',
      en: 'Two mustard Net Lounge chairs with headrest cushions and a low table',
      it: 'Due poltrone Net Lounge senape con cuscino poggiatesta e un tavolino',
    },
  },
  'nardi-net-lounge-tourterelle.jpg': {
    alt: {
      fr: 'Fauteuil Net tourterelle vu du dessus, à côté d’une table ronde',
      en: 'Dove grey Net chair seen from above, next to a round table',
      it: 'Poltrona Net tortora vista dall’alto, accanto a un tavolo rotondo',
    },
  },
}

export const PRODUCTS: SeedProduct[] = [
  {
    reference: 'NARDI-NET-LOUNGE',
    name: 'Net Lounge',
    slug: 'net-lounge',
    range: 'Net',
    category: 'fauteuils-lounge',
    sectors: ['outdoor', 'hotellerie'],
    outdoor: true,
    featured: true,
    shortDescription: {
      fr: 'Fauteuil lounge à l’assise ajourée, pensé pour les terrasses et les bords de piscine. Se complète d’un coussin d’appui-tête.',
      en: 'Lounge chair with a perforated seat, designed for terraces and poolsides. Can be fitted with a headrest cushion.',
      it: 'Poltrona lounge con seduta traforata, pensata per terrazze e bordi piscina. Si completa con un cuscino poggiatesta.',
    },
    images: ['nardi-net-lounge.jpg'],
    finishes: [
      {
        name: { fr: 'Anthracite', en: 'Anthracite', it: 'Antracite' },
        swatch: '#3B3D40',
        image: 'nardi-net-lounge-anthracite.jpg',
      },
      {
        name: { fr: 'Moutarde', en: 'Mustard', it: 'Senape' },
        swatch: '#C9952C',
        image: 'nardi-net-lounge-moutarde.jpg',
      },
      {
        name: { fr: 'Tourterelle', en: 'Dove grey', it: 'Tortora' },
        swatch: '#A39686',
        image: 'nardi-net-lounge-tourterelle.jpg',
      },
    ],
    related: ['NARDI-DOGA', 'NARDI-RIO-210', 'NARDI-TEVERE'],
    faqs: ['voir-avant-commande', 'tarifs-documents'],
  },
  {
    reference: 'NARDI-DOGA',
    name: 'Doga Armchair',
    slug: 'doga-armchair',
    range: 'Doga',
    category: 'fauteuils',
    sectors: ['outdoor', 'restauration'],
    outdoor: true,
    shortDescription: {
      fr: 'Fauteuil d’extérieur de la collection Doga, pour les terrasses de restaurant et d’hôtel.',
      en: 'Outdoor armchair from the Doga collection, for restaurant and hotel terraces.',
      it: 'Poltrona da esterno della collezione Doga, per terrazze di ristoranti e hotel.',
    },
    images: ['nardi-doga.jpg'],
  },
  {
    reference: 'NARDI-RIO-210',
    name: 'Rio 210',
    slug: 'rio-210',
    range: 'Rio',
    category: 'tables',
    sectors: ['outdoor', 'restauration'],
    outdoor: true,
    shortDescription: {
      fr: 'Table d’extérieur de la collection Rio, pour les terrasses et les espaces de restauration.',
      en: 'Outdoor table from the Rio collection, for terraces and dining areas.',
      it: 'Tavolo da esterno della collezione Rio, per terrazze e spazi di ristorazione.',
    },
    images: ['nardi-rio.jpg'],
  },
  {
    reference: 'NARDI-TEVERE',
    name: 'Tevere',
    slug: 'tevere',
    range: 'Tevere',
    category: 'tables',
    sectors: ['outdoor', 'restauration'],
    outdoor: true,
    shortDescription: {
      fr: 'Table d’extérieur de la collection Tevere, à dresser en terrasse comme au jardin.',
      en: 'Outdoor table from the Tevere collection, for terraces and gardens.',
      it: 'Tavolo da esterno della collezione Tevere, per terrazze e giardini.',
    },
    images: ['nardi-tevere.jpg'],
  },
]

const LOCALES_OTHER = ['en', 'it'] as const

const findOne = async (
  { payload, req }: Ctx,
  collection: 'product-categories' | 'sectors' | 'ranges' | 'products' | 'faqs' | 'brands',
  where: Record<string, unknown>,
) => {
  const { docs } = await payload.find({
    collection,
    where: where as never,
    limit: 1,
    depth: 0,
    draft: true,
    locale: 'fr',
    req,
  })
  return (docs[0] as { id: number } | undefined) ?? null
}

const seedCategories = async (ctx: Ctx) => {
  const { payload, req } = ctx
  const ids = new Map<string, number>()
  for (const category of CATEGORIES) {
    const existing = await findOne(ctx, 'product-categories', { slug: { equals: category.slug } })
    if (existing) {
      ids.set(category.slug, existing.id)
      continue
    }
    const doc = await payload.create({
      collection: 'product-categories',
      data: { name: category.name.fr, slug: category.slug, order: category.order },
      locale: 'fr',
      req,
    })
    for (const locale of LOCALES_OTHER) {
      await payload.update({
        collection: 'product-categories',
        id: doc.id,
        data: { name: category.name[locale] },
        locale,
        req,
      })
    }
    ids.set(category.slug, doc.id)
  }
  return ids
}

const seedFaqs = async (ctx: Ctx, brandId: number) => {
  const { payload, req } = ctx
  const ids = new Map<string, number>()
  for (const [i, faq] of FAQS.entries()) {
    const existing = await findOne(ctx, 'faqs', { question: { equals: faq.question.fr } })
    if (existing) {
      ids.set(faq.key, existing.id)
      continue
    }
    const doc = await payload.create({
      collection: 'faqs',
      data: {
        question: faq.question.fr,
        answer: faq.answer.fr,
        topic: faq.topic,
        brands: [brandId],
        order: i + 1,
      },
      locale: 'fr',
      req,
    })
    for (const locale of LOCALES_OTHER) {
      await payload.update({
        collection: 'faqs',
        id: doc.id,
        data: { question: faq.question[locale], answer: faq.answer[locale] },
        locale,
        req,
      })
    }
    ids.set(faq.key, doc.id)
  }
  return ids
}

/** Photo de finition : importée une fois, retrouvée ensuite par son nom de fichier d'origine. */
const finishImage = async (ctx: Ctx, file: string, brandId: number) => {
  const { payload, req } = ctx
  const meta = FINISH_IMAGES[file]
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: meta.alt.fr } },
    locale: 'fr',
    limit: 1,
    depth: 0,
    req,
  })
  if (existing.docs[0]) return existing.docs[0].id
  forgetUploadedFile(req)
  const doc = await payload.create({
    collection: 'media',
    data: { alt: meta.alt.fr, credit: meta.credit, brand: brandId },
    filePath: path.join(IMAGES_DIR, file),
    locale: 'fr',
    req,
  })
  for (const locale of LOCALES_OTHER) {
    forgetUploadedFile(req)
    await payload.update({
      collection: 'media',
      id: doc.id,
      data: { alt: meta.alt[locale] },
      locale,
      req,
    })
  }
  return doc.id
}

export const seedProducts = async (ctx: Ctx) => {
  const { payload, req } = ctx
  const brand = await findOne(ctx, 'brands', { slug: { equals: 'nardi' } })
  if (!brand) {
    payload.logger.info('Nardi absent : produits de départ ignorés')
    return
  }
  const categories = await seedCategories(ctx)
  const faqs = await seedFaqs(ctx, brand.id)

  const sectorIds = new Map<string, number>()
  for (const slug of new Set(PRODUCTS.flatMap((p) => p.sectors))) {
    const sector = await findOne(ctx, 'sectors', { slug: { equals: slug } })
    if (sector) sectorIds.set(slug, sector.id)
  }

  const created = new Map<string, number>()
  for (const product of PRODUCTS) {
    const existing = await findOne(ctx, 'products', { reference: { equals: product.reference } })
    if (existing) {
      payload.logger.info(`Produit déjà présent, ignoré : ${product.name}`)
      continue
    }
    const range = await findOne(ctx, 'ranges', {
      and: [{ brand: { equals: brand.id } }, { name: { equals: product.range } }],
    })

    const images: number[] = []
    for (const file of product.images) {
      const id = await findSeedMedia(ctx, file)
      if (id) images.push(id)
    }

    const finishes: { name: string; swatch: string; image: number }[] = []
    for (const finish of product.finishes ?? []) {
      finishes.push({
        name: finish.name.fr,
        swatch: finish.swatch,
        image: await finishImage(ctx, finish.image, brand.id),
      })
    }

    const doc = await payload.create({
      collection: 'products',
      data: {
        name: product.name,
        slug: product.slug,
        reference: product.reference,
        brand: brand.id,
        range: range?.id,
        categories: categories.has(product.category) ? [categories.get(product.category)!] : [],
        sectors: product.sectors.map((s) => sectorIds.get(s)).filter((id): id is number => !!id),
        shortDescription: product.shortDescription.fr,
        images: [...finishes.map((f) => f.image), ...images],
        finishes,
        outdoor: Boolean(product.outdoor),
        indoor: true,
        faqs: (product.faqs ?? []).map((k) => faqs.get(k)).filter((id): id is number => !!id),
        featured: Boolean(product.featured),
        _status: 'published',
      },
      locale: 'fr',
      req,
    })

    // Textes traduits : les lignes de finitions gardent leur identifiant d'une langue à l'autre.
    for (const locale of LOCALES_OTHER) {
      await payload.update({
        collection: 'products',
        id: doc.id,
        data: {
          shortDescription: product.shortDescription[locale],
          finishes: (doc.finishes ?? []).map((row, i) => ({
            ...row,
            name: product.finishes?.[i]?.name[locale] ?? row.name,
          })),
          _status: 'published',
        },
        locale,
        req,
      })
    }
    created.set(product.reference, doc.id)
    payload.logger.info(`Produit créé : ${product.name}`)
  }

  // Produits associés, une fois tous les produits créés.
  for (const product of PRODUCTS) {
    const id = created.get(product.reference)
    if (!id || !product.related?.length) continue
    const related: number[] = []
    for (const reference of product.related) {
      const other = await findOne(ctx, 'products', { reference: { equals: reference } })
      if (other) related.push(other.id)
    }
    await payload.update({
      collection: 'products',
      id,
      data: { relatedProducts: related, _status: 'published' },
      locale: 'fr',
      req,
    })
  }
}

export const unseedProducts = async ({ payload, req }: Ctx) => {
  await payload.delete({
    collection: 'products',
    where: { reference: { in: PRODUCTS.map((p) => p.reference) } },
    req,
  })
  await payload.delete({
    collection: 'media',
    where: { alt: { in: Object.values(FINISH_IMAGES).map((m) => m.alt.fr) } },
    locale: 'fr',
    req,
  })
  await payload.delete({
    collection: 'faqs',
    where: { question: { in: FAQS.map((f) => f.question.fr) } },
    locale: 'fr',
    req,
  })
  await payload.delete({
    collection: 'product-categories',
    where: { slug: { in: CATEGORIES.map((c) => c.slug) } },
    req,
  })
}
