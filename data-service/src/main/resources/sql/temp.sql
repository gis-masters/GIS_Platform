-- Script must not be null or empty
SELECT 'fiz';

--Проставляем всем схемам styleName на основе name, если у них не было
-- UPDATE data.schemas
-- SET class_rule = (
--     jsonb_set(
--         class_rule::jsonb,
--         '{styleName}',
--         to_jsonb(name)::jsonb
--     )
-- )::json
-- WHERE NOT class_rule::jsonb ? 'styleName';



-- Перенос свойств в схему
-- customRuleFunction - custom_rule
-- UPDATE data.schemas
-- SET class_rule = jsonb_set(class_rule::jsonb, '{customRuleFunction}', to_jsonb(custom_rule), true)
-- WHERE custom_rule IS NOT NULL;
--
-- -- calcFiledFunction -  calculated_fields
-- UPDATE data.schemas
-- SET class_rule = jsonb_set(class_rule::jsonb, '{calcFiledFunction}', to_jsonb(calculated_fields), true)
-- WHERE calculated_fields IS NOT NULL;
