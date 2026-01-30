package ru.mycrg.report_service.services;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.data_service_client.IDataServiceClient;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DataServiceSpeaker {

    private final Logger log = LoggerFactory.getLogger(DataServiceSpeaker.class);

    public final static String FILE_MEDIA_TYPE = "application/octet-stream";

    private final IDataServiceClient dataServiceClient;

    public DataServiceSpeaker(IDataServiceClient dataServiceClient) {
        this.dataServiceClient = dataServiceClient;
    }

    public Optional<UUID> postFileOnService(String accessToken, File file) throws HttpClientException, IOException {
        log.debug("Путь к сформированному отчёту, перед сохранением на data-service {}", file.toPath());

        RequestBody fileBody = RequestBody.create(
                MediaType.parse(FILE_MEDIA_TYPE),
                Files.readAllBytes(file.toPath()));

        RequestBody body = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("files", file.getName(), fileBody)
                .build();

        List<FileResponse> files = dataServiceClient.postFiles(accessToken, body);

        //Всегда кладём 1 файл значит всегда получаем List из одного элемента

        if (!files.isEmpty()) {
            UUID createdFileId = files.getFirst().getId();

            return Optional.of(createdFileId);
        }

        return Optional.empty();
    }
}
