package ru.mycrg.data_service.service.notification;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.notification.client.TelegramNotificationModel;
import ru.mycrg.data_service_contract.enums.ValueType;

import static ru.mycrg.data_service_contract.enums.ValueType.CHOICE;

@Component
public class TelegramNotifierChoice implements ITelegramNotifier {

    private final ITelegramNotifier telegramNotifier;

    public TelegramNotifierChoice(TelegramNotifierString telegramNotifier) {
        this.telegramNotifier = telegramNotifier;
    }

    @Override
    public void notify(TelegramNotificationModel model, Object payload, String attribute) {
        telegramNotifier.notify(model, payload, attribute);
    }

    @Override
    public ValueType getType() {
        return CHOICE;
    }
}
