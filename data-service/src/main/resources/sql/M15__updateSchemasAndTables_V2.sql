ALTER TABLE data.schemas_and_tables
    RENAME COLUMN oktmo TO fias__oktmo;

ALTER TABLE data.schemas_and_tables
    ADD COLUMN IF NOT EXISTS status varchar (100),
    ADD COLUMN IF NOT EXISTS is_public boolean,
    ADD COLUMN IF NOT EXISTS fias__address varchar,
    ADD COLUMN IF NOT EXISTS fias__id bigint,
    ADD COLUMN IF NOT EXISTS doc_termination_date timestamp without time zone;
