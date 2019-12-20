package ru.mycrg.oauth_client;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import okhttp3.*;

public class OAuthClient {

    private static ObjectMapper mapper = new ObjectMapper();
    private static OkHttpClient httpClient = new OkHttpClient();

    private String clientId;
    private String clientSecret;

    private String baseUrl;

    @Builder
    public OAuthClient(String clientId, String clientSecret, String host, int port) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this.baseUrl = "http://" + host + ":" + port + "/oauth/token";
    }

    public JwtToken getJwtToken(String userName, String password) throws OAuthClientException {
        JwtToken jwtToken;

        try {
            MediaType mediaType = MediaType.parse("multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
            RequestBody body = RequestBody.create(mediaType, "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                    "Content-Disposition: form-data; name=\"grant_type\"\r\n\r\npassword\r\n" +
                    "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                    "Content-Disposition: form-data; name=\"username\"\r\n\r\n" + userName
                    + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                    "Content-Disposition: form-data; name=\"password\"\r\n\r\n" + password
                    + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--");

            Request request = new Request.Builder()
                    .url(baseUrl)
                    .header("Authorization", Credentials.basic(clientId, clientSecret))
                    .header("Content-type", "multipart/form-data")
                    .header("cache-control", "no-cache")
                    .post(body)
                    .build();

            Response response = httpClient.newCall(request).execute();

            jwtToken = mapper.readValue(response.body().string(), JwtToken.class);

            response.close();

            return jwtToken;
        } catch (Exception e) {
            throw new OAuthClientException("Failed get token: " + e.getMessage(), e.getCause());
        }
    }

}
