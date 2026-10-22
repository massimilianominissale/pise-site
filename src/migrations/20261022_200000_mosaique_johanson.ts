import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { featureJohanson } from '../seed/mosaic'

/**
 * Migration de données : sur la mosaïque d'accueil, Johanson Design prend la grande case de
 * Milla & Milli. Rien n'est changé si l'accueil a des modifications non publiées ou si la
 * mosaïque a déjà été réorganisée dans l'administration.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await featureJohanson({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Mosaïque : ordre à rétablir dans l’administration si besoin.')
}
