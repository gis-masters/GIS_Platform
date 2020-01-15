package ru.mycrg.geoserver_client.services;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.DbInfo;
import ru.mycrg.geoserver_client.GeoserverInfo;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.oauth_client.JwtToken;
import ru.mycrg.oauth_client.OAuthClient;
import ru.mycrg.oauth_client.OAuthClientException;

import java.net.MalformedURLException;

public class GeoServerBaseService {

    public static final Logger log = LoggerFactory.getLogger(GeoServerBaseService.class);

    public static OAuthClient oAuthClient;
    public static GeoserverInfo geoserverInfo;
    public static DbInfo dbInfo;

    protected final OkHttpClient httpClient = new OkHttpClient();

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
            throw new GeoserverClientException("Geoserver error" , e.getMessage());
        }
    }

    protected String getRootAccessToken() throws GeoserverClientException {
        JwtToken jwtToken;
        try {
            jwtToken = oAuthClient.getJwtToken(geoserverInfo.getRootUserName(), geoserverInfo.getRootUserPassword());
        } catch (OAuthClientException | MalformedURLException e) {
            throw new GeoserverClientException(e.getMessage(), e.getCause());
        }

        if (jwtToken == null) {
            log.warn("Empty jwt token");

            return "";
        } else {
            return jwtToken.getAccess_token();
        }
    }

    @NotNull
    protected StringBuilder getGeoserverRestUrl() {
        return new StringBuilder()
                .append("http://")
                .append(geoserverInfo.getHost()).append(":").append(geoserverInfo.getPort())
                .append("/geoserver/rest");
    }
}
