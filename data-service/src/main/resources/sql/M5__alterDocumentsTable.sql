ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS parent uuid;

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS name character varying;

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS type character varying(50);

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS inner_path character varying;

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS category character varying;

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS content_type_id character varying;

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS created_by character varying(50);

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS created_at timestamp without time zone;

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS last_modified timestamp without time zone;

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS human_path text;

ALTER TABLE data.documents
    ADD COLUMN IF NOT EXISTS oktmo character varying(11);

UPDATE data.documents
SET inner_path=id,
    content_type_id='doc_v1',
    created_at=now(),
    last_modified=now()
WHERE documents.content_type_id IS NULL;
