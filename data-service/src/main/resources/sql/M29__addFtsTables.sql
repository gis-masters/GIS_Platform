CREATE TABLE IF NOT EXISTS data.fts_documents
(
    schema            character varying NOT NULL,
    "table"           character varying NOT NULL,
    id                bigint            NOT NULL,
    path              character varying NOT NULL,
    concatenated_data text
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS data.fts_documents
    OWNER to fiz;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_fts_documents ON data.fts_documents (schema, "table", id);


CREATE TABLE IF NOT EXISTS data.fts_layers
(
    schema            character varying NOT NULL,
    "table"           character varying NOT NULL,
    id                bigint            NOT NULL,
    concatenated_data text
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS data.fts_layers
    OWNER to fiz;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_fts_layers ON data.fts_layers (schema, "table", id);


ALTER TABLE IF EXISTS data.doc_libraries
    ADD COLUMN IF NOT EXISTS ready_for_fts boolean;

ALTER TABLE IF EXISTS data.schemas_and_tables
    ADD COLUMN IF NOT EXISTS ready_for_fts boolean;
