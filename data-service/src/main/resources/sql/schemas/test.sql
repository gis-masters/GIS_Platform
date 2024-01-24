INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_default_schema',
       '{
  "name": "dl_default_schema",
  "title": "Документы ГПЗУ",
  "description": "documents_schema_v1",
  "tags": [
    "system", "Приказ 10"
  ],
  "tableName": "dl_default",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "required": true,
      "hidden": false,
      "valueType": "INT"
    },
    {
      "name": "title",
      "title": "Заголовок",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 500
    },
    {
      "name": "name",
      "title": "Название",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 254
    },
    {
      "name": "type",
      "title": "Тип",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "size",
      "title": "Размер в kb",
      "required": true,
      "hidden": false,
      "valueType": "INT"
    },
    {
      "name": "inner_path",
      "title": "Где лежит",
      "required": true,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "required": true,
      "hidden": false,
      "valueType": "DATETIME"
    },
    {
      "name": "last_modified",
      "title": "Дата последней модификации",
      "required": true,
      "hidden": false,
      "valueType": "DATETIME"
    },
    {
      "name": "created_by",
      "title": "Создатель",
      "required": true,
      "hidden": false,
      "objectIdentityOnUi": false,
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "updated_by",
      "title": "Редактор",
      "required": true,
      "hidden": false,
      "objectIdentityOnUi": false,
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "category",
      "title": "Категории/Теги",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 254
    },
    {
      "name": "content_type_id",
      "title": "Идентификатор контент типа",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "is_folder",
      "title": "Признак раздела",
      "required": true,
      "hidden": false,
      "valueType": "BOOLEAN"
    },
    {
      "name": "path",
      "title": "Полный путь, отражающий иерархию обьектов",
      "required": true,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "oktmo",
      "title": "ОКТМО",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 11
    },
    {
      "name": "intents",
      "title": "System intents",
      "required": false,
      "hidden": true,
      "valueType": "STRING",
      "maxLength": 500
    },
    {
      "name": "native_crs",
      "title": "nativeCRS",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 11
    },
    {
      "name": "some_files",
      "title": "Any user title here",
      "required": false,
      "hidden": false,
      "valueType": "FILE",
      "multiple": true
    },
    {
      "name": "one_file",
      "title": "Any user title here",
      "required": false,
      "hidden": false,
      "valueType": "FILE",
      "multiple": false
    },
    {
      "name": "test",
      "title": "Not exist in database property",
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
          "sequenceNumber": 0,
          "maxLength": 500
        },
        {
          "name": "binary",
          "title": "Выбор файла",
          "required": true,
          "sequenceNumber": 2
        },
        {
          "name": "native_crs",
          "required": false,
          "hidden": false
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
          "required": true,
          "hidden": false,
          "sequenceNumber": 0
        },
        {
          "name": "category",
          "title": "Теги",
          "required": true,
          "hidden": false,
          "sequenceNumber": 1
        },
        {
          "name": "binary",
          "title": "Выбор файла",
          "required": true,
          "sequenceNumber": 2
        },
        {
          "name": "native_crs",
          "required": false,
          "hidden": false,
          "sequenceNumber": 3
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
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_default_schema');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_zu_schema',
       '{
  "name": "dl_zu_schema",
  "title": "Земельные участки",
  "readOnly": false,
  "tableName": "dl_zu",
  "originName": "dl_zu",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "required": true,
      "hidden": false,
      "valueType": "INT"
    },
    {
      "name": "is_folder",
      "title": "Признак раздела",
      "required": false,
      "hidden": false,
      "valueType": "BOOLEAN"
    },
    {
      "name": "path",
      "title": "Полный путь, отражающий иерархию объектов",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 555
    },
    {
      "name": "title",
      "title": "Наименование документа",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 500
    },
    {
      "name": "content_type_id",
      "title": "Идентификатор контент типа",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 50
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "required": true,
      "hidden": false,
      "valueType": "DATETIME"
    },
    {
      "name": "cadastralnumber",
      "title": "Кадастровый номер",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "name",
      "title": "Наименование",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "surname",
      "title": "Фамилия",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "first",
      "title": "Имя",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "patronymic",
      "title": "Отчество",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "datebirth",
      "title": "Дата рождения",
      "required": false,
      "hidden": false,
      "valueType": "DATETIME"
    },
    {
      "name": "place_birth",
      "title": "Место рождения",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "code_document",
      "title": "Код документа",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "name4",
      "title": "Наименование документа",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "series",
      "title": "Серия документа",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "number",
      "title": "Номер документа",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "date",
      "title": "Дата выдачи документа",
      "required": false,
      "hidden": false,
      "valueType": "DATETIME"
    },
    {
      "name": "issueorgan",
      "title": "Кем выдан документ",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "issueorgan_code",
      "title": "Код органа выдавшего документ",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "note",
      "title": "Примечание",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "e_mail",
      "title": "E_mail",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "phone",
      "title": "Телефон",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "citizenship",
      "title": "Гражданство",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "snils",
      "title": "СНИЛС",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "regnumber82",
      "title": "Регистрационный номер",
      "required": false,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "regdate83",
      "title": "Дата постановки на учет/ регистрации",
      "required": false,
      "hidden": false,
      "valueType": "DATETIME"
    },
    {
      "name": "dateclose",
      "title": "Дата снятия с учета/регистрации",
      "required": false,
      "hidden": false,
      "valueType": "DATETIME"
    }
  ],
  "description": "Земельные участки",
  "geometryType": "MultiPolygon",
  "customRuleFunction": null
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_zu_schema');

INSERT INTO data.schemas (name, class_rule, calculated_fields)
SELECT 'schema_for_test_table',
       '{
  "name": "schema_for_test_table",
  "title": "Схема для тестов",
  "readOnly": false,
  "description": "Схема для тестов",
  "tableName": "test_table",
  "properties": [
    {
      "name": "objectname",
      "title": "Наименование объекта",
      "required": true,
      "valueType": "STRING"
    },
    {
      "name": "title",
      "title": "Заголовок",
      "required": true,
      "hidden": false,
      "valueType": "STRING"
    },
    {
      "name": "oktmo",
      "title": "ОКТМО",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "maxLength": 11
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
      "name": "some_files",
      "title": "Field multiple files",
      "required": false,
      "hidden": false,
      "valueType": "FILE",
      "multiple": true
    },
    {
      "name": "one_file",
      "title": "Field single file",
      "required": false,
      "hidden": false,
      "valueType": "FILE",
      "multiple": false
    },
    {
      "name": "shape",
      "title": "Поле для геометрии",
      "hidden": true,
      "required": false,
      "valueType": "GEOMETRY"
    },
    {
      "name": "calc_area",
      "title": "Авто площадь, м",
      "hidden": false,
      "required": false,
      "valueType": "DOUBLE",
      "totalDigits": 38,
      "fractionDigits": 2,
      "calculatedValueWellKnownFormula": "st_area"
    },
    {
      "name": "calc_length",
      "title": "Авто длинна, м",
      "hidden": false,
      "required": false,
      "valueType": "DOUBLE",
      "totalDigits": 38,
      "fractionDigits": 2,
      "calculatedValueWellKnownFormula": "st_length"
    }
  ],
   "geometryType": "MultiPolygon",
   "customRuleFunction": null
}',
       'var results = {};
       results.objectname = obj.objectname + ''_test_''+ obj.objectid;
       return results;'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'schema_for_test_table');

INSERT INTO data.schemas (name, class_rule)
SELECT 'advertising_point_simf_2022',
       '{
  "name": "advertising_point_simf_2022",
  "title": "Рекламные конструкции города Симферополь",
  "readOnly": true,
  "tableName": "advertising_point_simf_2022",
  "originName": "advertising_point_simf_2022",
  "properties": [
    {
      "name": "classid",
      "title": "Код объекта",
      "hidden": false,
      "multiple": false,
      "required": true,
      "valueType": "CHOICE",
      "enumerations": [
        {
          "title": "Модульная малая двухсторонняя ",
          "value": "510000001"
        },
        {
          "title": "Модульная малая односторонняя ",
          "value": "510000002"
        },
        {
          "title": "Отдельно стоящий короб ",
          "value": "510000003"
        }
      ],
      "allowedValues": [],
      "foreignKeyType": "STRING"
    },
    {
      "name": "location",
      "title": "Местоположение (адресное описание)",
      "hidden": false,
      "multiple": false,
      "required": false,
      "valueType": "STRING"
    },
    {
      "name": "photo",
      "title": "Фотофиксация (фотомонтаж)",
      "valueType": "FILE",
      "multiple": true,
      "maxSize": 50000000
    },
    {
      "name": "shape",
      "title": "Some title",
      "hidden": false,
      "multiple": false,
      "required": false,
      "valueType": "GEOMETRY",
      "allowedValues": [
        "Point"
      ]
    }
  ],
  "description": "Рекламные конструкции города Симферополь",
  "geometryType": "Point",
  "customRuleFunction": null
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'advertising_point_simf_2022');
