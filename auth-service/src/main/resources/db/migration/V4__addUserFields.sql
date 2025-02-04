ALTER TABLE public.users
    ADD COLUMN middle_name character varying(60),
    ADD COLUMN job         character varying(255),
    ADD COLUMN phone       character varying(20);
