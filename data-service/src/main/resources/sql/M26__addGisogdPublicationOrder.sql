ALTER TABLE data.schemas_and_tables
    ADD COLUMN IF NOT EXISTS gisogd_rf_publication_order integer;

ALTER TABLE data.doc_libraries
    ADD COLUMN IF NOT EXISTS gisogd_rf_publication_order integer;
