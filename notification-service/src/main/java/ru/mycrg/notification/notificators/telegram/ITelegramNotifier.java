package ru.mycrg.notification.notificators.telegram;

import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.PropertyType;

public interface ITelegramNotifier {

    void notify(TelegramNotificationProperties notificationProfile, NotificationEntity notification);

    PropertyType getType();
}
