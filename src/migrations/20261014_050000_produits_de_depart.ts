import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedProducts, unseedProducts } from '../seed/products'

/**
 * Migration de données : catégories, questions fréquentes et quatre produits Nardi
 * (dont Net Lounge et ses trois finitions). Ne modifie pas le schéma, n'écrase rien.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await seedProducts({ payload, req })
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await unseedProducts({ payload, req })
}
