DELETE FROM data.schemas
    WHERE name = 'dxf_schema_v1'
      AND EXISTS (
        SELECT 1
        FROM data.schemas
        WHERE name = 'dxf_schema_v1'
    );

-- Скрипт, во всех схемах, приведет к нижнему регистру все значения ключа 'name', в массиве 'properties'

-- {
--   "name": "oilpipeline_line",
--   "title": "Магистральные трубопроводы жидких углеводородов",
--   "properties": [
--     {
--       "name": "GLOBAL_ID",
--       "title": "Идентификатор объекта"
--     }
--   ]
-- }

-- "name": "GLOBAL_ID"   --->   "name": "global_id",
WITH updated_properties AS (
    SELECT
        id,
        jsonb_agg(
            jsonb_set(
                prop.value::jsonb,
                '{name}',
                ('"' || LOWER(prop.value::jsonb->>'name') || '"')::jsonb
            )
        ) AS updated_props
    FROM
        data.schemas,
        jsonb_array_elements(data.schemas.class_rule::jsonb->'properties') AS prop(value)
    WHERE
        class_rule::jsonb ? 'properties' AND jsonb_typeof(class_rule::jsonb->'properties') = 'array'
    GROUP BY
        id
)

UPDATE data.schemas
SET
    class_rule = jsonb_set(
        class_rule::jsonb,
        '{properties}',
        updated_properties.updated_props
    )
FROM
    updated_properties
WHERE
    data.schemas.id = updated_properties.id;
