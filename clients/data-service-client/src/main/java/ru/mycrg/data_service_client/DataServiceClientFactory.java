package ru.mycrg.data_service_client;

import okhttp3.OkHttpClient;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.config.RetryConfig;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.http_client.handlers.IHttpRequestHandler;
import ru.mycrg.http_client.handlers.RetryableRequestHandler;

import java.net.URL;

public enum DataServiceClientFactory {
    DATA_SERVICES_FACTORY_INSTANCE;

    private static String DATA_SERVICE_URL = "http://data-service";

    public IDataServiceClient create() throws Exception {
        URL url = new URL(DATA_SERVICE_URL);

        RetryConfig config = RetryConfig.builder()
                                        .maxAttempts(10)
                                        .waitDuration(60_000L)
                                        .build();

        IHttpRequestHandler requestHandler = new RetryableRequestHandler(
                new BaseRequestHandler(new OkHttpClient()),
                config
        );

        return this.create(url, requestHandler);
    }

    public void setDataServiceUrl(String dataServiceUrl) {
        DATA_SERVICE_URL = dataServiceUrl;
    }

    private IDataServiceClient create(URL url, IHttpRequestHandler requestHandler) {
        HttpClient httpClient = new HttpClient(requestHandler);

        return new DataServiceClient(url, httpClient);
    }
}
