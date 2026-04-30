package ru.mycrg.notification.notificators;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.notification.domain.notification.NotificationService;
import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.NotificationStatus;
import ru.mycrg.notification.domain.notification.models.NotificationType;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.notification.domain.notification.models.NotificationStatus.*;

@Component
public class GlobalNotificator {

    private final Logger log = LoggerFactory.getLogger(GlobalNotificator.class);

    private final NotificationService notificationService;
    private final Map<NotificationType, INotificator> notificators;

    public GlobalNotificator(NotificationService notificationService,
                             List<INotificator> notificators) {
        this.notificationService = notificationService;

        this.notificators = notificators.stream()
                                        .collect(toMap(INotificator::getType, Function.identity()));
    }

    public void sendNotification(Long id) {
        sendNotification(notificationService.getNotificationEntityById(id));
    }

    public void sendNotification(NotificationEntity notification) {
        try {
            Long id = notification.getId();
            NotificationStatus status = notification.getStatus();
            if (status == DELIVERED || status == FAILED || status == CANCELLED) {
                log.info("Уведомление с ID {} уже в конечном статусе {}, отправка не требуется", id, status);

                return;
            }

            notificationService.switchToProcessing(notification);

            notificators.get(notification.getType())
                        .send(notification)
                        .ifPresentOrElse(result -> {
                            if (result.success()) {
                                notificationService.switchToDelivered(notification);
                            } else {
                                notificationService.writeError(notification, result.errorMessage());
                            }
                        }, () -> {
                            log.error("Не удалось получить результат отправки уведомления с ID {}", id);

                            notificationService.writeError(notification, "Не удалось получить результат отправки");
                        });
        } catch (Exception e) {
            log.error("☠ Что-то пошло не так при попытке отправки: {} => {}", notification, e.getMessage(), e);

            notificationService.writeError(notification, "Ошибка отправки: " + e.getMessage());
        }
    }
}
