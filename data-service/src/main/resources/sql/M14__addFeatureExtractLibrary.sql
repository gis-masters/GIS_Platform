CREATE TABLE IF NOT EXISTS data.dl_feature_extract (
  id              bigserial NOT NULL,
  title           character varying(500) NOT NULL,
  map             jsonb,
  layer           character varying,
  feature_id      character varying,
  feature_url     character varying(1000),
  feature         text,
  is_folder       boolean NOT NULL default false,
  path            character varying,
  content_type_id character varying(50),
  intents         character varying(500),
  created_by      character varying(50),
  created_at      timestamp without time zone,
  last_modified   timestamp without time zone,
  CONSTRAINT dl_feature_extract_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

INSERT INTO data.schemas (name, class_rule)
SELECT 'feature_extract', '{
  "name": "feature_extract",
  "title": "Выписки об объектах",
  "tableName": "dl_feature_extract",
  "properties": [
    {
      "name": "title",
      "title": "Название",
      "valueType": "STRING",
      "required": true,
      "maxLength": 500
    },
    {
      "name": "map",
      "title": "Карта",
      "valueType": "FILE",
      "required": true,
      "readOnly": true
    },
    {
      "name": "layer",
      "title": "Слой",
      "valueType": "STRING",
      "maxLength": 255,
      "readOnly": true
    },
    {
      "name": "feature_id",
      "title": "ID объекта",
      "valueType": "STRING",
      "maxLength": 255,
      "readOnly": true
    },
    {
      "name": "feature_url",
      "title": "Ссылка на объект",
      "valueType": "STRING",
      "maxLength": 1000,
      "readOnly": true
    },
    {
      "name": "feature",
      "title": "GeoJSON объекта",
      "valueType": "STRING",
      "display": "code",
      "readOnly": true
    },
    {
      "name": "is_folder",
      "title": "Раздел",
      "required": true,
      "valueType": "BOOLEAN"
    },
    {
      "name": "path",
      "title": "Системный путь",
      "required": true,
      "valueType": "STRING"
    },
    {
      "name": "content_type_id",
      "title": "Идентификатор контент типа",
      "required": true,
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "created_by",
      "title": "Создатель",
      "required": true,
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "required": true,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "last_modified",
      "title": "Дата редактирования",
      "required": true,
      "valueType": "DATETIME"
    }
  ],
  "contentTypes": [
    {
      "id": "base_extract",
      "type": "DOCUMENT",
      "title": "Стандартная выписка",
      "icon": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Название",
          "valueType": "STRING",
          "maxLength": 500
        },
        {
          "name": "map",
          "title": "Карта",
          "valueType": "FILE",
          "required": true,
          "readOnly": true
        },
        {
          "name": "layer",
          "title": "Слой",
          "valueType": "STRING",
          "maxLength": 255,
          "readOnly": true
        },
        {
          "name": "feature_id",
          "title": "ID объекта",
          "valueType": "STRING",
          "maxLength": 255,
          "readOnly": true
        },
        {
          "name": "feature_url",
          "title": "Ссылка на объект",
          "valueType": "STRING",
          "maxLength": 1000,
          "readOnly": true
        },
        {
          "name": "feature",
          "title": "GeoJSON объекта",
          "valueType": "STRING",
          "display": "code",
          "readOnly": true
        }
      ]
    }
  ]
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'feature_extract');

INSERT INTO
  data.doc_libraries(
    title,
    details,
    table_name,
    schema_id,
    created_by,
    created_at,
    last_modified
)
SELECT
  'Выписки объектов',
  'Выписки данных географических объектов',
  'dl_feature_extract',
  'feature_extract',
  'zakaratcha',
  now(),
  now()
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE table_name = 'dl_feature_extract');
