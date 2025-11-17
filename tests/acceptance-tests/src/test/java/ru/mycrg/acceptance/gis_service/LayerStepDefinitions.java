package ru.mycrg.acceptance.gis_service;

import com.google.common.io.Files;
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

    @When("Пользователь делает запрос на создание слоя проекта {string} {string} {string} {string} {string} " +
            "{string} {string} {string} {string} {string}")
    public void createLayer(String title, String styleName, String type, String epsg, String dataSourceUri,
                            String sourceId, String sourceRecordId, String mode, String contentType, String style) {

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
                    : Long.parseLong(sourceRecordId);
            layerCreateDto.setSourceId(sourceId);
            layerCreateDto.setSourceRecordId(currentRecordId);
            layerCreateDto.setMode(mode);
        }

        super.createEntity(layerCreateDto);

        int currentId = 0;
        if (response.getStatusCode() == SC_OK || response.getStatusCode() == SC_CREATED) {
            currentId = response.jsonPath().getInt("id");
        }

        layerPool.put(currentId, layerCreateDto);
    }

    @When("Пользователь делает запрос на создание внешнего слоя")
    public void createExternalLayer() {
        layerCreateDto = new LayerCreateDto("Земельные участки", "external");
        layerCreateDto.setDataSourceUri(
                "https://pkk.rosreestr.ru/arcgis/rest/services/PKK6/CadastreObjects/MapServer/export");
        layerCreateDto.setResourceId("show:24");
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
        layerCreateDto.setResourceId("show:24");
        layerCreateDto.setMinZoom(15);
        layerCreateDto.setMaxZoom(40);

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
        assertEquals(layerCreateDto.getResourceId(), jsonPath.get("resourceId"));
        assertEquals(layerCreateDto.getStyleName(), jsonPath.get("styleName"));
        assertEquals(layerCreateDto.getType(), jsonPath.get("type"));
        assertEquals(layerCreateDto.getNativeCRS(), jsonPath.get("nativeCRS"));
        assertEquals(layerCreateDto.getContentType(), jsonPath.get("contentType"));
        assertEquals(format("scratch_database_%s:%s__%s",
                            orgId, layerCreateDto.getResourceId(), layerCreateDto.getNativeCRS().split(":")[1]),
                     jsonPath.get("complexName"));
    }

    @And("Поля внешнего слоя совпадают с переданными")
    public void checkExternalLayerData() {
        jsonPath = response.jsonPath();

        assertEquals(layerCreateDto.getTitle(), jsonPath.get("title"));
        assertEquals(layerCreateDto.getResourceId(), jsonPath.get("resourceId"));
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
                        "sourceId",
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
                    "sourceId",
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

        layerCreateDto.setSourceId(currentLibrary.getTableName());
        layerCreateDto.setSourceType("document");
        layerCreateDto.setSourceRecordId(currentDocumentId.longValue());
        layerCreateDto.setMode("full");
        layerCreateDto.setNativeCRS("EPSG:28406");
        layerCreateDto.setDataSourceUri(dataSourceUri);
        String tableName = format("%s_%s__%s", layerCreateDto.getSourceId(), currentDocumentId, currentFileId);
        layerCreateDto.setResourceId(tableName);

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
        layerCreateDto.setResourceId(currentTableName);

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
        layerCreateDto.setStyleName("generic");
        layerCreateDto.setDataStoreName("scratch_database_" + orgId);
        layerCreateDto.setDataset(currentDatasetIdentifier);
        layerCreateDto.setMode("full");
        layerCreateDto.setNativeCRS("EPSG:28406");
        layerCreateDto.setResourceId(latestTable.getName());

        super.createEntity(layerCreateDto);

        layerId = extractEntityIdFromResponse(response);
        layerComplexName = response.jsonPath().get("complexName");

        scenarioLayers.add(layerCreateDto);
    }

    @When("Пользователь делает повторный запрос на создание слоя проекта")
    public void createLayerAgain() {
        super.createEntity(layerCreateDto);
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
        assertTrue(presentedData.containsKey("resourceId"));
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

    @And("поля слоя совпадают с ожидаемыми")
    public void checkLayerDataAfterGpkgImport(Map<String, List<Object>> expectedFields) {
        JsonPath jsonPath = response.jsonPath();
        Map<String, Object> matchingRecord = jsonPath.getMap("[0]");

        boolean areEqual = true;
        for (Map.Entry<String, List<Object>> entry: expectedFields.entrySet()) {
            String key = entry.getKey();
            List<Object> list = entry.getValue();
            Object valueFromList = list != null && !list.isEmpty() ? list.get(0) : null;

            Object matchingValue = matchingRecord.get(key);
            if (!Objects.equals(String.valueOf(valueFromList), String.valueOf(matchingValue))) {
                System.out.printf("Mismatch for key '%s': expected '%s', but found '%s'%n",
                                  key, valueFromList, matchingValue);
                areEqual = false;
            }
        }

        assertTrue("The expected fields do not match the record fields", areEqual);
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

    @And("В ответе на удаление слоя проекта есть упоминание ID")
    public void checkCurrentIdInResponse() {
        super.checkCurrentIdInResponse();
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

    @And("В проекте корректно создан слой типа {string} на основе файла {string}")
    public void checkLayerTypeBasedOnFile(String expectedType, String fileName) {
        String title = Files.getNameWithoutExtension(fileName);
        String ext = Files.getFileExtension(fileName);

        checkLayerBasedOnFile(title, expectedType, ext);
    }

    /**
     * Обобщенный метод для проверки слоя, созданного на основе файла
     *
     * @param expectedTitle ожидаемое название слоя
     * @param expectedType  ожидаемый тип слоя
     * @param fileType      тип файла (dxf, tif, tab)
     */
    private void checkLayerBasedOnFile(String expectedTitle,
                                       String expectedType,
                                       String fileType) {
        super.getCurrentEntityByFilter("title", expectedTitle);

        JsonPath jsonPath = response.jsonPath();

        // Проверяем основные поля
        assertEquals(expectedTitle, jsonPath.getList("title").get(0));
        assertEquals(expectedType, jsonPath.getList("type").get(0));
        assertEquals("document", jsonPath.getList("sourceType").get(0));
        assertEquals("EPSG:7829", jsonPath.getList("nativeCRS").get(0));
        assertEquals("dl_default", jsonPath.getList("sourceId").get(0));

        // Проверяем resourceId - {recordId}_{fieldName}_{hash}
        String resourceId = jsonPath.getList("resourceId").get(0).toString();
        assertTrue("ResourceId должен содержать dl_default_" + currentDocumentId,
                   resourceId.contains("dl_default_" + currentDocumentId));

        // Проверяем dataset - {orgId}_{fileType}_store__{library}_{recordId}
        String dataset = jsonPath.getList("dataset").get(0).toString();
        assertTrue("Dataset должен содержать " + orgId + "_" + fileType + "_store__",
                   dataset.contains(orgId + "_" + fileType + "_store__"));

        // Проверяем workspace на геосервере - scratch_database_{orgId}
        String dataStoreName = jsonPath.getList("dataStoreName").get(0).toString();
        assertEquals("DataStoreName должен быть scratch_database_" + orgId,
                     "scratch_database_" + orgId, dataStoreName);

        // Проверяем complexName - {workspace}:{resourceId}__{epsgCode}
        String expectedComplexName = format("%s:%s__7829", dataStoreName, resourceId);
        assertEquals("ComplexName должен соответствовать формату workspace:resourceId__epsgCode",
                     expectedComplexName, jsonPath.getList("complexName").get(0));
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
