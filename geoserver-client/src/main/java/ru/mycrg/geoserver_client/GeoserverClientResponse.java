package ru.mycrg.geoserver_client;

import okhttp3.Response;

import java.io.IOException;

public class GeoserverClientResponse {

    private int code;
    private String msg;
    private String body;
    private boolean successful;

    public GeoserverClientResponse() {
    }

    public GeoserverClientResponse(Response response) throws IOException {
        this.body = response.body().string();
        this.code = response.code();
        this.msg = response.message();
        this.successful = response.isSuccessful();
    }

    public GeoserverClientResponse(String message) {
        this.code = 500;
        this.msg = message;
        this.successful = false;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public boolean isSuccessful() {
        return successful;
    }

    public void setSuccessful(boolean successful) {
        this.successful = successful;
    }

    public boolean isNotFound() {
        return this.code == 404;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    @Override
    public String toString() {
        return "GeoserverClientResponse{" +
                "code=" + code +
                ", msg='" + msg + '\'' +
                ", body='" + body + '\'' +
                ", successful=" + successful +
                '}';
    }
}
