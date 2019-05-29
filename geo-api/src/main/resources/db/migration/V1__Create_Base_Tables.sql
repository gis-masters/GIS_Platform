CREATE TABLE IF NOT EXISTS public.organizations
(
    id         bigserial NOT NULL UNIQUE,
    name       character varying(500),
    phone      character varying(20),
    status     character varying(20),
    created_on timestamp without time zone,
    updated_on timestamp without time zone,
    CONSTRAINT organizations_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
ALTER TABLE public.organizations
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.users
(
    id         bigserial NOT NULL UNIQUE,
    email      character varying(60),
    enabled    boolean,
    name       character varying(60),
    password   character varying(255),
    sur_name   character varying(100),
    username   character varying(60),
    created_on timestamp without time zone,
    updated_on timestamp without time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT ukr43af9ap4edm43mmtq01oddj6 UNIQUE (username)
) TABLESPACE pg_default;
ALTER TABLE public.users
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.projects
(
    id              bigserial NOT NULL UNIQUE,
    internal_name   character varying(255),
    geoserver_name  character varying(255),
    status          character varying(20),
    extra           json,
    created_on      timestamp without time zone,
    updated_on      timestamp without time zone,
    organization_id integer   NOT NULL,
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT fk3gwrleyyq6prcnqekmkobbimd FOREIGN KEY (organization_id)
        REFERENCES public.organizations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;
ALTER TABLE public.projects
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.organizations_users
(
    organization_id integer NOT NULL,
    users_id        integer NOT NULL,
    CONSTRAINT uk_ag03e4qasggh4qxd93rfod6wk UNIQUE (users_id),
    CONSTRAINT fk15s2npsq3mkltwy8r6fuc3yky FOREIGN KEY (organization_id)
        REFERENCES public.organizations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fknk8jfecnwa0ihxjd2p6dph3ih FOREIGN KEY (users_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;
ALTER TABLE public.organizations_users
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.authorities
(
    id        bigserial NOT NULL UNIQUE,
    authority character varying(50),
    user_id   integer   NOT NULL,
    CONSTRAINT authorities_pkey PRIMARY KEY (id),
    CONSTRAINT fkk91upmbueyim93v469wj7b2qh FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;
ALTER TABLE public.authorities
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.custom_rules
(
    id          bigserial NOT NULL UNIQUE,
    class_name  character varying(255),
    class_rule  text,
    group_      character varying(255),
    group_alias character varying(255),
    CONSTRAINT custom_rules_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
ALTER TABLE public.custom_rules
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.xsd_rules
(
    id         bigserial NOT NULL UNIQUE,
    class_name character varying(255),
    class_rule json,
    CONSTRAINT xsd_rules_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;
ALTER TABLE public.xsd_rules
    OWNER to postgres;

