// @vitest-environment node
import { createHash } from 'node:crypto'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { needsRepair, repairMediaFiles, type StoredBlob } from '@/seed/media-files'

/**
 * Images enregistrées avec un suffixe aléatoire : le document pointait vers une taille réduite.
 * La réparation renvoie l'original (photo du dépôt ou fichier d'origine du stockage, contrôlé
 * par sa taille), ne touche pas aux images saines et ne fait rien à la seconde exécution.
 */

let payload: Payload
const stamp = Date.now()
const SUFFIX = 'Ab3'.repeat(10)
const ids: number[] = []
let repoDir: string
let emptyDir: string

const sha = (data: Buffer) => createHash('sha256').update(data).digest('hex')

const photo = (width: number, height: number, color: string) =>
  sharp({ create: { width, height, channels: 3, background: color } })
    .jpeg()
    .toBuffer()

const create = async (name: string, data: Buffer) => {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: `Essai ${name}` },
    file: { data, mimetype: 'image/jpeg', name, size: data.length },
  })
  ids.push(doc.id)
  return doc
}

/** Reproduit l'état abîmé : le document porte le nom suffixé de sa taille « carte ». */
const breakName = async (id: number, filename: string) => {
  await payload.db.updateOne({ collection: 'media', id, data: { filename } })
}

const storedFile = async (filename: string) =>
  readFile(path.resolve(process.cwd(), 'media', filename))

describe('images d’origine', () => {
  let original: Buffer
  let fromBlob: number
  let fromRepo: number
  let missing: number
  let small: number
  const listed: string[] = []

  const listBlobs = async (prefix: string): Promise<StoredBlob[]> => {
    listed.push(prefix)
    if (prefix.includes('absente')) return []
    const at = new Date()
    return [
      {
        pathname: `${prefix}-${'Zz9'.repeat(10)}.jpg`,
        url: 'blob://autre',
        size: 12,
        uploadedAt: at,
      },
      {
        pathname: `${prefix}-960x640-${SUFFIX}.jpg`,
        url: 'blob://taille',
        size: original.length,
        uploadedAt: at,
      },
      {
        pathname: `${prefix}-${SUFFIX}.jpg`,
        url: 'blob://original',
        size: original.length,
        uploadedAt: at,
      },
    ]
  }
  const download = async (url: string) => (url === 'blob://original' ? original : null)

  beforeAll(async () => {
    payload = await getPayload({ config })
    original = await photo(1200, 800, '#c04a2b')
    repoDir = await mkdtemp(path.join(os.tmpdir(), 'pise-depot-'))
    emptyDir = await mkdtemp(path.join(os.tmpdir(), 'pise-vide-'))

    const a = await create(`stockage-${stamp}-photo.jpg`, original)
    fromBlob = a.id
    await breakName(a.id, `stockage-${stamp}-photo-960x640-${SUFFIX}.jpg`)

    const b = await create(`depot-${stamp}-photo.jpg`, original)
    fromRepo = b.id
    await breakName(b.id, `depot-${stamp}-photo-${SUFFIX}.jpg`)
    await writeFile(path.join(repoDir, `depot-${stamp}-photo.jpg`), original)

    const c = await create(`absente-${stamp}-photo.jpg`, original)
    missing = c.id
    await breakName(c.id, `absente-${stamp}-photo-480x320-${SUFFIX}.jpg`)

    // Trop petite pour avoir des tailles : un seul fichier, son nom suffixé est juste.
    const d = await create(`logo-${stamp}-photo.jpg`, await photo(200, 50, '#222222'))
    small = d.id
    await breakName(d.id, `logo-${stamp}-photo-${SUFFIX}.jpg`)
  })

  afterAll(async () => {
    for (const id of ids) await payload.delete({ collection: 'media', id }).catch(() => {})
    await rm(repoDir, { recursive: true, force: true })
    await rm(emptyDir, { recursive: true, force: true })
  })

  it('repère les images abîmées seulement', async () => {
    const docs = await Promise.all(
      [fromBlob, fromRepo, missing, small].map((id) =>
        payload.findByID({ collection: 'media', id, depth: 0 }),
      ),
    )
    expect(docs.map(needsRepair)).toEqual([true, true, true, false])
  })

  it('renvoie l’original retrouvé dans le stockage ou dans le dépôt', async () => {
    const reportBlob = await repairMediaFiles({
      payload,
      ids: [fromBlob, missing, small],
      listBlobs,
      download,
      repoDir: emptyDir,
    })
    expect(reportBlob.repaired).toHaveLength(1)
    expect(reportBlob.notFound).toEqual([expect.stringContaining(`absente-${stamp}-photo`)])
    expect(reportBlob.unchanged).toBe(1)

    const before = listed.length
    const reportRepo = await repairMediaFiles({
      payload,
      ids: [fromRepo],
      listBlobs,
      download,
      repoDir,
    })
    expect(reportRepo.repaired).toHaveLength(1)
    expect(listed.length).toBe(before) // photo du dépôt : le stockage n'est pas consulté

    for (const [id, stem] of [
      [fromBlob, `stockage-${stamp}-photo`],
      [fromRepo, `depot-${stamp}-photo`],
    ] as const) {
      const doc = await payload.findByID({ collection: 'media', id, depth: 0 })
      expect(doc.filename).toMatch(new RegExp(`^${stem}(-\\d+)?\\.jpg$`))
      expect(doc._objectKey).toBeTruthy()
      expect(doc.width).toBe(1200)
      expect(doc.sizes?.card?.filename).toBe(doc.filename!.replace('.jpg', '-960x640.jpg'))
      expect(sha(await storedFile(doc.filename!))).toBe(sha(original))
    }
  })

  it('laisse intactes l’image sans original et la petite image', async () => {
    const absent = await payload.findByID({ collection: 'media', id: missing, depth: 0 })
    expect(absent.filename).toBe(`absente-${stamp}-photo-480x320-${SUFFIX}.jpg`)
    const logo = await payload.findByID({ collection: 'media', id: small, depth: 0 })
    expect(logo.filename).toBe(`logo-${stamp}-photo-${SUFFIX}.jpg`)
  })

  it('ne fait rien à la seconde exécution', async () => {
    const report = await repairMediaFiles({
      payload,
      ids: [fromBlob, fromRepo, small],
      listBlobs,
      download,
      repoDir,
    })
    expect(report.repaired).toEqual([])
    expect(report.unchanged).toBe(3)
  })
})
