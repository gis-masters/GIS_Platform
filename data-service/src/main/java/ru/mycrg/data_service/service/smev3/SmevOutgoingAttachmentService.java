package ru.mycrg.data_service.service.smev3;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.service.smev3.model.SmevAttachment;
import ru.mycrg.data_service.service.storage.FileStorageService;

import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.util.UUID;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevOutgoingAttachmentService {

    private final Logger log = LoggerFactory.getLogger(SmevOutgoingAttachmentService.class);

    private final FileStorageService fileStorageService;
    private final MinioClient s3client;
    private final Smev3Config smev3Config;

    public SmevOutgoingAttachmentService(FileStorageService fileStorageService,
                                         MinioClient s3client,
                                         Smev3Config smev3Config) {
        this.fileStorageService = fileStorageService;
        this.s3client = s3client;
        this.smev3Config = smev3Config;
    }

    public SmevAttachment pushAttachment(File file) {
        try {
            var attachmentId = UUID.randomUUID();

            var resource = fileStorageService.loadFromMainStorage(file.getPath());
            byte[] fileBytes = Files.readAllBytes(resource.getFile().toPath());

            var s3fileName = String.format("fileid_%s", file.getId());
            putObject(s3fileName, fileBytes);

            log.info("Добавление вложения в s3. id {}. filename {}", attachmentId, s3fileName);

            return new SmevAttachment(file.getId(), file.getTitle(), attachmentId, s3fileName);
        } catch (Exception e) {
            throw new SmevRequestException("Не удалось добавить attachment => " + e.getMessage());
        }
    }

    /**
     * Загружает объект с заданным именем и содержимым в корзину S3.
     */
    private void putObject(String name, byte[] bytes) {
        try {
            PutObjectArgs objectArgs = PutObjectArgs
                    .builder()
                    .bucket(smev3Config.getS3bucketOutgoing())
                    .object(name)
                    .stream(new ByteArrayInputStream(bytes), bytes.length, -1)
                    .build();

            s3client.putObject(objectArgs);
        } catch (Exception e) {
            throw new SmevRequestException("Не удалось добавить объект в хранилище => " + e.getMessage());
        }
    }
}
