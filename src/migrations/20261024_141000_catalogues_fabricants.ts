import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "brands_catalogues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"document_id" integer
  );
  
  CREATE TABLE "brands_catalogues_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_brands_v_version_catalogues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"document_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_brands_v_version_catalogues_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "brands_catalogues" ADD CONSTRAINT "brands_catalogues_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_catalogues" ADD CONSTRAINT "brands_catalogues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_catalogues_locales" ADD CONSTRAINT "brands_catalogues_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_catalogues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_version_catalogues" ADD CONSTRAINT "_brands_v_version_catalogues_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v_version_catalogues" ADD CONSTRAINT "_brands_v_version_catalogues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_version_catalogues_locales" ADD CONSTRAINT "_brands_v_version_catalogues_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brands_v_version_catalogues"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "brands_catalogues_order_idx" ON "brands_catalogues" USING btree ("_order");
  CREATE INDEX "brands_catalogues_parent_id_idx" ON "brands_catalogues" USING btree ("_parent_id");
  CREATE INDEX "brands_catalogues_document_idx" ON "brands_catalogues" USING btree ("document_id");
  CREATE UNIQUE INDEX "brands_catalogues_locales_locale_parent_id_unique" ON "brands_catalogues_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_brands_v_version_catalogues_order_idx" ON "_brands_v_version_catalogues" USING btree ("_order");
  CREATE INDEX "_brands_v_version_catalogues_parent_id_idx" ON "_brands_v_version_catalogues" USING btree ("_parent_id");
  CREATE INDEX "_brands_v_version_catalogues_document_idx" ON "_brands_v_version_catalogues" USING btree ("document_id");
  CREATE UNIQUE INDEX "_brands_v_version_catalogues_locales_locale_parent_id_unique" ON "_brands_v_version_catalogues_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "brands_catalogues" CASCADE;
  DROP TABLE "brands_catalogues_locales" CASCADE;
  DROP TABLE "_brands_v_version_catalogues" CASCADE;
  DROP TABLE "_brands_v_version_catalogues_locales" CASCADE;`)
}
