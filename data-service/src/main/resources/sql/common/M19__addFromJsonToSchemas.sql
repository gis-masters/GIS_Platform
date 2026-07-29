ALTER TABLE data.schemas
    ADD COLUMN IF NOT EXISTS from_json boolean DEFAULT false;
