package ru.mycrg.notification.notificators.telegram;

/**
 * Свойства для настройки Telegram-уведомлений
 * 
 * @param chatId ID чата для отправки уведомлений
 * @param token Токен Telegram-бота
 * @param messageThreadId ID треда сообщений (опционально)
 */
public record TelegramNotificationProperties(
    String chatId,
    String token,
    String messageThreadId
) {
    /**
     * Конструктор без параметров для совместимости с фреймворками
     */
    public TelegramNotificationProperties() {
        this(null, null, null);
    }

    @Override
    public String toString() {
        return "{" +
                "\"chatId\":" + (chatId == null ? "null" : "\"" + chatId + "\"") + ", " +
                "\"token\":" + (token == null ? "null" : "\"" + token + "\"") + ", " +
                "\"messageThreadId\":" + (messageThreadId == null ? "null" : "\"" + messageThreadId + "\"") +
                "}";
    }
}
