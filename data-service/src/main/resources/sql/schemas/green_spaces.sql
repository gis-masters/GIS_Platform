INSERT INTO data.schemas (name, class_rule)
SELECT 'footpath',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'footpath');

INSERT INTO data.schemas (name, class_rule)
SELECT 'greenery',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'greenery');

INSERT INTO data.schemas (name, class_rule)
SELECT 'park_building',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'park_building');

INSERT INTO data.schemas (name, class_rule)
SELECT 'park_structures',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'park_structures');

INSERT INTO data.schemas (name, class_rule)
SELECT 'trees',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'trees');

INSERT INTO data.schemas (name, class_rule)
SELECT 'zone_park',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'zone_park');

INSERT INTO data.schemas (name, class_rule)
SELECT 'border_park',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'border_park');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_data_universal_for_document',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_data_universal_for_document');



UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "footpath",
          "tags": [
            "system",
            "Зеленые насаждения"
          ],
          "name": "footpath",
          "title": "Транспортные и пешеходные пути",
          "tableName": "footpath",
          "originName": "footpath",
          "properties": [
            {
              "name": "name",
              "title": "Наименование объекта",
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "area",
              "title": "Площадь, кв.м",
              "valueType": "DOUBLE",
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
              "valueType": "INT"
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "readOnly": true,
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
            }
          ],
          "description": "Транспортные и пешеходные пути",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'footpath';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "greenery",
          "tags": [
            "system",
            "Зеленые насаждения"
          ],
          "name": "greenery",
          "title": "Участки растительности",
          "tableName": "greenery",
          "originName": "greenery",
          "properties": [
            {
              "name": "status",
              "title": "Статус",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Современная",
                  "value": "Современная"
                },
                {
                  "title": "Историческая",
                  "value": "Историческая"
                },
                {
                  "title": "Естественная",
                  "value": "Естественная"
                }
              ],
              "asTitle": true
            },
            {
              "name": "name",
              "title": "Наименование",
              "maxLength": 250,
              "valueType": "STRING"
            },
            {
              "name": "area",
              "title": "Площадь, кв.м",
              "valueType": "DOUBLE",
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
              "valueType": "INT"
            },
            {
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "readOnly": true,
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
            }
          ],
          "description": "Участки растительности",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'greenery';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "park_building",
          "tags": [
            "system",
            "Зеленые насаждения"
          ],
          "name": "park_building",
          "title": "Здания и сооружения",
          "tableName": "park_building",
          "originName": "park_building",
          "properties": [
            {
              "name": "name",
              "title": "Наименование",
              "maxLength": 150,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "area",
              "title": "Площадь, кв.м",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "shape",
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
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "readOnly": true,
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
            }
          ],
          "description": "Здания и сооружения",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'park_building';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "park_structures",
          "tags": [
            "system",
            "Зеленые насаждения"
          ],
          "name": "park_structures",
          "title": "Защитные сооружения",
          "tableName": "park_structures",
          "originName": "park_structures",
          "properties": [
            {
              "name": "name",
              "title": "Наименование объекта",
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "length",
              "title": "Протяженность, м",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
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
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "readOnly": true,
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
            }
          ],
          "description": "Защитные сооружения",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'park_structures';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "trees",
          "tags": [
            "system",
            "Зеленые насаждения"
          ],
          "name": "trees",
          "title": "Древесная растительность",
          "tableName": "trees",
          "originName": "trees",
          "properties": [
            {
              "name": "vid",
              "title": "Вид",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Хвойные",
                  "value": "Хвойные"
                },
                {
                  "title": "Лиственные",
                  "value": "Лиственные"
                }
              ]
            },
            {
              "name": "diametr",
              "title": "Диаметр ствола",
              "maxLength": 10,
              "valueType": "STRING"
            },
            {
              "name": "kol_vo",
              "title": "Количество",
              "valueType": "INT"
            },
            {
              "name": "stvolnost",
              "title": "Ствольность",
              "maxLength": 10,
              "valueType": "STRING"
            },
            {
              "name": "sost",
              "title": "Состояние",
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Пересаживаемые",
                  "value": "Пересаживаемые"
                },
                {
                  "title": "Сохраняемые",
                  "value": "Сохраняемые"
                },
                {
                  "title": "Удаляемые",
                  "value": "Удаляемые"
                }
              ]
            },
            {
              "name": "poroda",
              "title": "Порода",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "value",
              "title": "Значение",
              "valueType": "STRING"
            },
            {
              "name": "number",
              "title": "Номер",
              "valueType": "INT"
            },
            {
              "name": "documents",
              "title": "Документы",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "photo",
              "title": "Фотографии",
              "maxSize": 50000000,
              "maxFiles": 10,
              "multiple": true,
              "valueType": "FILE"
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
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
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "readOnly": true,
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
            }
          ],
          "description": "Древесная растительность",
          "geometryType": "Point"
        }'
WHERE name = 'trees';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "zone_park",
          "tags": [
            "system",
            "Зеленые насаждения"
          ],
          "name": "zone_park",
          "title": "Парковое зонирование",
          "tableName": "zone_park",
          "originName": "zone_park",
          "properties": [
            {
              "name": "zone_name",
              "title": "Наименование зоны",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "area",
              "title": "Площадь, кв.м",
              "hidden": true,
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "area_doc",
              "title": "Площадь фактическая, м. кв.",
              "valueType": "DOUBLE",
              "description": "Площадь посчитана автоматически",
              "readOnly": true,
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "photo",
              "title": "Фотофиксация (фотоматериалы)",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE"
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
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "readOnly": true,
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
            }
          ],
          "description": "Парковое зонирование",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'zone_park';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "trees",
          "tags": [
            "system",
            "Зеленые насаждения"
          ],
          "name": "border_park",
          "title": "Граница парковой зоны",
          "readOnly": false,
          "tableName": "border_park",
          "originName": "border_park",
          "properties": [
            {
              "name": "documents",
              "title": "Утверждающий документ",
              "valueType": "STRING"
            },
            {
              "name": "name",
              "title": "Наименование объкта",
              "asTitle": true,
              "valueType": "STRING"
            },
            {
              "name": "area",
              "title": "Площадь, кв.м",
              "hidden": true,
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "area_doc",
              "title": "Площадь фактическая, м. кв.",
              "valueType": "DOUBLE",
              "description": "Площадь посчитана автоматически",
              "readOnly": true,
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
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
              "name": "created_at",
              "title": "Дата",
              "hidden": true,
              "readOnly": true,
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
            }
          ],
          "description": "Граница парковой зоны",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'border_park';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "dl_data_universal_for_document",
          "title": "Документы зеленых насаждений",
          "tags": [
            "system",
            "Библиотека",
            "Зеленые насаждения"
          ],
          "tableName": "dl_data_universal_for_document",
          "properties": [
            {
              "name": "id",
              "title": "№",
              "description": "Уникальный номер документа",
              "minWidth": 150,
              "valueType": "INT"
            },
            {
              "name": "is_folder",
              "title": "Признак раздела",
              "description": "Папка или Документ",
              "valueType": "BOOLEAN"
            },
            {
              "name": "path",
              "title": "Путь",
              "maxLength": 522,
              "minWidth": 250,
              "valueType": "STRING",
              "description": "Полный путь, отражающий иерархию объектов"
            },
            {
              "name": "content_type_id",
              "title": "Идентификатор контент типа",
              "valueType": "CHOICE",
              "hidden": true,
              "minWidth": 150,
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
              "minWidth": 300,
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
              "name": "doc_num",
              "title": "Номер документа",
              "minWidth": 150,
              "valueType": "STRING",
              "required": true
            },
            {
              "name": "approve_date",
              "title": "Дата утверждения",
              "valueType": "DATETIME"
            },
            {
              "name": "files",
              "title": "Файлы",
              "valueType": "FILE",
              "multiple": true,
              "maxSize": 50000000
            },
            {
              "name": "relations",
              "title": "Связанные документы",
              "library": "dl_data_universal_for_document",
              "minWidth": 200,
              "multiple": true,
              "valueType": "DOCUMENT",
              "maxDocuments": 10
            },
            {
              "name": "guiddocpreviousversion",
              "title": "Версии",
              "valueType": "DOCUMENT",
              "multiple": true,
              "description": "Предыдущие версии документа",
              "libraries": [
                "dl_data_universal_for_document"
              ],
              "maxDocuments": 10
            },
            {
              "name": "note",
              "title": "Примечания",
              "minWidth": 250,
              "maxLength": 522,
              "valueType": "STRING",
              "display": "multiline"
            },
            {
              "name": "created_at",
              "title": "Дата документа",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME"
            }
          ],
          "description": "Документы зеленых насаждений",
          "originName": "dl_data_universal_for_document",
          "styleName": "dl_data_universal_for_document",
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
                  "name": "files"
                },
                {
                  "name": "note"
                },
                {
                  "name": "relations"
                }
              ]
            },
            {
              "id": "folder",
              "type": "FOLDER",
              "title": "Папка",
              "attributes": [
                {
                  "name": "title",
                  "title": "Наименование раздела"
                },
                {
                  "name": "note"
                },
                {
                  "name": "relations"
                }
              ]
            }
          ]
        }'
WHERE name = 'dl_data_universal_for_document';