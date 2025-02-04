ALTER TABLE public.layers
    ADD COLUMN library_id character varying;

ALTER TABLE public.layers
    ADD COLUMN record_id bigint;
