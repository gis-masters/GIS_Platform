INSERT INTO data.schemas (name, class_rule)
SELECT 'footpath',
    '{}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'footpath');

INSERT INTO data.schemas (name, class_rule)
SELECT 'greenery',
    '{}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'greenery');

INSERT INTO data.schemas (name, class_rule)
SELECT 'park_building',
    '{}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'park_building');

INSERT INTO data.schemas (name, class_rule)
SELECT 'park_structures',
    '{}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'park_structures');

INSERT INTO data.schemas (name, class_rule)
SELECT 'trees',
    '{}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'trees');

INSERT INTO data.schemas (name, class_rule)
SELECT 'zone_park',
    '{}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'zone_park');



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
            "library": "dl_default",
            "multiple": true,
            "valueType": "DOCUMENT"
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
            "hidden": true,
            "valueType": "GEOMETRY",
            "allowedValues": [
                "Point"
            ]
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
        }
    ],
    "description": "Парковое зонирование",
    "geometryType": "MultiPolygon"
}'
WHERE name = 'zone_park';