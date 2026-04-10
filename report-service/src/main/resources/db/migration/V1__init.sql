CREATE TABLE IF NOT EXISTS public.templates
(
    id                 bigserial                   NOT NULL,
    name               character varying           NOT NULL,
    title              character varying           NOT NULL,
    path               character varying           NOT NULL,
    print_form_schema_overrides             jsonb,
    created_by         character varying(50)       NOT NULL,
    created_at         timestamp without time zone DEFAULT NOW(),
    is_system          boolean                     NOT NULL,
    CONSTRAINT templates_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;

ALTER TABLE public.templates
    OWNER to ${db_owner};

CREATE UNIQUE INDEX IF NOT EXISTS ux_templates_name
    ON public.templates (name);
