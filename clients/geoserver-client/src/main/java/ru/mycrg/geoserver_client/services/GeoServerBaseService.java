package ru.mycrg.geoserver_client.services;

import okhttp3.HttpUrl;
import okhttp3.Request;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.geoserver_client.GeoserverInfo;
import ru.mycrg.http_client.HttpClient;

public class GeoServerBaseService {

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

    @NotNull
    public static HttpUrl getGeoserverWmsUrl() {
        return new HttpUrl.Builder()
                .scheme("http")
                .host(geoserverInfo.getHost())
                .port(geoserverInfo.getPort())
                .addPathSegment("geoserver")
                .addPathSegment("wms")
                .build();
    }

    @NotNull
    public static HttpUrl getGeoserverWfsUrl() {
        return new HttpUrl.Builder()
                .scheme("http")
                .host(geoserverInfo.getHost())
                .port(geoserverInfo.getPort())
                .addPathSegment("geoserver")
                .addPathSegment("wfs")
                .build();
    }
}
