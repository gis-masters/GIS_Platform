package ru.mycrg.data_service.service.notification.client;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.MalformedURLException;
import java.net.URL;

import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.toJson;

@Component
public class NotificationServiceClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceClient.class);

    private final OkHttpClient okHttpClient;
    private final URL notificationServiceUrl;

    public NotificationServiceClient(Environment env) throws MalformedURLException {
        this.okHttpClient = new OkHttpClient();
        this.notificationServiceUrl =
                new URL(env.getRequiredProperty("crg-options.notification-service-url") + "/notifications");
    }

    public void notify(TelegramNotificationModel payload) throws NotificationClientException {
        Request request;
        try {
            request = new Request.Builder()
                    .url(notificationServiceUrl)
                    .post(RequestBody.create(DEFAULT_MEDIA_TYPE, toJson(payload)))
                    .build();
        } catch (Exception e) {
            String msg = "Не удалось сформировать уведомление для notification сервиса";
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new NotificationClientException(msg);
        }

        try (Response response = okHttpClient.newCall(request).execute()) {
            if (response.isSuccessful()) {
                log.debug("Сообщение успешно направлено в notification сервис");
            } else {
                String msg = "Не удалось передать уведомление notification сервису";
                log.error("{}: [statusCode: {} msg: '{}']", msg, response.code(), response.message());

                throw new NotificationClientException(msg);
            }
        } catch (Exception e) {
            String msg = "Что-то пошло не так при попытке передать уведомление notification сервису";
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new NotificationClientException(msg);
        }
    }
}
