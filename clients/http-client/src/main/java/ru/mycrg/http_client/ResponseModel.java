package ru.mycrg.http_client;

import okhttp3.Headers;
import okhttp3.Response;

public class ResponseModel<T> {

    private final int code;
    private final String msg;
    private final Headers headers;
    private final boolean successful;
    private T body;

    public ResponseModel(Response response) {
        this.code = response.code();
        this.msg = response.message();
        this.headers = response.headers();
        this.successful = response.isSuccessful();
    }

    public ResponseModel(Response response, String body) {
        this.code = response.code();
        this.msg = response.message();
        this.headers = response.headers();
        this.successful = response.isSuccessful();
        this.body = (T) body;
    }

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }

    public Headers getHeaders() {
        return headers;
    }

    public boolean isSuccessful() {
        return successful;
    }

    public T getBody() {
        return body;
    }

    public void setBody(T body) {
        this.body = body;
    }

    @Override
    public String toString() {
        return "ResponseModel{" +
                "code=" + code +
                ", msg='" + msg + '\'' +
                ", headers=" + headers +
                ", successful=" + successful +
                ", body=" + body +
                '}';
    }
}
