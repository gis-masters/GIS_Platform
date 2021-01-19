package ru.mycrg.acceptance.geo_api;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions.currentDatasetName;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class ImportStepsDefinitions extends BaseStepsDefinitions {

    public static Integer importId;

    @When("Пользователь делает запрос на импорт в текущий проект в текущий набор данных")
    public void importArchive() throws InterruptedException {
        String importTasks = getImportTasks();

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(importTasks).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post(String.format("/api/data/import/%d", projectId));

        Thread.sleep(5000);
    }

    @When("Пользователь делает запрос на импорт в текущую организацию")
    public void getImportId() {
        String payload = getInitImportInfo(orgId);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/geoserver/rest/imports");
    }

    @And("Сервер передает ID импорта в ответе")
    public void extractImportIdFromResponse() {
        importId = response.jsonPath().get("import.id");
    }

    @When("Пользователь передает архив со слоями")
    public void postArchive() {
        File testArchive = new File("src/test/resources/ru/mycrg/acceptance/geo_api/files/test.zip");

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("name", "file").
                        multiPart("filename", "test.zip").
                        multiPart("file", testArchive)
                .when().
                        log().ifValidationFails().
                        post(String.format("/geoserver/rest/imports/%d/tasks", importId));
    }

    @Then("Пользователь передает пустое тело")
    public void postEmptyBody() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body("{}").
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/geoserver/rest/imports/" + importId);
    }

    @When("Пользователь делает запрос на текущий импорт")
    public void getImportInfo() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().ifValidationFails().
                        get("/geoserver/rest/imports/" + importId);
    }

    @Then("В текущем проекте есть импортируемые слои")
    public void checkLayersAvailabilityInProject() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().ifValidationFails().
                        get(String.format("/projects/%d/layers/", projectId));
        List<LinkedHashMap<Integer, Object>> layers = response.jsonPath().get();

        assertThat(layers.isEmpty(), is(not(true)));
    }

    @And("Статус импорта {string}")
    public void checkImportStatus(String importStatus) {
        assertThat(response.jsonPath().get("import.state"), is(equalTo(importStatus)));
    }

    @When("Пользователь делает запрос на текущий набор данных")
    public void getDatasetInfo() {
        DatasetsStepsDefinitions datasetsStepsDefinitions = new DatasetsStepsDefinitions();
        datasetsStepsDefinitions.getNotExistDataset(currentDatasetName);
    }

    @Then("В наборе данных есть загруженные слои")
    public void checkLayersAvailabilityInDataset() {
        int itemsCounts = 1;

        assertThat(itemsCounts, is(equalTo(response.jsonPath().get("itemsCount"))));
    }

    private String getImportTasks() {
        return String.format("{\"wsUiId\":\"a9plkx\",\"targetSchema\":\"%s\"," +
                                     "\"importTasks\":[{\"pairs\":[{\"source\":{\"name\":\"the_geom\"," +
                                     "\"binding\":\"org.locationtech.jts.geom.MultiPolygon\"}," +
                                     "\"target\":{\"name\":\"shape\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"CLASSID\",\"binding\":\"java.lang" +
                                     ".Long\"},\"target\":{\"name\":\"CLASSID\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"FZ_MFSTP\"," +
                                     "\"binding\":\"java.lang.Integer\"}," +
                                     "\"target\":{\"name\":\"FZ_MFSTP\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"FZ_ODSTP\",\"binding\":\"java.lang" +
                                     ".Integer\"},\"target\":{\"name\":\"FZ_ODSTP\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"FZ_INGSTP\"," +
                                     "\"binding\":\"java.lang.Integer\"}," +
                                     "\"target\":{\"name\":\"FZ_INGSTP\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"FZ_TRSTP\",\"binding\":\"java.lang" +
                                     ".Integer\"},\"target\":{\"name\":\"FZ_TRSTP\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"FZ_SHSTP\"," +
                                     "\"binding\":\"java.lang.Integer\"}," +
                                     "\"target\":{\"name\":\"FZ_SHSTP\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"FZ_RECSTP\",\"binding\":\"java.lang" +
                                     ".Integer\"},\"target\":{\"name\":\"FZ_RECSTP\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"FZ_ORECSTP\"," +
                                     "\"binding\":\"java.lang.Integer\"}," +
                                     "\"target\":{\"name\":\"FZ_ORECSTP\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"AREA\",\"binding\":\"java.lang.Double\"}," +
                                     "\"target\":{\"name\":\"AREA\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"INFO_OBJ\",\"binding\":\"java.lang" +
                                     ".String\"},\"target\":{\"name\":\"INFO_OBJ\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"CONSTR_DEN\"," +
                                     "\"binding\":\"java.lang.Double\"}," +
                                     "\"target\":{\"name\":\"CONSTR_DEN\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"BLD_HEIGHT\",\"binding\":\"java.lang" +
                                     ".Long\"},\"target\":{\"name\":\"BLD_HEIGHT\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"POP_DEN\"," +
                                     "\"binding\":\"java.lang.Double\"}," +
                                     "\"target\":{\"name\":\"POP_DEN\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"POPULATION\",\"binding\":\"java.lang" +
                                     ".Long\"},\"target\":{\"name\":\"POPULATION\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"HZRD_CLASS\"," +
                                     "\"binding\":\"java.lang.Long\"}," +
                                     "\"target\":{\"name\":\"HZRD_CLASS\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"OTHER\",\"binding\":\"java.lang" +
                                     ".String\"},\"target\":{\"name\":\"OTHER\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"EVENT_TIME\"," +
                                     "\"binding\":\"java.lang.Long\"}," +
                                     "\"target\":{\"name\":\"EVENT_TIME\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"STATUS\",\"binding\":\"java.lang" +
                                     ".Integer\"},\"target\":{\"name\":\"STATUS\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"REG_STATUS\"," +
                                     "\"binding\":\"java.lang.Integer\"}," +
                                     "\"target\":{\"name\":\"REG_STATUS\",\"type\":\"FromSchema\"}}," +
                                     "{\"source\":{\"name\":\"SHAPE_Leng\",\"binding\":\"java.lang" +
                                     ".Double\"},\"target\":{\"name\":\"SHAPE_Leng\"," +
                                     "\"type\":\"AsIs\"}},{\"source\":{\"name\":\"SHAPE_Area\"," +
                                     "\"binding\":\"java.lang.Double\"}," +
                                     "\"target\":{\"name\":\"SHAPE_Area\",\"type\":\"AsIs\"}}," +
                                     "{\"source\":{\"name\":\"GlobalID\",\"binding\":\"java.lang" +
                                     ".String\"},\"target\":{\"name\":\"GLOBALID\"," +
                                     "\"type\":\"FromSchema\"}},{\"source\":{\"name\":\"STYLE\"," +
                                     "\"binding\":\"java.lang.String\"},\"target\":{\"name\":\"STYLE\"," +
                                     "\"type\":\"AsIs\"}},{\"source\":{\"name\":\"ruleid\"," +
                                     "\"binding\":\"java.lang.Long\"},\"target\":{\"name\":\"ruleid\"," +
                                     "\"type\":\"AsIs\"}}],\"srs\":28406," +
                                     "\"layerName\":\"FunctionalZone\",\"workTableName\":\"functionalzone\"," +
                                     "\"schemaName\":\"functionalzone\"}]}", currentDatasetName);
    }

    private String getInitImportInfo(Integer orgId) {
        return String.format("{\"import\":" +
                                     "{\"targetWorkspace\":" +
                                     "{\"workspace\":{\"name\":\"scratch_database_%d\"}},\n" +
                                     "\"targetStore\":{\n" +
                                     "\"dataStore\":{\"name\":\"scratch_database_%d_store\"}}}}", orgId, orgId);
    }
}
