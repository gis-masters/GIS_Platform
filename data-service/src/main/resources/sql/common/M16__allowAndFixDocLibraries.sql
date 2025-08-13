--У каждой библиотеки есть схема
SELECT 1 / (
    (SELECT NOT EXISTS(SELECT 1
                       FROM data.doc_libraries
                       WHERE "schema" IS NULL)):: int );

-- У всех схем должна быть проперти id
SELECT 1 / (
    (SELECT NOT EXISTS (SELECT 1
                        FROM data.doc_libraries
                        WHERE NOT jsonb_path_exists(
                            schema, '$.properties[*] ? (@.name == "id")'
                                  ))):: int );

-- Все id в схемах должны быть либо LONG, либо INT
SELECT 1 / (
    (SELECT NOT EXISTS (SELECT 1
                        FROM data.doc_libraries
                        WHERE jsonb_path_exists(
                                  schema, '$.properties[*] ? (
                                    @.name == "id"
                                    && (@.valueType != "LONG" && @.valueType != "INT")
                                  )'
                              ))):: int );

-- Во всех таблицах базы столбец id должен быть либо bigint, либо integer
SELECT 1 / (
    (SELECT NOT EXISTS (SELECT 1
                        FROM data.doc_libraries AS lib
                                 JOIN information_schema.columns AS col
                                      ON col.table_schema = 'data'
                                          AND col.table_name = lib.table_name
                                          AND col.column_name = 'id'
                        WHERE col.data_type NOT IN ('integer', 'bigint')))::int ) AS check_objectid_types;



--Если в каждой схеме есть id и в каждой схеме он числовой
--И если каждый реальный id либо integer либо bigint
--всё что ниже способно из schema_and_tables привести схемы в соответствие с реальным
--типом поля id у таблиц
-- при этом если будет падение, то мы отменим всю транзакцию
BEGIN;
-- 1) Для всех, у кого в базе data.id — integer, ставим в JSON `"INT"`
UPDATE data.doc_libraries dl
SET schema = jsonb_set(
        dl.schema::jsonb,
        '{properties}',
        (SELECT jsonb_agg(
                        CASE
                            WHEN elem ->>'name' = 'id'
                                THEN jsonb_set(elem, '{valueType}', '"INT"')
                            ELSE elem
                            END
                )
         FROM jsonb_array_elements(dl.schema::jsonb->'properties') AS arr(elem))
             )::jsonb
FROM information_schema.columns c
WHERE c.table_schema = 'data'
  AND c.table_name = dl.table_name
  AND c.column_name = 'id'
  AND c.data_type = 'integer';

-- 2) Для всех, у кого в базе data.id — bigint, ставим в JSON `"LONG"`
UPDATE data.doc_libraries dl
SET schema = jsonb_set(
        dl.schema::jsonb,
        '{properties}',
        (SELECT jsonb_agg(
                        CASE
                            WHEN elem ->>'name' = 'id'
                                THEN jsonb_set(elem, '{valueType}', '"LONG"')
                            ELSE elem
                            END
                )
         FROM jsonb_array_elements(dl.schema::jsonb->'properties') AS arr(elem))
             )::jsonb
FROM information_schema.columns c
WHERE c.table_schema = 'data'
  AND c.table_name = dl.table_name
  AND c.column_name = 'id'
  AND c.data_type = 'bigint';

COMMIT;
