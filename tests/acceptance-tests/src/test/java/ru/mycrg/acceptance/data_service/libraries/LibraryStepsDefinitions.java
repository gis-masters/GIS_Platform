package ru.mycrg.acceptance.data_service.libraries;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.DefaultRecordModel;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.acceptance.data_service.dto.RecordDto;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static java.util.stream.IntStream.range;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.CommonStepDefinitions.checkSorting;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.secondFileId;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.tifFileId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryPermissionsStepsDefinitions.DEFAULT_LIBRARY;
import static ru.mycrg.acceptance.data_service.libraries.LibraryPermissionsStepsDefinitions.folder11Id;

public class LibraryStepsDefinitions extends LibraryBaseRecords {

    public static Integer currentRecordId;
    public static Integer documentId;
    public static String fileName;
    public static File file;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data/document-libraries");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/document-libraries");
    }

    @When("Пользователь делает запрос на добавление файла")
    public void createDocument(DataTable dataTable) {
        fileName = dataTable.asList().get(0);

        file = new File(String.format("src/test/resources/ru/mycrg/acceptance/resources/%s", fileName));

        response = getBaseRequestWithCurrentCookie()
                .given().
                        log().all().
                        contentType("multipart/form-data").
                        multiPart("file", file).
                        multiPart("body",
                                  String.format("{\"title\":\"%s\",\"size\":%d}", file.getName(), file.length()))
                .when().
                        log().ifValidationFails().
                        post(String.format("/%s/records", DEFAULT_LIBRARY));
    }

    @And("Сервер передаёт ID файла в ответе")
    public void extractDocumentIdFromResponse() {
        documentId = response.jsonPath().get("id");

        assertThat(documentId, is(not(equalTo(null))));

        filesPool.put(fileName, documentId);
    }

    @When("Существует файл")
    public void initFile(DataTable dataTable) {
        String fileName = dataTable.asList().get(0);

        if (filesPool.containsKey(fileName)) {
            makeExactDocumentAsCurrent(fileName);
        } else {
            createDocument(dataTable);

            extractDocumentIdFromResponse();
        }
    }

    @When("Пользователь делает запрос на скачивание файла")
    public void downloadFile() {
        final String tempBinaryFieldNameOfDefaultLibrarySchema = "inner_path";
        final String url = String.format("/%s/records/%s/%s/download",
                                         DEFAULT_LIBRARY, documentId, tempBinaryFieldNameOfDefaultLibrarySchema);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().ifValidationFails().
                        get(url);
    }

    @And("В ответе передаётся содержимое файла")
    public void checkFileLength() {
        assertThat((long) response.getBody().asByteArray().length, equalTo(file.length()));
    }

    @When("Пользователь удаляет запись в библиотеке")
    public void deleteLibraryDocument() {
        deleteRecord(currentRecordId);
    }

    @When("Администратор обновляет запись библиотеки - удаляет файл")
    public void updateLibraryDocument() {
        authorizationBase.loginAsOwner();

        DefaultRecordModel recordModel = new DefaultRecordModel("new_title");
        recordModel.setSome_files(new ArrayList<>());

        updateRecord(currentRecordId, gson.toJson(recordModel));
    }

    @When("Пользователь делает запрос на удаление файла")
    public void deleteDocument() {
        deleteRecord(documentId);
    }

    @Given("В библиотеке по-умолчанию существует запись")
    public void initRecordInDefaultLibrary() {
        String body = String.format("{\"title\":\"%s\"}", generateString("STRING_10"));
        createRecord(body);

        assertEquals(201, response.getStatusCode());

        currentRecordId = extractEntityIdFromResponse(response);
    }

    @Given("Пользователь создает документ")
    public void currentUserCreateRecordInDefaultLibrary() {
        String body = String.format("{\"title\":\"%s\"}", generateString("STRING_10"));
        createRecord(body);

        assertEquals(201, response.getStatusCode());

        currentRecordId = extractEntityIdFromResponse(response);
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
                        put(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentRecordId));
    }

    @When("Отправляется запрос на обновление текущей записи с некорректным Content-Type: {string}")
    public void tryUpdateRecordWithDifferentContentType(String contentType) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(contentType).
                        body("{\"title\":\"initial title\"}")
                .when().
                        patch(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentRecordId));
    }

    @When("Пользователь делает запрос на обновление текущей записи")
    public void updateCurrentRecord() {
        updateRecord(currentRecordId, gson.toJson(new DefaultRecordModel("new title")));
    }

    @When("Пользователь делает запрос на обновление текущей записи передавая несуществующий атрибут")
    public void tryUpdateRecordWithNotExistAttributes() {
        String body = "{\"not_exist_attribute\": \"some\"}";
        updateRecord(currentRecordId, body);
    }

    @When("Пользователь делает запрос на обновление текущей записи передавая несуществующий в базе данных атрибут")
    public void tryUpdateRecordWithNotExistAttributesInDB() {
        String body = "{\"test\": \"test\"}";
        updateRecord(currentRecordId, body);
    }

    @And("Запись успешно обновлена")
    public void checkRecord() {
        getCurrentRecord(currentRecordId);

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
        assertEquals("Данные не сохранены. В базе данных поле test отсутсвует.", errorMessage);
    }

    @When("Администратор запрашивает текущую запись")
    public void gelCurrentRecordFromDefaultLibraryAsOwner() {
        authorizationBase.loginAsOwner();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentRecordId));
    }

    @When("Отправляется запрос на создание записи в библиотеке по-умолчанию")
    public void createRecordsRequest() {
        createRecord(getRecordBodyForDlDefaultWithCorrectField());
    }

    @When("Пользователь делает запрос на создание записи передавая несуществующий в базе данных атрибут")
    public void tryCreateRecordWithNotExistAttributesInDB() {
        createRecord(getRecordBodyForDlDefaultWithIncorrectField());
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

        currentRecordId = extractEntityIdFromResponse(response);
    }

    @Given("Существует запись в библиотеке на основе растрового файла из БД {string}")
    public void createLibraryDefaultRecord(String title) {
        String body = "{" +
                "    \"title\": \"" + title + "\"," +
                "    \"native_crs\": \"EPSG:28406\"," +
                "    \"some_files\": [" +
                "        {" +
                "            \"id\": \"" + tifFileId + "\"," +
                "            \"title\": \"zolotopolenskoe_sp.tif\"," +
                "            \"size\": 7860680" +
                "        }" +
                "    ]," +
                "    \"content_type_id\": \"doc_v4\"" +
                "}";

        createRecord(body);
        currentRecordId = extractEntityIdFromResponse(response);
    }

    @When("Существуют записи в библиотеке по-умолчанию {string}")
    public void createMultipleRecords(String quantity) {
        range(0, Integer.parseInt(quantity)).forEach(i -> initRecordInDefaultLibrary());
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

    @When("Пользователь делает запрос с сортировкой по {string} и {string} по всем записям библиотеки по-умолчанию")
    public void getAllRecordsSortedByCurrentUser(String sortingFactor, String sortingDirection) {
        authorizationBase.loginAsCurrentUser();

        getAllRecordsSorted(sortingFactor, sortingDirection);
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

        getCurrentRecord(folder11Id);
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

    private void makeExactDocumentAsCurrent(String fName) {
        filesPool.entrySet().stream()
                 .filter(entry -> entry.getKey().equals(fName))
                 .findFirst()
                 .ifPresent(entry -> {
                     fileName = entry.getKey();
                     documentId = entry.getValue();
                     file = new File("src/test/resources/ru/mycrg/acceptance/resources/" + fileName);
                 });
    }

    private void createRecord(String body) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("body", body)
                .when().
                        log().ifValidationFails().
                        post(String.format("/%s/records", DEFAULT_LIBRARY));
    }

    private void getCurrentRecord(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d", DEFAULT_LIBRARY, id));
    }

    private void createRecordWithSecondFile() {
        List<FileDescriptionModel> descriptions = new ArrayList<>();
        descriptions.add(new FileDescriptionModel(secondFileId, 314L, "Second file"));

        DefaultRecordModel record = new DefaultRecordModel(generateString("STRING_4"));
        record.setSome_files(descriptions);

        createRecord(gson.toJson(record));

        currentRecordId = extractEntityIdFromResponse(response);
    }

    private void updateRecord(Integer recordId, String body) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("application/merge-patch+json").
                        body(body)
                .when().
                        log().all().
                        patch(String.format("/%s/records/%d", DEFAULT_LIBRARY, recordId));
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
                        get(String.format("/%s/records/as_registry?sort=%s,%s&filer=%s&%s",
                                          DEFAULT_LIBRARY,
                                          sortingFiled,
                                          sortingDirection,
                                          filter,
                                          "size=1000"));
    }
}
