package ru.mycrg.geoserver_client.services;

import okhttp3.Request;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.geoserver_client.DbInfo;
import ru.mycrg.geoserver_client.GeoserverInfo;
import ru.mycrg.http_client.HttpClient;

public class GeoServerBaseService {

    public static DbInfo dbInfo;
    public static HttpClient httpClient;
    public static GeoserverInfo geoserverInfo;

    protected Request.Builder builderWithBearerAuth;

    public GeoServerBaseService(String accessToken) {
        this.builderWithBearerAuth = new Request.Builder()
                .addHeader("Authorization", "Bearer " + accessToken);
    }

    @NotNull
    public static StringBuilder getGeoserverRestUrl() {
        return new StringBuilder()
                .append("http://")
                .append(geoserverInfo.getHost()).append(":").append(geoserverInfo.getPort())
                .append("/geoserver/rest");
    }
}
