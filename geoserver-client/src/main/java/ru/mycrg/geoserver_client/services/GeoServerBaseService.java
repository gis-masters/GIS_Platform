package ru.mycrg.geoserver_client.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.DbInfo;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.GeoserverInfo;

import java.io.IOException;

public class GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(GeoServerBaseService.class);

    public static GeoserverInfo geoserverInfo;
    public static DbInfo dbInfo;

    protected final OkHttpClient httpClient = new OkHttpClient();
    protected final ObjectMapper mapper = new ObjectMapper();

    protected final Request.Builder builderWithBearerAuth;

    public GeoServerBaseService(String accessToken) {
        this.builderWithBearerAuth = new Request.Builder()
                .addHeader("Authorization", "Bearer " + accessToken);
    }

    protected GeoserverClientResponse doRequest(Request request) {
        try (Response response = httpClient.newCall(request).execute()) {
            return new GeoserverClientResponse(response);
        } catch (IOException e) {
            return new GeoserverClientResponse(e.getMessage());
        }
    }

    protected void doRequest(Request request, String description) {
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                final String message = response.message();
                log.warn("Request: '{}' not successful, Code: {}, Reason: {}",
                        description,
                        response.code(),
                        message);
            }
        } catch (IOException e) {
            log.error("Can't execute request: '{}', Reason: {}", description, e.getMessage());
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
