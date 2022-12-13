UPDATE data.schemas
SET name = 'fiz_' || upper(substr(md5(random()::text), 0, 7))
WHERE name ISNULL;

UPDATE data.schemas
SET class_rule = '{}'
WHERE class_rule ISNULL;

ALTER TABLE data.schemas
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE data.schemas
    ALTER COLUMN class_rule SET NOT NULL;
