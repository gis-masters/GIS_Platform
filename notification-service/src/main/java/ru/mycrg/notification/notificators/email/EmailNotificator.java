package ru.mycrg.notification.notificators.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.NotificationType;
import ru.mycrg.notification.notificators.INotificator;
import ru.mycrg.notification.notificators.NotificationResult;
import ru.mycrg.notification.domain.template.TemplateHandler;

import java.util.Optional;

import static ru.mycrg.notification.domain.notification.models.NotificationType.EMAIL;

@Component
public class EmailNotificator implements INotificator {
    
    private final Logger log = LoggerFactory.getLogger(EmailNotificator.class);
    private final TemplateHandler templateHandler;
    
    public EmailNotificator(TemplateHandler templateHandler) {
        this.templateHandler = templateHandler;
    }

    @Override
    public Optional<NotificationResult> send(NotificationEntity notificationEntity) {
        // Проверяем, что указан email
        if (notificationEntity.getEmail() == null) {
            throw new IllegalArgumentException("Не указан email для отправки Email-уведомления");
        }
        
        try {
            // TODO: Implement actual email sending logic
            log.info("Подготовлено сообщение для отправки на email {}: {}", 
                    notificationEntity.getEmail(), templateHandler.prepareMessage(notificationEntity));
            
            // Временная заглушка, возвращающая ошибку "Не реализовано"
            return Optional.of(NotificationResult.failed("Отправка Email уведомлений не реализована"));
        } catch (Exception e) {
            String errorMessage = String.format("Ошибка при подготовке Email-уведомления: %s", e.getMessage());
            log.error(errorMessage, e);
            return Optional.of(NotificationResult.failed(errorMessage));
        }
    }

    @Override
    public NotificationType getType() {
        return EMAIL;
    }
}
