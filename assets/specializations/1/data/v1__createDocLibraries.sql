CREATE TABLE IF NOT EXISTS data.dl_fiz
(
    id              bigserial NOT NULL,
    title           character varying(500),
    name            character varying,
    content_type_id character varying,
    is_folder       boolean   NOT NULL DEFAULT false,
    path            text,
    created_at      timestamp without time zone,
    last_modified   timestamp without time zone,
    created_by      character varying(50),
    updated_by      character varying(50),
    some_files      jsonb,
    is_deleted      boolean            DEFAULT false,
    CONSTRAINT dl_fiz_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
ALTER TABLE data.dl_fiz
    OWNER to fiz;

INSERT INTO data.doc_libraries(title, table_name, created_by, created_at, last_modified, path, schema)
SELECT 'Тестовая библиотека 1 специализации',
       'dl_fiz',
       'specialization@migration',
       now(),
       now(),
       '/root',
       '{
          "name": "dl_fiz_schema",
          "title": "Тестовая библиотека 1 специализации",
          "tableName": "dl_fiz",
          "properties": [
            {
              "name": "id",
              "title": "Идентификатор",
              "required": true,
              "valueType": "INT"
            },
            {
              "name": "title",
              "title": "Заголовок",
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "name",
              "title": "Название",
              "valueType": "STRING"
            },
            {
              "name": "content_type_id",
              "title": "Идентификатор контент типа",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "required": true,
              "valueType": "BOOLEAN"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата последней модификации",
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "some_files",
              "title": "Any user title here",
              "multiple": true,
              "valueType": "FILE"
            }
          ],
          "contentTypes": [
            {
              "id": "doc_v1",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Документ",
              "attributes": [
                {
                  "name": "title",
                  "title": "Название файла",
                  "required": true
                }
              ]
            },
            {
              "id": "doc_v4",
              "type": "DOCUMENT",
              "title": "Документ с файлами",
              "attributes": [
                {
                  "name": "title",
                  "title": "Название документа"
                },
                {
                  "name": "some_files",
                  "title": "Картинки"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
              "attributes": [
                {
                  "name": "title"
                }
              ]
            }
          ]
        }'
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE table_name = 'dl_fiz');
