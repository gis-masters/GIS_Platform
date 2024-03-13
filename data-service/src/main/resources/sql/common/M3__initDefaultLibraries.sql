CREATE TABLE IF NOT EXISTS data.dl_default
(
    id              bigserial NOT NULL,
    title           character varying(500),
    name            character varying,
    type            character varying(50),
    size            bigint,
    inner_path      character varying,
    category        character varying,
    content_type_id character varying,
    is_folder       boolean   NOT NULL DEFAULT false,
    path            text,
    created_at      timestamp without time zone,
    last_modified   timestamp without time zone,
    created_by      character varying(50),
    updated_by      character varying(50),
    intents         character varying(500),
    oktmo           character varying(11),
    native_crs      character varying(50),
    some_files      jsonb,
    one_file        jsonb,
    is_deleted      boolean            DEFAULT false,
    CONSTRAINT dl_default_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
ALTER TABLE data.dl_default
    OWNER to fiz;

INSERT INTO data.doc_libraries(title, details, table_name, created_by, created_at, last_modified, path)
SELECT 'Тестовая библиотека',
       'Тестовая библиотека с отсылкой к таблице documents',
       'dl_default',
       'fiz@migration',
       now(),
       now(),
       '/root'
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE table_name = 'dl_default');


CREATE TABLE IF NOT EXISTS data.dl_zu
(
    id              bigserial,
    title           varchar(500) NOT NULL,
    path            varchar(555),
    is_folder       boolean,
    cadastralnumber varchar,
    name            varchar,
    surname         varchar,
    first           varchar,
    datebirth       timestamp,
    place_birth     varchar,
    code_document   varchar,
    name4           varchar,
    series          varchar,
    number          varchar,
    date            timestamp,
    issueorgan      varchar,
    issueorgan_code varchar,
    note            varchar,
    e_mail          varchar,
    phone           varchar,
    citizenship     varchar,
    snils           varchar,
    regnumber82     varchar,
    regdate83       timestamp,
    dateclose       timestamp,
    created_at      timestamp,
    content_type_id varchar,
    patronymic      varchar,
    is_deleted      boolean DEFAULT false,
    CONSTRAINT dl_zu_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
ALTER TABLE data.dl_zu
    OWNER to fiz;

INSERT INTO data.doc_libraries(title, details, table_name, created_by, created_at, last_modified, path)
SELECT 'Библиотека ЗУ',
       'ЗУ библиотека',
       'dl_zu',
       'fiz@fiz',
       now(),
       now(),
       '/root'
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE table_name = 'dl_zu');
