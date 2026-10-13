import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedBrands, seedSectors, unseedBrands } from '../seed/brands'

/**
 * Migration de données : secteurs et fabricants de départ, avec leurs photos.
 * Ne modifie pas le schéma. Sans effet sur un fabricant déjà présent.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await seedSectors({ payload, req })
  await seedBrands({ payload, req })
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await unseedBrands({ payload, req })
}
