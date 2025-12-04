package ru.mycrg.report_service.services;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.FileProjection;
import ru.mycrg.data_service_client.IDataServiceClient;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DataServiceSpeaker {

    private final Logger log = LoggerFactory.getLogger(DataServiceSpeaker.class);

    private final IDataServiceClient dataServiceClient;

    public DataServiceSpeaker(IDataServiceClient dataServiceClient) {
        this.dataServiceClient = dataServiceClient;
    }

    public Optional<UUID> postFileOnService(String accessToken,
                                            byte[] fileContent,
                                            String fileName) throws HttpClientException {

        RequestBody fileBody = RequestBody.create(
                MediaType.parse("application/octet-stream"),
                fileContent
        );

        RequestBody body = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("files", fileName, fileBody)
                .build();

        List<FileProjection> files = dataServiceClient.postFiles(accessToken, body);

        //Всегда кладём 1 файл значит всегда получаем List из одного элемента

        if (!files.isEmpty()) {
            UUID createdFileId = files.getFirst().getId();

            return Optional.of(createdFileId);
        }

        return Optional.empty();
    }
}
