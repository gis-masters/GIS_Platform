INSERT INTO public.users(email, enabled, name, password, sur_name, username)
  VALUES ('d.alekseev@mycrg.ru', true, 'admin', '$2a$10$qux9ZvBIbaUrWHSLXzO2MOkhYzzeY1WPxmVRtjd0Xly0RPVEbAunW',
          'fiz', 'admin@mail.ru');

INSERT INTO public.authorities(authority, user_id)
  VALUES ('ADMIN', 1);
