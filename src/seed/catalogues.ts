import { type Locale, LOCALES } from '../i18n/config'
import type { Ctx } from './brands'
import { forgetUploadedFile } from './uploads'

/**
 * Catalogues des fabricants, repris des fiches de l'ancien site (demande de PISE du 24/10).
 * - Liens Dropbox : repris tels quels (ouverture dans un nouvel onglet).
 * - PDF hébergés par l'ancien site (affichés en « flipbook ») : copiés dans la documentation du
 *   nouveau site (Vercel Blob), car ils disparaîtront au changement de domaine. Si la copie
 *   échoue, le bouton pointe provisoirement vers l'ancien fichier.
 * AJOUT SEUL : une fiche qui a déjà des catalogues, ou des modifications non publiées, n'est pas
 * touchée.
 */

type T = Record<Locale, string>
const same = (text: string): T => ({ fr: text, en: text, it: text })

type LegacyPdf = {
  /** Chemin sous wp-content/uploads de l'ancien site. */
  file: string
  title: T
  kind: 'catalogue' | 'epd' | 'other'
  language: 'fr' | 'en' | 'it' | 'multi'
  year?: number
  /** Fabricant auquel le document est rattaché dans la documentation. */
  brand: string
}

export const LEGACY_PDFS: Record<string, LegacyPdf> = {
  'system180-systeme': {
    file: '2023/11/System180_Le_systeme.pdf',
    title: {
      fr: 'System180 – Le système',
      en: 'System180 – The system',
      it: 'System180 – Il sistema',
    },
    kind: 'catalogue',
    language: 'fr',
    brand: 'system180',
  },
  'system180-agile': {
    file: '2023/11/System180_Agile_Interior_FR.pdf',
    title: same('System180 – Agile Interior'),
    kind: 'catalogue',
    language: 'fr',
    brand: 'system180',
  },
  'axolight-lab': {
    file: '2023/11/Axolight-Italian-lighting-lab-04-2023.pdf',
    title: same('Axolight – Italian Lighting Lab'),
    kind: 'catalogue',
    language: 'en',
    year: 2023,
    brand: 'axolight',
  },
  'axolight-2022': {
    file: '2023/11/Axolight_Catalogue-2022.pdf',
    title: {
      fr: 'Catalogue Axolight 2022',
      en: 'Axolight catalogue 2022',
      it: 'Catalogo Axolight 2022',
    },
    kind: 'catalogue',
    language: 'multi',
    year: 2022,
    brand: 'axolight',
  },
  'fabbian-2021': {
    file: '2023/11/fabbian_catalogue_2021.pdf',
    title: {
      fr: 'Catalogue Fabbian 2021',
      en: 'Fabbian catalogue 2021',
      it: 'Catalogo Fabbian 2021',
    },
    kind: 'catalogue',
    language: 'multi',
    year: 2021,
    brand: 'fabbian',
  },
  'fabbian-2023': {
    file: '2023/11/Latest-collections-2023.pdf',
    title: same('Fabbian – Latest collections 2023'),
    kind: 'catalogue',
    language: 'en',
    year: 2023,
    brand: 'fabbian',
  },
  'johanson-durabilite': {
    file: '2024/01/Johanson_Sustainability_FR-1.pdf',
    title: {
      fr: 'Johanson Design – Développement durable',
      en: 'Johanson Design – Sustainability',
      it: 'Johanson Design – Sostenibilità',
    },
    kind: 'other',
    language: 'fr',
    brand: 'johanson-design',
  },
  'johanson-carbone': {
    file: '2024/09/Sustainability-presentation-Johanson-Design-Malmo-2024-09-06.pdf',
    title: {
      fr: 'Johanson Design – Démarche carbone et EPD',
      en: 'Johanson Design – Carbon approach and EPD',
      it: 'Johanson Design – Approccio carbonio ed EPD',
    },
    kind: 'epd',
    language: 'en',
    year: 2024,
    brand: 'johanson-design',
  },
  'decibel-2023': {
    file: '2024/01/decibel_broschyr_2.2023_eng_low.pdf',
    title: same('Decibel – Brochure 2023'),
    kind: 'catalogue',
    language: 'en',
    year: 2023,
    brand: 'decibel',
  },
}

/** Bouton : un lien (Dropbox…) ou un document de l'ancien site copié dans la documentation. */
type Catalogue = { label: T } & ({ url: string } | { pdf: keyof typeof LEGACY_PDFS })

const dropbox = (path: string) => `https://www.dropbox.com/scl/fi/${path}`

export const CATALOGUES: Record<string, Catalogue[]> = {
  burotime: [
    {
      label: { fr: 'Catalogue général', en: 'General catalogue', it: 'Catalogo generale' },
      url: dropbox(
        '2ljuw9vwbrhtylpo867yp/burotime-katalog-ocak-2025-en.pdf?rlkey=aipj6ibbuh7b1v1pgejzhiy63&st=zjo5pibg&dl=0',
      ),
    },
    {
      label: same('Brochure SYN.ERGY'),
      url: dropbox(
        'jzmv93u7xz1q8hcxfwkal/syn.ergy-product-brochure-en.pdf?rlkey=4metnyuhcf695b98oghzbw7aq&st=7t3ioqi4&dl=0',
      ),
    },
  ],
  maffei: [
    {
      label: { fr: 'Catalogue Maffei Pro', en: 'Maffei Pro catalogue', it: 'Catalogo Maffei Pro' },
      url: dropbox(
        'g609jftevzc7i76xjwn28/CATALOGO-MAPRO-2026-AFFIANCATE-BASSA.pdf?rlkey=5n0byq3lu1wyotyelmhnrstkq&st=juk2ku8c&dl=0',
      ),
    },
    {
      label: { fr: 'Catalogue Maffei', en: 'Maffei catalogue', it: 'Catalogo Maffei' },
      url: dropbox(
        '70nd0aqacunby5zv72lq5/CATALOGO-MAFFEI-2026-AFFIANCATE-MAIL.pdf?rlkey=tr19nvrm6hwscm84luftmz91i&st=42ghwwh4&dl=0',
      ),
    },
  ],
  'milla-et-milli': [
    {
      label: { fr: 'Catalogue général', en: 'General catalogue', it: 'Catalogo generale' },
      url: dropbox(
        '0ucrzh7bvh5etjie9ig1t/Milla-Milli-catalogue-2024.PDF?rlkey=8vuiwm3gd7mzvreliis5kxhok&dl=0',
      ),
    },
    {
      label: { fr: 'Catalogue 2024', en: '2024 catalogue', it: 'Catalogo 2024' },
      url: dropbox(
        'j833jxqeump0zuz5m1inc/Milla-Milli-catalogue-2024-2.PDF?rlkey=6ttyqjzoiwfue39v0n5e5ysby&st=3shgciwq&dl=0',
      ),
    },
  ],
  nardi: [
    {
      label: {
        fr: 'Catalogue Outdoor 2026',
        en: 'Outdoor catalogue 2026',
        it: 'Catalogo Outdoor 2026',
      },
      url: dropbox(
        'r791k57nidmfuufx16f5w/Nardi_Outdoor_2026.pdf?rlkey=wvdrfgb0lxmfizbs5f59jeyf9&st=a8let5x7&dl=0',
      ),
    },
  ],
  'johanson-design': [
    {
      label: {
        fr: 'Catalogue Inspiration',
        en: 'Inspiration catalogue',
        it: 'Catalogo Inspiration',
      },
      url: dropbox(
        'tyauz6yw344ks6che3fek/Johanson_Inspiration_2022_ENG_low.pdf?rlkey=m7lvy3o7c9kqdvqcu9ncu9q4x&st=sw79y13s&dl=0',
      ),
    },
    {
      label: { fr: 'Développement durable', en: 'Sustainability', it: 'Sostenibilità' },
      pdf: 'johanson-durabilite',
    },
    {
      label: {
        fr: 'Démarche carbone – EPD',
        en: 'Carbon approach – EPD',
        it: 'Approccio carbonio – EPD',
      },
      pdf: 'johanson-carbone',
    },
  ],
  noon: [
    {
      label: { fr: 'Brochure Noon', en: 'Noon brochure', it: 'Brochure Noon' },
      url: dropbox(
        '3n8qkf0f5xndywud4yky8/Noon_Folder_2024_v1_ENG.pdf?rlkey=o6yvpnnlv5j83qex0dp4r3rrz&st=egihol62&dl=0',
      ),
    },
  ],
  decibel: [
    {
      label: { fr: 'Brochure Decibel', en: 'Decibel brochure', it: 'Brochure Decibel' },
      pdf: 'decibel-2023',
    },
    {
      label: { fr: 'Développement durable', en: 'Sustainability', it: 'Sostenibilità' },
      pdf: 'johanson-durabilite',
    },
    {
      label: {
        fr: 'Démarche carbone – EPD',
        en: 'Carbon approach – EPD',
        it: 'Approccio carbonio – EPD',
      },
      pdf: 'johanson-carbone',
    },
  ],
  system180: [
    { label: { fr: 'Le système', en: 'The system', it: 'Il sistema' }, pdf: 'system180-systeme' },
    { label: same('Agile Interior'), pdf: 'system180-agile' },
  ],
  fabbian: [
    { label: { fr: 'Nouveautés 2023', en: 'New in 2023', it: 'Novità 2023' }, pdf: 'fabbian-2023' },
    { label: { fr: 'Catalogue', en: 'Catalogue', it: 'Catalogo' }, pdf: 'fabbian-2021' },
  ],
  axolight: [
    {
      label: same('The Anthology 2025-2026'),
      url: dropbox(
        'f3odh592vz17gpq9fiz51/AXOLIGHT_THEANTHOLOGY_2025-2026.pdf?rlkey=w9d992ueoo50i3ov0e3b0mxk5&st=sawmr7x1&dl=0',
      ),
    },
    { label: same('Italian Lighting Lab'), pdf: 'axolight-lab' },
    {
      label: { fr: 'Catalogue 2022', en: '2022 catalogue', it: 'Catalogo 2022' },
      pdf: 'axolight-2022',
    },
  ],
}

const LEGACY_BASE = () =>
  process.env.LEGACY_UPLOADS_URL || 'https://agencepise.fr/wp-content/uploads/'
const legacyUrl = (file: string) => LEGACY_BASE() + file

export type FetchPdf = (file: string) => Promise<Buffer | null>

/** Les catalogues pèsent jusqu'à 50 Mo : délai large, deux essais. */
const fetchPdf: FetchPdf = async (file) => {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(legacyUrl(file), { signal: AbortSignal.timeout(180_000) })
      if (res.ok) return Buffer.from(await res.arrayBuffer())
    } catch {
      // nouvel essai
    }
  }
  return null
}

export type CataloguesReport = {
  brands: string[]
  documents: string[]
  fallback: string[]
  skipped: string[]
}

const OTHER = LOCALES.filter((l) => l !== 'fr')

/** Copie un PDF de l'ancien site dans la documentation (une seule fois, reconnu à son nom). */
const importPdf = async (
  ctx: Ctx & { fetchFile?: FetchPdf },
  key: keyof typeof LEGACY_PDFS,
  brands: Map<string, number>,
  report: CataloguesReport,
  cache: Map<string, number | null>,
) => {
  if (cache.has(key)) return cache.get(key) ?? null
  const { payload, req } = ctx
  const pdf = LEGACY_PDFS[key]
  const name = pdf.file.split('/').pop()!
  const existing = await payload.find({
    collection: 'documents',
    where: { filename: { like: name.replace(/\.pdf$/i, '') } },
    limit: 1,
    depth: 0,
    req,
  })
  if (existing.docs[0]) {
    cache.set(key, existing.docs[0].id)
    return existing.docs[0].id
  }
  const data = await (ctx.fetchFile ?? fetchPdf)(pdf.file)
  if (!data) {
    report.fallback.push(pdf.file)
    cache.set(key, null)
    return null
  }
  forgetUploadedFile(req)
  const doc = await payload.create({
    collection: 'documents',
    locale: 'fr',
    data: {
      title: pdf.title.fr,
      kind: pdf.kind,
      access: 'public',
      brand: brands.get(pdf.brand) ?? null,
      language: pdf.language,
      ...(pdf.year ? { year: pdf.year } : {}),
    },
    file: { data, mimetype: 'application/pdf', name, size: data.length },
    req,
  })
  for (const locale of OTHER) {
    forgetUploadedFile(req)
    await payload.update({
      collection: 'documents',
      id: doc.id,
      locale,
      data: { title: pdf.title[locale] },
      req,
    })
  }
  forgetUploadedFile(req)
  report.documents.push(`${pdf.title.fr} (${Math.round(data.length / 1e5) / 10} Mo)`)
  cache.set(key, doc.id)
  return doc.id
}

export const importCatalogues = async (ctx: Ctx & { fetchFile?: FetchPdf }) => {
  const { payload, req } = ctx
  const report: CataloguesReport = { brands: [], documents: [], fallback: [], skipped: [] }
  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { in: Object.keys(CATALOGUES) } },
    limit: 50,
    depth: 0,
    draft: true,
    locale: 'fr',
    req,
  })
  const brands = new Map(docs.map((b) => [b.slug ?? '', b.id]))
  const cache = new Map<string, number | null>()

  for (const brand of docs) {
    const entries = CATALOGUES[brand.slug ?? '']
    if (!entries) continue
    if (brand._status === 'draft') {
      report.skipped.push(`${brand.name} : modifications non publiées`)
      continue
    }
    if (brand.catalogues?.length) {
      report.skipped.push(`${brand.name} : catalogues déjà saisis`)
      continue
    }
    const rows = []
    for (const entry of entries) {
      if ('url' in entry) {
        rows.push({ label: entry.label, url: entry.url, document: null })
        continue
      }
      const id = await importPdf(ctx, entry.pdf, brands, report, cache)
      rows.push(
        id
          ? { label: entry.label, url: null, document: id }
          : { label: entry.label, url: legacyUrl(LEGACY_PDFS[entry.pdf].file), document: null },
      )
    }
    const saved = await payload.update({
      collection: 'brands',
      id: brand.id,
      locale: 'fr',
      depth: 0,
      data: {
        catalogues: rows.map((row) => ({
          label: row.label.fr,
          url: row.url,
          document: row.document,
        })),
        _status: 'published',
      },
      req,
    })
    // Mêmes lignes dans chaque langue : la traduction du libellé s'attache à leur identifiant.
    const ids = (saved.catalogues ?? []).map((row) => row.id)
    for (const locale of OTHER) {
      await payload.update({
        collection: 'brands',
        id: brand.id,
        locale,
        depth: 0,
        data: {
          catalogues: rows.map((row, i) => ({
            id: ids[i],
            label: row.label[locale],
            url: row.url,
            document: row.document,
          })),
          _status: 'published',
        },
        req,
      })
    }
    report.brands.push(`${brand.name} (${rows.length})`)
  }

  const { logger } = payload
  for (const line of report.documents) logger.info(`Catalogues › PDF copié · ${line}`)
  for (const line of report.brands) logger.info(`Catalogues › fiche complétée · ${line}`)
  for (const file of report.fallback)
    logger.warn(`Catalogues › PDF non copié, lien vers l'ancien site · ${file}`)
  for (const line of report.skipped) logger.info(`Catalogues › ignoré · ${line}`)
  return report
}
