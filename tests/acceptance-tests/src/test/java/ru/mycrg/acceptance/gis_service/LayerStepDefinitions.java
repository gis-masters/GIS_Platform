package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerUpdateDto;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static java.lang.String.format;
import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.tifFileId;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.tifFilePath;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentRecordId;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;
import static ru.mycrg.acceptance.gis_service.LayerGroupStepsDefinitions.layerGroupId;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectDto;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class LayerStepDefinitions extends BaseStepsDefinitions {

    public static LayerCreateDto layerCreateDto;
    public static LayerUpdateDto layerUpdateDto;
    public static Integer layerId;
    public static String layerTitle = "Искусственные дорожные сооружения";
    public static String layerComplexName;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/projects/" + projectId + "/layers");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/projects/" + projectId + "/layers");
    }

    @Override
    public Integer getCurrentId() {
        return layerId;
    }

    @Override
    public void setCurrentId(Integer id) {
        layerId = id;
    }

    @When("Пользователь делает запрос на создание слоя проекта {string} {string} {string} {string} {string} {string} {string} {string} {string}")
    public void createLayer(String title, String styleName, String type, String schemaId, String epsg,
                            String dataSourceUri, String libraryId, String recordId, String mode) {

        String dataStoreName = "scratch_database_" + orgId;

        layerCreateDto = new LayerCreateDto(generateString(title),
                                            currentDatasetIdentifier,
                                            currentTableName,
                                            generateString(styleName),
                                            type,
                                            generateString(schemaId),
                                            generateString(dataStoreName),
                                            generateString(epsg),
                                            generateString(dataSourceUri));
        if (type.equals("raster")) {
            Long currentRecordId = Objects.nonNull(LibraryStepsDefinitions.currentRecordId)
                    ? LibraryStepsDefinitions.currentRecordId
                    : Long.getLong(recordId);
            layerCreateDto.setLibraryId(libraryId);
            layerCreateDto.setRecordId(currentRecordId);
            layerCreateDto.setMode(mode);
        }

        super.createEntity(layerCreateDto);
    }

    @When("Пользователь делает запрос на создание внешнего слоя")
    public void createExternalLayer() {
        layerCreateDto = new LayerCreateDto("Земельные участки", "external");
        layerCreateDto.setDataSourceUri(
                "https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/CadastreObjects/MapServer/export");
        layerCreateDto.setTableName("show:24");
        layerCreateDto.setMinZoom(15);
        layerCreateDto.setMaxZoom(40);

        super.createEntity(layerCreateDto);

        layerId = extractEntityIdFromResponse(response);
    }

    @When("Пользователь делает запрос на добавление слоя в проект")
    public void createRandomLayer() {
        authorizationBase.loginAsCurrentUser();

        layerCreateDto = new LayerCreateDto(generateString("STRING_5"), generateString("STRING_5"),
                                            generateString("STRING_5"), generateString("STRING_5"),
                                            "vector", generateString("STRING_5"), generateString("STRING_5"),
                                            "EPSG:28406", generateString("STRING_8"));

        super.createEntity(layerCreateDto);
    }

    @And("Сервер передаёт ID слоя проекта в ответе")
    public void extractAndSetLayerIdFromBody() {
        super.extractAndSetEntityIdFromBody();

        layerPool.put(layerId, layerCreateDto);
    }

    @When("Пользователь делает запрос на текущий слой")
    public void getCurrentLayer() {
        super.getCurrentEntity();
    }

    @And("Поля векторного слоя совпадают с переданными")
    public void checkVectorLayerData() {
        jsonPath = response.jsonPath();

        assertEquals(layerCreateDto.getTitle(), jsonPath.get("title"));
        assertEquals(layerCreateDto.getDataset(), jsonPath.get("dataset"));
        assertEquals(layerCreateDto.getTableName(), jsonPath.get("tableName"));
        assertEquals(layerCreateDto.getStyleName(), jsonPath.get("styleName"));
        assertEquals(layerCreateDto.getType(), jsonPath.get("type"));
        assertEquals(layerCreateDto.getSchemaId(), jsonPath.get("schemaId"));
        assertEquals(layerCreateDto.getNativeCRS(), jsonPath.get("nativeCRS"));
        assertEquals(format("scratch_database_%s:%s", orgId, layerCreateDto.getTableName()),
                     jsonPath.get("complexName"));
    }

    @And("Поля внешнего слоя совпадают с переданными")
    public void checkExternalLayerData() {
        jsonPath = response.jsonPath();

        assertEquals(layerCreateDto.getTitle(), jsonPath.get("title"));
        assertEquals(layerCreateDto.getTableName(), jsonPath.get("tableName"));
        assertEquals(layerCreateDto.getType(), jsonPath.get("type"));
        assertEquals(layerCreateDto.getDataSourceUri(), jsonPath.get("dataSourceUri"));
    }

    @Given("Существует слой проекта")
    public void initLayer() {
        if (isLayerExistInPool(layerTitle)) {
            makeExactLayerAsCurrent(layerTitle);
        } else if (!layerPool.isEmpty()) {
            makeLastAvailableLayerAsCurrent();
        } else {
            createLayer(layerTitle,
                        "transportobj",
                        "vector",
                        "transportobj",
                        "EPSG:28406",
                        generateString("STRING_6"),
                        "libraryId",
                        "1",
                        "full");
            assertEquals(SC_CREATED, response.getStatusCode());
            extractAndSetLayerIdFromBody();
        }
    }

    @Given("Существует другой слой проекта")
    public void initAnotherLayer() {
        createLayer(layerTitle,
                    "transportobj",
                    "vector",
                    "transportobj",
                    "EPSG:28406",
                    generateString("STRING_6"),
                    "libraryId",
                    "1",
                    "");
        assertEquals(SC_CREATED, response.getStatusCode());
        extractAndSetLayerIdFromBody();
    }

    @Given("Существует растровый слой размещенный в проекте")
    public void createRasterLayer() {
        String dataSourceUri = format("file://%s", tifFilePath);
        layerCreateDto = new LayerCreateDto("Тестовый растр", "raster");

        layerCreateDto.setLibraryId("dl_default");
        layerCreateDto.setMode("full");
        layerCreateDto.setNativeCRS("EPSG:28406");
        layerCreateDto.setDataSourceUri(dataSourceUri);
        layerCreateDto.setRecordId(currentRecordId.longValue());
        String tableName = format("%s_%s__%s", layerCreateDto.getLibraryId(), currentRecordId, tifFileId);
        layerCreateDto.setTableName(tableName);

        super.createEntity(layerCreateDto);

        layerId = extractEntityIdFromResponse(response);
        layerComplexName = response.jsonPath().get("complexName");
    }

    @When("Пользователь делает повторный запрос на создание слоя проекта")
    public void createLayerAgain() {
        super.createEntity(layerCreateDto);
    }

    @When("Пользователь делает запрос на все слои организации")
    public void getAllLayers() {
        super.getAllEntities();
    }

    @And("Представление слоя проекта корректно")
    public void checkLayerKeys() {
        Map<String, String> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("title"));
        assertTrue(presentedData.containsKey("type"));
        assertTrue(presentedData.containsKey("dataset"));
        assertTrue(presentedData.containsKey("tableName"));
        assertTrue(presentedData.containsKey("enabled"));
        assertTrue(presentedData.containsKey("position"));
        assertTrue(presentedData.containsKey("transparency"));
        assertTrue(presentedData.containsKey("maxZoom"));
        assertTrue(presentedData.containsKey("minZoom"));
        assertTrue(presentedData.containsKey("styleName"));
        assertTrue(presentedData.containsKey("nativeCRS"));
        assertTrue(presentedData.containsKey("schemaId"));
        assertTrue(presentedData.containsKey("complexName"));
    }

    @When("Пользователь делает запрос на обновление полей слоя проекта")
    public void updateLayerAsUser(DataTable dataTable) {
        authorizationBase.loginAsCurrentUser();

        updateLayer(dataTable);
    }

    @When("Владелец делает запрос на обновление полей слоя проекта")
    public void updateLayerAsOwner(DataTable dataTable) {
        authorizationBase.loginAsOwner();

        updateLayer(dataTable);
    }

    @When("Администратор делает запрос на обновление полей слоя {string}")
    public void updateLayerAsJson(String json) {
        updateLayer(json);
    }

    @Then("Обновленные поля слоя совпадают с переданными")
    public void checkLayerDataUpdated() {
        Map<String, Object> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertThat(presentedData.get("title"), is(layerUpdateDto.getTitle()));
        assertThat(presentedData.get("dataset"), is(layerUpdateDto.getDataset()));
        assertThat(presentedData.get("enabled"), is(layerUpdateDto.getEnabled()));
        assertThat(presentedData.get("position"), is(layerUpdateDto.getPosition()));
        assertThat(presentedData.get("transparency"), is(layerUpdateDto.getTransparency()));
        assertThat(presentedData.get("minZoom"), is(layerUpdateDto.getMinZoom()));
        assertThat(presentedData.get("maxZoom"), is(layerUpdateDto.getMaxZoom()));
        assertThat(presentedData.get("nativeCRS"), is(layerUpdateDto.getNativeCRS()));
    }

    @When("Пользователь делает запрос на добавление слоя в папку-родитель")
    public void updateLayerAndAddToLayerGroup() {
        layerUpdateDto = new LayerUpdateDto(layerGroupId.longValue());

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(layerUpdateDto)).
                        contentType("application/merge-patch+json")
                .when().
                        patch("" + layerId);
    }

    @Then("В полях слоя есть упоминание папки родителя")
    public void checkLayerInLayerGroup() {
        Map<String, Object> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertThat(presentedData.get("parentId"), is(layerGroupId));
    }

    @Then("У текущего слоя должно отсутствовать упоминание родительской группы")
    public void checkLayerIsNotInLayerGroup() {
        Map<String, Object> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertNull(presentedData.get("parentId"));
    }

    @When("Владелец делает запрос на удаление слоя")
    public void deleteLayerAsOwner() {
        authorizationBase.loginAsOwner();

        super.deleteCurrentEntity();

        layerPool.remove(layerId);
    }

    @When("Пользователь делает запрос на удаление слоя")
    public void deleteLayer() {
        authorizationBase.loginAsCurrentUser();

        super.deleteCurrentEntity();

        layerPool.remove(layerId);
    }

    @Then("Слой, созданный на основе файла, отсутсвует на gis-service")
    public void checkThatRelatedLayerWasDeleted() throws InterruptedException {
        sleep(1000);

        super.getEntityById(layerId);

        int statusCode = response.getStatusCode();

        assertEquals(404, statusCode);
    }

    @Then("Слой, созданный на основе файла, отсутсвует на geoserver")
    public void checkThatRelatedLayerWasDeletedOnGeoserver() {
        String[] complexName = layerComplexName.split(":");
        String workspace = complexName[0];
        String storeName = format("store_%s", complexName[1]);

        response = getBaseRequestWithCurrentCookie()
                .basePath("geoserver/rest")
                .when().
                        get(format("/workspaces/%s/coveragestores/%s", workspace, storeName));

        int statusCode = response.getStatusCode();

        assertEquals(404, statusCode);
    }

    @And("В ответе на удаление слоя проекта есть упоминание ID")
    public void checkCurrentIdInResponse() {
        super.checkCurrentIdInResponse();
    }

    @And("Сообщение об отсутствии прав на добавление слоя соответствует заданному формату")
    public void checkResponseMessageWhenAddLayerForbidden() {
        super.checkErrorResponseMessage("Недостаточно прав для редактирования проекта: " + projectDto.getProjectName());
    }

    @And("Текущая группа слоёв 'не пострадала'")
    public void checkThatLayerGroupExist() {
        String url = "/projects/" + projectId + "/groups/" + layerGroupId;
        response = getBaseRequestWithCurrentCookie()
                .basePath("")
                .when().
                        log().all().
                        get(url);

        assertEquals(200, response.getStatusCode());
    }

    @And("Удален слой ссылающийся на эту таблицу")
    public void checkThatLayerWasDeleted() throws InterruptedException {
        sleep(1000);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().all().
                        get(String.valueOf(layerId));

        assertEquals(404, response.getStatusCode());
    }

    private void makeLastAvailableLayerAsCurrent() {
        layerPool.entrySet().stream()
                 .skip(layerPool.size() - 1)
                 .findFirst()
                 .ifPresent(entry -> {
                     layerId = entry.getKey();
                     layerCreateDto = entry.getValue();
                 });
    }

    private void makeExactLayerAsCurrent(String title) {
        layerPool.entrySet().stream()
                 .filter(entry -> entry.getValue().getTitle().equals(title))
                 .findFirst()
                 .ifPresent(entry -> {
                     layerId = entry.getKey();
                     layerCreateDto = entry.getValue();
                 });
    }

    private boolean isLayerExistInPool(String title) {
        return layerPool.values().stream()
                        .anyMatch(dto -> title.equals(dto.getTitle()));
    }

    private void updateLayer(DataTable dataTable) {
        List<String> data = dataTable.asList();
        layerUpdateDto = new LayerUpdateDto(generateString(data.get(0)),
                                            currentDatasetIdentifier,
                                            Boolean.parseBoolean(generateString(data.get(1))),
                                            Integer.parseInt(generateString(data.get(2))),
                                            Integer.parseInt(generateString(data.get(3))),
                                            Integer.parseInt(generateString(data.get(4))),
                                            Integer.parseInt(generateString(data.get(5))),
                                            generateString(data.get(6)));

        updateLayer(layerUpdateDto);
    }

    private void updateLayer(LayerUpdateDto dto) {
        updateLayer(gson.toJson(dto));
    }

    private void updateLayer(String json) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(json).
                        contentType("application/merge-patch+json")
                .when().
                        patch("" + layerId);
    }
}
