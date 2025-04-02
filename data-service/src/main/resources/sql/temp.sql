-- Script must not be null or empty
SELECT 'fiz';

--Чиним тайтлы *удалить после пробежки по всем серверам
WITH updated_versions AS ( 
    SELECT 
        id,
        schema::jsonb || jsonb_build_object(
            'properties',
            array_agg(
                CASE 
                    WHEN (NOT (p ? 'title') OR p -> 'title' = 'null') 
                    THEN p || jsonb_build_object('title', p -> 'name') 
                    ELSE p
                END
            )
        ) AS new_class_rule
    FROM 
        data.schemas_and_tables,
        jsonb_array_elements(schema::jsonb -> 'properties') p
    GROUP BY id
)
UPDATE data.schemas_and_tables d
SET schema = u.new_class_rule
FROM updated_versions u
WHERE d.id = u.id;

WITH updated_versions AS ( 
    SELECT 
        id,
        class_rule::jsonb || jsonb_build_object(
            'properties',
            array_agg(
                CASE 
                    WHEN (NOT (p ? 'title') OR p -> 'title' = 'null') 
                    THEN p || jsonb_build_object('title', p -> 'name') 
                    ELSE p
                END
            )
        ) AS new_class_rule
    FROM 
        data.schemas,
        jsonb_array_elements(class_rule::jsonb -> 'properties') p
    GROUP BY id
)
UPDATE data.schemas d
SET class_rule = u.new_class_rule
FROM updated_versions u
WHERE d.id = u.id;



--Убираем мусор *удалить после пробежки по всем серверам
WITH cleaned_versions AS (
    SELECT 
        id,
        schema::jsonb || jsonb_build_object(
            'properties',
            array_agg(
                (SELECT jsonb_object_agg(key, value)
                 FROM jsonb_each(p)
                 WHERE NOT (
                     value IS NULL OR
                     value = '-1' OR
                     value = '""' OR
                     value = '[]'::jsonb OR
                     value = '{}'::jsonb OR
                     value = '254' OR
                     value = '255' OR
                     value = '256' OR
                     value = 'false' OR
                     value = 'null' OR
                     key = 'sequenceNumber'
                 )
                )
            )
        ) AS cleaned_schema
    FROM 
        data.schemas_and_tables,
        jsonb_array_elements(schema::jsonb -> 'properties') p
    GROUP BY id
)
UPDATE data.schemas_and_tables d
SET schema = c.cleaned_schema
FROM cleaned_versions c
WHERE d.id = c.id;

WITH cleaned_versions AS (
    SELECT 
        id,
        class_rule::jsonb || jsonb_build_object(
            'properties',
            array_agg(
                (SELECT jsonb_object_agg(key, value)
                 FROM jsonb_each(p)
                 WHERE NOT (
                     value IS NULL OR
                     value = '-1' OR
                     value = '""' OR
                     value = '[]'::jsonb OR
                     value = '{}'::jsonb OR
                     value = '254' OR
                     value = '255' OR
                     value = '256' OR
                     value = 'false' OR
                     value = 'null' OR
                     key = 'sequenceNumber'
                 )
                )
            )
        ) AS cleaned_schema
    FROM 
        data.schemas,
        jsonb_array_elements(class_rule::jsonb -> 'properties') p
    GROUP BY id
)
UPDATE data.schemas d
SET class_rule = c.cleaned_schema
FROM cleaned_versions c
WHERE d.id = c.id;
