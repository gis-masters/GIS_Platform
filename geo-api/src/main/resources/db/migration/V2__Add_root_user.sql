INSERT INTO public.users(id, email, enabled, name, password, sur_name, username)
  VALUES (1, 'd.alekseev@mycrg.ru', true, 'admin', '$2a$10$qux9ZvBIbaUrWHSLXzO2MOkhYzzeY1WPxmVRtjd0Xly0RPVEbAunW', 'fiz', 'admin');

INSERT INTO public.authorities(id, authority, user_id)
  VALUES (1, 'ADMIN', 1);