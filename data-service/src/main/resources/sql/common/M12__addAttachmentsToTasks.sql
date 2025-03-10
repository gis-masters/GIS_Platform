ALTER TABLE IF EXISTS data.tasks
    ADD COLUMN IF NOT EXISTS attachments jsonb;
