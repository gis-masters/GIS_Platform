package ru.mycrg.auth_service.service;

import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.util.Pkcs7Util;
import ru.mycrg.auth_service_contract.dto.esia.EsiaJWT;
import ru.mycrg.auth_service_contract.dto.esia.EsiaUserInfo;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.auth_service.util.AccessTokenHandler.extractUserSbjId;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_X_WWW_FORM_URLENCODED;

@Service
public class EsiaService {

    private final Logger log = LoggerFactory.getLogger(EsiaService.class);

    private final URL ESIA_SERV;
    private final String ESIA_CODE_POINT = "/aas/oauth2/v2/ac";
    private final String ESIA_TOKEN_POINT = "/aas/oauth2/v3/te";
    private final String ESIA_USER_INFO = "/rs/prns/"; // Сервис получения персональных данных пользователя
    private final String ESIA_ORG_INFO = "/rs/orgs"; // Сервис получения данных организации
    private final String ESIA_SBJS_INFO = "/rs/sbjs"; // Сервис получения данных о субъекте

    private final String CLIENT_ID;
    private final String CLIENT_CERTIFICATE_HASH;
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
        CLIENT_CERTIFICATE_HASH = environment.getRequiredProperty("esia.client_certificate_hash");

        ACCESS_TYPE = "online";
        SCOPE = "openid email fullname";
    }

    public String buildAuthorizeUrl(String state, String redirectUri) throws MalformedURLException {
        String timestamp = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss Z").format(new Date());
        String signSecret = pkcs7Util.sign(CLIENT_ID + SCOPE + timestamp + state + redirectUri);

        log.debug("Base64 client secret: {}", signSecret);

        return HttpUrl.get(new URL(ESIA_SERV, ESIA_CODE_POINT)).newBuilder()
                      .addQueryParameter("client_id", CLIENT_ID)
                      .addQueryParameter("client_certificate_hash", CLIENT_CERTIFICATE_HASH)
                      .addQueryParameter("client_secret", signSecret)
                      .addQueryParameter("access_type", ACCESS_TYPE)
                      .addQueryParameter("response_type", "code")
                      .addQueryParameter("scope", SCOPE)
                      .addQueryParameter("state", state)
                      .addQueryParameter("timestamp", timestamp)
                      .addQueryParameter("redirect_uri", redirectUri)
                      .build()
                      .toString();
    }

    public Optional<EsiaUserInfo> getUser(String redirect,
                                          String code,
                                          String state) {
        String esiaToken = tradeCodeForToken(redirect, code, state);

        String userSbjId;
        try {
            userSbjId = extractUserSbjId(esiaToken);
        } catch (Exception e) {
            String msg = String.format("Не удалось прочитать esia token. State: %s. Reason: %s", state, e.getMessage());
            log.error(msg);

            throw new IllegalStateException(msg);
        }

        EsiaUserInfo userInfo = getUserInfo(esiaToken, userSbjId);
        userInfo.setSbjId(userSbjId);

        return Optional.of(userInfo);
    }

    private EsiaUserInfo getUserInfo(String accessToken, String userSbjId) {
        EsiaUserInfo userInfo = new EsiaUserInfo();

        try {
            getUserFio(accessToken, userSbjId, userInfo);
        } catch (Exception e) {
            String msg = String.format("Не удалось получить 'user fio'. Reason: %s", e.getMessage());
            log.error(msg);

            throw new IllegalStateException(msg);
        }

        try {
            getUserId(accessToken, userSbjId, userInfo);
        } catch (Exception e) {
            String msg = String.format("Не удалось получить 'user id'. Reason: %s", e.getMessage());
            log.error(msg);

            throw new IllegalStateException(msg);
        }

        try {
            getUserEmail(accessToken, userSbjId, userInfo);
        } catch (Exception e) {
            String msg = String.format("Не удалось получить 'user email'. Reason: %s", e.getMessage());
            log.error(msg);

            throw new IllegalStateException(msg);
        }

        return userInfo;
    }

    private void getUserEmail(String accessToken, String userSbjId, EsiaUserInfo userInfo)
            throws MalformedURLException, HttpClientException {
        URL getUserEmail = new URL(ESIA_SERV, ESIA_USER_INFO + userSbjId + "/ctts/" + userInfo.getId());

        log.debug("Get user EMAIL URL: {}", getUserEmail);

        Request request = new Request.Builder()
                .url(getUserEmail)
                .addHeader("Content-Type", APPLICATION_X_WWW_FORM_URLENCODED)
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

    private void getUserId(String accessToken, String userSbjId, EsiaUserInfo userInfo)
            throws MalformedURLException, HttpClientException {
        URL getUserId = new URL(ESIA_SERV, ESIA_USER_INFO + userSbjId + "/ctts");

        log.debug("Get user ID URL: {}", getUserId);

        Request request = new Request.Builder()
                .url(getUserId)
                .addHeader("Content-Type", APPLICATION_X_WWW_FORM_URLENCODED)
                .addHeader("Authorization", "Bearer " + accessToken)
                .get()
                .build();

        ResponseModel<HashMap> response = httpClient.handleRequest(request, HashMap.class);
        if (response.isSuccessful()) {
            Map<String, Object> body = response.getBody();
            String elements = body.get("elements").toString();

            String userId = elements.split("/ctts/")[1].replace("]", "");

            userInfo.setId(userId);
        } else {
            String msg = String.format("Failed to get user id: Code: %d Msg: %s",
                                       response.getCode(), response.getMsg());
            log.error(msg);

            throw new IllegalStateException(msg);
        }
    }

    private void getUserFio(String accessToken, String userSbjId, EsiaUserInfo userInfo)
            throws MalformedURLException, HttpClientException {
        URL getUserFioUrl = new URL(ESIA_SERV, ESIA_USER_INFO + userSbjId);

        log.debug("Get user FIO URL: [{}]", getUserFioUrl);

        Request request = new Request.Builder()
                .url(getUserFioUrl)
                .addHeader("Content-Type", APPLICATION_X_WWW_FORM_URLENCODED)
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

    private String tradeCodeForToken(String redirectUri, String code, String state) {
        try {
            String timestamp = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss Z").format(new Date());
            String signSecret = pkcs7Util.sign(CLIENT_ID + SCOPE + timestamp + state + redirectUri + code);

            RequestBody formBody = new FormBody.Builder()
                    .add("client_id", CLIENT_ID)
                    .add("code", code)
                    .add("grant_type", "authorization_code")
                    .add("client_secret", signSecret)
                    .add("state", state)
                    .add("redirect_uri", redirectUri)
                    .add("scope", SCOPE)
                    .add("timestamp", timestamp)
                    .add("token_type", "Bearer")
                    .add("client_certificate_hash", CLIENT_CERTIFICATE_HASH)
                    .add("access_type", ACCESS_TYPE)
                    .build();

            URL url = new URL(ESIA_SERV, ESIA_TOKEN_POINT);

            log.debug("Try trade code for token by url: [{}]", url);

            Request request = new Request.Builder()
                    .url(url)
                    .post(formBody)
                    .build();

            ResponseModel<EsiaJWT> response = httpClient.handleRequest(request, EsiaJWT.class);
            if (response.isSuccessful()) {
                EsiaJWT esiaJWT = response.getBody();

                log.debug("SUCCESS TRADE CODE FOR TOKEN: [{}]", esiaJWT);

                return esiaJWT.getAccess_token();
            } else {
                String msg = String.format("Failed to get token. Code: %d, Msg: %s",
                                           response.getCode(), response.getMsg());
                log.error(msg);

                throw new IllegalStateException(msg);
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось обменять код на токен в ЕСИА. State: %s. Reason: %s",
                                       state, e.getMessage());
            log.error(msg);

            throw new IllegalStateException(msg);
        }
    }
}
