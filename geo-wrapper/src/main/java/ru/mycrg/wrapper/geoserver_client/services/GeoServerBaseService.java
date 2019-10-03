package ru.mycrg.wrapper.geoserver_client.services;

import okhttp3.Credentials;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import ru.mycrg.common.JWTTokenHolder;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;

import java.io.IOException;

public abstract class GeoServerBaseService {

    public static final Logger log = LoggerFactory.getLogger(GeoServerBaseService.class);

    @Autowired
    private CrgProperties properties;

    @Autowired
    private AuthService authService;

    @Autowired
    private Environment environment;

    protected OkHttpClient httpClient = new OkHttpClient();

    protected void doRequest(Request request, String msg) throws GeoserverClientException {
        Response response = null;
        try {
            response = httpClient.newCall(request).execute();

            if (!response.isSuccessful()) {
                log.error("Geoserver error body: {}", response.toString());

                response.close();

                throw new GeoserverClientException(msg, response.message());
            } else {
                response.close();
            }
        } catch (Exception e) {
            log.error("Geoserver error body: {}", e.getMessage());

            throw new GeoserverClientException(msg, e.getMessage());
        }
    }

    protected String simpleCredential() {
        return Credentials.basic(properties.getGeoserverUser(), properties.getGeoserverPassword());
    }

    protected String getRootUser() {
        return properties.getGeoserverUser();
    }

    protected String getRootPassword() {
        return properties.getGeoserverPassword();
    }

    protected String postgisHostWithPort() {
        return environment
                .getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];
    }

    protected String geoserverHost() {
        return properties.getGeoserverHostWithPort();
    }

    @NotNull
    protected String userServiceName() {
        if (properties.getUserServiceName() == null) {
            return "default";
        } else {
            return properties.getUserServiceName();
        }
    }

    protected String dbOwnerUser() {
        return environment.getRequiredProperty("spring.datasource.username");
    }

    protected String dbOwnerPassword() {
        return environment.getRequiredProperty("spring.datasource.password");
    }

    protected String getAccessToken() {
        JWTTokenHolder jwtTokenHolder = authService.getJwtTokenHolder();
        if (jwtTokenHolder == null) {
            log.warn("Empty jwt token");

            return "";
        } else {
            return jwtTokenHolder.getAccess_token();
        }
    }

    @NotNull
    protected StringBuilder getRootRestUrl() {
        return new StringBuilder()
                .append("http://")
                .append(geoserverHost())
                .append("/geoserver/rest");
    }
}
