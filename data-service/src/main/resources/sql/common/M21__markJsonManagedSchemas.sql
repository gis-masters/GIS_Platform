-- При переносе схемы из sql/schemas в system_schemas/*.json
-- добавьте её name в список ниже, чтобы на уже развёрнутых БД
-- выставился from_json = true до JSON-sync (иначе sync упадёт
-- на конфликте с from_json = false).
UPDATE data.schemas
SET from_json = true
WHERE name IN (
    'dxf_schema_v1'
);
