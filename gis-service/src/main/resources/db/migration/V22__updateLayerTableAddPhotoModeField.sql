ALTER TABLE public.layers
    ADD COLUMN IF NOT EXISTS photo_mode character varying;
