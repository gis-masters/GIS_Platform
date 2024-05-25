CREATE SCHEMA IF NOT EXISTS dataset_specialization_1;

INSERT INTO data.schemas_and_tables(title, is_folder, identifier, path, items_count, created_at, last_modified)
SELECT 'Тестовый набор данных 1 специализации',
        true,
        'dataset_specialization_1',
        '/root',
        1,
        now(),
        now()
WHERE NOT EXISTS(SELECT id FROM data.schemas_and_tables WHERE identifier = 'dataset_specialization_1');

CREATE TABLE IF NOT EXISTS dataset_specialization_1.trading_zone_2022_spec_1
(
    objectid      bigserial NOT NULL,
    objectname    character varying(255),
    trade_num     character varying(255),
    descript      character varying(255),
    area          numeric(38, 8),
    shape         public.geometry,
    ruleid        character varying(255),
    created_by    character varying(255),
    created_at    timestamp without time zone,
    updated_by    character varying(255),
    last_modified timestamp without time zone,
    CONSTRAINT trading_zone_2022_spec_1_pkey PRIMARY KEY (objectid),
    CONSTRAINT enforce_srid_shape CHECK (st_srid(shape) = 3857)
) TABLESPACE pg_default;
ALTER TABLE IF EXISTS dataset_specialization_1.trading_zone_2022_spec_1
    OWNER to fiz;

CREATE INDEX IF NOT EXISTS trading_zone_2022_spec_1_idx
    ON dataset_specialization_1.trading_zone_2022_spec_1 USING gist (shape);

CREATE TABLE IF NOT EXISTS dataset_specialization_1.trading_zone_2022_spec_1_extension
(
    object_id  bigserial NOT NULL,
    violations jsonb,
    _xmin      integer,
    valid      boolean,
    class_id   integer,
    CONSTRAINT trading_zone_2022_spec_1_extension_pkey PRIMARY KEY (object_id)
) TABLESPACE pg_default;
ALTER TABLE IF EXISTS dataset_specialization_1.trading_zone_2022_spec_1_extension
    OWNER to fiz;


INSERT INTO data.schemas_and_tables(title, is_folder, identifier, path, crs, created_at, last_modified, schema)
SELECT 'Test table',
       false,
       'trading_zone_2022_spec_1',
       '/root/1',
       'EPSG:3857',
       now(),
       now(),
       '{
         "name": "trading_zone_2022_spec_1_schema",
         "tags": [
           "system",
           "НТО"
         ],
         "title": "Зоны ответственности",
         "readOnly": false,
         "styleName": "trading_zone_2022_spec_1",
         "tableName": "trading_zone_2022_spec_1",
         "properties": [
           {
             "name": "objectname",
             "title": "Наименование",
             "asTitle": true,
             "valueType": "STRING"
           },
           {
             "name": "trade_num",
             "title": "Номер объекта на схеме относительно которого установлена зона",
             "maxLength": 10,
             "valueType": "STRING"
           },
           {
             "name": "descript",
             "title": "Описание зоны",
             "valueType": "STRING"
           },
           {
             "name": "area",
             "title": "Площадь, кв. м.",
             "valueType": "DOUBLE",
             "fractionDigits": 2
           },
           {
             "name": "shape",
             "title": "shape",
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
             "valueType": "STRING"
           },
           {
             "name": "created_by",
             "title": "Кем создано",
             "valueType": "STRING"
           },
           {
             "name": "created_at",
             "title": "Дата создания",
             "valueType": "DATETIME"
           },
           {
             "name": "updated_by",
             "title": "Кто обновил",
             "valueType": "STRING"
           },
           {
             "name": "last_modified",
             "title": "Дата последнего изменения",
             "valueType": "DATETIME"
           }
         ],
         "description": "Зоны ответственности",
         "geometryType": "MultiPolygon"
       }'
WHERE NOT EXISTS(SELECT id FROM data.schemas_and_tables WHERE identifier = 'trading_zone_2022_spec_1');
