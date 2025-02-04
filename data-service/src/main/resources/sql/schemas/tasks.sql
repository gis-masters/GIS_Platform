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
              "valueType": "INT",
              "hidden": true
            },
            {
              "name": "type",
              "title": "Тип задачи",
              "valueType": "CHOICE",
              "hidden":true,
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
              "title": "Вид задачи",
              "valueType": "CHOICE",
              "readOnly": true,
              "display": "radiogroup",
              "maxLength": 50,
              "minWidth": 300,
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
                },
                {
                  "value": "sed_task_introduction",
                  "title": "Размещение документов из СЭД Диалог в ГИСОГД РК"
                },
                {
                  "value": "rns_smev_rostelekom",
                  "title": "РНС. Выдача или внесение изменений"
                },
                {
                  "value": "rnv_smev_rostelekom",
                  "title": "РНВ. Выдача или внесение изменений"
                },
                {
                  "value": "gpzu_smev_rostelekom",
                  "title": "ГПЗУ. Выдача или внесение изменений"
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
              "name": "intermediate_status",
              "title": "Промежуточный статус выполнения задачи",
              "valueType": "CHOICE",
              "description": "Финальный статус устанавливается системой, не заполняйте вручную",
              "enumerations": [
                {
                  "value": "1",
                  "title": "Заявление прибыло из СМЭВ-3"
                },
                {
                  "value": "2",
                  "title": "Заявлению назначен исполнитель"
                },
                {
                  "value": "3",
                  "title": "Подготовленные документы ожидают подпись"
                },
                {
                  "value": "4",
                  "title": "Документы готовы к отправке"
                },
                {
                  "value": "5",
                  "title": "РНС успешно отправлен в СМЭВ-3"
                },
                {
                  "value": "6",
                  "title": "Мотивированный отказ успешно отправлен в СМЭВ-3"
                }
              ]
            },
            {
              "name": "description",
              "title": "Описание",
              "valueType": "STRING",
              "display": "multiline"
            },
            {
              "name": "assigned_to",
              "title": "Исполнитель",
              "valueType": "USER_ID",
              "required": true,
              "onlySubordinates": true
            },
            {
              "name": "owner_id",
              "title": "Начальник",
              "valueType": "USER_ID",
              "required": true,
              "readOnly": true
            },
            {
              "name": "inbox_data_key_data_connection",
              "title": "Материалы для обработки",
              "valueType": "DOCUMENT",
              "required": true
            },
            {
              "name": "data_section_key_data_connection",
              "title": "Связь с библиотеками",
              "valueType": "DOCUMENT",
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
              "maxDocuments": 18
            },
            {
              "name": "created_by",
              "title": "Создано",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "due_date",
              "title": "Срок исполнения",
              "valueType": "DATETIME"
            },
            {
              "name": "record_status",
              "title": "Контроль скоков исполнения",
              "readOnly":true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "value": "В установленный срок",
                  "title": "В установленный срок"
                },
                {
                  "value": "С нарушением срока",
                  "title": "С нарушением срока"
                }
              ]
            },
            {
              "name": "guid",
              "title": "guid",
              "valueType": "UUID",
              "hidden": true
            },
            {
              "name": "number",
              "title": "Просроченных дней",
              "readOnly":true,
              "valueType": "INT"
            },
            {
              "name": "updated_by",
              "title": "Модифицировано",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "date",
              "title": "Дата выполнения",
              "readOnly":true,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата последнего изменения",
              "valueType": "DATETIME",
              "hidden": true,
              "readOnly": true
            }
          ],
          "description": "Реестр системных и настраиваемых задач",
          "originName": "tasks",
          "styleName": "tasks_schema_v1",
          "readOnly": false,
          "geometryType": "MultiPolygon",
          "tags": [
            "system",
            "Задачи"
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
                  "name": "owner_id"
                },
                {
                  "name": "assigned_to"
                },
                {
                  "name": "due_date"
                },
                {
                  "name": "date"
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
                  "name": "owner_id"
                },
                {
                  "name": "assigned_to"
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
                  "name": "owner_id"
                },
                {
                  "name": "assigned_to"
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
                  "name": "data_section_key_data_connection"
                },
                {
                  "name": "description"
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
                  "name": "owner_id"
                },
                {
                  "name": "assigned_to"
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
                  "name": "data_section_key_data_connection"
                },
                {
                  "name": "description"
                }
              ]
            },
            {
              "id": "sed_task_introduction",
              "type": "DOCUMENT",
              "title": "Размещение документов из СЭД Диалог в ГИСОГД РК",
              "attributes": [
                {
                  "name": "id",
                  "hidden": true
                },
                {
                  "name": "content_type_id",
                  "readOnly": true
                },
                {
                  "name": "status"
                },
                {
                  "name": "assigned_to"
                },
                {
                  "name": "owner_id"
                },
                {
                  "name": "inbox_data_key_data_connection",
                  "title": "Заявка",
                  "readOnly": true
                },
                {
                  "name": "data_section_key_data_connection",
                  "title": "Размещенные документы",
                  "dynamicPropertyFormula": "return { required: obj?.status == \"DONE\", readOnly: (obj?.status == \"DONE\" || obj?.status == \"CANCELED\")}"
                },
                {
                  "name": "due_date"
                },
                {
                  "name": "record_status"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "date"
                },
                {
                  "name": "description",
                  "title": "Комментарий"
                }
              ]
            },
            {
              "id": "rns_smev_rostelekom",
              "type": "DOCUMENT",
              "title": "РНС. Выдача или внесение изменений",
              "attributes": [
                {
                  "name": "id",
                  "hidden": true
                },
                {
                  "name": "content_type_id",
                  "readOnly": true
                },
                {
                  "name": "status"
                },
                {
                  "name": "intermediate_status"
                },
                {
                  "name": "assigned_to"
                },
                {
                  "name": "owner_id"
                },
                {
                  "name": "inbox_data_key_data_connection",
                  "title": "Заявка",
                  "multiple": false,
                  "readOnly": true,
                  "description": "Заявление, доставленное из ЕПГУ посредством СМЭВ-3"
                },
                {
                  "name": "data_section_key_data_connection",
                  "title": "Размещенный документ",
                  "multiple": false,
                  "libraries": [
                    "dl_data_section13",
                    "dl_data_section19"
                  ],
                  "description": "Мотивированный отказ вносится в библиотеку Реестр предоставления сведений",
                  "valueType": "DOCUMENT"
                },
                {
                  "name": "due_date",
                  "readOnly": true,
                  "description": "Срок исполнения устанавливается с момента подачи заявки в систему и не подлежит изменению."
                },
                {
                  "name": "record_status"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "date"
                },
                {
                  "name": "number"
                },
                {
                  "name": "description",
                  "title": "Комментарий"
                }
              ]
            },
            {
              "id": "rnv_smev_rostelekom",
              "type": "DOCUMENT",
              "title": "РНВ. Выдача или внесение изменений",
              "attributes": [
                {
                  "name": "id",
                  "hidden": true
                },
                {
                  "name": "content_type_id",
                  "readOnly": true
                },
                {
                  "name": "status"
                },
                {
                  "name": "intermediate_status"
                },
                {
                  "name": "assigned_to"
                },
                {
                  "name": "owner_id"
                },
                {
                  "name": "inbox_data_key_data_connection",
                  "title": "Заявка",
                  "multiple": false,
                  "readOnly": true,
                  "description": "Заявление, доставленное из ЕПГУ посредством СМЭВ-3"
                },
                {
                  "name": "data_section_key_data_connection",
                  "title": "Размещенный документ",
                  "multiple": false,
                  "libraries": [
                    "dl_data_section13",
                    "dl_data_section19"
                  ],
                  "description": "Мотивированный отказ вносится в библиотеку Реестр предоставления сведений",
                  "valueType": "DOCUMENT"
                },
                {
                  "name": "due_date",
                  "readOnly": true,
                  "description": "Срок исполнения устанавливается с момента подачи заявки в систему и не подлежит изменению."
                },
                {
                  "name": "record_status"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "date"
                },
                {
                  "name": "number"
                },
                {
                  "name": "description",
                  "title": "Комментарий"
                }
              ]
            },
            {
              "id": "gpzu_smev_rostelekom",
              "type": "DOCUMENT",
              "title": "ГПЗУ. Выдача или внесение изменений",
              "attributes": [
                {
                  "name": "id",
                  "hidden": true
                },
                {
                  "name": "content_type_id",
                  "readOnly": true
                },
                {
                  "name": "status",
                  "readOnly": true
                },
                {
                  "name": "intermediate_status"
                },
                {
                  "name": "assigned_to"
                },
                {
                  "name": "owner_id"
                },
                {
                  "name": "inbox_data_key_data_connection",
                  "title": "Заявка",
                  "multiple": false,
                  "readOnly": true,
                  "description": "Заявление, доставленное из ЕПГУ посредством СМЭВ-3"
                },
                {
                  "name": "data_section_key_data_connection",
                  "title": "Размещенный документ",
                  "multiple": false,
                  "libraries": [
                    "dl_data_section13",
                    "dl_data_section19"
                  ],
                  "description": "Мотивированный отказ вносится в библиотеку Реестр предоставления сведений",
                  "valueType": "DOCUMENT"
                },
                {
                  "name": "due_date",
                  "readOnly": true,
                  "description": "Срок исполнения устанавливается с момента подачи заявки в систему и не подлежит изменению."
                },
                {
                  "name": "record_status"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "date"
                },
                {
                  "name": "number"
                },
                {
                  "name": "description",
                  "title": "Комментарий"
                }
              ]
            }
          ]
        }'
WHERE name = 'tasks_schema_v1';