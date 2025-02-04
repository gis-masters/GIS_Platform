ALTER TABLE IF EXISTS public.users
    ADD COLUMN IF NOT EXISTS created_by character varying(255),
    ADD COLUMN IF NOT EXISTS updated_by character varying(255);
