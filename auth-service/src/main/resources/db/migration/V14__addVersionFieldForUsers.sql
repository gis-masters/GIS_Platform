ALTER TABLE IF EXISTS public.users
    ADD COLUMN IF NOT EXISTS version smallint default 0;
