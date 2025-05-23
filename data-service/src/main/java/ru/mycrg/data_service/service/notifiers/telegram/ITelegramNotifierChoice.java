package ru.mycrg.data_service.service.notifiers.telegram;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.config.props.TelegramNotificationProperties;
import ru.mycrg.data_service_contract.enums.ValueType;

import static ru.mycrg.data_service_contract.enums.ValueType.CHOICE;

@Component
public class ITelegramNotifierChoice implements ITelegramNotifier {

    private final ITelegramNotifier telegramNotifier;

    public ITelegramNotifierChoice(ITelegramNotifierText telegramNotifier) {
        this.telegramNotifier = telegramNotifier;
    }

    @Override
    public void notify(TelegramNotificationProperties notificationProfile, Object payload, String attribute) {
        telegramNotifier.notify(notificationProfile, payload, attribute);
    }

    @Override
    public ValueType getType() {
        return CHOICE;
    }
}
