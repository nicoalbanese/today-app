CREATE TABLE IF NOT EXISTS "reflections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"location" varchar(256) NOT NULL,
	"rating" integer NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "focuses" DROP COLUMN IF EXISTS "location";