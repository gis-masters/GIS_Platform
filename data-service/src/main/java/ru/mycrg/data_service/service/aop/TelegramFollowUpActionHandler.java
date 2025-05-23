package ru.mycrg.data_service.service.aop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.config.props.NotificationProperties;
import ru.mycrg.data_service.config.props.TelegramNotificationProperties;
import ru.mycrg.data_service.service.notifiers.telegram.ITelegramNotifier;
import ru.mycrg.data_service_contract.dto.FollowUpAction;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.geo_json.Feature;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getPropertyByName;
import static ru.mycrg.http_client.JsonConverter.prettyPrint;

@Component
public class TelegramFollowUpActionHandler implements IFollowUpActionHandler {

    private final Logger log = LoggerFactory.getLogger(TelegramFollowUpActionHandler.class);

    private final NotificationProperties notificationProperties;
    private final Map<ValueType, ITelegramNotifier> telegramNotifiers;

    public TelegramFollowUpActionHandler(NotificationProperties notificationProperties,
                                         List<ITelegramNotifier> telegramNotifiers) {
        this.notificationProperties = notificationProperties;
        this.telegramNotifiers = telegramNotifiers
                .stream()
                .collect(toMap(ITelegramNotifier::getType, Function.identity()));
    }

    @Override
    public void doAction(FollowUpAction followUpAction,
                         Object payload,
                         SchemaDto schema) {
        log.debug("Выполняем отправку данных в телегу, с настройками: [{}] для: [{}]",
                  prettyPrint(followUpAction), prettyPrint(payload));

        TelegramNotificationProperties notificationProfile =
                getTelegramNotificationProfile(followUpAction.getSettings());
        Feature feature = (Feature) payload;

        enrichChatIdIfNeed(notificationProfile, feature);

        List<String> sendableAttributes = followUpAction.getPayload();
        sendableAttributes.forEach(attribute -> {
            sendAttributeData(schema, attribute, feature, notificationProfile);
        });
    }

    private void sendAttributeData(SchemaDto schema,
                                   String attribute,
                                   Feature feature,
                                   TelegramNotificationProperties notificationProfile) {
        if (!feature.getProperties().containsKey(attribute)) {
            log.warn("Отправка данных в телеграмм. В фиче не найден атрибут {}", attribute);

            return;
        }

        Optional<SimplePropertyDto> oProperty = getPropertyByName(schema, attribute);
        if (oProperty.isEmpty()) {
            log.warn("Отправка данных в телеграмм. Не удалось найти свойство: '{}' в схеме: '{}'",
                     attribute, schema.getName());

            return;
        }

        ITelegramNotifier telegramNotifier = telegramNotifiers.get(ValueType.valueOf(oProperty.get().getValueType()));
        if (telegramNotifier == null) {
            log.warn("Не найдена реализация отправителя для: {}", oProperty.get().getValueType());

            return;
        }

        telegramNotifier.notify(notificationProfile, feature, attribute);
    }

    /**
     * Условимся, что chat_id из настроек сервера важнее чем client_id в фиче.
     *
     * @throws IllegalArgumentException Если не удается найти chat_id в настройках и нет client_id у фичи.
     */
    private void enrichChatIdIfNeed(TelegramNotificationProperties notificationProfile,
                                    Feature feature) {
        if (notificationProfile.getChatId() != null) {
            return;
        }

        try {
            notificationProfile.setChatId(feature.getProperties().get("client_id").toString());
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Не возможно выполнить отправку! 'chat_id' не указан в профиле сервера." +
                            "Не удается найти 'client_id' в фиче");
        }
    }

    /**
     * В схемах контент менеджеры НЕ указывают пароли и прочее напрямую.
     * <p>
     * Указывается название одного из профилей прописанных в конфигах, при запуске сервиса.
     *
     * @throws IllegalArgumentException Если followUpSettings не содержат название профиля или если профиль не найден
     *                                  среди конфига сервера.
     */
    private TelegramNotificationProperties getTelegramNotificationProfile(Object followUpSettings) {
        String profileName;
        try {
            Map<String, Object> settings = (Map<String, Object>) followUpSettings;
            profileName = settings.get("profileName").toString();
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Действие TelegramNotificator настроено неверно.\nВ настройках отсутствует обязательный ключ " +
                            "[profileName], который должен ссылаться на [crg-options.notification.telegram]");
        }

        Optional<TelegramNotificationProperties> oFirst = notificationProperties
                .getTelegram().stream()
                .filter(item -> profileName.equals(item.getName()))
                .findFirst();

        if (oFirst.isEmpty()) {
            throw new IllegalArgumentException("Профиль [" + profileName + "] не найден среди заданных на сервере." +
                                                       "\nТекущие профили сервера: " + notificationProperties);
        }

        return new TelegramNotificationProperties(oFirst.get());
    }

    @Override
    public String getType() {
        return "TelegramNotificator";
    }
}
