UPDATE public.xsd_rules SET class_rule = class_rule::jsonb || '{"geometryType": "MultiPolygon"}';
UPDATE public.xsd_rules SET class_rule = class_rule::jsonb || '{"geometryType": "MultiLineString"}'
    WHERE POSITION('_line' IN class_name) > 0;
UPDATE public.xsd_rules SET class_rule = class_rule::jsonb || '{"geometryType": "Point"}'
    WHERE POSITION('_point' IN class_name) > 0;
