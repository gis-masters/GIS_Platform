ALTER TABLE data.base_maps
    ADD COLUMN IF NOT EXISTS position integer,
    ADD COLUMN IF NOT EXISTS pluggable_to_new_project boolean;
