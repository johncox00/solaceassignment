ALTER TABLE "advocates" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "advocates" ADD PRIMARY KEY ("uuid");
