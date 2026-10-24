import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { rewriteAgencyPage } from '../seed/agency-page'

/**
 * Migration de données (demande de PISE du 24/10) : page « L'agence » réécrite en trois langues,
 * questions fréquentes et showroom Johanson Design (255 rue de Vaugirard).
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await rewriteAgencyPage({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Page L’agence : version précédente disponible dans l’historique du back-office.')
}
