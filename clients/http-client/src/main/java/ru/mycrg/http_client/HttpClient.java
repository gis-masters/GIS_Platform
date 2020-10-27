package ru.mycrg.http_client;

import com.google.gson.Gson;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.IHttpRequestHandler;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

public class HttpClient {

    public static final Logger log = LoggerFactory.getLogger(HttpClient.class);

    private static final Gson gson = new Gson();
    private final URL baseUrl;
    private final IHttpRequestHandler requestHandler;

    public HttpClient(URL url, IHttpRequestHandler requestHandler) {
        this.baseUrl = url;
        this.requestHandler = requestHandler;
    }

    public <T> ResponseModel<T> handleRequest(Request request, Class<T> type) throws HttpClientException {
        try (Response response = requestHandler.handle(request)) {
            final ResponseBody responseBody = response.body();
            if (responseBody == null) {
                throw new HttpClientException("Incorrect body");
            }

            String body = responseBody.string();
            if (response.isSuccessful()) {
                ResponseModel<T> model = new ResponseModel<>(response);
                model.setBody(gson.fromJson(body, type));

                return model;
            } else {
                log.error("Request failed: {}", response);

                return new ResponseModel<>(response);
            }
        } catch (IOException e) {
            throw new HttpClientException("Host unreachable", e.getCause());
        }
    }

    public void handleRequest(Request request) throws HttpClientException {
        handleRequest(request, Object.class);
    }

    public <T> ResponseModel<T> get(String path, Class<T> type) throws HttpClientException {
        final URL url;
        try {
            url = new URL(baseUrl, path);
        } catch (MalformedURLException e) {
            throw new HttpClientException("Failed build URL: ", e.getCause());
        }

        Request request = new Request.Builder().url(url)
                                               .get().build();

        return handleRequest(request, type);
    }
}
