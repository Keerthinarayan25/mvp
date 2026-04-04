CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"developer_id" integer NOT NULL,
	"title" varchar(255),
	"description" text,
	"project_link" varchar(255),
	"github_link" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "developer_profiles" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "developer_profiles" ADD COLUMN "education" text;--> statement-breakpoint
ALTER TABLE "developer_profiles" ADD COLUMN "languages" text;--> statement-breakpoint
ALTER TABLE "developer_profiles" ADD COLUMN "github" varchar(255);--> statement-breakpoint
ALTER TABLE "developer_profiles" ADD COLUMN "linkedin" varchar(255);--> statement-breakpoint
ALTER TABLE "developer_profiles" ADD COLUMN "profile_image" text;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_developer_id_users_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;