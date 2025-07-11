CREATE TABLE IF NOT EXISTS public.external_statements
(
    id             bigserial              NOT NULL,
    statement_num  character varying(255),
    type           character varying(255),
    cad_num        character varying(255) NOT NULL,
    applicant      character varying(255),
    status         character varying(255),
    statement_date timestamp without time zone,
    created_at     timestamp without time zone,

    CONSTRAINT external_statements_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE public.external_statements
    OWNER to ${db_owner};

INSERT INTO public.integration_tokens (id, service_name, token)
VALUES (2, 'external_statements', 'eea1dcfc-e18e-11ec-8fea-0242ac120002');
