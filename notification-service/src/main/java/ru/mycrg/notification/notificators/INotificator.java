package ru.mycrg.notification.notificators;

import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.NotificationType;

import java.util.Optional;

public interface INotificator {

    Optional<NotificationResult> send(NotificationEntity notificationEntity);

    NotificationType getType();
}
