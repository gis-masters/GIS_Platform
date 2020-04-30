UPDATE public.xsd_rules
SET class_rule = class_rule::jsonb || '{"readOnly": true}';

UPDATE public.xsd_rules
SET class_rule = class_rule::jsonb || '{"title": "Общественные пространства"}'
WHERE class_name = 'public_point';

UPDATE public.xsd_rules
SET class_rule = class_rule::jsonb || '{"description": "Класс объектов «Общественные пространства»"}'
WHERE class_name = 'public_point';

UPDATE public.xsd_rules
SET class_rule = class_rule::jsonb || '{"title": "Сети водоснабжения"}'
WHERE class_name = 'waterpipeline_line';

UPDATE public.xsd_rules
SET class_rule = class_rule::jsonb || '{"description": "Класс объектов «Сети водоснабжения»"}'
WHERE class_name = 'waterpipeline_line';
