package ru.mycrg.http_client.exceptions;

import org.jetbrains.annotations.Nullable;
import ru.mycrg.http_client.ResponseModel;

public class HttpClientException extends Exception {

    private ResponseModel<Object> response = null;

    public HttpClientException(String msg, Throwable throwable) {
        super(msg, throwable);
    }

    public HttpClientException(String msg) {
        super(msg);
    }

    public HttpClientException(String msg, ResponseModel<Object> response) {
        super(msg);

        this.response = response;
    }

    @Nullable
    public ResponseModel<Object> getResponse() {
        return response;
    }
}
