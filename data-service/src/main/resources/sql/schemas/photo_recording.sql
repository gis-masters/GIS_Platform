INSERT INTO data.schemas (name, class_rule)
SELECT 'photo_uploader',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'photo_uploader');

UPDATE data.schemas
SET class_rule =
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
              "name": "sender",
              "title": "Отправитель",
              "readOnly": true,
              "required": true,
              "valueType": "USER_ID"
            },
            {
              "name": "photography_time",
              "title": "Дата и время съёмки",
              "readOnly": true,
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "creation_time",
              "title": "Дата и время создания",
              "readOnly": true,
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "label",
              "title": "Метки",
              "valueType": "STRING"
            },
            {
              "name": "user_fill_color",
              "title": "цвет заливки по отправителю",
              "hidden": true,
              "calculatedValueFormula": "return (Number(''0x''+(Number(obj.sender)*71).toString(16) + (Number(obj.sender)*91).toString(12) + (Number(obj.sender)*51).toString(15) + (Number(obj.sender)*31).toString(14) + (Number(obj.sender)*11).toString(13))*95573/16).toString(16).slice(1, 7)",
              "valueType": "STRING"
            },
            {
              "name": "user_stroke_color",
              "title": "цвет обводки по отправителю",
              "hidden": true,
              "calculatedValueFormula": "return (Number(''0x''+(Number(obj.sender)*71).toString(16) + (Number(obj.sender)*91).toString(12) + (Number(obj.sender)*51).toString(15) + (Number(obj.sender)*31).toString(14) + (Number(obj.sender)*11).toString(13))*73719/16).toString(16).slice(8, 14)",
              "valueType": "STRING"
            },
            {
              "name": "label_fill_color",
              "title": "цвет заливки по отправителю",
              "hidden": true,
              "valueType": "STRING",
              "calculatedValueWellKnownFormula": "label_fill_color"
            },
            {
              "name": "label_stroke_color",
              "title": "цвет обводки по отправителю",
              "hidden": true,
              "valueType": "STRING",
              "calculatedValueWellKnownFormula": "label_stroke_color"
            },
            {
              "name": "photo_date_fill_color",
              "title": "цвет заливки по отправителю",
              "hidden": true,
              "valueType": "STRING",
              "calculatedValueWellKnownFormula": "date_fill_color"
            },
            {
              "name": "photo_date_stroke_color",
              "title": "цвет обводки по отправителю",
              "hidden": true,
              "valueType": "STRING",
              "calculatedValueWellKnownFormula": "date_stroke_color"
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
              "title": "Дата последнего изменения",
              "hidden": true,
              "valueType": "DATETIME"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "valueType": "STRING"
            },
            {
              "name": "updated_by",
              "title": "Кем изменено",
              "hidden": true,
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
          "geometryType": "Point",
          "views": [
            {
              "id": "photo_uploader_label",
              "title": "Объект меняет цвет от значения поля \"Метки\"",
              "styleName": "photo_uploader_label",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "photo_uploader_photo_date",
              "title": "Объект меняет цвет от даты съёмки фото",
              "styleName": "photo_uploader_photo_date",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "photo_uploader_live",
              "title": "Цвет объекта изменяется от возраста фото",
              "styleName": "photo_uploader_live",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "photo_uploader_live_gradient",
              "title": "Цвет объекта плавно изменяется от возраста фото",
              "styleName": "photo_uploader_live_gradient",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "photo_uploader_live_red",
              "title": "Цвет объекта изменяется к красному от возраста фото",
              "styleName": "photo_uploader_live_red",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "photo_uploader_live_gradient_red",
              "title": "Цвет объекта плавно изменяется к красному от возраста фото",
              "styleName": "photo_uploader_live_gradient_red",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "photo_uploader_id",
              "title": "Объект с номером",
              "styleName": "photo_uploader_id",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "photo_uploader_down_id",
              "title": "Объект с цветом по отправителю и номером",
              "styleName": "photo_uploader_down_id",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            },
            {
              "id": "photo_uploader_mono",
              "title": "Одинаковые цвета",
              "styleName": "photo_uploader_mono",
              "attributes": [
                {
                  "name": "name"
                },
                {
                  "name": "sender"
                },
                {
                  "name": "photography_time"
                },
                {
                  "name": "creation_time"
                },
                {
                  "name": "label"
                },
                {
                  "name": "rotation"
                },
                {
                  "name": "photo"
                }
              ]
            }
          ]
        }'
WHERE name = 'photo_uploader';
