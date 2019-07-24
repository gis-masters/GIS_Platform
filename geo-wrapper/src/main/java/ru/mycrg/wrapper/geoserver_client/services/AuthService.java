package ru.mycrg.wrapper.geoserver_client.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.JWTTokenHolder;

import java.io.IOException;
import java.util.Optional;

@Service
public class AuthService extends GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private JWTTokenHolder jwtTokenHolder;

    // TODO: Сечас при каждом обращении сюда мы получаем новый токен,
    // а стоило бы следить за полученным токеном и обновлять его при необходимости используя рефреш
    public Optional authorize() throws IOException {
        String username = getRootUser();
        String password = getRootPassword();

        log.info("Try authorize by url: {} / user: {}", "http://" + geoserverHost() +"/oauth/token", username);

        MediaType mediaType = MediaType.parse("multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
        RequestBody body = RequestBody.create(mediaType, "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"grant_type\"\r\n\r\npassword\r\n" +
                "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"username\"\r\n\r\n" + username
                + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"password\"\r\n\r\n" + password
                + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--");

        Request request = new Request.Builder()
                .url("http://" + geoserverHost() +"/oauth/token")
                .header("Authorization", simpleCredential())
                .header("Content-type", "multipart/form-data")
                .header("cache-control", "no-cache")
                .post(body)
                .build();

        Response response = httpClient.newCall(request).execute();
        if (!response.isSuccessful()) {
            log.error("Failed authorization: {}", response.body().string());

            response.close();
            return Optional.empty();
        } else {
            ObjectMapper mapper = new ObjectMapper();
            jwtTokenHolder = mapper.readValue(response.body().string(), JWTTokenHolder.class);

            log.debug("Success");
            response.close();
            return Optional.of(true);
        }
    }

    public JWTTokenHolder getJwtTokenHolder() {
        return jwtTokenHolder;
    }
}
