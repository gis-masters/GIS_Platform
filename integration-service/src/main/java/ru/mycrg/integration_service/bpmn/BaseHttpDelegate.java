package ru.mycrg.integration_service.bpmn;

import okhttp3.OkHttpClient;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URL;

import static java.util.concurrent.TimeUnit.SECONDS;

@Service
public class BaseHttpDelegate {

    public final Environment environment;

    public static final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(60, SECONDS)
            .writeTimeout(60, SECONDS)
            .readTimeout(120, SECONDS)
            .build();

    public static URL dataServiceUrl;
    public static URL gisServiceUrl;

    public BaseHttpDelegate(Environment environment) throws MalformedURLException {
        this.environment = environment;

        dataServiceUrl = new URL(environment.getRequiredProperty("crg-options.data_service_url"));
        gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis_service_url"));
    }

}
