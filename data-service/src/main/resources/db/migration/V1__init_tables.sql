CREATE TABLE IF NOT EXISTS public.ais_ums
(
    id              bigserial             NOT NULL,
    name            character varying(255),
    cad_num         character varying(50),
    reg_num         character varying(50) NOT NULL,
    property_type   character varying(50),
    department_name character varying(255),
    created_at      timestamp without time zone,

    CONSTRAINT ais_ums_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE public.ais_ums
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS public.integration_tokens
(
    id           bigserial             NOT NULL,
    service_name character varying(255),
    token        character varying(50) NOT NULL,
    updated_at   timestamp without time zone,

    CONSTRAINT integration_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE public.integration_tokens
    OWNER to ${db_owner};

INSERT INTO public.integration_tokens (id, service_name, token)
VALUES (1, 'ais_ums', 's-mxDFHIgKFSSppWScJoq_ZbcRFlNiaQ')
