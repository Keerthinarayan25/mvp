ALTER TYPE "public"."contract_status" ADD VALUE 'awaiting_handoff' BEFORE 'completed';--> statement-breakpoint
ALTER TABLE "handoffs" ALTER COLUMN "source_code_url" SET NOT NULL;