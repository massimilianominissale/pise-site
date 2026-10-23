import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brands" ADD COLUMN "parent_id" integer;
  ALTER TABLE "_brands_v" ADD COLUMN "version_parent_id" integer;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_parent_id_brands_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_parent_id_brands_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "brands_parent_idx" ON "brands" USING btree ("parent_id");
  CREATE INDEX "_brands_v_version_version_parent_idx" ON "_brands_v" USING btree ("version_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brands" DROP CONSTRAINT "brands_parent_id_brands_id_fk";
  
  ALTER TABLE "_brands_v" DROP CONSTRAINT "_brands_v_version_parent_id_brands_id_fk";
  
  DROP INDEX "brands_parent_idx";
  DROP INDEX "_brands_v_version_version_parent_idx";
  ALTER TABLE "brands" DROP COLUMN "parent_id";
  ALTER TABLE "_brands_v" DROP COLUMN "version_parent_id";`)
}
