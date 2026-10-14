// @vitest-environment node
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { legacyRedirects } from '@/lib/legacy-redirects'
import config from '@/payload.config'
import { type FetchFile, importLegacy, type LegacyContent } from '@/seed/legacy'
import { same } from '@/seed/legacy/brands'
import { p, toLexical } from '@/seed/rich'
import { forgetUploadedFile } from '@/seed/uploads'

/**
 * Reprise de l'ancien site : ajout seul. Rien de saisi n'est remplacé, une fiche en cours
 * de modification n'est pas touchée, et une seconde exécution n'ajoute rien.
 */

let payload: Payload
const stamp = Date.now()
const slug = (name: string) => `legacy-${name}-${stamp}`
const brandIds: number[] = []
const eventIds: number[] = []
const mediaIds: number[] = []

let png: Buffer
const fetchFile: FetchFile = async (file) =>
  file.includes('absent')
    ? null
    : { data: png, mimetype: 'image/png', name: file.split('/').pop()!, size: png.length }

const brandData = {
  tagline: { fr: 'Reprise', en: 'Imported', it: 'Ripreso' },
  website: 'https://example.test/',
  foundedYear: 1999,
  keyFigures: [{ label: { fr: 'Usines', en: 'Factories', it: 'Stabilimenti' }, value: same('3') }],
  story: { fr: [p('Histoire')], en: [p('Story')], it: [p('Storia')] },
}

const content = (): LegacyContent => ({
  brands: {
    [slug('a')]: {
      ...brandData,
      logo: { file: `2024/01/logo-${stamp}.png`, alt: same(`Logo A ${stamp}`) },
    },
    [slug('b')]: brandData,
    [slug('c')]: {
      ...brandData,
      logo: { file: `2024/01/absent-${stamp}.png`, alt: same(`Logo C ${stamp}`) },
    },
  },
  ranges: [],
  events: [
    {
      slug: slug('event-existing'),
      name: same('Salon existant'),
      startDate: '2024-01-01T12:00:00.000Z',
      endDate: '2024-01-02T12:00:00.000Z',
      city: 'Paris',
      summary: same('Résumé repris'),
      brands: [],
    },
    {
      slug: slug('event-new'),
      name: { fr: 'Salon repris', en: 'Imported fair', it: 'Fiera ripresa' },
      startDate: '2024-02-01T12:00:00.000Z',
      endDate: '2024-02-02T12:00:00.000Z',
      city: 'Milan',
      summary: { fr: 'Résumé', en: 'Summary', it: 'Sintesi' },
      brands: [slug('a')],
    },
  ],
  tours: [],
  settings: null,
  showroom: null,
  pages: [
    {
      key: 'test',
      slug: same(slug('page')),
      title: { fr: 'Page reprise', en: 'Imported page', it: 'Pagina ripresa' },
      layout: (l) => [
        {
          blockType: 'mediaText',
          image: { file: 'pise-equipe.jpg', repo: true, alt: same(`Équipe ${stamp}`) },
          imagePosition: 'left',
          title: `Titre ${l}`,
          body: toLexical([p(`Texte ${l}`)]),
        },
      ],
    },
  ],
})

const brand = async (s: string, locale: 'fr' | 'en' = 'fr') => {
  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { equals: s } },
    locale,
    fallbackLocale: false,
    depth: 0,
    limit: 1,
  })
  return docs[0]!
}

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  png = await sharp({
    create: { width: 8, height: 8, channels: 3, background: { r: 200, g: 0, b: 0 } },
  })
    .png()
    .toBuffer()

  // A : une accroche déjà saisie par l'équipe. B : des modifications non publiées. C : vide.
  for (const [key, tagline] of [
    ['a', 'Saisi par l’équipe'],
    ['b', undefined],
    ['c', undefined],
  ] as const) {
    const doc = await payload.create({
      collection: 'brands',
      data: { name: `Legacy ${key} ${stamp}`, slug: slug(key), tagline, _status: 'published' },
      locale: 'fr',
    })
    brandIds.push(doc.id)
  }
  await payload.update({
    collection: 'brands',
    id: brandIds[1]!,
    data: { tagline: 'Brouillon en cours' },
    locale: 'fr',
    draft: true,
  })
  const event = await payload.create({
    collection: 'events',
    data: {
      name: 'Salon saisi',
      slug: slug('event-existing'),
      startDate: '2024-01-01T12:00:00.000Z',
      _status: 'published',
    },
    locale: 'fr',
  })
  eventIds.push(event.id)
})

afterAll(async () => {
  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug('page') } },
    depth: 0,
  })
  const pageMedia = pages.docs.flatMap((page) =>
    (page.layout ?? []).flatMap((b) =>
      b.blockType === 'mediaText' && typeof b.image === 'number' ? [b.image] : [],
    ),
  )
  if (pages.docs.length)
    await payload.delete({
      collection: 'pages',
      where: { id: { in: pages.docs.map((d) => d.id) } },
    })
  mediaIds.push(...pageMedia)
  const events = await payload.find({
    collection: 'events',
    where: { slug: { like: `legacy-event-` } },
    depth: 0,
    limit: 10,
  })
  eventIds.push(...events.docs.map((d) => d.id))
  const media = await payload.find({
    collection: 'media',
    where: { brand: { in: brandIds } },
    depth: 0,
    limit: 20,
  })
  mediaIds.push(...media.docs.map((d) => d.id))
  if (eventIds.length)
    await payload.delete({ collection: 'events', where: { id: { in: [...new Set(eventIds)] } } })
  if (mediaIds.length)
    await payload.delete({ collection: 'media', where: { id: { in: mediaIds } } })
  if (brandIds.length)
    await payload.delete({ collection: 'brands', where: { id: { in: brandIds } } })
})

describe('reprise de l’ancien site', () => {
  it('ne remplit que les champs vides, sans toucher aux fiches en cours de modification', async () => {
    const report = await importLegacy({ payload, fetchFile }, content())

    const a = await brand(slug('a'))
    expect(a.tagline).toBe('Saisi par l’équipe')
    expect(a.website).toBe('https://example.test/')
    expect(a.foundedYear).toBe(1999)
    expect(JSON.stringify(a.story)).toContain('Histoire')
    expect(a.logo).toBeTruthy()

    // La traduction d'un champ que l'équipe a saisi n'est pas inventée.
    const aEn = await brand(slug('a'), 'en')
    expect(aEn.tagline ?? null).toBeNull()
    expect(JSON.stringify(aEn.story)).toContain('Story')
    expect(aEn.keyFigures?.[0]?.label).toBe('Factories')

    const b = await payload.findByID({ collection: 'brands', id: brandIds[1]!, draft: true })
    expect(b.tagline).toBe('Brouillon en cours')
    expect(b.website ?? null).toBeNull()
    expect(report.conflicts.some((line) => line.includes(`Legacy b ${stamp}`))).toBe(true)

    // Photo introuvable sur l'ancien site : signalée, le reste est repris.
    const c = await brand(slug('c'))
    expect(c.logo ?? null).toBeNull()
    expect(c.tagline).toBe('Reprise')
    expect(report.missingImages.some((f) => f.includes('absent'))).toBe(true)
  })

  it('crée ce qui manque et laisse les documents existants', async () => {
    const existing = await payload.findByID({
      collection: 'events',
      id: eventIds[0]!,
      locale: 'fr',
    })
    expect(existing.name).toBe('Salon saisi')
    expect(existing.summary ?? null).toBeNull()

    const { docs } = await payload.find({
      collection: 'events',
      where: { slug: { equals: slug('event-new') } },
      locale: 'en',
      depth: 0,
    })
    expect(docs[0]?.name).toBe('Imported fair')
    expect(docs[0]?.brands).toEqual([brandIds[0]])
  })

  it('garde la photo d’un bloc dans chaque langue de la page', async () => {
    const find = (locale: 'fr' | 'en') =>
      payload.find({
        collection: 'pages',
        where: { slug: { equals: slug('page') } },
        locale,
        depth: 0,
      })
    const [fr, en] = await Promise.all([find('fr'), find('en')])
    const block = (doc: (typeof fr.docs)[number] | undefined) => doc?.layout?.[0]
    const frBlock = block(fr.docs[0])
    const enBlock = block(en.docs[0])
    expect(frBlock?.blockType).toBe('mediaText')
    expect(enBlock?.blockType).toBe('mediaText')
    if (frBlock?.blockType !== 'mediaText' || enBlock?.blockType !== 'mediaText') return
    expect(frBlock.image).toBeTruthy()
    expect(enBlock.image).toBe(frBlock.image)
    expect(frBlock.title).toBe('Titre fr')
    expect(enBlock.title).toBe('Titre en')
  })

  it('oublie le fichier mémorisé par le stockage avant chaque envoi', () => {
    const req = { context: { _payloadCloudStorage: { file: 'premier' }, autre: 1 } }
    forgetUploadedFile(req as never)
    expect(req.context).toEqual({ autre: 1 })
  })

  it('n’ajoute rien à la seconde exécution', async () => {
    const report = await importLegacy({ payload, fetchFile }, content())
    expect(report.added).toEqual([])
  })
})

describe('redirections de l’ancien site', () => {
  const redirects = legacyRedirects()

  it('a des adresses d’origine uniques et des destinations internes', () => {
    const sources = redirects.map((r) => r.source)
    expect(new Set(sources).size).toBe(sources.length)
    for (const r of redirects) expect(r.destination.startsWith('/')).toBe(true)
  })

  it('envoie les fiches fabricants et les salons vers les nouvelles pages', () => {
    const to = (source: string) => redirects.find((r) => r.source === source)?.destination
    expect(to('/index.php/portfolio/kymo')).toBe('/fabricants')
    expect(to('/index.php/portfolio/noon-by-johanson')).toBe('/fabricants/johanson-design/noon')
    expect(to('/index.php/nos-valeurs-nos-services')).toBe('/agence')
    // La règle générique /index.php/:path* vient en dernier.
    expect(redirects.at(-1)?.source).toBe('/index.php/:path*')
  })
})
