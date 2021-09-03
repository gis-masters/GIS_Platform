ALTER TABLE data.schemas_and_tables
    ADD COLUMN IF NOT EXISTS scale INTEGER,
    ADD COLUMN IF NOT EXISTS document_type varchar(100),
    ADD COLUMN IF NOT EXISTS doc_approve_date timestamp without time zone,
    ADD COLUMN IF NOT EXISTS oktmo character varying(50);
