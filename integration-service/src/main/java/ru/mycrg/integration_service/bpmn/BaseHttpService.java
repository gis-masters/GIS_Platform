package ru.mycrg.integration_service.bpmn;

import okhttp3.OkHttpClient;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;

import static java.util.concurrent.TimeUnit.SECONDS;

@Service
public class BaseHttpService {

    public final Environment environment;

    public static final HttpClient crgHttpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
    public static final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(60, SECONDS)
            .writeTimeout(60, SECONDS)
            .readTimeout(120, SECONDS)
            .build();

    private final URL gisServiceUrl;
    private final URL dataServiceUrl;
    private final URL auditServiceUrl;

    public BaseHttpService(Environment environment) throws MalformedURLException {
        this.environment = environment;

        gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis_service_url"));
        dataServiceUrl = new URL(environment.getRequiredProperty("crg-options.data_service_url"));
        auditServiceUrl = new URL(environment.getRequiredProperty("crg-options.audit_service_url"));
    }

    public URL getGisServiceUrl() {
        return gisServiceUrl;
    }

    public URL getDataServiceUrl() {
        return dataServiceUrl;
    }

    public URL getAuditServiceUrl() {
        return auditServiceUrl;
    }
}
