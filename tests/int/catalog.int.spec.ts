// @vitest-environment node
import { NextRequest } from 'next/server'
import { getPayload, type Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { proxy } from '@/proxy'
import { PRODUCTS, seedProducts } from '@/seed/products'

/**
 * Catalogue : lien permanent /p/[référence], lecture publique d'une fiche et import de départ.
 * S'exécute sur la base locale, migrations appliquées (pnpm migrate).
 */

let payload: Payload

beforeAll(async () => {
  payload = await getPayload({ config: await config })
})

const run = (url: string) => proxy(new NextRequest(new URL(url, 'https://agencepise.fr')))

describe('Lien permanent /p/[référence]', () => {
  it('est servi dans la langue de l’adresse, sans rubrique traduite', () => {
    expect(run('/p/NARDI-NET-LOUNGE').headers.get('x-middleware-rewrite')).toContain(
      '/fr/p/NARDI-NET-LOUNGE',
    )
    expect(run('/en/p/NARDI-NET-LOUNGE').headers.get('x-middleware-rewrite')).toContain(
      '/en/p/NARDI-NET-LOUNGE',
    )
  })
})

describe('Fiche produit publique', () => {
  it('un visiteur lit Net Lounge, ses finitions et leurs photos', async () => {
    const { docs } = await payload.find({
      collection: 'products',
      overrideAccess: false,
      locale: 'en',
      depth: 1,
      where: { reference: { equals: 'NARDI-NET-LOUNGE' } },
    })
    const product = docs[0]
    expect(product?.slug).toBe('net-lounge')
    expect(product.finishes?.map((f) => f.name)).toEqual(['Anthracite', 'Mustard', 'Dove grey'])
    const imageIds = (product.images ?? []).map((i) => (typeof i === 'object' ? i.id : i))
    for (const finish of product.finishes ?? []) {
      const id = typeof finish.image === 'object' ? finish.image?.id : finish.image
      expect(imageIds).toContain(id)
    }
  })

  it('un produit en brouillon reste invisible pour le public', async () => {
    const { docs: brands } = await payload.find({
      collection: 'brands',
      where: { slug: { equals: 'nardi' } },
      limit: 1,
    })
    const draft = await payload.create({
      collection: 'products',
      data: {
        name: `Brouillon ${Date.now()}`,
        reference: `TEST-${Date.now()}`,
        brand: brands[0].id,
        _status: 'draft',
      },
      draft: true,
    })
    const visible = await payload.find({
      collection: 'products',
      overrideAccess: false,
      where: { id: { equals: draft.id } },
    })
    expect(visible.totalDocs).toBe(0)
    await payload.delete({ collection: 'products', id: draft.id })
  })
})

describe('Produits de départ', () => {
  it('relancer l’import ne crée aucun doublon', async () => {
    const references = PRODUCTS.map((p) => p.reference)
    const count = async () =>
      (
        await payload.count({
          collection: 'products',
          where: { reference: { in: references } },
        })
      ).totalDocs
    const before = await count()
    await seedProducts({ payload })
    expect(await count()).toBe(before)
    expect(before).toBe(PRODUCTS.length)
  })
})
