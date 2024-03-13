ALTER TABLE IF EXISTS data.files
    ADD COLUMN IF NOT EXISTS crs character varying(20);
