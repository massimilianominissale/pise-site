import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedGlobals, seedRanges, unseedRanges } from '../seed/site'

/**
 * Migration de données : collections connues, accueil, menu, pied de page, réglages
 * et page « Nos fabricants ». Ne modifie pas le schéma, n'écrase rien de déjà saisi.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await seedRanges({ payload, req })
  await seedGlobals({ payload, req })
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await unseedRanges({ payload, req })
}
