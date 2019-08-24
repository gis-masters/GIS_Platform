ALTER TABLE public.custom_rules
    ADD COLUMN IF NOT EXISTS calculated_fields text;
