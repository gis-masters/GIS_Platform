CREATE TABLE IF NOT EXISTS public.projects
(
    id              bigserial NOT NULL UNIQUE,
    name            character varying(255),
    internal_name   character varying(255),
    organization_id integer   NOT NULL,
    bbox            character varying(200),
    created_at      timestamp without time zone,
    last_modified   timestamp without time zone,
    CONSTRAINT projects_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE public.projects
    OWNER to ${db_owner};

CREATE TABLE IF NOT EXISTS public.layers
(
    id              bigserial NOT NULL UNIQUE,
    title           character varying(255),
    internal_name   character varying(255),
    enabled         boolean,
    position        integer,
    transparency    integer,
    max_zoom        integer,
    min_zoom        integer,
    style_name      character varying(100),
    native_crs      character varying(255),
    data_store_name character varying(100),
    schema_id       character varying(100),
    geometry_type   character varying(20),
    created_at      timestamp without time zone,
    last_modified   timestamp without time zone,
    project_id      serial    not null,
    CONSTRAINT layers_pkey PRIMARY KEY (id),
    CONSTRAINT fkcqb7tlhbwy2abk71j80y20wq0 FOREIGN KEY (project_id) REFERENCES public.projects
) TABLESPACE pg_default;

ALTER TABLE public.layers
    OWNER to ${db_owner};
