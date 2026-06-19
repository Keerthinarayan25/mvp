ALTER TYPE "public"."contract_status" ADD VALUE 'submitted' BEFORE 'awaiting_handoff';--> statement-breakpoint
ALTER TABLE "handoffs" ADD COLUMN "unlocked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "handoffs" ADD COLUMN "released_at" timestamp;--> statement-breakpoint
ALTER TABLE "deliveries" DROP COLUMN "github_url";