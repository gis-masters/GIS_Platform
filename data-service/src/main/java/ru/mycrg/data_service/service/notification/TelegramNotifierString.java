package ru.mycrg.data_service.service.notification;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.notification.client.NotificationProperty;
import ru.mycrg.data_service.service.notification.client.NotificationServiceClient;
import ru.mycrg.data_service.service.notification.client.TelegramNotificationModel;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.geo_json.Feature;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ValueType.STRING;

@Component
public class TelegramNotifierString implements ITelegramNotifier {

    private final NotificationServiceClient notificationServiceClient;

    public TelegramNotifierString(NotificationServiceClient notificationServiceClient) {
        this.notificationServiceClient = notificationServiceClient;
    }

    @Override
    public void notify(TelegramNotificationModel model, Object payload, String attribute) {
        Feature feature = (Feature) payload;
        Object value = feature.getProperties().get(attribute);

        List<NotificationProperty> props = model.getPayload().getProps();
        props.add(new NotificationProperty(attribute, "STRING", value.toString()));

        notificationServiceClient.notify(model);
    }

    @Override
    public ValueType getType() {
        return STRING;
    }
}
