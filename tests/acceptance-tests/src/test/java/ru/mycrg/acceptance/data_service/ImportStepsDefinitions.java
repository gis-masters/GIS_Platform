package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.io.File;
import java.util.LinkedHashMap;
import java.util.List;

import static java.lang.String.format;
import static java.lang.Thread.sleep;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.gis_service.LayerStepDefinitions.layerId;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class ImportStepsDefinitions extends BaseStepsDefinitions {

    public static final int MAX_RETRY_ATTEMPT = 40;
    public static final int RETRY_DELAY = 1000;

    public static Integer processId;
    public static Integer importId;
    public static String tableName;
    public static String schemaId;

    @When("Четвертый этап: импорт в текущий проект в текущий набор данных {string}")
    public void importToProject(String importSchema) {
        String importTasks = getImportTasksForFunctionalZone();

        if (importSchema.equalsIgnoreCase("advertising")) {
            importTasks = getImportTasksForAdvertisingPointSimf();
        }

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(importTasks).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post(format("/api/data/import/%d", projectId));

        processId = extractEntityIdFromResponse(response);
    }

    @Then("Ожидаем успешного завершения импорта в проект")
    public void waitImportToCurrentProject() throws InterruptedException {
        int currentAttempt = 0;
        do {
            System.out.println("check import to project. Attempt: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            log().ifValidationFails().
                            get("/api/data/processes/" + processId);

            if (response.jsonPath().get("status").equals("DONE")) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Import to geoserver failed");
    }

    @When("Первый этап: инициализация на геосервере нового импорта")
    public void initImport() {
        String payload = getInitImportInfo(orgId);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/geoserver/rest/imports");

        final JsonPath jsonPath = response.jsonPath();
        assertThat(jsonPath.get("import.state"), is(equalTo("PENDING")));

        importId = jsonPath.get("import.id");
    }

    @When("Второй этап: создание задачи в текущем импорте {string}")
    public void sendArchive(String archiveName) {
        File testArchive = new File("src/test/resources/ru/mycrg/acceptance/resources/" + archiveName);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("name", "file").
                        multiPart("filename", archiveName).
                        multiPart("file", testArchive)
                .when().
                        post(format("/geoserver/rest/imports/%d/tasks", importId));
    }

    @Then("Третий этап: запуск процесса импорта")
    public void runImport() {
        // Ожидание ответа может продлиться более 10сек. - таймаут, отвалиться по 504 коду, но сам импорт при этом
        // продолжится нормально.
        // Неудачное API, геосервер ничего не возвращает до тех пор пока не "проглотит" импорт, а это может затянуться.
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body("{}").
                        contentType(ContentType.JSON)
                .when().
                        post("/geoserver/rest/imports/" + importId);
    }

    @When("Ожидаем успешного завершения импорта на геосервере")
    public void waitUntilImportCompleteOnGeoserver() throws InterruptedException {
        int currentAttempt = 0;
        do {
            System.out.println("check import to geoserver. Attempt: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/geoserver/rest/imports/" + importId);

            if (response.jsonPath().get("import.state").equals("COMPLETE")) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Import to geoserver failed");
    }

    @Then("Проверяем наличие импортируемых слоёв в проекте")
    public void checkLayersAvailabilityInProject() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(format("/projects/%d/layers/", projectId));

        JsonPath path = response.jsonPath();
        List<LinkedHashMap<Integer, Object>> layers = path.get();

        List<Object> tableNames = path.getList("tableName");
        if (tableNames == null || tableNames.isEmpty()) {
            throw new IllegalStateException("Не корректное тело ответа, не найден tableName");
        }
        tableName = tableNames.get(0).toString();

        assertThat(layers.isEmpty(), is(not(true)));

        layerId = (Integer) layers.get(0).get("id");
    }

    private String getImportTasksForFunctionalZone() {
        return format("{\"wsUiId\":\"a9plkx\",\"targetSchema\":\"%s\"," +
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
                              "\"schemaName\":\"functionalzone\"}]}", currentDatasetIdentifier);
    }

    private String getImportTasksForAdvertisingPointSimf() {
        return format("{\"wsUiId\":\"kxfh33\",\"targetSchema\":\"%s\"," +
                              "\"importTasks\":[{\"pairs\":" +
                              "[{\"source\":{\"name\":\"the_geom\",\"binding\":\"org.locationtech.jts.geom.Point\"}," +
                              "\"target\":{\"name\":\"shape\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"CLASSID\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"classid\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"TRADE_NUMB\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"trade_number\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"LOCATION\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"location\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"SIDES_NUMB\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"sides_numb\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"SIZE\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"size\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"PILLAR\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"pillar\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"INF_AREA\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"inf_area\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"ISSUE_DATE\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"issue_date\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"EXP_DATE\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"exp_date\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"RESPONSE\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"response\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"REG_NUMBER\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"reg_number\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"OWNER\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"owner\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"CANCELREAS\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"CANCELREAS\",\"type\":\"AsIs\"}}," +
                              "{\"source\":{\"name\":\"NOTES\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"notes\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"DOC\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"doc\",\"type\":\"FromSchema\"}}," +
                              "{\"source\":{\"name\":\"PHOTO\",\"binding\":\"java.lang.String\"}," +
                              "\"target\":{\"name\":\"photo\",\"type\":\"FromSchema\"}}]," +
                              "\"srs\":7829,\"layerName\":\"advertising_point_simf_2022\"," +
                              "\"workTableName\":\"advertising_point_simf_2022\",\"schemaName\":\"advertising_point_simf_2022\"}]}",
                      currentDatasetIdentifier);
    }

    private String getInitImportInfo(Integer orgId) {
        return String.format("{\"import\":" +
                                     "{\"targetWorkspace\":" +
                                     "{\"workspace\":{\"name\":\"scratch_database_%d\"}},\n" +
                                     "\"targetStore\":{\n" +
                                     "\"dataStore\":{\"name\":\"scratch_database_%d_store\"}}}}", orgId, orgId);
    }
}
