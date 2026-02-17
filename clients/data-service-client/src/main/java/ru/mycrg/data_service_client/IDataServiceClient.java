package ru.mycrg.data_service_client;

import okhttp3.RequestBody;
import org.springframework.data.domain.Page;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.List;
import java.util.Map;

public interface IDataServiceClient {

    List<FileResponse> postFiles(String accessToken, RequestBody body) throws HttpClientException;

    Page<Feature> getFeaturesWithCustomParams(String token,
                                              String dataset,
                                              String table,
                                              String filter,
                                              int page,
                                              int size) throws HttpClientException;

    ResponseModel<Map<String, Object>> getLibRecordById(String token,
                                                        String docLibId,
                                                        Long recId) throws HttpClientException;

    ResponseModel<Object> patchRecordInTableById(String token,
                                                 String dataset,
                                                 String table,
                                                 Feature feature) throws HttpClientException;

    ResponseModel<Object> patchLibRecordField(String token,
                                              String docLibId,
                                              Long recId,
                                              String fieldName,
                                              Object fieldValue) throws HttpClientException;

    ResponseModel<FileResponse> getFileById(String token, String uuid) throws HttpClientException;
}
