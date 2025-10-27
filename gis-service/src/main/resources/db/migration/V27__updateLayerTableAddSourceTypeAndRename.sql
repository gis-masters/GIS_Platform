ALTER TABLE IF EXISTS public.layers
    RENAME table_name TO resource_id;

ALTER TABLE IF EXISTS public.layers
    RENAME library_id TO source_id;

ALTER TABLE IF EXISTS public.layers
    RENAME record_id TO source_record_id;

ALTER TABLE IF EXISTS public.layers
    ADD COLUMN IF NOT EXISTS source_type character varying(20);
