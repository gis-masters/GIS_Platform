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
    is_folder       boolean   NOT NULL default false,
    path            text,
    created_at      timestamp without time zone,
    last_modified   timestamp without time zone,
    created_by      character varying(50),
    CONSTRAINT dl_default_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

INSERT INTO data.dl_default(title, is_folder, created_at, last_modified, created_by)
SELECT 'System root directory', true, now(), now(), 'fiz@migration'
WHERE NOT EXISTS(SELECT id FROM data.dl_default WHERE title = 'System root directory');

INSERT INTO data.doc_libraries(title, table_name, created_at, last_modified, created_by)
SELECT 'System root directory', '', now(), now(), 'fiz@migration'
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE title = 'System root directory');

INSERT INTO data.doc_libraries(title, table_name, created_at, last_modified, created_by)
SELECT 'Тестовая библиотека', 'Тестовая библиотека с отсылкой к таблице dl_default', now(), now(), 'fiz@migration'
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE title = 'System root directory');

INSERT INTO data.doc_libraries(title, details, table_name, schema_id, created_by, created_at, last_modified, path)
SELECT 'Тестовая библиотека',
       'Тестовая библиотека с отсылкой к таблице documents',
       'dl_default',
       'dl_default_schema',
       'fiz@fiz',
       now(),
       now(),
       '/root'
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE table_name = 'dl_default');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_default_schema',
       '{
  "name": "dl_default_schema",
  "title": "Документы ГПЗУ",
  "description": "documents_schema_v1",
  "tableName": "dl_default",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "required": true,
      "hidden": false,
      "valueType": "INT",
      "sequenceNumber": 0
    },
    {
      "name": "title",
      "title": "Заголовок",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 500
    },
    {
      "name": "name",
      "title": "Название",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 254
    },
    {
      "name": "type",
      "title": "Тип",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 50
    },
    {
      "name": "size",
      "title": "Размер в kb",
      "required": true,
      "hidden": false,
      "valueType": "INT",
      "sequenceNumber": 0
    },
    {
      "name": "inner_path",
      "title": "Где лежит",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "required": true,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "last_modified",
      "title": "Дата последней модификации",
      "required": true,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "created_by",
      "title": "Создатель",
      "required": true,
      "hidden": false,
      "objectIdentityOnUi": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 50
    },
    {
      "name": "category",
      "title": "Категории/Теги",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 254
    },
    {
      "name": "content_type_id",
      "title": "Идентификатор контент типа",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 50
    },
    {
      "name": "is_folder",
      "title": "Признак раздела",
      "required": true,
      "hidden": false,
      "valueType": "BOOLEAN",
      "sequenceNumber": 0
    },
    {
      "name": "path",
      "title": "Полный путь, отражающий иерархию обьектов",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "binary",
      "required": true,
      "valueType": "BINARY",
      "sequenceNumber": 2
    },
    {
      "name": "oktmo",
      "title": "ОКТМО",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 11
    },
    {
      "name": "intents",
      "title": "System intents",
      "required": false,
      "hidden": true,
      "valueType": "STRING",
      "maxLength": 500
    }
  ],
  "contentTypes": [
    {
      "id": "doc_v1",
      "type": "DOCUMENT",
      "title": "Документ первого типа",
      "icon": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true,
          "hidden": false,
          "valueType": "STRING",
          "sequenceNumber": 0,
          "maxLength": 500
        },
        {
          "name": "binary",
          "title": "Выбор файла",
          "required": true,
          "valueType": "BINARY",
          "sequenceNumber": 2
        }
      ]
    },
    {
      "id": "doc_v3",
      "type": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true,
          "hidden": false,
          "valueType": "STRING",
          "sequenceNumber": 0,
          "maxLength": 500
        }
      ]
    },
    {
      "id": "doc_v2",
      "type": "DOCUMENT",
      "title": "Документ ГПЗУ",
      "icon": "GPZU",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true,
          "hidden": false,
          "valueType": "STRING",
          "sequenceNumber": 0,
          "maxLength": 500
        },
        {
          "name": "category",
          "title": "Теги",
          "required": true,
          "hidden": false,
          "valueType": "STRING",
          "sequenceNumber": 0,
          "maxLength": 254
        },
        {
          "name": "binary",
          "title": "Выбор файла",
          "required": true,
          "valueType": "BINARY",
          "sequenceNumber": 2
        }
      ]
    },
    {
      "id": "folder_v1",
      "type": "FOLDER",
      "attributes": [
        {
          "name": "title",
          "title": "Название раздела",
          "required": true,
          "hidden": false,
          "valueType": "STRING",
          "sequenceNumber": 0,
          "maxLength": 500
        },
        {
          "name": "oktmo",
          "title": "ОКТМО",
          "required": true,
          "valueType": "STRING",
          "sequenceNumber": 1,
          "maxLength": 11
        }
      ]
    }
  ]
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_default_schema');
