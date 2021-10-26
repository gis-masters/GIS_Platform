ALTER TABLE data.schemas_and_tables
    ADD COLUMN IF NOT EXISTS scale                integer,
    ADD COLUMN IF NOT EXISTS document_type        varchar(100),
    ADD COLUMN IF NOT EXISTS doc_approve_date     timestamp without time zone,
    ADD COLUMN IF NOT EXISTS oktmo                character varying(50),
    ADD COLUMN IF NOT EXISTS custom_rule_function text,
    ADD COLUMN IF NOT EXISTS calc_fields_function text,
    ADD COLUMN IF NOT EXISTS readonly             boolean,
    ADD COLUMN IF NOT EXISTS geometry_type        character varying(50);
