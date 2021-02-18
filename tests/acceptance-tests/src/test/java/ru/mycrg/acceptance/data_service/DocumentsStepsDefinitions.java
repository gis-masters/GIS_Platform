package ru.mycrg.acceptance.data_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.io.File;

import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertEquals;

public class DocumentsStepsDefinitions extends BaseStepsDefinitions {

    public static String documentId;
    public static String fileName;
    public static File file;

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
                        contentType("multipart/form-data").
                        multiPart("file", file).
                        multiPart("body",
                                  String.format("{\"title\":\"%s\",\"size\":%d}", file.getName(), file.length()))
                .when().
                        log().ifValidationFails().
                        post("/documents/records");
    }

    @And("Сервер передает ID файла в ответе")
    public void extractDocumentIdFromResponse() {
        documentId = response.jsonPath().get("id").toString().substring(1, 37);
        assertThat(documentId, is(not(equalTo(null))));
        filesPool.put(fileName, documentId);
    }

    @When("Существует файл")
    public void initFile(DataTable dataTable) {
        String fileName = dataTable.asList().get(0);

        if (isDocumentExistInPool(fileName)) {
            makeExactDocumentAsCurrent(fileName);
        } else {
            createDocument(dataTable);
            assertEquals(SC_OK, response.getStatusCode());
            extractDocumentIdFromResponse();
        }
    }

    @When("Пользователь делает запрос на скачивание файла")
    public void downloadFile() {
        final String tempBinaryFieldNameOfDefaultLibrarySchema = "inner_path";
        final String url = String.format("/documents/records/%s/%s/download",
                                         documentId, tempBinaryFieldNameOfDefaultLibrarySchema);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().ifValidationFails().
                        get(url);
    }

    @And("В ответе передается содержимое файла")
    public void checkFileLength() {
        assertThat((long) response.getBody().asByteArray().length, equalTo(file.length()));
    }

    @When("Пользователь делает запрос на удаление файла")
    public void deleteDocument() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().ifValidationFails().
                        delete(String.format("/documents/records/%s", documentId));
    }

    private void makeExactDocumentAsCurrent(String fileNamePassed) {
        filesPool.entrySet().stream()
                 .filter(entry -> entry.getValue().equals(fileNamePassed))
                 .findFirst()
                 .ifPresent(entry -> {
                     documentId = entry.getKey();
                     fileName = entry.getValue();
                     file = new File(
                             String.format("src/test/resources/ru/mycrg/acceptance/data_service/files/%s", fileName));
                 });
    }

    private boolean isDocumentExistInPool(String fileNamePassed) {
        return filesPool
                .values().stream()
                .anyMatch(fileNamePassed::equals);
    }
}
