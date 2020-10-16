package ru.mycrg.oauth_client;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Optional;

public class OAuthClient {

    private static final Logger log = LoggerFactory.getLogger(OAuthClient.class);

    private static final String TOKEN_PATH = "/oauth/token";

    private static final OkHttpClient httpClient = new OkHttpClient();

    private final URL baseUrl;
    private final String clientId;
    private final String clientSecret;

    @Builder
    public OAuthClient(URL url, String clientId, String clientSecret) {
        this.baseUrl = url;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public Optional<JwtToken> getToken(String userName, String password) {
        log.debug("OAuthClient get token");

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

            return doRequest(request);
        } catch (Exception e) {
            log.error("Ошибка получения токена: {}" + e.getMessage());

            return Optional.empty();
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

            return doRequest(request);
        } catch (MalformedURLException e) {
            throw new OAuthClientException("Ошибка рефреша токена: " + e.getMessage(), e.getCause());
        }
    }

    private Optional<JwtToken> doRequest(Request request) {
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.error("Request failed: {}", response.body().string());

                return Optional.empty();
            } else {
                ObjectMapper mapper = new ObjectMapper();
                JwtToken tokenHolder = mapper.readValue(response.body().string(), JwtToken.class);

                return Optional.of(tokenHolder);
            }
        } catch (IOException e) {
             log.error("Cant execute request:", e);

            return Optional.empty();
        }
    }
}
