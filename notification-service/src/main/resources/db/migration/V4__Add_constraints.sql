-- Add check constraints to ensure valid data
ALTER TABLE notifications 
    ADD CONSTRAINT chk_notification_type 
    CHECK (type IN ('TELEGRAM', 'EMAIL'));

ALTER TABLE notifications 
    ADD CONSTRAINT chk_notification_status 
    CHECK (status IN ('CREATED', 'PROCESSING', 'DELIVERED', 'FAILED', 'CANCELLED'));

-- Добавление внешнего ключа на таблицу templates
-- Этот ключ будет добавлен после создания таблицы templates в V5
ALTER TABLE notifications 
    ADD CONSTRAINT fk_notifications_template 
    FOREIGN KEY (template_name) REFERENCES templates(name);
