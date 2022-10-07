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
import java.lang.reflect.Type;
import java.net.URL;

public class HttpClient {

    private static final Gson gson = new Gson();

    private final Logger log = LoggerFactory.getLogger(HttpClient.class);

    private final IHttpRequestHandler requestHandler;

    public HttpClient(IHttpRequestHandler requestHandler) {
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
                T bodyM = readBody(type, body);
                if (bodyM != null) {
                    model.setBody(bodyM);
                }

                return model;
            } else {
                log.error("Request failed: {} / RequestBody: '{}'", response, body);

                return new ResponseModel<>(response, body);
            }
        } catch (IOException e) {
            String msg = "Host unreachable. Reason: " + e.getMessage();

            throw new HttpClientException(msg, e);
        } catch (Exception e) {
            String msg = "Failed to handle request. Reason: " + e.getMessage();

            throw new HttpClientException(msg, e);
        }
    }

    public <T> ResponseModel<T> handleRequest(Request request, Type type) throws HttpClientException {
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
                log.error("Request failed: {} / Body: {}", response, body);

                return new ResponseModel<>(response);
            }
        } catch (IOException e) {
            throw new HttpClientException("Host unreachable", e.getCause());
        }
    }

    public ResponseModel<Object> handleRequest(Request request) throws HttpClientException {
        return handleRequest(request, Object.class);
    }

    public <T> ResponseModel<T> get(URL url, Class<T> type) throws HttpClientException {
        Request request = new Request.Builder().url(url)
                                               .get().build();

        return handleRequest(request, type);
    }

    public IHttpRequestHandler getRequestHandler() {
        return requestHandler;
    }

    private <T> T readBody(Class<T> type, String body) {
        try {
            return gson.fromJson(body, type);
        } catch (Exception e) {
            log.error("Response body is not valid! Body is {}", body);

            return null;
        }
    }
}
