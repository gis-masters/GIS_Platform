package ru.mycrg.http_client;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.IHttpRequestHandler;

import java.io.IOException;
import java.net.URL;

import static ru.mycrg.http_client.JsonConverter.fromJson;

public class HttpClient {

    private final Logger log = LoggerFactory.getLogger(HttpClient.class);

    private final IHttpRequestHandler requestHandler;

    public HttpClient(IHttpRequestHandler requestHandler) {
        this.requestHandler = requestHandler;
    }

    public ResponseModel<String> handleRequestAsString(Request request) throws HttpClientException {
        try (Response response = requestHandler.handle(request)) {
            final ResponseBody responseBody = response.body();
            if (responseBody == null) {
                throw new HttpClientException("Incorrect body");
            }

            String body = responseBody.string();
            if (response.isSuccessful()) {
                ResponseModel<String> model = new ResponseModel<>(response);
                model.setBody(body);

                return model;
            } else {
                log.error("RequestAsString failed: {} / RequestBody: '{}'", response, body);

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

    public <T> ResponseModel<T> handleRequest(Request request, Class<T> clazz) throws HttpClientException {
        try (Response response = requestHandler.handle(request)) {
            final ResponseBody responseBody = response.body();
            if (responseBody == null) {
                throw new HttpClientException("Incorrect body");
            }

            String body = responseBody.string();
            if (response.isSuccessful()) {
                ResponseModel<T> model = new ResponseModel<>(response);
                fromJson(body, clazz)
                        .ifPresent(model::setBody);

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

    public <T> ResponseModel<T> handleRequest(Request request, TypeReference<T> typeReference)
            throws HttpClientException {
        try (Response response = requestHandler.handle(request)) {
            final ResponseBody responseBody = response.body();
            if (responseBody == null) {
                throw new HttpClientException("Incorrect body");
            }

            String body = responseBody.string();
            if (response.isSuccessful()) {
                ResponseModel<T> model = new ResponseModel<>(response);
                fromJson(body, typeReference)
                        .ifPresent(model::setBody);

                return model;
            } else {
                log.error("Request failed: {} / Body: {}", response, body);

                return new ResponseModel<>(response);
            }
        } catch (IOException e) {
            String msg = "Host unreachable. Reason: " + e.getMessage();

            throw new HttpClientException(msg, e);
        } catch (Exception e) {
            String msg = "Failed to handle request. Reason: " + e.getMessage();

            throw new HttpClientException(msg, e);
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
}
