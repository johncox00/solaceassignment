ALTER TABLE "advocates" RENAME COLUMN "payload" TO "specialties";
CREATE INDEX IF NOT EXISTS specialties_idx ON advocates USING gin ((specialties::text) gin_trgm_ops);
