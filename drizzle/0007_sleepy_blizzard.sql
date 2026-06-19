CREATE TYPE "public"."escrow_status" AS ENUM('pending', 'funded', 'released', 'refunded');--> statement-breakpoint
ALTER TYPE "public"."contract_status" ADD VALUE 'pending_funding' BEFORE 'active';--> statement-breakpoint
CREATE TABLE "escrows" (
	"id" serial PRIMARY KEY NOT NULL,
	"contract_id" integer NOT NULL,
	"founder_id" integer NOT NULL,
	"developer_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'INR',
	"razorpay_order_id" varchar(255),
	"razorpay_payment_id" varchar(255),
	"status" "escrow_status" DEFAULT 'pending',
	"funded_at" timestamp,
	"released_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "escrows" ADD CONSTRAINT "escrows_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrows" ADD CONSTRAINT "escrows_founder_id_users_id_fk" FOREIGN KEY ("founder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escrows" ADD CONSTRAINT "escrows_developer_id_users_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;