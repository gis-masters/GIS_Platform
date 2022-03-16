INSERT INTO data.schemas (name, class_rule)
SELECT 'schema_for_test_table',
       '{
  "name": "schema_for_test_table",
  "title": "Схема для тестов",
  "description": "Схема для тестов",
  "tableName": "test_table",
  "properties": [
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
    }
  ]
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'schema_for_test_table');
