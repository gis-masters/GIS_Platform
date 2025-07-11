CREATE TABLE IF NOT EXISTS data.fts_documents
(
    schema            character varying(40)  NOT NULL,
    "table"           character varying(100) NOT NULL,
    id                bigint                 NOT NULL,
    path              character varying      NOT NULL,
    concatenated_data text,
    vector_data       tsvector GENERATED ALWAYS AS (to_tsvector('russian', concatenated_data)) STORED
    ) TABLESPACE pg_default;
ALTER TABLE data.fts_documents
    OWNER to ${db_owner};

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_fts_documents ON data.fts_documents (schema, "table", id);
CREATE INDEX IF NOT EXISTS idx_documents_vector_data ON data.fts_documents USING gin (vector_data);


CREATE TABLE IF NOT EXISTS data.fts_layers
(
    schema            character varying(40)  NOT NULL,
    "table"           character varying(100) NOT NULL,
    id                bigint                 NOT NULL,
    concatenated_data text,
    vector_data       tsvector GENERATED ALWAYS AS (to_tsvector('russian', concatenated_data)) STORED
    ) TABLESPACE pg_default;
ALTER TABLE data.fts_layers
    OWNER to ${db_owner};

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_fts_layers ON data.fts_layers (schema, "table", id);
CREATE INDEX IF NOT EXISTS idx_layers_vector_data ON data.fts_layers USING gin (vector_data);
