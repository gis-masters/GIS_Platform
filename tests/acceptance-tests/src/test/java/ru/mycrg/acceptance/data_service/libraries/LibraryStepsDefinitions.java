package ru.mycrg.acceptance.data_service.libraries;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;

import java.io.File;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

public class LibraryStepsDefinitions extends BaseStepsDefinitions {

    public static final String DEFAULT_LIBRARY = "dl_default";

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

        file = new File(String.format("src/test/resources/ru/mycrg/acceptance/data_service/files/%s", fileName));

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

    @When("Пользователь делает запрос на удаление файла")
    public void deleteDocument() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().ifValidationFails().
                        delete(String.format("/%s/records/%s", DEFAULT_LIBRARY, documentId));
    }

    @Given("В библиотеке по-умолчанию существует запись")
    public void initRecordInDefaultLibrary() {
        createRecord(generateString("STRING_10"));

        assertEquals(201, response.getStatusCode());

        currentRecordId = extractEntityIdFromResponse(response);
    }

    @Given("Пользователь создает документ")
    public void currentUserCreateRecordInDefaultLibrary() {
        createRecord(generateString("STRING_8"));

        assertEquals(201, response.getStatusCode());

        currentRecordId = extractEntityIdFromResponse(response);
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
    public void updateRecord() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("application/merge-patch+json").
                        body("{\"title\": \"new title\"}")
                .when().
                        patch(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentRecordId));
    }

    @When("Пользователь делает запрос на обновление текущей записи передавая несуществующий атрибут")
    public void tryUpdateRecordWithNotExistAttributes() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("application/merge-patch+json").
                        body("{\"not_exist_attribute\": \"some\"}")
                .when().
                        patch(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentRecordId));
    }

    @And("Запись успешно обновлена")
    public void checkRecord() {
        getCurrentRecord();

        String newTitle = response.jsonPath().get("title");

        assertEquals("new title", newTitle);
    }

    @When("Администратор запрашивает текущую запись")
    public void gelCurrentRecordFromDefaultLibraryAsOwner() {
        authorizationBase.loginAsOwner();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentRecordId));
    }

    private void makeExactDocumentAsCurrent(String fName) {
        filesPool.entrySet().stream()
                 .filter(entry -> entry.getKey().equals(fName))
                 .findFirst()
                 .ifPresent(entry -> {
                     fileName = entry.getKey();
                     documentId = entry.getValue();
                     file = new File("src/test/resources/ru/mycrg/acceptance/data_service/files/" + fileName);
                 });
    }

    private void createRecord(String title) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        log().all().
                        contentType("multipart/form-data").
                        multiPart("body",
                                  String.format("{\"title\":\"%s\"}", title))
                .when().
                        log().ifValidationFails().
                        post(String.format("/%s/records", DEFAULT_LIBRARY));
    }

    private void getCurrentRecord() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/%s/records/%d", DEFAULT_LIBRARY, currentRecordId));
    }
}
