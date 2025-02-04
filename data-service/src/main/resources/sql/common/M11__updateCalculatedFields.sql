-- update на очистку всех полей 10 приказа у которых есть calculated_fields
UPDATE data.schemas
SET calculated_fields = NULL
WHERE class_rule::jsonb @> '{"tags": ["system", "Приказ 10"]}';