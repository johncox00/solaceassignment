-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Indices for search
CREATE INDEX IF NOT EXISTS first_name_idx ON advocates USING gin (first_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS last_name_idx ON advocates USING gin (last_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS city_idx ON advocates USING gin (city gin_trgm_ops);
CREATE INDEX IF NOT EXISTS degree_idx ON advocates USING gin (degree gin_trgm_ops);

-- Default sort index
CREATE INDEX IF NOT EXISTS last_name_default_sort_idx ON advocates (last_name, id);
