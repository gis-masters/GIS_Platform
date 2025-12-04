package ru.mycrg.data_service_client;

import okhttp3.RequestBody;
import ru.mycrg.common_contracts.generated.data_service.FileProjection;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.List;

public interface IDataServiceClient {

    List<FileProjection> postFiles(String accessToken, RequestBody body) throws HttpClientException;
}
