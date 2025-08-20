ALTER TABLE public.projects
    ADD COLUMN is_folder boolean DEFAULT false NOT NULL;

ALTER TABLE public.projects
    ADD COLUMN path character varying;

ALTER TABLE public.projects
    ALTER COLUMN is_default SET DEFAULT false;

ALTER TABLE public.projects
    ALTER COLUMN is_default SET NOT NULL;
