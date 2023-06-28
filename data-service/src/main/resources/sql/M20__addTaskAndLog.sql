-- Common
CREATE TABLE IF NOT EXISTS data.tasks
(
    id            bigserial         NOT NULL,
    type          character varying NOT NULL,
    status        character varying(30),
    assigned_to   bigint,
    owner_id      bigint            NOT NULL,
    due_date      timestamp without time zone,
    description   character varying,
    created_by    bigint,
    created_at    timestamp without time zone DEFAULT now(),
    updated_by    bigint,
    last_modified timestamp without time zone DEFAULT now(),
    CONSTRAINT tasks_id_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;


CREATE TABLE IF NOT EXISTS data.tasks_log
(
    id         bigserial         NOT NULL,
    task_id    bigint            NOT NULL,
    event_type character varying NOT NULL,
    message    jsonb,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT tasks_log_id_pkey PRIMARY KEY (id),
    CONSTRAINT fkjm34ygwboc77dpgpbfageb3k FOREIGN KEY (task_id)
        REFERENCES data.tasks (id) MATCH SIMPLE
        ON UPDATE NO ACTION
) TABLESPACE pg_default;
