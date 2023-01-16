CREATE TABLE IF NOT EXISTS public.acl_roles
(
    id   bigserial             NOT NULL,
    name character varying(20) NOT NULL,
    CONSTRAINT acl_roles_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;


INSERT INTO public.acl_roles (id, name)
SELECT 10, 'VIEWER'
WHERE NOT EXISTS(SELECT id FROM public.acl_roles WHERE name = 'VIEWER');

INSERT INTO public.acl_roles (id, name)
SELECT 30, 'OWNER'
WHERE NOT EXISTS(SELECT id FROM public.acl_roles WHERE name = 'OWNER');


ALTER TABLE public.permissions
    ADD COLUMN role_new bigint;

ALTER TABLE public.permissions
    ADD CONSTRAINT acl_role_id__fiz_fkey FOREIGN KEY (role_new)
        REFERENCES public.acl_roles (id) MATCH SIMPLE;

UPDATE public.permissions
SET role_new = 10
WHERE role = 'VIEWER';

UPDATE public.permissions
SET role_new = 30
WHERE role = 'OWNER';

ALTER TABLE public.permissions DROP COLUMN role;

ALTER TABLE public.permissions
    RENAME role_new TO role_id;

ALTER TABLE public.projects DROP COLUMN internal_name;
