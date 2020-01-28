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
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.layers
(
    id            bigserial NOT NULL UNIQUE,
    title         character varying(255),
    internal_name character varying(255),
    geometry_type character varying(20),
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    CONSTRAINT layers_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE public.layers
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.projects_layers
(
    project_id integer NOT NULL,
    layer_id   integer NOT NULL,
    CONSTRAINT uk_ag03e2qfsggh4qxd93rfod6wk UNIQUE (layer_id),
    CONSTRAINT fk13s2nps13mkswtwy8r6fuc3yky FOREIGN KEY (project_id)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fknk81fecnwa0ihx2d22p6dph3ih FOREIGN KEY (layer_id)
        REFERENCES public.layers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

ALTER TABLE public.projects_layers
    OWNER to postgres;
