ALTER TABLE public.password_reset_tokens DROP CONSTRAINT IF exists fla21upmbteyim93b463w67v214;

ALTER TABLE public.password_reset_tokens
    ADD CONSTRAINT fla21upmbteyim93b463w67v214 FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE;
