package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.DatasetCreateDto;

import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;

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

    @When("Отправляется запрос на создание набора {string} {string}")
    public void createDatasetRequest(String titleKey, String descriptionKey) {
        currentDatasetDto = new DatasetCreateDto(generateString(titleKey),
                                                 generateString(descriptionKey));

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(currentDatasetDto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post();

        currentDatasetName = extractDatasetName();
        datasetsPool.put(currentDatasetName, currentDatasetDto);
    }

    @And("Сервер передает Location созданного набора")
    public void shouldReturnCorrectDatasetLocation() {
        String url = response.getHeader("Location");

        String datasetName = extractDatasetName();
        assertThat(url, equalTo(makeDatasetUrl(datasetName)));
    }

    @And("Текущий набор существует в БД")
    public void currentDatasetExist() {
        getBaseRequestWithCurrentCookie()
                .when().
                get("/" + currentDatasetName)
                .then().
                        statusCode(SC_OK);
    }

    @When("Пользователь делает запрос на удаление текущего набора")
    public void deleteCurrentDataset() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        delete("/" + currentDatasetName);

        datasetsPool.remove(currentDatasetName);
    }

    @Then("Текущий набор отсутствует в БД")
    public void currentDatasetNotExist() {
        getBaseRequestWithCurrentCookie()
                .when().
                get("/" + currentDatasetName)
                .then().
                        statusCode(SC_NOT_FOUND);
    }

    @When("Администратор делает запрос на выборку наборов с фильтрацией по полю {string} и значению: {string}")
    public void getDatasetsByFilter(String field, String value) {
        super.getCurrentEntityByFilter(field, value);
    }

    private String extractDatasetName() {
        return response.getHeader("Location")
                       .split("/datasets/")[1];
    }

    private String makeDatasetUrl(String datasetName) {
        return String.format("%s:%d/api/data/datasets/%s", testServerHost, testServerPort, datasetName);
    }
}
