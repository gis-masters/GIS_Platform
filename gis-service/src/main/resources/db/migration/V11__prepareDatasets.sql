ALTER TABLE public.layers
    ADD COLUMN dataset character varying(255);

UPDATE public.layers
SET dataset = p.internal_name,
    last_modified = now()
FROM public.layers AS l
         JOIN public.projects AS p ON l.project_id = p.id
WHERE l.id = layers.id
