package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.DatasetCreateDto;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class DatasetsStepsDefinitions extends BaseStepsDefinitions {

    public static String currentDatasetName;
    public static DatasetCreateDto currentDatasetDto;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets");
    }

    @When("Владелец организации делает запрос на выборку всех наборов данных")
    public void getAllDatasets() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @When("Владелец организации делает запрос на выборку набора данных {string}")
    public void getNotExistDataset(String datasetKey) {
        String datasetName = generateString(datasetKey);
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + datasetName);
    }

    @When("Владелец организации делает запрос на выборку таблицы {string} {string}")
    public void getNotExistTable(String datasetKey, String tableKey) {
        String datasetName = generateString(datasetKey);
        String tableName = generateString(tableKey);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + datasetName + "/tables/" + tableName);
    }

    @When("Отправляется запрос на создание набора {string} {string} {string}")
    public void createDatasetRequest(String nameKey, String titleKey, String descriptionKey) {
        currentDatasetDto = new DatasetCreateDto(generateString(nameKey),
                                                 generateString(titleKey),
                                                 generateString(descriptionKey));

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(currentDatasetDto)).
                        contentType(ContentType.JSON)
                .when().
                        post();

        currentDatasetName = currentDatasetDto.getName();
        datasetsPool.put(currentDatasetDto.getName(), currentDatasetDto);
    }

    @And("Сервер передает Location созданного набора")
    public void shouldReturnCorrectDatasetLocation() {
        String url = response.getHeader("Location");

        assertThat(url, equalTo(makeDatasetUrl(currentDatasetName)));
    }

    private String makeDatasetUrl(String datasetName) {
        return testServerHost + ":" + testServerPort + "/api/data/datasets/" + datasetName;
    }
}
