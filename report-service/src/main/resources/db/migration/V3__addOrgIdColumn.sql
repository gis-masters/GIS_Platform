ALTER TABLE IF EXISTS public.templates
    ADD COLUMN IF NOT EXISTS organization_id bigint;
