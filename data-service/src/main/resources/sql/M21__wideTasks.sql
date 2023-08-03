ALTER TABLE IF EXISTS data.tasks
    ALTER COLUMN type DROP NOT NULL;

ALTER TABLE IF EXISTS data.tasks
    ALTER COLUMN owner_id DROP NOT NULL;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS guid uuid;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS "number" bigint;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS date timestamp without time zone;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS person_name character varying;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS cover_letter_num character varying;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS cover_letter_date timestamp without time zone;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS request_type character varying;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS is_name character varying;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS data_type character varying;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS record_status character varying;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS user_name character varying;

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS document_library_name character varying(100);

ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS content_type_id character varying(50);


INSERT INTO data.schemas (name, class_rule)
SELECT 'tasks_schema_v1',
       '{
          "name": "tasks_schema_v1",
          "title": "Реестр входящих",
          "description": "Реестр учета сведений, документов, материалов, поступивших на размещение в информационную систему",
          "readOnly": false,
          "tableName": "tasks",
          "originName": "tasks",
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
              "name": "status",
              "title": "Статус задачи",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Выполнена",
                  "value": "DONE"
                },
                {
                  "title": "Отменена",
                  "value": "CANCELED"
                },
                {
                  "title": "Создана",
                  "value": "CREATED"
                },
                {
                  "title": "В работе",
                  "value": "IN_PROGRESS"
                }
              ]
            },
            {
              "name": "description",
              "title": "Описание",
              "valueType": "STRING"
            },
            {
              "name": "owner_id",
              "title": "Начальник",
              "valueType": "USER_ID"
            },
            {
              "name": "assigned_to",
              "title": "Исполнитель",
              "valueType": "USER_ID",
              "onlySubordinates": true
            },
            {
              "name": "due_date",
              "title": "Срок исполнения",
              "valueType": "DATETIME"
            },
            {
              "name": "document_library_name",
              "title": "Связь с библиотекой",
              "valueType": "STRING",
              "maxLength": 100
            },
            {
              "name": "guid",
              "title": "Уникальный идентификатор",
              "valueType": "UUID"
            },
            {
              "name": "number",
              "title": "Номер записи",
              "valueType": "STRING"
            },
            {
              "name": "date",
              "title": "Дата поступления данных на размещение в информационной системе",
              "valueType": "DATETIME"
            },
            {
              "name": "person_name",
              "title": "Информация о лице, направившим данные на размещение в информационной системе",
              "description": "Заполняется наименованием юридического лица или указывается фамилия, имя, отчество (последнее при наличии) для физического лица",
              "valueType": "STRING"
            },
            {
              "name": "cover_letter_num",
              "title": "Исходящий номер сопроводительного письма",
              "valueType": "STRING"
            },
            {
              "name": "cover_letter_date",
              "title": "Исходящая дата сопроводительного письма",
              "valueType": "DATETIME"
            },
            {
              "name": "request_type",
              "title": "Способ направления данных",
              "description": "Код из Справочник 0В из приказа 433",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "0В.1",
                  "value": "Лично"
                },
                {
                  "title": "0В.2",
                  "value": "Почтовое отправление"
                },
                {
                  "title": "0В.З",
                  "value": "Электронная почта"
                },
                {
                  "title": "0В.4",
                  "value": "Многофункциональный центр (МФЦ)"
                },
                {
                  "title": "0В.5",
                  "value": "Единая система межведомственного электронного взаимодействия (ЕСМЭВ)"
                },
                {
                  "title": "0В.6",
                  "value": "Портал государственных услуг (ПГУ)"
                },
                {
                  "title": "0В.7",
                  "value": "Иные"
                }
              ]
            },
            {
              "name": "is_name",
              "title": "Наименование информационной системы, из которой передаются данные",
              "valueType": "STRING"
            },
            {
              "name": "data_type",
              "title": "Форма данных",
              "description": "Код из Справочник 0Е из приказа 433",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "0Е.1",
                  "value": "Бумажная форма"
                },
                {
                  "title": "0Е.2",
                  "value": "Электронная форма"
                }
              ]
            },
            {
              "name": "record_status",
              "title": "Статус",
              "description": "Код из Справочник 0A из приказа 433",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "1.А.1",
                  "value": "Ожидает размещения"
                },
                {
                  "title": "1.А.2",
                  "value": "Размещено"
                },
                {
                  "title": "1.А.3",
                  "value": "Отказано в размещении"
                },
                {
                  "title": "1.А.4",
                  "value": "Частично размещено"
                }
              ]
            },
            {
              "name": "user_name",
              "title": "Уполномоченный",
              "description": "Фамилия, имя, отчество (последнее при наличии) уполномоченного лица, органа, осуществляющего ведение информационной системы, или наименование автоматического сервиса программных редств информационной системы, обработавшего данные, поступившие на размещение в информационную систему",
              "valueType": "STRING"
            },
            {
              "name": "content_type_id",
              "title": "Тип документа",
              "valueType": "STRING",
              "maxLength": 50
            }
          ],
          "contentTypes": [
            {
              "id": "common_task",
              "type": "DOCUMENT",
              "title": "Задачи",
              "attributes": [
                {
                  "name": "id",
                  "hidden": true
                },
                {
                  "name": "description"
                },
                {
                  "name": "type",
                  "required": true
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
                  "name": "assigned_to"
                },
                {
                  "name": "due_date"
                }
              ]
            },
            {
              "id": "InboxData",
              "type": "DOCUMENT",
              "title": "Реестр входящих",
              "attributes": [
                {
                  "name": "guid",
                  "required": true
                },
                {
                  "name": "number",
                  "required": true
                },
                {
                  "name": "date",
                  "required": true
                },
                {
                  "name": "person_name",
                  "required": true
                },
                {
                  "name": "cover_letter_num"
                },
                {
                  "name": "cover_letter_date"
                },
                {
                  "name": "request_type",
                  "required": true
                },
                {
                  "name": "is_name"
                },
                {
                  "name": "data_type",
                  "required": true
                },
                {
                  "name": "record_status",
                  "required": true
                },
                {
                  "name": "user_name",
                  "required": true
                }
              ]
            }
          ]
        }'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'tasks_schema_v1');
