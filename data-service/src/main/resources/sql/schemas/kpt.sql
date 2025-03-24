-- Схемы: 'КПТ' захардкожены в коде. При внесении любых изменений, не забудьте найти и поправить.
INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_kpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_kpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'borderwaterobj_polilyne_pro',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'borderwaterobj_polilyne_pro');

INSERT INTO data.schemas (name, class_rule)
SELECT 'zu_pro',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'zu_pro');

INSERT INTO data.schemas (name, class_rule)
SELECT 'oks_pro',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'oks_pro');

INSERT INTO data.schemas (name, class_rule)
SELECT 'oks_polyline_pro',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'oks_polyline_pro');

INSERT INTO data.schemas (name, class_rule)
SELECT 'borderwaterobj',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'borderwaterobj');

INSERT INTO data.schemas (name, class_rule)
SELECT 'kvartal_kpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'kvartal_kpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'zouit_pro',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'zouit_pro');

INSERT INTO data.schemas (name, class_rule)
SELECT 'oks_constructions_points',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'oks_constructions_points');

INSERT INTO data.schemas (name, class_rule)
SELECT 'municipality_boundaries_egrn',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'municipality_boundaries_egrn');


UPDATE data.schemas
SET class_rule =
        '{
          "name": "dl_data_kpt",
          "tags": [
            "system",
            "КПТ",
            "Библиотека"
          ],
          "title": "КПТ",
          "tableName": "dl_data_kpt",
          "properties": [
            {
              "name": "id",
              "title": "Номер",
              "readOnly": true,
              "valueType": "INT"
            },
            {
              "name": "content_type_id",
              "title": "Вид документа",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "title",
              "title": "Наименование",
              "minWidth": 400,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "location",
              "title": "Местоположение",
              "valueType": "STRING"
            },
            {
              "name": "file",
              "title": "КПТ",
              "readOnly": true,
              "maxSize": 90000000,
              "maxFiles": 1,
              "valueType": "FILE"
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "STRING"
            }
          ],
          "description": "КПТ",
          "contentTypes": [
            {
              "id": "Карточка",
              "icon": "DOCUMENT",
              "type": "DOCUMENT",
              "title": "Карточка документа",
              "childOnly": true,
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "location",
                  "defaultValueWellKnownFormula": "inherit",
                  "description": "Наследуется от папки"
                },
                {
                  "name": "file"
                },
                {
                  "name": "created_at",
                  "title": "Дата загрузки",
                  "hidden": false
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "folder_v1",
              "icon": "FOLDER_CREATE",
              "type": "FOLDER",
              "title": "Папку",
              "attributes": [
                {
                  "name": "title"
                },
                {
                  "name": "location"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "note"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_kpt';


UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "borderwaterobj_polilyne_pro",
          "title": "Береговые линии (границы водных объектов)",
          "styleName": "borderwaterobj_polilyne_pro",
          "tableName": "borderwaterobj_polilyne_pro",
          "originName": "borderwaterobj_polilyne_pro",
          "properties": [
            {
              "name": "regnumborder",
              "title": "Реестровый номер границы",
              "asTitle": true,
              "required": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "btypecode",
              "title": "Вид объекта реестра границ (код)",
              "asTitle": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "btype",
              "title": "Вид объекта реестра границ",
              "asTitle": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "objectname",
              "title": "Наименование водного объекта",
              "asTitle": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "wocode",
              "title": "Вид объекта реестра границ (код)",
              "asTitle": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "wotype",
              "title": "Вид объекта реестра границ",
              "asTitle": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "rdate",
              "title": "Дата постановки на учет",
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата приёма данных из  АИС УМС"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            }
          ],
          "description": "Береговые линии (границы водных объектов)",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'borderwaterobj_polilyne_pro';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "zu_pro",
          "title": "Земельные участки",
          "readOnly": true,
          "styleName": "zu_pro",
          "tableName": "zu_pro",
          "properties": [
            {
              "name": "cadastralnum",
              "title": "Кадастровый номер",
              "asTitle": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "num_zu",
              "title": "Номер ЗУ",
              "asTitle": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "usage",
              "title": "Разрешенное использование по документу",
              "asTitle": true,
              "valueType": "TEXT"
            },
            {
              "name": "subtype",
              "title": "Вид земельного участка",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Землепользование",
                  "value": "Землепользование"
                },
                {
                  "title": "Многоконтурный участок",
                  "value": "Многоконтурный участок"
                },
                {
                  "title": "Обособленный участок",
                  "value": "Обособленный участок"
                }
              ]
            },
            {
              "name": "category",
              "title": "Категория земельного участка",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Земли водного фонда",
                  "value": "Земли водного фонда"
                },
                {
                  "title": "Земли лесного фонда",
                  "value": "Земли лесного фонда"
                },
                {
                  "title": "Земли особо охраняемых территорий и объектов",
                  "value": "Земли особо охраняемых территорий и объектов"
                },
                {
                  "title": "Земли запаса",
                  "value": "Земли запаса"
                },
                {
                  "title": "Земли населенных пунктов",
                  "value": "Земли населенных пунктов"
                },
                {
                  "title": "Земли сельскохозяйственного назначения",
                  "value": "Земли сельскохозяйственного назначения"
                },
                {
                  "title": "Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения",
                  "value": "Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения"
                },
                {
                  "title": "Категория не установлена",
                  "value": "Категория не установлена"
                },
                {
                  "title": "Не задано",
                  "value": "не задано"
                }
              ]
            },
            {
              "name": "readableaddress",
              "title": "Адрес в соответствии с ФИАС",
              "valueType": "TEXT"
            },
            {
              "name": "objecttype",
              "title": "Тип объекта недвижимости",
              "hidden": true,
              "maxLength": 100,
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
              "name": "area",
              "title": "Площадь вычисляемая, м.кв.",
              "valueType": "DOUBLE",
              "description": "Площадь вычисляемая из координат",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "area_doc_2",
              "title": "Площадь по документу, м. кв.",
              "valueType": "DOUBLE",
              "description": "Площадь указанная в КПТ",
              "totalDigits": 38,
              "fractionDigits": 0
            },
            {
              "name": "area_kpt",
              "title": "Площадь по документу, м. кв.",
              "hidden": true,
              "valueType": "DOUBLE",
              "description": "Площадь указанная в КПТ",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
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
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "aisums_property_type",
              "title": "Тип собственности АИС УМС",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "aisums_number",
              "title": "Номер АИС УМС",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата получения КПТ"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            }
          ],
          "description": "Земельные участки",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'zu_pro';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "oks_pro",
          "title": "Объекты капитального строительства",
          "readOnly": true,
          "styleName": "oks_pro",
          "tableName": "oks_pro",
          "properties": [
            {
              "name": "cadastralnum",
              "title": "Кадастровый номер",
              "asTitle": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "hidden": true,
              "asTitle": true,
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
              "name": "objecttype",
              "title": "Тип объекта недвижимости",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Объект незавершенного строительства",
                  "value": "Объект незавершенного строительства"
                },
                {
                  "title": "Сооружение",
                  "value": "Сооружение"
                },
                {
                  "title": "Здание",
                  "value": "Здание"
                }
              ]
            },
            {
              "name": "readablead",
              "title": "Адрес в соответствии с ФИАС",
              "asTitle": true,
              "required": true,
              "valueType": "TEXT"
            },
            {
              "name": "purpose",
              "title": "Назначение ОКС",
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
              "name": "area",
              "title": "Площадь вычисляемая, м.кв.",
              "valueType": "DOUBLE",
              "description": "Площадь вычисляемая",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "area_doc_2",
              "title": "Площадь по документу, м. кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_kpt",
              "title": "Площадь по документу, м. кв.",
              "hidden": true,
              "valueType": "DOUBLE",
              "description": "Площадь указанная в КПТ",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
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
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "aisums_property_type",
              "title": "Тип собственности АИС УМС",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "aisums_number",
              "title": "Номер АИС УМС",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата приёма данных из АИС УМС"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'oks_pro';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "oks_polyline_pro",
          "title": "Объекты капитального строительства",
          "readOnly": true,
          "styleName": "oks_polyline_pro",
          "tableName": "oks_polyline_pro",
          "properties": [
            {
              "name": "cadastralnum",
              "title": "Кадастровый номер",
              "asTitle": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "hidden": true,
              "asTitle": true,
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
              "name": "objecttype",
              "title": "Тип объекта недвижимости",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Объект незавершенного строительства",
                  "value": "Объект незавершенного строительства"
                },
                {
                  "title": "Сооружение",
                  "value": "Сооружение"
                },
                {
                  "title": "Здание",
                  "value": "Здание"
                }
              ]
            },
            {
              "name": "readablead",
              "title": "Адрес в соответствии с ФИАС",
              "asTitle": true,
              "required": true,
              "valueType": "TEXT"
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
              "name": "lenght",
              "title": "Протяженность вычисляемая, м. кв.",
              "valueType": "DOUBLE",
              "description": "Протяженность вычисляемая",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_length"
            },
            {
              "name": "lenght_doc",
              "title": "Протяженность по документу, м. кв.",
              "valueType": "DOUBLE",
              "description": "Протяженность указанная в КПТ",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area",
              "title": "Протяженность, м.",
              "hidden": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_doc_2",
              "title": "Протяженность вычисляемая, м. кв.",
              "hidden": true,
              "valueType": "DOUBLE",
              "description": "Протяженность вычисляемая",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_kpt",
              "title": "Протяженность по документу, м. кв.",
              "hidden": true,
              "valueType": "DOUBLE",
              "description": "Протяженность указанная в КПТ",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "aisums_property_type",
              "title": "Тип собственности АИС УМС",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "aisums_number",
              "title": "Номер АИС УМС",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата приёма данных из АИС УМС"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'oks_polyline_pro';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "borderwaterobj",
          "title": "Береговые линии (границы водных объектов)",
          "readOnly": true,
          "styleName": "borderwaterobj",
          "tableName": "borderwaterobj",
          "originName": "borderwaterobj",
          "properties": [
            {
              "name": "regnumborder",
              "title": "Реестровый номер границы",
              "asTitle": true,
              "required": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "btypecode",
              "title": "Вид объекта реестра границ (код)",
              "asTitle": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "btype",
              "title": "Вид объекта реестра границ",
              "asTitle": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "objectname",
              "title": "Наименование водного объекта",
              "asTitle": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "wocode",
              "title": "Вид объекта реестра границ (код)",
              "asTitle": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "wotype",
              "title": "Вид объекта реестра границ",
              "asTitle": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "rdate",
              "title": "Дата постановки на учет",
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
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
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата приёма данных из  АИС УМС"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            }
          ],
          "description": "Береговые линии (границы водных объектов)",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'borderwaterobj';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "kvartal_kpt",
          "title": "Кадастровые кварталы",
          "readOnly": true,
          "styleName": "kvartal_kpt",
          "tableName": "kvartal_kpt",
          "originName": "kvartal_kpt",
          "properties": [
            {
              "name": "cadastralnum",
              "title": "Кадастровый номер",
              "asTitle": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "hidden": true,
              "asTitle": true,
              "valueType": "STRING"
            },
            {
              "name": "aria_total",
              "title": "Площадь",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "reg_date",
              "title": "Дата регистрации КПТ",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
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
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата приёма данных из АИС УМС"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'kvartal_kpt';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "zouit_pro",
          "title": "Зоны с особыми условиями использования территорий",
          "readOnly": true,
          "styleName": "zouit_pro",
          "tableName": "zouit_pro",
          "originName": "zouit_pro",
          "properties": [
            {
              "name": "number",
              "title": "Номер",
              "valueType": "STRING"
            },
            {
              "name": "zonetype",
              "title": "Вид зоны",
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "name_by_doc",
              "title": "Название зоны",
              "valueType": "TEXT"
            },
            {
              "name": "regnumbord",
              "title": "Реестровый номер границы",
              "asTitle": true,
              "valueType": "STRING"
            },
            {
              "name": "registrati",
              "title": "Дата постановки на учет",
              "valueType": "STRING"
            },
            {
              "name": "boundary_1",
              "title": "Вид объекта реестра границ",
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "hidden": true,
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
              "valueType": "INT"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата приёма данных из  АИС УМС"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            }
          ],
          "description": "Зоны с особыми условиями использования территорий",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'zouit_pro';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "oks_constructions_points",
          "title": "Сооружения",
          "readOnly": true,
          "styleName": "oks_constructions_points",
          "tableName": "oks_constructions_points",
          "originName": "oks_constructions_points",
          "properties": [
            {
              "name": "cadastralnum",
              "title": "Кадастровый номер",
              "asTitle": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "hidden": true,
              "asTitle": true,
              "valueType": "STRING"
            },
            {
              "name": "num_oks",
              "title": "Номер ОКС",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "purpose",
              "title": "Назначение здания",
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "otypecode",
              "title": "Вид объекта недвижимости (код)",
              "hidden": true,
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
              "hidden": true,
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
              "name": "usage",
              "title": "Разрешенное использование",
              "valueType": "TEXT"
            },
            {
              "name": "raddress",
              "title": "Адрес в соответствии с ФИАС",
              "valueType": "TEXT"
            },
            {
              "name": "escription",
              "title": "Описание местоположения ОКС",
              "hidden": true,
              "valueType": "TEXT"
            },
            {
              "name": "cost",
              "title": "Кадастровая стоимость",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area_doc",
              "title": "Площадь по документу",
              "hidden": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 0
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "aisums_property_type",
              "title": "Тип собственности АИС УМС",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "aisums_number",
              "title": "Номер АИС УМС",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата приёма данных из АИС УМС"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            }
          ],
          "geometryType": "Point"
        }'
WHERE name = 'oks_constructions_points';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "КПТ"
          ],
          "name": "municipality_boundaries_egrn",
          "title": "Границы населенных пунктов",
          "readOnly": true,
          "styleName": "municipality_boundaries_egrn",
          "tableName": "municipality_boundaries_egrn",
          "properties": [
            {
              "name": "regnumborder",
              "title": "Реестровый номер границы",
              "asTitle": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "boundary_1",
              "title": "Вид объекта реестра границ",
              "asTitle": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "registrationdate",
              "title": "Дата постановки на учет",
              "asTitle": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "description": "Дата импорта XML в слой",
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
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
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "maxLength": 50,
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
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "acsept_at",
              "title": "Дата",
              "hidden": true,
              "valueType": "DATETIME",
              "description": "Дата приёма данных из АИС УМС"
            },
            {
              "name": "source_doc",
              "title": "Документ источник",
              "multiple": true,
              "libraries": [
                "dl_data_kpt"
              ],
              "valueType": "DOCUMENT",
              "description": "Отсылка к документу из которого получен объект",
              "maxDocuments": 5
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'municipality_boundaries_egrn';
