INSERT INTO data.schemas (name, class_rule)
SELECT 'dxf_schema_v1',
       '{
          "name": "dxf_schema_v1",
          "title": "Схема DFX файла",
          "readOnly": true,
          "tableName": "dxf_schema_v1",
          "originName": "DxfSchema",
          "properties": [
            {
              "name": "Layer",
              "title": "Имя слоя",
              "description": "Name of the DXF layer. The default layer is “0”",
              "valueType": "STRING",
              "whiteSpace": "preserve",
              "sequenceNumber": 10
            },
            {
              "name": "PaperSpace",
              "title": "A layout",
              "description": "1 if the entity is located on a layout (paper space), NULL otherwise",
              "valueType": "INT",
              "maxInclusive": 1,
              "minInclusive": 0,
              "sequenceNumber": 20
            },
            {
              "name": "SubClasses",
              "title": "List of classes",
              "description": "Where available, a list of classes to which an entity belongs",
              "valueType": "STRING",
              "whiteSpace": "preserve",
              "sequenceNumber": 30
            },
            {
              "name": "Linetype",
              "title": "Тип линии",
              "description": "Where available, the line type used for this entity",
              "valueType": "STRING",
              "whiteSpace": "preserve",
              "sequenceNumber": 40
            },
            {
              "name": "EntityHandle",
              "title": "The hexadecimal entity handle",
              "description": "The hexadecimal entity handle. A sort of feature id",
              "valueType": "STRING",
              "whiteSpace": "preserve",
              "sequenceNumber": 50
            },
            {
              "name": "Text",
              "title": "Текстовое описание объекта",
              "description": "The text of labels",
              "valueType": "STRING",
              "whiteSpace": "preserve",
              "sequenceNumber": 60
            },
            {
              "name": "the_geom",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ],
              "sequenceNumber": 70
            }
          ],
          "description": "Схема, описывающая DXF файлы",
          "geometryType": "MultiPolygon"
        }'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dxf_schema_v1');
