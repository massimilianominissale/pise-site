import { LOCALES } from '../i18n/config'
import type { Home } from '../payload-types'
import type { Ctx } from './brands'

/**
 * Réorganisation de la mosaïque d'accueil demandée par PISE le 22/10 :
 * 1. Johanson Design prend la grande case occupée par Milla & Milli ;
 * 2. dans la grande case, la photo du showroom Johanson remplace celle des tabourets Split
 *    (qui passent dans la petite case du showroom).
 * Deux tuiles échangées changent de place, mais la taille et la pastille animée restent attachées
 * à la case ; le badge « Nouveau » suit la tuile (il concerne la collection Archetype).
 */

type Tile = NonNullable<Home['mosaic']>[number]

const relId = (value: unknown) =>
  typeof value === 'number'
    ? value
    : value && typeof value === 'object' && 'id' in value
      ? (value as { id: number }).id
      : null

/** Échange les tuiles des cases `a` et `b` ; chaque case garde sa taille et sa pastille. */
export const swapTiles = (tiles: Tile[], a: number, b: number): Tile[] => {
  const next = [...tiles]
  next[a] = { ...tiles[b], size: tiles[a].size, pulse: tiles[a].pulse }
  next[b] = { ...tiles[a], size: tiles[b].size, pulse: tiles[b].pulse }
  return next
}

/**
 * Nouvel ordre des tuiles, ou `null` si la mosaïque a déjà été modifiée (la première tuile n'est
 * plus celle de Milla & Milli, ou aucune tuile Johanson Design).
 */
export const swapFeaturedTile = (
  tiles: Tile[],
  ids: { from: number; to: number; preferredRange?: number | null },
): Tile[] | null => {
  if (!tiles.length || relId(tiles[0].brand) !== ids.from) return null
  const candidates = tiles
    .map((tile, index) => ({ tile, index }))
    .filter(({ tile, index }) => index > 0 && relId(tile.brand) === ids.to)
  const target =
    candidates.find(
      ({ tile }) => ids.preferredRange != null && relId(tile.range) === ids.preferredRange,
    ) ?? candidates[0]
  if (!target) return null
  return swapTiles(tiles, 0, target.index)
}

/**
 * Nouvel ordre si la grande case montre Johanson « Split » et qu'une autre tuile Johanson existe
 * (le showroom) ; sinon `null` (mosaïque déjà réorganisée).
 */
export const swapJohansonTiles = (
  tiles: Tile[],
  ids: { brand: number; split: number },
): Tile[] | null => {
  const first = tiles[0]
  if (!first || relId(first.brand) !== ids.brand || relId(first.range) !== ids.split) return null
  const other = tiles.findIndex(
    (tile, index) =>
      index > 0 && relId(tile.brand) === ids.brand && relId(tile.range) !== ids.split,
  )
  return other > 0 ? swapTiles(tiles, 0, other) : null
}

const idBySlug = async (
  { payload, req }: Ctx,
  collection: 'brands' | 'ranges',
  slug: string,
  brand?: number,
) => {
  const { docs } = await payload.find({
    collection,
    where: {
      and: [{ slug: { equals: slug } }, ...(brand ? [{ brand: { equals: brand } }] : [])],
    },
    limit: 1,
    depth: 0,
    draft: true,
    req,
  })
  return docs[0]?.id ?? null
}

/** Mosaïque publiée, ou `null` si l'accueil a des modifications non publiées (on n'y touche pas). */
const publishedMosaic = async ({ payload, req }: Ctx) => {
  const latest = await payload.findGlobal({ slug: 'home', depth: 0, draft: true, req })
  if (latest._status === 'draft') {
    payload.logger.warn('Mosaïque : modifications non publiées en cours sur l’accueil, rien changé')
    return null
  }
  return latest.mosaic ?? []
}

/** Enregistre le nouvel ordre ; chaque langue garde ses étiquettes (tuiles retrouvées par identifiant). */
const saveMosaic = async ({ payload, req }: Ctx, plan: Tile[]) => {
  for (const locale of LOCALES) {
    const current = await payload.findGlobal({
      slug: 'home',
      locale,
      fallbackLocale: false,
      depth: 0,
      req,
    })
    const byId = new Map((current.mosaic ?? []).map((tile) => [tile.id, tile]))
    await payload.updateGlobal({
      slug: 'home',
      locale,
      depth: 0,
      req,
      data: {
        _status: 'published',
        mosaic: plan.map((tile) => ({
          ...tile,
          label: byId.get(tile.id)?.label ?? null,
        })),
      },
    })
  }
}

export const featureJohanson = async (ctx: Ctx) => {
  const { payload } = ctx
  const tiles = await publishedMosaic(ctx)
  if (!tiles) return false

  const from = await idBySlug(ctx, 'brands', 'milla-et-milli')
  const to = await idBySlug(ctx, 'brands', 'johanson-design')
  if (!from || !to) return false
  const preferredRange = await idBySlug(ctx, 'ranges', 'split', to)

  const plan = swapFeaturedTile(tiles, { from, to, preferredRange })
  if (!plan) {
    payload.logger.info('Mosaïque : Milla & Milli n’est plus en première case, rien changé')
    return false
  }
  await saveMosaic(ctx, plan)
  payload.logger.info('Mosaïque : Johanson Design en première case, Milla & Milli à sa place')
  return true
}

export const featureJohansonShowroom = async (ctx: Ctx) => {
  const { payload } = ctx
  const tiles = await publishedMosaic(ctx)
  if (!tiles) return false

  const brand = await idBySlug(ctx, 'brands', 'johanson-design')
  const split = brand ? await idBySlug(ctx, 'ranges', 'split', brand) : null
  if (!brand || !split) return false

  const plan = swapJohansonTiles(tiles, { brand, split })
  if (!plan) {
    payload.logger.info('Mosaïque : la grande case ne montre plus Johanson Split, rien changé')
    return false
  }
  await saveMosaic(ctx, plan)
  payload.logger.info('Mosaïque : showroom Johanson en grande case, tabourets Split à sa place')
  return true
}
