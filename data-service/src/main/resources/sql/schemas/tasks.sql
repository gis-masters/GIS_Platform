INSERT INTO data.schemas (name, class_rule)
SELECT 'tasks_schema_v1',
'{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'tasks_schema_v1');

-- Схема должна соответствовать таблице: M1__initServiceTables.sql:347
UPDATE data.schemas 
SET class_rule =
       '{
         "name": "tasks_schema_v1",
         "tags": [
           "system",
           "Задачи"
         ],
         "title": "Схема задач",
         "tableName": "tasks",
         "description": "Реестр системных и настраиваемых задач",
         "originName": "tasks",
         "readOnly": false,
         "geometryType": "MultiPolygon",
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
                 "value": "ASSIGNABLE",
                 "title": "Назначаемая"
               },
               {
                 "value": "CUSTOM",
                 "title": "Настраиваемая"
               },
               {
                 "value": "SYSTEM",
                 "title": "Системная"
               }
             ]
           },
           {
             "name": "content_type_id",
             "title": "Вид документа",
             "readOnly": true,
             "display": "radiogroup",
             "maxLength": 50,
             "minWidth": 300,
             "valueType": "CHOICE",
             "enumerations": [
               {
                 "value": "common_task",
                 "title": "Системная задача 1"
               },
               {
                 "value": "inbox_data",
                 "title": "Настраиваемая задача. Внесение и регистрация документов в ГИСОГД РК"
               },
               {
                 "value": "common_task_kpt_import",
                 "title": "Обновление данных в слоях КПТ"
               },
               {
                 "value": "common_task_kpt_order",
                 "title": "Заказ КПТ из ФГИС ЕГРН"
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
             "title": "guid",
             "hidden": true,
             "valueType": "UUID"
           },
           {
             "name": "inbox_data_key_data_connection",
             "title": "Библиотека КПТ",
             "multiple": true,
             "libraries": [
               "dl_data_kpt"
             ],
             "maxDocuments": 10,
             "valueType": "DOCUMENT"
           },
           {
             "name": "data_section_key_data_connection",
             "title": "Связь с библиотеками",
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
             "maxDocuments": 18,
             "valueType": "DOCUMENT"
           },
           {
             "name": "created_by",
             "title": "Создано",
             "hidden": true,
             "valueType": "STRING"
           },
           {
             "name": "updated_by",
             "hidden": true,
             "title": "Модифицировано",
             "valueType": "STRING"
           },
           {
             "name": "created_at",
             "title": "Дата создания",
             "readOnly": true,
             "valueType": "DATETIME"
           },
           {
             "name": "last_modified",
             "title": "Дата последнего изменения",
             "readOnly": true,
             "valueType": "DATETIME"
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
             "childOnly": false,
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
           },
           {
             "id": "common_task_kpt_import",
             "type": "DOCUMENT",
             "title": "Обновление данных в слоях КПТ",
             "childOnly": false,
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
           },
           {
             "id": "common_task_kpt_order",
             "type": "DOCUMENT",
             "title": "Заказ КПТ из ФГИС ЕГРН",
             "childOnly": false,
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
         ]
       }'
WHERE name = 'tasks_schema_v1';
