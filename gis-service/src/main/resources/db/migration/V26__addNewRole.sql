INSERT INTO public.acl_roles (id, name)
SELECT 20, 'CONTRIBUTOR'
WHERE NOT EXISTS(SELECT id FROM public.acl_roles WHERE name = 'CONTRIBUTOR');
