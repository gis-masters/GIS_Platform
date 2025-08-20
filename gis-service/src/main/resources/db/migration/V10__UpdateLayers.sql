UPDATE public.layers
    SET data_source_uri = '/api/data/datasets/workspace_' || project_id || '/tables/' || internal_name;
