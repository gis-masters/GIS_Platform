INSERT INTO data.schemas (name, class_rule)
SELECT 'vegetation_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'vegetation_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'vegetation_line_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'vegetation_line_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'vegetation_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'vegetation_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'swamps_soils_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'swamps_soils_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'terrain_microforms_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'terrain_microforms_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'terrain_microforms_line_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'terrain_microforms_line_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'terrain_microforms_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'terrain_microforms_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'supports_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'supports_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'supports_line_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'supports_line_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'supports_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'supports_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'roads_facilities_line_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'roads_facilities_line_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'roads_facilities_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'roads_facilities_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'social_culture_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'social_culture_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'social_culture_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'social_culture_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'road_covers_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'road_covers_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'markers_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'markers_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'labels_line_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'labels_line_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'landmarks_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'landmarks_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'horizontals_line_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'horizontals_line_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'hydrography_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'hydrography_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'hydrography_line_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'hydrography_line_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'hydrography_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'hydrography_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'geodetic_network_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'geodetic_network_point_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'fences_line_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'fences_line_topo_2000');

INSERT INTO data.schemas (name, class_rule)
SELECT 'elevation_marks_point_topo_2000',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'elevation_marks_point_topo_2000');

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "vegetation",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "vegetation_topo_2000",
          "title": "Растительность площадные",
          "tableName": "vegetation_topo_2000",
          "originName": "vegetation_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape_area",
              "title": "Площадь",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Line"
              ]
            }
          ],
          "description": "Класс объектов «Растительность площадные»",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'vegetation_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "vegetation_line",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "vegetation_line_topo_2000",
          "title": "Растительность линейная",
          "tableName": "vegetation_line_topo_2000",
          "originName": "vegetation_line_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
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
          "description": "Класс объектов «Растительность линейная»",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'vegetation_line_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "vegetation_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "vegetation_point_topo_2000",
          "title": "Растительность точечная",
          "tableName": "vegetation_point_topo_2000",
          "originName": "vegetation_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Класс объектов «Растительность точечная»",
          "geometryType": "Point"
        }'
WHERE name = 'vegetation_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "swamps_soils_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "swamps_soils_point_topo_2000",
          "title": "Болота и грунты точечные",
          "tableName": "swamps_soils_point_topo_2000",
          "originName": "swamps_soils_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Класс объектов «Болота и грунты точечные»",
          "geometryType": "Point"
        }'
WHERE name = 'swamps_soils_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "terrain_microforms",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "terrain_microforms_topo_2000",
          "title": "Микроформы рельефа площадные",
          "tableName": "terrain_microforms_topo_2000",
          "originName": "terrain_microforms_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape_area",
              "title": "Площадь",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Line"
              ]
            }
          ],
          "description": "Класс объектов «Микроформы рельефа площадные»",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'terrain_microforms_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "terrain_microforms_line",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "terrain_microforms_line_topo_2000",
          "title": "Микроформы рельефа линейные",
          "tableName": "terrain_microforms_line_topo_2000",
          "originName": "terrain_microforms_line_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "relat_h",
              "title": "Относительная высота",
              "valueType": "DOUBLE",
              "totalDigits": 12,
              "fractionDigits": 11
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
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
          "description": "Класс объектов «Микроформы рельефа линейные»",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'terrain_microforms_line_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "terrain_microforms_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "terrain_microforms_point_topo_2000",
          "title": "Микроформы рельефа точечные",
          "tableName": "terrain_microforms_point_topo_2000",
          "originName": "terrain_microforms_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "depth",
              "title": "Глубина",
              "valueType": "DOUBLE",
              "totalDigits": 12,
              "fractionDigits": 11
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Класс объектов «Микроформы рельефа точечные»",
          "geometryType": "Point"
        }'
WHERE name = 'terrain_microforms_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "supports",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "supports_topo_2000",
          "title": "Опоры площадные",
          "tableName": "supports_topo_2000",
          "originName": "supports_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape_area",
              "title": "Площадь",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Line"
              ]
            }
          ],
          "description": "Класс объектов «Опоры площадные»",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'supports_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "supports_line",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "supports_line_topo_2000",
          "title": "Опоры линейные",
          "tableName": "supports_line_topo_2000",
          "originName": "supports_line_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
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
          "description": "Класс объектов «Опоры линейные»",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'supports_line_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "supports_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "supports_point_topo_2000",
          "title": "Опоры точечные",
          "tableName": "supports_point_topo_2000",
          "originName": "supports_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Класс объектов «Опоры точечные»",
          "geometryType": "Point"
        }'
WHERE name = 'supports_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "roads_facilities_line",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "roads_facilities_line_topo_2000",
          "title": "Дороги и придорожные сооружения линейные",
          "tableName": "roads_facilities_line_topo_2000",
          "originName": "roads_facilities_line_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
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
          "description": "Класс объектов «Дороги и придорожные сооружения линейные»",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'roads_facilities_line_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "roads_facilities_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "roads_facilities_point_topo_2000",
          "title": "Придорожные сооружения точечные",
          "tableName": "roads_facilities_point_topo_2000",
          "originName": "roads_facilities_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Класс объектов «Придорожные сооружения точечные»",
          "geometryType": "Point"
        }'
WHERE name = 'roads_facilities_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "social_culture",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "social_culture_topo_2000",
          "title": "Соцкульт и сельхоз площадные",
          "tableName": "social_culture_topo_2000",
          "originName": "social_culture_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape_area",
              "title": "Площадь",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Line"
              ]
            }
          ],
          "description": "Класс объектов «Соцкульт и сельхоз площадные»",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'social_culture_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "social_culture_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "social_culture_point_topo_2000",
          "title": "Соцкульт и сельхоз точечные",
          "tableName": "social_culture_point_topo_2000",
          "originName": "social_culture_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Line"
              ]
            }
          ],
          "description": "Класс объектов «Соцкульт и сельхоз точечные»",
          "geometryType": "Point"
        }'
WHERE name = 'social_culture_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "road_covers",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "road_covers_topo_2000",
          "title": "Покрытие дорог",
          "tableName": "road_covers_topo_2000",
          "originName": "road_covers_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "name_str",
              "title": "Название улицы",
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "type_str",
              "title": "Тип улицы",
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "func",
              "title": "FUNC",
              "hidden": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape_area",
              "title": "Площадь",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Line"
              ]
            }
          ],
          "description": "Класс объектов «Покрытие дорог»",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'road_covers_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "markers_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "markers_point_topo_2000",
          "title": "Маркеры",
          "tableName": "markers_point_topo_2000",
          "originName": "markers_point_topo_2000",
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
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "floor",
              "title": "Этаж",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "naznachen",
              "title": "Назначен",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "adres_type",
              "title": "Тип",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "adres_ylic",
              "title": "Улица",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "adres_dom",
              "title": "Дом",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "objectcode",
              "title": "ObjectCode",
              "required": true,
              "maxLength": 8,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "description": "Класс объектов «Маркеры»",
          "geometryType": "Point"
        }'
WHERE name = 'markers_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "labels_line",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "labels_line_topo_2000",
          "title": "Подписи",
          "tableName": "labels_line_topo_2000",
          "originName": "labels_line_topo_2000",
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
              "name": "textstring",
              "title": "TextString",
              "hidden": true,
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "fontname",
              "title": "FontName",
              "hidden": true,
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "fontsize",
              "title": "FontSize",
              "hidden": true,
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "angle",
              "title": "Angle",
              "hidden": true,
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape_area",
              "title": "Площадь",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
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
          "description": "Класс объектов «Подписи»",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'labels_line_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "landmarks_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "landmarks_point_topo_2000",
          "title": "Знаки межевые",
          "tableName": "landmarks_point_topo_2000",
          "originName": "landmarks_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Класс объектов «Знаки межевые»",
          "geometryType": "Point"
        }'
WHERE name = 'landmarks_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "horizontals_line",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "horizontals_line_topo_2000",
          "title": "Горизонтали",
          "tableName": "horizontals_line_topo_2000",
          "originName": "horizontals_line_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "z",
              "title": "Относительная высота",
              "valueType": "DOUBLE",
              "totalDigits": 12,
              "fractionDigits": 11
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
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
          "description": "Класс объектов «Горизонтали»",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'horizontals_line_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "hydrography",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "hydrography_topo_2000",
          "title": "Элементы гидрографии площадные",
          "tableName": "hydrography_topo_2000",
          "originName": "hydrography_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "name",
              "title": "NAME",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "type",
              "title": "ТИП",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "name_own",
              "title": "NAME_OWN",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "type_q",
              "title": "TYPE_Q",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "period",
              "title": "ПЕРИОД",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "z",
              "title": "Z",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "depth",
              "title": "ГЛУБИНА",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "state",
              "title": "Состояние",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "mater_cons",
              "title": "MATER_CONS",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
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
              "valueType": "INT"
            }
          ],
          "description": "Класс объектов «Элементы гидрографии площадные»",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'hydrography_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "hydrography_line",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "hydrography_line_topo_2000",
          "title": "Гидрография линейная",
          "tableName": "hydrography_line_topo_2000",
          "originName": "hydrography_line_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "type",
              "title": "ТИП",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "name",
              "title": "NAME",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "relobjecti",
              "title": "relObjectI",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "relat_h",
              "title": "RELAT_H",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "depth",
              "title": "ГЛУБИНА",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "name_own",
              "title": "NAME_OWN",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "mater_cons",
              "title": "MATER_CONS",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "flow_rate",
              "title": "Скорость потока",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code_2",
              "title": "КОД_2",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "width",
              "title": "Ширина",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
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
              "valueType": "INT"
            }
          ],
          "description": "Класс объектов «Гидрография линейная»",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'hydrography_line_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "hydrography_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "hydrography_point_topo_2000",
          "title": "Элементы гидрографии точечные",
          "tableName": "hydrography_point_topo_2000",
          "originName": "hydrography_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Класс объектов «Элементы гидрографии точечные»",
          "geometryType": "Point"
        }'
WHERE name = 'hydrography_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "geodetic_network_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "geodetic_network_point_topo_2000",
          "title": "Геодезические пункты",
          "tableName": "geodetic_network_point_topo_2000",
          "originName": "geodetic_network_point_topo_2000",
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
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "code",
              "title": "КОД",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "x",
              "title": "X",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "y",
              "title": "Y",
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Line"
              ]
            }
          ],
          "description": "Класс объектов «Геодезические пункты»",
          "geometryType": "Point"
        }'
WHERE name = 'geodetic_network_point_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "fences_line",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "fences_line_topo_2000",
          "title": "Ограждения",
          "tableName": "fences_line_topo_2000",
          "originName": "fences_line_topo_2000",
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
              "name": "code",
              "title": "Код",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "shape_leng",
              "title": "Периметр",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
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
          "description": "Класс объектов «Ограждения»",
          "geometryType": "MultiLineString"
        }'
WHERE name = 'fences_line_topo_2000';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "elevation_marks_point",
          "tags": [
            "system",
            "Топоплан 2000"
          ],
          "name": "elevation_marks_point_topo_2000",
          "title": "Отметки высот",
          "tableName": "elevation_marks_point_topo_2000",
          "originName": "elevation_marks_point_topo_2000",
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
              "name": "code",
              "title": "Код",
              "required": true,
              "maxLength": 9,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "desc1",
              "title": "Описание",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "z",
              "title": "Относительная высота",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 18,
              "fractionDigits": 11
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Класс объектов «Отметки высот»",
          "geometryType": "Point"
        }'
WHERE name = 'elevation_marks_point_topo_2000';
