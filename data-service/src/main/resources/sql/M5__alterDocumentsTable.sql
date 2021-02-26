ALTER TABLE data.documents
    ADD COLUMN parent uuid;

ALTER TABLE data.documents
    ADD COLUMN name character varying;

ALTER TABLE data.documents
    ADD COLUMN type character varying(50);

ALTER TABLE data.documents
    ADD COLUMN inner_path character varying;

ALTER TABLE data.documents
    ADD COLUMN category character varying;

ALTER TABLE data.documents
    ADD COLUMN content_type_id character varying;

ALTER TABLE data.documents
    ADD COLUMN created_by character varying(50);

ALTER TABLE data.documents
    ADD COLUMN created_at timestamp without time zone;

ALTER TABLE data.documents
    ADD COLUMN last_modified timestamp without time zone;

UPDATE data.documents
SET inner_path=id, content_type_id='doc_v1', created_at=now(), last_modified=now();
