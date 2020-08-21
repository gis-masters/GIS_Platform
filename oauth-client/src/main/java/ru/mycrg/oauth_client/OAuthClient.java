package ru.mycrg.oauth_client;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import okhttp3.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Optional;

public class OAuthClient {

    private static final String TOKEN_PATH = "/oauth/token";

    private static final OkHttpClient httpClient = new OkHttpClient();

    private String clientId;
    private String clientSecret;

    private URL baseUrl;

    @Builder
    public OAuthClient(String clientId, String clientSecret, URL url) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = url;
    }

    public Optional<JwtToken> getToken(String userName, String password) throws OAuthClientException {
        try {
            RequestBody body = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("grant_type", "password")
                    .addFormDataPart("username", userName)
                    .addFormDataPart("password", password)
                    .build();

            Request request = new Request.Builder()
                    .url(new URL(baseUrl, TOKEN_PATH))
                    .header("Authorization", Credentials.basic(clientId, clientSecret))
                    .header("Content-type", "multipart/form-data")
                    .header("cache-control", "no-cache")
                    .post(body)
                    .build();

            return doRequest(request, "authorize by user/login");
        } catch (Exception e) {
            throw new OAuthClientException("Ошибка получения токена: " + e.getMessage(), e.getCause());
        }

    }

    /**
     * Получить новую пару access and refresh ключей по refresh токену.
     *
     * @param refreshToken Рефреш токен.
     * @return Новая пара ключей. {@link JwtToken}
     */
    public Optional<JwtToken> refreshToken(String refreshToken) throws OAuthClientException {
        try {
            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("grant_type", "refresh_token")
                    .addFormDataPart("refresh_token", refreshToken)
                    .build();

            Request request = new Request.Builder()
                    .url(new URL(baseUrl, TOKEN_PATH))
                    .addHeader("Authorization", "Basic YWRtaW46Z2Vvc2VydmVy")
                    .post(requestBody)
                    .build();

            return doRequest(request, "refreshToken");
        } catch (MalformedURLException e) {
            throw new OAuthClientException("Ошибка рефреша токена: " + e.getMessage(), e.getCause());
        }
    }

    private Optional<JwtToken> doRequest(Request request, String reason) {
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                // log.error("{} request failed: {}", reason, response.body().string());

                response.close();

                return Optional.empty();
            } else {
                // log.debug("Success authorize");

                ObjectMapper mapper = new ObjectMapper();
                JwtToken tokenHolder = mapper.readValue(response.body().string(), JwtToken.class);

                response.close();

                return Optional.of(tokenHolder);
            }
        } catch (IOException e) {
            // log.error("Cant execute request:", e);

            return Optional.empty();
        }
    }

}
