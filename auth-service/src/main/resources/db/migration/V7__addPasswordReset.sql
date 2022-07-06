CREATE TABLE IF NOT EXISTS public.password_reset_tokens
(
    id         bigserial                   NOT NULL UNIQUE,
    user_id    integer                     NOT NULL,
    token      character varying(50)       NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT fla21upmbteyim93b463w67v214 FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;
