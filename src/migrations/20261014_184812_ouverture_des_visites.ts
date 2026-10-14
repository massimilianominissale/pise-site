import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_virtual_tours_display" AS ENUM('link', 'iframe');
  CREATE TYPE "public"."enum__virtual_tours_v_version_display" AS ENUM('link', 'iframe');
  ALTER TABLE "virtual_tours" ADD COLUMN "display" "enum_virtual_tours_display" DEFAULT 'link';
  ALTER TABLE "_virtual_tours_v" ADD COLUMN "version_display" "enum__virtual_tours_v_version_display" DEFAULT 'link';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "virtual_tours" DROP COLUMN "display";
  ALTER TABLE "_virtual_tours_v" DROP COLUMN "version_display";
  DROP TYPE "public"."enum_virtual_tours_display";
  DROP TYPE "public"."enum__virtual_tours_v_version_display";`)
}
