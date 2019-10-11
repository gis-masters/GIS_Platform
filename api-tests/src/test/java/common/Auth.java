package common;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;

import java.io.IOException;

import static org.junit.Assert.assertNotNull;

public class Auth {

    public static JWTTokenHolder getJwtToken(String host, int port, String userName, String pass) throws IOException {
        JWTTokenHolder jwtTokenHolder;

        MediaType mediaType = MediaType.parse("multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
        RequestBody body = RequestBody.create(mediaType, "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"grant_type\"\r\n\r\npassword\r\n" +
                "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"username\"\r\n\r\n" + userName
                + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"password\"\r\n\r\n" + pass
                + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--");
        Request request = new Request.Builder()
                .url(host + ":" + port + "/oauth/token")
                .header("Authorization", Credentials.basic(userName, pass))
                .header("Content-type", "multipart/form-data")
                .header("cache-control", "no-cache")
                .post(body)
                .build();

        OkHttpClient httpClient = new OkHttpClient();
        Response response = httpClient.newCall(request).execute();

        ObjectMapper mapper = new ObjectMapper();
        jwtTokenHolder = mapper.readValue(response.body().string(), JWTTokenHolder.class);

        response.close();

        assertNotNull(jwtTokenHolder);

        return jwtTokenHolder;
    }

}
