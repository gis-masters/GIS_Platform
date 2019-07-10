CREATE TABLE IF NOT EXISTS public.processes
(
    id        bigserial NOT NULL UNIQUE,
    user_id   integer   NOT NULL,
    name      character varying(255),
    type      character varying(20),
    status    character varying(20),
    extra     json,
    is_active boolean,
    CONSTRAINT rus43af9ap4edm43mm3141oddj6 PRIMARY KEY (id)
) TABLESPACE pg_default;
ALTER TABLE public.processes
    OWNER to postgres;
