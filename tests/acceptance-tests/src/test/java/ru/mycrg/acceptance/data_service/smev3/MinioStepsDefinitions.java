package ru.mycrg.acceptance.data_service.smev3;

import io.cucumber.java.en.Given;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import java.io.InputStream;

public class MinioStepsDefinitions extends BaseStepsDefinitions {

    private final String INCOMING_ATTACHMENTS_BUCKET = "incoming-attachments";
    private final String MINIO_ENDPOINT = "http://localhost:9090";

    private final String MINIO_ACCESS_KEY = "admin";
    private final String MINIO_SECRET_KEY = "oFzB?S3KFv%oFX";

    private final MinioClient MINIO_CLIENT = MinioClient.builder()
                                                        .endpoint(MINIO_ENDPOINT)
                                                        .credentials(MINIO_ACCESS_KEY, MINIO_SECRET_KEY)
                                                        .build();

    @Given("В minio лежит архив с приходящими данными")
    public void createMinioFile() throws Exception {
        createBucket(INCOMING_ATTACHMENTS_BUCKET);

        String fileName = "SignedContent.zip";

        // Получаем файл из ресурсов
        String resourcePath = String.format("/ru/mycrg/acceptance/resources/" + fileName);
        InputStream inputStream = getClass().getResourceAsStream(resourcePath);
        if (inputStream == null) {
            throw new IllegalStateException("Файл " + resourcePath + " не найден в ресурсах");
        }

        String mainFolderId = "0ecf614e-fb28-11ef-8e72-1ed50ed0293c";
        String subFolderId = "0a546300-9f22-4e41-9804-f3b2d6f889b4";

        // Загружаем файл в нужную структуру папок
        String objectName = String.format("%s/%s/%s", mainFolderId, subFolderId, fileName);
        MINIO_CLIENT.putObject(
                PutObjectArgs.builder()
                             .bucket(INCOMING_ATTACHMENTS_BUCKET)
                             .object(objectName)
                             .stream(inputStream, inputStream.available(), -1)
                             .build()
        );
    }

    public void createBucket(String name) throws Exception {
        boolean bucketExists = MINIO_CLIENT.bucketExists(BucketExistsArgs.builder().bucket(name).build());
        if (!bucketExists) {
            MINIO_CLIENT.makeBucket(MakeBucketArgs.builder().bucket(name).build());
        }
    }
}