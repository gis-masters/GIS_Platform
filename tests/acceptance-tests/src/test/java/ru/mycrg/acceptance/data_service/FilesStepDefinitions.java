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

import java.io.File;
import java.util.*;

import static java.lang.Boolean.TRUE;
import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.data_service.TestFilesManager.getFileDescriptionByTitleOrThrow;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentLibrary;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;

public class FilesStepDefinitions extends BaseStepsDefinitions {

    public static UUID firstFileId;
    public static UUID secondFileId;
    public static UUID currentFileId;
    public static String currentFilePath;
    public static List<FileDescriptionModel> currentFiles = new ArrayList<>();

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    private final File firstFile = new File("src/test/resources/ru/mycrg/acceptance/resources/100b.png");
    private final File secondFile = new File("src/test/resources/ru/mycrg/acceptance/resources/correct.gml");
    private final File thirdFile = new File("src/test/resources/ru/mycrg/acceptance/resources/gpzu.xml");

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

                  currentFiles.add(new FileDescriptionModel(ids.get(0), file.getTotalSpace(), fileName));
              });

        assertEquals(currentFiles.size(), fileNamesInString.split(",").length);
    }

    @Given("я загрузил на сервер файл {string}")
    public void currentUserLoadFile(String fileName) {
        currentFiles.clear();

        File file = TestFilesManager.getFile(fileName);
        List<UUID> ids = createFiles(new File[]{file});

        currentFiles.add(new FileDescriptionModel(ids.get(0), file.getTotalSpace(), fileName));

        assertEquals(1, currentFiles.size());
    }

    @Given("файл {string} подписан подписью {string}")
    public void fileSigned(String baseFileName, String ecpFileName) {
        signFile(
                getFileDescriptionByTitleOrThrow(baseFileName).getId(),
                new File("src/test/resources/ru/mycrg/acceptance/resources/" + ecpFileName));
    }

    @Given("подпись файла {string} имеет размер {int}")
    public void checkFileSignature(String baseFileName, Integer signSize) {
        downloadEcp(getFileDescriptionByTitleOrThrow(baseFileName).getId());

        assertEquals(SC_OK, response.getStatusCode());
        assertEquals((int) signSize, response.asByteArray().length);
        assertEquals("application/pgp-signature", response.getContentType());
    }

    @When("я подписываю файл {string} подписью {string}")
    public void signFile(String baseFileName, String ecpFileName) {
        signFile(
                getFileDescriptionByTitleOrThrow(baseFileName).getId(),
                new File("src/test/resources/ru/mycrg/acceptance/resources/" + ecpFileName));
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
        downloadAsArchive(mainFileName);
    }

    @Given("я скачиваю ЭЦП файла {string}")
    public void downloadOnlyEcp(String fileName) {
        downloadEcp(getFileDescriptionByTitleOrThrow(fileName).getId());
    }

    @Given("я скачиваю архивом файл {string} c ЭЦП")
    public void downloadFileWithEcpAsZip(String fileName) {
        downloadFileWithEcp(getFileDescriptionByTitleOrThrow(fileName).getId());
    }

    @Given("я скачиваю группу файлов архивом с ЭЦП, передав главный файл группы: {string}")
    public void downloadGroupWithEcp(String baseFileName) {
        downloadGroupWithEcp(getFileDescriptionByTitleOrThrow(baseFileName).getId());
    }

    @Given("я скачиваю группу файлов архивом, передав не корректный идентификатор файла: {string}")
    public void downloadArchiveIncorrectly(String incorrectFileName) {
        downloadAsArchive(incorrectFileName);
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

    @And("Сообщение об отсутствии files составлено верно")
    public void checkBadRequestMessage_files() {
        super.checkResponseValue("message", "Требуемая часть запроса 'files' отсутствует");
    }

    @And("Сообщение об отсутствии body составлено верно")
    public void checkBadRequestMessage_body() {
        super.checkResponseValue("message", "Требуемая часть запроса 'body' отсутствует");
    }

    @And("Сообщение о несовпадении соответствует ожидаемому")
    public void checkBadRequestMessageMismatch() {
        super.checkResponseValue("message", "Данные не совпадают с переданными файлами");
    }

    @And("Сообщение о недопустимом типе ресурса соответствует ожидаемому")
    public void checkBadRequestMessageUnsupportedResourceType() {
        super.checkResponseValue("message", "Допустимыми типами 'resourceType' являются: TABLE, RECORD");
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

    @When("DXF файл скачивается")
    public void downloadCurrentFile() {
        downloadFile(currentFileId);

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

    @Then("файлы принадлежащие этой записи также удалены")
    public void checkThenFileAreDeleted() throws InterruptedException {
        sleep(800);

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + secondFileId)
                .then().
                        statusCode(SC_NOT_FOUND).
                        body("message",
                             equalTo("Ресурс не найден по идентификатору: " + secondFileId));
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
        currentFileId = ids.get(0);

        getFile(currentFileId);
        currentFilePath = jsonPath.getString("path");
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

    @Given("Файл перемещён из временного хранилища в соответствующую директорию")
    public void checkFilePlaceInCorrectDirectory() {
        String organizationDir = "organization_" + orgId;

        assertTrue(currentFilePath.toLowerCase().contains(organizationDir));
        assertTrue(currentFilePath.toLowerCase().contains("feature"));
        assertTrue(currentFilePath.toLowerCase().contains(currentTableName));
    }

    @Given("я запрашиваю информацию о файле {string}")
    public void getFileInfo(String fileName) {
        getFile(getFileDescriptionByTitleOrThrow(fileName).getId());
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
            getFile(getFileDescriptionByTitleOrThrow(fileName).getId());
        } catch (Exception e) {
            throw new RuntimeException("Процесс полупения данных сломался: " + e.getMessage(), e);
        }
    }

    @Given("я отправляю запрос на проверку соответствия файла {string} подписи {string}")
    public void verifyFileByEcpStep(String baseFileName, String ecpFileName) {
        FileDescriptionModel baseFile = getFileDescriptionByTitleOrThrow(baseFileName);
        FileDescriptionModel ecpFile = getFileDescriptionByTitleOrThrow(ecpFileName);

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

    @Given("Существует GML файл")
    public void createGmlFile() {
        File testGml = new File("src/test/resources/ru/mycrg/acceptance/resources/correct.gml");

        List<UUID> ids = createFiles(new File[]{testGml});
        currentFileId = ids.get(0);
    }

    @Then("загруженный файл {string} запрашивается пользователем {string}")
    public void checkFileAsUser(String fileName, String userName) {
        UserCreateDto user = getUserByName(userName);
        authorizationBase.loginAs(user.getEmail(), user.getPassword());

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + getFileDescriptionByTitleOrThrow(fileName).getId());
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

    private void getFile(UUID id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + id);

        jsonPath = response.jsonPath();
    }

    private void downloadFile(UUID fileId) {
        downloadFile(String.format("/%s/download", fileId));
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

    private void downloadAsArchive(String fileName) {
        downloadArchive(getFileDescriptionByTitleOrThrow(fileName).getId());
    }
}
