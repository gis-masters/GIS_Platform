-- ALTER TABLE IF EXISTS data.schemas_and_tables DROP COLUMN IF EXISTS schema_id;
ALTER TABLE IF EXISTS data.schemas_and_tables
    ADD COLUMN IF NOT EXISTS schema jsonb;

-- ALTER TABLE IF EXISTS data.doc_libraries DROP COLUMN IF EXISTS schema_id;
ALTER TABLE IF EXISTS data.doc_libraries
    ADD COLUMN IF NOT EXISTS schema jsonb;

UPDATE data.doc_libraries
SET schema = '{
  "name": "dl_default_schema",
  "title": "Документы ГПЗУ",
  "description": "documents_schema_v1",
  "tableName": "dl_default",
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
      "valueType": "STRING",
      "maxLength": 500
    },
    {
      "name": "name",
      "title": "Название",
      "valueType": "STRING"
    },
    {
      "name": "type",
      "title": "Тип",
      "valueType": "STRING",
      "maxLength": 50
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
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "updated_by",
      "title": "Редактор",
      "required": true,
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "category",
      "title": "Категории/Теги",
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
      "name": "oktmo",
      "title": "ОКТМО",
      "required": true,
      "valueType": "STRING",
      "maxLength": 11
    },
    {
      "name": "intents",
      "title": "System intents",
      "hidden": true,
      "valueType": "STRING",
      "maxLength": 500
    },
    {
      "name": "native_crs",
      "title": "nativeCRS",
      "valueType": "STRING",
      "maxLength": 11
    },
    {
      "name": "some_files",
      "title": "Any user title here",
      "valueType": "FILE",
      "multiple": true
    },
    {
      "name": "one_file",
      "title": "Any user title here",
      "valueType": "FILE"
    },
    {
      "name": "test",
      "title": "Not exist in database property",
      "hidden": true,
      "valueType": "STRING",
      "maxLength": 500
    }
  ],
  "contentTypes": [
    {
      "id": "doc_v1",
      "type": "DOCUMENT",
      "title": "Документ 1",
      "icon": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true
        },
        {
          "name": "native_crs"
        }
      ]
    },
    {
      "id": "doc_v2",
      "type": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Короткое название файла",
          "required": true,
          "maxLength": 5
        }
      ]
    },
    {
      "id": "doc_v3",
      "type": "DOCUMENT",
      "title": "Документ ГПЗУ",
      "icon": "GPZU",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true
        },
        {
          "name": "category",
          "title": "Теги",
          "required": true
        },
        {
          "name": "native_crs"
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
          "title": "Картинки котиков"
        },
        {
          "name": "one_file",
          "title": "Одинокое фото собаки"
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
    },
    {
      "id": "folder_v2",
      "type": "FOLDER",
      "title": "Раздел 314",
      "attributes": [
        {
          "name": "title",
          "required": true,
          "maxLength": 20
        }
      ]
    }
  ]
}'
WHERE table_name = 'dl_default';