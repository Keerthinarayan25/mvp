ALTER TYPE "public"."contract_status" ADD VALUE 'revision_requested' BEFORE 'completed';--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "revision_message" text;