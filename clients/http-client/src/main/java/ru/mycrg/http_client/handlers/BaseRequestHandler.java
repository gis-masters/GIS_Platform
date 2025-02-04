package ru.mycrg.http_client.handlers;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;

import java.io.IOException;

public class BaseRequestHandler implements IHttpRequestHandler {

    private final OkHttpClient client;

    public BaseRequestHandler(OkHttpClient client) {
        this.client = client;
    }

    @NotNull
    @Override
    public Response handle(Request request) throws IOException {
        return client.newCall(request).execute();
    }
}
