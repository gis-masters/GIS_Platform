ALTER TABLE public.layers
    RENAME COLUMN group_id TO parent_id;

ALTER TABLE public.layers
    RENAME COLUMN internal_name TO table_name;