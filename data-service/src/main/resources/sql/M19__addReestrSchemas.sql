-- Common
CREATE TABLE IF NOT EXISTS data.reestrs
(
    id            bigserial             NOT NULL,
    title         character varying     NOT NULL,
    description   character varying(2000),
    table_name    character varying(50) NOT NULL UNIQUE,
    schema_name   character varying(50) NOT NULL,
    created_by    character varying,
    created_at    timestamp without time zone DEFAULT now(),
    last_modified timestamp without time zone DEFAULT now(),
    CONSTRAINT reestrs_id_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

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

INSERT INTO data.schemas (name, class_rule)
SELECT 'reestr_common_schema',
       '{
  "name": "reestrs",
  "title": "Реестры сообщений",
  "description": "Общая схема, описывающая модель реестров. Версия 0.1",
  "readOnly": true,
  "tableName": "reestrs",
  "originName": "reestrs",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "valueType": "LONG"
    },
    {
      "name": "title",
      "title": "Наименование",
      "valueType": "STRING",
      "required": true
    },
    {
      "name": "description",
      "title": "Описание",
      "valueType": "STRING",
      "maxLength": 2000
    },
    {
      "name": "table_name",
      "title": "Название таблицы",
      "valueType": "STRING",
      "maxLength": 50,
      "required": true
    },
    {
      "name": "schema_name",
      "title": "Название схемы",
      "valueType": "STRING",
      "maxLength": 50,
      "required": true
    },
    {
      "name": "created_by",
      "title": "Создано",
      "valueType": "STRING"
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "valueType": "DATETIME"
    },
    {
      "name": "last_modified",
      "title": "Дата последнего изменения",
      "valueType": "DATETIME"
    }
  ]
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'reestr_common_schema');


-- Incoming
CREATE TABLE IF NOT EXISTS data.reestr_incoming
(
    id          uuid                   NOT NULL,
    system      character varying(100) NOT NULL,
    user_from   character varying(100) NOT NULL,
    body        text,
    date_in     timestamp without time zone DEFAULT now(),
    date_out    timestamp without time zone DEFAULT now(),
    status      character varying(20)  NOT NULL,
    response_to character varying(20),
    CONSTRAINT reestr_incoming_id_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

INSERT INTO data.schemas (name, class_rule)
SELECT 'reestr_incoming_schema',
       '{
  "name": "reestr_incoming",
  "title": "Реестр входящих сообщений",
  "description": "Схема, описывающая реестр входящих сообщений. Версия 0.1",
  "readOnly": true,
  "tableName": "reestr_incoming",
  "originName": "reestr_incoming",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "valueType": "UUID"
    },
    {
      "name": "system",
      "title": "Система",
      "valueType": "STRING",
      "maxLength": 100,
      "required": true
    },
    {
      "name": "user_from",
      "title": "Инициатор",
      "valueType": "STRING",
      "maxLength": 100,
      "required": true
    },
    {
      "name": "body",
      "title": "Тело сообщения",
      "valueType": "TEXT"
    },
    {
      "name": "date_in",
      "title": "Дата получения",
      "valueType": "DATETIME"
    },
    {
      "name": "date_out",
      "title": "Дата отправки",
      "valueType": "DATETIME"
    },
    {
      "name": "status",
      "title": "Статус",
      "valueType": "STRING",
      "maxLength": 20,
      "required": true
    },
    {
      "name": "response_to",
      "title": "Ответ на",
      "valueType": "STRING"
    }
  ]
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'reestr_incoming_schema');


-- outgoing
CREATE TABLE IF NOT EXISTS data.reestr_outgoing
(
    id          uuid                   NOT NULL,
    system      character varying(100) NOT NULL,
    user_to     character varying(100) NOT NULL,
    body        text,
    date_out    timestamp without time zone DEFAULT now(),
    status      character varying(20)  NOT NULL,
    response_to character varying(20),
    CONSTRAINT reestr_outgoing_id_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

INSERT INTO data.schemas (name, class_rule)
SELECT 'reestr_outgoing_schema',
       '{
  "name": "reestr_outgoing",
  "title": "Реестр исходящих сообщений",
  "description": "Схема, описывающая реестр исходящих сообщений. Версия 0.1",
  "readOnly": true,
  "tableName": "reestr_outgoing",
  "originName": "reestr_outgoing",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "valueType": "UUID"
    },
    {
      "name": "system",
      "title": "Система",
      "valueType": "STRING"
    },
    {
      "name": "user_to",
      "title": "Получатель",
      "valueType": "STRING",
      "maxLength": 100
    },
    {
      "name": "body",
      "title": "Тело сообщения",
      "valueType": "TEXT"
    },
    {
      "name": "date_out",
      "title": "Дата отправки",
      "valueType": "DATETIME"
    },
    {
      "name": "status",
      "title": "Статус",
      "valueType": "STRING",
      "maxLength": 20
    },
    {
      "name": "response_to",
      "title": "Ответ на",
      "valueType": "STRING"
    }
  ]
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'reestr_outgoing_schema');
