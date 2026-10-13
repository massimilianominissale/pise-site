import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_brands_universes" AS ENUM('furniture', 'lighting', 'outdoor', 'acoustics');
  CREATE TYPE "public"."enum_brands_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__brands_v_version_universes" AS ENUM('furniture', 'lighting', 'outdoor', 'acoustics');
  CREATE TYPE "public"."enum__brands_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__brands_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_ranges_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ranges_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ranges_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_virtual_tours_kind" AS ENUM('brand-showroom', 'pise-showroom', 'venue', 'trade-fair');
  CREATE TYPE "public"."enum_virtual_tours_availability" AS ENUM('live', 'soon');
  CREATE TYPE "public"."enum_virtual_tours_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__virtual_tours_v_version_kind" AS ENUM('brand-showroom', 'pise-showroom', 'venue', 'trade-fair');
  CREATE TYPE "public"."enum__virtual_tours_v_version_availability" AS ENUM('live', 'soon');
  CREATE TYPE "public"."enum__virtual_tours_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__virtual_tours_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_posts_categories" AS ENUM('new-products', 'trade-fairs', 'projects', 'agency', 'inspiration');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_categories" AS ENUM('new-products', 'trade-fairs', 'projects', 'agency', 'inspiration');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_pages_blocks_hero_cta_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_media_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_media_text_cta_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_cta_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_media_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_media_text_cta_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_faqs_topic" AS ENUM('general', 'products', 'delivery', 'pro', 'appointments');
  CREATE TYPE "public"."enum_announcements_format" AS ENUM('bar', 'popup');
  CREATE TYPE "public"."enum_announcements_tone" AS ENUM('ink', 'ocean');
  CREATE TYPE "public"."enum_announcements_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_announcements_targeting" AS ENUM('all', 'home', 'paths');
  CREATE TYPE "public"."enum_announcements_frequency" AS ENUM('session', 'once', 'always');
  CREATE TYPE "public"."enum_announcements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__announcements_v_version_format" AS ENUM('bar', 'popup');
  CREATE TYPE "public"."enum__announcements_v_version_tone" AS ENUM('ink', 'ocean');
  CREATE TYPE "public"."enum__announcements_v_version_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__announcements_v_version_targeting" AS ENUM('all', 'home', 'paths');
  CREATE TYPE "public"."enum__announcements_v_version_frequency" AS ENUM('session', 'once', 'always');
  CREATE TYPE "public"."enum__announcements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__announcements_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_documents_kind" AS ENUM('datasheet', 'catalogue', 'pricelist', 'cad', 'epd', 'manual', 'certificate', 'terms', 'other');
  CREATE TYPE "public"."enum_documents_access" AS ENUM('public', 'pro', 'internal');
  CREATE TYPE "public"."enum_documents_language" AS ENUM('fr', 'en', 'it', 'multi');
  CREATE TYPE "public"."enum_leads_kind" AS ENUM('contact', 'quote', 'appointment', 'pro-access', 'sourcing');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'in-progress', 'quoted', 'closed');
  CREATE TYPE "public"."enum_leads_profile" AS ENUM('architect', 'hospitality', 'company', 'reseller', 'other');
  CREATE TYPE "public"."enum_leads_appointment_format" AS ENUM('video', 'showroom', 'virtual-tour', 'factory');
  CREATE TYPE "public"."enum_customers_activity" AS ENUM('architect', 'hospitality', 'company', 'reseller');
  CREATE TYPE "public"."enum_customers_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'sales', 'ai');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_home_mosaic_size" AS ENUM('1x1', '2x1', '1x2', '2x2');
  CREATE TYPE "public"."enum_home_mosaic_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_version_mosaic_size" AS ENUM('1x1', '2x1', '1x2', '2x2');
  CREATE TYPE "public"."enum__home_v_version_mosaic_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_published_locale" AS ENUM('fr', 'en', 'it');
  CREATE TYPE "public"."enum_navigation_items_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_footer_legal_links_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_footer_banner_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_settings_socials_network" AS ENUM('instagram', 'linkedin', 'youtube', 'pinterest', 'facebook');
  CREATE TYPE "public"."enum_integrations_zoho_module" AS ENUM('crm', 'books', 'inventory');
  CREATE TYPE "public"."enum_integrations_calendar_provider" AS ENUM('none', 'google', 'microsoft', 'zoho-bookings', 'calcom');
  CREATE TABLE "brands_universes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_brands_universes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "brands_key_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "brands_key_figures_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"founded_year" numeric,
  	"website" varchar,
  	"logo_id" integer,
  	"logo_on_dark_id" integer,
  	"hero_image_id" integer,
  	"card_image_id" integer,
  	"slug" varchar,
  	"referent_id" integer,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_brands_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "brands_locales" (
  	"country" varchar,
  	"tagline" varchar,
  	"story" jsonb,
  	"certifications" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "brands_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sectors_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_brands_v_version_universes" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__brands_v_version_universes",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_brands_v_version_key_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_brands_v_version_key_figures_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_brands_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_founded_year" numeric,
  	"version_website" varchar,
  	"version_logo_id" integer,
  	"version_logo_on_dark_id" integer,
  	"version_hero_image_id" integer,
  	"version_card_image_id" integer,
  	"version_slug" varchar,
  	"version_referent_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__brands_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__brands_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_brands_v_locales" (
  	"version_country" varchar,
  	"version_tagline" varchar,
  	"version_story" jsonb,
  	"version_certifications" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_brands_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sectors_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "ranges" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"brand_id" integer,
  	"designer" varchar,
  	"year" numeric,
  	"hero_image_id" integer,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_ranges_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "ranges_locales" (
  	"summary" varchar,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ranges_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_ranges_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_brand_id" integer,
  	"version_designer" varchar,
  	"version_year" numeric,
  	"version_hero_image_id" integer,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__ranges_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__ranges_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_ranges_v_locales" (
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_ranges_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "products_finishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"swatch" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "products_finishes_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_specs_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"reference" varchar,
  	"brand_id" integer,
  	"range_id" integer,
  	"dimensions_width" numeric,
  	"dimensions_depth" numeric,
  	"dimensions_height" numeric,
  	"dimensions_seat_height" numeric,
  	"dimensions_diameter" numeric,
  	"weight" numeric,
  	"designer" varchar,
  	"stackable" boolean,
  	"indoor" boolean DEFAULT true,
  	"outdoor" boolean,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"short_description" varchar,
  	"description" jsonb,
  	"warranty" varchar,
  	"materials" varchar,
  	"certifications" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer,
  	"sectors_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"faqs_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_products_v_version_finishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"swatch" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_finishes_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_reference" varchar,
  	"version_brand_id" integer,
  	"version_range_id" integer,
  	"version_dimensions_width" numeric,
  	"version_dimensions_depth" numeric,
  	"version_dimensions_height" numeric,
  	"version_dimensions_seat_height" numeric,
  	"version_dimensions_diameter" numeric,
  	"version_weight" numeric,
  	"version_designer" varchar,
  	"version_stackable" boolean,
  	"version_indoor" boolean DEFAULT true,
  	"version_outdoor" boolean,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_warranty" varchar,
  	"version_materials" varchar,
  	"version_certifications" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_categories_id" integer,
  	"sectors_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"faqs_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"image_id" integer,
  	"slug" varchar,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_categories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "sectors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"slug" varchar,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sectors_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"city" varchar,
  	"year" numeric,
  	"region" varchar,
  	"cover_id" integer,
  	"virtual_tour_id" integer,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sectors_id" integer,
  	"media_id" integer,
  	"brands_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_client" varchar,
  	"version_city" varchar,
  	"version_year" numeric,
  	"version_region" varchar,
  	"version_cover_id" integer,
  	"version_virtual_tour_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sectors_id" integer,
  	"media_id" integer,
  	"brands_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "virtual_tours_rooms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"scene_id" varchar
  );
  
  CREATE TABLE "virtual_tours_rooms_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "virtual_tours" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_virtual_tours_kind" DEFAULT 'brand-showroom',
  	"availability" "enum_virtual_tours_availability" DEFAULT 'live',
  	"embed_url" varchar,
  	"location" varchar,
  	"credit" varchar DEFAULT 'IMRSIVO',
  	"thumbnail_id" integer,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_virtual_tours_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "virtual_tours_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "virtual_tours_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_virtual_tours_v_version_rooms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"scene_id" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_virtual_tours_v_version_rooms_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_virtual_tours_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_kind" "enum__virtual_tours_v_version_kind" DEFAULT 'brand-showroom',
  	"version_availability" "enum__virtual_tours_v_version_availability" DEFAULT 'live',
  	"version_embed_url" varchar,
  	"version_location" varchar,
  	"version_credit" varchar DEFAULT 'IMRSIVO',
  	"version_thumbnail_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__virtual_tours_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__virtual_tours_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_virtual_tours_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_virtual_tours_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"city" varchar,
  	"venue" varchar,
  	"booth" varchar,
  	"address" varchar,
  	"image_id" integer,
  	"website" varchar,
  	"registration_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_locales" (
  	"name" varchar,
  	"summary" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_city" varchar,
  	"version_venue" varchar,
  	"version_booth" varchar,
  	"version_address" varchar,
  	"version_image_id" integer,
  	"version_website" varchar,
  	"version_registration_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_name" varchar,
  	"version_summary" varchar,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer
  );
  
  CREATE TABLE "posts_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_posts_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer,
  	"event_id" integer,
  	"project_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"author_id" integer,
  	"ai_generated" boolean,
  	"ai_sources" varchar,
  	"ai_reviewed" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_posts_v_version_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__posts_v_version_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_id" integer,
  	"version_event_id" integer,
  	"version_project_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author_id" integer,
  	"version_ai_generated" boolean,
  	"version_ai_sources" varchar,
  	"version_ai_reviewed" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_type" "enum_pages_blocks_hero_cta_type" DEFAULT 'internal',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_locales" (
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_media_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_media_text_image_position" DEFAULT 'left',
  	"cta_type" "enum_pages_blocks_media_text_cta_type" DEFAULT 'internal',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_text_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"virtual_tours_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"cta_type" "enum__pages_v_blocks_hero_cta_type" DEFAULT 'internal',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"lead" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_locales" (
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_media_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_media_text_image_position" DEFAULT 'left',
  	"cta_type" "enum__pages_v_blocks_media_text_cta_type" DEFAULT 'internal',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_text_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"virtual_tours_id" integer,
  	"events_id" integer,
  	"media_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"topic" "enum_faqs_topic" DEFAULT 'general',
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer
  );
  
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"format" "enum_announcements_format" DEFAULT 'bar',
  	"tone" "enum_announcements_tone" DEFAULT 'ink',
  	"image_id" integer,
  	"link_type" "enum_announcements_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"targeting" "enum_announcements_targeting" DEFAULT 'all',
  	"frequency" "enum_announcements_frequency" DEFAULT 'session',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_announcements_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "announcements_locales" (
  	"message" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "announcements_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "announcements_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"virtual_tours_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "_announcements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_name" varchar,
  	"version_format" "enum__announcements_v_version_format" DEFAULT 'bar',
  	"version_tone" "enum__announcements_v_version_tone" DEFAULT 'ink',
  	"version_image_id" integer,
  	"version_link_type" "enum__announcements_v_version_link_type" DEFAULT 'internal',
  	"version_link_new_tab" boolean,
  	"version_link_url" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_targeting" "enum__announcements_v_version_targeting" DEFAULT 'all',
  	"version_frequency" "enum__announcements_v_version_frequency" DEFAULT 'session',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__announcements_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__announcements_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_announcements_v_locales" (
  	"version_message" varchar,
  	"version_body" varchar,
  	"version_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_announcements_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_announcements_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"virtual_tours_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"photo_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"showroom_id" integer,
  	"bookable" boolean DEFAULT true,
  	"calendar_id" varchar,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members_locales" (
  	"job_title" varchar,
  	"zone" varchar,
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team_members_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer
  );
  
  CREATE TABLE "showrooms_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hours" varchar NOT NULL
  );
  
  CREATE TABLE "showrooms_opening_hours_locales" (
  	"days" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "showrooms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address_street" varchar,
  	"address_postal_code" varchar,
  	"address_city" varchar,
  	"address_country" varchar DEFAULT 'France',
  	"address_latitude" numeric,
  	"address_longitude" numeric,
  	"phone" varchar,
  	"email" varchar,
  	"virtual_tour_id" integer,
  	"slug" varchar,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "showrooms_locales" (
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "showrooms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_documents_kind" DEFAULT 'datasheet' NOT NULL,
  	"access" "enum_documents_access" DEFAULT 'public' NOT NULL,
  	"brand_id" integer,
  	"language" "enum_documents_language" DEFAULT 'fr',
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "documents_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"summary" varchar,
  	"kind" "enum_leads_kind" DEFAULT 'contact' NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"profile" "enum_leads_profile",
  	"project_place_type" varchar,
  	"project_region" varchar,
  	"project_deadline" varchar,
  	"project_quantities" varchar,
  	"message" varchar,
  	"appointment_format" "enum_leads_appointment_format",
  	"appointment_member_id" integer,
  	"appointment_starts_at" timestamp(3) with time zone,
  	"consent" boolean DEFAULT false NOT NULL,
  	"newsletter" boolean,
  	"source_page" varchar,
  	"locale" varchar,
  	"zoho_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer,
  	"products_id" integer,
  	"documents_id" integer
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"siret" varchar,
  	"activity" "enum_customers_activity",
  	"job_title" varchar,
  	"phone" varchar,
  	"website" varchar,
  	"status" "enum_customers_status" DEFAULT 'pending' NOT NULL,
  	"referent_id" integer,
  	"zoho_account_id" varchar,
  	"kbis_sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"pages_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "home_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"brand_id" integer,
  	"range_id" integer,
  	"size" "enum_home_mosaic_size" DEFAULT '1x1',
  	"is_new" boolean,
  	"pulse" boolean,
  	"link_type" "enum_home_mosaic_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "home_mosaic_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_generator_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_generator_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generator_image_id" integer,
  	"appointments_image_id" integer,
  	"_status" "enum_home_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"manifesto" varchar,
  	"generator_title" varchar,
  	"generator_text" varchar,
  	"imrsivo_title" varchar,
  	"imrsivo_text" varchar,
  	"appointments_title" varchar,
  	"appointments_text" varchar,
  	"newsletter_title" varchar,
  	"newsletter_text" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"virtual_tours_id" integer,
  	"events_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_home_v_version_mosaic" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"brand_id" integer,
  	"range_id" integer,
  	"size" "enum__home_v_version_mosaic_size" DEFAULT '1x1',
  	"is_new" boolean,
  	"pulse" boolean,
  	"link_type" "enum__home_v_version_mosaic_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_mosaic_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_generator_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_generator_steps_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_generator_image_id" integer,
  	"version_appointments_image_id" integer,
  	"version__status" "enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_home_v_locales" (
  	"version_manifesto" varchar,
  	"version_generator_title" varchar,
  	"version_generator_text" varchar,
  	"version_imrsivo_title" varchar,
  	"version_imrsivo_text" varchar,
  	"version_appointments_title" varchar,
  	"version_appointments_text" varchar,
  	"version_newsletter_title" varchar,
  	"version_newsletter_text" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"virtual_tours_id" integer,
  	"events_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_items_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "navigation_items_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"pro_label" varchar DEFAULT 'Espace pro',
  	"appointment_label" varchar DEFAULT 'Rendez-vous',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"virtual_tours_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_columns_links_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_legal_links_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_legal_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"banner_link_type" "enum_footer_banner_link_type" DEFAULT 'internal',
  	"banner_link_new_tab" boolean,
  	"banner_link_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"banner_text" varchar DEFAULT 'Visitez nos espaces virtuels',
  	"banner_credit" varchar DEFAULT 'Réalisés par IMRSIVO',
  	"tagline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"brands_id" integer,
  	"ranges_id" integer,
  	"products_id" integer,
  	"projects_id" integer,
  	"posts_id" integer,
  	"virtual_tours_id" integer,
  	"events_id" integer
  );
  
  CREATE TABLE "settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_settings_socials_network" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Agence PISE' NOT NULL,
  	"legal_name" varchar,
  	"founding_year" numeric,
  	"default_share_image_id" integer,
  	"contact_street" varchar,
  	"contact_postal_code" varchar,
  	"contact_city" varchar,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"allow_ai_search_bots" boolean DEFAULT true,
  	"allow_ai_training_bots" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_locales" (
  	"description" varchar,
  	"contact_response_time" varchar DEFAULT '24 h ouvrées',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "integrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mobilia_enabled" boolean DEFAULT false,
  	"mobilia_embed_url" varchar,
  	"zoho_enabled" boolean DEFAULT false,
  	"zoho_module" "enum_integrations_zoho_module",
  	"calendar_provider" "enum_integrations_calendar_provider" DEFAULT 'none',
  	"chatbot_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "integrations_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "media" ADD COLUMN "credit" varchar;
  ALTER TABLE "media" ADD COLUMN "brand_id" integer;
  ALTER TABLE "media_locales" ADD COLUMN "caption" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "brands_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ranges_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sectors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "virtual_tours_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "announcements_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "showrooms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "brands_universes" ADD CONSTRAINT "brands_universes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_key_figures" ADD CONSTRAINT "brands_key_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_key_figures_locales" ADD CONSTRAINT "brands_key_figures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_key_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_on_dark_id_media_id_fk" FOREIGN KEY ("logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_referent_id_team_members_id_fk" FOREIGN KEY ("referent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_locales" ADD CONSTRAINT "brands_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_locales" ADD CONSTRAINT "brands_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_version_universes" ADD CONSTRAINT "_brands_v_version_universes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_version_key_figures" ADD CONSTRAINT "_brands_v_version_key_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_version_key_figures_locales" ADD CONSTRAINT "_brands_v_version_key_figures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brands_v_version_key_figures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_parent_id_brands_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_logo_on_dark_id_media_id_fk" FOREIGN KEY ("version_logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_card_image_id_media_id_fk" FOREIGN KEY ("version_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_referent_id_team_members_id_fk" FOREIGN KEY ("version_referent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v_locales" ADD CONSTRAINT "_brands_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v_locales" ADD CONSTRAINT "_brands_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_rels" ADD CONSTRAINT "_brands_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_rels" ADD CONSTRAINT "_brands_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_rels" ADD CONSTRAINT "_brands_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ranges" ADD CONSTRAINT "ranges_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ranges" ADD CONSTRAINT "ranges_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ranges_locales" ADD CONSTRAINT "ranges_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ranges_locales" ADD CONSTRAINT "ranges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ranges_rels" ADD CONSTRAINT "ranges_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ranges_rels" ADD CONSTRAINT "ranges_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ranges_v" ADD CONSTRAINT "_ranges_v_parent_id_ranges_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ranges"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ranges_v" ADD CONSTRAINT "_ranges_v_version_brand_id_brands_id_fk" FOREIGN KEY ("version_brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ranges_v" ADD CONSTRAINT "_ranges_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ranges_v_locales" ADD CONSTRAINT "_ranges_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ranges_v_locales" ADD CONSTRAINT "_ranges_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ranges_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ranges_v_rels" ADD CONSTRAINT "_ranges_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_ranges_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ranges_v_rels" ADD CONSTRAINT "_ranges_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_finishes" ADD CONSTRAINT "products_finishes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_finishes" ADD CONSTRAINT "products_finishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_finishes_locales" ADD CONSTRAINT "products_finishes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_finishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs" ADD CONSTRAINT "products_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_locales" ADD CONSTRAINT "products_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_finishes" ADD CONSTRAINT "_products_v_version_finishes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_finishes" ADD CONSTRAINT "_products_v_version_finishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_finishes_locales" ADD CONSTRAINT "_products_v_version_finishes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_finishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs" ADD CONSTRAINT "_products_v_version_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_locales" ADD CONSTRAINT "_products_v_version_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_brand_id_brands_id_fk" FOREIGN KEY ("version_brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_range_id_ranges_id_fk" FOREIGN KEY ("version_range_id") REFERENCES "public"."ranges"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sectors" ADD CONSTRAINT "sectors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sectors_locales" ADD CONSTRAINT "sectors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_virtual_tour_id_virtual_tours_id_fk" FOREIGN KEY ("virtual_tour_id") REFERENCES "public"."virtual_tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_virtual_tour_id_virtual_tours_id_fk" FOREIGN KEY ("version_virtual_tour_id") REFERENCES "public"."virtual_tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "virtual_tours_rooms" ADD CONSTRAINT "virtual_tours_rooms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "virtual_tours_rooms_locales" ADD CONSTRAINT "virtual_tours_rooms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."virtual_tours_rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "virtual_tours" ADD CONSTRAINT "virtual_tours_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "virtual_tours_locales" ADD CONSTRAINT "virtual_tours_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "virtual_tours_locales" ADD CONSTRAINT "virtual_tours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "virtual_tours_rels" ADD CONSTRAINT "virtual_tours_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "virtual_tours_rels" ADD CONSTRAINT "virtual_tours_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "virtual_tours_rels" ADD CONSTRAINT "virtual_tours_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v_version_rooms" ADD CONSTRAINT "_virtual_tours_v_version_rooms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_virtual_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v_version_rooms_locales" ADD CONSTRAINT "_virtual_tours_v_version_rooms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_virtual_tours_v_version_rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v" ADD CONSTRAINT "_virtual_tours_v_parent_id_virtual_tours_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."virtual_tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v" ADD CONSTRAINT "_virtual_tours_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v_locales" ADD CONSTRAINT "_virtual_tours_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v_locales" ADD CONSTRAINT "_virtual_tours_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_virtual_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v_rels" ADD CONSTRAINT "_virtual_tours_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_virtual_tours_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v_rels" ADD CONSTRAINT "_virtual_tours_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_virtual_tours_v_rels" ADD CONSTRAINT "_virtual_tours_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_categories" ADD CONSTRAINT "posts_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_team_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_categories" ADD CONSTRAINT "_posts_v_version_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_team_members_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_locales" ADD CONSTRAINT "pages_blocks_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text" ADD CONSTRAINT "pages_blocks_media_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text" ADD CONSTRAINT "pages_blocks_media_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text_locales" ADD CONSTRAINT "pages_blocks_media_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links_locales" ADD CONSTRAINT "pages_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD CONSTRAINT "_pages_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_locales" ADD CONSTRAINT "_pages_v_blocks_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_text" ADD CONSTRAINT "_pages_v_blocks_media_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_text" ADD CONSTRAINT "_pages_v_blocks_media_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_text_locales" ADD CONSTRAINT "_pages_v_blocks_media_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links_locales" ADD CONSTRAINT "_pages_v_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements_locales" ADD CONSTRAINT "announcements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_texts" ADD CONSTRAINT "announcements_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_parent_id_announcements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v_locales" ADD CONSTRAINT "_announcements_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_announcements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_texts" ADD CONSTRAINT "_announcements_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_announcements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_announcements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_showroom_id_showrooms_id_fk" FOREIGN KEY ("showroom_id") REFERENCES "public"."showrooms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members_locales" ADD CONSTRAINT "team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_rels" ADD CONSTRAINT "team_members_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_rels" ADD CONSTRAINT "team_members_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "showrooms_opening_hours" ADD CONSTRAINT "showrooms_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."showrooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "showrooms_opening_hours_locales" ADD CONSTRAINT "showrooms_opening_hours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."showrooms_opening_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "showrooms" ADD CONSTRAINT "showrooms_virtual_tour_id_virtual_tours_id_fk" FOREIGN KEY ("virtual_tour_id") REFERENCES "public"."virtual_tours"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "showrooms_locales" ADD CONSTRAINT "showrooms_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "showrooms_locales" ADD CONSTRAINT "showrooms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."showrooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "showrooms_rels" ADD CONSTRAINT "showrooms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."showrooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "showrooms_rels" ADD CONSTRAINT "showrooms_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "showrooms_rels" ADD CONSTRAINT "showrooms_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents_locales" ADD CONSTRAINT "documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_appointment_member_id_team_members_id_fk" FOREIGN KEY ("appointment_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_referent_id_team_members_id_fk" FOREIGN KEY ("referent_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_mosaic" ADD CONSTRAINT "home_mosaic_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_mosaic" ADD CONSTRAINT "home_mosaic_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_mosaic" ADD CONSTRAINT "home_mosaic_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_mosaic" ADD CONSTRAINT "home_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_mosaic_locales" ADD CONSTRAINT "home_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_generator_steps" ADD CONSTRAINT "home_generator_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_generator_steps_locales" ADD CONSTRAINT "home_generator_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_generator_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_generator_image_id_media_id_fk" FOREIGN KEY ("generator_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_appointments_image_id_media_id_fk" FOREIGN KEY ("appointments_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_mosaic" ADD CONSTRAINT "_home_v_version_mosaic_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_mosaic" ADD CONSTRAINT "_home_v_version_mosaic_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_mosaic" ADD CONSTRAINT "_home_v_version_mosaic_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_version_mosaic" ADD CONSTRAINT "_home_v_version_mosaic_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_mosaic_locales" ADD CONSTRAINT "_home_v_version_mosaic_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_mosaic"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_generator_steps" ADD CONSTRAINT "_home_v_version_generator_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_generator_steps_locales" ADD CONSTRAINT "_home_v_version_generator_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_generator_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_generator_image_id_media_id_fk" FOREIGN KEY ("version_generator_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_appointments_image_id_media_id_fk" FOREIGN KEY ("version_appointments_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_locales" ADD CONSTRAINT "_home_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_locales" ADD CONSTRAINT "_home_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items_locales" ADD CONSTRAINT "navigation_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_socials" ADD CONSTRAINT "settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_default_share_image_id_media_id_fk" FOREIGN KEY ("default_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_locales" ADD CONSTRAINT "settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "integrations_texts" ADD CONSTRAINT "integrations_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."integrations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "brands_universes_order_idx" ON "brands_universes" USING btree ("order");
  CREATE INDEX "brands_universes_parent_idx" ON "brands_universes" USING btree ("parent_id");
  CREATE INDEX "brands_key_figures_order_idx" ON "brands_key_figures" USING btree ("_order");
  CREATE INDEX "brands_key_figures_parent_id_idx" ON "brands_key_figures" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_key_figures_locales_locale_parent_id_unique" ON "brands_key_figures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_logo_on_dark_idx" ON "brands" USING btree ("logo_on_dark_id");
  CREATE INDEX "brands_hero_image_idx" ON "brands" USING btree ("hero_image_id");
  CREATE INDEX "brands_card_image_idx" ON "brands" USING btree ("card_image_id");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_referent_idx" ON "brands" USING btree ("referent_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "brands__status_idx" ON "brands" USING btree ("_status");
  CREATE INDEX "brands_meta_meta_image_idx" ON "brands_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "brands_locales_locale_parent_id_unique" ON "brands_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_rels_order_idx" ON "brands_rels" USING btree ("order");
  CREATE INDEX "brands_rels_parent_idx" ON "brands_rels" USING btree ("parent_id");
  CREATE INDEX "brands_rels_path_idx" ON "brands_rels" USING btree ("path");
  CREATE INDEX "brands_rels_sectors_id_idx" ON "brands_rels" USING btree ("sectors_id");
  CREATE INDEX "brands_rels_media_id_idx" ON "brands_rels" USING btree ("media_id");
  CREATE INDEX "_brands_v_version_universes_order_idx" ON "_brands_v_version_universes" USING btree ("order");
  CREATE INDEX "_brands_v_version_universes_parent_idx" ON "_brands_v_version_universes" USING btree ("parent_id");
  CREATE INDEX "_brands_v_version_key_figures_order_idx" ON "_brands_v_version_key_figures" USING btree ("_order");
  CREATE INDEX "_brands_v_version_key_figures_parent_id_idx" ON "_brands_v_version_key_figures" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_brands_v_version_key_figures_locales_locale_parent_id_uniqu" ON "_brands_v_version_key_figures_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_brands_v_parent_idx" ON "_brands_v" USING btree ("parent_id");
  CREATE INDEX "_brands_v_version_version_logo_idx" ON "_brands_v" USING btree ("version_logo_id");
  CREATE INDEX "_brands_v_version_version_logo_on_dark_idx" ON "_brands_v" USING btree ("version_logo_on_dark_id");
  CREATE INDEX "_brands_v_version_version_hero_image_idx" ON "_brands_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_brands_v_version_version_card_image_idx" ON "_brands_v" USING btree ("version_card_image_id");
  CREATE INDEX "_brands_v_version_version_slug_idx" ON "_brands_v" USING btree ("version_slug");
  CREATE INDEX "_brands_v_version_version_referent_idx" ON "_brands_v" USING btree ("version_referent_id");
  CREATE INDEX "_brands_v_version_version_updated_at_idx" ON "_brands_v" USING btree ("version_updated_at");
  CREATE INDEX "_brands_v_version_version_created_at_idx" ON "_brands_v" USING btree ("version_created_at");
  CREATE INDEX "_brands_v_version_version__status_idx" ON "_brands_v" USING btree ("version__status");
  CREATE INDEX "_brands_v_created_at_idx" ON "_brands_v" USING btree ("created_at");
  CREATE INDEX "_brands_v_updated_at_idx" ON "_brands_v" USING btree ("updated_at");
  CREATE INDEX "_brands_v_snapshot_idx" ON "_brands_v" USING btree ("snapshot");
  CREATE INDEX "_brands_v_published_locale_idx" ON "_brands_v" USING btree ("published_locale");
  CREATE INDEX "_brands_v_latest_idx" ON "_brands_v" USING btree ("latest");
  CREATE INDEX "_brands_v_version_meta_version_meta_image_idx" ON "_brands_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_brands_v_locales_locale_parent_id_unique" ON "_brands_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_brands_v_rels_order_idx" ON "_brands_v_rels" USING btree ("order");
  CREATE INDEX "_brands_v_rels_parent_idx" ON "_brands_v_rels" USING btree ("parent_id");
  CREATE INDEX "_brands_v_rels_path_idx" ON "_brands_v_rels" USING btree ("path");
  CREATE INDEX "_brands_v_rels_sectors_id_idx" ON "_brands_v_rels" USING btree ("sectors_id");
  CREATE INDEX "_brands_v_rels_media_id_idx" ON "_brands_v_rels" USING btree ("media_id");
  CREATE INDEX "ranges_brand_idx" ON "ranges" USING btree ("brand_id");
  CREATE INDEX "ranges_hero_image_idx" ON "ranges" USING btree ("hero_image_id");
  CREATE INDEX "ranges_slug_idx" ON "ranges" USING btree ("slug");
  CREATE INDEX "ranges_updated_at_idx" ON "ranges" USING btree ("updated_at");
  CREATE INDEX "ranges_created_at_idx" ON "ranges" USING btree ("created_at");
  CREATE INDEX "ranges__status_idx" ON "ranges" USING btree ("_status");
  CREATE UNIQUE INDEX "brand_slug_idx" ON "ranges" USING btree ("brand_id","slug");
  CREATE INDEX "ranges_meta_meta_image_idx" ON "ranges_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "ranges_locales_locale_parent_id_unique" ON "ranges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ranges_rels_order_idx" ON "ranges_rels" USING btree ("order");
  CREATE INDEX "ranges_rels_parent_idx" ON "ranges_rels" USING btree ("parent_id");
  CREATE INDEX "ranges_rels_path_idx" ON "ranges_rels" USING btree ("path");
  CREATE INDEX "ranges_rels_media_id_idx" ON "ranges_rels" USING btree ("media_id");
  CREATE INDEX "_ranges_v_parent_idx" ON "_ranges_v" USING btree ("parent_id");
  CREATE INDEX "_ranges_v_version_version_brand_idx" ON "_ranges_v" USING btree ("version_brand_id");
  CREATE INDEX "_ranges_v_version_version_hero_image_idx" ON "_ranges_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_ranges_v_version_version_slug_idx" ON "_ranges_v" USING btree ("version_slug");
  CREATE INDEX "_ranges_v_version_version_updated_at_idx" ON "_ranges_v" USING btree ("version_updated_at");
  CREATE INDEX "_ranges_v_version_version_created_at_idx" ON "_ranges_v" USING btree ("version_created_at");
  CREATE INDEX "_ranges_v_version_version__status_idx" ON "_ranges_v" USING btree ("version__status");
  CREATE INDEX "_ranges_v_created_at_idx" ON "_ranges_v" USING btree ("created_at");
  CREATE INDEX "_ranges_v_updated_at_idx" ON "_ranges_v" USING btree ("updated_at");
  CREATE INDEX "_ranges_v_snapshot_idx" ON "_ranges_v" USING btree ("snapshot");
  CREATE INDEX "_ranges_v_published_locale_idx" ON "_ranges_v" USING btree ("published_locale");
  CREATE INDEX "_ranges_v_latest_idx" ON "_ranges_v" USING btree ("latest");
  CREATE INDEX "version_brand_version_slug_idx" ON "_ranges_v" USING btree ("version_brand_id","version_slug");
  CREATE INDEX "_ranges_v_version_meta_version_meta_image_idx" ON "_ranges_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_ranges_v_locales_locale_parent_id_unique" ON "_ranges_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_ranges_v_rels_order_idx" ON "_ranges_v_rels" USING btree ("order");
  CREATE INDEX "_ranges_v_rels_parent_idx" ON "_ranges_v_rels" USING btree ("parent_id");
  CREATE INDEX "_ranges_v_rels_path_idx" ON "_ranges_v_rels" USING btree ("path");
  CREATE INDEX "_ranges_v_rels_media_id_idx" ON "_ranges_v_rels" USING btree ("media_id");
  CREATE INDEX "products_finishes_order_idx" ON "products_finishes" USING btree ("_order");
  CREATE INDEX "products_finishes_parent_id_idx" ON "products_finishes" USING btree ("_parent_id");
  CREATE INDEX "products_finishes_image_idx" ON "products_finishes" USING btree ("image_id");
  CREATE UNIQUE INDEX "products_finishes_locales_locale_parent_id_unique" ON "products_finishes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specs_order_idx" ON "products_specs" USING btree ("_order");
  CREATE INDEX "products_specs_parent_id_idx" ON "products_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specs_locales_locale_parent_id_unique" ON "products_specs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "products_reference_idx" ON "products" USING btree ("reference");
  CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");
  CREATE INDEX "products_range_idx" ON "products" USING btree ("range_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_product_categories_id_idx" ON "products_rels" USING btree ("product_categories_id");
  CREATE INDEX "products_rels_sectors_id_idx" ON "products_rels" USING btree ("sectors_id");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "products_rels_documents_id_idx" ON "products_rels" USING btree ("documents_id");
  CREATE INDEX "products_rels_faqs_id_idx" ON "products_rels" USING btree ("faqs_id");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_version_finishes_order_idx" ON "_products_v_version_finishes" USING btree ("_order");
  CREATE INDEX "_products_v_version_finishes_parent_id_idx" ON "_products_v_version_finishes" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_finishes_image_idx" ON "_products_v_version_finishes" USING btree ("image_id");
  CREATE UNIQUE INDEX "_products_v_version_finishes_locales_locale_parent_id_unique" ON "_products_v_version_finishes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specs_order_idx" ON "_products_v_version_specs" USING btree ("_order");
  CREATE INDEX "_products_v_version_specs_parent_id_idx" ON "_products_v_version_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_specs_locales_locale_parent_id_unique" ON "_products_v_version_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_reference_idx" ON "_products_v" USING btree ("version_reference");
  CREATE INDEX "_products_v_version_version_brand_idx" ON "_products_v" USING btree ("version_brand_id");
  CREATE INDEX "_products_v_version_version_range_idx" ON "_products_v" USING btree ("version_range_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_product_categories_id_idx" ON "_products_v_rels" USING btree ("product_categories_id");
  CREATE INDEX "_products_v_rels_sectors_id_idx" ON "_products_v_rels" USING btree ("sectors_id");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_rels_documents_id_idx" ON "_products_v_rels" USING btree ("documents_id");
  CREATE INDEX "_products_v_rels_faqs_id_idx" ON "_products_v_rels" USING btree ("faqs_id");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE INDEX "product_categories_parent_idx" ON "product_categories" USING btree ("parent_id");
  CREATE INDEX "product_categories_image_idx" ON "product_categories" USING btree ("image_id");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "sectors_image_idx" ON "sectors" USING btree ("image_id");
  CREATE UNIQUE INDEX "sectors_slug_idx" ON "sectors" USING btree ("slug");
  CREATE INDEX "sectors_updated_at_idx" ON "sectors" USING btree ("updated_at");
  CREATE INDEX "sectors_created_at_idx" ON "sectors" USING btree ("created_at");
  CREATE UNIQUE INDEX "sectors_locales_locale_parent_id_unique" ON "sectors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_virtual_tour_idx" ON "projects" USING btree ("virtual_tour_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects_locales" USING btree ("slug","_locale");
  CREATE INDEX "projects_meta_meta_image_idx" ON "projects_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_sectors_id_idx" ON "projects_rels" USING btree ("sectors_id");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "projects_rels_brands_id_idx" ON "projects_rels" USING btree ("brands_id");
  CREATE INDEX "projects_rels_products_id_idx" ON "projects_rels" USING btree ("products_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_version_virtual_tour_idx" ON "_projects_v" USING btree ("version_virtual_tour_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_projects_v_version_meta_version_meta_image_idx" ON "_projects_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_sectors_id_idx" ON "_projects_v_rels" USING btree ("sectors_id");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_rels_brands_id_idx" ON "_projects_v_rels" USING btree ("brands_id");
  CREATE INDEX "_projects_v_rels_products_id_idx" ON "_projects_v_rels" USING btree ("products_id");
  CREATE INDEX "virtual_tours_rooms_order_idx" ON "virtual_tours_rooms" USING btree ("_order");
  CREATE INDEX "virtual_tours_rooms_parent_id_idx" ON "virtual_tours_rooms" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "virtual_tours_rooms_locales_locale_parent_id_unique" ON "virtual_tours_rooms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "virtual_tours_thumbnail_idx" ON "virtual_tours" USING btree ("thumbnail_id");
  CREATE INDEX "virtual_tours_updated_at_idx" ON "virtual_tours" USING btree ("updated_at");
  CREATE INDEX "virtual_tours_created_at_idx" ON "virtual_tours" USING btree ("created_at");
  CREATE INDEX "virtual_tours__status_idx" ON "virtual_tours" USING btree ("_status");
  CREATE UNIQUE INDEX "virtual_tours_slug_idx" ON "virtual_tours_locales" USING btree ("slug","_locale");
  CREATE INDEX "virtual_tours_meta_meta_image_idx" ON "virtual_tours_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "virtual_tours_locales_locale_parent_id_unique" ON "virtual_tours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "virtual_tours_rels_order_idx" ON "virtual_tours_rels" USING btree ("order");
  CREATE INDEX "virtual_tours_rels_parent_idx" ON "virtual_tours_rels" USING btree ("parent_id");
  CREATE INDEX "virtual_tours_rels_path_idx" ON "virtual_tours_rels" USING btree ("path");
  CREATE INDEX "virtual_tours_rels_brands_id_idx" ON "virtual_tours_rels" USING btree ("brands_id");
  CREATE INDEX "virtual_tours_rels_products_id_idx" ON "virtual_tours_rels" USING btree ("products_id");
  CREATE INDEX "_virtual_tours_v_version_rooms_order_idx" ON "_virtual_tours_v_version_rooms" USING btree ("_order");
  CREATE INDEX "_virtual_tours_v_version_rooms_parent_id_idx" ON "_virtual_tours_v_version_rooms" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_virtual_tours_v_version_rooms_locales_locale_parent_id_uniq" ON "_virtual_tours_v_version_rooms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_virtual_tours_v_parent_idx" ON "_virtual_tours_v" USING btree ("parent_id");
  CREATE INDEX "_virtual_tours_v_version_version_thumbnail_idx" ON "_virtual_tours_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_virtual_tours_v_version_version_updated_at_idx" ON "_virtual_tours_v" USING btree ("version_updated_at");
  CREATE INDEX "_virtual_tours_v_version_version_created_at_idx" ON "_virtual_tours_v" USING btree ("version_created_at");
  CREATE INDEX "_virtual_tours_v_version_version__status_idx" ON "_virtual_tours_v" USING btree ("version__status");
  CREATE INDEX "_virtual_tours_v_created_at_idx" ON "_virtual_tours_v" USING btree ("created_at");
  CREATE INDEX "_virtual_tours_v_updated_at_idx" ON "_virtual_tours_v" USING btree ("updated_at");
  CREATE INDEX "_virtual_tours_v_snapshot_idx" ON "_virtual_tours_v" USING btree ("snapshot");
  CREATE INDEX "_virtual_tours_v_published_locale_idx" ON "_virtual_tours_v" USING btree ("published_locale");
  CREATE INDEX "_virtual_tours_v_latest_idx" ON "_virtual_tours_v" USING btree ("latest");
  CREATE INDEX "_virtual_tours_v_version_version_slug_idx" ON "_virtual_tours_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_virtual_tours_v_version_meta_version_meta_image_idx" ON "_virtual_tours_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_virtual_tours_v_locales_locale_parent_id_unique" ON "_virtual_tours_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_virtual_tours_v_rels_order_idx" ON "_virtual_tours_v_rels" USING btree ("order");
  CREATE INDEX "_virtual_tours_v_rels_parent_idx" ON "_virtual_tours_v_rels" USING btree ("parent_id");
  CREATE INDEX "_virtual_tours_v_rels_path_idx" ON "_virtual_tours_v_rels" USING btree ("path");
  CREATE INDEX "_virtual_tours_v_rels_brands_id_idx" ON "_virtual_tours_v_rels" USING btree ("brands_id");
  CREATE INDEX "_virtual_tours_v_rels_products_id_idx" ON "_virtual_tours_v_rels" USING btree ("products_id");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events_locales" USING btree ("slug","_locale");
  CREATE INDEX "events_meta_meta_image_idx" ON "events_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_brands_id_idx" ON "events_rels" USING btree ("brands_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_events_v_version_meta_version_meta_image_idx" ON "_events_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_brands_id_idx" ON "_events_v_rels" USING btree ("brands_id");
  CREATE INDEX "posts_categories_order_idx" ON "posts_categories" USING btree ("order");
  CREATE INDEX "posts_categories_parent_idx" ON "posts_categories" USING btree ("parent_id");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_event_idx" ON "posts" USING btree ("event_id");
  CREATE INDEX "posts_project_idx" ON "posts" USING btree ("project_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts_locales" USING btree ("slug","_locale");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_brands_id_idx" ON "posts_rels" USING btree ("brands_id");
  CREATE INDEX "posts_rels_products_id_idx" ON "posts_rels" USING btree ("products_id");
  CREATE INDEX "_posts_v_version_categories_order_idx" ON "_posts_v_version_categories" USING btree ("order");
  CREATE INDEX "_posts_v_version_categories_parent_idx" ON "_posts_v_version_categories" USING btree ("parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_event_idx" ON "_posts_v" USING btree ("version_event_id");
  CREATE INDEX "_posts_v_version_version_project_idx" ON "_posts_v" USING btree ("version_project_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_brands_id_idx" ON "_posts_v_rels" USING btree ("brands_id");
  CREATE INDEX "_posts_v_rels_products_id_idx" ON "_posts_v_rels" USING btree ("products_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_content_locales_locale_parent_id_unique" ON "pages_blocks_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_media_text_order_idx" ON "pages_blocks_media_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_text_parent_id_idx" ON "pages_blocks_media_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_text_path_idx" ON "pages_blocks_media_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_text_image_idx" ON "pages_blocks_media_text" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_media_text_locales_locale_parent_id_unique" ON "pages_blocks_media_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_links_locales_locale_parent_id_unique" ON "pages_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_brands_id_idx" ON "pages_rels" USING btree ("brands_id");
  CREATE INDEX "pages_rels_ranges_id_idx" ON "pages_rels" USING btree ("ranges_id");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX "pages_rels_projects_id_idx" ON "pages_rels" USING btree ("projects_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_virtual_tours_id_idx" ON "pages_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "pages_rels_events_id_idx" ON "pages_rels" USING btree ("events_id");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "pages_rels_faqs_id_idx" ON "pages_rels" USING btree ("faqs_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_content_locales_locale_parent_id_unique" ON "_pages_v_blocks_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_media_text_order_idx" ON "_pages_v_blocks_media_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_text_parent_id_idx" ON "_pages_v_blocks_media_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_text_path_idx" ON "_pages_v_blocks_media_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_text_image_idx" ON "_pages_v_blocks_media_text" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_media_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_links_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_brands_id_idx" ON "_pages_v_rels" USING btree ("brands_id");
  CREATE INDEX "_pages_v_rels_ranges_id_idx" ON "_pages_v_rels" USING btree ("ranges_id");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "_pages_v_rels" USING btree ("projects_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_virtual_tours_id_idx" ON "_pages_v_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "_pages_v_rels_events_id_idx" ON "_pages_v_rels" USING btree ("events_id");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_rels_faqs_id_idx" ON "_pages_v_rels" USING btree ("faqs_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_rels_order_idx" ON "faqs_rels" USING btree ("order");
  CREATE INDEX "faqs_rels_parent_idx" ON "faqs_rels" USING btree ("parent_id");
  CREATE INDEX "faqs_rels_path_idx" ON "faqs_rels" USING btree ("path");
  CREATE INDEX "faqs_rels_brands_id_idx" ON "faqs_rels" USING btree ("brands_id");
  CREATE INDEX "announcements_image_idx" ON "announcements" USING btree ("image_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "announcements__status_idx" ON "announcements" USING btree ("_status");
  CREATE UNIQUE INDEX "announcements_locales_locale_parent_id_unique" ON "announcements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "announcements_texts_order_parent" ON "announcements_texts" USING btree ("order","parent_id");
  CREATE INDEX "announcements_rels_order_idx" ON "announcements_rels" USING btree ("order");
  CREATE INDEX "announcements_rels_parent_idx" ON "announcements_rels" USING btree ("parent_id");
  CREATE INDEX "announcements_rels_path_idx" ON "announcements_rels" USING btree ("path");
  CREATE INDEX "announcements_rels_pages_id_idx" ON "announcements_rels" USING btree ("pages_id");
  CREATE INDEX "announcements_rels_brands_id_idx" ON "announcements_rels" USING btree ("brands_id");
  CREATE INDEX "announcements_rels_ranges_id_idx" ON "announcements_rels" USING btree ("ranges_id");
  CREATE INDEX "announcements_rels_products_id_idx" ON "announcements_rels" USING btree ("products_id");
  CREATE INDEX "announcements_rels_projects_id_idx" ON "announcements_rels" USING btree ("projects_id");
  CREATE INDEX "announcements_rels_posts_id_idx" ON "announcements_rels" USING btree ("posts_id");
  CREATE INDEX "announcements_rels_virtual_tours_id_idx" ON "announcements_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "announcements_rels_events_id_idx" ON "announcements_rels" USING btree ("events_id");
  CREATE INDEX "_announcements_v_parent_idx" ON "_announcements_v" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_version_version_image_idx" ON "_announcements_v" USING btree ("version_image_id");
  CREATE INDEX "_announcements_v_version_version_updated_at_idx" ON "_announcements_v" USING btree ("version_updated_at");
  CREATE INDEX "_announcements_v_version_version_created_at_idx" ON "_announcements_v" USING btree ("version_created_at");
  CREATE INDEX "_announcements_v_version_version__status_idx" ON "_announcements_v" USING btree ("version__status");
  CREATE INDEX "_announcements_v_created_at_idx" ON "_announcements_v" USING btree ("created_at");
  CREATE INDEX "_announcements_v_updated_at_idx" ON "_announcements_v" USING btree ("updated_at");
  CREATE INDEX "_announcements_v_snapshot_idx" ON "_announcements_v" USING btree ("snapshot");
  CREATE INDEX "_announcements_v_published_locale_idx" ON "_announcements_v" USING btree ("published_locale");
  CREATE INDEX "_announcements_v_latest_idx" ON "_announcements_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_announcements_v_locales_locale_parent_id_unique" ON "_announcements_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_announcements_v_texts_order_parent" ON "_announcements_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_announcements_v_rels_order_idx" ON "_announcements_v_rels" USING btree ("order");
  CREATE INDEX "_announcements_v_rels_parent_idx" ON "_announcements_v_rels" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_rels_path_idx" ON "_announcements_v_rels" USING btree ("path");
  CREATE INDEX "_announcements_v_rels_pages_id_idx" ON "_announcements_v_rels" USING btree ("pages_id");
  CREATE INDEX "_announcements_v_rels_brands_id_idx" ON "_announcements_v_rels" USING btree ("brands_id");
  CREATE INDEX "_announcements_v_rels_ranges_id_idx" ON "_announcements_v_rels" USING btree ("ranges_id");
  CREATE INDEX "_announcements_v_rels_products_id_idx" ON "_announcements_v_rels" USING btree ("products_id");
  CREATE INDEX "_announcements_v_rels_projects_id_idx" ON "_announcements_v_rels" USING btree ("projects_id");
  CREATE INDEX "_announcements_v_rels_posts_id_idx" ON "_announcements_v_rels" USING btree ("posts_id");
  CREATE INDEX "_announcements_v_rels_virtual_tours_id_idx" ON "_announcements_v_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "_announcements_v_rels_events_id_idx" ON "_announcements_v_rels" USING btree ("events_id");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_showroom_idx" ON "team_members" USING btree ("showroom_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_members_locales_locale_parent_id_unique" ON "team_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_members_rels_order_idx" ON "team_members_rels" USING btree ("order");
  CREATE INDEX "team_members_rels_parent_idx" ON "team_members_rels" USING btree ("parent_id");
  CREATE INDEX "team_members_rels_path_idx" ON "team_members_rels" USING btree ("path");
  CREATE INDEX "team_members_rels_brands_id_idx" ON "team_members_rels" USING btree ("brands_id");
  CREATE INDEX "showrooms_opening_hours_order_idx" ON "showrooms_opening_hours" USING btree ("_order");
  CREATE INDEX "showrooms_opening_hours_parent_id_idx" ON "showrooms_opening_hours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "showrooms_opening_hours_locales_locale_parent_id_unique" ON "showrooms_opening_hours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "showrooms_virtual_tour_idx" ON "showrooms" USING btree ("virtual_tour_id");
  CREATE UNIQUE INDEX "showrooms_slug_idx" ON "showrooms" USING btree ("slug");
  CREATE INDEX "showrooms_updated_at_idx" ON "showrooms" USING btree ("updated_at");
  CREATE INDEX "showrooms_created_at_idx" ON "showrooms" USING btree ("created_at");
  CREATE INDEX "showrooms_meta_meta_image_idx" ON "showrooms_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "showrooms_locales_locale_parent_id_unique" ON "showrooms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "showrooms_rels_order_idx" ON "showrooms_rels" USING btree ("order");
  CREATE INDEX "showrooms_rels_parent_idx" ON "showrooms_rels" USING btree ("parent_id");
  CREATE INDEX "showrooms_rels_path_idx" ON "showrooms_rels" USING btree ("path");
  CREATE INDEX "showrooms_rels_media_id_idx" ON "showrooms_rels" USING btree ("media_id");
  CREATE INDEX "showrooms_rels_brands_id_idx" ON "showrooms_rels" USING btree ("brands_id");
  CREATE INDEX "documents_access_idx" ON "documents" USING btree ("access");
  CREATE INDEX "documents_brand_idx" ON "documents" USING btree ("brand_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE UNIQUE INDEX "documents_locales_locale_parent_id_unique" ON "documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "leads_appointment_appointment_member_idx" ON "leads" USING btree ("appointment_member_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "leads_rels_order_idx" ON "leads_rels" USING btree ("order");
  CREATE INDEX "leads_rels_parent_idx" ON "leads_rels" USING btree ("parent_id");
  CREATE INDEX "leads_rels_path_idx" ON "leads_rels" USING btree ("path");
  CREATE INDEX "leads_rels_brands_id_idx" ON "leads_rels" USING btree ("brands_id");
  CREATE INDEX "leads_rels_products_id_idx" ON "leads_rels" USING btree ("products_id");
  CREATE INDEX "leads_rels_documents_id_idx" ON "leads_rels" USING btree ("documents_id");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE INDEX "customers_status_idx" ON "customers" USING btree ("status");
  CREATE INDEX "customers_referent_idx" ON "customers" USING btree ("referent_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_brands_id_idx" ON "redirects_rels" USING btree ("brands_id");
  CREATE INDEX "redirects_rels_ranges_id_idx" ON "redirects_rels" USING btree ("ranges_id");
  CREATE INDEX "redirects_rels_products_id_idx" ON "redirects_rels" USING btree ("products_id");
  CREATE INDEX "redirects_rels_projects_id_idx" ON "redirects_rels" USING btree ("projects_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_brands_id_idx" ON "search_rels" USING btree ("brands_id");
  CREATE INDEX "search_rels_ranges_id_idx" ON "search_rels" USING btree ("ranges_id");
  CREATE INDEX "search_rels_products_id_idx" ON "search_rels" USING btree ("products_id");
  CREATE INDEX "search_rels_projects_id_idx" ON "search_rels" USING btree ("projects_id");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE INDEX "search_rels_events_id_idx" ON "search_rels" USING btree ("events_id");
  CREATE INDEX "home_mosaic_order_idx" ON "home_mosaic" USING btree ("_order");
  CREATE INDEX "home_mosaic_parent_id_idx" ON "home_mosaic" USING btree ("_parent_id");
  CREATE INDEX "home_mosaic_image_idx" ON "home_mosaic" USING btree ("image_id");
  CREATE INDEX "home_mosaic_brand_idx" ON "home_mosaic" USING btree ("brand_id");
  CREATE INDEX "home_mosaic_range_idx" ON "home_mosaic" USING btree ("range_id");
  CREATE UNIQUE INDEX "home_mosaic_locales_locale_parent_id_unique" ON "home_mosaic_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_generator_steps_order_idx" ON "home_generator_steps" USING btree ("_order");
  CREATE INDEX "home_generator_steps_parent_id_idx" ON "home_generator_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_generator_steps_locales_locale_parent_id_unique" ON "home_generator_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_generator_generator_image_idx" ON "home" USING btree ("generator_image_id");
  CREATE INDEX "home_appointments_appointments_image_idx" ON "home" USING btree ("appointments_image_id");
  CREATE INDEX "home__status_idx" ON "home" USING btree ("_status");
  CREATE INDEX "home_meta_meta_image_idx" ON "home_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_pages_id_idx" ON "home_rels" USING btree ("pages_id");
  CREATE INDEX "home_rels_brands_id_idx" ON "home_rels" USING btree ("brands_id");
  CREATE INDEX "home_rels_ranges_id_idx" ON "home_rels" USING btree ("ranges_id");
  CREATE INDEX "home_rels_products_id_idx" ON "home_rels" USING btree ("products_id");
  CREATE INDEX "home_rels_projects_id_idx" ON "home_rels" USING btree ("projects_id");
  CREATE INDEX "home_rels_posts_id_idx" ON "home_rels" USING btree ("posts_id");
  CREATE INDEX "home_rels_virtual_tours_id_idx" ON "home_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "home_rels_events_id_idx" ON "home_rels" USING btree ("events_id");
  CREATE INDEX "home_rels_media_id_idx" ON "home_rels" USING btree ("media_id");
  CREATE INDEX "_home_v_version_mosaic_order_idx" ON "_home_v_version_mosaic" USING btree ("_order");
  CREATE INDEX "_home_v_version_mosaic_parent_id_idx" ON "_home_v_version_mosaic" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_mosaic_image_idx" ON "_home_v_version_mosaic" USING btree ("image_id");
  CREATE INDEX "_home_v_version_mosaic_brand_idx" ON "_home_v_version_mosaic" USING btree ("brand_id");
  CREATE INDEX "_home_v_version_mosaic_range_idx" ON "_home_v_version_mosaic" USING btree ("range_id");
  CREATE UNIQUE INDEX "_home_v_version_mosaic_locales_locale_parent_id_unique" ON "_home_v_version_mosaic_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_generator_steps_order_idx" ON "_home_v_version_generator_steps" USING btree ("_order");
  CREATE INDEX "_home_v_version_generator_steps_parent_id_idx" ON "_home_v_version_generator_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_generator_steps_locales_locale_parent_id_uni" ON "_home_v_version_generator_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_generator_version_generator_image_idx" ON "_home_v" USING btree ("version_generator_image_id");
  CREATE INDEX "_home_v_version_appointments_version_appointments_image_idx" ON "_home_v" USING btree ("version_appointments_image_id");
  CREATE INDEX "_home_v_version_version__status_idx" ON "_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_snapshot_idx" ON "_home_v" USING btree ("snapshot");
  CREATE INDEX "_home_v_published_locale_idx" ON "_home_v" USING btree ("published_locale");
  CREATE INDEX "_home_v_latest_idx" ON "_home_v" USING btree ("latest");
  CREATE INDEX "_home_v_version_meta_version_meta_image_idx" ON "_home_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_home_v_locales_locale_parent_id_unique" ON "_home_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_rels_order_idx" ON "_home_v_rels" USING btree ("order");
  CREATE INDEX "_home_v_rels_parent_idx" ON "_home_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_v_rels_path_idx" ON "_home_v_rels" USING btree ("path");
  CREATE INDEX "_home_v_rels_pages_id_idx" ON "_home_v_rels" USING btree ("pages_id");
  CREATE INDEX "_home_v_rels_brands_id_idx" ON "_home_v_rels" USING btree ("brands_id");
  CREATE INDEX "_home_v_rels_ranges_id_idx" ON "_home_v_rels" USING btree ("ranges_id");
  CREATE INDEX "_home_v_rels_products_id_idx" ON "_home_v_rels" USING btree ("products_id");
  CREATE INDEX "_home_v_rels_projects_id_idx" ON "_home_v_rels" USING btree ("projects_id");
  CREATE INDEX "_home_v_rels_posts_id_idx" ON "_home_v_rels" USING btree ("posts_id");
  CREATE INDEX "_home_v_rels_virtual_tours_id_idx" ON "_home_v_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "_home_v_rels_events_id_idx" ON "_home_v_rels" USING btree ("events_id");
  CREATE INDEX "_home_v_rels_media_id_idx" ON "_home_v_rels" USING btree ("media_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_items_locales_locale_parent_id_unique" ON "navigation_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_rels_order_idx" ON "navigation_rels" USING btree ("order");
  CREATE INDEX "navigation_rels_parent_idx" ON "navigation_rels" USING btree ("parent_id");
  CREATE INDEX "navigation_rels_path_idx" ON "navigation_rels" USING btree ("path");
  CREATE INDEX "navigation_rels_pages_id_idx" ON "navigation_rels" USING btree ("pages_id");
  CREATE INDEX "navigation_rels_brands_id_idx" ON "navigation_rels" USING btree ("brands_id");
  CREATE INDEX "navigation_rels_ranges_id_idx" ON "navigation_rels" USING btree ("ranges_id");
  CREATE INDEX "navigation_rels_products_id_idx" ON "navigation_rels" USING btree ("products_id");
  CREATE INDEX "navigation_rels_projects_id_idx" ON "navigation_rels" USING btree ("projects_id");
  CREATE INDEX "navigation_rels_posts_id_idx" ON "navigation_rels" USING btree ("posts_id");
  CREATE INDEX "navigation_rels_virtual_tours_id_idx" ON "navigation_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "navigation_rels_events_id_idx" ON "navigation_rels" USING btree ("events_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_brands_id_idx" ON "footer_rels" USING btree ("brands_id");
  CREATE INDEX "footer_rels_ranges_id_idx" ON "footer_rels" USING btree ("ranges_id");
  CREATE INDEX "footer_rels_products_id_idx" ON "footer_rels" USING btree ("products_id");
  CREATE INDEX "footer_rels_projects_id_idx" ON "footer_rels" USING btree ("projects_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_virtual_tours_id_idx" ON "footer_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "footer_rels_events_id_idx" ON "footer_rels" USING btree ("events_id");
  CREATE INDEX "settings_socials_order_idx" ON "settings_socials" USING btree ("_order");
  CREATE INDEX "settings_socials_parent_id_idx" ON "settings_socials" USING btree ("_parent_id");
  CREATE INDEX "settings_default_share_image_idx" ON "settings" USING btree ("default_share_image_id");
  CREATE UNIQUE INDEX "settings_locales_locale_parent_id_unique" ON "settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "integrations_texts_order_parent" ON "integrations_texts" USING btree ("order","parent_id");
  ALTER TABLE "media" ADD CONSTRAINT "media_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ranges_fk" FOREIGN KEY ("ranges_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sectors_fk" FOREIGN KEY ("sectors_id") REFERENCES "public"."sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_virtual_tours_fk" FOREIGN KEY ("virtual_tours_id") REFERENCES "public"."virtual_tours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_showrooms_fk" FOREIGN KEY ("showrooms_id") REFERENCES "public"."showrooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_brand_idx" ON "media" USING btree ("brand_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_ranges_id_idx" ON "payload_locked_documents_rels" USING btree ("ranges_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_sectors_id_idx" ON "payload_locked_documents_rels" USING btree ("sectors_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_virtual_tours_id_idx" ON "payload_locked_documents_rels" USING btree ("virtual_tours_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_showrooms_id_idx" ON "payload_locked_documents_rels" USING btree ("showrooms_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");`)

  // Les comptes créés avant l'introduction des rôles sont ceux de l'administrateur.
  await db.execute(sql`UPDATE "users" SET "role" = 'admin'`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brands_universes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brands_key_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brands_key_figures_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brands" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brands_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brands_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_brands_v_version_universes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_brands_v_version_key_figures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_brands_v_version_key_figures_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_brands_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_brands_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_brands_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ranges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ranges_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ranges_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ranges_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ranges_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ranges_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_finishes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_finishes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_specs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_specs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_finishes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_finishes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_specs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_specs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sectors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sectors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "virtual_tours_rooms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "virtual_tours_rooms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "virtual_tours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "virtual_tours_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "virtual_tours_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_virtual_tours_v_version_rooms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_virtual_tours_v_version_rooms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_virtual_tours_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_virtual_tours_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_virtual_tours_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_media_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_media_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_media_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_media_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "showrooms_opening_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "showrooms_opening_hours_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "showrooms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "showrooms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "showrooms_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "documents_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customers_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_mosaic" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_mosaic_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_generator_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_generator_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_mosaic" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_mosaic_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_generator_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_version_generator_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navigation_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_legal_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "integrations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "integrations_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "brands_universes" CASCADE;
  DROP TABLE "brands_key_figures" CASCADE;
  DROP TABLE "brands_key_figures_locales" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "brands_locales" CASCADE;
  DROP TABLE "brands_rels" CASCADE;
  DROP TABLE "_brands_v_version_universes" CASCADE;
  DROP TABLE "_brands_v_version_key_figures" CASCADE;
  DROP TABLE "_brands_v_version_key_figures_locales" CASCADE;
  DROP TABLE "_brands_v" CASCADE;
  DROP TABLE "_brands_v_locales" CASCADE;
  DROP TABLE "_brands_v_rels" CASCADE;
  DROP TABLE "ranges" CASCADE;
  DROP TABLE "ranges_locales" CASCADE;
  DROP TABLE "ranges_rels" CASCADE;
  DROP TABLE "_ranges_v" CASCADE;
  DROP TABLE "_ranges_v_locales" CASCADE;
  DROP TABLE "_ranges_v_rels" CASCADE;
  DROP TABLE "products_finishes" CASCADE;
  DROP TABLE "products_finishes_locales" CASCADE;
  DROP TABLE "products_specs" CASCADE;
  DROP TABLE "products_specs_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_finishes" CASCADE;
  DROP TABLE "_products_v_version_finishes_locales" CASCADE;
  DROP TABLE "_products_v_version_specs" CASCADE;
  DROP TABLE "_products_v_version_specs_locales" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "sectors" CASCADE;
  DROP TABLE "sectors_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "virtual_tours_rooms" CASCADE;
  DROP TABLE "virtual_tours_rooms_locales" CASCADE;
  DROP TABLE "virtual_tours" CASCADE;
  DROP TABLE "virtual_tours_locales" CASCADE;
  DROP TABLE "virtual_tours_rels" CASCADE;
  DROP TABLE "_virtual_tours_v_version_rooms" CASCADE;
  DROP TABLE "_virtual_tours_v_version_rooms_locales" CASCADE;
  DROP TABLE "_virtual_tours_v" CASCADE;
  DROP TABLE "_virtual_tours_v_locales" CASCADE;
  DROP TABLE "_virtual_tours_v_rels" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "posts_categories" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_categories" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_content_locales" CASCADE;
  DROP TABLE "pages_blocks_media_text" CASCADE;
  DROP TABLE "pages_blocks_media_text_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta_links_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_content_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_media_text" CASCADE;
  DROP TABLE "_pages_v_blocks_media_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "faqs_rels" CASCADE;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "announcements_locales" CASCADE;
  DROP TABLE "announcements_texts" CASCADE;
  DROP TABLE "announcements_rels" CASCADE;
  DROP TABLE "_announcements_v" CASCADE;
  DROP TABLE "_announcements_v_locales" CASCADE;
  DROP TABLE "_announcements_v_texts" CASCADE;
  DROP TABLE "_announcements_v_rels" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "team_members_locales" CASCADE;
  DROP TABLE "team_members_rels" CASCADE;
  DROP TABLE "showrooms_opening_hours" CASCADE;
  DROP TABLE "showrooms_opening_hours_locales" CASCADE;
  DROP TABLE "showrooms" CASCADE;
  DROP TABLE "showrooms_locales" CASCADE;
  DROP TABLE "showrooms_rels" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "documents_locales" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "leads_rels" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "home_mosaic" CASCADE;
  DROP TABLE "home_mosaic_locales" CASCADE;
  DROP TABLE "home_generator_steps" CASCADE;
  DROP TABLE "home_generator_steps_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "_home_v_version_mosaic" CASCADE;
  DROP TABLE "_home_v_version_mosaic_locales" CASCADE;
  DROP TABLE "_home_v_version_generator_steps" CASCADE;
  DROP TABLE "_home_v_version_generator_steps_locales" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "_home_v_locales" CASCADE;
  DROP TABLE "_home_v_rels" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation_items_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "navigation_rels" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer_legal_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "settings_socials" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_locales" CASCADE;
  DROP TABLE "integrations" CASCADE;
  DROP TABLE "integrations_texts" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT "media_brand_id_brands_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_brands_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ranges_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sectors_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_virtual_tours_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faqs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_announcements_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_members_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_showrooms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_customers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_search_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_customers_fk";
  
  DROP INDEX "media_brand_idx";
  DROP INDEX "payload_locked_documents_rels_brands_id_idx";
  DROP INDEX "payload_locked_documents_rels_ranges_id_idx";
  DROP INDEX "payload_locked_documents_rels_products_id_idx";
  DROP INDEX "payload_locked_documents_rels_product_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_sectors_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_virtual_tours_id_idx";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_faqs_id_idx";
  DROP INDEX "payload_locked_documents_rels_announcements_id_idx";
  DROP INDEX "payload_locked_documents_rels_team_members_id_idx";
  DROP INDEX "payload_locked_documents_rels_showrooms_id_idx";
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  DROP INDEX "payload_locked_documents_rels_customers_id_idx";
  DROP INDEX "payload_locked_documents_rels_redirects_id_idx";
  DROP INDEX "payload_locked_documents_rels_search_id_idx";
  DROP INDEX "payload_preferences_rels_customers_id_idx";
  ALTER TABLE "media" DROP COLUMN "credit";
  ALTER TABLE "media" DROP COLUMN "brand_id";
  ALTER TABLE "media_locales" DROP COLUMN "caption";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "brands_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ranges_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "products_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sectors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "virtual_tours_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faqs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "announcements_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "showrooms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "customers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "search_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "customers_id";
  DROP TYPE "public"."enum_brands_universes";
  DROP TYPE "public"."enum_brands_status";
  DROP TYPE "public"."enum__brands_v_version_universes";
  DROP TYPE "public"."enum__brands_v_version_status";
  DROP TYPE "public"."enum__brands_v_published_locale";
  DROP TYPE "public"."enum_ranges_status";
  DROP TYPE "public"."enum__ranges_v_version_status";
  DROP TYPE "public"."enum__ranges_v_published_locale";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_virtual_tours_kind";
  DROP TYPE "public"."enum_virtual_tours_availability";
  DROP TYPE "public"."enum_virtual_tours_status";
  DROP TYPE "public"."enum__virtual_tours_v_version_kind";
  DROP TYPE "public"."enum__virtual_tours_v_version_availability";
  DROP TYPE "public"."enum__virtual_tours_v_version_status";
  DROP TYPE "public"."enum__virtual_tours_v_published_locale";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum_posts_categories";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_categories";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_pages_blocks_hero_cta_type";
  DROP TYPE "public"."enum_pages_blocks_media_text_image_position";
  DROP TYPE "public"."enum_pages_blocks_media_text_cta_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_media_text_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_media_text_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_faqs_topic";
  DROP TYPE "public"."enum_announcements_format";
  DROP TYPE "public"."enum_announcements_tone";
  DROP TYPE "public"."enum_announcements_link_type";
  DROP TYPE "public"."enum_announcements_targeting";
  DROP TYPE "public"."enum_announcements_frequency";
  DROP TYPE "public"."enum_announcements_status";
  DROP TYPE "public"."enum__announcements_v_version_format";
  DROP TYPE "public"."enum__announcements_v_version_tone";
  DROP TYPE "public"."enum__announcements_v_version_link_type";
  DROP TYPE "public"."enum__announcements_v_version_targeting";
  DROP TYPE "public"."enum__announcements_v_version_frequency";
  DROP TYPE "public"."enum__announcements_v_version_status";
  DROP TYPE "public"."enum__announcements_v_published_locale";
  DROP TYPE "public"."enum_documents_kind";
  DROP TYPE "public"."enum_documents_access";
  DROP TYPE "public"."enum_documents_language";
  DROP TYPE "public"."enum_leads_kind";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_profile";
  DROP TYPE "public"."enum_leads_appointment_format";
  DROP TYPE "public"."enum_customers_activity";
  DROP TYPE "public"."enum_customers_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_home_mosaic_size";
  DROP TYPE "public"."enum_home_mosaic_link_type";
  DROP TYPE "public"."enum_home_status";
  DROP TYPE "public"."enum__home_v_version_mosaic_size";
  DROP TYPE "public"."enum__home_v_version_mosaic_link_type";
  DROP TYPE "public"."enum__home_v_version_status";
  DROP TYPE "public"."enum__home_v_published_locale";
  DROP TYPE "public"."enum_navigation_items_link_type";
  DROP TYPE "public"."enum_footer_columns_links_link_type";
  DROP TYPE "public"."enum_footer_legal_links_link_type";
  DROP TYPE "public"."enum_footer_banner_link_type";
  DROP TYPE "public"."enum_settings_socials_network";
  DROP TYPE "public"."enum_integrations_zoho_module";
  DROP TYPE "public"."enum_integrations_calendar_provider";`)
}
