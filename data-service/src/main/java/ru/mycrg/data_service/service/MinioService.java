package ru.mycrg.data_service.service;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.BadRequestException;


@Service
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
}
