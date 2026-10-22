import { LOCALES } from '../i18n/config'
import type { Home } from '../payload-types'
import type { Ctx } from './brands'

/**
 * Mosaïque d'accueil : Johanson Design prend la grande case occupée par Milla & Milli
 * (demande de PISE du 22/10). Les deux tuiles échangent leur place et leur taille ; la pastille
 * animée reste sur la grande case, le badge « Nouveau » reste sur la collection Archetype.
 */

type Tile = NonNullable<Home['mosaic']>[number]

const relId = (value: unknown) =>
  typeof value === 'number'
    ? value
    : value && typeof value === 'object' && 'id' in value
      ? (value as { id: number }).id
      : null

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

  const featured = tiles[0]
  const next = [...tiles]
  next[0] = { ...target.tile, size: featured.size, pulse: featured.pulse }
  next[target.index] = { ...featured, size: target.tile.size, pulse: target.tile.pulse }
  return next
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

export const featureJohanson = async (ctx: Ctx) => {
  const { payload, req } = ctx
  const latest = await payload.findGlobal({ slug: 'home', depth: 0, draft: true, req })
  if (latest._status === 'draft') {
    payload.logger.warn('Mosaïque : modifications non publiées en cours sur l’accueil, rien changé')
    return false
  }

  const from = await idBySlug(ctx, 'brands', 'milla-et-milli')
  const to = await idBySlug(ctx, 'brands', 'johanson-design')
  if (!from || !to) return false
  const preferredRange = await idBySlug(ctx, 'ranges', 'split', to)

  const plan = swapFeaturedTile(latest.mosaic ?? [], { from, to, preferredRange })
  if (!plan) {
    payload.logger.info('Mosaïque : Milla & Milli n’est plus en première case, rien changé')
    return false
  }

  // Chaque langue garde ses étiquettes : les tuiles sont retrouvées par leur identifiant.
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
  payload.logger.info('Mosaïque : Johanson Design en première case, Milla & Milli à sa place')
  return true
}
