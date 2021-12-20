ALTER TABLE data.doc_libraries
    ADD COLUMN IF NOT EXISTS registry_counter bigint DEFAULT 1;
