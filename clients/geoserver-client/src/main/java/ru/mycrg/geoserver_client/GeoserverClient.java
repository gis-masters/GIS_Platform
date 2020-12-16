package ru.mycrg.geoserver_client;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.config.RetryConfig;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.http_client.handlers.RetryableRequestHandler;

public class GeoserverClient {

    public static final MediaType JSON_MEDIA_TYPE = MediaType.parse("application/json; charset=utf-8");
    public static final MediaType XML_ATOM_MEDIA_TYPE = MediaType.parse("application/atom+xml");
    public static final MediaType XML_MEDIA_TYPE = MediaType.parse("application/xml");

    private GeoserverClient() {
    }

    public static void initialize(GeoserverInfo geoserverInfo) {
        GeoServerBaseService.geoserverInfo = geoserverInfo;

        RetryConfig config = RetryConfig.builder()
                                        .maxAttempts(10)
                                        .waitDuration(60_000L)
                                        .build();

        RetryableRequestHandler requestHandler = new RetryableRequestHandler(
                new BaseRequestHandler(new OkHttpClient()),
                config
        );

        GeoServerBaseService.httpClient = new HttpClient(requestHandler);
    }
}
