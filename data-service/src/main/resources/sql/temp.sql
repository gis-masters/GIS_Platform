--Проставляем всем схемам styleName на основе name, если у них не было
UPDATE data.schemas
SET class_rule = (
    jsonb_set(
        class_rule::jsonb,
        '{styleName}',
        to_jsonb(name)::jsonb
    )
)::json
WHERE NOT class_rule::jsonb ? 'styleName';



-- Перенос свойств в схему
-- customRuleFunction - custom_rule
UPDATE data.schemas
SET class_rule = jsonb_set(class_rule::jsonb, '{customRuleFunction}', to_jsonb(custom_rule), true)
WHERE custom_rule IS NOT NULL;

-- calcFiledFunction -  calculated_fields
UPDATE data.schemas
SET class_rule = jsonb_set(class_rule::jsonb, '{calcFiledFunction}', to_jsonb(calculated_fields), true)
WHERE calculated_fields IS NOT NULL;

-- update for doc_libraries
-- WITH subquery AS (
--     SELECT data.schemas.class_rule->>'name' AS schema_id,
--            data.schemas.class_rule::jsonb
--     FROM data.schemas
-- )
-- UPDATE data.doc_libraries AS lib
-- SET schema = subquery.class_rule
-- FROM subquery
-- WHERE lib.schema_id = subquery.schema_id;
--
-- -- update for schemas_and_tables
-- WITH subquery AS (
--     SELECT data.schemas.class_rule->>'name' AS schema_id,
--            data.schemas.class_rule::jsonb
--     FROM data.schemas
-- )
-- UPDATE data.schemas_and_tables AS sat
-- SET schema = subquery.class_rule
-- FROM subquery
-- WHERE sat.schema_id = subquery.schema_id
