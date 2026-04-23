ALTER TABLE data.schemas
    ADD COLUMN IF NOT EXISTS created_by character varying,
    ADD COLUMN IF NOT EXISTS created_at timestamp without time zone,
    ADD COLUMN IF NOT EXISTS last_modified timestamp without time zone,
    ADD COLUMN IF NOT EXISTS modified_by character varying,
    ADD COLUMN IF NOT EXISTS is_system boolean;
