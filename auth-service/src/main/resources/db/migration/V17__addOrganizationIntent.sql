CREATE TABLE IF NOT EXISTS public.organization_intents
(
    id                bigserial                   NOT NULL UNIQUE,
    email             character varying(60)       NOT NULL UNIQUE,
    token             character varying(20)       NOT NULL,
    specialization_id integer,
    created_at        timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT organization_intents_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.organization_intents
    OWNER to ${db_owner};
