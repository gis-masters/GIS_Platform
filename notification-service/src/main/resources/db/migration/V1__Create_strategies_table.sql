CREATE TABLE strategies (
    id                      bigserial       PRIMARY KEY,
    name                    VARCHAR(255)    NOT NULL UNIQUE,
    description             VARCHAR(1000),
    max_retries             INTEGER         NOT NULL,
    retry_interval_seconds  BIGINT          NOT NULL,
    active                  BOOLEAN         NOT NULL
);

-- Insert default strategies
INSERT INTO strategies (name, description, max_retries, retry_interval_seconds, active)
VALUES 
    ('Срочная',          'Стратегия уведомлений с 5 повторами и интервалом в 30 секунд', 5,  30,   true),
    ('Стандартная',      'Стратегия уведомлений с 3 повторами и интервалом в 5 минут',   3,  300,  true),
    ('Низкий приоритет', 'Стратегия уведомлений с 3 повторами и интервалом в 30 минут',  1,  1800, true);
