package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.DatasetPermissionCreateDto;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions.currentDatasetName;

public class DatasetsPermissionsStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets/");
    }

    @Then("Отправляется запрос на создание правила для текущего набора данных {string} {string} {string}")
    public void createPermissionForCurrentDataset(String role, String principalIdKey, String principalType) {
        DatasetPermissionCreateDto dto = new DatasetPermissionCreateDto(principalType,
                                                                        Long.parseLong(generateString(principalIdKey)),
                                                                        role);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        post(currentDatasetName + "/roleAssignment");
    }

    @And("Сервер передает Location созданного правила")
    public void shouldReturnCorrectDatasetPermissionLocation() {
        String url = response.getHeader("Location");

        Integer permissionId = extractIdFromLocation();
        assertThat(url, equalTo(makeDatasetPermissionUrl(currentDatasetName, permissionId)));
    }

    private String makeDatasetPermissionUrl(String datasetName, Integer permissionId) {
        return String.format("%s:%d/api/data/datasets/%s/roleAssignment/%s",
                             testServerHost, testServerPort, datasetName, permissionId);
    }
}
