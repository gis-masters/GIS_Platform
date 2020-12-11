package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerUpdateDto;

import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.gis_service.LayerGroupStepsDefinitions.layerGroupId;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class LayerStepDefinitions extends BaseStepsDefinitions {

    public static LayerCreateDto layerCreateDto;
    public static LayerUpdateDto layerUpdateDto;
    public static Integer layerId;

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

    @When("Пользователь делает запрос на создание слоя проекта")
    public void createLayer(DataTable dataTable) {
        List<String> data = dataTable.asList();

        layerCreateDto = new LayerCreateDto(generateString(data.get(0)), generateString(data.get(1)),
                                            generateString(data.get(2)), generateString(data.get(3)),
                                            generateString(data.get(4)), generateString(data.get(5)),
                                            generateString(data.get(6)), generateString(data.get(7)),
                                            generateString(data.get(8)));

        super.createEntity(layerCreateDto);
    }

    @And("Сервер передает ID слоя проекта в ответе")
    public void extractAndSetLayerIdFromBody() {
        super.extractAndSetEntityIdFromBody();

        layerPool.put(layerId, layerCreateDto);
    }

    @When("Пользователь делает запрос на текущий слой")
    public void checkExactLayer() {
        super.getCurrentEntityInfoById();
    }

    @And("Поля слоя проекта совпадают с переданными")
    public void checkLayerData() {
        jsonPath = response.jsonPath();

        assertEquals(layerCreateDto.getTitle(), jsonPath.get("title"));
        assertEquals(layerCreateDto.getDataset(), jsonPath.get("dataset"));
        assertEquals(layerCreateDto.getInternalName(), jsonPath.get("internalName"));
        assertEquals(layerCreateDto.getStyleName(), jsonPath.get("styleName"));
        assertEquals(layerCreateDto.getType(), jsonPath.get("type"));
        assertEquals(layerCreateDto.getSchemaId(), jsonPath.get("schemaId"));
        assertEquals(layerCreateDto.getNativeCRS(), jsonPath.get("nativeCRS"));
        assertEquals(String.format("scratch_database_%s:%s", orgId, layerCreateDto.getInternalName()),
                     jsonPath.get("complexName"));
    }

    @Given("Существует слой проекта")
    public void initLayer(DataTable dataTable) {
        List<String> data = dataTable.asList();
        String title = data.get(0);
        if (isLayerExistInPool(title)) {
            makeExactLayerAsCurrent(title);
        } else if (!layerPool.isEmpty()) {
            makeLastAvailableLayerAsCurrent();
        } else {
            createLayer(dataTable);
            assertEquals(SC_CREATED, response.getStatusCode());
            extractAndSetLayerIdFromBody();
        }
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
        assertTrue(presentedData.containsKey("internalName"));
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
    public void updateLayer(DataTable dataTable) {
        List<String> data = dataTable.asList();

        layerUpdateDto = new LayerUpdateDto(generateString(data.get(0)),
                                            generateString(data.get(1)),
                                            Boolean.parseBoolean(generateString(data.get(2))),
                                            Integer.parseInt(generateString(data.get(3))),
                                            Integer.parseInt(generateString(data.get(4))),
                                            Integer.parseInt(generateString(data.get(5))),
                                            Integer.parseInt(generateString(data.get(6))),
                                            generateString(data.get(7)));

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(layerUpdateDto)).
                        contentType("application/merge-patch+json")
                .when().
                        patch("" + layerId);
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

        assertThat(presentedData.get("groupId"), is(layerGroupId));
    }

    @When("Пользователь делает запрос на удаление слоя")
    public void deleteLayer() {
        super.deleteEntity(layerId);

        layerPool.remove(layerId);
    }

    @And("В ответе на удаление слоя проекта есть упоминание ID")
    public void checkIdInResponse() {
        super.checkIdInResponse();
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
}
