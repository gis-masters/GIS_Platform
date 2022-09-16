INSERT INTO data.schemas (name, class_rule, calculated_fields)
SELECT 'schema_for_test_table',
       '{
  "name": "schema_for_test_table",
  "title": "Схема для тестов",
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
   "description": "Тестовая схема",
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
      "choice": null,
      "hidden": false,
      "length": -1,
      "pattern": null,
      "multiple": false,
      "required": true,
      "maxLength": -1,
      "minLength": -1,
      "valueType": "CHOICE",
      "whiteSpace": null,
      "description": "",
      "totalDigits": -1,
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
      "maxInclusive": -1,
      "minInclusive": -1,
      "allowedValues": [],
      "updateability": null,
      "foreignKeyType": "STRING",
      "fractionDigits": -1,
      "sequenceNumber": 2,
      "patternDescription": ""
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
      "title": null,
      "choice": null,
      "hidden": false,
      "multiple": false,
      "required": false,
      "valueType": "GEOMETRY",
      "allowedValues": [
        "Point"
      ],
      "updateability": null,
      "fractionDigits": -1,
      "sequenceNumber": 13,
      "patternDescription": ""
    }
  ],
  "description": "Рекламные конструкции города Симферополь",
  "geometryType": "Point",
  "customRuleFunction": null
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'advertising_point_simf_2022');
