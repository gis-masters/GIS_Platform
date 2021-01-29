CREATE SCHEMA IF NOT EXISTS data;

CREATE TABLE IF NOT EXISTS data.base_maps
(
    id            bigserial              NOT NULL,
    name          character varying(255),
    title         character varying(255) NOT NULL,
    thumbnail_urn character varying(255) NOT NULL,
    type          character varying(20)  NOT NULL,
    url           character varying(255),
    layer_name    character varying(255),
    style         character varying(50),
    projection    character varying(20),
    format        character varying(20),
    size          integer,
    resolution    integer,
    matrix_ids    integer,
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    CONSTRAINT base_maps_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.documents
(
    id              uuid NOT NULL,
    parent          uuid,
    title           character varying(500),
    name            character varying,
    type            character varying(50),
    size            bigint,
    category        character varying,
    content_type_id character varying,
    created_at      timestamp without time zone,
    last_modified   timestamp without time zone,
    created_by      character varying(50),
    CONSTRAINT documents_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.resource
(
    id            bigserial             NOT NULL,
    title         character varying     NOT NULL,
    details       character varying(1024),
    type          character varying(20) NOT NULL,
    identifier    character varying     NOT NULL,
    items_count   integer DEFAULT 0,
    schema_id     character varying(50),
    crs           character varying(20),
    created_by    character varying,
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    CONSTRAINT resource_description_pkey PRIMARY KEY (id),
    CONSTRAINT resource_identifier_type UNIQUE (identifier, type)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.principal
(
    id         bigserial             NOT NULL,
    identifier bigint                NOT NULL,
    type       character varying(20) NOT NULL,
    CONSTRAINT principal_pkey PRIMARY KEY (id),
    CONSTRAINT principal_identifier_type UNIQUE (identifier, type)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.permission
(
    id            bigserial NOT NULL,
    role          character varying(20),
    principal_id  bigint    NOT NULL,
    resource_id   bigint    NOT NULL,
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    CONSTRAINT permission_pkey PRIMARY KEY (id),
    CONSTRAINT fk3yfc65wpuf6tu7enud5iqkh9b FOREIGN KEY (resource_id)
        REFERENCES data.resource (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fkcsq8yuy5497r2s4n8h1rh1a62 FOREIGN KEY (principal_id)
        REFERENCES data.principal (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.schemas
(
    id                bigserial NOT NULL,
    name              character varying(255),
    class_rule        json,
    custom_rule       text,
    calculated_fields text,
    CONSTRAINT schemas_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.processes
(
    id        bigserial NOT NULL,
    user_name character varying(60),
    title     character varying(255),
    type      character varying(20),
    status    character varying(20),
    extra     json,
    details   json,
    CONSTRAINT rus43af9ap4edm43mm3141oddj6 PRIMARY KEY (id)
) TABLESPACE pg_default;
