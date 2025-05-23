package ru.mycrg.data_service.service.notifiers.telegram;

import okhttp3.*;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static okhttp3.MultipartBody.FORM;

@Component
public class TelegramMessageSender {

    private static final Logger log = LoggerFactory.getLogger(TelegramMessageSender.class);

    private final OkHttpClient okHttpClient;
    private final ExecutorService executorService;

    public TelegramMessageSender() {
        this.okHttpClient = new OkHttpClient();
        this.executorService = Executors.newCachedThreadPool();
    }

    public void sendMessage(@NotNull String token,
                            @NotNull String msg,
                            @NotNull String chatId,
                            String messageThreadId) {
        MultipartBody.Builder builder = new MultipartBody.Builder().setType(FORM);
        if (messageThreadId != null) {
            builder.addFormDataPart("message_thread_id", messageThreadId);
        }

        RequestBody payload = builder.addFormDataPart("chat_id", chatId)
                                     .addFormDataPart("text", msg)
                                     .build();

        Request request = new Request.Builder()
                .url("https://api.telegram.org/bot" + token + "/sendMessage")
                .post(payload)
                .build();

        sendAsync(chatId, messageThreadId, request);
    }

    public void sendDocument(@NotNull String token,
                             @NotNull File file,
                             @NotNull String chatId,
                             String messageThreadId) {
        MultipartBody.Builder builder = new MultipartBody.Builder().setType(FORM);
        if (messageThreadId != null) {
            builder.addFormDataPart("message_thread_id", messageThreadId);
        }

        RequestBody body = RequestBody.create(MediaType.parse("application/octet-stream"), file);
        RequestBody payload = builder.addFormDataPart("chat_id", chatId)
                                     .addFormDataPart("document", file.getName(), body)
                                     .build();

        Request request = new Request.Builder()
                .url("https://api.telegram.org/bot" + token + "/sendDocument")
                .post(payload)
                .build();

        sendAsync(chatId, messageThreadId, request);
    }

    private void sendAsync(@NotNull String chatId, String messageThreadId, Request request) {
        executorService.submit(() -> {
            try (Response response = okHttpClient.newCall(request).execute()) {
                if (response.isSuccessful()) {
                    log.debug("Сообщение успешно отправлено в телеграмм: [chat_id: {}, message_thread_id: {}]",
                              chatId, messageThreadId);
                } else {
                    log.error("Сообщение в телеграмм не доставлено: [statusCode: {} msg: '{}']",
                              response.code(), response.message());
                }
            } catch (Exception e) {
                log.error("Не удалось отправить файл в телеграмм. => {}", e.getMessage(), e);
            }
        });
    }}
