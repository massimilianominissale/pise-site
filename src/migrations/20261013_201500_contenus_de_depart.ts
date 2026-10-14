import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedGlobals, seedRanges, unseedRanges } from '../seed/site'
import { addProductsListing } from './20261014_041333_rubrique_produits'

/**
 * Migration de données : collections connues, accueil, menu, pied de page, réglages
 * et page « Nos fabricants ». Ne modifie pas le schéma, n'écrase rien de déjà saisi.
 *
 * Payload lit et écrit les réglages avec le schéma actuel : les colonnes de la rubrique
 * « Produits », ajoutées par une migration ultérieure, doivent donc exister dès maintenant
 * (sinon la base de production, qui exécute toutes les migrations d'un coup, échoue).
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await addProductsListing(db)
  await seedRanges({ payload, req })
  await seedGlobals({ payload, req })
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await unseedRanges({ payload, req })
}
