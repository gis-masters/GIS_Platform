CREATE TABLE IF NOT EXISTS public.groups
(
    id            bigserial NOT NULL UNIQUE,
    parent        integer,
    title         character varying(255),
    internal_name character varying(255),
    enabled       boolean   NOT NULL,
    expanded      boolean   NOT NULL,
    position      integer   NOT NULL,
    transparency  integer   NOT NULL,
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    project_id    serial    not null,
    CONSTRAINT group_pkey PRIMARY KEY (id),
    CONSTRAINT fknqb3tlhbwy2abk31480y20wq0 FOREIGN KEY (parent) REFERENCES public.groups,
    CONSTRAINT midab7wldjeg1aji72j34xr60fh FOREIGN KEY (project_id) REFERENCES public.projects
) TABLESPACE pg_default;

ALTER TABLE public.groups
    OWNER to ${db_owner};

ALTER TABLE public.layers ADD COLUMN group_id integer;
