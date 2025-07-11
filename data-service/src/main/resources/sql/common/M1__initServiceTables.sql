CREATE TABLE IF NOT EXISTS data.base_maps
(
    id                       bigserial             NOT NULL,
    name                     character varying,
    title                    character varying     NOT NULL,
    thumbnail_urn            character varying     NOT NULL,
    type                     character varying(20) NOT NULL,
    url                      character varying,
    layer_name               character varying,
    style                    character varying(50),
    projection               character varying(20),
    format                   character varying(20),
    size                     integer,
    resolution               integer,
    matrix_ids               integer,
    position                 integer,
    pluggable_to_new_project boolean,
    created_at               timestamp without time zone,
    last_modified            timestamp without time zone,
    CONSTRAINT base_maps_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.base_maps
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.schemas_and_tables
(
    id                          bigserial         NOT NULL,
    title                       character varying NOT NULL,
    details                     character varying(1024),
    is_folder                   boolean           NOT NULL,
    identifier                  character varying NOT NULL,
    path                        text,
    items_count                 integer DEFAULT 0,
    schema                      jsonb,
    crs                         character varying(20),
    fias__oktmo                 character varying(50),
    fias__address               varchar,
    fias__id                    bigint,
    scale                       integer,
    document_type               character varying(100),
    doc_approve_date            timestamp without time zone,
    status                      varchar(50),
    is_public                   boolean,
    doc_termination_date        timestamp without time zone,
    gisogd_rf_publication_order integer,
    ready_for_fts               boolean,
    created_at                  timestamp without time zone,
    last_modified               timestamp without time zone,
    CONSTRAINT schemas_and_tables_description_pkey PRIMARY KEY (id),
    CONSTRAINT schemas_and_tables_identifier_type UNIQUE (identifier, is_folder, path)
    ) TABLESPACE pg_default;
ALTER TABLE data.schemas_and_tables
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.schemas
(
    id                bigserial         NOT NULL,
    name              character varying NOT NULL UNIQUE,
    class_rule        json              NOT NULL,
    custom_rule       text,
    calculated_fields text,
    CONSTRAINT schemas_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.schemas
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.processes
(
    id        bigserial NOT NULL,
    user_name character varying(60),
    title     character varying,
    type      character varying(20),
    status    character varying(20),
    extra     json,
    details   json,
    CONSTRAINT rus43af9ap4edm43mm3141oddj6 PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.processes
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.doc_libraries
(
    id                          bigserial         NOT NULL,
    title                       character varying,
    details                     character varying(1024),
    path                        text,
    table_name                  character varying NOT NULL,
    schema                      jsonb,
    registry_counter            bigint  DEFAULT 1,
    gisogd_rf_publication_order integer,
    versioned                   boolean DEFAULT false,
    ready_for_fts               boolean,
    created_by                  character varying,
    created_at                  timestamp without time zone,
    last_modified               timestamp without time zone,
    CONSTRAINT doc_libraries_pkey PRIMARY KEY (id),
    CONSTRAINT doc_libraries_table UNIQUE (table_name)
    ) TABLESPACE pg_default;
ALTER TABLE data.doc_libraries
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.files
(
    id                 uuid                   NOT NULL,
    title              character varying      NOT NULL,
    size               bigint,
    extension          character varying(10),
    path               character varying(500) NOT NULL,
    content_type       character varying(130),
    intents            character varying,
    resource_type      character varying(20),
    resource_qualifier jsonb,
    created_by         character varying(50),
    created_at         timestamp without time zone,
    CONSTRAINT files_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.files
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.acl_roles
(
    id   bigserial NOT NULL,
    name character varying,
    CONSTRAINT acl_roles_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.acl_roles
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.acl_principals
(
    id         bigserial             NOT NULL,
    identifier bigint                NOT NULL,
    type       character varying(20) NOT NULL,
    CONSTRAINT acl_principals_pkey PRIMARY KEY (id),
    CONSTRAINT acl_principals_unique_id_type UNIQUE (identifier, type)
    ) TABLESPACE pg_default;
ALTER TABLE data.acl_principals
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.acl_permissions
(
    id             bigserial         NOT NULL,
    role_id        bigint            NOT NULL,
    principal_id   bigint            NOT NULL,
    resource_table character varying NOT NULL,
    resource_id    bigint            NOT NULL,
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
ALTER TABLE data.acl_permissions
    OWNER to ${db_owner};

CREATE INDEX IF NOT EXISTS idx_resource_table ON data.acl_permissions (resource_table);
CREATE INDEX IF NOT EXISTS idx_principal_id ON data.acl_permissions (principal_id);
CREATE INDEX IF NOT EXISTS idx_resource_id ON data.acl_permissions (resource_id);


CREATE TABLE IF NOT EXISTS data.entity_description
(
    table_name                 character varying(64) NOT NULL,
    title                      character varying,
    description                character varying(500),
    readonly                   boolean default false,
    calc_fields_function       text,
    entity_validation_function text,
    CONSTRAINT entity_description_pkey PRIMARY KEY (table_name)
    ) TABLESPACE pg_default;
ALTER TABLE data.entity_description
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.entity_properties
(
    -- Primary/Unique keys
    id                            bigserial             NOT NULL,
    name                          character varying(50),
    property_type                 character varying(50) NOT NULL,
    title                         character varying     NOT NULL,

    -- common info
    description                   character varying(500),
    category                      character varying,
    is_system_managed             boolean default false,
    hidden                        boolean default false,
    disabled                      boolean default false,
    required                      boolean default false,
    as_title                      boolean default false,
    is_indexed                    boolean default false,

    -- specific all
    display                       character varying(50),
    mask                          character varying,
    min_length                    integer,
    max_length                    integer,
    well_know_regex               character varying(20),
    regex                         character varying,
    regex_error_message           character varying,
    default_value                 character varying,
    allow_multiple_values         boolean default false,
    step                          integer default 1,
    min_value                     double precision,
    max_value                     double precision,
    precision                     integer,
    true_label                    character varying,
    false_label                   character varying,
    format                        character varying,
    value_type                    character varying(50),
    allow_fill_in                 boolean default false,
    multiple                      boolean default false,
    enable_preview                boolean default false,
    well_know_formula             character varying(1000),
    formula                       character varying(1000),
    geometry_type                 character varying(50),
    is_default_geometry           boolean default false,
    lookup_table_name             character varying,
    lookup_field_name             character varying,
    additional_fields             character varying,
    b_accept                      character varying,
    b_max_size                    integer,
    is_default                    boolean default false,
    is_embedded                   boolean default false,
    additional                    jsonb,
    entity_description_table_name character varying(64),
    entity_content_type_name      character varying(50),

    -- system
    created_by                    character varying(50),
    created_at                    timestamp without time zone,
    last_modified                 timestamp without time zone,

    CONSTRAINT entity_properties_pkey PRIMARY KEY (id),
    CONSTRAINT ukl6md4800a2xf7rbrq2qgmkprb UNIQUE (id, name, property_type, title)

    ) TABLESPACE pg_default;
ALTER TABLE data.entity_properties
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS data.entity_content_types
(
    name                          character varying(50) NOT NULL,
    type                          character varying(20) NOT NULL,
    title                         character varying(100),
    icon                          character varying(50),
    entity_description_table_name character varying(64),

    CONSTRAINT entity_content_types_pkey PRIMARY KEY (name)
    ) TABLESPACE pg_default;
ALTER TABLE data.entity_content_types
    OWNER to ${db_owner};


INSERT INTO data.acl_roles (id, name)
SELECT 10, 'VIEWER'
    WHERE NOT EXISTS(SELECT id FROM data.acl_roles WHERE name = 'VIEWER');

INSERT INTO data.acl_roles (id, name)
SELECT 20, 'CONTRIBUTOR'
    WHERE NOT EXISTS(SELECT id FROM data.acl_roles WHERE name = 'CONTRIBUTOR');

INSERT INTO data.acl_roles (id, name)
SELECT 30, 'OWNER'
    WHERE NOT EXISTS(SELECT id FROM data.acl_roles WHERE name = 'OWNER');

-- REESTRS
-- Common
CREATE TABLE IF NOT EXISTS data.reestrs
(
    id            bigserial             NOT NULL,
    title         character varying     NOT NULL,
    description   character varying(2000),
    table_name    character varying(50) NOT NULL UNIQUE,
    schema_name   character varying(50) NOT NULL,
    created_by    character varying,
    updated_by    character varying,
    created_at    timestamp without time zone DEFAULT now(),
    last_modified timestamp without time zone DEFAULT now(),
    CONSTRAINT reestrs_id_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.reestrs
    OWNER to ${db_owner};

-- Incoming
CREATE TABLE IF NOT EXISTS data.reestr_incoming
(
    id            uuid                   NOT NULL,
    system        character varying(100) NOT NULL,
    user_from     character varying(100) NOT NULL,
    body          text,
    date_in       timestamp without time zone DEFAULT now(),
    date_out      timestamp without time zone DEFAULT now(),
    status        character varying(20)  NOT NULL,
    response_to   character varying(20),
    created_by    character varying,
    updated_by    character varying,
    created_at    timestamp without time zone DEFAULT now(),
    last_modified timestamp without time zone DEFAULT now(),
    CONSTRAINT reestr_incoming_id_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.reestr_incoming
    OWNER to ${db_owner};

-- Outgoing
CREATE TABLE IF NOT EXISTS data.reestr_outgoing
(
    id            uuid                   NOT NULL,
    system        character varying(100) NOT NULL,
    user_to       character varying(100) NOT NULL,
    body          text,
    date_out      timestamp without time zone DEFAULT now(),
    status        character varying(20)  NOT NULL,
    response_to   character varying(20),
    created_by    character varying,
    updated_by    character varying,
    created_at    timestamp without time zone DEFAULT now(),
    last_modified timestamp without time zone DEFAULT now(),
    CONSTRAINT reestr_outgoing_id_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.reestr_outgoing
    OWNER to ${db_owner};

INSERT INTO data.reestrs (title, table_name, schema_name, created_by)
SELECT 'Реестр входящих',
       'reestr_incoming',
       'reestr_incoming_schema',
       'migration'
    WHERE NOT EXISTS(SELECT id FROM data.reestrs WHERE table_name = 'reestr_incoming');

INSERT INTO data.reestrs (title, table_name, schema_name, created_by)
SELECT 'Реестр исходящих',
       'reestr_outgoing',
       'reestr_outgoing_schema',
       'migration'
    WHERE NOT EXISTS(SELECT id FROM data.reestrs WHERE table_name = 'reestr_outgoing');


-- Task log
CREATE TABLE IF NOT EXISTS data.tasks_log
(
    id         bigserial         NOT NULL,
    task_id    bigint            NOT NULL,
    event_type character varying NOT NULL,
    message    jsonb,
    created_at timestamp without time zone DEFAULT now(),
    created_by bigint,
    CONSTRAINT tasks_log_id_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;
ALTER TABLE data.tasks_log
    OWNER to ${db_owner};
