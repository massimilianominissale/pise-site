import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { buildSelection } from '../seed/selection'

/**
 * Migration de données : les collections deviennent des fiches produit (« Notre sélection »),
 * Noon et Decibel des marques rattachées à Johanson Design. Ajout seul.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await buildSelection({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Notre sélection : aucune suppression automatique.')
}
