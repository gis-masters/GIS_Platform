CREATE TABLE IF NOT EXISTS public.users(
  id bigserial NOT NULL UNIQUE,
  email character varying(255),
  enabled boolean,
  name character varying(255),
  password character varying(255),
  sur_name character varying(255),
  username character varying(255),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT ukr43af9ap4edm43mmtq01oddj6 UNIQUE (username)
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;
ALTER TABLE public.users OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.projects(
  id bigserial NOT NULL UNIQUE,
  internal_name character varying(255),
  geoserver_name character varying(255),
  extra json,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
ALTER TABLE public.projects OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.organization(
  id bigserial NOT NULL UNIQUE,
  name character varying(255),
  phone character varying(255),
  status character varying(255),
  CONSTRAINT organization_pkey PRIMARY KEY (id)
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;
ALTER TABLE public.organization OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.organization_users(
  organization_id integer NOT NULL,
  users_id integer NOT NULL,
  CONSTRAINT uk_ag03e4qasggh4qxd93rfod6wk UNIQUE (users_id),
  CONSTRAINT fk15s2npsq3mkltwy8r6fuc3yky FOREIGN KEY (organization_id)
  REFERENCES public.organization (id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE NO ACTION,
  CONSTRAINT fknk8jfecnwa0ihxjd2p6dph3ih FOREIGN KEY (users_id)
  REFERENCES public.users (id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE NO ACTION
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;
ALTER TABLE public.organization_users OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.organization_projects(
  organization_id integer NOT NULL,
  projects_id integer NOT NULL,
  CONSTRAINT uk_ag16e4qasggh3qxd83rfod3wk UNIQUE (projects_id),
  CONSTRAINT fk15s2npsq3mkltwy8r6fuc3yky FOREIGN KEY (organization_id)
  REFERENCES public.organization (id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE NO ACTION,
  CONSTRAINT fknk2jfecnwa5ihxjd2p6dph9ih FOREIGN KEY (projects_id)
  REFERENCES public.projects (id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE NO ACTION
);
ALTER TABLE public.organization_projects OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.authorities(
  id bigserial NOT NULL UNIQUE,
  authority character varying(255),
  user_id integer NOT NULL,
  CONSTRAINT authorities_pkey PRIMARY KEY (id),
  CONSTRAINT fkk91upmbueyim93v469wj7b2qh FOREIGN KEY (user_id)
  REFERENCES public.users (id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE NO ACTION
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;
ALTER TABLE public.authorities OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.custom_rules(
  id bigserial NOT NULL UNIQUE,
  class_name character varying(255),
  class_rule text,
  group_ character varying(255),
  group_alias character varying(255),
  CONSTRAINT custom_rules_pkey PRIMARY KEY (id)
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;
ALTER TABLE public.custom_rules OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.xsd_rules
(
  id bigserial NOT NULL UNIQUE,
  class_name character varying(255),
  class_rule json,
  CONSTRAINT xsd_rules_pkey PRIMARY KEY (id)
)
WITH (OIDS = FALSE)
TABLESPACE pg_default;
ALTER TABLE public.xsd_rules OWNER to postgres;

