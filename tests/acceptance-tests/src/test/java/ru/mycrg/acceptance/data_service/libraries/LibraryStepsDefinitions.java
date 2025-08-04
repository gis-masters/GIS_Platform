package ru.mycrg.acceptance.data_service.libraries;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.auth_service.UserStepsDefinitions;
import ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.*;
import ru.mycrg.acceptance.data_service.dto.schemas.SchemaDto;
import ru.mycrg.acceptance.data_service.schemas.CurrentScenarioSchema;
import ru.mycrg.data_service_contract.dto.DocumentVersioningDto;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Thread.sleep;
import static java.util.Objects.nonNull;
import static java.util.stream.IntStream.range;
import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.CommonStepDefinitions.checkSorting;
import static ru.mycrg.acceptance.Config.DATE_TIME_FORMAT;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.*;
import static ru.mycrg.acceptance.data_service.libraries.LibraryPermissionsStepsDefinitions.*;

public class LibraryStepsDefinitions extends LibraryBaseRecords {

    public static LibraryModel currentLibrary;
    public static LibraryModel currentLibraryWithVersioningModel;

    public static Integer currentDocumentId;
    public static Integer deletedDocumentId;
    public static Integer currentFolderId;
    public static DefaultDocumentModel currentDocument;
    public static LocalDateTime currentRecordLastModified;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();
    private final DatasetsStepsDefinitions datasetsStepsDefinitions = new DatasetsStepsDefinitions();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data/document-libraries");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/document-libraries");
    }

    @When("Администратор организации делает запрос на создание библиотеки документов")
    public void createDocumentLibraryByAdminStep() {
        authorizationBase.loginAsOwner();

        createOrGetDocumentLibrary(CurrentScenarioSchema.getCurrentSchema().getTitle(), false);
    }

    @When("Текущий пользователь делает запрос на создание библиотеки документов по текущей схеме")
    public void createDocumentLibraryByUser() {
        createLibrary(CurrentScenarioSchema.getCurrentSchema().getName(), false);
    }

    @When("Существует библиотека документов")
    public void createRandomDocumentLibraryByAdmin() {
        createDocumentLibraryByAdminStep();
    }

    @Given("Существует библиотека документов, созданная по схеме {string}")
    public void createDocumentLibraryBySchema(String schemaTitle) {
        createOrGetDocumentLibrary(schemaTitle, false);
    }

    @When("Существует библиотека документов с включённым версионированием")
    public void createDocumentLibraryWithVersioning() {
        if (Objects.isNull(currentLibraryWithVersioningModel)) {
            createOrGetDocumentLibrary(CurrentScenarioSchema.getCurrentSchema().getTitle(), true);

            currentLibraryWithVersioningModel = extractCurrentLibraryModel();
        }
    }

    @And("Текущая библиотека документов существует в БД")
    public void currentDatasetExist() {
        getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentLibrary.getTableName())
                .then().
                        statusCode(SC_OK);
    }

    @When("Администратор организации делает запрос на удаление текущей библиотеки документов")
    public void deleteCurrentDocumentLibrary() {
        authorizationBase.loginAsOwner();

        getBaseRequestWithCurrentCookie()
                .when().
                        delete("/" + currentLibrary.getTableName())
                .then().
                        statusCode(SC_NO_CONTENT);
    }

    @When("пользователь делает выборку всех документов в виде реестра")
    public void fetchAsRegistry() {
        getRecordsAsRegistry(
                "((is_folder+IN(false)+OR+is_folder+IS+null))+AND+(((path+LIKE+'/root/%'))+OR+((path+=+'/root')))",
                DEFAULT_LIBRARY);

        assertEquals(200, response.statusCode());
    }

    @When("в выборке отсутствуют недоступные пользователю файлы")
    public void checkAllowedFiles() {
        List<Map<String, Object>> records = response.jsonPath().getList("content.content");

        if (nonNull(records)) {
            boolean isFileExist = records
                    .stream()
                    .anyMatch(stringObjectMap -> !parseBoolean(stringObjectMap.get("is_folder").toString()));

            assertFalse(isFileExist);
        }
    }

    @When("Пользователь удаляет запись в библиотеке")
    public void deleteLibraryDocument() {
        deleteRecordFromDefaultLibrary(currentDocumentId, currentLibrary.getTableName());

        assertEquals(204, response.getStatusCode());
    }

    @Given("Текущая запись была удалена")
    public void currentLibraryRecordWasDeleted() {
        deletedDocumentId = currentDocumentId;
        deleteRecordFromDefaultLibrary(deletedDocumentId, DEFAULT_LIBRARY);

        assertEquals(204, response.getStatusCode());
    }

    @When("Администратор обновляет запись библиотеки - удаляет файл")
    public void updateLibraryDocument() {
        authorizationBase.loginAsOwner();

        DefaultDocumentModel recordModel = new DefaultDocumentModel("new_title");
        recordModel.setSome_files(new ArrayList<>());

        updateDocument(currentDocumentId, gson.toJson(recordModel), DEFAULT_LIBRARY);
    }

    @When("Пользователь обновляет запись библиотеки - добавляет первый файл")
    public void updateLibraryDocumentWithNewFile() {
        List<FileDescriptionModel> descriptions = new ArrayList<>();
        descriptions.add(new FileDescriptionModel(firstFileId, 314L, "First file"));
        descriptions.add(new FileDescriptionModel(secondFileId, 314L, "Second file"));

        DefaultDocumentModel recordModel = new DefaultDocumentModel(generateString("STRING_4"));
        recordModel.setSome_files(descriptions);

        updateDocument(currentDocumentId, gson.toJson(recordModel), DEFAULT_LIBRARY);
    }

    @Given("В библиотеке по-умолчанию существует запись")
    public void initRecordInDefaultLibrary() throws InterruptedException {
        String body = String.format("{\"title\":\"%s\"}", generateString("STRING_10"));
        createDocumentAndWriteAsCurrent(body, DEFAULT_LIBRARY);

        sleep(800);

        assertEquals(201, response.getStatusCode());
    }

    @Given("В библиотеке документов {string} существует запись")
    public void initRecordInTargetLibrary(String targetLibrary) throws InterruptedException {
        String body = String.format("{\"title\":\"%s\"}", generateString("STRING_10"));
        createDocumentAndWriteAsCurrent(body, targetLibrary);

        sleep(800);

        assertEquals(201, response.getStatusCode());
    }

    @Given("В библиотеке документов Распределения задач, в папке с id {int}, существует запись")
    public void initRecordInTaskAllocationLibraryInTargetFolder(int targetFolder)
            throws InterruptedException {
        UserStepsDefinitions userStepsDefinitions = new UserStepsDefinitions();
        userStepsDefinitions.getCurrent();

        String path = "/root/" + targetFolder;
        int performerId = 3;
        String targetLibrary = "dl_data_task_allocation";

        String body = String.format("{\"title\":\"%s\", \"performer\": %d, \"path\":\"%s\"}",
                                    generateString("STRING_10"), performerId, path);
        createDocumentAndWriteAsCurrent(body, targetLibrary);

        sleep(400);

        assertEquals(201, response.getStatusCode());
    }

    @Given("В текущей библиотеке существует документ с полем {string} заполненным {string}")
    public void initRecordInCurrentLibraryWithFields(String filedName, String fieldValue) throws InterruptedException {
        String body = String.format("{\"%s\": \"%s\"}", filedName, fieldValue);
        createDocumentAndWriteAsCurrent(body, currentLibrary.getTableName());

        sleep(800);

        assertEquals(201, response.getStatusCode());

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @Given("Текущий пользователь создает документ в текущей библиотеке")
    public void currentUserCreateRecordInCurrentLibrary() {
        createDocumentAndWriteAsCurrent(
                String.format("{\"title\":\"%s\"}", generateString("STRING_10")),
                currentLibrary.getTableName());
    }

    @When("Пользователь создаёт запись в библиотеке с отсылкой на второй файл")
    public void currentUserCreateRecordWithFile() {
        createRecordWithSecondFile();
    }

    @When("Создана запись в библиотеке с отсылкой на второй файл")
    public void currentUserCreateRecordWithFile2() {
        createRecordWithSecondFile();
    }

    @When("Отправляется PUT запрос на обновление текущей записи")
    public void tryUpdateRecordViaPut() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body("{\"title\":\"new title\"}")
                .when().
                        put(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentDocumentId));
    }

    @When("Отправляется запрос на обновление текущей записи с некорректным Content-Type: {string}")
    public void tryUpdateRecordWithDifferentContentType(String contentType) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(contentType).
                        body("{\"title\":\"initial title\"}")
                .when().
                        patch(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentDocumentId));
    }

    @When("к текущему документу прикреплён GML файл")
    public void addCurrentFileToCurrentDocument() {
        currentDocument = new DefaultDocumentModel("Тестовое имя документа" + generateString("STRING_4"));
        currentDocument.addFile(new FileDescriptionModel(currentFileId, 314L, "Some GML file"));

        updateCurrentDocument(gson.toJson(currentDocument));
    }

    @When("к текущему документу прикреплён GML файл: {string}")
    public void addSomeFileToCurrentDocument(String fileName) {
        currentDocument = new DefaultDocumentModel(fileName + generateString("STRING_4"));
        currentDocument.addFile(new FileDescriptionModel(currentFileId, 314L, fileName));

        updateCurrentDocument(gson.toJson(currentDocument));
    }

    @When("создан новый набор данных, с таблицами в нём")
    public void checkDatasetIsCreated() {
        datasetsStepsDefinitions.getDatasetsByFilter("title", currentDocument.getTitle());
    }

    @When("Пользователь делает запрос на обновление текущей записи")
    public void updateCurrentRecord() throws InterruptedException {
        sleep(1000);

        updateDocument(currentDocumentId, gson.toJson(new DefaultDocumentModel("new title")), DEFAULT_LIBRARY);
    }

    @When("Пользователь обновил поле {string} в текущем документе в текущей библиотеке значением {string}")
    public void updateCurrentDocument(String filedName, String fieldValue) {
        updateDocument(currentDocumentId,
                       String.format("{\"%s\": \"%s\"}", filedName, fieldValue),
                       currentLibrary.getTableName());
    }

    @When("Пользователь делает запрос на обновление текущей записи передавая несуществующий атрибут")
    public void tryUpdateRecordWithNotExistAttributes() {
        updateDocument(currentDocumentId, "{\"not_exist_attribute\": \"some\"}", DEFAULT_LIBRARY);
    }

    @When("Пользователь делает запрос на обновление текущей записи передавая несуществующий в базе данных атрибут")
    public void tryUpdateRecordWithNotExistAttributesInDB() {
        updateDocument(currentDocumentId, "{\"test\": \"test\"}", DEFAULT_LIBRARY);
    }

    @And("Запись успешно обновлена")
    public void checkRecord() {
        getCurrentDocument(DEFAULT_LIBRARY);

        String newTitle = response.jsonPath().get("title");

        assertEquals("new title", newTitle);
    }

    @Then("Поле 'guid' было автоматически сгенерировано")
    public void checkGuidField() {
        getCurrentDocumentInCurrentLibrary();

        String guid = response.jsonPath().get("guid");
        assertTrue(Objects.nonNull(guid));
        assertFalse(guid.isEmpty());
        assertEquals(36, guid.length());
    }

    @Then("Поле {string} заполнилось")
    public void checkFieldNotNull(String field) {
        getCurrentDocument(DEFAULT_LIBRARY);

        Object data = response.jsonPath().get(field);

        System.out.println("-------------- " + data);

        assertNotNull(data);
    }

    @Then("Поле 'last_modified' изменилось")
    public void checkLastModifiedFieldWasChanged() {
        getCurrentDocument(DEFAULT_LIBRARY);

        String lastModified = response.jsonPath().get("last_modified");
        LocalDateTime lastModifiedDate = LocalDateTime.parse(lastModified, DATE_TIME_FORMAT);

        System.out.println("currentRecordLastModified: " + currentRecordLastModified.format(DATE_TIME_FORMAT));
        System.out.println("lastModifiedDate: " + lastModifiedDate.format(DATE_TIME_FORMAT));

        assertEquals(-1, currentRecordLastModified.compareTo(lastModifiedDate));
    }

    @Then("Поле 'updated_by' изменилось")
    public void checkUpdatedByWasChanged() {
        getCurrentDocument(DEFAULT_LIBRARY);

        String updatedBy = response.jsonPath().get("updated_by");

        assertEquals(userDto.getEmail(), updatedBy);
    }

    @Given("В текущей записи хранится текущее время в поле 'last_modified'")
    public void checkLastModifiedFieldInNewRecord() {
        getCurrentDocument(DEFAULT_LIBRARY);

        String lastModified = response.jsonPath().get("last_modified");
        currentRecordLastModified = LocalDateTime.parse(lastModified, DATE_TIME_FORMAT);
    }

    @And("Запись успешно создана")
    public void checkRecordCreation() {
        response.then()
                .body("title", equalTo("test"))
                .body("native_crs", equalTo("EPSG:28406"))
                .body("content_type_id", equalTo("doc_v4"))
                .body("oktmo", equalTo("123123"));
    }

    @And("Тело ответа содержит ошибку о том что данные не были сохранены")
    public void checkErrorMessage() {
        List<Object> errors = response.jsonPath().getList("errors.message");
        assertFalse(errors.isEmpty());

        String errorMessage = errors.get(0).toString();
        assertEquals("В базе данных поле test отсутствует.", errorMessage);
    }

    @And("Тело ответа содержит ошибку о том, что библиотека не является версионируемой")
    public void checkErrorMessageThatLibraryNotVersioned() {
        String error = response.jsonPath().get("message");
        assertTrue(nonNull(error));

        assertTrue(error.contains("Библиотека не является версионируемой"));
    }

    @When("Администратор запрашивает текущую запись")
    public void gelCurrentRecordFromDefaultLibraryAsOwner() {
        authorizationBase.loginAsOwner();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentDocumentId));
    }

    @When("Администратор делает запрос на версии текущего документа из текущей библиотеки")
    public void getVersionRecordFromLibraryAsOwner() {
        authorizationBase.loginAsOwner();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d/versions", currentLibrary.getTableName(), currentDocumentId));
    }

    @When("Администратор делает запрос на версии текущего документа из библиотеки по-умолчанию")
    public void getVersionRecordFromDefaultLibraryAsOwner() {
        authorizationBase.loginAsOwner();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d/versions", DEFAULT_LIBRARY, currentDocumentId));
    }

    @When("Тело ответа содержит версии текущего документа")
    public void responseContainsVersionOfDocument() {
        jsonPath = response.jsonPath();
        List<DocumentVersioningDto> versions = jsonPath.getList("", DocumentVersioningDto.class);
        assertFalse(versions.isEmpty());

        DocumentVersioningDto firstVersion = versions.get(0);
        assertTrue(nonNull(firstVersion.getUpdatedBy()));
        assertTrue(nonNull(firstVersion.getUpdatedTime()));
        assertTrue(nonNull(firstVersion.getContent()));
    }

    @When("В ответе версии текущего документа не заполнены")
    public void responseContainsVersionOfDocumentIsNotFill() {
        jsonPath = response.jsonPath();
        List<DocumentVersioningDto> versions = jsonPath.getList("", DocumentVersioningDto.class);
        assertTrue(versions.isEmpty());
    }

    @When("Тело ответа содержит предыдущие версии изменений текущего документа")
    public void responseContainsAllVersionOfDocument() {
        if (response.statusCode() != 200) {
            throw new IllegalStateException("Предыдущий запрос закончился неудачей");
        }

        String field = "firstproperty";
        jsonPath = response.jsonPath();
        List<DocumentVersioningDto> versions = jsonPath.getList("", DocumentVersioningDto.class);
        assertEquals(2, versions.size());

        versions.forEach(version -> {
            assertTrue(nonNull(version.getUpdatedBy()));
            assertTrue(nonNull(version.getUpdatedTime()));
            assertTrue(nonNull(version.getContent()));
        });
        Map<String, Object> firstVersionContent = versions.get(0).getContent();
        Map<String, Object> secondVersionContent = versions.get(1).getContent();

        assertTrue(firstVersionContent.containsKey(field));
        assertTrue(secondVersionContent.containsKey(field));

        assertEquals("first version", firstVersionContent.get(field));
        assertEquals("second version", secondVersionContent.get(field));
    }

    @When("Отправляется запрос на создание записи в библиотеке по-умолчанию")
    public void createRecordsRequest() {
        createDocumentAndWriteAsCurrent(getRecordBodyForDlDefaultWithCorrectField(), DEFAULT_LIBRARY);
    }

    @When("B библиотеке по-умолчанию существует документ")
    public void createDocumentInDefaultLibrary() {
        createDocumentAndWriteAsCurrent(getRecordBodyForDlDefaultWithCorrectField(), DEFAULT_LIBRARY);
    }

    @When("Пользователь делает запрос на создание записи передавая несуществующий в базе данных атрибут")
    public void tryCreateRecordWithNotExistAttributesInDB() {
        createDocumentAndWriteAsCurrent(getRecordBodyForDlDefaultWithIncorrectField(), DEFAULT_LIBRARY);
    }

    @When("Существует запись в библиотеке на основе растрового файла {string}")
    public void initLibraryRecord(String title) {
        String filePath = "src/test/resources/ru/mycrg/acceptance/resources/zolotopolenskoe_sp.tif";
        String body = "{\"title\": \"" + title + "\",\"content_type_id\": \"doc_v1\",\"native_crs\": \"EPSG:28406\"}";
        File testTif = new File(filePath);

        response = getBaseRequestWithCurrentCookie()
                .given().
                         contentType("multipart/form-data")
                         .multiPart("file", testTif)
                         .multiPart("body", body)
                .when().
                         log().ifValidationFails().
                         post("/" + DEFAULT_LIBRARY + "/records");

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @Given("Существует запись в библиотеке c прикреплённым файлом")
    public void createRecordWithCurrentFileOnDefaultLibrary() {
        String body = "{" +
                "    \"title\": \"DXF file\"," +
                "    \"native_crs\": \"EPSG:28406\"," +
                "    \"some_files\": [" +
                "        {" +
                "            \"id\": \"" + currentFileId + "\"," +
                "            \"title\": \"best.dxf\"," +
                "            \"size\": 314314" +
                "        }" +
                "    ]," +
                "    \"content_type_id\": \"doc_v4\"" +
                "}";

        createDocumentAndWriteAsCurrent(body, DEFAULT_LIBRARY);
        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @Given("Существует запись в библиотеке c прикреплёнными файлами")
    public void createRecordWithFilesOnDefaultLibrary() {
        Map<String, Object> data = new HashMap<>();
        data.put("title", "File placing");
        data.put("content_type_id", "doc_v4");
        data.put("some_files", currentFiles);

        createDocumentAndWriteAsCurrent(gson.toJson(data), DEFAULT_LIBRARY);

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @When("в библиотеке по-умолчанию существует запись c прикреплённым файлом для {string}")
    public void createRecordWithFilesOnDefaultLibraryInDiffProp(String propName) {
        Map<String, Object> data = new HashMap<>();
        data.put("title", "Different properties");
        data.put("content_type_id", "doc_v4");

        data.put(propName, currentFiles);

        createDocumentAndWriteAsCurrent(gson.toJson(data), DEFAULT_LIBRARY);

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @Given("Загруженные файлы подвязаны к текущей записи")
    public void updateRecordWithFilesOnDefaultLibrary() {
        DefaultDocumentModel record = new DefaultDocumentModel("plug-in files");
        record.setSome_files(currentFiles);

        updateDocument(currentDocumentId, gson.toJson(record), DEFAULT_LIBRARY);
    }

    @Given("Загруженные файлы успешно подвязаны к записи в {string}")
    public void updateRecordWithFilesOnListOfLibrary(String libraryName) {
        DefaultDocumentModel record = new SmevLibsDocModel("SmevFiles", null, null, null, currentFiles);
        updateDocument(currentDocumentId, gson.toJson(record), libraryName);

        assertEquals(200, response.getStatusCode());
    }

    @When("я заново пытаюсь подвязать текущую подпись к текущему файлу в текущей записи")
    public void updateRecordWithNewEcpOnDefaultLibrary() {
        DefaultDocumentModel record = new DefaultDocumentModel("plug-in files");

        record.setSome_files(currentFiles);

        updateDocument(currentDocumentId, gson.toJson(record), DEFAULT_LIBRARY);
    }

    @Then("подпись заменена не будет с сообщением {string}")
    public void checkEcpResponse(String msg) {
        response.then().statusCode(200);

        assertTrue(response.jsonPath()
                           .getString("ecpReport")
                           .contains(msg));
    }

    @Given("Существует запись в текущей библиотеке на основе растрового файла из БД {string}")
    public void createLibraryDefaultRecord(String title) {
        String body = "{" +
                "    \"title\": \"" + title + "\"," +
                "    \"native_crs\": \"EPSG:28406\"," +
                "    \"some_files\": [" +
                "        {" +
                "            \"id\": \"" + currentFileId + "\"," +
                "            \"title\": \"zolotopolenskoe_sp.tif\"," +
                "            \"size\": 7860680" +
                "        }" +
                "    ]," +
                "    \"content_type_id\": \"doc_v4\"" +
                "}";

        createDocumentAndWriteAsCurrent(body, currentLibrary.getTableName());
        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @When("Существуют записи в библиотеке по-умолчанию {string}")
    public void createMultipleRecords(String quantity) throws InterruptedException {
        int recordCount = Integer.parseInt(quantity);
        for (int i = 0; i < recordCount; i++) {
            initRecordInDefaultLibrary();
        }
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} по всем записям библиотеки по-умолчанию")
    public void getAllRecordsSortedByAdmin(String sortingFactor, String sortingDirection) {
        getAllRecordsSorted(sortingFactor, sortingDirection, DEFAULT_LIBRARY);
    }

    @When("Администратор делает запрос в реестре с сортировкой по {string} и {string} по всем записям библиотеки по-умолчанию")
    public void getAllRecordsSortedInRegister(String sortingFactor, String sortingDirection) {
        String filter = "((is_folder+IN('false')+OR+is_folder+IS+null))";

        getAllRecordsInRegisterSortedWithFilter(sortingFactor, sortingDirection, filter, DEFAULT_LIBRARY);
    }

    @When("Текущий пользователь, по эндпоинту as_registry, запрашивает записи c id: {string}")
    public void getWithRecordId(String recordId) {
        getRecordByEcqlFilterAndRecordId("", recordId, DEFAULT_LIBRARY);
    }

    @Then("В табличном виде пользователю доступно {int} объектов")
    public void checkAllowedItemsInTableViewForCurrentUser(Integer expected) {
        authorizationBase.loginAsCurrentUser();

        getRecordsAsRegistry("", DEFAULT_LIBRARY);

        response.then().body("page.totalElements", equalTo(expected));
    }

    @When("Пользователь делает запрос с сортировкой по {string} и {string} по всем записям библиотеки по-умолчанию")
    public void getAllRecordsSortedByCurrentUser(String sortingFactor, String sortingDirection) {
        authorizationBase.loginAsCurrentUser();

        getAllRecordsSorted(sortingFactor, sortingDirection, DEFAULT_LIBRARY);
    }

    @When("Пользователь делает запрос на получение всех записей из библиотеки по-умолчанию")
    public void getAllRecordsFromDefaultLibrary() {
        getAllRecords(DEFAULT_LIBRARY);
    }

    @When("Пользователь делает запрос на получение удалённых записей из библиотеки по-умолчанию")
    public void getAllRemovedRecordsFromDefaultLibrary() {
        getRecordsAsRegistry("(is_deleted+=+'true')", DEFAULT_LIBRARY);
    }

    @When("Пользователь делает запрос в реестре с сортировкой по {string} и {string} по всем записям библиотеки по-умолчанию")
    public void getAllRecordsInRegisterSortedByCurrentUser(String sortingFactor, String sortingDirection) {
        authorizationBase.loginAsCurrentUser();

        getAllRecordsInRegisterSortedWithFilter(sortingFactor,
                                                sortingDirection,
                                                "((is_folder+IN('false')+OR+is_folder+IS+null))",
                                                DEFAULT_LIBRARY);
    }

    @When("В библиотеке документов по-умолчанию существует {string} папки")
    public void getAllRecordsInRegisterSortedByCurrentUser(String quantityOfFolders) {
        String folderContentType = "folder_v1";
        String folderName = "test folder ";
        range(0, Integer.parseInt(quantityOfFolders))
                .forEach(i -> createRecordWithCheck(DEFAULT_LIBRARY,
                                                    new RecordDto(folderName + i, null, folderContentType)));
    }

    @When("В библиотеке документов по-умолчанию существует папка {string}")
    public void createFolderInDefaultLibrary(String folderName) {
        String folderContentType = "folder_v1";
        currentFolderId = createRecordWithCheck(DEFAULT_LIBRARY,
                                                new RecordDto(folderName, null, folderContentType));
    }

    @When("В библиотеке документов {string} существует папка {string}")
    public void createFolderInTargetLibrary(String targetLibrary, String folderName) {
        String folderContentType = "folder_v1";
        currentFolderId = createRecordWithCheck(targetLibrary,
                                                new RecordDto(folderName, null, folderContentType));
    }

    @When("В библиотеке документов {string} существует папка {string} с id {int}")
    public void createFolderInTargetLibraryWithId(String targetLibrary, String folderName, int targetFolderId) {
        // Сначала проверяем, существует ли уже папка с нужным ID
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d", targetLibrary, targetFolderId));

        if (response.getStatusCode() == 200) {
            // Папка уже существует, ничего не делаем
            return;
        }

        // Проверяем текущий максимальный ID
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records", targetLibrary));

        int maxExistingId = response.jsonPath()
                                    .getInt("content.collect { it.content.id }.max() ?: 0");

        // Если максимальный существующий ID меньше целевого,
        // создаем недостающие папки по порядку
        for (int i = maxExistingId + 1; i <= targetFolderId; i++) {
            String folderContentType = "folder_v1";
            createRecordWithCheck(targetLibrary,
                                  new RecordDto(folderName, null, folderContentType));
        }
    }

    @When("В текущей папке существует запись")
    public void createRecordInCurrentFolder() {
        String pathToFolder1 = "/root/" + currentFolderId;
        currentDocumentId = createRecordWithCheck(DEFAULT_LIBRARY,
                                                  new RecordDto("file_1", pathToFolder1, "doc_v3"));
    }

    @When("Пользователь делает запрос на folder_1_1 запись в библиотеке")
    public void getCurrentRecordInLibrary() {
        authorizationBase.loginAsCurrentUser();

        getRecordById(folder11Id, DEFAULT_LIBRARY);
    }

    @And("Удалённая запись НЕ возвращается в теле ответа")
    public void checkThatCurrentDeletedDocumentNotInResponse() {
        List<Integer> recordIds = response.jsonPath().get("content.content.id");
        if (Objects.nonNull(recordIds) && !recordIds.isEmpty()) {
            recordIds.forEach(id -> assertNotEquals(currentDocumentId, id));
        }
    }

    @Then("Запись присутствует в БД")
    public void checkThatDocumentInDataBase() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentDocumentId));

        assertEquals(200, response.statusCode());
    }

    @Then("У записи поле {string} имеет значение {string}")
    public void checkValueInField(String field, String value) {
        String actualValue = response.jsonPath().get(field).toString();

        assertEquals(actualValue, value);
    }

    @And("Удаленная запись восстановлена")
    public void checkThatRemovedDocumentIsRecover() {
        getCurrentDocument(DEFAULT_LIBRARY);

        boolean isDeleted = Boolean.parseBoolean(response.jsonPath().get("is_deleted").toString());

        assertFalse(isDeleted);
    }

    @And("Удалённая запись возвращается в теле ответа")
    public void checkThatCurrentDeletedDocumentInResponse() {
        List<Integer> recordIds = response.jsonPath().get("content.content.id");
        if (Objects.nonNull(recordIds) && !recordIds.isEmpty()) {
            long idCount = recordIds.stream().filter(id -> id.equals(deletedDocumentId)).count();
            assertEquals(1L, idCount);
        }
    }

    @And("Папки находятся в начале списка")
    public void checkFoldersFetchedFirst() {
        String folderContentType = "folder_v1";

        jsonPath = response.jsonPath();
        List<String> sortedContentTypes = jsonPath.getList("content.content.content_type_id");

        if (sortedContentTypes.contains(folderContentType)) {
            for (int i = 0; i < sortedContentTypes.size(); ) {
                String contentTypeCurrent = sortedContentTypes.get(0);
                if (nonNull(contentTypeCurrent)) {
                    if (folderContentType.equals(contentTypeCurrent)) {
                        sortedContentTypes.remove(0);
                    } else {
                        assertFalse(sortedContentTypes.contains(folderContentType));
                        break;
                    }
                } else {
                    assertFalse(sortedContentTypes.contains(folderContentType));
                    break;
                }
            }
        }
    }

    @And("Папки и записи отсортированы по {string} и {string}")
    public void isFoldersAndRecordsSorted(String sortingType, String sortingDirection) {
        String contentTypeIdKey = "content_type_id";
        String folderContentType = "folder_v1";

        jsonPath = response.jsonPath();
        List<HashMap<String, Object>> records;
        List<HashMap<String, Object>> folders = new ArrayList<>();

        records = jsonPath.getList("content");

        records.stream()
               .filter(record -> record.containsKey(contentTypeIdKey))
               .forEach(record -> {
                   Object value = record.get(contentTypeIdKey);
                   if (nonNull(value) && value.equals(folderContentType)) {
                       folders.add(record);
                   }
               });

        records.removeAll(folders);

        List<Object> foldersSorted = folders.stream()
                                            .filter(folder -> folder.containsKey(sortingType))
                                            .filter(folder -> nonNull(folder.get(sortingType)))
                                            .map(folder -> folder.get(sortingType))
                                            .collect(Collectors.toList());

        checkSorting(sortingDirection, foldersSorted);

        List<Object> recordsSorted = records.stream()
                                            .filter(folder -> folder.containsKey(sortingType))
                                            .filter(folder -> nonNull(folder.get(sortingType)))
                                            .map(folder -> folder.get(sortingType))
                                            .collect(Collectors.toList());

        checkSorting(sortingDirection, recordsSorted);
    }

    @When("я переношу объект {int} в каталог {int}")
    public void moveRecord(int movedFolderId, int targetFolderId) {
        moveRecord((long) movedFolderId, (long) targetFolderId, DEFAULT_LIBRARY);
    }

    @When("я переношу каталог {string} в каталог {string}")
    public void moveRecord(String movedFolderTitle, String targetFolderTitle) {
        Integer movedFolderId = libraryCatalog.get(movedFolderTitle);
        Integer targetFolderId = libraryCatalog.get(targetFolderTitle);

        moveRecord((long) movedFolderId, (long) targetFolderId, DEFAULT_LIBRARY);
    }

    @When("я перемещаю каталог {string} в корень библиотеки")
    public void moveRecordToLibraryRoot(String movedFolderTitle) {
        Integer movedFolderId = libraryCatalog.get(movedFolderTitle);

        moveRecord((long) movedFolderId, null, DEFAULT_LIBRARY);
    }

    @Then("перенос документа 1 выполнен успешно")
    public void checkFile1Path() {
        getRecordById(1, DEFAULT_LIBRARY);
        checkResponseValue("path", "/root/4/10/11/13");
    }

    @Then("перенос каталога 13 и его вложений выполнен успешно")
    public void checkFile13Path() {
        getRecordById(13, DEFAULT_LIBRARY);
        checkResponseValue("path", "/root/17");

        getRecordById(14, DEFAULT_LIBRARY);
        checkResponseValue("path", "/root/17/13");

        getRecordById(15, DEFAULT_LIBRARY);
        checkResponseValue("path", "/root/17/13");

        getRecordById(16, DEFAULT_LIBRARY);
        checkResponseValue("path", "/root/17/13/14");
    }

    @When("Владелец организации отправляет запрос на восстановление документа в библиотеке по-умолчанию")
    public void recoverCurrentRecordByOrgAdmin() {
        authorizationBase.loginAsOwner();

        recoverRecord(currentDocumentId, null, DEFAULT_LIBRARY);
    }

    @When("Пользователь отправляет запрос на восстановление документа в библиотеке по-умолчанию")
    public void recoverCurrentRecord() {
        authorizationBase.loginAsCurrentUser();

        recoverRecord(currentDocumentId, null, DEFAULT_LIBRARY);
    }

    @When("Пользователь отправляет запрос на восстановление документа в текущей папке")
    public void recoverCurrentRecordInCurrentFolder() {
        authorizationBase.loginAsCurrentUser();

        recoverRecord(currentDocumentId, currentFolderId, DEFAULT_LIBRARY);
    }

    @When("Сообщение об ошибке содержит причину: {string}")
    public void checkErrorMsgContains(String msg) {
        checkResponseValueContains("message", msg);
    }

    @Given("В библиотеке документов {string} существуют папки с октмо")
    public void createOktmoFolderInLibrary(String targetLibrary, DataTable dataTable) {
        dataTable.asList().forEach(oktmo -> {
            createFolderInTargetLibrary(targetLibrary, oktmo);
            updateDocument(currentFolderId, "{\"fias__oktmo\": \"" + oktmo + "\"}", targetLibrary);
        });
    }

    @Given("В библиотеке документов {string} существует документ с октмо: {string}")
    public void createOktmoDocInLibrary(String targetLibrary, String oktmo) {
        currentDocumentId = createRecordWithCheck(targetLibrary, new RecordDto(oktmo, null, "inboxData"));
        updateDocument(currentDocumentId, "{\"fias__oktmo\": \"" + oktmo + "\"}", targetLibrary);
    }

    @And("Документ оказывается в папке с октмо: {string}")
    public void docInFolder(String folderOktmo) {
        getRecordById(currentDocumentId, "dl_data_inbox_data");

        String path = response.jsonPath().getString("path");
        String folderId = path.substring(path.lastIndexOf("/") + 1);

        getRecordById(Integer.parseInt(folderId), "dl_data_inbox_data");
        String folderActualFOktmo = response.jsonPath().getString("fias__oktmo");

        if ("null".equals(folderOktmo)) {
            assertNull(folderActualFOktmo);
        } else {
            assertEquals(folderOktmo, folderActualFOktmo);
        }
    }

    @Given("Библиотеке {string} задано описание {string}")
    public void updateLibraryDescription(String libraryName, String description) {
        String body = String.format("{ \"details\": \"%s\" }", description);

        response = getBaseRequestWithCurrentCookie()
                .given()
                    .contentType(ContentType.JSON)
                    .body(body)
                .when()
                    .put("/" + libraryName);
    }

    public void createOrGetDocumentLibrary(String schemaTitle, boolean versioning) {
        currentLibrary = null;

        SchemaDto schema = CurrentScenarioSchema.getSchemaByTitle(schemaTitle);

        createLibrary(schema.getName(), versioning);

        if (response.statusCode() == 409) {
            System.out.println("Библиотека " + schema.getTableName() + " уже существует");

            getLibrary(schema.getTableName());
        } else if (response.statusCode() != 201) {
            throw new IllegalStateException("Не удалось создать библиотеку по схеме: " + schema.getName());
        }

        currentLibrary = extractCurrentLibraryModel();
    }

    public void getRecordById(Integer id, String libraryId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                       get(String.format("/%s/records/%d", libraryId, id));
    }

    public void getRecordsAsRegistry(String ecqlFilter, String libraryId) {
        String url = String.format("/%s/records/as_registry?filter=%s", libraryId, ecqlFilter);

        response = getBaseRequestWithCurrentCookie()
                .when().
                       get(url);
    }

    private LibraryModel extractCurrentLibraryModel() {
        Long id = response.jsonPath().getLong("id");
        String title = response.jsonPath().get("title");
        String details = response.jsonPath().get("details");
        String schemaId = response.jsonPath().get("schemaId");
        String libraryTableName = response.jsonPath().get("table_name");

        LibraryModel libraryModel = new LibraryModel();
        libraryModel.setId(id);
        libraryModel.setTitle(title);
        libraryModel.setSchemaId(schemaId);
        libraryModel.setTableName(libraryTableName);
        libraryModel.setDetails(details);

        return libraryModel;
    }

    private void createRecordWithSecondFile() {
        List<FileDescriptionModel> descriptions = new ArrayList<>();
        descriptions.add(new FileDescriptionModel(secondFileId, 314L, "Second file"));

        DefaultDocumentModel record = new DefaultDocumentModel(generateString("STRING_4"));
        record.setSome_files(descriptions);

        createDocumentAndWriteAsCurrent(gson.toJson(record), DEFAULT_LIBRARY);

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    private void getCurrentDocument(String libraryId) {
        getRecordById(currentDocumentId, libraryId);
    }

    private void getCurrentDocumentInCurrentLibrary() {
        getCurrentDocument(currentLibrary.getTableName());
    }

    private void updateCurrentDocument(String payload) {
        if (currentDocumentId == null) {
            throw new IllegalStateException("Идентификатор текущего документа не задан");
        }

        updateDocument(currentDocumentId, payload, DEFAULT_LIBRARY);
    }

    private void createLibrary(String schemaName, boolean versioning) {
        String body = String.format("{\"schemaId\":\"%s\", \"versioned\":\"%s\"}", schemaName, versioning);
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(body).
                        contentType(ContentType.JSON)
                .when().
                        post();
    }

    private void getLibrary(String libraryId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                       get("/" + libraryId);
    }

    private void createDocumentAndWriteAsCurrent(String body, String libraryId) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("body", body)
                .when().
                        post(String.format("/%s/records", libraryId));

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    private void recoverRecord(Integer recordId, Integer parentId, String libraryId) {
        String url = Objects.isNull(parentId)
                ? String.format("/%s/records/%d/recover", libraryId, recordId)
                : String.format("/%s/records/%d/recover?recoverFolderId=%s", libraryId, recordId, parentId);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        post(url);
    }

    private void moveRecord(@NotNull Long movedRecordId,
                            @Nullable Long targetRecordId,
                            String libraryId) {
        String path = (targetRecordId == null)
                ? String.format("/%s/records/%d/move", libraryId, movedRecordId)
                : String.format("/%s/records/%d/move/%d", libraryId, movedRecordId, targetRecordId);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        post(path);
    }

    private void updateDocument(Integer docId, String payload, String currentLibraryId) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(PATCH_CONTENT_TYPE).
                        body(payload)
                .when().
                        patch(String.format("/%s/records/%d", currentLibraryId, docId));
    }

    private void getAllRecords(String libraryId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records", libraryId));
    }

    private void getAllRecordsSorted(String sortingFiled, String sortingDirection, String libraryId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records?sort=%s,%s&%s",
                                          libraryId,
                                          sortingFiled,
                                          sortingDirection,
                                          "size=1000"));
    }

    private void getAllRecordsInRegisterSortedWithFilter(String sortingFiled,
                                                         String sortingDirection,
                                                         String filter,
                                                         String libraryId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/as_registry?sort=%s,%s&filter=%s&%s",
                                          libraryId,
                                          sortingFiled,
                                          sortingDirection,
                                          filter,
                                          "size=1000"));
    }

    private void getRecordByEcqlFilterAndRecordId(String ecqlFilter, String recordId, String libraryId) {
        String url = String.format("/%s/records/as_registry?filter=%s&recordId=%s",
                                   libraryId,
                                   ecqlFilter,
                                   recordId);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(url);
    }

    private String getRecordBodyForDlDefaultWithIncorrectField() {
        return "{" +
                "    \"title\": \"test\"," +
                "    \"oktmo\": \"123123\"," +
                "    \"native_crs\": \"EPSG:28406\"," +
                "    \"content_type_id\": \"doc_v4\"," +
                "    \"iwillnotexist\": \"test\"" +
                "}";
    }

    private String getRecordBodyForDlDefaultWithCorrectField() {
        return "{" +
                "    \"title\": \"test\"," +
                "    \"oktmo\": \"123123\"," +
                "    \"native_crs\": \"EPSG:28406\"," +
                "    \"content_type_id\": \"doc_v4\"" +
                "}";
    }
}
