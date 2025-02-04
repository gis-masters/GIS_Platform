ALTER TABLE public.layers
    ADD COLUMN type character varying;

UPDATE public.layers
	SET type = 'vector';

UPDATE public.layers
	SET data_source_uri = '/api/data' || data_source_uri;
