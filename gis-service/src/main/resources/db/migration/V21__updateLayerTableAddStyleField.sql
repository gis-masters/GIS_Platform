ALTER TABLE public.layers
    ADD COLUMN IF NOT EXISTS style text;
