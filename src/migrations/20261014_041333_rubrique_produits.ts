import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Rubrique « Produits » des en-têtes de listes. Idempotente : la migration de données
 * 20261013_201500_contenus_de_depart l'applique déjà, car elle lit les réglages avec le schéma
 * actuel (voir ce fichier).
 */
export const addProductsListing = (db: MigrateUpArgs['db']) =>
  db.execute(sql`
   ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "products_image_id" integer;
  ALTER TABLE "listings_locales" ADD COLUMN IF NOT EXISTS "products_title" varchar;
  ALTER TABLE "listings_locales" ADD COLUMN IF NOT EXISTS "products_lead" varchar;
  DO $$ BEGIN
    ALTER TABLE "listings" ADD CONSTRAINT "listings_products_image_id_media_id_fk" FOREIGN KEY ("products_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "listings_products_products_image_idx" ON "listings" USING btree ("products_image_id");`)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await addProductsListing(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "listings" DROP CONSTRAINT IF EXISTS "listings_products_image_id_media_id_fk";

  DROP INDEX IF EXISTS "listings_products_products_image_idx";
  ALTER TABLE "listings" DROP COLUMN IF EXISTS "products_image_id";
  ALTER TABLE "listings_locales" DROP COLUMN IF EXISTS "products_title";
  ALTER TABLE "listings_locales" DROP COLUMN IF EXISTS "products_lead";`)
}
