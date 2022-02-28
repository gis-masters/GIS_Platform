CREATE TABLE IF NOT EXISTS data.files
(
    id                 uuid                   NOT NULL,
    title              character varying(255) NOT NULL,
    size               bigint,
    extension          character varying(20),
    path               character varying(500) NOT NULL,
    content_type       character varying(100),
    intents            character varying,
    resource_type      character varying(20),
    resource_qualifier jsonb,
    created_by         character varying(50),
    created_at         timestamp without time zone,
    CONSTRAINT files_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
