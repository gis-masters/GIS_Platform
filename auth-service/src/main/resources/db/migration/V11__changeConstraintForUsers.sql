ALTER TABLE public.organizations_users DROP CONSTRAINT IF exists uk_ag03e4qasggh4qxd93rfod6wk;

ALTER TABLE public.organizations_users
    ADD CONSTRAINT uc_org_user_ag03e4qasggh4qxd93rfod6wk UNIQUE (users_id, organization_id);
