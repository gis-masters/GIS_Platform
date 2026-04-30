package ru.mycrg.notification.schedule;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.mycrg.notification.domain.notification.NotificationService;
import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.notificators.GlobalNotificator;

import java.util.List;

@Service
public class ScheduleService {

    private final Logger log = LoggerFactory.getLogger(ScheduleService.class);

    private final GlobalNotificator globalNotificator;
    private final NotificationService notificationService;

    public ScheduleService(NotificationService notificationService,
                           GlobalNotificator globalNotificator) {
        this.notificationService = notificationService;
        this.globalNotificator = globalNotificator;
    }

    /**
     * Планировщик для повторной отправки уведомлений
     */
    @Scheduled(fixedRate = 60000) // Запускается каждую минуту
    public void processRetries() {
        List<NotificationEntity> notificationsForRetry = notificationService.findNotificationsForRetry();

        log.info("Найдено {} уведомлений для повторной отправки", notificationsForRetry.size());

        for (NotificationEntity notification: notificationsForRetry) {
            try {
                globalNotificator.sendNotification(notification);
            } catch (Exception e) {
                log.error("Ошибка при обработке повторной отправки для уведомления с id: [{}] => {}",
                          notification.getId(), e.getMessage(), e);
            }
        }
    }
}
