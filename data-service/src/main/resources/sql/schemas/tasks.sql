INSERT INTO data.schemas (name, class_rule)
SELECT 'tasks_schema_v1',
       '{
  "name": "tasks_schema_v1",
  "tags": ["system", "Задачи"],
  "title": "Схема задач",
  "styleName": "tasks_schema_v1",
  "tableName": "tasks",
  "originName": "tasks",
  "description": "Реестр системных и настраиваемых задач",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "valueType": "INT"
    },
    {
      "name": "type",
      "title": "Тип задачи",
      "valueType": "CHOICE",
      "enumerations": [
        {
          "title": "Назначаемая",
          "value": "ASSIGNABLE"
        },
        {
          "title": "Настраиваемая",
          "value": "CUSTOM"
        },
        {
          "title": "Системная",
          "value": "SYSTEM"
        }
      ]
    },
    {
      "name": "content_type_id",
      "title": "Вид документа",
      "display": "radiogroup",
      "minWidth": 300,
      "readOnly": true,
      "maxLength": 50,
      "valueType": "CHOICE",
      "enumerations": [
        {
          "value": "common_task",
          "title": "Системная задача 1"
        },
        {
          "value": "inbox_data",
          "title": "Настраиваемая задача. Внесение и регистрация документов в ГИСОГД РК"
        }
      ]
    },
    {
      "name": "status",
      "title": "Статус задачи",
      "valueType": "CHOICE",
      "enumerations": [
        {
          "value": "DONE",
          "title": "Выполнена"
        },
        {
          "value": "CANCELED",
          "title": "Отменена"
        },
        {
          "value": "CREATED",
          "title": "Создана"
        },
        {
          "value": "IN_PROGRESS",
          "title": "В работе"
        }
      ]
    },
    {
      "name": "description",
      "title": "Описание",
      "valueType": "STRING"
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "readOnly": true,
      "valueType": "STRING"
    },
    {
      "name": "last_modified",
      "title": "Дата изменения",
      "readOnly": true,
      "valueType": "STRING"
    },
    {
      "name": "assigned_to",
      "title": "Исполнитель",
      "onlySubordinates": true,
      "valueType": "USER_ID"
    },
    {
      "name": "owner_id",
      "title": "Начальник",
      "readOnly": true,
      "valueType": "USER_ID"
    },
    {
      "name": "due_date",
      "title": "Срок исполнения",
      "valueType": "DATETIME"
    },
    {
      "name": "guid",
      "hidden": true,
      "required": true
    },
    {
      "name": "inbox_data_key_data_connection",
      "title": "Реестр учета сведений",
      "multiple": true,
      "libraries": [
        "dl_data_inbox_data"
      ],
      "valueType": "DOCUMENT",
      "maxDocuments": 10
    },
    {
      "name": "data_section_key_data_connection",
      "title": "Реестр учета сведений",
      "multiple": true,
      "libraries": [
        "dl_data_section1",
        "dl_data_section2",
        "dl_data_section3",
        "dl_data_section4",
        "dl_data_section5",
        "dl_data_section6",
        "dl_data_section7",
        "dl_data_section8",
        "dl_data_section9",
        "dl_data_section10",
        "dl_data_section11",
        "dl_data_section12",
        "dl_data_section13",
        "dl_data_section14",
        "dl_data_section15",
        "dl_data_section16",
        "dl_data_section17",
        "dl_data_section18"
      ],
      "valueType": "DOCUMENT",
      "maxDocuments": 18
    }
  ],
  "contentTypes": [
    {
      "id": "common_task",
      "type": "DOCUMENT",
      "title": "Системная задача 1",
      "childOnly": true,
      "attributes": [
        {
          "name": "id",
          "hidden": true
        },
        {
          "name": "content_type_id",
          "hidden": true
        },
        {
          "name": "status",
          "hidden": true
        },
        {
          "name": "owner_id",
          "required": true
        },
        {
          "name": "assigned_to",
          "required": true
        },
        {
          "name": "due_date"
        },
        {
          "name": "created_at"
        },
        {
          "name": "last_modified"
        }
      ]
    },
    {
      "id": "inbox_data",
      "type": "DOCUMENT",
      "title": "Настраиваемая задача. Внесение и регистрация документов в ГИСОГД РК",
      "attributes": [
        {
          "name": "id",
          "hidden": true
        },
        {
          "name": "content_type_id",
          "hidden": true
        },
        {
          "name": "status",
          "hidden": true
        },
        {
          "name": "owner_id",
          "required": true
        },
        {
          "name": "assigned_to",
          "required": true
        },
        {
          "name": "due_date"
        },
        {
          "name": "guid"
        },
        {
          "name": "created_at"
        },
        {
          "name": "last_modified"
        },
        {
          "name": "inbox_data_key_data_connection"
        },
        {
          "name": "data_section_key_data_connection"
        }
      ]
    }
  ],
  "geometryType": "MultiPolygon"
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'tasks_schema_v1');
