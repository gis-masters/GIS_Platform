ALTER TABLE IF EXISTS data.tasks_log
    ADD COLUMN IF NOT EXISTS created_by bigint;
