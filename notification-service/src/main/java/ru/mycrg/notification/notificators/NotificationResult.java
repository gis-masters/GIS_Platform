package ru.mycrg.notification.notificators;

/**
 * Record для хранения результата отправки уведомления.
 * <p>
 * Содержит информацию об успешности отправки, сообщение об ошибке (если есть).
 *
 * @param success      флаг успешности отправки
 * @param errorMessage сообщение об ошибке (null, если отправка успешна)
 */
public record NotificationResult(boolean success,
                                 String errorMessage)
{

    /**
     * Создает успешный результат отправки с данными от провайдера
     *
     * @return объект NotificationResult с флагом success=true
     */
    public static NotificationResult successfully() {
        return new NotificationResult(true, null);
    }

    /**
     * Создает результат с ошибкой
     *
     * @param errorMessage сообщение об ошибке
     *
     * @return объект NotificationResult с флагом success=false
     */
    public static NotificationResult failed(String errorMessage) {
        return new NotificationResult(false, errorMessage);
    }
}
