ALTER TABLE "developer_profiles" ALTER COLUMN "skills" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "developer_profiles" ALTER COLUMN "tech_stack" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "developer_profiles" ALTER COLUMN "portfolio_links" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "developer_profiles" ALTER COLUMN "languages" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "developer_profiles" ADD COLUMN "created_at" timestamp DEFAULT now();