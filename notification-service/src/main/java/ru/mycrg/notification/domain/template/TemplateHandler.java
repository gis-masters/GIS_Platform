package ru.mycrg.notification.domain.template;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.Property;
import ru.mycrg.notification.domain.notification.models.payload.EmailPayload;
import ru.mycrg.notification.domain.notification.models.payload.TelegramPayload;
import ru.mycrg.notification.domain.template.entity.TemplateEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Обработчик шаблонов для подготовки сообщений
 */
@Component
public class TemplateHandler {

    private static final Logger log = LoggerFactory.getLogger(TemplateHandler.class);

    private static final Pattern PLACEHOLDER_PATTERN = Pattern.compile("\\{([^}]+)\\}");

    /**
     * Подготавливает сообщение на основе шаблона и данных из уведомления
     *
     * @param notification уведомление с данными
     *
     * @return подготовленное сообщение
     */
    public Optional<String> prepareMessage(NotificationEntity notification) {
        // Если есть шаблон, используем его
        TemplateEntity template = notification.getTemplate();
        if (template != null) {
            String templateContent = template.getContent();
            Map<String, String> placeholders = extractPlaceholders(notification);

            return Optional.of(replacePlaceholders(templateContent, placeholders));
        }

        // Если шаблона нет, но есть props, форматируем их как "value"
        List<Property> props = notification.getProps();
        String formattedProps = formatProps(props);
        if (!formattedProps.isEmpty()) {
            return Optional.of(formattedProps);
        }

        return Optional.empty();
    }

    /**
     * Форматирует список свойств в строку вида "value1_value2"
     */
    private String formatProps(List<Property> props) {
        if (props == null || props.isEmpty()) {
            return "";
        }

        StringBuilder result = new StringBuilder();
        for (Property prop: props) {
            if (prop.getName() != null && prop.getValue() != null) {
                if (!result.isEmpty()) {
                    result.append("\n");
                }

                result.append(prop.getValue()).append(" ");
            }
        }

        return result.toString().trim();
    }

    /**
     * Извлекает значения плейсхолдеров из уведомления
     *
     * @param notification уведомление с данными
     *
     * @return карта с плейсхолдерами и их значениями
     */
    private Map<String, String> extractPlaceholders(NotificationEntity notification) {
        Map<String, String> placeholders = new HashMap<>();

        // Получаем типизированный payload
        var typedPayload = notification.getTypedPayload();
        if (typedPayload == null) {
            throw new IllegalStateException("Failed to get typed payload for notification: " + notification.getId());
        }

        // Добавляем props из типизированного payload
        List<Property> props = typedPayload.getProps();
        if (props != null) {
            for (Property prop: props) {
                if (prop.getName() != null && prop.getValue() != null) {
                    placeholders.put(prop.getName(), prop.getValue());
                }
            }
        }

        // Добавляем специфичные поля в зависимости от типа payload
        if (typedPayload instanceof TelegramPayload telegramPayload) {
            if (telegramPayload.getProfileName() != null) {
                placeholders.put("profileName", telegramPayload.getProfileName());
            }
            if (telegramPayload.getChatId() != null) {
                placeholders.put("chatId", telegramPayload.getChatId());
            }
        } else if (typedPayload instanceof EmailPayload emailPayload) {
            if (emailPayload.getEmail() != null) {
                placeholders.put("email", emailPayload.getEmail());
            }
            if (emailPayload.getSubject() != null) {
                placeholders.put("subject", emailPayload.getSubject());
            }
        }

        // Логируем найденные плейсхолдеры для отладки
        log.debug("Extracted placeholders: {}", placeholders);

        return placeholders;
    }

    /**
     * Заменяет плейсхолдеры в шаблоне на их значения
     *
     * @param template     шаблон сообщения
     * @param placeholders карта с плейсхолдерами и их значениями
     *
     * @return подготовленное сообщение
     */
    private String replacePlaceholders(String template, Map<String, String> placeholders) {
        if (template == null || template.isEmpty()) {
            return "";
        }

        Matcher matcher = PLACEHOLDER_PATTERN.matcher(template);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String placeholder = matcher.group(1);
            String replacement = placeholders.getOrDefault(placeholder, matcher.group(0));
            matcher.appendReplacement(result, Matcher.quoteReplacement(replacement));
        }

        matcher.appendTail(result);

        return result.toString();
    }
}
