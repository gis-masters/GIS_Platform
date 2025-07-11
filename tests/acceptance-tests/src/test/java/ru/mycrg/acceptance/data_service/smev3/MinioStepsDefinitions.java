package ru.mycrg.acceptance.data_service.smev3;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.minio.*;
import io.minio.messages.Item;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.smev3.config.PropertiesConfig;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;

/**
 * Класс для управления MinioS3
 * <p>
 * Планируется наличие трёх методов: создай бакет, положи в бакет, посмотри что есть в бакете
 * <p>
 * Два бакета создаётся сразу, особой причины в этом нет. Просто по умолчанию смэвАдаптер работает с двумя бакетами.
 * Если есть один должен быть и второй.
 */

public class MinioStepsDefinitions extends BaseStepsDefinitions {

    private final MinioClient minioClient;
    private final String INCOMING_ATTACHMENTS_BUCKET = "incoming-attachments";
    private final String OUTGOING_ATTACHMENTS_BUCKET = "outgoing-attachments";

    private final String SMEV_RESOURCE_PATH = "/ru/mycrg/acceptance/resources/SMEV/";

    private final Map<String, String> fileMapping = Map.of(
            "РНС выдача", "RnsGive_SignedContent.zip",
            "РНС продление", "RnsRenewal_SignedContent.zip",
            "РНС дубликат", "RnsDup_SignedContent.zip",
            "РНВ выдача", "RnvGive_SignedContent.zip",
            "РНВ изменение", "RnvChange_SignedContent.zip",
            "РНВ дубликат", "RnvDup_SignedContent.zip"
    );

    public MinioStepsDefinitions() {
        Properties properties = PropertiesConfig.getProperties();

        String endpoint = properties.getProperty("SMEV3_S3_ENDPOINT_TEST");
        String accessKey = properties.getProperty("SMEV3_S3_ACCESSKEY");
        String secretKey = properties.getProperty("SMEV3_S3_SECRETKEY");

        System.out.println("SMEV3_S3_CONF: " + endpoint + " " + accessKey + " " + secretKey);

        minioClient = MinioClient.builder()
                                 .endpoint(endpoint)
                                 .credentials(accessKey, secretKey)
                                 .build();
    }

    @Given("в minio лежит архив с приходящими данными {string}")
    public void createMinioFile(String file) throws Exception {
        String zipSignedContent = fileMapping.get(file);
        if (zipSignedContent == null) {
            throw new IllegalArgumentException("Неизвестный тип файла: " + file);
        }

        createBucket(INCOMING_ATTACHMENTS_BUCKET);
        createBucket(OUTGOING_ATTACHMENTS_BUCKET);

        // Получаем файл из ресурсов
        String resourcePath = String.format(SMEV_RESOURCE_PATH + zipSignedContent);
        InputStream inputStream = getClass().getResourceAsStream(resourcePath);
        if (inputStream == null) {
            throw new IllegalStateException("Файл " + resourcePath + " не найден в ресурсах");
        }

        String xmlFile = zipSignedContent.substring(0, zipSignedContent.indexOf("_")) + ".xml";

        // Читаем XML файл для получения mainFolderId и subFolderId
        String xmlResourcePath = String.format(SMEV_RESOURCE_PATH + xmlFile);
        InputStream xmlInputStream = getClass().getResourceAsStream(xmlResourcePath);
        if (xmlInputStream == null) {
            throw new IllegalStateException("XML файл " + xmlResourcePath + " не найден в ресурсах");
        }

        // Парсим XML для получения ID
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(xmlInputStream);

        // Получаем mainFolderId из tns:AttachmentHeader/tns:Id
        NodeList attachmentHeaders = doc.getElementsByTagNameNS("*", "AttachmentHeader");
        String mainFolderId = null;
        for (int i = 0; i < attachmentHeaders.getLength(); i++) {
            Element header = (Element) attachmentHeaders.item(i);
            NodeList ids = header.getElementsByTagNameNS("*", "Id");
            if (ids.getLength() > 0) {
                mainFolderId = ids.item(0).getTextContent();
                break;
            }
        }

        // Получаем subFolderId из tns:RequestMetadata/tns:clientId
        NodeList clientIds = doc.getElementsByTagNameNS("*", "clientId");
        String subFolderId = null;
        if (clientIds.getLength() > 0) {
            subFolderId = clientIds.item(0).getTextContent();
        }

        if (mainFolderId == null || subFolderId == null) {
            throw new IllegalStateException("Не удалось получить mainFolderId или subFolderId из XML файла");
        }

        // Загружаем файл в нужную структуру папок
        String shortFileName = zipSignedContent.substring(zipSignedContent.indexOf("_") + 1);
        String objectName = String.format("%s/%s/%s", mainFolderId, subFolderId, shortFileName);

        minioClient.putObject(
                PutObjectArgs.builder()
                             .bucket(INCOMING_ATTACHMENTS_BUCKET)
                             .object(objectName)
                             .stream(inputStream, inputStream.available(), -1)
                             .build()
        );
    }

    @And("ожидаемый файл лежит в минио {string}")
    public void checkMinioFile(String expectedFileName) {
        try {
            boolean fileExists = fileExistsInOutgoingBucket(expectedFileName);
            if (!fileExists) {
                throw new AssertionError(
                        "Ожидаемый файл '" + expectedFileName + "' не найден в бакете " + OUTGOING_ATTACHMENTS_BUCKET);
            }
        } catch (Exception e) {
            throw new AssertionError("Не удалось проверить наличие файла в MinIO: " + e.getMessage());
        }
    }

    public void createBucket(String name) {
        try {
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(name).build());
            if (!bucketExists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(name).build());
                // Проверяем, что бакет действительно создался
                bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(name).build());
                if (!bucketExists) {
                    throw new AssertionError(
                            "Не удалось создать бакет " + name + ": бакет не существует после создания");
                }
            }
        } catch (Exception e) {
            throw new AssertionError("Ошибка при создании/проверке бакета " + name + ": " + e.getMessage());
        }
    }

    public boolean fileExistsInOutgoingBucket(String expectedFileName) throws Exception {
        Iterable<Result<Item>> results = minioClient.listObjects(
                ListObjectsArgs.builder()
                               .bucket(OUTGOING_ATTACHMENTS_BUCKET)
                               .build()
        );

        for (Result<Item> result: results) {
            if (expectedFileName.equals(result.get().objectName())) {
                return true;
            }
        }

        return false;
    }
}
