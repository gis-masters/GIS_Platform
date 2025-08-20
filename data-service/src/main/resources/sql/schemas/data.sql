INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_cad_work',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_cad_work');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_1_surveys_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_1_surveys_schema');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_3_ofp_topo_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_3_ofp_topo_schema');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_docflow',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_docflow');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_projects_geoplan_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_projects_geoplan_schema');

INSERT INTO data.schemas (name, class_rule)
SELECT 'research_type',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'research_type');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_owners',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_owners');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_doc',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_doc');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_terplan_doc',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_terplan_doc');

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Электронный архив"
          ],
          "name": "dl_cad_work",
          "title": "4. Кадастровые работы",
          "tableName": "dl_cad_work",
          "originName": "dl_cad_work",
          "properties": [
            {
              "name": "id",
              "title": "id",
              "readOnly": true,
              "required": true,
              "valueType": "INT"
            },
            {
              "name": "content_type_id",
              "title": "Виды работ",
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Работы в отношении ЗУ",
                  "value": "Работы в отношении ЗУ"
                },
                {
                  "title": "Работы в отношении ОКС",
                  "value": "Работы в отношении ОКС"
                },
                {
                  "title": "Схема расположения ЗУ на кадастровом плане территории",
                  "value": "Схема расположения ЗУ на кадастровом плане территории"
                },
                {
                  "title": "Акт обследования",
                  "value": "Акт обследования"
                },
                {
                  "title": "Карта (план) объекта",
                  "value": "Карта (план) объекта"
                },
                {
                  "title": "Описание местоположения границ",
                  "value": "Описание местоположения границ"
                }
              ]
            },
            {
              "name": "type",
              "title": "Типы работ",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Вы не должны это видеть",
                  "value": "Вы не должны это видеть"
                }
              ]
            },
            {
              "name": "map_place",
              "title": "Территория действия",
              "readOnly": true,
              "valueType": "URL",
              "description": "Cвяжите папку на карте с объектом в слое кадастровых работ",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_21: geolan_proj_cad_57_7343"
                ],
                "property": "cadastr_library",
                "projectId": 1371
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "path",
              "title": "Путь",
              "valueType": "STRING",
              "description": "Полный путь, отражающий иерархию объектов"
            },
            {
              "name": "cad_num_old",
              "title": "Кадастровый номер",
              "valueType": "STRING",
              "description": "Заполняется при наличии кадастрового номера в начале работ"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "valueType": "BOOLEAN",
              "description": "Папка или Документ"
            },
            {
              "name": "title",
              "title": "Наименование",
              "valueType": "STRING",
              "description": "Должно соответствовать названию в Битрикс"
            },
            {
              "name": "niko_path",
              "title": "Путь на niko",
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Местоположение",
              "required": true,
              "valueType": "FIAS",
              "searchMode": "oktmo"
            },
            {
              "name": "fias__oktmo",
              "title": "ОКТМО",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "fias__address",
              "title": "Адрес",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "fias__id",
              "title": "id",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "if_contract_approved",
              "title": "Акт приёмки работ",
              "valueType": "CHOICE",
              "description": "Заполняется ГИП-ом",
              "enumerations": [
                {
                  "title": "Передан заказчику",
                  "value": "Передан заказчику"
                },
                {
                  "title": "Передан в бухгалтерию после подписи заказчика",
                  "value": "Передан в бухгалтерию после подписи заказчика"
                }
              ]
            },
            {
              "name": "note",
              "title": "Примечание",
              "display": "multiline",
              "valueType": "TEXT"
            },
            {
              "name": "files",
              "title": "Выбор файла",
              "maxSize": 100000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE",
              "description": "Все элементы zip архива"
            },
            {
              "name": "gdz_library",
              "title": "Геодезические работы",
              "multiple": true,
              "libraries": [
                "dl_data_1_surveys"
              ],
              "valueType": "DOCUMENT",
              "description": "Заполняется если геодезические работы выполнялись Геопланом",
              "maxDocuments": 5
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
            }
          ],
          "description": "4. Кадастровые работы",
          "contentTypes": [
            {
              "id": "Работы в отношении ЗУ",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Работы в отношении ЗУ",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "defaultValue": "Работы в отношении ЗУ"
                },
                {
                  "name": "title",
                  "readOnly": true,
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type",
                  "options": [
                    {
                      "title": "МП по образованию земельного участка из земель",
                      "value": "МП по образованию земельного участка из земель"
                    },
                    {
                      "title": "МП по образованию земельного участка путем раздела",
                      "value": "МП по образованию земельного участка путем раздела"
                    },
                    {
                      "title": "МП по образованию земельного участка путем раздела с сохранением исходного в изменённых границах",
                      "value": "МП по образованию земельного участка путем раздела с сохранением исходного в изменённых границах"
                    },
                    {
                      "title": "МП по образованию земельного участка путем объединения",
                      "value": "МП по образованию земельного участка путем объединения"
                    },
                    {
                      "title": "МП по образованию земельного участка путем перераспределения",
                      "value": "МП по образованию земельного участка путем перераспределения"
                    },
                    {
                      "title": "МП по образованию земельного участка путем перераспределения с землями",
                      "value": "МП по образованию земельного участка путем перераспределения с землями"
                    },
                    {
                      "title": "МП по уточнению границ земельного участка",
                      "value": "МП по уточнению границ земельного участка"
                    },
                    {
                      "title": "МП по исправлению реестровой ошибки",
                      "value": "МП по исправлению реестровой ошибки"
                    },
                    {
                      "title": "МП по выделу доли",
                      "value": "МП по выделу доли"
                    }
                  ]
                },
                {
                  "name": "cad_num_old",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "map_place"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "note"
                },
                {
                  "name": "files"
                }
              ]
            },
            {
              "id": "Работы в отношении ОКС",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Работы в отношении ОКС",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "defaultValue": "Работы в отношении ОКС"
                },
                {
                  "name": "title",
                  "readOnly": true,
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type",
                  "options": [
                    {
                      "title": "ТП здания",
                      "value": "ТП здания"
                    },
                    {
                      "title": "ТП сооружения",
                      "value": "ТП сооружения"
                    },
                    {
                      "title": "ТП помещения",
                      "value": "ТП помещения"
                    },
                    {
                      "title": "ТП машино-места",
                      "value": "ТП машино-места"
                    },
                    {
                      "title": "ТП единого недвижимого комплекса",
                      "value": "ТП единого недвижимого комплекса"
                    },
                    {
                      "title": "ТП объекта незавершенного строительства",
                      "value": "ТП объекта незавершенного строительства"
                    }
                  ]
                },
                {
                  "name": "cad_num_old",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "map_place"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "note"
                },
                {
                  "name": "files"
                }
              ]
            },
            {
              "id": "Схема расположения ЗУ на кадастровом плане территории",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Схема расположения ЗУ на кадастровом плане территории",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "defaultValue": "Схема расположения ЗУ на кадастровом плане территории"
                },
                {
                  "name": "title",
                  "readOnly": true,
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type",
                  "options": [
                    {
                      "title": "Схема расположения ЗУ на кадастровом плане территории",
                      "value": "Схема расположения ЗУ на кадастровом плане территории"
                    }
                  ],
                  "readOnly": true,
                  "defaultValue": "Схема расположения ЗУ на кадастровом плане территории"
                },
                {
                  "name": "cad_num_old",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "map_place"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "note"
                },
                {
                  "name": "files"
                }
              ]
            },
            {
              "id": "Акт обследования",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Акт обследования",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "defaultValue": "Акт обследования"
                },
                {
                  "name": "title",
                  "readOnly": true,
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type",
                  "options": [
                    {
                      "title": "Акт обследования",
                      "value": "Акт обследования"
                    }
                  ],
                  "readOnly": true,
                  "defaultValue": "Акт обследования"
                },
                {
                  "name": "cad_num_old",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "map_place"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "note"
                },
                {
                  "name": "files"
                }
              ]
            },
            {
              "id": "Карта (план) объекта",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Карта (план) объекта",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "defaultValue": "Карта (план) объекта"
                },
                {
                  "name": "title",
                  "readOnly": true,
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type",
                  "options": [
                    {
                      "title": "Карта (план) объекта",
                      "value": "Карта (план) объекта"
                    }
                  ],
                  "readOnly": true,
                  "defaultValue": "Карта (план) объекта"
                },
                {
                  "name": "cad_num_old",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "map_place"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "note"
                },
                {
                  "name": "files"
                }
              ]
            },
            {
              "id": "Описание местоположения границ",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Описание местоположения границ",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "defaultValue": "Описание местоположения границ"
                },
                {
                  "name": "title",
                  "readOnly": true,
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type",
                  "options": [
                    {
                      "title": "Описание местоположения границ",
                      "value": "Описание местоположения границ"
                    }
                  ],
                  "readOnly": true,
                  "defaultValue": "Описание местоположения границ"
                },
                {
                  "name": "cad_num_old",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "map_place"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "note"
                },
                {
                  "name": "files"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
              "title": "Папку сделки",
              "children": [
                {
                  "contentType": "Работы в отношении ЗУ"
                },
                {
                  "contentType": "Работы в отношении ОКС"
                },
                {
                  "contentType": "Схема расположения ЗУ на кадастровом плане территории"
                },
                {
                  "contentType": "Акт обследования"
                },
                {
                  "contentType": "Карта (план) объекта"
                },
                {
                  "contentType": "Описание местоположения границ"
                }
              ],
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "required": true
                },
                {
                  "name": "cad_num_old"
                },
                {
                  "name": "map_place",
                  "description": "Перейдите в проект Карта работ Геоплан и прикрепите папку к слою кадастровых работ"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo"
                },
                {
                  "name": "fias__address"
                },
                {
                  "name": "fias__id"
                },
                {
                  "name": "if_contract_approved"
                },
                {
                  "name": "niko_path"
                },
                {
                  "name": "note"
                },
                {
                  "name": "gdz_library"
                }
              ]
            },
            {
              "id": "folder_root",
              "type": "FOLDER",
              "title": "Папка руут",
              "children": [
                {
                  "contentType": "folder_v1"
                }
              ],
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "required": true
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_cad_work';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Электронный архив"
          ],
          "name": "dl_data_1_surveys_schema",
          "title": "1. Изыскания",
          "tableName": "dl_data_1_surveys",
          "originName": "dl_data_1_surveys",
          "properties": [
            {
              "name": "id",
              "title": "id",
              "hidden": true,
              "readOnly": true,
              "valueType": "INT"
            },
            {
              "name": "content_type_id",
              "title": "Вид документа",
              "minWidth": 300,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Текстовые документы",
                  "value": "text_doc"
                },
                {
                  "title": "Графические материалы в растровом формате",
                  "value": "graphic_rasters"
                },
                {
                  "title": "Графические материалы в векторном формате",
                  "value": "graphic_vectors"
                },
                {
                  "title": "Документы в формате geotiff",
                  "value": "doc_tiff"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "hidden": true,
              "minWidth": 250,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "title",
              "title": "Наименование",
              "minWidth": 250,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "inner_path",
              "title": "Где лежит",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата последней модификации",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "customer",
              "title": "Заказчик",
              "minWidth": 170,
              "valueType": "STRING"
            },
            {
              "name": "number",
              "title": "ID сделки",
              "minWidth": 150,
              "valueType": "STRING",
              "description": "Должно соответствовать id в Битрикс"
            },
            {
              "name": "name",
              "title": "Название проекта",
              "minWidth": 250,
              "maxLength": 500,
              "valueType": "STRING",
              "description": "Должно соответствовать названию в Битрикс"
            },
            {
              "name": "type_of_work",
              "title": "Вид работ",
              "minWidth": 150,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ИГДИ",
                  "value": "1"
                },
                {
                  "title": "ИГМИ",
                  "value": "2"
                },
                {
                  "title": "ИГИ",
                  "value": "3"
                },
                {
                  "title": "ИЗИ",
                  "value": "4"
                },
                {
                  "title": "Дендрология",
                  "value": "5"
                },
                {
                  "title": "Иные",
                  "value": "0"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Завершен",
                  "value": "2"
                },
                {
                  "title": "Актуализация",
                  "value": "3"
                },
                {
                  "title": "Согласован",
                  "value": "3"
                },
                {
                  "title": "Не согласован",
                  "value": "4"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "performer",
              "title": "Исполнитель",
              "valueType": "STRING"
            },
            {
              "name": "responsible",
              "title": "Ответственный",
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Населенный пункт",
              "valueType": "FIAS",
              "searchMode": "oktmo"
            },
            {
              "name": "fias__oktmo",
              "title": "ОКТМО",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "fias__address",
              "title": "Адрес",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "fias__id",
              "title": "id",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "completion_date",
              "title": "Дата окончания работ",
              "minWidth": 170,
              "valueType": "DATETIME"
            },
            {
              "name": "beginning_date",
              "title": "Дата начала работ",
              "minWidth": 150,
              "valueType": "DATETIME"
            },
            {
              "name": "date_of_doc",
              "title": "Год создания документа",
              "minWidth": 150,
              "valueType": "DATETIME"
            },
            {
              "name": "d_actual",
              "title": "Дата актуализации",
              "valueType": "DATETIME",
              "description": "Если проводилась"
            },
            {
              "name": "file",
              "title": "Выбор документов",
              "maxSize": 500000000,
              "maxFiles": 500,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "native_crs",
              "title": "Система координат",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Pulkovo 1942 CS63 zone X4",
                  "value": "EPSG: 7828"
                },
                {
                  "title": "Pulkovo 1942 CS63 zone X5",
                  "value": "EPSG: 7829"
                },
                {
                  "title": "MSK Sevastopol",
                  "value": "MSK Sevastopol"
                }
              ]
            },
            {
              "name": "description",
              "title": "Описание",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "ghostylink",
              "title": "Переход на Карту проектов",
              "readOnly": true,
              "valueType": "URL",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_21: igdi_1371_b568"
                ],
                "property": "doc",
                "projectId": 1371
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "scale",
              "title": "Номинальный масштаб",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "500000",
                  "value": "500000"
                },
                {
                  "title": "200000",
                  "value": "200000"
                },
                {
                  "title": "100000",
                  "value": "100000"
                },
                {
                  "title": "50000",
                  "value": "50000"
                },
                {
                  "title": "25000",
                  "value": "25000"
                },
                {
                  "title": "10000",
                  "value": "10000"
                },
                {
                  "title": "5000",
                  "value": "5000"
                },
                {
                  "title": "2000",
                  "value": "2000"
                },
                {
                  "title": "1000",
                  "value": "1000"
                },
                {
                  "title": "500",
                  "value": "500"
                },
                {
                  "title": "200",
                  "value": "200"
                }
              ]
            }
          ],
          "description": "1. Изыскания",
          "contentTypes": [
            {
              "id": "text_doc",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Текстовые документы",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "readOnly": "true",
                  "defaultValue": "text_doc"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 1000000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "graphic_rasters",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Графические материалы в растровом формате",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "readOnly": "true",
                  "defaultValue": "graphic_rasters"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "status",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "graphic_vectors",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Графические векторные материалы",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "readOnly": "true",
                  "defaultValue": "graphic_vectors"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "doc_tiff",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Документы в формате geotiff",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "readOnly": "true",
                  "defaultValue": "doc_tiff"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Добавить раздел",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "description"
                }
              ]
            },
            {
              "id": "folder_v2",
              "icon": "FOLDER",
              "type": "FOLDER",
              "title": "Добавить новую работу",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number"
                },
                {
                  "name": "name"
                },
                {
                  "name": "type_of_work"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer"
                },
                {
                  "name": "responsible"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo"
                },
                {
                  "name": "fias__address"
                },
                {
                  "name": "customer"
                },
                {
                  "name": "beginning_date"
                },
                {
                  "name": "completion_date"
                },
                {
                  "name": "d_actual"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_1_surveys_schema';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Электронный архив"
          ],
          "name": "dl_data_3_ofp_topo_schema",
          "title": "3. Картографические работы",
          "tableName": "dl_data_3_ofp_topo",
          "originName": "dl_data_3_ofp_topo",
          "properties": [
            {
              "name": "id",
              "title": "id",
              "hidden": true,
              "readOnly": true,
              "valueType": "INT"
            },
            {
              "name": "content_type_id",
              "title": "Вид документа",
              "minWidth": 300,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Текстовые документы",
                  "value": "text_doc"
                },
                {
                  "title": "Графические материалы в растровом формате",
                  "value": "graphic_rasters"
                },
                {
                  "title": "Графические материалы в векторном формате",
                  "value": "graphic_vectors"
                },
                {
                  "title": "Документы в формате geotiff",
                  "value": "doc_tiff"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "hidden": true,
              "minWidth": 250,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "title",
              "title": "Наименование",
              "minWidth": 250,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "inner_path",
              "title": "Где лежит",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата последней модификации",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "customer",
              "title": "Заказчик",
              "minWidth": 170,
              "valueType": "STRING"
            },
            {
              "name": "number",
              "title": "ID сделки",
              "minWidth": 150,
              "valueType": "STRING",
              "description": "Должно соответствовать id в Битрикс"
            },
            {
              "name": "name",
              "title": "Название проекта",
              "minWidth": 250,
              "maxLength": 500,
              "valueType": "STRING",
              "description": "Должно соответствовать названию в Битрикс"
            },
            {
              "name": "type_of_work",
              "title": "Вид работ",
              "minWidth": 150,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Топоплан",
                  "value": "1"
                },
                {
                  "title": "ОФП",
                  "value": "2"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "В работе",
                  "value": "1"
                },
                {
                  "title": "Завершен",
                  "value": "2"
                },
                {
                  "title": "Актуализация",
                  "value": "3"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "performer",
              "title": "Исполнитель",
              "valueType": "STRING"
            },
            {
              "name": "responsible",
              "title": "Ответственный",
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Населенный пункт",
              "valueType": "FIAS",
              "searchMode": "oktmo"
            },
            {
              "name": "fias__oktmo",
              "title": "ОКТМО",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "fias__address",
              "title": "Адрес",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "fias__id",
              "title": "id",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "completion_date",
              "title": "Дата окончания работ",
              "minWidth": 170,
              "valueType": "DATETIME"
            },
            {
              "name": "beginning_date",
              "title": "Дата начала работ",
              "minWidth": 150,
              "valueType": "DATETIME"
            },
            {
              "name": "date_of_doc",
              "title": "Год создания документа",
              "minWidth": 150,
              "valueType": "DATETIME"
            },
            {
              "name": "d_actual",
              "title": "Дата актуализации",
              "valueType": "DATETIME",
              "description": "Если проводилась"
            },
            {
              "name": "file",
              "title": "Выбор документов",
              "maxSize": 500000000,
              "maxFiles": 500,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "accuracy",
              "title": "Детализация",
              "valueType": "STRING",
              "description": "Для ортофотопланов"
            },
            {
              "name": "native_crs",
              "title": "Система координат",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Pulkovo 1942 CS63 zone X4",
                  "value": "EPSG: 7828"
                },
                {
                  "title": "Pulkovo 1942 CS63 zone X5",
                  "value": "EPSG: 7829"
                }
              ]
            },
            {
              "name": "description",
              "title": "Описание",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "ghostylink",
              "title": "Переход на Карту проектов",
              "readOnly": true,
              "valueType": "URL",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_21: igdi_1371_b568"
                ],
                "property": "doc",
                "projectId": 1371
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "scale",
              "title": "Номинальный масштаб",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "500000",
                  "value": "500000"
                },
                {
                  "title": "200000",
                  "value": "200000"
                },
                {
                  "title": "100000",
                  "value": "100000"
                },
                {
                  "title": "50000",
                  "value": "50000"
                },
                {
                  "title": "25000",
                  "value": "25000"
                },
                {
                  "title": "10000",
                  "value": "10000"
                },
                {
                  "title": "5000",
                  "value": "5000"
                },
                {
                  "title": "2000",
                  "value": "2000"
                },
                {
                  "title": "1000",
                  "value": "1000"
                },
                {
                  "title": "500",
                  "value": "500"
                },
                {
                  "title": "200",
                  "value": "200"
                }
              ]
            }
          ],
          "description": "1. Изыскания",
          "contentTypes": [
            {
              "id": "text_doc",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Текстовые документы",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "readOnly": "true",
                  "defaultValue": "text_doc"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "graphic_rasters",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Графические материалы в растровом формате",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "readOnly": "true",
                  "defaultValue": "graphic_rasters"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "status",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "graphic_vectors",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Графические векторные материалы",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "readOnly": "true",
                  "defaultValue": "graphic_vectors"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "doc_tiff",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Документы в формате geotiff",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "readOnly": "true",
                  "defaultValue": "doc_tiff"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Добавить раздел",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "description"
                }
              ]
            },
            {
              "id": "folder_v2",
              "icon": "FOLDER",
              "type": "FOLDER",
              "title": "Добавить новую работу",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "title"
                },
                {
                  "name": "number"
                },
                {
                  "name": "name"
                },
                {
                  "name": "type_of_work"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer"
                },
                {
                  "name": "responsible"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo"
                },
                {
                  "name": "fias__address"
                },
                {
                  "name": "customer"
                },
                {
                  "name": "beginning_date"
                },
                {
                  "name": "completion_date"
                },
                {
                  "name": "d_actual"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_3_ofp_topo_schema';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Документооборот"
          ],
          "name": "dl_data_docflow",
          "title": "Документооборот",
          "tableName": "dl_data_docflow",
          "properties": [
            {
              "name": "id",
              "title": "Идентификатор",
              "required": true,
              "valueType": "INT"
            },
            {
              "name": "path",
              "title": "Путь",
              "minWidth": 400,
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Путь, отражающий иерархию объектов"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN"
            },
            {
              "name": "content_type_id",
              "title": "Вид документа",
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Исходящее письмо Южный Обход",
                  "value": "doc_01"
                },
                {
                  "title": "Входящее письмо Южный Обход",
                  "value": "doc_02"
                },
                {
                  "title": "Исходящие письма Южный Обход",
                  "value": "folder_outbox"
                },
                {
                  "title": "Входящие письма Южный Обход",
                  "value": "folder_inbox"
                },
                {
                  "title": "Исходящее письмо Перевальное Алушта",
                  "value": "doc_03"
                },
                {
                  "title": "Входящее письмо Перевальное Алушта",
                  "value": "doc_04"
                },
                {
                  "title": "Исходящие письма Перевальное Алушта",
                  "value": "folder_outbox_for_pereval_alyshta"
                },
                {
                  "title": "Входящие письма Перевальное Алушта",
                  "value": "folder_inbox_for_pereval_alyshta"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "title",
              "title": "Номер документа",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "docdate",
              "title": "Дата документа",
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "territorykey",
              "title": "Территория действия",
              "readOnly": true,
              "valueType": "URL",
              "description": "Объект на карте",
              "displayMode": "newTab",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_25: parcels_new_1_df2a"
                ],
                "property": "file_3",
                "projectId": 1465
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "territorykey_for_pereval_alyshta",
              "title": "Территория действия",
              "readOnly": true,
              "valueType": "URL",
              "description": "Объект на карте",
              "displayMode": "newTab",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_25: parcels_new_106_4397"
                ],
                "property": "file_3",
                "projectId": 1565
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "text",
              "title": "Краткое содержание",
              "display": "multiline",
              "minWidth": 400,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "applicant",
              "title": "Адресат",
              "display": "multiline",
              "minWidth": 400,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "executor",
              "title": "Исполнитель",
              "display": "multiline",
              "minWidth": 400,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "file",
              "title": "Выбор файла",
              "maxSize": 50000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE",
              "maxDocuments": 10
            },
            {
              "name": "relations",
              "title": "Связанные документы",
              "library": "dl_data_docflow",
              "multiple": true,
              "valueType": "DOCUMENT",
              "maxDocuments": 10
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
            }
          ],
          "description": "Документооборот",
          "contentTypes": [
            {
              "id": "doc_01",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Исходящее письмо",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "defaultValue": "doc_01"
                },
                {
                  "name": "title"
                },
                {
                  "name": "docdate"
                },
                {
                  "name": "territorykey"
                },
                {
                  "name": "text"
                },
                {
                  "name": "applicant",
                  "title": "Адресат",
                  "description": "Кому направлено письмо"
                },
                {
                  "name": "executor",
                  "title": "Исполнитель",
                  "description": "Кто подготовил письмо"
                },
                {
                  "name": "file"
                },
                {
                  "name": "relations"
                }
              ]
            },
            {
              "id": "doc_02",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Входящее письмо",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "defaultValue": "doc_02"
                },
                {
                  "name": "title"
                },
                {
                  "name": "docdate"
                },
                {
                  "name": "territorykey"
                },
                {
                  "name": "text"
                },
                {
                  "name": "applicant",
                  "title": "Адресант",
                  "required": true,
                  "description": "От кого получено письмо"
                },
                {
                  "name": "executor",
                  "title": "Исполнитель",
                  "required": true,
                  "description": "Кому отписано в работу"
                },
                {
                  "name": "file"
                },
                {
                  "name": "relations"
                }
              ]
            },
            {
              "id": "doc_03",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Исходящее письмо",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "defaultValue": "doc_03"
                },
                {
                  "name": "title"
                },
                {
                  "name": "docdate"
                },
                {
                  "name": "territorykey_for_pereval_alyshta"
                },
                {
                  "name": "text"
                },
                {
                  "name": "applicant"
                },
                {
                  "name": "executor",
                  "title": "Исполнитель",
                  "description": "Кто подготовил письмо"
                },
                {
                  "name": "file"
                },
                {
                  "name": "relations"
                }
              ]
            },
            {
              "id": "doc_04",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Входящее письм",
              "childOnly": true,
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "defaultValue": "doc_04"
                },
                {
                  "name": "title"
                },
                {
                  "name": "docdate"
                },
                {
                  "name": "territorykey_for_pereval_alyshta"
                },
                {
                  "name": "text"
                },
                {
                  "name": "applicant",
                  "title": "Адресант",
                  "required": true,
                  "description": "От кого получено письмо"
                },
                {
                  "name": "executor",
                  "title": "Исполнитель",
                  "required": true,
                  "description": "Кому отписано в работу"
                },
                {
                  "name": "file"
                },
                {
                  "name": "relations"
                }
              ]
            },
            {
              "id": "folder_outbox",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Исходящие письма",
              "children": [
                {
                  "contentType": "doc_01"
                },
                {
                  "contentType": "folder_outbox"
                }
              ],
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500
                }
              ]
            },
            {
              "id": "folder_inbox",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Входящие письма",
              "children": [
                {
                  "contentType": "doc_02"
                },
                {
                  "contentType": "folder_inbox"
                }
              ],
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500
                }
              ]
            },
            {
              "id": "folder_outbox_for_pereval_alyshta",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Исходящие письма",
              "children": [
                {
                  "contentType": "doc_03"
                },
                {
                  "contentType": "folder_outbox_for_pereval_alyshta"
                }
              ],
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500
                }
              ]
            },
            {
              "id": "folder_inbox_for_pereval_alyshta",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Входящие письма",
              "children": [
                {
                  "contentType": "doc_04"
                },
                {
                  "contentType": "folder_inbox_for_pereval_alyshta"
                }
              ],
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500
                }
              ]
            },
            {
              "id": "after_root_folder",
              "type": "FOLDER",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "title": "Название раздела",
                  "required": true,
                  "maxLength": 500,
                  "valueType": "STRING"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_docflow';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Электронный архив"
          ],
          "name": "dl_data_projects_geoplan_schema",
          "title": "Документы по работам Геоплан",
          "tableName": "dl_data_projects_geoplan",
          "originName": "dl_data_projects_geoplan",
          "properties": [
            {
              "name": "id",
              "title": "id",
              "hidden": true,
              "readOnly": true,
              "valueType": "INT"
            },
            {
              "name": "content_type_id",
              "title": "Вид документа",
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Текстовые",
                  "value": "text_doc"
                },
                {
                  "title": "Растровые",
                  "value": "graphic_rasters"
                },
                {
                  "title": "Векторные",
                  "value": "graphic_vectors"
                },
                {
                  "title": "GeoTIFF",
                  "value": "doc_tiff"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "hidden": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "title",
              "title": "Название документа",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "inner_path",
              "title": "Где лежит",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата последней модификации",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "gip",
              "title": "Руководитель проекта",
              "valueType": "STRING"
            },
            {
              "name": "customer",
              "title": "Заказчик",
              "valueType": "STRING"
            },
            {
              "name": "project",
              "title": "Проект",
              "maxLength": 150,
              "valueType": "URL"
            },
            {
              "name": "id_proj",
              "title": "ID работы",
              "valueType": "STRING"
            },
            {
              "name": "name",
              "title": "Название проекта",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "stage",
              "title": "Этап работ",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Рабочие материалы",
                  "value": "2"
                },
                {
                  "title": "Выпускаемые материалы",
                  "value": "3"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "type_of_work",
              "title": "Вид работ",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ИГДИ",
                  "value": "1"
                },
                {
                  "title": "ИГМИ",
                  "value": "2"
                },
                {
                  "title": "ИГИ",
                  "value": "3"
                },
                {
                  "title": "ИЗИ",
                  "value": "4"
                },
                {
                  "title": "Дендрология",
                  "value": "5"
                },
                {
                  "title": "Иные",
                  "value": "0"
                },
                {
                  "title": "ППТ",
                  "value": "6"
                },
                {
                  "title": "ПМТ",
                  "value": "7"
                },
                {
                  "title": "Концепции",
                  "value": "8"
                },
                {
                  "title": "Визуализация",
                  "value": "8"
                },
                {
                  "title": "Создание ортофотплана",
                  "value": "9"
                },
                {
                  "title": "Топосъемка 1: 2000 >",
                  "value": "8"
                },
                {
                  "title": "Техпланы",
                  "value": "8"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "В работе",
                  "value": "1"
                },
                {
                  "title": "Завершен",
                  "value": "2"
                },
                {
                  "title": "Актуализация",
                  "value": "3"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "performer",
              "title": "Исполнитель",
              "valueType": "STRING"
            },
            {
              "name": "responsible",
              "title": "Ответственный",
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Населенный пункт",
              "valueType": "FIAS",
              "searchMode": "oktmo"
            },
            {
              "name": "fias__oktmo",
              "title": "ОКТМО",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "fias__address",
              "title": "Адрес",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "fias__id",
              "title": "id",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "completion_date",
              "title": "Дата окончания работ",
              "valueType": "DATETIME"
            },
            {
              "name": "beginning_date",
              "title": "Дата начала работ",
              "valueType": "DATETIME"
            },
            {
              "name": "date_of_doc",
              "title": "Год создания документа",
              "valueType": "DATETIME"
            },
            {
              "name": "d_actual",
              "title": "Дата актуализации",
              "valueType": "DATETIME",
              "description": "Если проводилась"
            },
            {
              "name": "value_of_doc",
              "title": "Значение документа",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Утверждаемая часть",
                  "value": "UCH"
                },
                {
                  "title": "Материалы по обоснованию",
                  "value": "MO"
                }
              ]
            },
            {
              "name": "file",
              "title": "Выбор документов",
              "maxSize": 500000000,
              "maxFiles": 500,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "native_crs",
              "title": "Система координат",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Pulkovo 1942 CS63 zone X4",
                  "value": "EPSG: 7828"
                },
                {
                  "title": "Pulkovo 1942 CS63 zone X5",
                  "value": "EPSG: 7829"
                }
              ]
            },
            {
              "name": "project",
              "title": "Проект",
              "maxLength": 150,
              "valueType": "URL"
            },
            {
              "name": "name_of_work",
              "title": "Наименование работы",
              "valueType": "STRING",
              "description": "Должно соответствовать названию в Битрикс"
            },
            {
              "name": "description",
              "title": "Описание раздела",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "accuracy",
              "title": "Детализация",
              "valueType": "STRING",
              "description": "Для ортофотопланов"
            },
            {
              "name": "scale",
              "title": "Номинальный масштаб",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "500000",
                  "value": "500000"
                },
                {
                  "title": "200000",
                  "value": "200000"
                },
                {
                  "title": "100000",
                  "value": "100000"
                },
                {
                  "title": "50000",
                  "value": "50000"
                },
                {
                  "title": "25000",
                  "value": "25000"
                },
                {
                  "title": "10000",
                  "value": "10000"
                },
                {
                  "title": "5000",
                  "value": "5000"
                },
                {
                  "title": "2000",
                  "value": "2000"
                },
                {
                  "title": "1000",
                  "value": "1000"
                },
                {
                  "title": "500",
                  "value": "500"
                },
                {
                  "title": "200",
                  "value": "200"
                }
              ]
            }
          ],
          "description": "Документы по работам Геоплан",
          "contentTypes": [
            {
              "id": "text_doc",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Текстовые документы",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "id_proj",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "value_of_doc"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__id",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "graphic_rasters",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Графические материалы в растровом формате",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "id_proj",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "value_of_doc"
                },
                {
                  "name": "status",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "graphic_vectors",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Графические векторные материалы",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "id_proj",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "value_of_doc"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "doc_tiff",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Документы в формате geotiff",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "id_proj",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "name",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "type_of_work",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "value_of_doc"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "responsible",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias",
                  "readOnly": "true",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__oktmo",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "fias__address",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "accuracy"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "file",
                  "title": "Выбор документов",
                  "maxSize": 500000000,
                  "maxFiles": 100,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Добавить раздел",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "description"
                }
              ]
            },
            {
              "id": "folder_v2",
              "icon": "FOLDER",
              "type": "FOLDER",
              "title": "Добавить новую работу",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "name_of_work"
                },
                {
                  "name": "id_proj"
                },
                {
                  "name": "name"
                },
                {
                  "name": "type_of_work"
                },
                {
                  "name": "status"
                },
                {
                  "name": "performer"
                },
                {
                  "name": "responsible"
                },
                {
                  "name": "fias"
                },
                {
                  "name": "fias__oktmo"
                },
                {
                  "name": "fias__address"
                },
                {
                  "name": "customer"
                },
                {
                  "name": "beginning_date"
                },
                {
                  "name": "completion_date"
                },
                {
                  "name": "d_actual"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_projects_geoplan_schema';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Электронный архив"
          ],
          "name": "research_type",
          "title": "Вид изысканий",
          "tableName": "research_type",
          "properties": [
            {
              "name": "id",
              "title": "id",
              "readOnly": true,
              "required": true,
              "valueType": "INT"
            },
            {
              "name": "path",
              "title": "Путь",
              "hidden": true,
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Полный путь,отражающий иерархию объектов"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "valueType": "BOOLEAN",
              "description": "Папка или Документ"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "readOnly": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "readOnly": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "content_type_id",
              "title": "Вид документа",
              "hidden": true,
              "maxLength": 522,
              "valueType": "STRING"
            },
            {
              "name": "title",
              "title": "Наименование вида изученности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Инженерно-геодезическое",
                  "value": "0Н.1"
                },
                {
                  "title": "Инженерно-геологическое",
                  "value": "0Н.2"
                },
                {
                  "title": "Инженерно-гидрометеорологическое",
                  "value": "0Н.3"
                },
                {
                  "title": "Инженерно-экологические",
                  "value": "0Н.4"
                },
                {
                  "title": "Инженерно-геотехнические",
                  "value": "0Н.5"
                },
                {
                  "title": "Инженерно-геофизические",
                  "value": "0Н.6"
                },
                {
                  "title": "Археологические изыскания",
                  "value": "0Н.7"
                },
                {
                  "title": "Морские инженерно-геологические изыскания",
                  "value": "0Н.8"
                }
              ]
            },
            {
              "name": "code",
              "title": "Наименование вида изученности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Инженерно-геодезическое",
                  "value": "0Н.1"
                },
                {
                  "title": "Инженерно-геологическое",
                  "value": "0Н.2"
                },
                {
                  "title": "Инженерно-гидрометеорологическое",
                  "value": "0Н.3"
                },
                {
                  "title": "Инженерно-экологические",
                  "value": "0Н.4"
                },
                {
                  "title": "Инженерно-геотехнические",
                  "value": "0Н.5"
                },
                {
                  "title": "Инженерно-геофизические",
                  "value": "0Н.6"
                },
                {
                  "title": "Археологические изыскания",
                  "value": "0Н.7"
                },
                {
                  "title": "Морские инженерно-геологические изыскания",
                  "value": "0Н.8"
                }
              ]
            },
            {
              "name": "gisogdrf_response",
              "title": "Ответ ГИСОГД",
              "readOnly": true,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "valueType": "STRING"
            }
          ],
          "description": "Вид изысканий",
          "contentTypes": [
            {
              "id": "какое-то инженерное изыскание",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Карточка документа",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "code"
                },
                {
                  "name": "gisogdrf_response"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Папка",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500
                }
              ]
            }
          ]
        }'
WHERE name = 'research_type';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Владельцы"
          ],
          "name": "dl_data_owners_schema",
          "title": "Собственники",
          "readOnly": true,
          "tableName": "dl_data_owners",
          "properties": [
            {
              "name": "id",
              "title": "id",
              "hidden": true,
              "readOnly": true,
              "valueType": "INT"
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер исходного ЗУ",
              "hidden": true,
              "asTitle": true,
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "territorykey_for_build",
              "title": "Территория действия",
              "readOnly": true,
              "valueType": "URL",
              "description": "Объект на карте",
              "displayMode": "newTab",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_32:buildings_new_1_96b6",
                  "scratch_database_32:zu_new_k_1_df89"
                ],
                "property": "dl_data_owners_connections",
                "projectId": 1846
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "territorykey_for_zu",
              "title": "Территория действия",
              "hidden": true,
              "readOnly": true,
              "valueType": "URL",
              "description": "Объект на карте",
              "displayMode": "newTab",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_32:zu_new_k_1_df89"
                ],
                "property": "file",
                "projectId": 1565
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "content_type_id",
              "title": "Идентификатор контент типа",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ?",
              "required": true,
              "valueType": "BOOLEAN"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "hidden": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "owner_fio",
              "title": "ФИО собственника",
              "minWidth": 150,
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата последней модификации",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "readOnly": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "type_own",
              "title": "Тип собственности",
              "minWidth": 100,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная",
                  "value": "Государственная"
                },
                {
                  "title": "Физическая",
                  "value": "Физическая"
                },
                {
                  "title": "Юридическая",
                  "value": "Юридическая"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "ad_reg",
              "title": "Адрес регистрации",
              "minWidth": 200,
              "valueType": "STRING"
            },
            {
              "name": "ad_fact",
              "title": "Адрес фактический",
              "minWidth": 200,
              "valueType": "STRING"
            },
            {
              "name": "tel",
              "title": "Контактный номер",
              "minWidth": 200,
              "valueType": "STRING"
            },
            {
              "name": "note",
              "title": "Примечание",
              "minWidth": 200,
              "valueType": "TEXT"
            },
            {
              "name": "ser_pasport",
              "title": "Серия паспорта",
              "maxLength": 5,
              "valueType": "STRING"
            },
            {
              "name": "num_pasport",
              "title": "Номер паспорта",
              "maxLength": 7,
              "valueType": "STRING"
            },
            {
              "name": "date_birth",
              "title": "Дата рождения",
              "minWidth": 200,
              "valueType": "DATETIME",
              "dateFormat": "LL"
            },
            {
              "name": "place_birth",
              "title": "Место рождения",
              "minWidth": 200,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "pas_issued",
              "title": "Кем выдан паспорт",
              "minWidth": 200,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "date_issue_pas",
              "title": "Дата выдачи паспорта",
              "minWidth": 180,
              "valueType": "DATETIME",
              "dateFormat": "LL"
            },
            {
              "name": "unit_code",
              "title": "Код подразделения",
              "maxLength": 15,
              "valueType": "STRING"
            },
            {
              "name": "inn",
              "title": "ИНН",
              "maxLength": 15,
              "valueType": "STRING"
            },
            {
              "name": "num_schet",
              "title": "№ л.с. получателя",
              "maxLength": 24,
              "valueType": "STRING"
            },
            {
              "name": "banking",
              "title": "Банк получателя",
              "valueType": "STRING"
            },
            {
              "name": "file",
              "title": "Личные данные",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "file_1",
              "title": "Реквизиты счета",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "file_2",
              "title": "Согласие на обработку перссональных данных",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "document_feedback",
              "title": "Квартиры и помещения",
              "valueType": "URL",
              "valueFormulaParams": {
                "text": "Найти связанные документы",
                "library": "dl_data_flats",
                "property": "dl_data_owners_connections",
                "includeParents": true
              },
              "calculatedValueWellKnownFormula": "linkToDocumentsMentioningThisDocument"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "description": "Правообладатель",
          "contentTypes": [
            {
              "id": "owner",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Правообладатель",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cad_num"
                },
                {
                  "name": "territorykey_for_build"
                },
                {
                  "name": "tel"
                },
                {
                  "name": "file"
                },
                {
                  "name": "file_1"
                },
                {
                  "name": "inn"
                },
                {
                  "name": "file_2"
                },
                {
                  "name": "document_feedback"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
              "children": [
                {
                  "contentType": "owner"
                },
                {
                  "contentType": "folder_v1"
                }
              ],
              "childOnly": true,
              "attributes": [
                {
                  "name": "title",
                  "title": "Название раздела",
                  "required": true,
                  "maxLength": 500,
                  "valueType": "STRING"
                }
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'dl_data_owners';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "dl_data_doc",
          "title": "Документы",
          "tags": [
            "system",
            "Библиотека"
          ],
          "tableName": "dl_data_doc",
          "properties": [
            {
              "name": "id",
              "title": "Идентификатор",
              "valueType": "INT"
            },
            {
              "name": "is_folder",
              "title": "Признак раздела",
              "valueType": "BOOLEAN"
            },
            {
              "name": "path",
              "title": "Путь",
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Полный путь, отражающий иерархию объектов"
            },
            {
              "name": "content_type_id",
              "title": "Идентификатор контент типа",
              "valueType": "STRING",
              "required": true,
              "maxLength": 50
            },
            {
              "name": "title",
              "title": "Наименование документа",
              "valueType": "STRING",
              "required": true
            },
            {
              "name": "doc_num",
              "title": "Номер документа",
              "valueType": "STRING"
            },
            {
              "name": "files",
              "title": "Файлы",
              "valueType": "FILE",
              "multiple": true,
              "maxSize": 50000000,
              "maxFiles": 10
            },
            {
              "name": "relations",
              "title": "Связанные документы",
              "valueType": "DOCUMENT",
              "multiple": true,
              "libraries": [
                "dl_data_doc"
              ],
              "maxDocuments": 10
            },
            {
              "name": "note",
              "title": "Примечания",
              "maxLength": 522,
              "valueType": "STRING",
              "display": "multiline"
            }
          ],
          "description": "Библиотека документов",
          "originName": "dl_data_doc",
          "contentTypes": [
            {
              "id": "doc_tif",
              "type": "DOCUMENT",
              "title": "Документ",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "doc_num"
                },
                {
                  "name": "files"
                },
                {
                  "name": "relations"
                },
                {
                  "name": "created_at",
                  "title": "Внесено"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование раздела"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_doc';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "dl_data_terplan_doc",
          "title": "Документы развития территорий",
          "tags": [
            "system",
            "Библиотека",
            "Тер.планирование"
          ],
          "tableName": "dl_data_terplan_doc",
          "properties": [
            {
              "name": "id",
              "title": "Идентификатор",
              "valueType": "INT"
            },
            {
              "name": "is_folder",
              "title": "Признак раздела",
              "valueType": "BOOLEAN"
            },
            {
              "name": "path",
              "title": "Путь",
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Полный путь, отражающий иерархию объектов"
            },
            {
              "name": "content_type_id",
              "title": "Идентификатор контент типа",
              "valueType": "CHOICE",
              "hidden": true,
              "maxLength": 50,
              "enumerations": [
                {
                  "value": "doc",
                  "title": "Документ"
                },
                {
                  "value": "folder",
                  "title": "Папка"
                }
              ]
            },
            {
              "name": "title",
              "title": "Наименование",
              "valueType": "STRING",
              "required": true,
              "maxLength": 500
            },
            {
              "name": "status_type",
              "title": "Статус документа",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "value": "Проектный",
                  "title": "Проектный"
                },
                {
                  "value": "Действующий",
                  "title": "Действующий"
                },
                {
                  "value": "Архивный",
                  "title": "Архивный"
                }
              ]
            },
            {
              "name": "document_type",
              "title": "Тип документа",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "value": "СТП",
                  "title": "Схема территориального планирования"
                },
                {
                  "value": "Проект планировки территории",
                  "title": "Проект планировки территории"
                },
                {
                  "value": "Проект межевания территории",
                  "title": "Проект межевания территории"
                },
                {
                  "value": "Генеральный план поселения",
                  "title": "Генеральный план поселения"
                },
                {
                  "value": "Генеральный план городского округа",
                  "title": "Генеральный план городского округа"
                },
                {
                  "value": "Генеральная схема развития транспортной инфраструктуры",
                  "title": "Генеральная схема развития транспортной инфраструктуры"
                },
                {
                  "value": "Местные нормативы градостроительного проектирования",
                  "title": "Местные нормативы градостроительного проектирования"
                },
                {
                  "value": "Программы комплексного развития",
                  "title": "Программы комплексного развития систем инженерной, транспортной и социальной инфраструктуры"
                },
                {
                  "value": "Прочие",
                  "title": "Прочие"
                }
              ]
            },
            {
              "name": "doc_num",
              "title": "Номер документа",
              "valueType": "STRING",
              "required": true
            },
            {
              "name": "approve_date",
              "title": "Дата утверждения",
              "valueType": "DATETIME"
            },
            {
              "name": "org_name",
              "title": "Утвердивший орган",
              "valueType": "STRING"
            },
            {
              "name": "files",
              "title": "Файлы",
              "valueType": "FILE",
              "multiple": true,
              "maxSize": 50000000
            },
            {
              "name": "guiddocpreviousversion",
              "title": "Версии",
              "valueType": "DOCUMENT",
              "multiple": true,
              "description": "Предыдущие версии документа",
              "libraries": [
                "dl_data_doc",
                "dl_data_terplan_doc"
              ],
              "maxDocuments": 10
            },
            {
              "name": "relations",
              "title": "Связанные документы",
              "valueType": "DOCUMENT",
              "multiple": true,
              "libraries": [
                "dl_data_doc",
                "dl_data_terplan_doc"
              ],
              "maxDocuments": 10
            },
            {
              "name": "note",
              "title": "Примечания",
              "maxLength": 522,
              "valueType": "STRING",
              "display": "multiline"
            }
          ],
          "description": "Библиотека для документов территориального планирования",
          "originName": "dl_data_terplan_doc",
          "styleName": "dl_data_terplan_doc",
          "geometryType": "MultiPolygon",
          "contentTypes": [
            {
              "id": "doc",
              "type": "DOCUMENT",
              "title": "Документ",
              "icon": "GPZU",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "doc_num"
                },
                {
                  "name": "status_type"
                },
                {
                  "name": "document_type"
                },
                {
                  "name": "approve_date"
                },
                {
                  "name": "org_name"
                },
                {
                  "name": "files"
                },
                {
                  "name": "relations"
                },
                {
                  "name": "guiddocpreviousversion"
                },
                {
                  "name": "note"
                },
                {
                  "name": "created_at",
                  "title": "Внесено"
                }
              ]
            },
            {
              "id": "folder",
              "type": "FOLDER",
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование раздела"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_terplan_doc';
