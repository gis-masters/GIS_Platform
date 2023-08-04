ALTER TABLE data.doc_libraries
    ADD COLUMN IF NOT EXISTS versioned boolean DEFAULT false;
