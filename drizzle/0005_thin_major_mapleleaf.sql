CREATE TABLE "handoffs" (
	"id" serial PRIMARY KEY NOT NULL,
	"contract_id" integer NOT NULL,
	"source_code_url" varchar(500),
	"documentation_url" varchar(500),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."contract_status";--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."contract_status";--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "status" SET DATA TYPE "public"."contract_status" USING "status"::"public"."contract_status";--> statement-breakpoint
ALTER TABLE "handoffs" ADD CONSTRAINT "handoffs_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" DROP COLUMN "revision_message";