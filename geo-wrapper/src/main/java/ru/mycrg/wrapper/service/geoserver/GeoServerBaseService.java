package ru.mycrg.wrapper.service.geoserver;

import okhttp3.Credentials;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import ru.mycrg.wrapper.config.CrgProperties;
import ru.mycrg.wrapper.exceptions.GeoserverException;

import java.io.IOException;

public abstract class GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(GeoServerBaseService.class);

    @Autowired
    private CrgProperties properties;

    @Autowired
    private AuthService authService;

    @Autowired
    private Environment environment;

    protected OkHttpClient httpClient = new OkHttpClient();

    protected void doRequest(Request request, String msg) throws IOException {
        Response response = httpClient.newCall(request).execute();

        if (!response.isSuccessful()) {
            response.close();

            log.error("Geoserver error body: {}", response.toString());

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
