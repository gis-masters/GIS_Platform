package ru.mycrg.data_service_client;

import okhttp3.RequestBody;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.List;

public interface IDataServiceClient {

    List<FileResponse> postFiles(String accessToken, RequestBody body) throws HttpClientException;
}
