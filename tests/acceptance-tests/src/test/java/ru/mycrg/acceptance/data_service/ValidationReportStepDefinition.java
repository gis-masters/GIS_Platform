package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.ExportResourceModel;
import ru.mycrg.acceptance.data_service.dto.ValidationRequestDto;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static java.lang.Thread.sleep;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.schemaId;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.tableName;

public class ValidationReportStepDefinition extends BaseStepsDefinitions {

    public static Integer processId;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data");
    }

    @When("Пользователь делает запрос на валидацию данных")
    public void validateLayer() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(getValidationRequestDto(getValidExportResourceModel())).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/validation");

        waitUntilValidationSuccessfullyCreated();
    }

    @When("Пользователь запрашивает отчёт об ошибках")
    public void getValidationReportWithCurrentBody() {
        getValidationReport(getValidationRequestDto(getValidExportResourceModel()));
    }

    @When("Пользователь запрашивает отчёт об ошибках по несуществующим ресурсам")
    public void getValidationReportWithBadBody() {
        getValidationReport(getValidationRequestDto(getNonValidExportResourceModel()));
        downloadReport();
    }

    @Then("Пользователь скачивает отчет")
    public void downloadReport() {
        extractAndCheckProcessId();

        response = getBaseRequestWithCurrentCookie().
                when().
                        log().ifValidationFails().
                        get("/export/" + extractFileName());
    }

    @And("Отчёт содержит информацию о {int} проблемных полях")
    public void chekReportCountId(int countUniqId) {
        Set<String> uniqId = new HashSet<>();

        String[] splittingResponse = response.asString().split(";");

        for (int i = 7; i < splittingResponse.length; i += 5) {
            uniqId.add(splittingResponse[i]);
        }

        assertEquals(countUniqId, uniqId.size());
    }

    @And("Отчёт содержит информацию об {int} ошибке\\(ах)")
    public void chekReportCountRaws(int countRaws) {
        int countRawsIncludingHeader = countRaws + 1;

        String[] splittingResponse = response.asString().split("\n");

        assertEquals(countRawsIncludingHeader, splittingResponse.length);
    }

    @And("Сервер передаёт ID процесса в ответе")
    public void extractAndCheckProcessId() {
        processId = response.jsonPath().get("id");

        assertNotEquals(processId, null);
    }

    @And("Представление модели отчета корректно")
    public void chekValidReportModelBody() {
        getCurrentProcess();
        Map<Object, Object> responseMap = response.jsonPath().getMap("");

        assertTrue(responseMap.containsKey("userName"));
        assertTrue(responseMap.containsKey("title"));
        assertTrue(responseMap.containsKey("status"));
        assertTrue(responseMap.containsKey("type"));
        assertTrue(responseMap.containsKey("details"));
    }

    private String extractFileName() {
        waitUntilProcessDone();

        String filePath = response.jsonPath().getMap("details").get("payload").toString();
        String[] address = filePath.split("/");

        return address[address.length - 1];
    }

    private void waitUntilProcessDone() {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.println("Attempt process DONE: " + currentAttempt);

                getCurrentProcess();

                if ("DONE".equals(response.jsonPath().get("status"))) {
                    return;
                }

                sleep(300);
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("Process not DONE after " + MAX_RETRY_ATTEMPT + " attempts !");
        } catch (InterruptedException e) {
            throw new RuntimeException("Process not DONE: " + e.getMessage());
        }
    }

    private void getCurrentProcess() {
        response = getBaseRequestWithCurrentCookie().
                when().
                        log().ifValidationFails().
                        get("/processes/" + processId);
    }

    private void getValidationReport(String body) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(body).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/export/validation_results");
    }

    private String getValidationRequestDto(ExportResourceModel exportResourceModel) {
        ValidationRequestDto requestDto = new ValidationRequestDto();
        requestDto.setWsUiId("1011g");
        requestDto.setResources(Collections.singletonList(exportResourceModel));

        return gson.toJson(requestDto);
    }

    private ExportResourceModel getValidExportResourceModel() {
        return new ExportResourceModel(currentDatasetIdentifier, tableName, schemaId);
    }

    private ExportResourceModel getNonValidExportResourceModel() {
        return new ExportResourceModel("someDatasetName", "someTableName", "functionalZone");
    }

    private void waitUntilValidationSuccessfullyCreated() {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.println("Attempt create validation: " + currentAttempt);

                response = getBaseRequestWithCurrentCookie()
                        .given().
                                body(gson.toJson(getValidExportResourceModel())).
                                contentType(ContentType.JSON)
                        .when().
                                log().ifValidationFails().
                                post("/validation/results");

                if (!response.jsonPath().getList("results").isEmpty()) {
                    return;
                }

                sleep(300);
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("Validation not created after " + MAX_RETRY_ATTEMPT + " attempts !");
        } catch (InterruptedException e) {
            throw new RuntimeException("Validation not created : " + e.getMessage());
        }
    }
}
