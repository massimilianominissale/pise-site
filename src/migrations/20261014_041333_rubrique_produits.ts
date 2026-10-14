import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "listings" ADD COLUMN "products_image_id" integer;
  ALTER TABLE "listings_locales" ADD COLUMN "products_title" varchar;
  ALTER TABLE "listings_locales" ADD COLUMN "products_lead" varchar;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_products_image_id_media_id_fk" FOREIGN KEY ("products_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "listings_products_products_image_idx" ON "listings" USING btree ("products_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "listings" DROP CONSTRAINT "listings_products_image_id_media_id_fk";
  
  DROP INDEX "listings_products_products_image_idx";
  ALTER TABLE "listings" DROP COLUMN "products_image_id";
  ALTER TABLE "listings_locales" DROP COLUMN "products_title";
  ALTER TABLE "listings_locales" DROP COLUMN "products_lead";`)
}
