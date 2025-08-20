ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS geoserver_login character varying;

UPDATE public.users SET geoserver_login = login where login is not null;
