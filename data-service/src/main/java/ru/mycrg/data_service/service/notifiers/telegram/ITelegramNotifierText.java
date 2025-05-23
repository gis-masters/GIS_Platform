package ru.mycrg.data_service.service.notifiers.telegram;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.config.props.TelegramNotificationProperties;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.geo_json.Feature;

import static ru.mycrg.data_service_contract.enums.ValueType.TEXT;

@Component
public class ITelegramNotifierText implements ITelegramNotifier {

    private final TelegramMessageSender telegramMessageSender;

    public ITelegramNotifierText(TelegramMessageSender telegramMessageSender) {
        this.telegramMessageSender = telegramMessageSender;
    }

    @Override
    public void notify(TelegramNotificationProperties notificationProfile, Object payload, String attribute) {
        Feature feature = (Feature) payload;

        Object value = feature.getProperties().get(attribute);

        telegramMessageSender.sendMessage(notificationProfile.getToken(),
                                          value.toString(),
                                          notificationProfile.getChatId(),
                                          notificationProfile.getMessageThreadId());
    }

    @Override
    public ValueType getType() {
        return TEXT;
    }
}
