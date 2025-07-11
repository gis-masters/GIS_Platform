CREATE TABLE IF NOT EXISTS public.audit_events
(
    id                 bigserial   NOT NULL,
    event_date_time    timestamp without time zone,
    organization_id    bigint      NOT NULL,
    user_name          varchar(60) NOT NULL,
    action_type        varchar(20) NOT NULL,
    entity_name        varchar(100),
    entity_id          bigint,
    entity_state_after jsonb,
    CONSTRAINT crg_audit_events_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE public.audit_events
    OWNER to ${db_owner};

CREATE INDEX crg_audit_events_org_id_idx ON public.audit_events (organization_id);
