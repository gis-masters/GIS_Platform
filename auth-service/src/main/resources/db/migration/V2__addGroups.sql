CREATE TABLE IF NOT EXISTS public.groups
(
    id              bigserial NOT NULL UNIQUE,
    name            character varying(255),
    description     character varying(255),
    organization_id bigint    NOT NULL,
    created_at      timestamp without time zone,
    last_modified   timestamp without time zone,
    CONSTRAINT groups_pkey PRIMARY KEY (id)
)
    TABLESPACE pg_default;

ALTER TABLE public.groups
    OWNER to ${db_owner};

CREATE TABLE public.groups_users
(
    user_id  integer NOT NULL,
    group_id integer NOT NULL,
    CONSTRAINT groups_users_pkey PRIMARY KEY (user_id, group_id),
    CONSTRAINT fk3smvbqqwrv7ihunxxb7m899ao FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkakkv3ihrlmgfjf50vj62a0jr6 FOREIGN KEY (group_id)
        REFERENCES public.groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
    TABLESPACE pg_default;

ALTER TABLE public.groups_users
    OWNER to ${db_owner};

ALTER TABLE public.organizations
    ADD COLUMN created_at timestamp without time zone;
ALTER TABLE public.organizations
    ADD COLUMN last_modified timestamp without time zone;

UPDATE public.organizations
SET created_at    = now(),
    last_modified = now();
