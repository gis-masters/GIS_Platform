package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.LayerDto;
import ru.mycrg.acceptance.data_service.processes.PlacementGmlModel;
import ru.mycrg.acceptance.data_service.processes.ImportSource;
import ru.mycrg.acceptance.data_service.processes.ImportTarget;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.lang.Thread.sleep;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFileId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.gis_service.LayerStepDefinitions.layerId;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class LayersStepsDefinitions extends BaseStepsDefinitions {

    private static Integer currentProcessId;
    private static LayerDto currentLayerDto;
    private static final int MAX_RETRY_ATTEMPT = 10;
    private static final int RETRY_DELAY = 3000;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/projects");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/projects");
    }

    @When("Пользователь делает запрос на размещение растрового слоя в проект mode: {string}")
    public void createRasterLayer(String mode) {
        ImportTarget importTarget;

        ImportSource importSource = new ImportSource("dl_default", Long.valueOf(currentDocumentId));

        if (isNull(projectId)) {
            importTarget = new ImportTarget("raster test", true, mode);
        } else {
            importTarget = new ImportTarget(projectId.longValue(), false, mode);
        }

        PlacementGmlModel payload = new PlacementGmlModel();
        payload.setWsUiId(generateString("STRING_6"));
        payload.setSource(importSource);
        payload.setTarget(importTarget);

        response = getBaseRequestWithCurrentCookie()
                .basePath("/api/data")
                .given().
                        body(gson.toJson(payload)).
                        contentType(ContentType.JSON)
                .when().
                       post("/processes")
                .then().
                        log().ifError().
                        extract().response();

        currentProcessId = extractId(response.jsonPath().get("_links.self.href"));
    }

    @When("Пользователь делает запрос на получение проектов и слоёв связанных с файлом")
    public void getRelatedToDocumentsProjectsAndLayers() {

        Map<String, Object> queryParams = new HashMap<>() {{
            put("fileId", currentFileId);
        }};

        response = getBaseRequestWithCurrentCookie()
                .given().
                        queryParams(queryParams).
                        contentType(ContentType.JSON)
                .when().
                       get("/find-related-to-file-layers")
                .then().
                        log().ifError().
                        extract().response();
    }

    @And("Сервер возвращает список слоёв и проектов связанных с растровым файлом")
    public void checkResponseWithLayersAndProjects() {
        List<Object> layers = response.jsonPath().getList("layer");
        List<Object> projects = response.jsonPath().getList("project");

        assertEquals(1, layers.size());
        assertEquals(1, projects.size());

        Integer currentLayerId = (Integer) response.jsonPath().getList("layer.id").get(0);

        assertEquals(currentLayerId, layerId);
    }

    @And("Сервер возвращает тело начатого процесса импорта растрового слоя")
    public void checkResponseBody() {
        super.checkResponseValue("title", "Import raster");
        super.checkResponseValue("status", "PENDING");
        super.checkResponseValue("type", "IMPORT_RASTER");
    }

    @Then("Растровый слой создан на gisService {string} {string}")
    public void checkRasterLayerExistOnGisService(String titleChecked, String isPresent) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                       get("/" + projectId + "/layers")
                .then().
                        log().ifError().
                        extract().response();

        List<Object> layers = response.jsonPath().getList("");

        Optional<LayerDto> rasterLayer = layers.stream()
                                               .map(layer -> mapObjectToLayerDto((HashMap<String, Object>) layer))
                                               .filter(layerDto -> layerDto.getTitle().equals(titleChecked))
                                               .findFirst();
        rasterLayer.ifPresent(layerDto -> currentLayerDto = layerDto);

        assertEquals(Boolean.valueOf(isPresent), rasterLayer.isPresent());
    }

    @Then("Растровый слой создан на геосервере")
    public void checkRasterLayerExistOnGeoserver() {
        boolean isLayerExistOnGeoserver;

        response = getBaseRequestWithCurrentCookie().
                       basePath("/geoserver/rest")
                .when().
                       get("/layers")
                .then().
                        log().ifError().
                        extract().response();

        List<Object> layers = response.jsonPath().getList("layers.layer");

        if (nonNull(currentLayerDto)) {
            isLayerExistOnGeoserver = layers
                    .stream()
                    .map(layer -> getComplexNameFromGeoserverLayer((HashMap<String, Object>) layer))
                    .filter(layerName -> !layerName.isEmpty())
                    .anyMatch(layerName -> layerName.equals(currentLayerDto.getComplexName()));
        } else {
            isLayerExistOnGeoserver = layers.size() > 0;
        }

        assertTrue(isLayerExistOnGeoserver);
    }

    @When("Ждем окончания процесса импорта растрового слоя")
    public void waitUntilImportOfRasterWillBeDone() throws InterruptedException {
        System.out.println("check status of raster import: " + currentProcessId);

        int currentAttempt = 0;
        do {
            System.out.println("attempt import raster: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                           .basePath("/api/data")
                    .when().
                           get("/processes/" + currentProcessId);

            if (response.statusCode() == SC_OK && "DONE".equals(response.jsonPath().get("status"))) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Raster layer was not import: " + currentProcessId);
    }

    private String getComplexNameFromGeoserverLayer(HashMap<String, Object> layer) {
        if (layer.containsKey("name")) {
            return layer.get("name").toString();
        }

        return "";
    }

    private LayerDto mapObjectToLayerDto(HashMap<String, Object> layer) {
        LayerDto layerDto = new LayerDto();
        if (layer.containsKey("id")) {
            layerDto.setId(Long.valueOf(layer.get("id").toString()));
        }
        if (layer.containsKey("title")) {
            layerDto.setTitle(layer.get("title").toString());
        }
        if (layer.containsKey("complexName")) {
            layerDto.setComplexName(layer.get("complexName").toString());
        }
        if (layer.containsKey("tableName")) {
            layerDto.setTableName(layer.get("tableName").toString());
        }

        return layerDto;
    }
}
