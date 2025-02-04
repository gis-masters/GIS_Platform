ALTER TABLE IF EXISTS public.users
    ADD COLUMN IF NOT EXISTS boss_id integer;
ALTER TABLE IF EXISTS public.users
    ADD CONSTRAINT fiz_boss FOREIGN KEY (boss_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID;
