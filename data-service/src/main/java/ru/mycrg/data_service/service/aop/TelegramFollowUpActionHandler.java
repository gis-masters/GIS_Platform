package ru.mycrg.data_service.service.aop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.service.notification.ITelegramNotifier;
import ru.mycrg.data_service.service.notification.client.NotificationPayload;
import ru.mycrg.data_service.service.notification.client.TelegramNotificationModel;
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

    public final String TEMPLATE_NAME = "templateName";
    public final String STRATEGY_NAME = "strategyName";
    public final String PROFILE_NAME = "profileName";
    public final String CLIENT_ID = "client_id";

    private final IAuthenticationFacade authenticationFacade;
    private final Map<ValueType, ITelegramNotifier> telegramNotifiers;

    public TelegramFollowUpActionHandler(List<ITelegramNotifier> telegramNotifiers,
                                         IAuthenticationFacade authenticationFacade) {
        this.telegramNotifiers = telegramNotifiers
                .stream()
                .collect(toMap(ITelegramNotifier::getType, Function.identity()));
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public void doAction(FollowUpAction followUpAction,
                         Object payload,
                         SchemaDto schema) {
        log.debug("Выполняем отправку данных в телегу, с настройками: [{}] для: [{}]",
                  prettyPrint(followUpAction), prettyPrint(payload));

        Feature feature = (Feature) payload;
        TelegramNotificationModel notificationModel = buildNotificationModel(followUpAction.getSettings(), feature);

        List<String> sendableAttributes = followUpAction.getPayload();
        sendableAttributes.forEach(attribute -> {
            sendAttributeData(schema, attribute, feature, notificationModel);
        });
    }

    private void sendAttributeData(SchemaDto schema,
                                   String attribute,
                                   Feature feature,
                                   TelegramNotificationModel notificationPayload) {
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

        ValueType type = ValueType.valueOf(oProperty.get().getValueType());
        ITelegramNotifier telegramNotifier = telegramNotifiers.get(type);
        if (telegramNotifier == null) {
            log.warn("Не найдена реализация отправителя для: {}", type);

            return;
        }

        telegramNotifier.notify(notificationPayload, feature, attribute);
    }

    private TelegramNotificationModel buildNotificationModel(Map<String, Object> settings, Feature feature) {
        String profileName;
        Object templateName;
        Object strategyName;
        try {
            profileName = settings.get(PROFILE_NAME).toString();
            templateName = settings.getOrDefault(TEMPLATE_NAME, null);
            strategyName = settings.getOrDefault(STRATEGY_NAME, null);
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Действие TelegramNotificator настроено неверно.\n" +
                            "В настройках отсутствует обязательный ключ [profileName]");
        }

        String chatId;
        try {
            chatId = feature.getProperties().get(CLIENT_ID).toString();
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Не возможно выполнить отправку! 'chat_id' не указан в профиле сервера." +
                            "Не удается найти 'client_id' в фиче");
        }

        TelegramNotificationModel model =
                new TelegramNotificationModel(
                        new NotificationPayload(profileName, chatId),
                        authenticationFacade.getLogin());

        model.setTemplateName(templateName == null ? null : templateName.toString());
        model.setStrategyName(strategyName == null ? null : strategyName.toString());

        return model;
    }

    @Override
    public String getType() {
        return "TelegramNotificator";
    }
}
