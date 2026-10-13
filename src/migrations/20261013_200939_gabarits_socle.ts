import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_leads_kind" ADD VALUE 'newsletter';
  CREATE TABLE "listings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brands_image_id" integer,
  	"brands_sourcing_image_id" integer,
  	"projects_image_id" integer,
  	"tours_image_id" integer,
  	"news_image_id" integer,
  	"generator_image_id" integer,
  	"appointment_image_id" integer,
  	"contact_image_id" integer,
  	"pro_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "listings_locales" (
  	"brands_title" varchar,
  	"brands_lead" varchar,
  	"brands_sourcing_title" varchar,
  	"brands_sourcing_text" varchar,
  	"projects_title" varchar,
  	"projects_lead" varchar,
  	"tours_title" varchar,
  	"tours_lead" varchar,
  	"news_title" varchar,
  	"news_lead" varchar,
  	"generator_title" varchar,
  	"generator_lead" varchar,
  	"appointment_title" varchar,
  	"appointment_lead" varchar,
  	"contact_title" varchar,
  	"contact_lead" varchar,
  	"pro_title" varchar,
  	"pro_lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "home_locales" ADD COLUMN "manifesto_eyebrow" varchar;
  ALTER TABLE "home_locales" ADD COLUMN "manifesto_lead" varchar;
  ALTER TABLE "_home_v_locales" ADD COLUMN "version_manifesto_eyebrow" varchar;
  ALTER TABLE "_home_v_locales" ADD COLUMN "version_manifesto_lead" varchar;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_brands_image_id_media_id_fk" FOREIGN KEY ("brands_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_brands_sourcing_image_id_media_id_fk" FOREIGN KEY ("brands_sourcing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_projects_image_id_media_id_fk" FOREIGN KEY ("projects_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_tours_image_id_media_id_fk" FOREIGN KEY ("tours_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_news_image_id_media_id_fk" FOREIGN KEY ("news_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_generator_image_id_media_id_fk" FOREIGN KEY ("generator_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_appointment_image_id_media_id_fk" FOREIGN KEY ("appointment_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_contact_image_id_media_id_fk" FOREIGN KEY ("contact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings" ADD CONSTRAINT "listings_pro_image_id_media_id_fk" FOREIGN KEY ("pro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "listings_locales" ADD CONSTRAINT "listings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "listings_brands_brands_image_idx" ON "listings" USING btree ("brands_image_id");
  CREATE INDEX "listings_brands_sourcing_brands_sourcing_image_idx" ON "listings" USING btree ("brands_sourcing_image_id");
  CREATE INDEX "listings_projects_projects_image_idx" ON "listings" USING btree ("projects_image_id");
  CREATE INDEX "listings_tours_tours_image_idx" ON "listings" USING btree ("tours_image_id");
  CREATE INDEX "listings_news_news_image_idx" ON "listings" USING btree ("news_image_id");
  CREATE INDEX "listings_generator_generator_image_idx" ON "listings" USING btree ("generator_image_id");
  CREATE INDEX "listings_appointment_appointment_image_idx" ON "listings" USING btree ("appointment_image_id");
  CREATE INDEX "listings_contact_contact_image_idx" ON "listings" USING btree ("contact_image_id");
  CREATE INDEX "listings_pro_pro_image_idx" ON "listings" USING btree ("pro_image_id");
  CREATE UNIQUE INDEX "listings_locales_locale_parent_id_unique" ON "listings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "listings" CASCADE;
  DROP TABLE "listings_locales" CASCADE;
  ALTER TABLE "leads" ALTER COLUMN "kind" SET DATA TYPE text;
  ALTER TABLE "leads" ALTER COLUMN "kind" SET DEFAULT 'contact'::text;
  DROP TYPE "public"."enum_leads_kind";
  CREATE TYPE "public"."enum_leads_kind" AS ENUM('contact', 'quote', 'appointment', 'pro-access', 'sourcing');
  ALTER TABLE "leads" ALTER COLUMN "kind" SET DEFAULT 'contact'::"public"."enum_leads_kind";
  ALTER TABLE "leads" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_leads_kind" USING "kind"::"public"."enum_leads_kind";
  ALTER TABLE "home_locales" DROP COLUMN "manifesto_eyebrow";
  ALTER TABLE "home_locales" DROP COLUMN "manifesto_lead";
  ALTER TABLE "_home_v_locales" DROP COLUMN "version_manifesto_eyebrow";
  ALTER TABLE "_home_v_locales" DROP COLUMN "version_manifesto_lead";`)
}
