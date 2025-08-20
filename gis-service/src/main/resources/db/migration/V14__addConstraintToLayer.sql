ALTER TABLE public.layers
    ADD CONSTRAINT fiz_fk_group_id
        FOREIGN KEY (parent_id)
            REFERENCES public.groups
            ON DELETE SET NULL;
