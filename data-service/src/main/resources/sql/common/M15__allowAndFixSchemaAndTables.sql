--У каждого слоя есть схема
SELECT 1 / (
    (SELECT NOT EXISTS(SELECT 1
                       FROM data.schemas_and_tables
                       WHERE is_folder = FALSE
                         AND "schema" IS NULL)):: int );

-- У всех схем должна быть проперти objectid
SELECT 1 / (
    (SELECT NOT EXISTS (SELECT 1
                        FROM data.schemas_and_tables
                        WHERE NOT jsonb_path_exists(
                            schema, '$.properties[*] ? (@.name == "objectid")'
                                  ))):: int );

-- Все objectid в схемах должны быть либо LONG, либо INT
SELECT 1 / (
    (SELECT NOT EXISTS (SELECT 1
                        FROM data.schemas_and_tables
                        WHERE jsonb_path_exists(
                                  schema, '$.properties[*] ? (
                                    @.name == "objectid"
                                    && (@.valueType != "LONG" && @.valueType != "INT")
                                  )'
                              ))):: int );

-- Во всех таблицах базы столбец objectid должен быть либо bigint, либо integer
WITH tables AS (SELECT id,
                       identifier AS table_name,
                       split_part(path, '/', 3):: INT AS schema_id,
    schema :: jsonb AS schema_json
FROM
    data.schemas_and_tables
WHERE
    is_folder = FALSE
    )
    , schemas AS (
SELECT
    id AS schema_id, identifier AS schema_name
FROM
    data.schemas_and_tables
WHERE
    is_folder = TRUE
    )
SELECT 1 / (
    (SELECT NOT EXISTS (SELECT 1
                        FROM tables t
                                 JOIN schemas s USING (schema_id)
                                 JOIN information_schema.columns c ON c.table_schema = s.schema_name
                            AND c.table_name = t.table_name
                            AND c.column_name = 'objectid'
                        WHERE c.data_type NOT IN ('bigint', 'integer'))):: int );


--Если в каждой схеме есть objectid и в каждой схеме он числовой
--И если каждый реальный objectid либо integer либо bigint
--всё что ниже способно из schema_and_tables привести схемы в соответствие с реальным
--типом поля objectid у таблиц
-- при этом если будет падение, то мы отменим всю транзакцию
BEGIN;
WITH -- Для каждой таблицы вычисляем нужное новое valueType и текущее из JSON
     m AS (SELECT dst.id                                                                   AS table_id,
                  -- действительно нужное новое значение
                  CASE c.data_type WHEN 'integer' THEN 'INT' WHEN 'bigint' THEN 'LONG' END AS new_val,
                  -- текущее значение из JSON
                  (SELECT prop ->> 'valueType'
FROM
    jsonb_array_elements(
    dst.schema :: jsonb -> 'properties'
    ) AS prop
WHERE
    prop ->> 'name' = 'objectid'
    ) AS curr_val
    , dst.schema :: jsonb AS schema_json
FROM
    data.schemas_and_tables dst
    JOIN data.schemas_and_tables sch
ON sch.id = split_part(dst.path, '/', 3):: INT
    AND sch.is_folder = TRUE
    JOIN information_schema.columns c ON c.table_schema = sch.identifier
    AND c.table_name = dst.identifier
    AND c.column_name = 'objectid'
WHERE
    dst.is_folder = FALSE -- сразу отбираем только несовпадающие
  AND (
    CASE c.data_type WHEN 'integer' THEN 'INT' WHEN 'bigint' THEN 'LONG' END
    ) IS DISTINCT
FROM
    (
    SELECT
    prop ->> 'valueType'
    FROM
    jsonb_array_elements(
    dst.schema :: jsonb -> 'properties'
    ) AS prop
    WHERE
    prop ->> 'name' = 'objectid'
    )
    ),
-- Собираем для них новый JSON-массив properties
    p AS (
SELECT
    m.table_id, jsonb_set(
    m.schema_json, '{properties}', jsonb_agg(
    CASE WHEN prop ->> 'name' = 'objectid' THEN jsonb_set(
    prop, '{valueType}', to_jsonb(m.new_val)
    ) ELSE prop END
    )
    ) AS new_schema
FROM
    m
    JOIN data.schemas_and_tables dst
ON dst.id = m.table_id CROSS
    JOIN LATERAL jsonb_array_elements(
    dst.schema :: jsonb -> 'properties'
    ) AS prop
GROUP BY
    m.table_id,
    m.schema_json
    ) -- Обновляем только отфильтрованные записи
UPDATE
    data.schemas_and_tables dst
SET schema = p.new_schema FROM
  p
WHERE
    dst.id = p.table_id;
COMMIT;
