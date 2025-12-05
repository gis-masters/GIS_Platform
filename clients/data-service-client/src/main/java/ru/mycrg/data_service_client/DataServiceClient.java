package ru.mycrg.data_service_client;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class DataServiceClient implements IDataServiceClient {

    private final Logger log = LoggerFactory.getLogger(DataServiceClient.class);

    private final HttpClient httpClient;
    private final URL baseUrl;

    public DataServiceClient(URL baseUrl, HttpClient httpClient) {
        this.baseUrl = baseUrl;
        this.httpClient = httpClient;
    }

    @Override
    public List<FileResponse> postFiles(String accessToken, RequestBody body) throws HttpClientException {
        List<FileResponse> createdFiles = new ArrayList<>();

        Request request = new Request.Builder()
                .url(baseUrl + "/files")
                .method("POST", body)
                .addHeader("Authorization", "Bearer " + accessToken)
                .build();

        log.debug("Выполняем запрос на {}", baseUrl + "/files");
        ResponseModel<List<FileResponse>> response = httpClient.handleRequest(request,
                                                                              new TypeReference<>() {
                                                                                });

        log.debug("Код ответа: {}. Тело ответа: {}", response.getCode(), response.getBody());

        if (response.isSuccessful()) {
            createdFiles.addAll(response.getBody());
        }

        return createdFiles;
    }
}
