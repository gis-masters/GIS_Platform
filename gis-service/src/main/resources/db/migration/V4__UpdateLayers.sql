ALTER TABLE public.layers DROP COLUMN geometry_type;

ALTER TABLE public.layers
    ADD COLUMN data_source_uri character varying;

UPDATE public.layers
    SET data_source_uri = '/schemas/workspace_' || project_id || '/tables/' || internal_name;
