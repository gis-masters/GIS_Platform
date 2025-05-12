package ru.mycrg.data_service.service.notifiers.telegram;

import ru.mycrg.data_service.config.props.TelegramNotificationProperties;
import ru.mycrg.data_service_contract.enums.ValueType;

public interface ITelegramNotifier {

    void notify(TelegramNotificationProperties notificationProfile, Object payload, String attribute);

    ValueType getType();
}
