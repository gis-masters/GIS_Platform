DROP TABLE IF EXISTS public.ais_ums CASCADE;

DELETE FROM public.integration_tokens
	WHERE service_name = 'ais_ums';
