ALTER TABLE data.reestrs
ADD COLUMN IF NOT EXISTS created_by character varying,
ADD COLUMN IF NOT EXISTS created_at timestamp without time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_modified timestamp without time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS UPDATEd_by character varying;

ALTER TABLE data.reestr_outgoing
ALTER COLUMN response_to TYPE character varying(50),
ADD COLUMN IF NOT EXISTS created_by character varying,
ADD COLUMN IF NOT EXISTS created_at timestamp without time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_modified timestamp without time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS UPDATEd_by character varying;

ALTER TABLE data.reestr_incoming
ALTER COLUMN response_to TYPE character varying(50),
ADD COLUMN IF NOT EXISTS created_by character varying,
ADD COLUMN IF NOT EXISTS created_at timestamp without time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_modified timestamp without time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS UPDATEd_by character varying;

UPDATE data.schemas
SET class_rule = '{
  "name": "reestr_common_schema",
  "title": "Реестры сообщений",
  "description": "Общая схема, описывающая модель реестров. Версия 0.2",
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
      "hidden": true,
      "valueType": "STRING"
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "hidden": true,
      "valueType": "DATETIME"
    },
    {
      "name": "last_modified",
      "title": "Дата последнего изменения",
      "hidden": true,
      "valueType": "DATETIME"
    },
    {
      "name": "updated_by",
      "hidden": true,
      "title": "Модифицировано",
      "valueType": "STRING"
    }
  ]
}'
WHERE name LIKE 'reestr_common_schema';

UPDATE data.schemas
SET class_rule = '{
  "name": "reestr_incoming_schema",
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
    },
    {
      "name": "created_by",
      "title": "Создано",
      "hidden": true,
      "valueType": "STRING"
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "hidden": true,
      "valueType": "DATETIME"
    },
    {
      "name": "last_modified",
      "title": "Дата последнего изменения",
      "hidden": true,
      "valueType": "DATETIME"
    },
    {
      "name": "updated_by",
      "title": "Модифицировано",
      "hidden": true,
      "valueType": "STRING"
    }
  ]
}'
WHERE name LIKE 'reestr_incoming_schema';

UPDATE data.schemas
SET class_rule = '{
  "name": "reestr_outgoing_schema",
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
    },
    {
      "name": "created_by",
      "title": "Создано",
      "hidden": true,
      "valueType": "STRING"
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "hidden": true,
      "valueType": "DATETIME"
    },
    {
      "name": "last_modified",
      "title": "Дата последнего изменения",
      "hidden": true,
      "valueType": "DATETIME"
    },
    {
      "name": "updated_by",
      "title": "Модифицировано",
      "hidden": true,
      "valueType": "STRING"
    }
  ]
}'
WHERE name LIKE 'reestr_outgoing_schema';
