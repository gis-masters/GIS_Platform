package ru.mycrg.notification.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import ru.mycrg.notification.domain.notification.dto.NotificationRequestDto;
import ru.mycrg.notification.domain.notification.models.NotificationType;
import ru.mycrg.notification.domain.notification.models.payload.EmailPayload;
import ru.mycrg.notification.domain.notification.models.payload.TelegramPayload;
import tools.jackson.databind.ObjectMapper;

import static ru.mycrg.notification.domain.notification.models.NotificationType.EMAIL;
import static ru.mycrg.notification.domain.notification.models.NotificationType.TELEGRAM;

public class NotificationPayloadValidator implements ConstraintValidator<ValidNotificationPayload, NotificationRequestDto> {

    private static final Logger log = LoggerFactory.getLogger(NotificationPayloadValidator.class);

    private final ObjectMapper objectMapper;

    @Autowired
    public NotificationPayloadValidator(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean isValid(NotificationRequestDto requestDto, ConstraintValidatorContext context) {
        // Если payload или тип не указаны, то валидация не пройдена
        // (но это должно быть проверено другими аннотациями @NotNull)
        if (requestDto.getPayload() == null || requestDto.getType() == null) {
            return true; // Пропускаем валидацию, если поля null - их проверят другие валидаторы
        }

        // Проверяем, соответствует ли payload типу уведомления
        if (!isValidPayload(requestDto.getType(), requestDto.getPayload())) {
            String errorMessage = "Некорректный формат payload для типа " + requestDto.getType();
            addConstraintViolation(context, errorMessage);

            return false;
        }

        return true;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
               .addPropertyNode("payload")  // Указываем, что ошибка относится к полю payload
               .addConstraintViolation();
    }

    private boolean isValidPayload(NotificationType type, Object payload) {
        if (payload == null || type == null) {
            return false;
        }

        // Логируем тип payload для отладки
        log.debug("Payload class: {}", payload.getClass().getName());
        log.debug("Payload content: {}", payload);

        try {
            // Проверяем соответствие типа payload типу уведомления
            if (type == TELEGRAM) {
                // Пытаемся преобразовать payload в TelegramPayload
                TelegramPayload telegramPayload = objectMapper.convertValue(payload, TelegramPayload.class);

                if (telegramPayload.getProps().isEmpty()) {
                    return false;
                }

                // Проверяем наличие необходимых полей
                if (telegramPayload.getChatId() == null || telegramPayload.getProfileName() == null) {
                    log.error("TelegramPayload is missing required fields: chatId={}, profileName={}",
                              telegramPayload.getChatId(), telegramPayload.getProfileName());

                    return false;
                }

                return true;
            } else if (type == EMAIL) {
                // Пытаемся преобразовать payload в EmailPayload
                EmailPayload emailPayload = objectMapper.convertValue(payload, EmailPayload.class);

                if (emailPayload.getProps().isEmpty()) {
                    return false;
                }

                // Проверяем наличие необходимых полей
                if (emailPayload.getEmail() == null) {
                    log.error("EmailPayload is missing required field: email={}", emailPayload.getEmail());

                    return false;
                }

                return true;
            }
        } catch (Exception e) {
            log.error("Error converting payload to appropriate type for {}: {}", type, e.getMessage());

            return false;
        }

        return false;
    }
}
