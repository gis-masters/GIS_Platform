package ru.mycrg.acceptance.data_service.datasets;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.ImportStepsDefinitions;
import ru.mycrg.acceptance.data_service.ValidationReportStepDefinition;
import ru.mycrg.acceptance.data_service.dto.DatasetCreateDto;
import ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions;

import java.util.Map;

import static java.lang.String.format;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;

public class DatasetsStepsDefinitions extends BaseStepsDefinitions {

    public static String currentDatasetIdentifier;
    public static DatasetCreateDto currentDatasetDto;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    private final ImportStepsDefinitions importSteps = new ImportStepsDefinitions();
    private final ValidationReportStepDefinition validationSteps = new ValidationReportStepDefinition();
    private final TablesStepsDefinitions tablesSteps = new TablesStepsDefinitions();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets");
    }

    @When("Владелец организации делает запрос на выборку всех наборов данных")
    public Response getAllDatasets() {
        response = super.getAllEntities();

        return response;
    }

    @When("Проверяем наличие данных в наборе данных")
    public void checkDataset() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentDatasetIdentifier + "/tables");

        assertEquals(Integer.valueOf(1), response.jsonPath().get("page.totalElements"));
    }

    @And("в созданном наборе данных {int} слоёв")
    public void checkDatasetTablesCount(int count) {
        currentDatasetIdentifier = response.jsonPath().getString("details.datasetIdentifier");

        response = getBaseRequestWithCurrentCookie()
                .when()
                        .get("/" + currentDatasetIdentifier + "/tables");

        int actualCount = response.jsonPath().getList("content").size();
        assertEquals(count, actualCount);
    }

    @When("Пользователь делает запрос на несуществующий набор данных {string}")
    public void getNotExistDataset(String datasetKey) {
        getDatasetByIdentifier(generateString(datasetKey));
    }

    @When("Пользователь делает запрос на набор данных {string}")
    public void getDatasetByTitle(String datasetTitle) {
        String foundedDatasetName = null;
        for (Map.Entry<String, DatasetCreateDto> entry: datasetsPool.entrySet()) {
            String datasetName = entry.getKey();
            DatasetCreateDto datasetDto = entry.getValue();
            if (datasetTitle.equals(datasetDto.getTitle())) {
                foundedDatasetName = datasetName;
            }
        }

        if (foundedDatasetName != null) {
            getDatasetByIdentifier(foundedDatasetName);
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

    @Given("Существует набор данных")
    public void initDataset() {
        currentDatasetDto = new DatasetCreateDto(generateString("STRING_10"));

        createDataset(currentDatasetDto);
    }

    @When("Пользователь создает новый набор данных")
    public void createNewDataset() {
        initDataset();
    }

    @When("Существует 'набор данных' с двумя слоями в нём")
    public void createDatasetWithTwoTables() {
        currentDatasetDto = new DatasetCreateDto(generateString("STRING_8"));

        createDataset(currentDatasetDto);

        tablesSteps.createTablesRequest("layer_test_1", "TestLayer1", "l1", "EPSG:28406", "schema_for_test_table");
        tablesSteps.createTablesRequest("layer_test_2", "TestLayer2", "l2", "EPSG:28406", "schema_for_test_table");
    }

    @And("Сервер передаёт Location созданного набора")
    public void shouldReturnCorrectDatasetLocation() {
        String location = response.getHeader("Location");

        String datasetName = extractDatasetName(response);
        assertThat(location, equalTo(makeDatasetUrl(datasetName)));
    }

    @And("Текущий набор существует в БД")
    public void currentDatasetExist() {
        getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentDatasetIdentifier)
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
                        delete("/" + currentDatasetIdentifier);

        datasetsPool.remove(currentDatasetIdentifier);
    }

    @Then("Текущий набор отсутствует в БД")
    public void currentDatasetNotExist() {
        getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentDatasetIdentifier)
                .then().
                        statusCode(SC_NOT_FOUND);
    }

    @Then("В ответе присутствует поле 'itemsCount' и имеет значение {int}")
    public void responseContainsFieldItemCounts(Integer quantity) {
        jsonPath = response.jsonPath();
        Integer itemsCount = jsonPath.get("itemsCount");

        assertNotNull(itemsCount);
        assertEquals(quantity, itemsCount);
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
        int realCount = getEntitiesCount();

        assertEquals(Integer.parseInt(datasetsSize), realCount);
    }

    @Given("Существует набор данных с проверенным слоем в нем")
    public void initializeDataSetWithVerifiedLayers() throws InterruptedException {
        importValidShape();
        validationSteps.validateLayer();
    }

    @Given("Импортирован архив с валидным Shape-файлом в проект")
    public void importValidShape() throws InterruptedException {
        initDataset();
        importSteps.initImport();
        importSteps.sendArchive("test.zip");
        importSteps.runImport();
        importSteps.waitUntilImportCompleteOnGeoserver();
        importSteps.importToProject("functionalZone");
        importSteps.waitImportToCurrentProject();
        importSteps.checkLayersAvailabilityInProject();
        checkDataset();
    }

    @When("Пользователь делает запрос на текущий набор данных")
    public void currentUserGetCurrentDataset() {
        getDatasetByIdentifier(currentDatasetIdentifier);
    }

    @When("Пользователь делает запрос на удаление слоя в наборе данных")
    public void deleteLayerFromDatasets() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                       delete("/" + currentDatasetIdentifier + "/tables/" + currentTableName);
    }

    @When("Пользователь делает запрос на редактирование текущего набора данных {string} {string}")
    public void currentUserUpdateCurrentDataset(String title, String details) {
        authorizationBase.loginAsCurrentUser();

        String body = format("{\"title\": \"%s\",\"details\": \"%s\"}", generateString(title), generateString(details));

        updateCurrentDataset(body);
    }

    @When("Владелец организации делает запрос на редактирование текущего набора данных {string} {string}")
    public void orgOwnerUpdateCurrentDataset(String title, String details) {
        authorizationBase.loginAsOwner();

        String body = format("{\"title\": \"%s\",\"details\": \"%s\"}", generateString(title), generateString(details));

        updateCurrentDataset(body);
    }

    @When("Отправляется PATCH запрос на эндпоинт")
    public void sendRequestToEndpoint() {
        orgOwnerUpdateCurrentDataset("test", "test");
    }

    @And("Набор данных успешно обновлён")
    public void checkResponseContainsUpdatedFields() {
        getDatasetByIdentifier(currentDatasetIdentifier);

        String title = response.jsonPath().get("title");
        String details = response.jsonPath().get("details");

        assertEquals("updated Title", title);
        assertEquals("updated Details", details);
    }

    private void createDataset(DatasetCreateDto dto) {
        System.out.println("Try create dataset: " + dto.getTitle());

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post();

        currentDatasetIdentifier = extractDatasetName(response);

        datasetsPool.put(currentDatasetIdentifier, dto);
    }

    private String extractDatasetName(Response response) {
        String location = getLocation(response);

        System.out.println("Dataset location: " + location);

        String[] split = location.split("/datasets/");
        if (split.length < 1) {
            throw new IllegalArgumentException("Вернулся не корректный location");
        }

        return split[1];
    }

    private String makeDatasetUrl(String datasetName) {
        return format("%s:%d/api/data/datasets/%s", testServerHost, testServerPort, datasetName);
    }

    private void getDatasetByIdentifier(String currentDatasetIdentifier) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentDatasetIdentifier);
    }

    private void updateCurrentDataset(String body) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(body).
                        contentType(ContentType.JSON)
                .when().
                        patch("/" + currentDatasetIdentifier);
    }
}
