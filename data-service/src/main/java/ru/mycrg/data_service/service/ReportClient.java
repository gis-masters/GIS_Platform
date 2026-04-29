package ru.mycrg.data_service.service;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.report_service.TemplateShortInfo;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import tools.jackson.core.type.TypeReference;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

//TODO: при распространении по проекту сделать полноценный клиент
@Service
public class ReportClient {

    private final Logger log = LoggerFactory.getLogger(ReportClient.class);

    private final URL reportServiceUrl;
    private final HttpClient httpClient;
    private final IAuthenticationFacade authenticationFacade;

    public ReportClient(Environment environment,
                        IAuthenticationFacade authenticationFacade) throws MalformedURLException {
        this.authenticationFacade = authenticationFacade;

        this.httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        this.reportServiceUrl = new URL(environment.getRequiredProperty("crg-options.report-service-url"));
    }

    public ResponseModel<List<TemplateShortInfo>> getAll() throws MalformedURLException, HttpClientException {
        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                .url(new URL(reportServiceUrl, "/templates/short"))
                .get()
                .build();

        return httpClient.handleRequest(request, new TypeReference<>() {
        });
    }
}
