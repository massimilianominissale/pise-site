import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { featureJohansonShowroom } from '../seed/mosaic'

/**
 * Migration de données : sur la mosaïque d'accueil, la photo du showroom Johanson Design prend
 * la grande case et les tabourets Split passent dans sa petite case. Rien n'est changé si
 * l'accueil a des modifications non publiées ou si la mosaïque a déjà été réorganisée.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await featureJohansonShowroom({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Mosaïque : ordre à rétablir dans l’administration si besoin.')
}
