package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.DatasetCreateDto;

import java.util.Map;

import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;

public class DatasetsStepsDefinitions extends BaseStepsDefinitions {

    public static String currentDatasetName;
    public static DatasetCreateDto currentDatasetDto;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    private final ImportStepsDefinitions importSteps = new ImportStepsDefinitions();
    private final ValidationReportStepDefinition validationSteps = new ValidationReportStepDefinition();

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

    @When("Проверяем наличие данных в наборе данных")
    public void checkDataset() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentDatasetName + "/tables");

        assertEquals(Integer.valueOf(1), response.jsonPath().get("page.totalElements"));
    }

    @When("Пользователь делает запрос на несуществующий набор данных {string}")
    public void getNotExistDataset(String datasetKey) {
        getDatasetByName(generateString(datasetKey));
    }

    @When("Пользователь делает запрос на набор данных {string}")
    public void getDataset(String datasetTitle) {
        String foundedDatasetName = null;
        for (Map.Entry<String, DatasetCreateDto> entry: datasetsPool.entrySet()) {
            String datasetName = entry.getKey();
            DatasetCreateDto datasetDto = entry.getValue();
            if (datasetTitle.equals(datasetDto.getTitle())) {
                foundedDatasetName = datasetName;
            }
        }

        if (foundedDatasetName != null) {
            getDatasetByName(foundedDatasetName);
        } else {
            throw new RuntimeException("Not found dataset by title: " + datasetTitle);
        }
    }

    @When("Владелец организации делает запрос на выборку таблицы {string} {string}")
    public void getNotExistTable(String datasetKey, String tableKey) {
        String datasetName = generateString(datasetKey);
        String tableName = generateString(tableKey);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + datasetName + "/tables/" + tableName);
    }

    @When("Отправляется запрос на создание набора {string} {string} {string} {string} {string}")
    public void createDatasetRequest(String titleKey,
                                     String descriptionKey,
                                     String oktmoKey,
                                     String docTypeKey,
                                     String scale) {
        currentDatasetDto = new DatasetCreateDto(generateString(titleKey),
                                                 generateString(descriptionKey),
                                                 generateString(oktmoKey),
                                                 generateString(docTypeKey),
                                                 Integer.parseInt(scale));

        createDataset(currentDatasetDto);
    }

    @When("Существует набор")
    public void initDataset() {
        currentDatasetDto = new DatasetCreateDto(generateString("STRING_10"));

        createDataset(currentDatasetDto);
    }

    @And("Сервер передаёт Location созданного набора")
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

    @Given("Существуют заданное кол-во наборов: {int}")
    public void initializeDatasets(int count) {
        for (int i = 0; i < count; i++) {
            createDatasetRequest("STRING_5", "STRING_10", "", "", "500");
        }
    }

    @When("Администратор делает запрос на выборку наборов с фильтрацией по полю {string} и значению: {string}")
    public void getDatasetsByFilter(String field, String value) {
        super.getCurrentEntityByFilter(field, value);
    }

    @When("Текущий пользователь отправляет запрос на наборы с размером страницы: {string}")
    public void makePageableRequest(String pageSize) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=" + pageSize);
    }

    @And("Количество наборов данных соответствует ожидаемому: {string}")
    public void checkDatasetsSize(String datasetsSize) {
        int realCount = getEntitiesCount("datasets");

        assertEquals(Integer.parseInt(datasetsSize), realCount);
    }

    @Given("Существует набор данных с проверенным слоем в нем")
    public void initializeDataSetWithVerifiedLayers() throws InterruptedException {
        importValidShape();
        validationSteps.validateLayer();
    }

    @Given("Импортируем архив с валидным Shape-файлом в проект")
    public void importValidShape() throws InterruptedException {
        initDataset();
        importSteps.initImport();
        importSteps.sendArchive();
        importSteps.runImport();
        importSteps.waitUntilImportCompleteOnGeoserver();
        importSteps.importToProject();
        importSteps.waitImportToCurrentProject();
        importSteps.checkLayersAvailabilityInProject();
        checkDataset();
    }

    @When("Пользователь делает запрос на текущий набор данных")
    public void currentUserGetCurrentDataset() {
        authorizationBase.loginAsCurrentUser();

        getDatasetByName(currentDatasetName);
    }

    @When("Пользователь делает запрос на удаление слоя в наборе данных")
    public void deleteLayerFromDatasets() {
        response = getBaseRequestWithCurrentCookie()
                .when().log().all().
                        delete("/" + currentDatasetName + "/tables/" + currentTableName);
    }

    private void createDataset(DatasetCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post();

        currentDatasetName = extractDatasetName();
        datasetsPool.put(currentDatasetName, dto);
    }

    private String extractDatasetName() {
        return response.getHeader("Location")
                       .split("/datasets/")[1];
    }

    private String makeDatasetUrl(String datasetName) {
        return String.format("%s:%d/api/data/datasets/%s", testServerHost, testServerPort, datasetName);
    }

    private void getDatasetByName(String datasetName) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + datasetName);
    }
}
