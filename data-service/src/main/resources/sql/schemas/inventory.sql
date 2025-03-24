INSERT INTO data.schemas (name, class_rule)
SELECT 'building',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'building');
INSERT INTO data.schemas (name, class_rule)
SELECT 'buildings_construction_electro',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'buildings_construction_electro');
INSERT INTO data.schemas (name, class_rule)
SELECT 'buildings_mis_desc',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'buildings_mis_desc');
INSERT INTO data.schemas (name, class_rule)
SELECT 'buildings_new',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'buildings_new');
INSERT INTO data.schemas (name, class_rule)
SELECT 'buildings_valuation',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'buildings_valuation');
INSERT INTO data.schemas (name, class_rule)
SELECT 'buildings_valuation_new',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'buildings_valuation_new');
INSERT INTO data.schemas (name, class_rule)
SELECT 'oks_archive',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'oks_archive');
INSERT INTO data.schemas (name, class_rule)
SELECT 'oks_general',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'oks_general');
INSERT INTO data.schemas (name, class_rule)
SELECT 'oks_krymtel',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'oks_krymtel');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_2_surveys_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_2_surveys_schema');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_court_cases',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_court_cases');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_documents',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_documents');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_law_doc_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_law_doc_schema');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_limits_balaklava_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_limits_balaklava_schema');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_result',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_result');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_dtp',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_dtp');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_flats',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_flats');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_initial',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_initial');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_flats',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_flats');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_owners_balaklava_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_owners_balaklava_schema');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_oks_property_yugip_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_oks_property_yugip_schema');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_flats_balaklava_schema',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_flats_balaklava_schema');
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_rentobject',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_rentobject');


UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "building",
          "title": "Здания",
          "styleName": "building",
          "tableName": "building",
          "properties": [
            {
              "name": "address",
              "title": "Адрес",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "name",
              "title": "Номер дома",
              "valueType": "STRING"
            },
            {
              "name": "notes",
              "title": "Примечание",
              "valueType": "TEXT"
            },
            {
              "name": "area_doc_2",
              "title": "Площадь фактическая, м. кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            }
          ],
          "description": "Здания",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'building';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "buildings_construction_electro",
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "buildings_construction_electro",
          "title": "Здания и сооружения",
          "tableName": "buildings_construction_electro",
          "originName": "buildings_construction_electro",
          "properties": [
            {
              "name": "cad_num",
              "title": "Кадастровый номер ОКС",
              "maxLength": 25,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "name",
              "title": "Наименование объекта",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "objecttype",
              "title": "Вид ОКС",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Здание",
                  "value": "Здание"
                },
                {
                  "title": "Сооружение",
                  "value": "Сооружение"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "readablead",
              "title": "Адрес",
              "valueType": "TEXT",
              "asTitle": true
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Учтен",
                  "value": "Учтен"
                },
                {
                  "title": "Учтен без уточнения границ",
                  "value": "Учтен без уточнения границ"
                },
                {
                  "title": "Не поставлен на учет",
                  "value": "Не поставлен на учет"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "source",
              "title": "Источник данных",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ЕГРН",
                  "value": "ЕГРН"
                },
                {
                  "title": "Геодезическая съемка",
                  "value": "Геодезическая съемка"
                },
                {
                  "title": "Проектная документация",
                  "value": "Проектная документация"
                },
                {
                  "title": "Выявленный при обследовании",
                  "value": "Выявленный при обследовании"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "purpose",
              "title": "Назначение",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "owner",
              "title": "Правообладатель",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "area_doc",
              "title": "Площадь фактическая, м. кв.",
              "readOnly": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "photo",
              "title": "Фотофиксация",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "maxDocuments": 20
            },
            {
              "name": "doc",
              "title": "Документы",
              "library": "dl_doc_library",
              "minWidth": 0,
              "multiple": true,
              "valueType": "DOCUMENT",
              "maxDocuments": 50
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "required": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            }
          ],
          "description": "Здания и сооружения",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'buildings_construction_electro';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "buildings_mis_desc",
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "buildings_mis_desc",
          "title": "Здания и сооружения",
          "tableName": "buildings_mis_desc",
          "originName": "buildings_mis_desc",
          "properties": [
            {
              "name": "globalid",
              "title": "Идентификатор объекта",
              "hidden": true,
              "pattern": "(urn: uuid: )?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|\\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\}",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "STRING"
            }
          ],
          "description": "Здания и сооружения",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'buildings_mis_desc';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "buildings_new",
          "title": "Здания",
          "relations": [
            {
              "type": "document",
              "title": "Собственник",
              "property": "cadastralnum",
              "targetProperty": "cad_num"
            },
            {
              "type": "document",
              "title": "Документы",
              "property": "cadastralnum"
            },
            {
              "type": "document",
              "title": "Квартиры и помещения",
              "library": "dl_data_flats",
              "property": "cadastralnum",
              "targetProperty": "cad_oks"
            }
          ],
          "styleName": "buildings_new",
          "tableName": "buildings_new",
          "originName": "buildings_new",
          "properties": [
            {
              "name": "cadastralnum",
              "title": "Кадастровый номер ОКС",
              "asTitle": true,
              "required": true,
              "maxLength": 20,
              "valueType": "STRING"
            },
            {
              "name": "num_oks",
              "title": "Номер ОКС",
              "asTitle": true,
              "required": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "cad_num_zu",
              "title": "Кадастровый номер земельного участка",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "readablead",
              "title": "Адрес",
              "asTitle": true,
              "required": true,
              "maxLength": 300,
              "valueType": "STRING"
            },
            {
              "name": "purpose",
              "title": "Назначение здания",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "cost",
              "title": "Кадастровая стоимость, р.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_kpt",
              "title": "Площадь ЕГРН, м.кв.",
              "valueType": "DOUBLE",
              "description": "Площадь указанная в КПТ",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_fact_autocalc",
              "title": "Площадь фактическая, м. кв.",
              "readOnly": true,
              "valueType": "DOUBLE",
              "description": "Площадь расчитаная автоматически",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "dl_data_owners_connections",
              "title": "Собственник",
              "multiple": true,
              "libraries": [
                "dl_data_owners"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 3
            },
            {
              "name": "dl_data_documents_connections",
              "title": "Документы",
              "multiple": true,
              "libraries": [
                "dl_data_documents"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 6
            },
            {
              "name": "dl_data_flats_connections",
              "title": "Квартиры и помещения",
              "multiple": true,
              "libraries": [
                "dl_data_flats"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 3
            },
            {
              "name": "doc_egrn",
              "title": "Документы привязанные к данном объекту",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "maxDocuments": 25
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
              "title": "Дата модификации",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "STRING"
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
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'buildings_new';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "buildings_valuation",
          "title": "Здания. Инвентарный план",
          "relations": [
            {
              "type": "document",
              "title": "Квартиры и помещения в составе ОКС",
              "library": "dl_data_flats_balaklava",
              "property": "cad_oks"
            },
            {
              "type": "document",
              "title": "Ограничения и обременения на ОКС",
              "library": "dl_data_limits_balaklava",
              "property": "cad_oks",
              "targetProperty": "title"
            },
            {
              "type": "document",
              "title": "Зарегистрированные права на ОКС",
              "library": "dl_data_owners_balaklava",
              "property": "cad_oks",
              "targetProperty": "title"
            }
          ],
          "styleName": "buildings_valuation",
          "tableName": "buildings_valuation",
          "originName": "buildings_valuation",
          "properties": [
            {
              "name": "n_ter",
              "title": "Номер территории",
              "hidden": true,
              "required": true,
              "valueType": "INT"
            },
            {
              "name": "kod",
              "title": "Номер на плане",
              "asTitle": true,
              "required": true,
              "maxLength": 8,
              "valueType": "STRING"
            },
            {
              "name": "cad_zu",
              "title": "Кадастровый номер земельного участка",
              "asTitle": true,
              "required": true,
              "maxLength": 20,
              "valueType": "STRING"
            },
            {
              "name": "type_oks",
              "title": "Вид ОКС",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Здание",
                  "value": "Здание"
                },
                {
                  "title": "Сооружение",
                  "value": "Сооружение"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "cad_oks",
              "title": "Кадастровый номер объекта недвижимости",
              "asTitle": true,
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "address",
              "title": "Адрес",
              "asTitle": true,
              "required": true,
              "maxLength": 300,
              "valueType": "STRING"
            },
            {
              "name": "okn",
              "title": "Объект культурного наследия",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Является ОКН",
                  "value": "да"
                },
                {
                  "title": "Не является ОКН",
                  "value": "нет"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "purpose",
              "title": "Назначение по ЕГРН",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Многоквартирный дом",
                  "value": "МКД"
                },
                {
                  "title": "Жилой дом",
                  "value": "ИЖС"
                },
                {
                  "title": "Нежилое",
                  "value": "Н"
                },
                {
                  "title": "Садовый дом",
                  "value": "СД"
                },
                {
                  "title": "Иные",
                  "value": "Иные"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "name",
              "title": "Фактическое назначение",
              "asTitle": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "t_ppt",
              "title": "Тип ОКС для ППТ",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Многоквартирная жилая застройка",
                  "value": "1"
                },
                {
                  "title": "Индивидуальная жилая застройка",
                  "value": "2"
                },
                {
                  "title": "Общественно-делового назначения ",
                  "value": "3"
                },
                {
                  "title": "Социального и коммунально-бытового обслуживания",
                  "value": "4"
                },
                {
                  "title": "Производственного и коммунально-складского назначения",
                  "value": "5"
                },
                {
                  "title": "Инженерной инфраструктуры",
                  "value": "6"
                },
                {
                  "title": "Транспортной инфраструктуры",
                  "value": "7"
                },
                {
                  "title": "Гостиничного обслуживания ",
                  "value": "8"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "t_own",
              "title": "Форма собственности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Федеральная",
                  "value": "1"
                },
                {
                  "title": "Государственная",
                  "value": "2"
                },
                {
                  "title": "Частная",
                  "value": "3"
                },
                {
                  "title": "Хозяйственное ведение",
                  "value": "4"
                },
                {
                  "title": "Принят на учет как бесхозяйный объект недвижимого имущества",
                  "value": "5"
                },
                {
                  "title": "Оперативное управление",
                  "value": "6"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "7"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "area_doc",
              "title": "Площадь ЕГРН, м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_fact",
              "title": "Площадь фактическая, м. кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_bti",
              "title": "Площадь помещений общая (БТИ), м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "total_fl",
              "title": "Количество жилых помещений (квартир)",
              "valueType": "INT"
            },
            {
              "name": "a_rooms_fl",
              "title": "Площадь жилых помещений (для МКД), м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "total_n",
              "title": "Количество нежилых помещений",
              "valueType": "INT"
            },
            {
              "name": "a_rooms_n",
              "title": "Площадь нежилых помещений (для МКД/ОЗ), м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "floor_gr",
              "title": "Количество этажей в т.ч. подземных, мансарда",
              "valueType": "INT"
            },
            {
              "name": "floor_und",
              "title": "Количество подземных этажей",
              "valueType": "INT"
            },
            {
              "name": "source",
              "title": "Источник данных",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ЕГРН",
                  "value": "ЕГРН"
                },
                {
                  "title": "Выявленный при обследовании",
                  "value": "Выявленный при обследовании"
                },
                {
                  "title": "БТИ",
                  "value": "БТИ"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "photo",
              "title": "Фотофиксация",
              "multiple": true,
              "required": true,
              "valueType": "FILE",
              "maxDocuments": 20
            },
            {
              "name": "doc_egrn",
              "title": "Выписка ЕГРН",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "maxDocuments": 25
            },
            {
              "name": "doc_bti",
              "title": "Инвентарное дело БТИ",
              "maxSize": 50000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE",
              "maxDocuments": 10
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "шейп",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'buildings_valuation';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "buildings_valuation_new",
          "title": "Здания. Инвентарный план",
          "relations": [
            {
              "type": "document",
              "title": "Квартиры и помещения в составе ОКС",
              "library": "dl_data_flats_balaklava",
              "property": "cad_oks"
            },
            {
              "type": "document",
              "title": "Ограничения и обременения на ОКС",
              "library": "dl_data_limits_balaklava",
              "property": "cad_oks",
              "targetProperty": "title"
            },
            {
              "type": "document",
              "title": "Зарегистрированные права на ОКС",
              "library": "dl_data_owners_balaklava",
              "property": "cad_oks",
              "targetProperty": "title"
            },
            {
              "type": "feature",
              "title": "Перейти к ЗУ",
              "layers": [
                "scratch_database_11: zu_valuation_new_1353_8002"
              ],
              "property": "cad_zu",
              "projectId": 1193,
              "targetProperty": "cad_zu"
            }
          ],
          "styleName": "buildings_valuation_new",
          "tableName": "buildings_valuation_new",
          "originName": "buildings_valuation_new",
          "properties": [
            {
              "name": "n_ter",
              "title": "Номер территории",
              "required": true,
              "valueType": "INT"
            },
            {
              "name": "kod",
              "title": "Номер на плане",
              "asTitle": true,
              "required": true,
              "maxLength": 8,
              "valueType": "STRING"
            },
            {
              "name": "cad_zu",
              "title": "Кадастровый номер земельного участка",
              "asTitle": true,
              "required": true,
              "maxLength": 20,
              "valueType": "STRING"
            },
            {
              "name": "type_oks",
              "title": "Вид ОКС",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Здание",
                  "value": "Здание"
                },
                {
                  "title": "Сооружение",
                  "value": "Сооружение"
                },
                {
                  "title": "Объект незавершенного строительства",
                  "value": "объект незавершенного строительства"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "Данные отсутствуют"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "cad_oks",
              "title": "Кадастровый номер объекта недвижимости",
              "asTitle": true,
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "address",
              "title": "Адрес",
              "asTitle": true,
              "required": true,
              "maxLength": 300,
              "valueType": "STRING"
            },
            {
              "name": "okn",
              "title": "Объект культурного наследия",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Является ОКН",
                  "value": "да"
                },
                {
                  "title": "Не является ОКН",
                  "value": "нет"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "Данные отсутствуют"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "purpose",
              "title": "Назначение по ЕГРН",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Многоквартирный дом",
                  "value": "Многоквартирный дом"
                },
                {
                  "title": "Жилой дом",
                  "value": "Жилой дом"
                },
                {
                  "title": "Нежилое здание",
                  "value": "Нежилое здание"
                },
                {
                  "title": "Садовый дом",
                  "value": "Садовый дом"
                },
                {
                  "title": "Иные",
                  "value": "Иные"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "Данные отсутствуют"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "bti_name",
              "title": "Назначение по БТИ",
              "asTitle": true,
              "valueType": "STRING"
            },
            {
              "name": "name",
              "title": "Фактическое назначение",
              "asTitle": true,
              "valueType": "STRING"
            },
            {
              "name": "t_ppt",
              "title": "Тип ОКС для ППТ",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Многоквартирная жилая застройка",
                  "value": "1"
                },
                {
                  "title": "Индивидуальная жилая застройка",
                  "value": "2"
                },
                {
                  "title": "Общественно-делового назначения ",
                  "value": "3"
                },
                {
                  "title": "Социального и коммунально-бытового обслуживания",
                  "value": "4"
                },
                {
                  "title": "Производственного и коммунально-складского назначения",
                  "value": "5"
                },
                {
                  "title": "Инженерной инфраструктуры",
                  "value": "6"
                },
                {
                  "title": "Транспортной инфраструктуры",
                  "value": "7"
                },
                {
                  "title": "Гостиничного обслуживания ",
                  "value": "8"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "Данные отсутствуют"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "t_own",
              "title": "Форма собственности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная федеральная",
                  "value": "Государственная федеральная"
                },
                {
                  "title": "Государственная субъектов РФ",
                  "value": "Государственная субъектов РФ"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                },
                {
                  "title": "Принят на учет как бесхозяйный объект недвижимого имущества",
                  "value": "Принят на учет как бесхозяйный объект недвижимого имущества"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "Данные отсутствуют"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "area_doc",
              "title": "Площадь ЕГРН, м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_fact_autocalc",
              "title": "Площадь фактическая, м. кв.",
              "readOnly": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_bti",
              "title": "Площадь помещений общая (БТИ), м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "total_fl",
              "title": "Количество жилых помещений (квартир)",
              "valueType": "INT"
            },
            {
              "name": "a_rooms_fl",
              "title": "Площадь жилых помещений (для МКД), м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "floor_gr",
              "title": "Количество этажей в т.ч. подземных, мансарда",
              "valueType": "INT"
            },
            {
              "name": "floor_und",
              "title": "Количество подземных этажей",
              "valueType": "INT"
            },
            {
              "name": "source",
              "title": "Источник данных",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ЕГРН",
                  "value": "ЕГРН"
                },
                {
                  "title": "Выявленный при обследовании",
                  "value": "Выявленный при обследовании"
                },
                {
                  "title": "БТИ",
                  "value": "БТИ"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "Данные отсутствуют"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "defunct",
              "title": "ОКС демонтирован",
              "valueType": "BOOLEAN"
            },
            {
              "name": "doc_egrn",
              "title": "Выписка ЕГРН",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "maxDocuments": 25
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "шейп",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'buildings_valuation_new';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "oks_archive",
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "oks_archive",
          "title": "Объекты капитального строительства",
          "tableName": "oks_archive",
          "originName": "oks_archive",
          "properties": [
            {
              "name": "id_oks",
              "title": "id объекта",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "cad_oks",
              "title": "Кадастровый номер ОКСа",
              "required": true,
              "maxLength": 25,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "owner",
              "title": "Вид собственника",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Фізична особа",
                  "value": "Физическое лицо"
                },
                {
                  "title": "Юридична особа",
                  "value": "Юридическое лицо"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "name_oks",
              "title": "Собственник",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "t_own",
              "title": "Форма собственности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Приватна власність",
                  "value": "Частная собственность"
                },
                {
                  "title": "Комунальна власність",
                  "value": "Коммунальная собственность"
                },
                {
                  "title": "Державна власність",
                  "value": "Государственная собственность"
                }
              ]
            },
            {
              "name": "start_date",
              "title": "Дата возникновения права собственности",
              "valueType": "DATETIME",
              "dateFormat": "LL"
            },
            {
              "name": "end_date",
              "title": "Дата прекращения права собственности",
              "valueType": "DATETIME",
              "dateFormat": "LL"
            },
            {
              "name": "address",
              "title": "Адрес",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "usage",
              "title": "Назначение здания",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "source",
              "title": "Источник данных",
              "hidden": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "area_doc",
              "title": "Площадь, м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_fact",
              "title": "Фактическая площадь, м. кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "photo",
              "title": "Фотофиксация",
              "maxSize": 100000000,
              "multiple": true,
              "valueType": "FILE",
              "maxDocuments": 10
            },
            {
              "name": "doc",
              "title": "Документы",
              "maxSize": 150000000,
              "multiple": true,
              "valueType": "FILE",
              "description": "Документы подтверждающие право собственности",
              "maxDocuments": 10
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'oks_archive';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "oks_general",
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "oks_general",
          "title": "Объекты капитального строительства",
          "readOnly": true,
          "tableName": "oks_general",
          "originName": "oks_general",
          "properties": [
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "num_oks",
              "title": "Номер ОКС",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "purpose",
              "title": "Назначение здания",
              "maxLength": 100,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "otypecode",
              "title": "Вид объекта недвижимости (код)",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Объекты учёта и регистрации",
                  "value": "002001000000"
                },
                {
                  "title": "Земельный участок",
                  "value": "002001001000"
                },
                {
                  "title": "Здание",
                  "value": "002001002000"
                },
                {
                  "title": "Помещение",
                  "value": "002001003000"
                },
                {
                  "title": "Сооружение",
                  "value": "002001004000"
                },
                {
                  "title": "Линейное сооружение, расположенное более чем в одном кадастровом округе",
                  "value": "002001004001"
                },
                {
                  "title": "Условная часть линейного сооружения",
                  "value": "002001004002"
                },
                {
                  "title": "Объект незавершённого строительства",
                  "value": "002001005000"
                },
                {
                  "title": "Предприятие как имущественный комплекс (ПИК)",
                  "value": "002001006000"
                },
                {
                  "title": "Участок недр",
                  "value": "002001007000"
                },
                {
                  "title": "Единый недвижимый комплекс",
                  "value": "002001008000"
                },
                {
                  "title": "Границы",
                  "value": "002002000000"
                },
                {
                  "title": "Государственная граница Российской Федерации",
                  "value": "002002001000"
                },
                {
                  "title": "Граница между субъектами Российской Федерации",
                  "value": "002002002000"
                },
                {
                  "title": "Граница муниципального образования",
                  "value": "002002003000"
                },
                {
                  "title": "Граница населённого пункта",
                  "value": "002002004000"
                },
                {
                  "title": "Зоны",
                  "value": "002003000000"
                },
                {
                  "title": "Зона с особыми условиями использования территорий",
                  "value": "002003001000"
                },
                {
                  "title": "Территориальная зона",
                  "value": "002003002000"
                },
                {
                  "title": "Особая экономическая зона",
                  "value": "002003003000"
                },
                {
                  "title": "Территория объекта культурного наследия",
                  "value": "002004000000"
                }
              ]
            },
            {
              "name": "objecttype",
              "title": "Вид объекта недвижимости",
              "required": true,
              "maxLength": 100,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "usage",
              "title": "Разрешенное использование",
              "valueType": "TEXT",
              "asTitle": true
            },
            {
              "name": "raddress",
              "title": "Адрес в соответствии с ФИАС",
              "required": true,
              "valueType": "TEXT",
              "asTitle": true
            },
            {
              "name": "escription",
              "title": "Описание местоположения ОКС",
              "valueType": "TEXT",
              "asTitle": true
            },
            {
              "name": "cost",
              "title": "Кадастровая стоимость",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "area_doc",
              "title": "Площадь по документу",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            }
          ],
          "description": "Объекты капитального строительства",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'oks_general';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "oks_krymtel",
          "tags": [
            "system",
            "Инвентаризация недвижимости"
          ],
          "name": "oks_krymtel",
          "title": "Здания",
          "relations": [
            {
              "type": "document",
              "title": "Помещения в составе ОКС",
              "library": "dl_data_premises_and_apartments",
              "property": "cad_oks"
            },
            {
              "type": "feature",
              "title": "Перейти к ЗУ",
              "layers": [
                "scratch_database_18: zu_krymtel_1422_9ab3"
              ],
              "property": "cad_zu",
              "projectId": 1422,
              "targetProperty": "cad_zu"
            }
          ],
          "tableName": "oks_krymtel",
          "originName": "oks_krymtel",
          "properties": [
            {
              "name": "cad_zu",
              "title": "Кадастровый номер земельного участка",
              "required": true,
              "maxLength": 20,
              "valueType": "STRING"
            },
            {
              "name": "cad_oks",
              "title": "Кадастровый номер объекта недвижимости",
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Сформированный",
                  "value": "Сформированный"
                },
                {
                  "title": "Несформированный",
                  "value": "Несформированный"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "address",
              "title": "Адрес",
              "required": true,
              "maxLength": 300,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "type_oks",
              "title": "Вид ОКС",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Здание",
                  "value": "Здание"
                },
                {
                  "title": "Сооружение",
                  "value": "Сооружение"
                },
                {
                  "title": "Объект незавершенного строительства",
                  "value": "объект незавершенного строительства"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "purpose",
              "title": "Назначение по ЕГРН",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Жилой дом",
                  "value": "Жилой дом"
                },
                {
                  "title": "Нежилое здание ",
                  "value": "Нежилое здание "
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "name",
              "title": "Наименование по ЕГРН",
              "valueType": "STRING"
            },
            {
              "name": "name_bti",
              "title": "Наименование по БТИ",
              "valueType": "STRING"
            },
            {
              "name": "area_doc",
              "title": "Площадь ЕГРН, м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "active",
              "title": "Используется в производственной деятельности",
              "valueType": "BOOLEAN"
            },
            {
              "name": "source",
              "title": "Источник данных",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ЕГРН",
                  "value": "ЕГРН"
                },
                {
                  "title": "Выявленный при обследовании",
                  "value": "Выявленный при обследовании"
                },
                {
                  "title": "БТИ",
                  "value": "БТИ"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "doc_egrn",
              "title": "Выписка ЕГРН",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "maxDocuments": 25
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'oks_krymtel';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_2_surveys_schema",
          "title": "2. Градостроительная документация",
          "tableName": "dl_data_2_surveys",
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
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
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
              "name": "type",
              "title": "Тип",
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
                  "title": "ДПТ",
                  "value": "1"
                },
                {
                  "title": "ПМТ",
                  "value": "2"
                },
                {
                  "title": "ППТ",
                  "value": "3"
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
          "description": "2. Градостроительная документация",
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
WHERE name = 'dl_data_2_surveys_schema';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_court_cases",
          "title": "Документы",
          "tableName": "dl_data_court_cases",
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
              "name": "content_type_id",
              "title": "Вид документа",
              "hidden": true,
              "minWidth": 100,
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Выписки ЕГРН",
                  "value": "folder_v1"
                },
                {
                  "title": "Выписка ЕГРН",
                  "value": "doc_egrn"
                },
                {
                  "title": "Договора купли продажи",
                  "value": "folder_v2"
                },
                {
                  "title": "Договор купли продажи",
                  "value": "doc_dkp"
                },
                {
                  "title": "Уставные документы",
                  "value": "folder_v3"
                },
                {
                  "title": "Уставные документы",
                  "value": "doc_approv"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "territorykey_for_buildings",
              "title": "Территория действия",
              "readOnly": true,
              "valueType": "URL",
              "description": "Объект на карте",
              "displayMode": "newTab",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_32: buildings_new_1_96b6"
                ],
                "property": "cadastralnum",
                "projectId": 1846
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "territorykey_for_zu",
              "title": "Территория действия",
              "readOnly": true,
              "valueType": "URL",
              "description": "Объект на карте",
              "displayMode": "newTab"
            },
            {
              "name": "path",
              "title": "Путь",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "title",
              "title": "Наименование",
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "cadastralnum",
              "title": "Кадастровый номер",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Адрес",
              "minWidth": 100,
              "valueType": "FIAS",
              "searchMode": "address"
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
              "minWidth": 400,
              "valueType": "STRING"
            },
            {
              "name": "fias__id",
              "title": "Код ФИАС",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "document_egrn",
              "title": "Выписка",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "document_dkp",
              "title": "Договор купли продажи",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "document_approv",
              "title": "Уставные документы",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "note",
              "title": "Примечание",
              "display": "multiline",
              "minWidth": 200,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "required": true,
              "maxLength": 50,
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
              "title": "Последняя модификация",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации"
            }
          ],
          "description": "Документы",
          "contentTypes": [
            {
              "id": "doc_egrn",
              "icon": "GPZU",
              "type": "DOCUMENT",
              "title": "Выписка ЕГРН",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cadastralnum"
                },
                {
                  "name": "territorykey_for_buildings"
                },
                {
                  "name": "territorykey_for_zu"
                },
                {
                  "name": "fias",
                  "title": "Адрес"
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
                  "name": "document_egrn"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "doc_dkp",
              "icon": "GPZU",
              "type": "DOCUMENT",
              "title": "Договор купли продажи",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cadastralnum"
                },
                {
                  "name": "territorykey_for_buildings"
                },
                {
                  "name": "territorykey_for_zu"
                },
                {
                  "name": "fias",
                  "title": "Адрес"
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
                  "name": "document_dkp"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "doc_approv",
              "icon": "GPZU",
              "type": "DOCUMENT",
              "title": "Уставные документы",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cadastralnum"
                },
                {
                  "name": "territorykey_for_buildings"
                },
                {
                  "name": "territorykey_for_zu"
                },
                {
                  "name": "fias",
                  "title": "Адрес"
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
                  "name": "document_approv"
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
                  "contentType": "doc_egrn"
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
                },
                {
                  "name": "fias",
                  "title": "Адрес",
                  "valueType": "FIAS",
                  "searchMode": "address"
                },
                {
                  "name": "fias__oktmo"
                },
                {
                  "name": "fias__address"
                },
                {
                  "name": "fias__id"
                }
              ]
            },
            {
              "id": "folder_v2",
              "type": "FOLDER",
              "children": [
                {
                  "contentType": "doc_dkp"
                },
                {
                  "contentType": "folder_v2"
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
                },
                {
                  "name": "fias",
                  "title": "Адрес",
                  "valueType": "FIAS",
                  "searchMode": "address"
                },
                {
                  "name": "fias__oktmo"
                },
                {
                  "name": "fias__address"
                },
                {
                  "name": "fias__id"
                }
              ]
            },
            {
              "id": "folder_v3",
              "type": "FOLDER",
              "children": [
                {
                  "contentType": "doc_approv"
                },
                {
                  "contentType": "folder_v3"
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
                },
                {
                  "name": "fias",
                  "title": "Адрес",
                  "valueType": "FIAS",
                  "searchMode": "address"
                },
                {
                  "name": "fias__oktmo"
                },
                {
                  "name": "fias__address"
                },
                {
                  "name": "fias__id"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_court_cases';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_documents",
          "title": "Документы",
          "tableName": "dl_data_documents",
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
              "name": "content_type_id",
              "title": "Вид документа",
              "hidden": true,
              "minWidth": 100,
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Выписки ЕГРН",
                  "value": "folder_v1"
                },
                {
                  "title": "Выписка ЕГРН",
                  "value": "doc_egrn"
                },
                {
                  "title": "Договора купли продажи",
                  "value": "folder_v2"
                },
                {
                  "title": "Договор купли продажи",
                  "value": "doc_dkp"
                },
                {
                  "title": "Уставные документы",
                  "value": "folder_v3"
                },
                {
                  "title": "Уставные документы",
                  "value": "doc_approv"
                },
                {
                  "title": "Раздел",
                  "value": "folder_v4"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "territorykey",
              "title": "Территория действия",
              "readOnly": true,
              "valueType": "URL",
              "description": "Объект на карте",
              "displayMode": "newTab"
            },
            {
              "name": "document_feedback",
              "title": "Квартиры и помещения",
              "valueType": "URL",
              "valueFormulaParams": {
                "text": "Найти связанные документы",
                "library": "dl_data_flats",
                "property": "dl_data_documents_connections",
                "includeParents": true
              },
              "calculatedValueWellKnownFormula": "linkToDocumentsMentioningThisDocument"
            },
            {
              "name": "path",
              "title": "Путь",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "title",
              "title": "Наименование",
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "cadastralnum",
              "title": "Кадастровый номер",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "vendor",
              "title": "Продавец",
              "valueType": "STRING"
            },
            {
              "name": "customer",
              "title": "Покупатель",
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Адрес",
              "minWidth": 100,
              "valueType": "FIAS",
              "searchMode": "address"
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
              "minWidth": 400,
              "valueType": "STRING"
            },
            {
              "name": "fias__id",
              "title": "Код ФИАС",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "document_egrn",
              "title": "Выписка",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "document_dkp",
              "title": "Договор купли продажи",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "document_approv",
              "title": "Уставные документы",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "note",
              "title": "Примечание",
              "display": "multiline",
              "minWidth": 200,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "required": true,
              "maxLength": 50,
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
              "title": "Последняя модификация",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации"
            }
          ],
          "description": "Документы",
          "contentTypes": [
            {
              "id": "doc_egrn",
              "icon": "GPZU",
              "type": "DOCUMENT",
              "title": "Выписка ЕГРН",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cadastralnum"
                },
                {
                  "name": "territorykey"
                },
                {
                  "name": "fias",
                  "title": "Адрес"
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
                  "name": "document_feedback"
                },
                {
                  "name": "document_egrn"
                }
              ]
            },
            {
              "id": "doc_dkp",
              "icon": "GPZU",
              "type": "DOCUMENT",
              "title": "Договор купли продажи",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cadastralnum"
                },
                {
                  "name": "vendor"
                },
                {
                  "name": "customer"
                },
                {
                  "name": "territorykey"
                },
                {
                  "name": "fias",
                  "title": "Адрес"
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
                  "name": "document_feedback"
                },
                {
                  "name": "document_dkp"
                }
              ]
            },
            {
              "id": "doc_approv",
              "icon": "GPZU",
              "type": "DOCUMENT",
              "title": "Уставные документы",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cadastralnum"
                },
                {
                  "name": "territorykey"
                },
                {
                  "name": "fias",
                  "title": "Адрес"
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
                  "name": "document_feedback"
                },
                {
                  "name": "document_approv"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
              "title": "Выписка ЕГРН",
              "children": [
                {
                  "contentType": "doc_egrn"
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
                },
                {
                  "name": "fias",
                  "title": "Адрес",
                  "valueType": "FIAS",
                  "searchMode": "address"
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
                  "name": "territorykey"
                }
              ]
            },
            {
              "id": "folder_v2",
              "type": "FOLDER",
              "title": "Договор купли продажи",
              "children": [
                {
                  "contentType": "doc_dkp"
                },
                {
                  "contentType": "folder_v2"
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
                },
                {
                  "name": "fias",
                  "title": "Адрес",
                  "valueType": "FIAS",
                  "searchMode": "address"
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
                  "name": "territorykey"
                }
              ]
            },
            {
              "id": "folder_v3",
              "type": "FOLDER",
              "title": "Уставные документы",
              "children": [
                {
                  "contentType": "doc_approv"
                },
                {
                  "contentType": "folder_v3"
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
                },
                {
                  "name": "fias",
                  "title": "Адрес",
                  "valueType": "FIAS",
                  "searchMode": "address"
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
                  "name": "territorykey"
                }
              ]
            },
            {
              "id": "folder_v4",
              "type": "FOLDER",
              "title": "Раздел",
              "children": [
                {
                  "contentType": "folder_v1"
                },
                {
                  "contentType": "folder_v2"
                },
                {
                  "contentType": "folder_v3"
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
                },
                {
                  "name": "territorykey"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_documents';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_law_doc_schema",
          "title": "Юридические документы",
          "tableName": "dl_data_law_doc",
          "originName": "dl_data_law_doc",
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
              "title": "Идентификатор контент типа",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
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
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "title",
              "title": "Название документа",
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
              "name": "inner_path",
              "title": "Где лежит",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "type",
              "title": "Тип",
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
              "name": "customer",
              "title": "Заказчик",
              "valueType": "STRING"
            },
            {
              "name": "id_proj",
              "title": "ID проекта",
              "valueType": "INT"
            },
            {
              "name": "date_of_doc",
              "title": "Год создания документа",
              "valueType": "DATETIME"
            },
            {
              "name": "name",
              "title": "Название проекта",
              "valueType": "STRING"
            },
            {
              "name": "approval_date",
              "title": "Дата утверждения документа",
              "valueType": "DATETIME"
            },
            {
              "name": "performer",
              "title": "Исполнитель",
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Адрес",
              "valueType": "FIAS",
              "searchMode": "address"
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
              "name": "ghostylink",
              "title": "Переход на Карту проектов",
              "readOnly": true,
              "valueType": "URL",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_21: igdi_1371_bf7c"
                ],
                "property": "doc",
                "projectId": 1371
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "file",
              "title": "Выбор документов",
              "maxSize": 50000000,
              "maxFiles": 500,
              "multiple": true,
              "valueType": "FILE"
            }
          ],
          "description": "Юридичские документы",
          "contentTypes": [
            {
              "id": "contracts",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "customer"
                },
                {
                  "name": "id_proj"
                },
                {
                  "name": "name"
                },
                {
                  "name": "performer"
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
                  "name": "date_of_doc"
                },
                {
                  "name": "approval_date"
                },
                {
                  "name": "file",
                  "title": "Добавить документ",
                  "maxSize": 50000000,
                  "maxFiles": 10,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
              "attributes": [
                {
                  "name": "title",
                  "title": "Добавить папку",
                  "required": true,
                  "maxLength": 500,
                  "valueType": "STRING"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_law_doc_schema';


UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_limits_balaklava_schema",
          "title": "Ограничения и обременения",
          "tableName": "dl_data_limits_balaklava",
          "originName": "dl_data_limits_balaklava",
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
              "title": "Идентификатор контент типа",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
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
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
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
              "name": "type",
              "title": "Тип",
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
              "name": "person",
              "title": "Вид объекта недвижимости",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Здание",
                  "value": "Здание"
                },
                {
                  "title": "Сооружение",
                  "value": "Сооружение"
                },
                {
                  "title": "Земельный участок",
                  "value": "Земельный участок"
                },
                {
                  "title": "Объект незавершенного строительства",
                  "value": "Объект незавершенного строительства"
                }
              ]
            },
            {
              "name": "title",
              "title": "Кадастровый номер",
              "minWidth": 150,
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "area_zouit",
              "title": "Площадь объекта, обремененная ЗОУИТ",
              "minWidth": 210,
              "valueType": "DOUBLE",
              "totalDigits": 10,
              "fractionDigits": 2
            },
            {
              "name": "type_right",
              "title": "Вид ограничения",
              "minWidth": 120,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Запрещение регистрации",
                  "value": "Запрещение регистрации"
                },
                {
                  "title": "Арест",
                  "value": "Арест"
                },
                {
                  "title": "Ипотека в силу закона",
                  "value": "Ипотека в силу закона"
                },
                {
                  "title": "Ограничения прав на земельный участок, предусмотренные статьей 56 Земельного кодекса РФ",
                  "value": "Ограничения прав на земельный участок, предусмотренные статьей 56 Земельного кодекса РФ"
                }
              ]
            },
            {
              "name": "reg_zouit",
              "title": "Дата постановки на учет ЗОУИТ",
              "valueType": "DATETIME"
            },
            {
              "name": "date_reg",
              "title": "Дата гос. регистрации",
              "valueType": "DATETIME"
            },
            {
              "name": "number",
              "title": "Номер гос. регистрации",
              "minWidth": 100,
              "maxLength": 224,
              "valueType": "STRING"
            },
            {
              "name": "period",
              "title": "Срок ограничения",
              "minWidth": 200,
              "maxLength": 500,
              "valueType": "STRING",
              "description": "Срок, на который установленно ограничение"
            },
            {
              "name": "person_with_limits",
              "title": "Лицо, в пользу которого установлено ограничение",
              "minWidth": 250,
              "maxLength": 224,
              "valueType": "STRING"
            },
            {
              "name": "reason",
              "title": "Основание гос. регистрации",
              "minWidth": 170,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "content",
              "title": "Содержание ограничения и обременения",
              "minWidth": 300,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "date_closing",
              "title": "Дата прекращения",
              "valueType": "DATETIME"
            },
            {
              "name": "file",
              "title": "Документы",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            }
          ],
          "description": "Ограничения и обременения",
          "contentTypes": [
            {
              "id": "owner",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Ограничения и обременения",
              "attributes": [
                {
                  "name": "person"
                },
                {
                  "name": "title"
                },
                {
                  "name": "area_zouit"
                },
                {
                  "name": "type_right"
                },
                {
                  "name": "reg_zouit"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "number"
                },
                {
                  "name": "period"
                },
                {
                  "name": "person_with_limits"
                },
                {
                  "name": "reason"
                },
                {
                  "name": "content"
                },
                {
                  "name": "date_closing"
                },
                {
                  "name": "file",
                  "title": "Документы",
                  "maxSize": 50000000,
                  "maxFiles": 10,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
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
WHERE name = 'dl_data_limits_balaklava_schema';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_result",
          "title": "Итоговые документы",
          "relations": [
            {
              "type": "feature",
              "title": "Объект на карте",
              "layers": [
                "scratch_database_11: result_100214_b42a"
              ],
              "property": "num_ter",
              "projectId": 1467,
              "targetProperty": "num_ter"
            }
          ],
          "tableName": "dl_data_result",
          "originName": "dl_data_result",
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
              "minWidth": 400,
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Полный путь, отражающий иерархию объектов"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "readOnly": true,
              "valueType": "BOOLEAN",
              "description": "Папка или Документ"
            },
            {
              "name": "content_type_id",
              "title": "Тип",
              "minWidth": 300,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Документ",
                  "value": "text_doc"
                },
                {
                  "title": "Папка",
                  "value": "folder"
                }
              ]
            },
            {
              "name": "num_ter",
              "title": "Номер территории",
              "valueType": "STRING"
            },
            {
              "name": "document_type",
              "title": "Вид изысканий",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Инженерно-геодезические изыскания",
                  "value": "IGDI"
                },
                {
                  "title": "Инженерно-геологические изыскания",
                  "value": "IGI"
                },
                {
                  "title": "Инженерно-экологические изыскания",
                  "value": "IEI"
                },
                {
                  "title": "Инженерно-гидрометеорологические изыскания",
                  "value": "IGMI"
                },
                {
                  "title": "Дендрологические изыскания",
                  "value": "DI"
                },
                {
                  "title": "Иные изыскания",
                  "value": "II"
                }
              ]
            },
            {
              "name": "title",
              "title": "Наименование документа",
              "minWidth": 400,
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "name_obj",
              "title": "Наименование объекта",
              "minWidth": 400,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "number",
              "title": "ID сделки",
              "valueType": "STRING",
              "description": "Должно соответствовать id в Битрикс"
            },
            {
              "name": "status_type",
              "title": "Статус документа",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "В работе",
                  "value": "В работе"
                },
                {
                  "title": "Согласован (утвержден)",
                  "value": "Согласован (утвержден)"
                },
                {
                  "title": "Иной",
                  "value": "Иной"
                }
              ]
            },
            {
              "name": "native_crs",
              "title": "Система координат",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Pulkovo 1942 / CS63 ZONE X4",
                  "value": "EPSG: 7828"
                },
                {
                  "title": "Pulkovo 1942 / CS63 ZONE X5",
                  "value": "EPSG: 7829"
                },
                {
                  "title": "MSK Sevastopol",
                  "value": "MSK Sevastopol"
                },
                {
                  "title": "WGS 84 / Pseudo-Mercator",
                  "value": "EPSG: 3857"
                }
              ]
            },
            {
              "name": "scale",
              "title": "Номинальный масштаб",
              "valueType": "CHOICE",
              "enumerations": [
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
                }
              ]
            },
            {
              "name": "date_of_doc",
              "title": "Год создания документа",
              "valueType": "STRING"
            },
            {
              "name": "note",
              "title": "Примечание",
              "display": "multiline",
              "minWidth": 400,
              "valueType": "TEXT"
            },
            {
              "name": "file",
              "title": "Выбор документа",
              "maxSize": 90000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
            },
            {
              "name": "guiddocpreviousversion",
              "title": "Версии",
              "library": "dl_data_result",
              "multiple": true,
              "valueType": "DOCUMENT",
              "description": "Предыдущая версия данных",
              "maxDocuments": 10
            },
            {
              "name": "relations",
              "title": "Связанные документы",
              "multiple": true,
              "libraries": [
                "dl_data_result",
                "dl_data_contracts_buyout",
                "dl_data_flats_balaklava",
                "dl_data_limits_balaklava",
                "dl_data_oks_property_yugip",
                "dl_data_owners_balaklava"
              ],
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
            },
            {
              "name": "type",
              "title": "Тип",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "description": "Итоговые документы",
          "contentTypes": [
            {
              "id": "text_doc",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Документ",
              "attributes": [
                {
                  "name": "num_ter"
                },
                {
                  "name": "name_obj"
                },
                {
                  "name": "title"
                },
                {
                  "name": "document_type"
                },
                {
                  "name": "number"
                },
                {
                  "name": "date_of_doc"
                },
                {
                  "name": "status_type"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "note"
                },
                {
                  "name": "file"
                },
                {
                  "name": "guiddocpreviousversion"
                },
                {
                  "name": "relations"
                }
              ]
            },
            {
              "id": "folder",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Папка",
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
WHERE name = 'dl_data_result';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_dtp",
          "title": "Градостроительная документация",
          "tableName": "dl_dtp",
          "originName": "dl_dtp",
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
              "minWidth": 400,
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Полный путь,отражающий иерархию объектов"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN",
              "description": "Папка или Документ"
            },
            {
              "name": "content_type_id",
              "title": "Вид документа",
              "minWidth": 300,
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Генеральный план",
                  "value": "doc_tif1"
                },
                {
                  "title": "Правила землепользования и застройки",
                  "value": "doc_tif2"
                },
                {
                  "title": "Административное деление",
                  "value": "doc_tif3"
                },
                {
                  "title": "Папка",
                  "value": "folder_v1"
                }
              ]
            },
            {
              "name": "title",
              "title": "Наименование",
              "display": "multiline",
              "minWidth": 400,
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "docstatus",
              "title": "Статус действия",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Действующий",
                  "value": "0С.1"
                },
                {
                  "title": "Недействующий",
                  "value": "0С.2"
                },
                {
                  "title": "Проект",
                  "value": "0С.3"
                }
              ]
            },
            {
              "name": "native_crs",
              "title": "Система координат",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Pulkovo 1942 / Gauss-Kruger zone 6",
                  "value": "EPSG: 28406"
                },
                {
                  "title": "Pulkovo 1942 / CS63 ZONE X5",
                  "value": "EPSG: 7829"
                },
                {
                  "title": "WGS 84 / Pseudo-Mercator",
                  "value": "EPSG: 3857"
                },
                {
                  "title": "Отсутствует",
                  "value": "EPSG: null"
                }
              ]
            },
            {
              "name": "scale",
              "title": "Номинальный масштаб",
              "valueType": "CHOICE",
              "enumerations": [
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
                }
              ]
            },
            {
              "name": "note",
              "title": "Примечание",
              "display": "multiline",
              "minWidth": 400,
              "valueType": "TEXT"
            },
            {
              "name": "file",
              "title": "Выбор файла",
              "maxSize": 90000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
            },
            {
              "name": "guiddocpreviousversion",
              "title": "Версии",
              "library": "dl_dtp",
              "multiple": true,
              "valueType": "DOCUMENT",
              "description": "Предыдущая версия данных",
              "maxDocuments": 20
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
            },
            {
              "name": "type",
              "title": "Тип",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "description": "Градостроительная документация",
          "contentTypes": [
            {
              "id": "doc_tif1",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Генеральный план",
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "defaultValue": "doc_tif1"
                },
                {
                  "name": "title",
                  "description": "Полное наименование документа"
                },
                {
                  "name": "docstatus"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "note"
                },
                {
                  "name": "file"
                },
                {
                  "name": "guiddocpreviousversion"
                }
              ]
            },
            {
              "id": "doc_tif2",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Правила землепользования и застройки",
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "defaultValue": "doc_tif2"
                },
                {
                  "name": "title",
                  "description": "Полное наименование документа"
                },
                {
                  "name": "docstatus"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "note"
                },
                {
                  "name": "file"
                },
                {
                  "name": "guiddocpreviousversion"
                }
              ]
            },
            {
              "id": "doc_tif3",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Административное деление",
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Вид документа",
                  "defaultValue": "doc_tif3"
                },
                {
                  "name": "title",
                  "description": "Полное наименование документа"
                },
                {
                  "name": "docstatus"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "scale"
                },
                {
                  "name": "note"
                },
                {
                  "name": "file"
                },
                {
                  "name": "guiddocpreviousversion"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Папка",
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500
                },
                {
                  "name": "note",
                  "title": "Примечание",
                  "display": "multiline",
                  "valueType": "TEXT"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_dtp';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_flats",
          "title": "Помещения",
          "relations": [
            {
              "type": "feature",
              "title": "Помещение в составе ОКС",
              "layers": [
                "scratch_database_26: object_oks_23_ece5",
                "scratch_database_26: object_oks_line_23_28db"
              ],
              "property": "cadnum_oks",
              "projectId": 1500,
              "targetProperty": "cadnum_oks"
            }
          ],
          "tableName": "dl_flats",
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
              "minWidth": 400,
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Полный путь,отражающий иерархию объектов"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN",
              "description": "Папка или Документ"
            },
            {
              "name": "content_type_id",
              "title": "Вид объекта",
              "minWidth": 300,
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Помещение",
                  "value": "doc"
                },
                {
                  "title": "Папка",
                  "value": "folder_v1"
                }
              ]
            },
            {
              "name": "cad_status",
              "title": "Статус кадастровых работ",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Не требуются",
                  "value": "Не требуются"
                },
                {
                  "title": "В работе Геоплана",
                  "value": "В работе Геоплана"
                },
                {
                  "title": "Направлен в ведомства",
                  "value": "Направлен в ведомства"
                },
                {
                  "title": "Получена выписка ЕГРН",
                  "value": "Получена выписка ЕГРН"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "title",
              "title": "Наименование",
              "display": "multiline",
              "minWidth": 400,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "function",
              "title": "Назначение",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Жилое",
                  "value": "Жилое"
                },
                {
                  "title": "Нежилое",
                  "value": "Нежилое"
                }
              ]
            },
            {
              "name": "cadnum_oks",
              "title": "Кадастровый номер здания",
              "required": true,
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "cadnum_flat",
              "title": "Кадастровый номер помещения",
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Месторасположение",
              "minWidth": 400,
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
              "minWidth": 400,
              "valueType": "STRING"
            },
            {
              "name": "fias__id",
              "title": "Код ФИАС",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "area_egrn",
              "title": "Площадь по данным ЕГРН,м. кв.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "area_bti",
              "title": "Площадь по материалам БТИ,м. кв.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "area_cad",
              "title": "Площадь по результатам кадработ,м. кв.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "source",
              "title": "Источник данных",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "БТИ",
                  "value": "БТИ"
                },
                {
                  "title": "ЕГРН",
                  "value": "ЕГРН"
                },
                {
                  "title": "Выявленно при обследовании",
                  "value": "Выявленно при обследовании"
                }
              ]
            },
            {
              "name": "date",
              "title": "Дата постановки на кадастровый учёт",
              "valueType": "DATETIME"
            },
            {
              "name": "rent",
              "title": "Помещение передано в аренду",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Передано",
                  "value": "Передано"
                },
                {
                  "title": "Не передано",
                  "value": "Не передано"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "library",
              "title": "Материалы библиотеки",
              "library": "dl_rentobject",
              "multiple": true,
              "valueType": "DOCUMENT",
              "description": "Библиотека: Аренда объектов недвижимости",
              "maxDocuments": 20
            },
            {
              "name": "doc_egrn",
              "title": "Выписка ЕГРН",
              "maxSize": 90000000,
              "maxFiles": 5,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "doc_tp",
              "title": "Техплан",
              "maxSize": 90000000,
              "maxFiles": 5,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "doc_tp",
              "title": "Техплан",
              "maxSize": 90000000,
              "maxFiles": 5,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "photo",
              "title": "Фотофиксация",
              "maxSize": 100000000,
              "multiple": true,
              "valueType": "FILE",
              "maxDocuments": 10
            },
            {
              "name": "doc_other",
              "title": "Иные документы",
              "maxSize": 100000000,
              "multiple": true,
              "valueType": "FILE",
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
            },
            {
              "name": "type",
              "title": "Тип",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "maxLength": 50,
              "valueType": "INT"
            }
          ],
          "description": "Помещения",
          "contentTypes": [
            {
              "id": "fl",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Добавить помещение",
              "relations": [
                {
                  "type": "feature",
                  "title": "Помещение в составе ОКС",
                  "layers": [
                    "scratch_database_26: object_oks_23_ece5",
                    "scratch_database_26: object_oks_line_23_28db"
                  ],
                  "property": "cadnum_oks",
                  "projectId": 1500,
                  "targetProperty": "cadnum_oks"
                }
              ],
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "readOnly": true,
                  "defaultValue": "Помещение"
                },
                {
                  "name": "cad_status"
                },
                {
                  "name": "function"
                },
                {
                  "name": "cadnum_oks",
                  "defaultValueWellKnownFormula": "inherit"
                },
                {
                  "name": "cadnum_flat"
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
                  "name": "area_egrn"
                },
                {
                  "name": "area_bti"
                },
                {
                  "name": "area_cad"
                },
                {
                  "name": "source"
                },
                {
                  "name": "rent"
                },
                {
                  "name": "library"
                },
                {
                  "name": "date"
                },
                {
                  "name": "doc_egrn"
                },
                {
                  "name": "doc_tp"
                },
                {
                  "name": "doc_other"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Папка",
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500
                },
                {
                  "name": "cadnum_oks"
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
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_flats';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_initial",
          "title": "Исходные данные",
          "tableName": "dl_initial",
          "originName": "dl_initial",
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
              "minWidth": 400,
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Полный путь,отражающий иерархию объектов"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN",
              "description": "Папка или Документ"
            },
            {
              "name": "content_type_id",
              "title": "Вид документа",
              "minWidth": 300,
              "readOnly": true,
              "maxLength": 50,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Инженерные изыскания",
                  "value": "doc_tif"
                },
                {
                  "title": "Папка",
                  "value": "folder_v1"
                }
              ]
            },
            {
              "name": "title",
              "title": "Наименование",
              "display": "multiline",
              "minWidth": 400,
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "fias",
              "title": "Территория изысканий",
              "minWidth": 400,
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
              "minWidth": 400,
              "valueType": "STRING"
            },
            {
              "name": "fias__id",
              "title": "Код ФИАС",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "native_crs",
              "title": "Система координат",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Pulkovo 1942 / Gauss-Kruger zone 6",
                  "value": "EPSG: 28406"
                },
                {
                  "title": "Pulkovo 1942 / CS63 ZONE X5",
                  "value": "EPSG: 7829"
                },
                {
                  "title": "WGS 84 / Pseudo-Mercator",
                  "value": "EPSG: 3857"
                },
                {
                  "title": "Отсутствует",
                  "value": "EPSG: null"
                }
              ]
            },
            {
              "name": "scale",
              "title": "Номинальный масштаб",
              "valueType": "CHOICE",
              "enumerations": [
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
                }
              ]
            },
            {
              "name": "engineerorg",
              "title": "Организация",
              "valueType": "STRING",
              "description": "Организация,выполнившая подготовку материалов"
            },
            {
              "name": "note",
              "title": "Примечание",
              "display": "multiline",
              "minWidth": 400,
              "valueType": "TEXT"
            },
            {
              "name": "file",
              "title": "Выбор файла",
              "maxSize": 90000000,
              "maxFiles": 20,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
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
            },
            {
              "name": "type",
              "title": "Тип",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "description": "Исходные данные",
          "contentTypes": [
            {
              "id": "doc_tif",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Инженерные изыскания",
              "attributes": [
                {
                  "name": "title",
                  "description": "Полное наименование документа"
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
                  "name": "scale"
                },
                {
                  "name": "native_crs"
                },
                {
                  "name": "engineerorg"
                },
                {
                  "name": "note"
                },
                {
                  "name": "file"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Папка",
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500
                },
                {
                  "name": "note",
                  "title": "Примечание",
                  "display": "multiline",
                  "valueType": "TEXT"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_initial';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_flats",
          "title": "Квартиры и помещения",
          "relations": [
            {
              "type": "feature",
              "title": "Переход к объекту на карте",
              "layers": [
                "scratch_database_32:buildings_new_1_96b6"
              ],
              "property": "cad_num",
              "projectId": 1846,
              "targetProperty": "cad_num"
            }
          ],
          "tableName": "dl_data_flats",
          "originName": "dl_data_flats",
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
              "title": "Идентификатор контент типа",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "hidden": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN"
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
              "name": "title",
              "title": "Наименование объекта",
              "required": true,
              "valueType": "STRING"
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
                  "scratch_database_32:buildings_new_1_96b6"
                ],
                "property": "dl_data_flats_connections",
                "projectId": 1846,
                "includeParents": true
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            },
            {
              "name": "cad_oks",
              "title": "Кадастровый номер здания",
              "minWidth": 240,
              "required": true,
              "maxLength": 25,
              "valueType": "STRING",
              "description": "Если кадастрового номера здания нет, то указываем условный",
              "defaultValueFormula": "return parent.title"
            },
            {
              "name": "cad_kv",
              "title": "Кадастровый номер квартиры / помещения",
              "minWidth": 240,
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "naznach",
              "title": "Назначение",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Жилое",
                  "value": "Жилое"
                },
                {
                  "title": "Нежилое",
                  "value": "Нежилое"
                }
              ]
            },
            {
              "name": "area_egrn",
              "title": "Площадь по материалам ЕГРН, м. кв.",
              "minWidth": 230,
              "valueType": "DOUBLE",
              "totalDigits": 10,
              "fractionDigits": 2
            },
            {
              "name": "area_bti",
              "title": "Площадь по материалам БТИ, м. кв.",
              "minWidth": 230,
              "valueType": "DOUBLE",
              "totalDigits": 10,
              "fractionDigits": 2
            },
            {
              "name": "rooms",
              "title": "Количество жилых комнат",
              "minWidth": 160,
              "maxLength": 20,
              "valueType": "STRING"
            },
            {
              "name": "area_rooms",
              "title": "Площадь жилых комнат м.кв.",
              "minWidth": 180,
              "valueType": "DOUBLE",
              "totalDigits": 10,
              "fractionDigits": 2
            },
            {
              "name": "floor_loc",
              "title": "Расположение на этаже",
              "minWidth": 150,
              "valueType": "STRING"
            },
            {
              "name": "source",
              "title": "Источник",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "БТИ",
                  "value": "БТИ"
                },
                {
                  "title": "ЕГРН",
                  "value": "ЕГРН"
                },
                {
                  "title": "Выявленно при обследовании",
                  "value": "Выявленно при обследовании"
                }
              ]
            },
            {
              "name": "field_name",
              "title": "Адрес",
              "valueType": "FIAS"
            },
            {
              "name": "field_name__id",
              "title": "Адрес(id)",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "field_name__address",
              "title": "Адрес(address)",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "field_name__oktmo",
              "title": "Адрес(oktmo)",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "address",
              "title": "Адрес",
              "hidden": true,
              "minWidth": 150,
              "valueType": "STRING"
            },
            {
              "name": "t_own",
              "title": "Форма собственности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная федеральная",
                  "value": "Государственная федеральная"
                },
                {
                  "title": "Государственная субъектов РФ",
                  "value": "Государственная субъектов РФ"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                },
                {
                  "title": "Принят на учет как бесхозяйный объект недвижимого имущества",
                  "value": "Принят на учет как бесхозяйный объект недвижимого имущества"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "Данные отсутствуют"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "dl_data_owners_connections",
              "title": "Собственник",
              "multiple": true,
              "libraries": [
                "dl_data_owners"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 3
            },
            {
              "name": "note",
              "title": "Примечания",
              "minWidth": 150,
              "valueType": "TEXT"
            },
            {
              "name": "dl_data_documents_connections",
              "title": "Документы",
              "multiple": true,
              "libraries": [
                "dl_data_documents"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 6
            }
          ],
          "description": "Квартиры и помещения",
          "contentTypes": [
            {
              "id": "kv_balaklava",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Квартиры и помещения",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cad_oks"
                },
                {
                  "name": "cad_kv"
                },
                {
                  "name": "territorykey"
                },
                {
                  "name": "field_name"
                },
                {
                  "name": "field_name__id"
                },
                {
                  "name": "field_name__address"
                },
                {
                  "name": "field_name__oktmo"
                },
                {
                  "name": "t_own"
                },
                {
                  "name": "dl_data_owners_connections"
                },
                {
                  "name": "naznach"
                },
                {
                  "name": "area_egrn"
                },
                {
                  "name": "area_bti"
                },
                {
                  "name": "rooms"
                },
                {
                  "name": "area_rooms"
                },
                {
                  "name": "floor_loc"
                },
                {
                  "name": "note"
                },
                {
                  "name": "source"
                },
                {
                  "name": "dl_data_documents_connections"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование",
                  "required": true,
                  "maxLength": 500,
                  "valueType": "STRING"
                },
                {
                  "name": "territorykey"
                }
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'dl_data_flats';



UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_owners_balaklava_schema",
          "title": "Права",
          "readOnly": true,
          "tableName": "dl_data_owners_balaklava",
          "originName": "dl_data_owners_balaklava",
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
              "title": "Идентификатор контент типа",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "hidden": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "title",
              "title": "Кадастровый номер",
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
              "name": "inner_path",
              "title": "Где лежит",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "type",
              "title": "Тип",
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
              "name": "type_own",
              "title": "Тип собственности",
              "minWidth": 100,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Квартиры",
                  "value": "Квартиры"
                },
                {
                  "title": "ОКС",
                  "value": "ОКС"
                },
                {
                  "title": "ЗУ",
                  "value": "ЗУ"
                },
                {
                  "title": "Помещение",
                  "value": "Помещение"
                },
                {
                  "title": "Апартаменты",
                  "value": "Апартаменты"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "reg_number",
              "title": "Номер гос. регистрации права",
              "minWidth": 200,
              "valueType": "STRING"
            },
            {
              "name": "reg_date",
              "title": "Дата гос. регистрации права",
              "minWidth": 200,
              "valueType": "DATETIME",
              "dateFormat": "LL"
            },
            {
              "name": "close_date",
              "title": "Дата закрытия гос. регистрации",
              "minWidth": 180,
              "valueType": "DATETIME",
              "dateFormat": "LL"
            },
            {
              "name": "proprietor",
              "title": "Собственник",
              "minWidth": 350,
              "maxLength": 800,
              "valueType": "STRING"
            },
            {
              "name": "contact_phone",
              "title": "Номер телфона",
              "minWidth": 180,
              "valueType": "STRING"
            },
            {
              "name": "contact_email",
              "title": "Электронная почта",
              "minWidth": 200,
              "valueType": "STRING"
            },
            {
              "name": "contact_adress",
              "title": "Адрес проживания",
              "minWidth": 350,
              "valueType": "STRING"
            },
            {
              "name": "legal_reason",
              "title": "Основание гос. регистрации",
              "minWidth": 650,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "series",
              "title": "Серия",
              "minWidth": 80,
              "maxLength": 10,
              "valueType": "STRING"
            },
            {
              "name": "num_legal_reason",
              "title": "Номер основания",
              "minWidth": 200,
              "valueType": "STRING"
            },
            {
              "name": "date_legal_reason",
              "title": "Дата основания",
              "minWidth": 150,
              "valueType": "STRING"
            },
            {
              "name": "organization",
              "title": "Исполнительный орган",
              "minWidth": 700,
              "valueType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "valueType": "BOOLEAN"
            },
            {
              "name": "file",
              "title": "Документы",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "shape",
              "title": "тайтл",
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
              "attributes": [
                {
                  "name": "title",
                  "title": "Кадастровый номер"
                },
                {
                  "name": "type_own"
                },
                {
                  "name": "reg_number"
                },
                {
                  "name": "reg_date"
                },
                {
                  "name": "close_date"
                },
                {
                  "name": "proprietor"
                },
                {
                  "name": "contact_phone"
                },
                {
                  "name": "contact_email"
                },
                {
                  "name": "contact_adress"
                },
                {
                  "name": "legal_reason"
                },
                {
                  "name": "series"
                },
                {
                  "name": "num_legal_reason"
                },
                {
                  "name": "date_legal_reason"
                },
                {
                  "name": "organization"
                },
                {
                  "name": "is_folder"
                },
                {
                  "name": "file",
                  "title": "Документы",
                  "maxSize": 50000000,
                  "maxFiles": 10,
                  "multiple": true,
                  "valueType": "FILE"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
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
WHERE name = 'dl_data_owners_balaklava_schema';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_oks_property_yugip_schema",
          "title": "ОКС для выкупа",
          "tableName": "dl_data_oks_property_yugip",
          "originName": "dl_data_oks_property_yugip",
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
              "title": "Идентификатор контент типа",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "inner_path",
              "title": "Где лежит",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "hidden": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN"
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
              "name": "title",
              "title": "Наименование объекта",
              "maxLength": 300,
              "valueType": "STRING"
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "minWidth": 100,
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "address",
              "title": "Адрес",
              "minWidth": 250,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "area",
              "title": "Площадь, кв.м.",
              "minWidth": 230,
              "valueType": "DOUBLE",
              "totalDigits": 10,
              "fractionDigits": 2
            },
            {
              "name": "cost",
              "title": "Цена объекта, руб.",
              "valueType": "DOUBLE",
              "totalDigits": 15,
              "fractionDigits": 0
            },
            {
              "name": "note",
              "title": "Примечания",
              "minWidth": 300,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "doc",
              "title": "Выписка ЕГРН",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "photo",
              "title": "Фотофиксация",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "maxDocuments": 20
            },
            {
              "name": "ghostylink",
              "title": "Перейти к объекту на карте",
              "readOnly": true,
              "valueType": "URL",
              "valueFormulaParams": {
                "layers": [
                  "scratch_database_11:obj_property_yugip_1431_d46c"
                ],
                "property": "doc",
                "projectId": 1431
              },
              "calculatedValueWellKnownFormula": "linkToFeaturesMentioningThisDocument"
            }
          ],
          "description": "Добавить ОКС ",
          "contentTypes": [
            {
              "id": "oks_property",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "attributes": [
                {
                  "name": "ghostyLink"
                },
                {
                  "name": "title"
                },
                {
                  "name": "cad_num"
                },
                {
                  "name": "address"
                },
                {
                  "name": "area"
                },
                {
                  "name": "cost"
                },
                {
                  "name": "note"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Добавить папку",
              "attributes": [
                {
                  "name": "title",
                  "title": "Земельный участок",
                  "required": true,
                  "maxLength": 500,
                  "valueType": "STRING"
                }
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'dl_data_oks_property_yugip_schema';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_data_flats_balaklava_schema",
          "title": "Квартиры и помещения",
          "relations": [
            {
              "type": "document",
              "title": "Ограничения и обременения на квартиру",
              "library": "dl_data_limits_balaklava",
              "property": "cad_kv",
              "targetProperty": "title"
            },
            {
              "type": "document",
              "title": "Зарегистрированные права на квартиру",
              "library": "dl_data_owners_balaklava",
              "property": "cad_kv",
              "targetProperty": "title"
            }
          ],
          "tableName": "dl_data_flats_balaklava",
          "originName": "dl_data_flats_balaklava",
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
              "title": "Идентификатор контент типа",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "inner_path",
              "title": "Где лежит",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "path",
              "title": "Полный путь, отражающий иерархию объектов",
              "hidden": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN"
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
              "name": "title",
              "title": "Наименование объекта",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "cad_oks",
              "title": "Кадастровый номер здания",
              "minWidth": 240,
              "required": true,
              "maxLength": 25,
              "valueType": "STRING",
              "description": "Если кадастрового номера здания нет, то указываем условный"
            },
            {
              "name": "cad_kv",
              "title": "Кадастровый номер квартиры / помещения",
              "minWidth": 240,
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "naznach",
              "title": "Назначение",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Жилое",
                  "value": "Жилое"
                },
                {
                  "title": "Нежилое",
                  "value": "Нежилое"
                }
              ]
            },
            {
              "name": "area_egrn",
              "title": "Площадь по материалам ЕГРН, м. кв.",
              "minWidth": 230,
              "valueType": "DOUBLE",
              "totalDigits": 10,
              "fractionDigits": 2
            },
            {
              "name": "area_bti",
              "title": "Площадь по материалам БТИ, м. кв.",
              "minWidth": 230,
              "valueType": "DOUBLE",
              "totalDigits": 10,
              "fractionDigits": 2
            },
            {
              "name": "rooms",
              "title": "Количество жилых комнат ",
              "minWidth": 160,
              "maxLength": 20,
              "valueType": "STRING"
            },
            {
              "name": "area_rooms",
              "title": "Площадь жилых комнат м.кв.",
              "minWidth": 180,
              "valueType": "DOUBLE",
              "totalDigits": 10,
              "fractionDigits": 2
            },
            {
              "name": "floor_loc",
              "title": "Расположение на этаже",
              "minWidth": 150,
              "valueType": "STRING"
            },
            {
              "name": "source",
              "title": "Источник",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "БТИ",
                  "value": "БТИ"
                },
                {
                  "title": "ЕГРН",
                  "value": "ЕГРН"
                },
                {
                  "title": "Выявленно при обследовании",
                  "value": "Выявленно при обследовании"
                }
              ]
            },
            {
              "name": "address",
              "title": "Адрес",
              "minWidth": 150,
              "valueType": "STRING"
            },
            {
              "name": "t_own",
              "title": "Форма собственности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная федеральная",
                  "value": "Государственная федеральная"
                },
                {
                  "title": "Государственная субъектов РФ",
                  "value": "Государственная субъектов РФ"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                },
                {
                  "title": "Принят на учет как бесхозяйный объект недвижимого имущества",
                  "value": "Принят на учет как бесхозяйный объект недвижимого имущества"
                },
                {
                  "title": "Данные отсутствуют",
                  "value": "Данные отсутствуют"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "note",
              "title": "Примечания",
              "minWidth": 150,
              "valueType": "TEXT"
            },
            {
              "name": "doc_egrn",
              "title": "Выписка ЕГРН",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            }
          ],
          "description": "Квартиры и помещения",
          "contentTypes": [
            {
              "id": "kv_balaklava",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Квартиры и помещения",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "cad_oks"
                },
                {
                  "name": "cad_kv"
                },
                {
                  "name": "address"
                },
                {
                  "name": "t_own"
                },
                {
                  "name": "naznach"
                },
                {
                  "name": "area_egrn"
                },
                {
                  "name": "area_bti"
                },
                {
                  "name": "rooms"
                },
                {
                  "name": "area_rooms"
                },
                {
                  "name": "floor_loc"
                },
                {
                  "name": "note"
                },
                {
                  "name": "source"
                },
                {
                  "name": "doc_egrn"
                }
              ]
            },
            {
              "id": "folder_v1",
              "type": "FOLDER",
              "attributes": [
                {
                  "name": "title",
                  "title": "Новая территория",
                  "required": true,
                  "maxLength": 500,
                  "valueType": "STRING"
                }
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'dl_data_flats_balaklava_schema';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Библиотека",
            "Инвентаризация недвижимости"
          ],
          "name": "dl_rentobject",
          "title": "Аренда объектов недвижимости",
          "relations": [
            {
              "type": "feature",
              "title": "Объект на карте",
              "layers": [
                "scratch_database_26: object_zu_23_ca7c",
                "scratch_database_26: object_oks_23_ece5"
              ],
              "property": "cadnum_zu",
              "projectId": 1500,
              "targetProperty": "cadnum_zu"
            },
            {
              "type": "feature",
              "title": "Объект на карте",
              "layers": [
                "scratch_database_26: object_oks_23_ece5",
                "scratch_database_26: object_oks_23_ece5"
              ],
              "property": "cadnum_oks",
              "projectId": 1500,
              "targetProperty": "cadnum_oks"
            }
          ],
          "tableName": "dl_rentobject",
          "properties": [
            {
              "name": "content_type_id",
              "title": "Тип объекта недвижимости",
              "minWidth": 300,
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Земельный участок",
                  "value": "zu"
                },
                {
                  "title": "Объект капитального строительства",
                  "value": "oks"
                },
                {
                  "title": "Помещение",
                  "value": "flat"
                },
                {
                  "title": "Папка",
                  "value": "folder_v1"
                }
              ]
            },
            {
              "name": "title",
              "title": "Арендатор",
              "display": "multiline",
              "minWidth": 400,
              "required": true,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "cadnum_zu",
              "title": "Кадастровый номер земельного участка",
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "cadnum_oks",
              "title": "Кадастровый номер здания",
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "cadnum_flat",
              "title": "Кадастровый номер помещения",
              "maxLength": 25,
              "valueType": "STRING"
            },
            {
              "name": "docnum",
              "title": "Номер договора",
              "valueType": "STRING"
            },
            {
              "name": "docdate",
              "title": "Дата договора",
              "valueType": "DATETIME"
            },
            {
              "name": "validuntil",
              "title": "Срок действия договора",
              "valueType": "STRING"
            },
            {
              "name": "area",
              "title": "Площадь по договору,м. кв.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "cost_rent",
              "title": "Арендная плата,руб./мес.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "note",
              "title": "Примечания",
              "minWidth": 400,
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "file",
              "title": "Документы",
              "maxSize": 90000000,
              "maxFiles": 20,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
            },
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
              "minWidth": 150,
              "maxLength": 522,
              "valueType": "STRING",
              "description": "Полный путь,отражающий иерархию объектов"
            },
            {
              "name": "is_folder",
              "title": "Папка/Документ",
              "hidden": true,
              "valueType": "BOOLEAN",
              "description": "Папка или Документ"
            },
            {
              "name": "created_by",
              "title": "Создатель",
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
              "name": "type",
              "title": "Тип",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "size",
              "title": "Размер в kb",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "description": "Аренда объектов недвижимости",
          "contentTypes": [
            {
              "id": "zu",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Земельный участок",
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Тип объекта недвижимости",
                  "defaultValue": "zu"
                },
                {
                  "name": "title"
                },
                {
                  "name": "cadnum_zu"
                },
                {
                  "name": "docnum"
                },
                {
                  "name": "docdate"
                },
                {
                  "name": "validuntil"
                },
                {
                  "name": "area"
                },
                {
                  "name": "cost_rent"
                },
                {
                  "name": "note"
                },
                {
                  "name": "file"
                }
              ]
            },
            {
              "id": "oks",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Объект капитального строиетльства",
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Тип объекта недвижимости",
                  "defaultValue": "oks"
                },
                {
                  "name": "title"
                },
                {
                  "name": "cadnum_oks"
                },
                {
                  "name": "cadnum_zu"
                },
                {
                  "name": "docnum"
                },
                {
                  "name": "docdate"
                },
                {
                  "name": "validuntil"
                },
                {
                  "name": "area"
                },
                {
                  "name": "cost_rent"
                },
                {
                  "name": "note"
                },
                {
                  "name": "file"
                }
              ]
            },
            {
              "id": "flat",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Помещение",
              "attributes": [
                {
                  "name": "content_type_id",
                  "title": "Тип объекта недвижимости",
                  "defaultValue": "flat"
                },
                {
                  "name": "title"
                },
                {
                  "name": "cadnum_flat"
                },
                {
                  "name": "cadnum_oks"
                },
                {
                  "name": "docnum"
                },
                {
                  "name": "docdate"
                },
                {
                  "name": "validuntil"
                },
                {
                  "name": "area"
                },
                {
                  "name": "cost_rent"
                },
                {
                  "name": "note"
                },
                {
                  "name": "file"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Папка",
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
WHERE name = 'dl_rentobject';
