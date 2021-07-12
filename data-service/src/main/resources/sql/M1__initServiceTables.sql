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

CREATE TABLE IF NOT EXISTS data.schemas_and_tables
(
    id            bigserial         NOT NULL,
    title         character varying NOT NULL,
    details       character varying(1024),
    is_folder     boolean           NOT NULL,
    identifier    character varying NOT NULL,
    path          text,
    items_count   integer DEFAULT 0,
    schema_id     character varying(50),
    crs           character varying(20),
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    CONSTRAINT schemas_and_tables_description_pkey PRIMARY KEY (id),
    CONSTRAINT schemas_and_tables_identifier_type UNIQUE (identifier, is_folder, path)
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

CREATE TABLE IF NOT EXISTS data.doc_libraries
(
    id            bigserial         NOT NULL,
    title         character varying,
    details       character varying(1024),
    path          text,
    table_name    character varying NOT NULL,
    schema_id     character varying(50),
    created_by    character varying,
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    CONSTRAINT doc_libraries_pkey PRIMARY KEY (id),
    CONSTRAINT doc_libraries_table UNIQUE (table_name)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.acl_roles
(
    id   bigserial NOT NULL,
    name character varying(255),
    CONSTRAINT acl_roles_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.acl_principals
(
    id         bigserial             NOT NULL,
    identifier bigint                NOT NULL,
    type       character varying(20) NOT NULL,
    CONSTRAINT acl_principals_pkey PRIMARY KEY (id),
    CONSTRAINT acl_principals_unique_id_type UNIQUE (identifier, type)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS data.acl_permissions
(
    id             bigserial              NOT NULL,
    role_id        bigint                 NOT NULL,
    principal_id   bigint                 NOT NULL,
    resource_table character varying(255) NOT NULL,
    resource_id    bigint                 NOT NULL,
    created_by     character varying(50),
    created_at     timestamp without time zone,
    last_modified  timestamp without time zone,
    CONSTRAINT acl_permissions_pkey PRIMARY KEY (id),
    CONSTRAINT acl_permissions_fiz_unique UNIQUE (role_id, principal_id, resource_table, resource_id),
    CONSTRAINT fk6qrdpnlh0khdvkr4usr5ip7ov FOREIGN KEY (principal_id)
        REFERENCES data.acl_principals (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fkjm34ygwboc77dpgpbfageb3ja FOREIGN KEY (role_id)
        REFERENCES data.acl_roles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
) TABLESPACE pg_default;

INSERT INTO data.acl_roles (id, name)
SELECT 10, 'VIEWER'
WHERE NOT EXISTS(SELECT id FROM data.acl_roles WHERE name = 'VIEWER');

INSERT INTO data.acl_roles (id, name)
SELECT 20, 'CONTRIBUTOR'
WHERE NOT EXISTS(SELECT id FROM data.acl_roles WHERE name = 'CONTRIBUTOR');

INSERT INTO data.acl_roles (id, name)
SELECT 30, 'OWNER'
WHERE NOT EXISTS(SELECT id FROM data.acl_roles WHERE name = 'OWNER');
