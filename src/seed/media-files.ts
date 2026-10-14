import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { list } from '@vercel/blob'
import type { Payload, PayloadRequest } from 'payload'

import type { Media } from '../payload-types'
import { forgetUploadedFile } from './uploads'

/**
 * Remise en ordre des fichiers d'images enregistrés avec un suffixe aléatoire.
 *
 * Avec `addRandomSuffix`, le stockage Vercel Blob renommait le document d'après le DERNIER
 * fichier envoyé (souvent une taille réduite) : le site affichait une version de 480 ou 960 px
 * au lieu de l'original, et les tailles (vignette, carte, grand format) restaient introuvables.
 *
 * Pour chaque image concernée, on retrouve l'original et on le renvoie : Payload régénère les
 * tailles avec des noms exacts, dans un dossier propre à cet envoi (`_objectKey`). Les anciens
 * fichiers ne sont pas supprimés, car une base de préversion copiée de la production peut encore
 * les utiliser.
 */

const SIZE_NAMES = ['thumbnail', 'card', 'hero'] as const

export type StoredBlob = { pathname: string; url: string; size: number; uploadedAt: Date }

export type MediaFilesCtx = {
  payload: Payload
  req?: PayloadRequest
  /** Fichiers du stockage dont le chemin commence par `prefix` (remplaçable dans les tests). */
  listBlobs?: (prefix: string) => Promise<StoredBlob[]>
  /** Téléchargement d'un fichier du stockage (remplaçable dans les tests). */
  download?: (url: string) => Promise<Buffer | null>
  /** Dossier des photos de départ versionnées avec le site. */
  repoDir?: string
  /** Limite le traitement à ces images (tests). */
  ids?: number[]
}

export type MediaFilesReport = { repaired: string[]; unchanged: number; notFound: string[] }

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Nom d'origine (sans extension) et extension, déduits des tailles générées : une taille
 * s'appelle toujours `<nom>-<largeur>x<hauteur>.<ext>`.
 */
export const originalName = (media: Media): { stem: string; ext: string } | null => {
  for (const name of SIZE_NAMES) {
    const size = media.sizes?.[name]
    if (!size?.filename || !size.width || !size.height) continue
    const match = size.filename.match(new RegExp(`^(.+)-${size.width}x${size.height}(\\.[^.]+)$`))
    if (match) return { stem: match[1], ext: match[2] }
  }
  return null
}

/**
 * Vrai si le fichier principal ne porte pas le nom d'origine (suffixe ou nom d'une taille).
 * L'extension peut différer de celle des tailles (`.jpeg` d'origine, `.jpg` pour les tailles).
 */
export const needsRepair = (media: Media) => {
  const original = originalName(media)
  if (!original) return false
  return !new RegExp(`^${escape(original.stem)}\\.[A-Za-z0-9]+$`).test(media.filename ?? '')
}

const defaultListBlobs = async (prefix: string): Promise<StoredBlob[]> => {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []
  const blobs: StoredBlob[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix, cursor, limit: 1000, token })
    blobs.push(...page.blobs)
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return blobs
}

const defaultDownload = async (url: string) => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null
  } catch {
    return null
  }
}

const folderOf = (media: Media) =>
  [media.prefix, media._objectKey].filter((part): part is string => Boolean(part)).join('/')

/**
 * Octets de l'original, contrôlés par leur taille (celle enregistrée lors du premier envoi) :
 * 1. la photo de départ versionnée avec le site, si elle n'a pas été remplacée depuis ;
 * 2. sinon le fichier d'origine dans le stockage (`<nom>.<ext>` ou `<nom>-<suffixe>.<ext>`).
 */
type Deps = Required<Pick<MediaFilesCtx, 'listBlobs' | 'download' | 'repoDir'>>

const findOriginal = async (ctx: Deps, media: Media) => {
  const original = originalName(media)
  if (!original || !media.filesize) return null
  const name = `${original.stem}${original.ext}`

  const fromRepo = await readFile(path.join(ctx.repoDir, name)).catch(() => null)
  if (fromRepo && fromRepo.length === media.filesize) return { data: fromRepo, name }

  const folder = folderOf(media)
  const base = folder ? `${folder}/${original.stem}` : original.stem
  // L'extension d'origine peut différer de celle des tailles : on accepte toute extension.
  const pattern = new RegExp(`^${escape(base)}(?:-[A-Za-z0-9]{30})?(\\.[A-Za-z0-9]+)$`)
  const candidates = (await ctx.listBlobs(base))
    .filter((blob) => pattern.test(blob.pathname) && blob.size === media.filesize)
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
  for (const blob of candidates) {
    const data = await ctx.download(blob.url)
    const ext = blob.pathname.match(pattern)?.[1] ?? original.ext
    if (data && data.length === media.filesize) return { data, name: `${original.stem}${ext}` }
  }
  return null
}

export const repairMediaFiles = async (ctx: MediaFilesCtx): Promise<MediaFilesReport> => {
  const { payload, req, ids } = ctx
  const deps: Deps = {
    listBlobs: ctx.listBlobs ?? defaultListBlobs,
    download: ctx.download ?? defaultDownload,
    repoDir: ctx.repoDir ?? path.resolve(process.cwd(), 'src/seed/images'),
  }
  const report: MediaFilesReport = { repaired: [], unchanged: 0, notFound: [] }

  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 0,
    pagination: false,
    locale: 'fr',
    ...(ids ? { where: { id: { in: ids } } } : {}),
    req,
  })

  for (const media of docs) {
    if (!needsRepair(media)) {
      report.unchanged++
      continue
    }
    const label = `${media.id} · ${media.filename}`
    const original = await findOriginal(deps, media)
    if (!original) {
      report.notFound.push(label)
      continue
    }

    // Le document ne référence plus aucun fichier : rien n'est effacé lors du renvoi.
    await payload.db.updateOne({
      collection: 'media',
      id: media.id,
      data: {
        filename: null,
        sizes: Object.fromEntries(SIZE_NAMES.map((name) => [name, { filename: null }])),
      },
      req,
    })

    forgetUploadedFile(req)
    const updated = await payload.update({
      collection: 'media',
      id: media.id,
      data: {
        _objectKey: randomUUID(),
        focalX: media.focalX ?? 50,
        focalY: media.focalY ?? 50,
      },
      file: {
        data: original.data,
        mimetype: media.mimeType ?? 'image/jpeg',
        name: original.name,
        size: original.data.length,
      },
      depth: 0,
      locale: 'fr',
      req,
    })
    forgetUploadedFile(req)
    report.repaired.push(`${media.id} · ${updated.filename}`)
  }

  for (const line of report.repaired)
    payload.logger.info(`Image rétablie en taille d'origine : ${line}`)
  for (const line of report.notFound) payload.logger.warn(`Image d'origine introuvable : ${line}`)
  payload.logger.info(
    `Images : ${report.repaired.length} rétablie(s), ${report.unchanged} déjà correcte(s), ${report.notFound.length} introuvable(s)`,
  )
  return report
}
