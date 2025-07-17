package ru.mycrg.oauth_client;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.*;
import ru.mycrg.auth_service_contract.dto.IdNameProjection;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.common_contracts.specialization.Specialization;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.config.RetryConfig;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.http_client.handlers.IHttpRequestHandler;
import ru.mycrg.http_client.handlers.RetryableRequestHandler;

import java.io.IOException;
import java.net.URL;
import java.util.List;

public class OAuthClient {

    private static final String TOKEN_PATH = "/oauth/token";

    private final HttpClient httpClient;

    private final URL baseUrl;
    private final String clientId;
    private final String clientSecret;

    public OAuthClient(URL url, String clientId, String clientSecret) {
        this.baseUrl = url;
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        RetryConfig config = RetryConfig.builder()
                                        .maxAttempts(10)
                                        .waitDuration(60_000L)
                                        .build();
        IHttpRequestHandler requestHandler = new RetryableRequestHandler(
                new BaseRequestHandler(new OkHttpClient()),
                config
        );

        this.httpClient = new HttpClient(requestHandler);
    }

    public static OAuthClientBuilder builder() {
        return new OAuthClientBuilder();
    }

    public JwtToken getToken(String userName, String password) throws HttpClientException {
        return getToken(userName, password, null);
    }

    public JwtToken getToken(String userName, String password, String orgId) throws HttpClientException {
        try {
            RequestBody body = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("grant_type", "password")
                    .addFormDataPart("username", userName)
                    .addFormDataPart("password", password)
                    .addFormDataPart("orgId", orgId != null ? orgId : "")
                    .build();

            Request request = new Request.Builder()
                    .url(new URL(baseUrl, TOKEN_PATH))
                    .header("Authorization", Credentials.basic(clientId, clientSecret))
                    .header("Content-type", "multipart/form-data")
                    .header("cache-control", "no-cache")
                    .post(body)
                    .build();

            return httpClient.handleRequest(request, JwtToken.class)
                             .getBody();
        } catch (Exception e) {
            throw new HttpClientException("Ошибка получения токена: " + e.getMessage(), e.getCause());
        }
    }

    /**
     * Получить новую пару access and refresh ключей по refresh токену.
     *
     * @param refreshToken Рефреш токен.
     *
     * @param basicAuthAsBase64
     * @return Новая пара ключей. {@link JwtToken}
     */
    public JwtToken refreshToken(String refreshToken, String basicAuthAsBase64) throws HttpClientException {
        try {
            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("grant_type", "refresh_token")
                    .addFormDataPart("refresh_token", refreshToken)
                    .build();

            Request request = new Request.Builder()
                    .url(new URL(baseUrl, TOKEN_PATH))
                    .addHeader("Authorization", "Basic " + basicAuthAsBase64)
                    .post(requestBody)
                    .build();

            return httpClient.handleRequest(request, JwtToken.class)
                             .getBody();
        } catch (HttpClientException | IOException e) {
            throw new HttpClientException("Ошибка рефреша токена: " + e.getMessage(), e.getCause());
        }
    }

    public List<IdNameProjection> getUserOrganizations(String username) throws HttpClientException {
        try {
            Request request = new Request.Builder()
                    .url(new URL(baseUrl, "/users/organizations?login=" + username))
                    .addHeader("Content-Type", "application/json")
                    .get()
                    .build();

            ResponseModel<List<IdNameProjection>> response = httpClient
                    .handleRequest(request,
                                   new TypeReference<>() {
                                   });

            return response.getBody();
        } catch (HttpClientException | IOException e) {
            throw new HttpClientException("Ошибка выборки организаций для пользователя: " + username);
        }
    }

    public UserInfoModel getCurrentUser(String accessToken) throws HttpClientException {
        try {
            Request request = new Request.Builder()
                    .url(new URL(baseUrl, "/users/current"))
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .addHeader("Content-Type", "application/json")
                    .get()
                    .build();

            ResponseModel<UserInfoModel> response = httpClient.handleRequest(request, UserInfoModel.class);

            return response.getBody();
        } catch (HttpClientException | IOException e) {
            throw new HttpClientException("Ошибка получения текущего пользователя: ");
        }
    }

    public Specialization getSpecialization(Integer specId) throws HttpClientException {
        try {
            Request request = new Request.Builder()
                    .url(new URL(baseUrl, "/specializations/" + specId))
                    .get()
                    .build();

            ResponseModel<Specialization> response = httpClient.handleRequest(request, Specialization.class);

            return response.getBody();
        } catch (HttpClientException | IOException e) {
            String msg = String.format("Ошибка получения специализации: %d => %s", specId, e.getMessage());

            throw new HttpClientException(msg);
        }
    }

    public static class OAuthClientBuilder {

        private URL url;
        private String clientId;
        private String clientSecret;

        OAuthClientBuilder() {
            // Required
        }

        public OAuthClientBuilder url(URL url) {
            this.url = url;
            return this;
        }

        public OAuthClientBuilder clientId(String clientId) {
            this.clientId = clientId;
            return this;
        }

        public OAuthClientBuilder clientSecret(String clientSecret) {
            this.clientSecret = clientSecret;
            return this;
        }

        public OAuthClient build() {
            return new OAuthClient(url, clientId, clientSecret);
        }

        public String toString() {
            return "OAuthClient(" +
                    "url=" + this.url + ", " +
                    "clientId=" + this.clientId + ", " +
                    "clientSecret=" + this.clientSecret + ")";
        }
    }
}
