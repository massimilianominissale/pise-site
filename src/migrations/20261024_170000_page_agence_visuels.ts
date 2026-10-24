import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { rewriteAgencyPage } from '../seed/agency-page'

/**
 * Migration de données (24/10) : page « L'agence » plus visuelle (photo d'équipe, photos des
 * secteurs et du sur-mesure, portraits illustrés de l'équipe). Rejoue la réécriture de la page.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await rewriteAgencyPage({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Page L’agence : version précédente disponible dans l’historique du back-office.')
}
