INSERT INTO public.users(id, email, enabled, name, password, sur_name, username)
  VALUES (1, 'd.alekseev@mycrg.ru', true, 'admin', 'geoserver', 'fiz', 'admin');

INSERT INTO public.authorities(id, authority, user_id)
  VALUES (1, 'ADMIN', 1);