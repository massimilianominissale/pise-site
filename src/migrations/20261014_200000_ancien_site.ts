import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { importLegacy } from '../seed/legacy'

/**
 * Migration de données : reprise des contenus de l'ancien site agencepise.fr (fiches fabricants,
 * collections Noon et Decibel, salons, visites IMRSIVO, coordonnées, pages de l'agence,
 * mentions légales). Ajout seul : rien de déjà saisi n'est remplacé (voir src/seed/legacy).
 * Les photos manquantes sont téléchargées depuis l'ancien site pendant le déploiement.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await importLegacy({ payload, req })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Les contenus repris ont pu être retouchés depuis : ils se suppriment à la main si besoin.
  payload.logger.info('Reprise de l’ancien site : aucune suppression automatique.')
}
