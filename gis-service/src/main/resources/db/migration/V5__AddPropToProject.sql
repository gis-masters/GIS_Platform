ALTER TABLE public.projects
    ADD COLUMN is_default boolean;

UPDATE public.projects
SET is_default = false;

UPDATE public.projects
SET is_default='Y'
WHERE ID = (SELECT ID FROM public.projects WHERE is_default = 'N' ORDER BY ID LIMIT 1)
