CREATE TABLE IF NOT EXISTS public.permissions
(
    id             bigserial NOT NULL UNIQUE,
    principal_type character varying(50),
    principal_id   bigint,
    role           character varying(50),
    project_id     bigint    not null,
    created_at     timestamp without time zone,
    last_modified  timestamp without time zone,
    CONSTRAINT permissions_pkey PRIMARY KEY (id),
    CONSTRAINT fjcjb3tlhbfy31bkd1j86y1kw3e FOREIGN KEY (project_id) REFERENCES public.projects
    ) TABLESPACE pg_default;

ALTER TABLE public.permissions
    OWNER to ${db_owner};