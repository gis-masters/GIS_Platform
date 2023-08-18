package ru.mycrg.acceptance.data_service.libraries;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.DefaultDocumentModel;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.acceptance.data_service.dto.LibraryModel;
import ru.mycrg.acceptance.data_service.dto.RecordDto;
import ru.mycrg.data_service_contract.dto.DocumentVersioningDto;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Thread.sleep;
import static java.util.Objects.nonNull;
import static java.util.stream.IntStream.range;
import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.CommonStepDefinitions.checkSorting;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.*;
import static ru.mycrg.acceptance.data_service.libraries.LibraryPermissionsStepsDefinitions.DEFAULT_LIBRARY;
import static ru.mycrg.acceptance.data_service.libraries.LibraryPermissionsStepsDefinitions.folder11Id;
import static ru.mycrg.acceptance.data_service.schemas.SchemasStepsDefinitions.currentSchemaName;

public class LibraryStepsDefinitions extends LibraryBaseRecords {

    public static LibraryModel currentLibraryModel;
    public static LibraryModel currentLibraryWithVersioningModel;
    public static String currentLibraryId;
    public static String currentLibraryTableName;

    public static Integer currentDocumentId;
    public static Integer deletedDocumentId;
    public static DefaultDocumentModel currentDocument;

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
    public void createDocumentLibraryByAdmin() {
        authorizationBase.loginAsOwner();

        if (Objects.isNull(currentLibraryModel)) {
            createLibrary(currentSchemaName, false);
            currentLibraryModel = extractCurrentLibraryModel();
        }
    }

    @When("Пользователь делает запрос на создание библиотеки документов")
    public void createDocumentLibraryByUser() {
        createLibrary(currentSchemaName, false);
    }

    @When("Существует библиотека документов")
    public void createRandomDocumentLibraryByAdmin() {
        createDocumentLibraryByAdmin();
    }

    @When("Существует библиотека документов с включённым версионированием")
    public void createDocumentLibraryWithVersioning() {
        if (Objects.isNull(currentLibraryWithVersioningModel)) {
            createLibrary(currentSchemaName, true);
            currentLibraryWithVersioningModel = extractCurrentLibraryModel();
        }
    }

    @And("Текущая библиотека документов существует в БД")
    public void currentDatasetExist() {
        getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentLibraryModel.getTableName())
                .then().
                        statusCode(SC_OK);
    }

    @When("Администратор организации делает запрос на удаление текущей библиотеки документов")
    public void deleteCurrentDocumentLibrary() {
        authorizationBase.loginAsOwner();

        getBaseRequestWithCurrentCookie()
                .when().
                        delete("/" + currentLibraryModel.getTableName())
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
        List<Map<String, Object>> records = response.jsonPath().getList("_embedded.records.content");

        if (nonNull(records)) {
            boolean isFileExist = records
                    .stream()
                    .anyMatch(stringObjectMap -> !parseBoolean(stringObjectMap.get("is_folder").toString()));

            assertFalse(isFileExist);
        }
    }

    @When("Пользователь удаляет запись в библиотеке")
    public void deleteLibraryDocument() {
        deleteRecord(currentDocumentId);
    }

    @Given("Текущая запись была удалена")
    public void currentLibraryRecordWasDeleted() {
        deletedDocumentId = currentDocumentId;
        deleteRecord(deletedDocumentId);

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
        createDocument(body, DEFAULT_LIBRARY);

        sleep(800);

        assertEquals(201, response.getStatusCode());

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @Given("В текущей библиотеке существует документ с полем {string} заполненным {string}")
    public void initRecordInCurrentLibrary(String filedName, String fieldValue) throws InterruptedException {
        String body = String.format("{\"%s\": \"%s\"}", filedName, fieldValue);
        createDocument(body, currentLibraryTableName);

        sleep(800);

        assertEquals(201, response.getStatusCode());

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @Given("Пользователь создает документ")
    public void currentUserCreateRecordInDefaultLibrary() {
        String body = String.format("{\"title\":\"%s\"}", generateString("STRING_10"));
        createDocument(body, DEFAULT_LIBRARY);

        currentDocumentId = extractEntityIdFromResponse(response);
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

    @When("создан новый набор данных, с таблицами в нём")
    public void checkDatasetIsCreated() {
        datasetsStepsDefinitions.getDatasetsByFilter("title", currentDocument.getTitle());
    }

    @When("Пользователь делает запрос на обновление текущей записи")
    public void updateCurrentRecord() {
        updateDocument(currentDocumentId, gson.toJson(new DefaultDocumentModel("new title")), DEFAULT_LIBRARY);
    }

    @When("Пользователь обновил поле {string} в текущем документе в текущей библиотеке значением {string}")
    public void updateCurrentDocument(String filedName, String fieldValue) {
        updateDocument(currentDocumentId,
                       String.format("{\"%s\": \"%s\"}", filedName, fieldValue),
                       currentLibraryTableName);
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
        getCurrentDocument();

        String newTitle = response.jsonPath().get("title");

        assertEquals("new title", newTitle);
    }

    @And("Запись успешно создана")
    public void checkRecordCreation() {
        String newTitle = response.jsonPath().get("title");

        assertEquals("test", newTitle);
    }

    @And("Тело ответа содержит ошибку о том что данные не были сохранены")
    public void checkErrorMessage() {
        List<Object> errors = response.jsonPath().getList("errors.message");
        assertTrue(errors.size() > 0);

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
                        get(String.format("/%s/records/%d/versions", currentLibraryTableName, currentDocumentId));
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
        createDocument(getRecordBodyForDlDefaultWithCorrectField(), DEFAULT_LIBRARY);
    }

    @When("B библиотеке по-умолчанию существует документ")
    public void createDocumentInDefaultLibrary() {
        createDocument(getRecordBodyForDlDefaultWithCorrectField(), DEFAULT_LIBRARY);
    }

    @When("Пользователь делает запрос на создание записи передавая несуществующий в базе данных атрибут")
    public void tryCreateRecordWithNotExistAttributesInDB() {
        createDocument(getRecordBodyForDlDefaultWithIncorrectField(), DEFAULT_LIBRARY);
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
                         post("/dl_default/records");

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

        createDocument(body, DEFAULT_LIBRARY);
        currentDocumentId = extractEntityIdFromResponse(response);
    }

    @Given("Существует запись в библиотеке на основе растрового файла из БД {string}")
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

        createDocument(body, DEFAULT_LIBRARY);
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
        getAllRecordsSorted(sortingFactor, sortingDirection);
    }

    @When("Администратор делает запрос в реестре с сортировкой по {string} и {string} по всем записям библиотеки по-умолчанию")
    public void getAllRecordsSortedInRegister(String sortingFactor, String sortingDirection) {
        String filter = "((is_folder+IN('false')+OR+is_folder+IS+null))";

        getAllRecordsInRegisterSortedWithFilter(sortingFactor, sortingDirection, filter);
    }

    @When("Текущий пользователь, по эндпоинту as_registry, запрашивает записи c id: {string}")
    public void getWithRecordId(String recordId) {
        getRecordByEcqlFilterAndRecordId("", recordId);
    }

    @When("Пользователь делает запрос с сортировкой по {string} и {string} по всем записям библиотеки по-умолчанию")
    public void getAllRecordsSortedByCurrentUser(String sortingFactor, String sortingDirection) {
        authorizationBase.loginAsCurrentUser();

        getAllRecordsSorted(sortingFactor, sortingDirection);
    }

    @When("Пользователь делает запрос на получение всех записей из библиотеки по-умолчанию")
    public void getAllRecordsFromDefaultLibrary() {
        getAllRecords(DEFAULT_LIBRARY);
    }

    @When("Пользователь делает запрос на получение удалённых записей из библиотеки по-умолчанию")
    public void getAllRemovedRecordsFromDefaultLibrary() {
        String ecqlFilter = "(is_deleted+=+'true')";
        getRecordsAsRegistry(ecqlFilter, DEFAULT_LIBRARY);
    }

    @When("Пользователь делает запрос в реестре с сортировкой по {string} и {string} по всем записям библиотеки по-умолчанию")
    public void getAllRecordsInRegisterSortedByCurrentUser(String sortingFactor, String sortingDirection) {
        String filter = "((is_folder+IN('false')+OR+is_folder+IS+null))";

        authorizationBase.loginAsCurrentUser();

        getAllRecordsInRegisterSortedWithFilter(sortingFactor, sortingDirection, filter);
    }

    @When("В библиотеке документов по-умолчанию существует {string} папки")
    public void getAllRecordsInRegisterSortedByCurrentUser(String quantityOfFolders) {
        String folderContentType = "folder_v1";
        String folderName = "test folder ";
        range(0, Integer.parseInt(quantityOfFolders))
                .forEach(i -> createRecordWithCheck(DEFAULT_LIBRARY,
                                                    new RecordDto(folderName + i, null, folderContentType)));
    }

    @When("Пользователь делает запрос на folder_1_1 запись в библиотеке")
    public void getCurrentRecordInLibrary() {
        authorizationBase.loginAsCurrentUser();

        getRecordById(folder11Id);
    }

    @And("Удалённая запись НЕ возвращается в теле ответа")
    public void checkThatCurrentDeletedDocumentNotInResponse() {
        List<Integer> recordIds = response.jsonPath().get("_embedded.records.content.id");
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

    @And("Удалённая запись возвращается в теле ответа")
    public void checkThatCurrentDeletedDocumentInResponse() {
        List<Integer> recordIds = response.jsonPath().get("_embedded.records.content.id");
        if (Objects.nonNull(recordIds) && !recordIds.isEmpty()) {
            long idCount = recordIds.stream().filter(id -> id.equals(deletedDocumentId)).count();
            assertEquals(1L, idCount);
        }
    }

    @And("Папки находятся в начале списка")
    public void checkFoldersFetchedFirst() {
        String folderContentType = "folder_v1";

        jsonPath = response.jsonPath();
        List<String> sortedContentTypes = jsonPath.getList("_embedded.records.content.content_type_id");

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

    @And("Папки и записи отсортированы по {string} и {string} в {string}")
    public void isFoldersAndRecordsSorted(String sortingType, String sortingDirection, String entity) {
        String contentTypeIdKey = "content_type_id";
        String folderContentType = "folder_v1";

        jsonPath = response.jsonPath();
        List<HashMap<String, Object>> records;
        List<HashMap<String, Object>> folders = new ArrayList<>();

        records = jsonPath.getList(String.format("_embedded.%s", entity));

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

    @When("Пользователь пытается перенести каталог с id: {int}")
    public void tryToMoveFolder(int folderId) {
        moveRecord((long) folderId, (long) folderId);
    }

    @When("Отправляется запрос на перенос записи {int} в каталог {int}")
    public void moveRecord(int recordId, int folderId) {
        moveRecord((long) recordId, (long) folderId);
    }

    @Then("Перенос записи {int} выполнен успешно")
    public void checkFilePath(int recordId) {
        getRecordById(recordId);

        checkResponseValue("path", "/root/4/10/11/13");
    }

    @When("Сообщение об ошибке соответствует ожидаемому: {string}")
    public void checkErrorMsg(String msg) {
        checkResponseValue("message", msg);
    }

    @When("Сообщение об ошибке содержит причину: {string}")
    public void checkErrorMsgContains(String msg) {
        checkResponseValueContains("message", msg);
    }

    private void createLibrary(String schemaId, boolean versioning) {
        String body = String.format("{\"schemaId\":\"%s\", \"versioned\":\"%s\"}", schemaId, versioning);
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(body).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post();
    }

    private LibraryModel extractCurrentLibraryModel() {
        Long id = response.jsonPath().getLong("id");
        String title = response.jsonPath().get("title");
        String details = response.jsonPath().get("details");
        String schemaId = response.jsonPath().get("schemaId");
        currentLibraryTableName = response.jsonPath().get("table_name");

        LibraryModel libraryModel = new LibraryModel();
        libraryModel.setId(id);
        libraryModel.setTitle(title);
        libraryModel.setSchemaId(schemaId);
        libraryModel.setTableName(currentLibraryTableName);
        libraryModel.setDetails(details);

        currentLibraryId = String.valueOf(id);

        return libraryModel;
    }

    private void createRecordWithSecondFile() {
        List<FileDescriptionModel> descriptions = new ArrayList<>();
        descriptions.add(new FileDescriptionModel(secondFileId, 314L, "Second file"));

        DefaultDocumentModel record = new DefaultDocumentModel(generateString("STRING_4"));
        record.setSome_files(descriptions);

        createDocument(gson.toJson(record), DEFAULT_LIBRARY);

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    private void getCurrentDocument() {
        getRecordById(currentDocumentId);
    }

    private void getRecordById(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d", DEFAULT_LIBRARY, id));
    }

    private void createDocument(String body, String libraryId) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("body", body)
                .when().
                        log().ifValidationFails().
                        post(String.format("/%s/records", libraryId));

        currentDocumentId = extractEntityIdFromResponse(response);
    }

    private void moveRecord(Long recordId, Long parentId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        post(String.format("/%s/records/%d/move/%d", DEFAULT_LIBRARY, recordId, parentId));
    }

    private void updateDocument(Integer docId, String payload, String currentLibraryId) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(PATCH_CONTENT_TYPE).
                        body(payload)
                .when().
                        patch(String.format("/%s/records/%d", currentLibraryId, docId));
    }

    private void updateCurrentDocument(String payload) {
        if (currentDocumentId == null) {
            throw new IllegalStateException("Идентификатор текущего документа не задан");
        }

        updateDocument(currentDocumentId, payload, DEFAULT_LIBRARY);
    }

    private void getAllRecords(String libraryId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records", libraryId));
    }

    private void getAllRecordsSorted(String sortingFiled, String sortingDirection) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records?sort=%s,%s&%s",
                                          DEFAULT_LIBRARY,
                                          sortingFiled,
                                          sortingDirection,
                                          "size=1000"));
    }

    private void getAllRecordsInRegisterSortedWithFilter(String sortingFiled,
                                                         String sortingDirection,
                                                         String filter) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/as_registry?sort=%s,%s&filter=%s&%s",
                                          DEFAULT_LIBRARY,
                                          sortingFiled,
                                          sortingDirection,
                                          filter,
                                          "size=1000"));
    }

    private void getRecordByEcqlFilterAndRecordId(String ecqlFilter, String recordId) {
        String url = String.format("/%s/records/as_registry?filter=%s&recordId=%s",
                                   DEFAULT_LIBRARY,
                                   ecqlFilter,
                                   recordId);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(url);
    }

    private void getRecordsAsRegistry(String ecqlFilter, String libraryId) {
        String url = String.format("/%s/records/as_registry?filter=%s", libraryId, ecqlFilter);

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
                "    \"test\": \"test\"" +
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
