package ru.mycrg.http_client.handlers;

import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.http_client.config.RetryConfig;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.io.IOException;
import java.util.Objects;

import static java.lang.Thread.sleep;

public class RetryableRequestHandler implements IHttpRequestHandler {

    private final Logger log = LoggerFactory.getLogger(RetryableRequestHandler.class);

    private final RetryConfig config;
    private final IHttpRequestHandler requestHandler;

    public RetryableRequestHandler(IHttpRequestHandler requestHandler) {
        this.requestHandler = requestHandler;

        this.config = RetryConfig.builder().build();
    }

    public RetryableRequestHandler(IHttpRequestHandler requestHandler,
                                   RetryConfig config) {
        this.config = config;
        this.requestHandler = requestHandler;
    }

    @NotNull
    @Override
    public Response handle(Request request) throws IOException, HttpClientException {
        Response resultResponse = null;

        int currentAttempt = 0;
        do {
            currentAttempt++;

            try {
                Response response = requestHandler.handle(request);
                if (response.isSuccessful()) {
                    return response;
                }

                if (config.getRetryCodes().contains(response.code())) {
                    resultResponse = response;

                    log.debug("The request: {} will be retried. Attempt: {} of: {}",
                              request, currentAttempt, config.getMaxAttempts());

                    waitConfiguredTime();
                } else {
                    return response;
                }
            } catch (IOException e) {
                log.debug("Host unreachable request: {} will be retried. Attempt: {} of: {}",
                          request, currentAttempt, config.getMaxAttempts());

                if (currentAttempt > config.getMaxAttempts()) {
                    throw e;
                }

                waitConfiguredTime();
            }
        } while (currentAttempt < config.getMaxAttempts());

        return Objects.requireNonNull(resultResponse);
    }

    private void waitConfiguredTime() throws HttpClientException {
        try {
            sleep(config.getWaitDuration());
        } catch (InterruptedException e) {
            // Restore interrupted state...
            Thread.currentThread().interrupt();

            throw new HttpClientException("Something went wrong", e.getCause());
        }
    }
}
