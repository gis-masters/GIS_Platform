package ru.mycrg.geoserver_client;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.config.RetryConfig;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.http_client.handlers.IHttpRequestHandler;
import ru.mycrg.http_client.handlers.RetryableRequestHandler;

import java.util.concurrent.TimeUnit;

public class GeoserverClient {

    public static final MediaType JSON_MEDIA_TYPE = MediaType.parse("application/json; charset=utf-8");
    public static final MediaType XML_MEDIA_TYPE = MediaType.parse("application/xml");

    private static final RetryConfig defaultRetryConfig = RetryConfig.builder()
                                                                     .maxAttempts(10)
                                                                     .waitDuration(60_000L)
                                                                     .build();

    private GeoserverClient() {
        // Required
    }

    public static void initialize(GeoserverInfo geoserverInfo) {
        initialize(geoserverInfo, defaultRetryConfig);
    }

    public static void initialize(GeoserverInfo geoserverInfo, RetryConfig retryConfig) {
        GeoServerBaseService.geoserverInfo = geoserverInfo;

        OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .readTimeout(retryConfig.getWaitDuration(), TimeUnit.MILLISECONDS)
                .writeTimeout(retryConfig.getWaitDuration(), TimeUnit.MILLISECONDS)
                .connectTimeout(retryConfig.getWaitDuration(), TimeUnit.MILLISECONDS)
                .build();

        IHttpRequestHandler requestHandler = new RetryableRequestHandler(
                new BaseRequestHandler(okHttpClient),
                retryConfig
        );

        GeoServerBaseService.httpClient = new HttpClient(requestHandler);
    }
}
