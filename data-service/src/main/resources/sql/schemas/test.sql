INSERT INTO data.schemas (name, class_rule)
SELECT 'schema_for_test_table',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'schema_for_test_table');

INSERT INTO data.schemas (name, class_rule)
SELECT 'advertising_point_simf_2022',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'advertising_point_simf_2022');


UPDATE data.schemas
SET class_rule        =
        '{
          "name": "schema_for_test_table",
          "title": "Схема для тестов",
          "description": "Схема для тестов",
          "tableName": "test_table",
          "tags": [
            "system",
            "Тестовые"
          ],
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
              "name": "some_files",
              "title": "Field multiple files",
              "valueType": "FILE",
              "multiple": true
            },
            {
              "name": "one_file",
              "title": "Field single file",
              "valueType": "FILE"
            },
            {
              "name": "shape",
              "title": "Поле для геометрии",
              "hidden": true,
              "valueType": "GEOMETRY"
            },
            {
              "name": "calc_area",
              "title": "Авто площадь, м",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "calc_length",
              "title": "Авто длинна, м",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_length"
            }
          ],
          "geometryType": "MultiPolygon"
        }',
    calculated_fields = 'var results = {};
       results.objectname = obj.objectname + ''_test_''+ obj.objectid;
              return results;'
WHERE name = 'schema_for_test_table';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "advertising_point_simf_2022",
          "title": "Рекламные конструкции города Симферополь",
          "readOnly": true,
          "tableName": "advertising_point_simf_2022",
          "originName": "advertising_point_simf_2022",
          "tags": [
            "system",
            "Тестовые"
          ],
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Модульная малая двухсторонняя",
                  "value": "510000001"
                },
                {
                  "title": "Модульная малая односторонняя",
                  "value": "510000002"
                },
                {
                  "title": "Отдельно стоящий короб",
                  "value": "510000003"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "location",
              "title": "Местоположение (адресное описание)",
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
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "geometryType": "Point"
        }'
WHERE name = 'advertising_point_simf_2022';
