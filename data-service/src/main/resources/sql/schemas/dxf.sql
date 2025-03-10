INSERT INTO data.schemas (name, class_rule)
SELECT 'dxf_schema_v1',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dxf_schema_v1');

UPDATE data.schemas 
SET class_rule =
        '{
          "name": "dxf_schema_v1",
          "title": "Схема DFX файла",
          "tags": [
            "DFX"
          ],
          "styleName": "dxf_style",
          "readOnly": true,
          "tableName": "dxf_schema_v1",
          "originName": "DxfSchema",
          "properties": [
            {
              "name": "Layer",
              "title": "Имя слоя",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "PaperSpace",
              "title": "Наименование макета/листа",
              "valueType": "INT",
              "hidden": true,
              "description": "1 if the entity is located on a layout (paper space), NULL otherwise",
              "maxInclusive": 1,
              "minInclusive": 0
            },
            {
              "name": "SubClasses",
              "title": "List of classes",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "Linetype",
              "title": "Тип линии",
              "valueType": "STRING"
            },
            {
              "name": "EntityHandle",
              "title": "The hexadecimal entity handle",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "Text",
              "title": "Текстовое описание объекта",
              "valueType": "STRING"
            },
            {
              "name": "the_geom",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "description": "Схема, описывающая DXF файлы",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'dxf_schema_v1';
