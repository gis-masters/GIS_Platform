package ru.geoserver.service;

import okhttp3.Credentials;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import ru.geoserver.config.FizProperties;
import ru.geoserver.exceptions.GeoserverException;

import java.io.IOException;

public abstract class GeoServerBaseService {

    @Autowired
    private FizProperties properties;

    @Autowired
    private AuthService authService;

    @Autowired
    private Environment environment;

    protected OkHttpClient httpClient = new OkHttpClient();

    protected void doRequest(Request request, String msg) throws IOException {
        Response response = httpClient.newCall(request).execute();

        if (!response.isSuccessful()) {
            response.close();
            throw new GeoserverException(msg, response.message());
        } else {
            response.close();
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

    protected String postgisHost() {
        return properties.getPostgisHost();
    }

    protected String geoserverHost() {
        return properties.getGeoserverHost();
    }

    protected String dbOwnerUser() {
        return environment.getRequiredProperty("spring.datasource.username");
    }

    protected String dbOwnerPassword() {
        return environment.getRequiredProperty("spring.datasource.password");
    }

    protected String getAccessToken() {
        return authService.getJwtTokenHolder().getAccess_token();
    }
}
