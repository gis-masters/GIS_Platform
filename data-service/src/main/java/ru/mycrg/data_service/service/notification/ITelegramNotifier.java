package ru.mycrg.data_service.service.notification;

import ru.mycrg.data_service.service.notification.client.TelegramNotificationModel;
import ru.mycrg.data_service_contract.enums.ValueType;

public interface ITelegramNotifier {

    void notify(TelegramNotificationModel model, Object payload, String attribute);

    ValueType getType();
}
