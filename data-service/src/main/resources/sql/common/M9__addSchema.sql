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
      "name": "size",
      "title": "Размер в kb",
      "required": true,
      "valueType": "INT"
    },
    {
      "name": "inner_path",
      "title": "Где лежит",
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
      "title": "Документ первого типа",
      "icon": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true,
          "maxLength": 500
        },
        {
          "name": "native_crs"
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
          "maxLength": 100
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
      "id": "folder_v1",
      "type": "FOLDER",
      "attributes": [
        {
          "name": "title"
        }
      ]
    },
    {
      "id": "doc_v4",
      "type": "DOCUMENT",
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
    }
  ]
}'
WHERE table_name = 'dl_default';

UPDATE data.doc_libraries
SET schema = '{
  "name": "dl_zu_schema",
  "title": "Земельные участки",
  "tableName": "dl_zu",
  "originName": "dl_zu",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "required": true,
      "valueType": "INT"
    },
    {
      "name": "is_folder",
      "title": "Папка/Документ",
      "valueType": "BOOLEAN"
    },
    {
      "name": "path",
      "title": "Полный путь, отражающий иерархию объектов",
      "required": true,
      "valueType": "STRING",
      "maxLength": 555
    },
    {
      "name": "title",
      "title": "Наименование документа",
      "required": true,
      "valueType": "STRING",
      "maxLength": 500
    },
    {
      "name": "content_type_id",
      "title": "Идентификатор контент типа",
      "required": true,
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
      "name": "cadastralnumber",
      "title": "Кадастровый номер",
      "valueType": "STRING"
    },
    {
      "name": "name",
      "title": "Наименование",
      "valueType": "STRING"
    },
    {
      "name": "surname",
      "title": "Фамилия",
      "valueType": "STRING"
    },
    {
      "name": "first",
      "title": "Имя",
      "valueType": "STRING"
    },
    {
      "name": "patronymic",
      "title": "Отчество",
      "valueType": "STRING"
    },
    {
      "name": "datebirth",
      "title": "Дата рождения",
      "valueType": "DATETIME"
    },
    {
      "name": "place_birth",
      "title": "Место рождения",
      "valueType": "STRING"
    },
    {
      "name": "code_document",
      "title": "Код документа",
      "valueType": "STRING"
    },
    {
      "name": "name4",
      "title": "Наименование документа",
      "valueType": "STRING"
    },
    {
      "name": "series",
      "title": "Серия документа",
      "valueType": "STRING"
    },
    {
      "name": "number",
      "title": "Номер документа",
      "valueType": "STRING"
    },
    {
      "name": "date",
      "title": "Дата выдачи документа",
      "valueType": "DATETIME"
    },
    {
      "name": "issueorgan",
      "title": "Кем выдан документ",
      "valueType": "STRING"
    },
    {
      "name": "issueorgan_code",
      "title": "Код органа выдавшего документ",
      "valueType": "STRING"
    },
    {
      "name": "note",
      "title": "Примечание",
      "valueType": "STRING"
    },
    {
      "name": "e_mail",
      "title": "E_mail",
      "valueType": "STRING"
    },
    {
      "name": "phone",
      "title": "Телефон",
      "valueType": "STRING"
    },
    {
      "name": "citizenship",
      "title": "Гражданство",
      "valueType": "STRING"
    },
    {
      "name": "snils",
      "title": "СНИЛС",
      "valueType": "STRING"
    },
    {
      "name": "regnumber82",
      "title": "Регистрационный номер",
      "valueType": "STRING"
    },
    {
      "name": "regdate83",
      "title": "Дата постановки на учет/ регистрации",
      "valueType": "DATETIME"
    },
    {
      "name": "dateclose",
      "title": "Дата снятия с учета/регистрации",
      "valueType": "DATETIME"
    }
  ],
  "description": "Земельные участки",
  "geometryType": "MultiPolygon"
}'
WHERE table_name = 'dl_zu';
