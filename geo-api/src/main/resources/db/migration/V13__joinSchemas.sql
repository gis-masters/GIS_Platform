SELECT setval('public.xsd_rules_id_seq', 1000, true);

ALTER TABLE public.xsd_rules
    ADD COLUMN custom_rule text;

ALTER TABLE public.xsd_rules
    ADD COLUMN calculated_fields text;

ALTER TABLE public.xsd_rules
    RENAME class_name TO name;

INSERT INTO public.xsd_rules(name, class_rule, custom_rule, calculated_fields)
  select xr.name, xr.class_rule, cr.class_rule, cr.calculated_fields from public.xsd_rules as xr JOIN public.custom_rules as cr ON xr.name = cr.class_name;

DELETE FROM public.xsd_rules WHERE id < 1000;
