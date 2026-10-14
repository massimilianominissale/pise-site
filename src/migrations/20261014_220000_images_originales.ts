import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { repairMediaFiles } from '../seed/media-files'

/**
 * Migration de données : chaque image affiche de nouveau son fichier d'origine (et non une
 * version réduite), et ses tailles (vignette, carte, grand format) sont de nouveau accessibles.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await repairMediaFiles({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Images d’origine : rien à annuler.')
}
