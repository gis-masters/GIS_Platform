CREATE TABLE IF NOT EXISTS public.organizations
(
    id     bigserial NOT NULL UNIQUE,
    name   character varying(500),
    phone  character varying(20),
    status character varying(20),
    CONSTRAINT organizations_pkey PRIMARY KEY (id)
    ) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.users
(
    id            bigserial NOT NULL UNIQUE,
    email         character varying(60),
    enabled       boolean,
    name          character varying(60),
    password      character varying(255),
    sur_name      character varying(100),
    username      character varying(60),
    created_at    timestamp without time zone,
    last_modified timestamp without time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT ukr43af9ap4edm43mmtq01oddj6 UNIQUE (username)
    ) TABLESPACE pg_default;

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

ALTER TABLE public.organizations
    OWNER to ${db_owner};
ALTER TABLE public.users
    OWNER to ${db_owner};
ALTER TABLE public.organizations_users
    OWNER to ${db_owner};
ALTER TABLE public.authorities
    OWNER to ${db_owner};


INSERT INTO public.users(email, enabled, name, password, sur_name, username, created_at, last_modified)
VALUES ('d.alekseev@mycrg.ru', true, 'admin', '${admin_password}',
        'zif', '${admin_username}', NOW(), NOW());

INSERT INTO public.authorities(authority, user_id)
VALUES ('GLOBAL_ADMIN', 1);
