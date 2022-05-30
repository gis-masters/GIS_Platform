ALTER TABLE data.schemas_and_tables
    ADD COLUMN IF NOT EXISTS fias__oktmo          character varying(50),
    ADD COLUMN IF NOT EXISTS fias__address        character varying,
    ADD COLUMN IF NOT EXISTS fias__id             bigint,
    ADD COLUMN IF NOT EXISTS scale                integer,
    ADD COLUMN IF NOT EXISTS document_type        varchar(100),
    ADD COLUMN IF NOT EXISTS doc_approve_date     timestamp without time zone,
    ADD COLUMN IF NOT EXISTS status               varchar(100),
    ADD COLUMN IF NOT EXISTS is_public            boolean,
    ADD COLUMN IF NOT EXISTS doc_termination_date timestamp without time zone;
