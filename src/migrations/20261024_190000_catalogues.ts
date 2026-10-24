import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { importCatalogues } from '../seed/catalogues'

/**
 * Migration de données (24/10) : catalogues des fabricants repris de l'ancien site (liens Dropbox
 * et PDF copiés dans la documentation). Ajout seul.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await importCatalogues({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Catalogues : aucune suppression automatique.')
}
