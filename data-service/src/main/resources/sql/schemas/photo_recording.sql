INSERT INTO data.schemas (name, class_rule)
SELECT 'photo_uploader',
    '{
        "tags": [
            "system",
            "Фотофиксация"
        ],
        "name": "photo_uploader",
        "title": "Объекты фотофиксация",
        "styleName": "photo_uploader",
        "tableName": "photo_uploader",
        "originName": "photo_uploader",
        "properties": [
            {
                "name": "name",
                "title": "Наименование объекта",
                "required": true,
                "valueType": "STRING"
            },
            {
                "name": "type",
                "title": "Тип",
                "valueType": "STRING"
            },
            {
                "name": "sender",
                "title": "Отправитель",
                "readOnly": true,
                "required": true,
                "valueType": "STRING"
            },
            {
                "name": "photographytime",
                "title": "Дата и время съёмки",
                "readOnly": true,
                "required": true,
                "valueType": "DATETIME"
            },
            {
                "name": "creationtime",
                "title": "Дата и время создания",
                "readOnly": true,
                "required": true,
                "valueType": "DATETIME"
            },
            {
                "name": "tags",
                "title": "Теги",
                "valueType": "STRING"
            },
            {
                "name": "color",
                "title": "цвет",
                "hidden": true,
                "valueType": "STRING"
            },
            {
                "name": "color2",
                "title": "цвет2",
                "hidden": true,
                "valueType": "STRING"
            },
            {
                "name": "rotation",
                "title": "Вращение",
                "valueType": "STRING"
            },
            {
                "name": "photo",
                "title": "Фотофиксация",
                "maxSize": 50000000,
                "multiple": true,
                "required": true,
                "valueType": "FILE",
                "maxDocuments": 20
            },
            {
                "name": "last_modified",
                "title": "Последние изменение",
                "hidden": true,
                "required": true,
                "valueType": "DATETIME"
            },
            {
                "name": "created_at",
                "title": "Время создания",
                "hidden": true,
                "required": true,
                "valueType": "STRING"
            },
            {
                "name": "created_by",
                "title": "Кем создан",
                "readOnly": true,
                "required": true,
                "valueType": "STRING"
            },
            {
                "name": "updated_by",
                "title": "Кем изменено",
                "hidden": true,
                "required": true,
                "valueType": "DATETIME"
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
                "title": "Цифры",
                "hidden": true,
                "valueType": "STRING"
            }
        ],
        "description": "Объекты для привязки фото к слою",
        "geometryType": "Point"
    }'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'photo_uploader');
