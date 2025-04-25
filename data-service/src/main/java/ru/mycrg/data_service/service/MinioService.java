package ru.mycrg.data_service.service;

import io.minio.*;
import io.minio.messages.Item;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.BadRequestException;

import java.io.ByteArrayInputStream;

import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class MinioService {

    private final MinioClient s3client;

    public MinioService(MinioClient s3client) {
        this.s3client = s3client;
    }

    public byte[] getFile(String id, String bucket) {
        try {
            return s3client.getObject(GetObjectArgs.builder()
                                                   .bucket(bucket)
                                                   .object(id)
                                                   .build()).readAllBytes();
        } catch (Exception e) {
            throw new BadRequestException("Ошибка загрузки файлов из минио: " + e.getMessage());
        }
    }

    public void deleteFile(String id, String bucket) {
        try {
            s3client.removeObject(RemoveObjectArgs.builder()
                                                  .bucket(bucket)
                                                  .object(id)
                                                  .build());
        } catch (Exception e) {
            throw new BadRequestException("Ошибка удаления файла из минио: " + e.getMessage());
        }
    }

    public void uploadFile(String fileName, byte[] bytes, String bucket) {
        try {
            PutObjectArgs putObject = PutObjectArgs.builder()
                                                   .bucket(bucket)
                                                   .object(fileName)
                                                   .stream(new ByteArrayInputStream(bytes), bytes.length, -1)
                                                   .build();
            s3client.putObject(putObject);
        } catch (Exception e) {
            logError("Ошибка загрузки файла в минио", e);

            throw new BadRequestException("Ошибка загрузки файла в минио");
        }
    }

    public Iterable<Result<Item>> getListObjects(String folder, String bucket) {
        try {
            return s3client.listObjects(ListObjectsArgs.builder()
                                                       .bucket(bucket)
                                                       .prefix(folder)
                                                       .recursive(false)
                                                       .build());
        } catch (Exception e) {
            throw new BadRequestException("Ошибка получения списка объектов из минио: " + e.getMessage());
        }
    }
}
