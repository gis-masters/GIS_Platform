-- Создание таблицы шаблонов
CREATE TABLE templates (
    name        VARCHAR(50) PRIMARY KEY,
    content     TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP
);

-- Insert default templates
INSERT INTO templates (name, content, created_at, updated_at)
VALUES
    ('Заявка принята', '{name} Ваша заявка принята в обработку.', now(), now()),
    ('Заявка с файлом обработана', 'Уважаемый {name} ваша заявка обработана. Направляем Вам результат.', now(), now());
