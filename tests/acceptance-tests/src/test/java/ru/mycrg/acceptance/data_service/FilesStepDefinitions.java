package ru.mycrg.acceptance.data_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import org.hamcrest.core.IsEqual;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgFileMetadata;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsBaseDto;
import ru.mycrg.data_service_contract.dto.FileDescription;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

import static java.lang.Boolean.TRUE;
import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.data_service.CurrentFilesManager.getFileDescription;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentLibrary;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;
import static ru.mycrg.common_contracts.enums.GpkgContentsDataType.ATTRIBUTES;

public class FilesStepDefinitions extends BaseStepsDefinitions {

    public static UUID firstFileId;
    public static UUID secondFileId;
    public static UUID currentFileId;
    public static String currentFilePath;
    public static List<FileDescriptionModel> currentFiles = new ArrayList<>();

    public static File contextFile;
    public static String contextFileName;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    private final File firstFile = TestFilesManager.getFile("100b.png");
    private final File secondFile = TestFilesManager.getFile("correct.gml");
    private final File thirdFile = TestFilesManager.getFile("correct.gml");

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data/files");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/files");
    }

    @Given("Загружен произвольный файл")
    public void loadAnyFile() {
        List<UUID> ids = createFiles(new File[]{firstFile});

        firstFileId = ids.get(0);

        getFile(firstFileId);
        currentFilePath = jsonPath.getString("path");
    }

    @Given("Загружены файлы {string}")
    public void loadAnyFiles(String fileNamesInString) {
        currentFiles.clear();

        Arrays.stream(fileNamesInString.split(","))
              .map(String::trim)
              .forEach(fileName -> {
                  File file = TestFilesManager.getFile(fileName);
                  List<UUID> ids = createFiles(new File[]{file});

                  currentFiles.add(new FileDescriptionModel(ids.getFirst(), file.getTotalSpace(), fileName));
              });

        assertEquals(currentFiles.size(), fileNamesInString.split(",").length);
    }

    @Given("я загрузил на сервер файл {string}")
    public void currentUserLoadFile(String fileName) {
        currentFiles.clear();

        File file = TestFilesManager.getFile(fileName);
        List<UUID> ids = createFiles(new File[]{file});

        currentFiles.add(new FileDescriptionModel(ids.get(0), file.getTotalSpace(), fileName));

        currentFileId = ids.get(0);

        assertEquals(1, currentFiles.size());
    }

    @Given("файл {string} подписан подписью {string}")
    public void fileSigned(String baseFileName, String ecpFileName) {
        signFile(
                getFileDescription(baseFileName).getId(),
                TestFilesManager.getFile(ecpFileName));
    }

    @Given("Пользователь скачивает полученный файл")
    public void downloadResponseLikeFile() throws IOException {
        byte[] fileData = response.asByteArray();

        File tempDirFile = TestFilesManager.createTempTestResourcesDirectoryIfNotExist();

        String fileName = "downloaded_" + System.currentTimeMillis() + ".zip";
        contextFile = new File(tempDirFile, fileName);

        Files.write(contextFile.toPath(), fileData);

        contextFileName = fileName;

        // Log the absolute path for debugging
        System.out.println("Downloaded file saved to: " + contextFile.getAbsolutePath());
    }

    @Given("подпись файла {string} имеет размер {int}")
    public void checkFileSignature(String baseFileName, Integer signSize) {
        downloadEcp(getFileDescription(baseFileName).getId());

        assertEquals(SC_OK, response.getStatusCode());
        assertEquals((int) signSize, response.asByteArray().length);
        assertEquals("application/pgp-signature", response.getContentType());
    }

    @When("я подписываю файл {string} подписью {string}")
    public void signFile(String baseFileName, String ecpFileName) {
        signFile(
                getFileDescription(baseFileName).getId(),
                TestFilesManager.getFile(ecpFileName));
    }

    @Then("файл успешно подписан")
    public void fileSignedSuccessfully() {
        assertEquals(200, response.getStatusCode());
    }

    @Given("догружены новые файлы {string}")
    public void loadMoreFiles(String fileNamesInString) {
        Arrays.stream(fileNamesInString.split(","))
              .map(String::trim)
              .forEach(fileName -> {
                  File file = TestFilesManager.getFile(fileName);
                  List<UUID> ids = createFiles(new File[]{file});

                  currentFiles.add(new FileDescriptionModel(ids.get(0), file.getTotalSpace(), fileName));
              });
    }

    @Given("ECP догружен заново {string}")
    public void loadEcpAgain(String ecpFileName) {
        currentFiles.removeIf(item -> item.getTitle().equals(ecpFileName));

        File file = TestFilesManager.getFile(ecpFileName);
        List<UUID> ids = createFiles(new File[]{file});

        currentFiles.add(new FileDescriptionModel(ids.get(0), file.getTotalSpace(), ecpFileName));
    }

    @Given("я скачиваю группу файлов архивом, передав главный файл группы: {string}")
    public void downloadArchiveStep(String mainFileName) {
        downloadArchive(getFileDescription(mainFileName).getId());
    }

    @Given("я скачиваю ЭЦП файла {string}")
    public void downloadOnlyEcp(String fileName) {
        downloadEcp(getFileDescription(fileName).getId());
    }

    @Given("я скачиваю архивом файл {string} c ЭЦП")
    public void downloadFileWithEcpAsZip(String fileName) {
        downloadFileWithEcp(getFileDescription(fileName).getId());
    }

    @Given("я скачиваю группу файлов архивом с ЭЦП, передав главный файл группы: {string}")
    public void downloadGroupWithEcp(String baseFileName) {
        downloadGroupWithEcp(getFileDescription(baseFileName).getId());
    }

    @Given("я скачиваю группу файлов архивом, передав не корректный идентификатор файла: {string}")
    public void downloadArchiveIncorrectly(String incorrectFileName) {
        downloadArchive(getFileDescription(incorrectFileName).getId());
    }

    @Given("архив успешно скачан в полном объеме: {int} байт")
    public void downloadArchiveStep(Integer bytes) {
        assertEquals(SC_OK, response.getStatusCode());
        assertEquals("application/zip", response.getContentType());
        assertEquals((int) bytes, response.asByteArray().length);
    }

    @Given("ЭЦП успешно скачан в полном объеме: {int} байт")
    public void checkEcpStep(Integer bytes) {
        assertEquals(SC_OK, response.getStatusCode());
        assertEquals((int) bytes, response.asByteArray().length);
        assertEquals("application/pgp-signature", response.getContentType());
    }

    @Given("файл и ЭЦП успешно скачаны в полном объеме: {int} байт")
    public void checkFileWithEcpStep(Integer bytes) {
        assertEquals(SC_OK, response.getStatusCode());
        assertEquals((int) bytes, response.asByteArray().length);
        assertEquals("application/zip", response.getContentType());
    }

    @Given("Пользователем создано три файла")
    public void create3FilesAsCurrentUser() {
        authorizationBase.loginAsCurrentUser();

        List<UUID> ids = createFiles(new File[]{firstFile, secondFile, thirdFile});

        firstFileId = ids.get(0);
        secondFileId = ids.get(1);
    }

    @Given("Создано три файла")
    public void create3Files() {
        List<UUID> ids = createFiles(new File[]{firstFile, secondFile, thirdFile});

        firstFileId = ids.get(0);
        secondFileId = ids.get(1);
    }

    @When("Отправляется корректный запрос на создание файла")
    public void createFilesForAnyRecordInDefaultLibrary() {
        createFiles(new File[]{firstFile});
    }

    @When("Отправляется корректный запрос на создание 2-х файлов")
    public void createTwoFilesForAnyRecordInDefaultLibrary() {
        createFiles(new File[]{firstFile, secondFile});
    }

    @And("Сервер возвращает тело созданной сущности, поля сущности корректно заполнены")
    public void checkReturnedFileBody() {
        List<Object> objects = response.jsonPath().getList("");
        LinkedHashMap<String, Object> firstObj = (LinkedHashMap<String, Object>) objects.get(0);

        assertEquals("100b.png", firstObj.get("title"));
        assertNotNull(firstObj.get("createdAt"));
        assertEquals("png", firstObj.get("extension"));
        assertNotNull(firstObj.get("createdBy"));
        assertNotNull(firstObj.get("id"));
        assertNotNull(firstObj.get("size"));
    }

    @And("Файл лежит во временном хранилище")
    public void checkFilePlaceInTrashDirectory() {
        assertTrue(currentFilePath.toLowerCase().contains("trash"));
    }

    @And("Количество возвращенных сущностей файлов: {string}")
    public void checkCountsReturnedFiles(String count) {
        List<Object> returnedObjects = response.jsonPath().getList("");

        assertEquals(Integer.parseInt(count), returnedObjects.size());
    }

    @When("Пользователь делает запрос на скачивание загруженного файла")
    public void downloadFirstFile() {
        downloadFile(firstFileId);
    }

    @When("файл {string} скачивается")
    public void fileSuccessfullyDownload(String fileName) {
        downloadFile(getFileDescription(fileName).getId());

        assertEquals(200, response.getStatusCode());
    }

    @When("Пользователь делает запрос на скачивание файла с ID: {string}")
    public void tryDownloadFileByID(String fileId) {
        downloadFile(UUID.fromString(fileId));
    }

    @Then("Оба файла доступны")
    public void getFileById() {
        getFile(firstFileId);
        assertEquals(firstFileId.toString(), jsonPath.get("id"));

        getFile(secondFileId);
        assertEquals(secondFileId.toString(), jsonPath.get("id"));
    }

    @Then("Квалификатор второго файла корректно ссылается на созданную запись в библиотеке")
    public void checkQualifierForSecondFileForLibrary() {
        getFile(secondFileId);

        int recordId = jsonPath.getInt("resourceQualifier.recordId");
        String table = jsonPath.getString("resourceQualifier.table");
        String resourceType = jsonPath.getString("resourceType");

        assertEquals(currentDocumentId.intValue(), recordId);
        assertEquals(currentLibrary.getTableName(), table);
        assertEquals("LIBRARY_RECORD", resourceType);
    }

    @Then("Квалификатор второго файла корректно ссылается на созданную запись в слое")
    public void checkQualifierForSecondFileForTable() {
        getFile(secondFileId);

        int recordId = jsonPath.getInt("resourceQualifier.recordId");
        String table = jsonPath.getString("resourceQualifier.table");
        String resourceType = jsonPath.getString("resourceType");

        // TODO: дать второй записи уникальный title и по нему искать
        assertEquals(1, recordId);
        assertEquals(currentTableName, table);
        assertEquals("FEATURE", resourceType);
    }

    @Then("Квалификаторы у других файлов остались незаполненными")
    public void checkQualifierEmptiness() {
        getFile(firstFileId);

        String resourceQualifier = jsonPath.getString("resourceQualifier");
        String resourceType = jsonPath.getString("resourceType");

        assertNull(resourceQualifier);
        assertNull(resourceType);
    }

    @Then("файлы принадлежащие этой записи НЕ удаляются")
    public void checkThenFileAreNotDeleted() throws InterruptedException {
        sleep(800);

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + secondFileId)
                .then().
                        statusCode(SC_OK);
    }

    @Given("Существует файл {string}")
    public void createFile(String fileName) {
        File testFile = TestFilesManager.getFile(fileName);

        List<UUID> ids = createFiles(new File[]{testFile});
        currentFileId = ids.getFirst();

        getFile(currentFileId);

        currentFilePath = jsonPath.getString("path");
        Long size = jsonPath.getLong("size");

        currentFiles.add(new FileDescriptionModel(currentFileId, size, fileName));
    }

    @Given("Существуют файлы")
    public void createFiles(DataTable dataTable) {
        currentFiles.clear();

        dataTable.asList()
                 .forEach(fileName -> {
                     File file = TestFilesManager.getFile(fileName);
                     List<UUID> ids = createFiles(new File[]{file});

                     getFile(ids.get(0));

                     currentFiles.add(new FileDescriptionModel(ids.get(0), 314314L, fileName));
                 });
    }

    @Given("Файл доступен")
    public void createFile() {
        getFile(currentFileId);
        currentFilePath = jsonPath.getString("path");

        assertEquals(currentFileId.toString(), jsonPath.get("id"));
    }

    @Given("я запрашиваю атрибуты текущего файла")
    public void getFileAttributes() {
        getFile(currentFileId);
        currentFilePath = jsonPath.getString("path");

        assertEquals(currentFileId.toString(), jsonPath.get("id"));
    }

    @Given("Файл перемещён из временного хранилища в соответствующую директорию")
    public void checkFilePlaceInCorrectDirectory() {
        String organizationDir = "organization_" + orgId;

        assertTrue(currentFilePath.toLowerCase().contains(organizationDir));
        assertTrue(currentFilePath.toLowerCase().contains("feature"));
        assertTrue(currentFilePath.toLowerCase().contains(currentTableName));
    }

    @Given("я запрашиваю информацию о файле {string}")
    public void getFileInfo(String fileName) {
        getFile(getFileDescription(fileName).getId());
    }

    @Given("я из документа запрашиваю информацию о файле {string}")
    public void getFileInfoFromDocument(String fileName) {
        try {
            // Получаем список файлов из ответа
            List<Map<String, Object>> files = response.jsonPath().getList("file");

            // Ищем нужный файл по имени
            Optional<Map<String, Object>> targetFile = files.stream()
                                                            .filter(file -> fileName.equals(file.get("title")))
                                                            .findFirst();

            if (targetFile.isEmpty()) {
                throw new RuntimeException("Файл " + fileName + " не найден");
            }

            // Создаем FileDescriptionModel и добавляем в currentFiles
            Map<String, Object> fileInfo = targetFile.get();
            UUID fileId = UUID.fromString(fileInfo.get("id").toString());
            Long fileSize = Long.valueOf(fileInfo.get("size").toString());
            currentFiles.add(new FileDescriptionModel(fileId, fileSize, fileName));

            // Получаем информацию о файле через стандартный метод
            getFile(getFileDescription(fileName).getId());
        } catch (Exception e) {
            throw new RuntimeException("Процесс полупения данных сломался: " + e.getMessage(), e);
        }
    }

    @Given("я отправляю запрос на проверку соответствия файла {string} подписи {string}")
    public void verifyFileByEcpStep(String baseFileName, String ecpFileName) {
        FileDescriptionModel baseFile = getFileDescription(baseFileName);
        FileDescriptionModel ecpFile = getFileDescription(ecpFileName);

        verifyFileByEcp(baseFile, ecpFile);
    }

    @Given("подпись соответствует файлу, подписант: {string}")
    public void checkVerifyResult(String signer) {
        response.then()
                .statusCode(SC_OK)
                .body("signer[0]", IsEqual.equalTo(signer),
                      "code[0]", IsEqual.equalTo("0x00000000"),
                      "verified[0]", IsEqual.equalTo(TRUE));
    }

    @Given("файл подписан")
    public void checkFileSignature() {
        assertTrue(jsonPath.getBoolean("signed"));
    }

    @Then("загруженный файл {string} запрашивается пользователем {string}")
    public void checkFileAsUser(String fileName, String userName) {
        UserCreateDto user = getUserByName(userName);
        authorizationBase.loginAs(user.getEmail(), user.getPassword());

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + getFileDescription(fileName).getId());
    }

    @Then("файл лежит в библиотеке по-умолчанию")
    public void currentFilePathCheck() {
        getFile(currentFiles.get(0).getId());

        String filePath = response.jsonPath().getString("path");

        assertFalse("Файл не должен лежать в 'trash'", filePath.contains("trash"));
        assertTrue("Файл должен содержать в пути 'library_record/dl_default'",
                   filePath.contains("library_record" + "/dl_default"));
    }

    @And("другие поля файла корректно заполнены")
    public void currentQualifierCheck() {
        getFile(currentFiles.get(0).getId());

        String fileResourceType = response.jsonPath().getString("resourceType");
        String fileResourceQualifier = response.jsonPath().getString("resourceQualifier");

        assertFalse("Файл должен иметь заполненный 'resourceType'", fileResourceType.isEmpty());
        assertFalse("Файл должен иметь заполненный 'resourceQualifier'", fileResourceQualifier.isEmpty());
    }

    @And("файл успешно удалён")
    public void checkFileDelete() {
        getFile(currentFiles.get(0).getId());
        assertEquals(SC_NOT_FOUND, response.statusCode());
    }

    @When("я запрашиваю метаданные текущего файла")
    public void fetchCurrentFileMetadataAsCurrentUser() {
        getFileMetadata(currentFileId);
    }

    @When("я запрашиваю метаданные не существующего файла")
    public void fetchNotExistFileMetadataAsCurrentUser() {
        getFileMetadata(UUID.randomUUID());
    }

    @When("я запрашиваю метаданные файла с невалидным UUID")
    public void incorrectFetchFileMetadataAsCurrentUser() {
        getFileMetadata(null);
    }

    @When("я вижу, что некорректный GPKG файл отклонен сервером с корректной формулировкой ошибки")
    public void checkErrorResponseFromIncorrectGpkg() {
        assertEquals(400, response.getStatusCode());
        checkResponseValue("message",
                           "Ошибка при получении информации из GPKG: " +
                                   "Файл broken.gpkg не является корректным GPKG файлом");
    }

    @And("размер скаченного файла равен {int}")
    public void checkFileResponseSize(int fileSize) {
        assertEquals(fileSize, response.asByteArray().length);
    }

    @And("я получаю метаданные текущего файла в ожидаемом формате")
    public void checkFileMetadata() {
        try {
            GpkgFileMetadata metadata = response.jsonPath().getObject("", GpkgFileMetadata.class);

            assertNotNull("Это база! Данные должны быть!", metadata);
            assertNotNull("Поле 'id' не должно быть null", metadata.getId());

            FileDescriptionModel currentFile = getFileDescription(currentFileId);
            switch (currentFile.getTitle()) {
                case "onePolygonAllTypesWithoutGenerated.gpkg":
                    checkOnePolygonAllTypesWithoutGenerated(metadata);
                    break;
                case "emptyVector.gpkg":
                    checkThatTablesAreEmpty(metadata);
                    break;
                case "zolotopolenskoe_sp.tif":
                    break;
                default:
                    throw new IllegalStateException(
                            "Для файла " + currentFile.getTitle() + " не прописана проверка метаданных");
            }
        } catch (Throwable th) {
            response.prettyPrint();

            throw th;
        }
    }

    @When("я скачиваю файл из поля {string}")
    public void downloadFileFromField(String field) {
        List<FileDescription> description = response.jsonPath().getList("content[0].properties." + field,
                                                                        FileDescription.class);
        UUID id = description.get(0).getId();

        downloadFile(id);
    }

    public void downloadFile(UUID fileId) {
        downloadFile(String.format("/%s/download", fileId));
    }

    public void getFile(UUID id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + id);

        jsonPath = response.jsonPath();
    }

    private void checkOnePolygonAllTypesWithoutGenerated(GpkgFileMetadata metadata) {
        assertNotNull("Поле 'payload' не должно быть null", metadata.getPayload());
        assertTrue("Поле 'payload' должно быть списком", metadata.getPayload() instanceof List);

        List<GpkgContentsBaseDto> tables = metadata.getPayload();
        assertFalse("Список таблиц не должен быть пустым", tables.isEmpty());

        for (GpkgContentsBaseDto table: tables) {
            assertNotNull("Таблица должна содержать поле 'dataType'", table.getDataType());
            assertNotNull("Таблица должна содержать поле 'tableName'", table.getTableName());
            assertNotNull("Объект таблицы должен быть корректно десериализован", table);
        }
    }

    private void checkThatTablesAreEmpty(GpkgFileMetadata metadata) {
        assertNotNull("Поле 'payload' не должно быть null", metadata.getPayload());
        assertTrue("Поле 'payload' должно быть списком", metadata.getPayload() instanceof List);

        List<GpkgContentsBaseDto> tables = metadata.getPayload();
        long count = tables.stream().filter(t -> t.getDataType() == ATTRIBUTES).count();

        assertEquals("Список таблиц должен содержать только системные таблицы", tables.size(), count);
    }

    private void getFileMetadata(UUID id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                       get("/" + id + "/metadata");

        jsonPath = response.jsonPath();
    }

    private void downloadArchive(UUID mainFileId) {
        downloadFile(String.format("/%s/download/zip", mainFileId));
    }

    private void downloadGroupWithEcp(UUID fileId) {
        downloadFile(String.format("/%s/download/zip/with-ecp", fileId));
    }

    private void downloadEcp(UUID fileId) {
        downloadFile(String.format("/%s/download/ecp", fileId));
    }

    private void downloadFileWithEcp(UUID fileId) {
        downloadFile(String.format("/%s/download/with-ecp", fileId));
    }

    private void downloadFile(String url) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(url);
    }

    private void verifyFileByEcp(FileDescriptionModel baseFile, FileDescriptionModel ecpFile) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + baseFile.getId() + "/verify/" + ecpFile.getId());
    }

    private void signFile(UUID baseFileId, File ecp) {
        RequestSpecification requestSpecification = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("sign", ecp);

        response = requestSpecification.post("/" + baseFileId + "/sign");
    }

    private List<UUID> createFiles(File[] files) {
        RequestSpecification requestSpecification = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data");

        for (File file: files) {
            requestSpecification.multiPart("files", file);
        }

        response = requestSpecification
                .when().
                        post();

        try {
            List<UUID> ids = response.jsonPath().getList("id", UUID.class);
            if (ids != null && !ids.isEmpty()) {
                return ids;
            } else {
                return new ArrayList<>();
            }
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
