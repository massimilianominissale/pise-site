// @vitest-environment node
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

/**
 * Règles du modèle de contenu : rôles, brouillons imposés à l'IA, lecture publique,
 * espace pro et unicité des identifiants. S'exécute sur la base locale.
 */

let payload: Payload
const stamp = Date.now()
const email = (who: string) => `${who}-${stamp}@test.pise.local`
type AnyUser = Awaited<ReturnType<Payload['create']>> & { collection?: string }

let admin: AnyUser
let ai: AnyUser
let editor: AnyUser
let brandId: number

const asUser = (user: AnyUser, collection: 'users' | 'customers' = 'users') =>
  ({ user: { ...user, collection }, overrideAccess: false }) as const

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  admin = await payload.create({
    collection: 'users',
    data: { email: email('admin'), password: 'test-1234', role: 'admin' },
  })
  editor = await payload.create({
    collection: 'users',
    data: { email: email('editor'), password: 'test-1234', role: 'editor' },
  })
  ai = await payload.create({
    collection: 'users',
    data: { email: email('ai'), password: 'test-1234', role: 'ai' },
  })
  const brand = await payload.create({
    collection: 'brands',
    data: { name: `Johanson ${stamp}`, _status: 'published' },
  })
  brandId = brand.id
})

afterAll(async () => {
  for (const collection of ['products', 'ranges', 'posts', 'documents', 'customers'] as const) {
    await payload.delete({
      collection,
      where: { createdAt: { greater_than: new Date(stamp - 60_000).toISOString() } },
    })
  }
  await payload.delete({ collection: 'brands', where: { name: { contains: String(stamp) } } })
  await payload.delete({ collection: 'users', where: { email: { contains: String(stamp) } } })
})

describe('Assistant IA : brouillons uniquement', () => {
  it('une modification par l’IA laisse la version publiée intacte', async () => {
    await payload.update({
      collection: 'brands',
      id: brandId,
      data: { name: `Johanson modifié ${stamp}`, _status: 'published' },
      ...asUser(ai),
    })
    const published = await payload.findByID({ collection: 'brands', id: brandId, draft: false })
    const draft = await payload.findByID({ collection: 'brands', id: brandId, draft: true })
    expect(published.name).toBe(`Johanson ${stamp}`)
    expect(published._status).toBe('published')
    expect(draft.name).toBe(`Johanson modifié ${stamp}`)
  })

  it('une actualité créée par l’IA reste en brouillon même si elle demande la publication', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: { title: `Actu IA ${stamp}`, _status: 'published' },
      ...asUser(ai),
    })
    expect(post._status).toBe('draft')
    const publicRead = await payload.find({
      collection: 'posts',
      where: { id: { equals: post.id } },
      overrideAccess: false,
    })
    expect(publicRead.totalDocs).toBe(0)
  })

  it('l’IA ne peut ni créer un fabricant ni supprimer un contenu', async () => {
    await expect(
      payload.create({ collection: 'brands', data: { name: `IA ${stamp}` }, ...asUser(ai) }),
    ).rejects.toThrow()
    await expect(
      payload.delete({ collection: 'brands', id: brandId, ...asUser(ai) }),
    ).rejects.toThrow()
  })

  it('un éditeur publie normalement', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: { title: `Actu éditeur ${stamp}`, _status: 'published' },
      ...asUser(editor),
    })
    expect(post._status).toBe('published')
    expect(post.publishedAt).toBeTruthy()
  })
})

describe('Rôles', () => {
  it('un éditeur ne peut pas créer de compte ni lire les demandes', async () => {
    await expect(
      payload.create({
        collection: 'users',
        data: { email: email('x'), password: 'test-1234', role: 'admin' },
        ...asUser(editor),
      }),
    ).rejects.toThrow()
    await expect(payload.find({ collection: 'leads', ...asUser(editor) })).rejects.toThrow()
  })

  it('l’administrateur lit les demandes', async () => {
    const leads = await payload.find({ collection: 'leads', ...asUser(admin) })
    expect(leads).toBeDefined()
  })
})

describe('Espace pro', () => {
  it('un compte en attente ne peut pas se connecter, un compte validé oui', async () => {
    const pending = await payload.create({
      collection: 'customers',
      data: {
        email: email('pending'),
        password: 'test-1234',
        firstName: 'Camille',
        lastName: 'Martin',
        company: 'Studio',
        status: 'pending',
      },
    })
    await expect(
      payload.login({
        collection: 'customers',
        data: { email: pending.email as string, password: 'test-1234' },
      }),
    ).rejects.toThrow()

    await payload.update({ collection: 'customers', id: pending.id, data: { status: 'approved' } })
    const login = await payload.login({
      collection: 'customers',
      data: { email: pending.email as string, password: 'test-1234' },
    })
    expect(login.token).toBeTruthy()
  })

  it('les documents pro sont réservés aux comptes validés', async () => {
    const pdf = Buffer.from(
      '%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\nxref\n0 1\ntrailer << /Root 1 0 R >>\n%%EOF\n',
      'latin1',
    )
    const doc = await payload.create({
      collection: 'documents',
      data: { title: `Tarif ${stamp}`, kind: 'pricelist', access: 'pro' },
      file: {
        data: pdf,
        mimetype: 'application/pdf',
        name: `tarif-${stamp}.pdf`,
        size: pdf.length,
      },
    })
    const anonymous = await payload.find({
      collection: 'documents',
      where: { id: { equals: doc.id } },
      overrideAccess: false,
    })
    expect(anonymous.totalDocs).toBe(0)

    const customer = await payload.create({
      collection: 'customers',
      data: {
        email: email('approved'),
        password: 'test-1234',
        firstName: 'Léa',
        lastName: 'Rossi',
        company: 'Hôtel',
        status: 'approved',
      },
    })
    const asCustomer = await payload.find({
      collection: 'documents',
      where: { id: { equals: doc.id } },
      ...asUser(customer, 'customers'),
    })
    expect(asCustomer.totalDocs).toBe(1)
  })
})

describe('Catalogue', () => {
  it('une collection a un identifiant unique par fabricant', async () => {
    await payload.create({
      collection: 'ranges',
      data: { name: 'Lounge', brand: brandId, _status: 'published' },
    })
    await expect(
      payload.create({
        collection: 'ranges',
        data: { name: 'Lounge', brand: brandId, _status: 'published' },
      }),
    ).rejects.toThrow()
    const other = await payload.create({
      collection: 'brands',
      data: { name: `Nardi ${stamp}`, _status: 'published' },
    })
    const range = await payload.create({
      collection: 'ranges',
      data: { name: 'Lounge', brand: other.id, _status: 'published' },
    })
    expect(range.slug).toBe('lounge')
  })

  it('la référence produit est unique et l’identifiant d’URL est calculé', async () => {
    const product = await payload.create({
      collection: 'products',
      data: {
        name: `Net Lounge ${stamp}`,
        reference: `NET-${stamp}`,
        brand: brandId,
        _status: 'published',
      },
    })
    expect(product.slug).toBe(`net-lounge-${stamp}`)
    await expect(
      payload.create({
        collection: 'products',
        data: { name: 'Autre', reference: `NET-${stamp}`, brand: brandId },
      }),
    ).rejects.toThrow()
  })

  it('un nom déjà pris donne un identifiant suffixé, un identifiant saisi en double est refusé', async () => {
    const twin = await payload.create({
      collection: 'products',
      data: { name: `Net Lounge ${stamp}`, reference: `NET2-${stamp}`, brand: brandId },
    })
    expect(twin.slug).toBe(`net-lounge-${stamp}-2`)
    await expect(
      payload.create({
        collection: 'products',
        data: {
          name: 'Autre',
          slug: `net-lounge-${stamp}`,
          reference: `NET3-${stamp}`,
          brand: brandId,
        },
      }),
    ).rejects.toThrow()
  })
})
