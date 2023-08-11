package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;

import java.io.File;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryPermissionsStepsDefinitions.DEFAULT_LIBRARY;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;

public class FilesStepDefinitions extends BaseStepsDefinitions {

    public static UUID firstFileId;
    public static UUID secondFileId;
    public static UUID currentFileId;
    public static String currentFilePath;

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
        assertEquals(DEFAULT_LIBRARY, table);
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
        File testFile = new File("src/test/resources/ru/mycrg/acceptance/resources/" + fileName);
        if (!testFile.exists()) {
            throw new IllegalStateException("Not exist test resource: " + fileName);
        }

        List<UUID> ids = createFiles(new File[]{testFile});
        currentFileId = ids.get(0);

        getFile(currentFileId);
        currentFilePath = jsonPath.getString("path");
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

    @Given("Первый файл перемещён из временного хранилища в соответствующую директорию")
    public void checkFirstFilePlaceInCorrectDirectory() {
        getFile(firstFileId);
        String firstFilePath = jsonPath.getString("path");

        String organizationDir = "organization_" + orgId;

        assertTrue(firstFilePath.toLowerCase().contains(organizationDir));
        assertTrue(firstFilePath.toLowerCase().contains("library_record"));
        assertTrue(firstFilePath.toLowerCase().contains(DEFAULT_LIBRARY));
    }

    @Given("Существует GML файл")
    public void createGmlFile() {
        File testGml = new File("src/test/resources/ru/mycrg/acceptance/resources/correct.gml");

        List<UUID> ids = createFiles(new File[]{testGml});
        currentFileId = ids.get(0);
    }

    private void getFile(UUID firstFileId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + firstFileId);

        jsonPath = response.jsonPath();
    }

    private void downloadFile(UUID fileId) {
        String url = String.format("/%s/download", fileId);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(url);
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
