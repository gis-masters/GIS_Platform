package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.path.json.JsonPath;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerUpdateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.ArrayList;
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
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFileId;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFilePath;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentLibrary;
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
    public static String currentWorkspace;
    public static String currentCoveragestoreName;
    public static String currentStoreName;

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

    @When("Пользователь делает запрос на создание слоя проекта {string} {string} {string} {string} {string} " +
            "{string} {string} {string} {string} {string}")
    public void createLayer(String title, String styleName, String type, String epsg, String dataSourceUri,
                            String libraryId, String recordId, String mode, String contentType, String style) {

        String dataStoreName = "scratch_database_" + orgId;

        layerCreateDto = new LayerCreateDto(generateString(title),
                                            currentDatasetIdentifier,
                                            currentTableName,
                                            generateString(styleName),
                                            type,
                                            generateString(dataStoreName),
                                            generateString(epsg),
                                            generateString(dataSourceUri),
                                            generateString(contentType),
                                            generateString(style));
        if (type.equals("raster")) {
            Long currentRecordId = Objects.nonNull(currentDocumentId)
                    ? currentDocumentId
                    : Long.parseLong(recordId);
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

    @When("{string} делает запрос на создание внешнего слоя в проекте {string}")
    public void userCreateExternalLayerInProject(String userName, String itemName) {
        UserCreateDto user = getUserByName(userName);
        authorizationBase.loginAs(user.getEmail(), user.getPassword());

        projectId = getProjectIdByName(itemName);

        layerCreateDto = new LayerCreateDto("Земельные участки", "external");
        layerCreateDto.setDataSourceUri(
                "https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/CadastreObjects/MapServer/export");
        layerCreateDto.setTableName("show:24");
        layerCreateDto.setMinZoom(15);
        layerCreateDto.setMaxZoom(40);

        super.createEntity(layerCreateDto);
    }

    @When("Пользователь делает запрос на добавление слоя в проект")
    public void createRandomLayer() {
        authorizationBase.loginAsCurrentUser();

        layerCreateDto = new LayerCreateDto(generateString("STRING_5"), generateString("STRING_5"),
                                            generateString("STRING_5"), generateString("STRING_5"),
                                            "vector", generateString("STRING_5"), "EPSG:28406",
                                            generateString("STRING_8"), null, generateString("STRING_8"));

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
        assertEquals(layerCreateDto.getNativeCRS(), jsonPath.get("nativeCRS"));
        assertEquals(layerCreateDto.getContentType(), jsonPath.get("contentType"));
        assertEquals(String.format("scratch_database_%s:%s__%s",
                                   orgId, layerCreateDto.getTableName(), layerCreateDto.getNativeCRS().split(":")[1]),
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
                        "EPSG:28406",
                        "transportobj",
                        "libraryId",
                        "1",
                        "full",
                        null,
                        "some style");
            assertEquals(SC_CREATED, response.getStatusCode());
            extractAndSetLayerIdFromBody();
        }
    }

    @Given("Существует другой слой проекта")
    public void initAnotherLayer() {
        createLayer(layerTitle,
                    "transportobj",
                    "vector",
                    "EPSG:28406",
                    "transportobj",
                    "libraryId",
                    "1",
                    "",
                    null,
                    "some style");
        assertEquals(SC_CREATED, response.getStatusCode());
        extractAndSetLayerIdFromBody();
    }

    @Given("Существует растровый слой размещенный в проекте")
    public void createRasterLayer() {
        String dataSourceUri = format("file://%s", currentFilePath);
        layerCreateDto = new LayerCreateDto("Тестовый растр", "raster");

        layerCreateDto.setLibraryId(currentLibrary.getTableName());
        layerCreateDto.setMode("full");
        layerCreateDto.setNativeCRS("EPSG:28406");
        layerCreateDto.setDataSourceUri(dataSourceUri);
        layerCreateDto.setRecordId(currentDocumentId.longValue());
        String tableName = format("%s_%s__%s", layerCreateDto.getLibraryId(), currentDocumentId, currentFileId);
        layerCreateDto.setTableName(tableName);

        super.createEntity(layerCreateDto);

        layerId = extractEntityIdFromResponse(response);
        layerComplexName = response.jsonPath().get("complexName");
    }

    @Given("Существует векторный слой, на основе созданной таблицы, размещенный в проекте")
    public void createVectorLayerOnCurrentTable() {
        layerCreateDto = new LayerCreateDto("Тестовый вектор", "vector");

        layerCreateDto.setStyleName("generic");
        layerCreateDto.setDataStoreName("scratch_database_" + orgId);
        layerCreateDto.setDataset(currentDatasetIdentifier);
        layerCreateDto.setMode("full");
        layerCreateDto.setNativeCRS("EPSG:28406");
        layerCreateDto.setTableName(currentTableName);

        super.createEntity(layerCreateDto);

        assertEquals(201, response.statusCode());

        layerId = extractEntityIdFromResponse(response);
        layerComplexName = response.jsonPath().get("complexName");
    }

    @Given("В созданном проекте создан слой {string} на основе созданных набора данных и таблицы")
    public void createVectorLayerOnCurrentTable(String layerTitle) {
        TableCreateDto latestTable = getLatestTable();

        layerCreateDto = new LayerCreateDto(layerTitle, "vector");
        layerCreateDto.setSchemaId(latestTable.getSchemaId());
        layerCreateDto.setStyleName("default");
        layerCreateDto.setDataStoreName("scratch_database_" + orgId);
        layerCreateDto.setDataset(currentDatasetIdentifier);
        layerCreateDto.setMode("full");
        layerCreateDto.setNativeCRS("EPSG:28406");
        layerCreateDto.setTableName(latestTable.getName());

        super.createEntity(layerCreateDto);

        layerId = extractEntityIdFromResponse(response);
        layerComplexName = response.jsonPath().get("complexName");

        scenarioLayers.add(layerCreateDto);
    }

    @Given("Пользователь делает запрос на размещение растрового слоя в проекте")
    public void createRasterLayerRequest() {
        createRasterLayer();
    }

    @When("Пользователь делает повторный запрос на создание слоя проекта")
    public void createLayerAgain() {
        super.createEntity(layerCreateDto);
    }

    @When("Пользователь делает запрос на все слои организации")
    public void getAllLayers() {
        super.get1000Entities();
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
        assertThat(presentedData.get("style"), is(layerUpdateDto.getStyle()));
    }

    @When("Пользователь делает запрос на добавление слоя в папку-родитель")
    public void updateLayerAndAddToLayerGroup() {
        layerUpdateDto = new LayerUpdateDto(layerGroupId.longValue());

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(layerUpdateDto)).
                        contentType(PATCH_CONTENT_TYPE)
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

    @When("Владелец организации делает запрос на удаление слоя")
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

    @Then("Слой, созданный на основе файла, есть на gis-service")
    public void checkThatRelatedLayerWasNotDeleted() throws InterruptedException {
        sleep(1000);

        super.getEntityById(layerId);

        int statusCode = response.getStatusCode();

        assertEquals(200, statusCode);
    }

    @Then("Слой, созданный на основе файла, есть на geoserver")
    public void checkThatRelatedLayerWasNotDeletedOnGeoserver() {
        getCurrentWorkspaceAndStoreName();

        response = getBaseRequestWithCurrentCookie()
                .basePath("geoserver/rest")
                .when().
                        get(format("/workspaces/%s/coveragestores/%s", currentWorkspace, currentStoreName));

        int statusCode = response.getStatusCode();

        assertEquals(200, statusCode);
    }

    @And("В ответе на удаление слоя проекта есть упоминание ID")
    public void checkCurrentIdInResponse() {
        super.checkCurrentIdInResponse();
    }

    @And("Сообщение об отсутствии прав на добавление слоя соответствует заданному формату")
    public void checkResponseMessageWhenAddLayerForbidden() {
        super.checkErrorResponseMessage("Недостаточно прав для редактирования проекта: " + projectDto.getName());
    }

    @And("Текущая группа слоёв 'не пострадала'")
    public void checkThatLayerGroupExist() {
        String url = "/projects/" + projectId + "/groups/" + layerGroupId;
        response = getBaseRequestWithCurrentCookie()
                .basePath("")
                .when().
                        get(url);

        assertEquals(200, response.getStatusCode());
    }

    @And("Удален слой ссылающийся на эту таблицу")
    public void checkThatLayerWasDeleted() throws InterruptedException {
        sleep(1000);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.valueOf(layerId));

        assertEquals(404, response.getStatusCode());
    }

    @And("В проекте корректно создан слой на основе DXF файла")
    public void checkLayerBasedOnDxf() {
        super.getCurrentEntityByFilter("title", "best");

        JsonPath jsonPath = response.jsonPath();

        assertEquals("best", jsonPath.getList("title").get(0));
        assertEquals("dxf", jsonPath.getList("type").get(0));
        assertEquals("dxf_style", jsonPath.getList("styleName").get(0));
        assertEquals("EPSG:7829", jsonPath.getList("nativeCRS").get(0));
        assertEquals("dl_default", jsonPath.getList("libraryId").get(0));

        // tableName - {recordId}_{fieldName}_{hash} - "2_some_files_504450693"
        String tableName = jsonPath.getList("tableName").get(0).toString();
        assertTrue(tableName.contains("dl_default_" + currentDocumentId));

        // dataset - {orgId}_{fileType}_store__{library}_{recordId} - "8_tab_store__dl_default_2_"
        assertTrue(jsonPath.getList("dataset").get(0).toString().contains(orgId + "_dxf_store__"));

        // workspace на геосервере - scratch_database_1
        String dataStoreName = jsonPath.getList("dataStoreName").get(0).toString();
        assertEquals("scratch_database_" + orgId, dataStoreName);

        // complexName - {workspace}:{tableName}__{epsgCode} - "scratch_database_8:2_some_files_504450693__7829"
        assertEquals(String.format("%s:%s__7829", dataStoreName, tableName), jsonPath.getList("complexName").get(0));
    }

    @And("В проекте корректно создан слой на основе TAB файла")
    public void checkLayerBasedOnTab() {
        super.getCurrentEntityByFilter("title", "someTab");

        JsonPath jsonPath = response.jsonPath();

        assertEquals("someTab", jsonPath.getList("title").get(0));
        assertEquals("tab", jsonPath.getList("type").get(0));
        assertEquals("generic", jsonPath.getList("styleName").get(0));
        assertEquals("EPSG:7829", jsonPath.getList("nativeCRS").get(0));
        assertEquals("dl_default", jsonPath.getList("libraryId").get(0));

        // tableName - {recordId}_{fieldName}_{hash} - "2_some_files_504450693"
        String tableName = jsonPath.getList("tableName").get(0).toString();
        assertTrue(tableName.contains("dl_default_" + currentDocumentId));

        // dataset - {orgId}_{fileType}_store__{library}_{recordId} - "7_tab_store__541798153_dl_default_1_"
        assertTrue(jsonPath.getList("dataset").get(0).toString().contains(orgId + "_tab_store__"));

        // workspace на геосервере - scratch_database_1
        String dataStoreName = jsonPath.getList("dataStoreName").get(0).toString();
        assertEquals("scratch_database_" + orgId, dataStoreName);

        // complexName - {workspace}:{tableName}__{epsgCode} - "scratch_database_8:2_some_files_504450693__7829"
        assertEquals(String.format("%s:%s__7829", dataStoreName, tableName), jsonPath.getList("complexName").get(0));
    }

    @Then("Параметр transparent color по умолчанию чёрный")
    public void checkLayerTransparentColorIsBlack() {
        getCurrentWorkspaceAndStoreName();
        getCurrentLayerFromGeoserver(currentWorkspace, currentStoreName, currentCoveragestoreName);

        Map<String, Object> entry = response.jsonPath().getMap("coverage.parameters.entry");

        assertNotNull(entry);

        List<String> parameters = (ArrayList<String>) entry.get("string");

        assertTrue(parameters.contains("InputTransparentColor"));
        assertTrue(parameters.contains("#000000"));
    }

    @When("Пользователь пытается выгрузить ESRI Shape-файл текущего слоя")
    public void exportShpOfCurrentLayer() {
        String exportEndpoint = "http://localhost/gis/export/shape";

        response = super.getBaseRequestWithCurrentCookie()
                        .basePath("")
                .given().
                    queryParam("typeName", layerComplexName).
                    queryParam("srsName", "EPSG:28406").
                    urlEncodingEnabled(true).
                    queryParam("layerTitle", layerCreateDto.getTitle())
                .when().
                    get(exportEndpoint);
    }

    private void getCurrentLayerFromGeoserver(String workspace, String coveragestore, String coverage) {
        response = getBaseRequestWithCurrentCookie()
                       .basePath("geoserver/rest")
                .when().
                       get(format("/workspaces/%s/coveragestores/%s/coverages/%s.json",
                                  workspace, coveragestore, coverage));
    }

    private void getCurrentWorkspaceAndStoreName() {
        String[] complexName = layerComplexName.split(":");
        currentWorkspace = complexName[0];
        currentCoveragestoreName = complexName[1];
        currentStoreName = format("store_%s", complexName[1]);
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
        List<String> data = dataTable.asLists(String.class).get(0);
        layerUpdateDto = new LayerUpdateDto(generateString(data.get(0)),
                                            currentDatasetIdentifier,
                                            Boolean.parseBoolean(generateString(data.get(1))),
                                            Integer.parseInt(generateString(data.get(2))),
                                            Integer.parseInt(generateString(data.get(3))),
                                            Integer.parseInt(generateString(data.get(4))),
                                            Integer.parseInt(generateString(data.get(5))),
                                            generateString(data.get(6)),
                                            generateString(data.get(7)),
                                            data.get(8));

        updateLayer(layerUpdateDto);
    }

    private void updateLayer(LayerUpdateDto dto) {
        updateLayer(gson.toJson(dto));
    }

    private void updateLayer(String json) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(json).
                        contentType(PATCH_CONTENT_TYPE)
                .when().
                        patch("" + layerId);
    }
}
