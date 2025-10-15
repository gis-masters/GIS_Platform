package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.ExportResourceModel;
import ru.mycrg.acceptance.data_service.dto.ValidationRequestDto;

import java.util.Collections;

import static java.lang.Thread.sleep;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.schemaId;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.tableName;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;

public class ValidationReportStepDefinition extends BaseStepsDefinitions {

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

    private String getValidationRequestDto(ExportResourceModel exportResourceModel) {
        ValidationRequestDto requestDto = new ValidationRequestDto();
        requestDto.setWsUiId("1011g");
        requestDto.setResources(Collections.singletonList(exportResourceModel));

        return gson.toJson(requestDto);
    }

    private ExportResourceModel getValidExportResourceModel() {
        return new ExportResourceModel(currentDatasetIdentifier, tableName, schemaId);
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
