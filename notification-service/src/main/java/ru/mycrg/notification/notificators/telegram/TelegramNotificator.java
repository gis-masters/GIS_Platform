package ru.mycrg.notification.notificators.telegram;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.telegram.telegrambots.meta.api.methods.send.SendDocument;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.message.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.exceptions.TelegramApiRequestException;
import org.telegram.telegrambots.meta.generics.TelegramClient;
import ru.mycrg.notification.config.TelegramProperties;
import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.NotificationType;
import ru.mycrg.notification.domain.notification.models.Property;
import ru.mycrg.notification.domain.notification.models.PropertyType;
import ru.mycrg.notification.domain.template.TemplateHandler;
import ru.mycrg.notification.notificators.INotificator;
import ru.mycrg.notification.notificators.NotificationResult;

import java.io.File;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import static ru.mycrg.notification.domain.notification.models.NotificationType.TELEGRAM;
import static ru.mycrg.notification.notificators.NotificationResult.failed;
import static ru.mycrg.notification.notificators.NotificationResult.successfully;

@Component
public class TelegramNotificator implements INotificator {

    private final Logger log = LoggerFactory.getLogger(TelegramNotificator.class);

    private final TelegramProperties telegramProperties;
    private final TemplateHandler templateHandler;
    private final Map<String, TelegramClient> clientCache = new ConcurrentHashMap<>();

    public TelegramNotificator(TelegramProperties telegramProperties,
                               TemplateHandler templateHandler) {
        this.telegramProperties = telegramProperties;
        this.templateHandler = templateHandler;
    }

    public Optional<NotificationResult> send(NotificationEntity notification) {
        String chatId = notification.getChatId();
        if (chatId == null) {
            throw new IllegalArgumentException("Не указан chatId для отправки Telegram-уведомления");
        }

        String profileName = notification.getProfileName();
        if (profileName == null) {
            throw new IllegalArgumentException("Не указан profileName для отправки Telegram-уведомления");
        }

        Optional<Property> oFirstProp = notification.getProps().stream().findFirst();
        if (oFirstProp.isEmpty()) {
            throw new IllegalArgumentException("Свойства не заполнены");
        }

        try {
            TelegramClient telegramClient = getTelegramClient(profileName);

            Message response = sendMessage(telegramClient, notification, oFirstProp.get(), chatId);

            log.info("Уведомление с ID {} успешно отправлено в Telegram (профиль: {}), message_id: {}",
                     notification.getId(), profileName, response.getMessageId());

            return Optional.of(successfully());
        } catch (TelegramApiException e) {
            String apiResponse = "Что-то пошло не так";
            try {
                apiResponse = ((TelegramApiRequestException) e).getApiResponse();
            } catch (Exception ex) {
                if (e.getCause() != null && e.getCause().getMessage() != null) {
                    apiResponse = e.getCause().getMessage();
                }
            }

            log.error("Ошибка Telegram API для уведомления с ID {} (профиль: {}), сообщение: {}",
                      notification.getId(), profileName, apiResponse);

            return Optional.of(failed(apiResponse));
        } catch (Exception e) {
            String errorMessage = String.format("Непредвиденная ошибка (%s): %s",
                                                e.getClass().getName(), e.getMessage());

            log.error(" {} при отправке уведомления с ID {} (профиль: {})",
                      errorMessage, notification.getId(), profileName, e);

            return Optional.of(failed(errorMessage));
        }
    }

    @NotNull
    private Message sendMessage(TelegramClient telegramClient,
                                NotificationEntity notification,
                                Property property,
                                String chatId) throws TelegramApiException {
        PropertyType type = property.getType();
        switch (type) {
            case STRING -> {
                Optional<String> oMsg = templateHandler.prepareMessage(notification);
                if (oMsg.isEmpty()) {
                    throw new IllegalArgumentException("Не удалось сформировать сообщение для");
                }

                SendMessage msg = SendMessage.builder()
                                             .chatId(chatId)
                                             .text(oMsg.get())
                                             .parseMode("HTML")
                                             .build();

                return telegramClient.execute(msg);
            }
            case FILE -> {
                String pathToFile = property.getValue();

                SendDocument msg = SendDocument.builder()
                                               .chatId(chatId)
                                               // .caption("fiz-caption")
                                               .document(new InputFile(new File(pathToFile)))
                                               .build();

                return telegramClient.execute(msg);
            }
            default -> {
                throw new IllegalStateException("Не найден отправитель для типа: " + type);
            }
        }
    }

    private TelegramClient getTelegramClient(String profileName) {
        return clientCache.computeIfAbsent(profileName, name -> {
            String token = telegramProperties.getTokenByProfileName(name);

            if (token == null) {
                throw new IllegalStateException("Заданный профиль не существует на сервере: " + profileName);
            }

            return new OkHttpTelegramClient(token);
        });
    }

    @Override
    public NotificationType getType() {
        return TELEGRAM;
    }
}
