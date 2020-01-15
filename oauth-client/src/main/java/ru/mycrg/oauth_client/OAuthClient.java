package ru.mycrg.oauth_client;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;

public class OAuthClient {

    private static final Logger log = LoggerFactory.getLogger(OAuthClient.class);
    private static final String TOKEN_PATH = "/oauth/token";

    private static ObjectMapper mapper = new ObjectMapper();
    private static OkHttpClient httpClient = new OkHttpClient();

    private String clientId;
    private String clientSecret;

    private URL baseUrl;

    @Builder
    public OAuthClient(String clientId, String clientSecret, URL url) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = url;
    }

    public JwtToken getJwtToken(String userName, String password) throws OAuthClientException, MalformedURLException {
        log.debug("getJwtToken by: {} for user: {}", baseUrl, userName);

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

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new OAuthClientException(response.body().string());

            return mapper.readValue(response.body().string(), JwtToken.class);
        } catch (Exception e) {
            throw new OAuthClientException("Failed get token: " + e.getMessage(), e.getCause());
        }

    }

}
