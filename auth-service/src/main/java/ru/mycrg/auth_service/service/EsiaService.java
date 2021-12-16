package ru.mycrg.auth_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.dto.esia.EsiaJWT;
import ru.mycrg.auth_service_contract.dto.esia.EsiaUserInfo;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import static ru.mycrg.auth_service.AuthJWTApplication.mapper;

@Service
public class EsiaService {

    private final Logger log = LoggerFactory.getLogger(EsiaService.class);

    private final URL ESIA_SERV;
    private final String ESIA_CODE_POINT = "/aas/oauth2/ac";
    private final String ESIA_TOKEN_POINT = "/aas/oauth2/te";
    private final String ESIA_USER_INFO = "/rs/prns/"; // Сервис получения персональных данных пользователя
    private final String ESIA_ORG_INFO = "/rs/orgs"; // Сервис получения данных организации
    private final String ESIA_SBJS_INFO = "/rs/sbjs"; // Сервис получения данных о субъекте

    private final String CLIENT_ID;
    private final String SCOPE;
    private final String ACCESS_TYPE;

    private final HttpClient httpClient;

    private final Pkcs7Util pkcs7Util;

    public EsiaService(Pkcs7Util pkcs7Util,
                       Environment environment) throws MalformedURLException {
        this.pkcs7Util = pkcs7Util;

        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));

        ESIA_SERV = new URL(environment.getRequiredProperty("esia.url"));
        CLIENT_ID = environment.getRequiredProperty("esia.client_id");

        ACCESS_TYPE = "online";
        SCOPE = "openid email fullname";
    }

    public String authorize(String state, String redirect) throws MalformedURLException {
        String timestamp = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss Z").format(new Date());
        String clientSecret = pkcs7Util.generateClientSecret(SCOPE, timestamp, CLIENT_ID, state);

        log.debug("clientSecret: {}", clientSecret);

        return HttpUrl.get(new URL(ESIA_SERV, ESIA_CODE_POINT)).newBuilder()
                      .addQueryParameter("client_id", CLIENT_ID)
                      .addQueryParameter("client_secret", clientSecret)
                      .addQueryParameter("access_type", ACCESS_TYPE)
                      .addQueryParameter("response_type", "code")
                      .addQueryParameter("scope", SCOPE)
                      .addQueryParameter("state", state)
                      .addQueryParameter("timestamp", timestamp)
                      .addQueryParameter("redirect_uri", redirect)
                      .build()
                      .toString();
    }

    public Optional<EsiaUserInfo> getUser(String redirect,
                                          String code,
                                          String state) {
        try {
            EsiaUserInfo userInfo;

            EsiaJWT esiaJWT = tradeCodeForToken(redirect, code, state);
            String accessToken = esiaJWT.getAccess_token();

            String userSbjId = getUserSbjId(accessToken);
            userInfo = getUserInfo(accessToken, userSbjId);
            userInfo.setSbjId(userSbjId);

            return Optional.of(userInfo);
        } catch (Exception e) {
            log.error("Не удалось авторизоваться через портал госуслуг. State: {}. Reason: {}",
                      state, e.getMessage());

            return Optional.empty();
        }
    }

    private EsiaUserInfo getUserInfo(String accessToken, String userSbjId)
            throws MalformedURLException, HttpClientException {
        EsiaUserInfo userInfo = new EsiaUserInfo();

        getUserFio(accessToken, userSbjId, userInfo);
        String userId = getUserId(accessToken, userSbjId);
        userInfo.setId(userId);
        getUserEmail(accessToken, userSbjId, userId, userInfo);

        return userInfo;
    }

    private void getUserEmail(String accessToken, String userSbjId, String userId, EsiaUserInfo userInfo)
            throws MalformedURLException, HttpClientException {
        URL getUserEmail = new URL(ESIA_SERV, ESIA_USER_INFO + userSbjId + "/ctts/" + userId);

        log.debug("Get user eMail URL: {}", getUserEmail);

        Request request = new Request.Builder()
                .url(getUserEmail)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Bearer " + accessToken)
                .get()
                .build();

        ResponseModel<HashMap> response = httpClient.handleRequest(request, HashMap.class);
        if (response.isSuccessful()) {
            Map<String, Object> body = response.getBody();

            userInfo.setEmail(body.get("value").toString());
        } else {
            String msg = String.format("Failed to get user id: Code: %d Msg: %s",
                                       response.getCode(), response.getMsg());
            log.error(msg);

            throw new IllegalStateException(msg);
        }
    }

    private String getUserId(String accessToken, String userSbjId)
            throws MalformedURLException, HttpClientException {
        URL getUserId = new URL(ESIA_SERV, ESIA_USER_INFO + userSbjId + "/ctts");

        log.debug("Get user id URL: {}", getUserId);

        Request request = new Request.Builder()
                .url(getUserId)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Bearer " + accessToken)
                .get()
                .build();

        ResponseModel<HashMap> response = httpClient.handleRequest(request, HashMap.class);
        if (response.isSuccessful()) {
            Map<String, Object> body = response.getBody();
            String elements = body.get("elements").toString();

            return elements.split("/ctts/")[1].replace("]", "");
        } else {
            String msg = String.format("Failed to get user id: Code: %d Msg: %s",
                                       response.getCode(), response.getMsg());
            log.error(msg);

            throw new IllegalStateException(msg);
        }
    }

    private void getUserFio(String accessToken, String userSbjId, EsiaUserInfo userInfo)
            throws MalformedURLException, HttpClientException {
        URL getUserFio = new URL(ESIA_SERV, ESIA_USER_INFO + userSbjId);

        log.debug("Get user FIO URL: {}", getUserFio);

        Request request = new Request.Builder()
                .url(getUserFio)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Bearer " + accessToken)
                .get()
                .build();

        ResponseModel<HashMap> response = httpClient.handleRequest(request, HashMap.class);
        if (response.isSuccessful()) {
            Map<String, Object> body = response.getBody();

            if (body.containsKey("firstName")) {
                userInfo.setFirstName(body.get("firstName").toString());
            }

            if (body.containsKey("lastName")) {
                userInfo.setLastName(body.get("lastName").toString());
            }

            if (body.containsKey("middleName")) {
                userInfo.setMiddleName(body.get("middleName").toString());
            }
        } else {
            String msg = String.format("Failed to get user info: Code: %d Msg: %s",
                                       response.getCode(), response.getMsg());
            log.error(msg);

            throw new IllegalStateException(msg);
        }
    }

    private EsiaJWT tradeCodeForToken(String redirect, String code, String state)
            throws HttpClientException, MalformedURLException {
        String timestamp = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss Z").format(new Date());
        String clientSecret = pkcs7Util.generateClientSecret(SCOPE, timestamp, CLIENT_ID, state);

        RequestBody formBody = new FormBody.Builder()
                .add("client_id", CLIENT_ID)
                .add("code", code)
                .add("grant_type", "authorization_code")
                .add("client_secret", clientSecret)
                .add("state", state)
                .add("redirect_uri", redirect)
                .add("scope", SCOPE)
                .add("timestamp", timestamp)
                .add("token_type", "Bearer")
                .add("access_type", ACCESS_TYPE)
                .build();

        Request request = new Request.Builder()
                .url(new URL(ESIA_SERV, ESIA_TOKEN_POINT))
                .post(formBody)
                .build();

        ResponseModel<EsiaJWT> response = httpClient.handleRequest(request, EsiaJWT.class);
        if (response.isSuccessful()) {
            EsiaJWT esiaJWT = response.getBody();

            log.debug("SUCCESS GET TOKEN. [{}]", esiaJWT);

            return esiaJWT;
        } else {
            String msg = String.format("Failed to get token. Code: %d, Msg: %s",
                                       response.getCode(), response.getMsg());
            log.error(msg);

            throw new IllegalStateException(msg);
        }
    }

    private String getUserSbjId(String accessToken) throws IOException {
        String[] accessParts = accessToken.split("\\.");

        String content = new String(Base64.getUrlDecoder().decode(accessParts[1]), StandardCharsets.UTF_8);
        Map<String, String> result = mapper.readValue(content,
                                                      new TypeReference<Map<String, String>>() {
                                                      });

        return result.get("urn:esia:sbj_id");
    }
}
