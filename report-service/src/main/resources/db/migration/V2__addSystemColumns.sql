ALTER TABLE IF EXISTS public.templates
    ADD COLUMN IF NOT EXISTS hidden boolean,
    ADD COLUMN IF NOT EXISTS type character varying;
