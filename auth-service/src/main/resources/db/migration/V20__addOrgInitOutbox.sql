CREATE TABLE IF NOT EXISTS public.org_init_outbox
(
    org_id             bigint                         NOT NULL UNIQUE,
    status             smallint                       NOT NULL DEFAULT 0,
    created_at         timestamp without time zone    NOT NULL DEFAULT now(),
    processed_at       timestamp without time zone,
    deadline           timestamp without time zone,
    retry_count        integer                        NOT NULL DEFAULT 0,
    encrypted_password character varying              NOT NULL,
    specialization_id  smallint,
    CONSTRAINT org_init_outbox_pkey PRIMARY KEY (org_id),
    CONSTRAINT fk_org_init_outbox_org FOREIGN KEY (org_id)
        REFERENCES public.organizations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
) TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.org_init_outbox
    OWNER to ${db_owner};
