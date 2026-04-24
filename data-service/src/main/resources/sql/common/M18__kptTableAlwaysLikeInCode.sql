--Необходимо поддерживать схему миграции и состав колонок в соответствии с kpt.sql
UPDATE data.doc_libraries
SET schema = '{
  "name": "dl_data_kpt",
  "tags": [
    "system",
    "КПТ",
    "Библиотека"
  ],
  "title": "КПТ",
  "readOnly": false,
  "tableName": "dl_data_kpt",
  "properties": [
    {
      "name": "id",
      "title": "Номер",
      "readOnly": true,
      "valueType": "LONG",
      "description": "Заполняется автоматически",
      "maxDefaultWidth": 105
    },
    {
      "name": "content_type_id",
      "title": "Вид документа",
      "hidden": true,
      "valueType": "STRING"
    },
    {
      "name": "title",
      "title": "Наименование",
      "minWidth": 400,
      "required": true,
      "valueType": "STRING"
    },
    {
      "name": "location",
      "title": "Местоположение",
      "valueType": "STRING"
    },
    {
      "name": "cad_block_num",
      "title": "Кадастровый квартал",
      "readOnly": true,
      "valueType": "STRING",
      "description": "Заполняется автоматически при импорте КПТ в слой."
    },
    {
      "name": "date_received_request",
      "title": "Дата",
      "readOnly": true,
      "valueType": "DATETIME",
      "description": "Дата предоставления кадастровых сведений Росреестра (КПТ). Заполняется автоматически при импорте КПТ в слой."
    },
    {
      "name": "file",
      "title": "КПТ",
      "maxSize": 90000000,
      "maxFiles": 1,
      "readOnly": true,
      "valueType": "FILE"
    },
    {
      "name": "note",
      "title": "Примечание",
      "valueType": "STRING"
    },
    {
      "name": "created_by",
      "title": "Создатель",
      "readOnly": true,
      "valueType": "STRING",
      "description": "Пользователь создавший объект (Заполняется автоматически)"
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "readOnly": true,
      "valueType": "DATETIME",
      "description": "Дата создания объекта (Заполняется автоматически)"
    },
    {
      "name": "updated_by",
      "title": "Редактор",
      "hidden": true,
      "readOnly": true,
      "valueType": "STRING",
      "description": "Пользователь редактировавший объект последним (Заполняется автоматически)"
    },
    {
      "name": "last_modified",
      "title": "Дата редактирования",
      "hidden": true,
      "readOnly": true,
      "valueType": "DATETIME",
      "description": "Дата последнего редактирования объекта (Заполняется автоматически)"
    },
    {
      "name": "is_folder",
      "title": "Папка/Документ",
      "valueType": "BOOLEAN",
      "description": "Папка или Документ",
      "defaultValue": false
    },
    {
      "name": "path",
      "title": "Путь",
      "minWidth": 250,
      "valueType": "TEXT",
      "description": "Полный путь, отражающий иерархию объектов",
      "defaultValue": "/root"
    }
  ],
  "description": "КПТ",
  "contentTypes": [
    {
      "id": "Карточка",
      "icon": "DOCUMENT",
      "type": "DOCUMENT",
      "title": "Карточка документа",
      "childOnly": true,
      "attributes": [
        {
          "name": "title"
        },
        {
          "name": "location",
          "description": "Наследуется от папки",
          "defaultValueWellKnownFormula": "inherit"
        },
        {
          "name": "cad_block_num"
        },
        {
          "name": "file"
        },
        {
          "name": "date_received_request"
        },
        {
          "name": "note"
        }
      ]
    },
    {
      "id": "folder_v1",
      "icon": "FOLDER_CREATE",
      "type": "FOLDER",
      "title": "Папку",
      "attributes": [
        {
          "name": "title"
        },
        {
          "name": "location"
        },
        {
          "name": "note"
        }
      ]
    }
  ]
}'
WHERE table_name LIKE 'dl_data_kpt';

ALTER TABLE IF EXISTS data.dl_data_kpt
    ADD COLUMN IF NOT EXISTS date_received_request timestamp without time zone,
    ADD COLUMN IF NOT EXISTS cad_block_num character varying;
