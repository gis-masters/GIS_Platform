CREATE TABLE public.basemaps
(
    id         bigserial NOT NULL UNIQUE,
    basemap_id bigint    NOT NULL,
    title      character varying(255),
    position   integer,
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    CONSTRAINT basemaps_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE public.basemaps
    OWNER to ${db_owner};

CREATE TABLE public.projects_basemaps
(
    project_id integer NOT NULL,
    basemap_id integer NOT NULL,
    CONSTRAINT projects_basemaps_pkey PRIMARY KEY (project_id, basemap_id),
    CONSTRAINT fk6boklhl2f6jw49s4plunbh5hf FOREIGN KEY (basemap_id)
        REFERENCES public.basemaps (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkm3ykojstmhgnm9d33qtu7hjbp FOREIGN KEY (project_id)
        REFERENCES public.projects (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

ALTER TABLE public.projects_basemaps
    OWNER to ${db_owner};
