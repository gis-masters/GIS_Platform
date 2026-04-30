CREATE TABLE notifications (
    id              bigserial   PRIMARY KEY,
    type            VARCHAR(50) NOT NULL,
    status          VARCHAR(50) NOT NULL,
    last_attempt_at TIMESTAMP,
    attempt_count   INTEGER     NOT NULL,
    error_message   VARCHAR(1000),
    strategy_id     BIGINT      NOT NULL REFERENCES strategies(id),
    template_name   VARCHAR(50),
    payload         jsonb       NOT NULL,
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(255) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_strategy_id ON notifications(strategy_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
