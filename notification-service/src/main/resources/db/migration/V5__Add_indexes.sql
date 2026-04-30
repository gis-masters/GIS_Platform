-- Add additional indexes for common query patterns
CREATE INDEX idx_notifications_status_created_at ON notifications(status, created_at);
CREATE INDEX idx_notifications_status_last_attempt_at ON notifications(status, last_attempt_at) WHERE last_attempt_at IS NOT NULL;
CREATE INDEX idx_notifications_template_name ON notifications(template_name);
