UPDATE data.schemas
SET class_rule=CAST(regexp_replace(CAST(class_rule AS text), 'name": "Geometry', 'name": "shape', 'i') AS json);
