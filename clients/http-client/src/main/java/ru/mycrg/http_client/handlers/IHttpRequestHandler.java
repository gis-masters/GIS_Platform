package ru.mycrg.http_client.handlers;

import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.io.IOException;

public interface IHttpRequestHandler {

    @NotNull
    Response handle(Request request) throws HttpClientException, IOException;
}
