import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedImrsivo } from '../seed/imrsivo'

/**
 * Migration de données (ajustements demandés par PISE) : page IMRSIVO, bloc partenariat de
 * l'accueil, photo d'équipe, menu principal, photos de finitions Net Lounge rétablies.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await seedImrsivo({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('Ajustements IMRSIVO et accueil : aucune suppression automatique.')
}
