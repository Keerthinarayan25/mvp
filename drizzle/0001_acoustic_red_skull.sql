ALTER TABLE "applications" ALTER COLUMN "proposal_message" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "proposed_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "delivery_value" integer;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "delivery_unit" timeline_unit;--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "delivery_time";