package ru.mycrg.acceptance;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.restassured.response.Response;
import ru.mycrg.acceptance.auth_service.UserStepsDefinitions;
import ru.mycrg.acceptance.data_service.TestFilesManager;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.geoserverLogin;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentComplexName;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentWorkspace;

public class GeoserverStepDefinitions extends BaseStepsDefinitions {

    private final UserStepsDefinitions userStepsDefinitions = new UserStepsDefinitions();

    @And("На Геосервере существует scratch рабочая область и хранилище")
    public void checkGeoserverScratchWorkspaceAndStorage() {
        checkGeoserverWorkspaceAndStorage(orgId);
    }

    @And("На Геосервере отсутствует scratch рабочая область")
    public void checkGeoserverScratchWorkspaceDeleted() {
        String workspace = "scratch_database_" + orgId;

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/workspaces/" + workspace)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_NOT_FOUND);
    }

    @And("На Геосервере создан пользователь")
    public void checkGeoserverUser() {
        checkUserOnGeoserver();
    }

    @And("На Геосервере создана роль")
    public void checkGeoserverRole() {
        checkGeoserverRole(orgId);
    }

    public void checkGeoserverRole(Integer orgId) {
        String role = "admin_" + orgId;

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/roles.json")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("roles", hasItems(role));
    }

    @And("На Геосервере пользователь имеет роль")
    public void checkGeoserverRoleAssignedToUser() {
        // TODO: Не нашел в геосерверном АПИ возможности проверить что пользователю задана конкретная роль.
        // Т.е. ендпоинт вроде как есть, но не работает https://docs.geoserver.org/latest/en/api/#1.0.0/roles.yaml
    }

    @And("На Геосервере дан доступ к rest")
    public void checkGeoserverRestRules() {
        checkGeoserverRestRules(orgId);
    }

    public void checkGeoserverRestRules(Integer orgId) {
        String role = "admin_" + orgId;

        Map<Object, Object> restRules = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/acl/rest")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        restRules.forEach((key, value) -> {
            String restRoles = value.toString();

            boolean containsInRest = restRoles.contains(role);
            if (!containsInRest) {
                System.out.println("================================");
                System.out.printf("Role: '%s' NOT EXIST in REST roles: [%s]%n", role, restRoles);
            }

            assertTrue(containsInRest);
        });
    }

    @And("На Геосервере дан доступ к слоям")
    public void checkGeoserverLayersRules() {
        checkGeoserverLayersRules(orgId);
    }

    public void checkGeoserverLayersRules(Integer orgId) {
        String role = "admin_" + orgId;
        String rRuleKey = "scratch_database_" + orgId + ".*.r";
        String wRuleKey = "scratch_database_" + orgId + ".*.w";
        String aRuleKey = "scratch_database_" + orgId + ".*.a";

        Map<Object, Object> layersRules = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/acl/layers")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        layersRules.forEach((key, value) -> {
            if (wRuleKey.equals(key) || aRuleKey.equals(key) || rRuleKey.equals(key)) {
                assertEquals(value, role);
            }
        });
    }

    @And("На Геосервере дан доступ к сервисам")
    public void checkGeoserverServiceRules() {
        checkGeoserverServiceRules(orgId);
    }

    @And("На Геосервере отсутствует пользователь")
    public void isUserAbsentOnGeoserver() {
        checkOwnerOfOrganizationAbsentOnGeoserver(geoserverLogin);
    }

    @And("На Геосервере отсутствует роль")
    public void checkGeoserverRoleIsAbsent() {
        String role = "admin_" + orgId;

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/roles.json")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("roles", not(hasItems(role)));
    }

    @And("На геосервере создано хранилище с тем же названием")
    public void checkThatCurrentStoreExistOnGeoserver() {
        String workspace = "scratch_database_" + orgId;

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/workspaces/" + workspace + "/datastores/" + currentDatasetIdentifier)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("dataStore.name", equalTo(currentDatasetIdentifier),
                             "dataStore.type", equalTo("PostGIS"),
                             "dataStore.enabled", is(true));
    }

    @And("На геосервере отсутствует хранилище")
    public void checkThatCurrentStoreNotExistOnGeoserver() {
        String workspace = "scratch_database_" + orgId;

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/workspaces/" + workspace + "/datastores/" + currentDatasetIdentifier)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_NOT_FOUND);
    }

    @And("Система координат присутствует на геосервере: {string}")
    public void checkSrs(String expectedString) {
        Response response = getEpsgPropertiesResponse();

        assertTrue(response.asString().contains(expectedString));
    }

    @And("Система координат {string} успешна удалена")
    public void checkSrsDelete(String expectedString) {
        Response response = getEpsgPropertiesResponse();

        assertFalse(response.asString().contains(expectedString));
    }

    @Given("Многопоточно созданные {int} проекции корректны")
    public void checkSomeSrcInThread(int count) {
        Response response = getEpsgPropertiesResponse();

        String epsgProperties = response.asString();

        for (int i = 1; i < count; i++) {
            assertTrue("Проекция srsThread" + i + " не найдена", epsgProperties.contains("srsThread" + i));
        }
    }

    @Then("После многопоточных изменений каждая проекция соответствует ожидаемым данным")
    public void checkModifiedSrcInThread() throws InterruptedException {
        Thread.sleep(20000);
        Response response = getEpsgPropertiesResponse();

        String epsgProperties = response.asString();

        assertTrue("Проекция srsThread4 не найдена", epsgProperties.contains("srsThread4"));
        assertTrue("Проекция srsThread5 не найдена", epsgProperties.contains("srsThread5"));
        assertTrue("Проекция srsThread2Modified не найдена", epsgProperties.contains("srsThread2Modified"));
    }

    @And("стиль {string} существует на геосервере, в текущем рабочем пространстве")
    public void checkStyleInWorkspace(String styleName) {
        getStyleFromWorkspace(currentWorkspace, styleName);

        assertEquals(SC_OK, response.getStatusCode());
    }

    @Then("установленный стиль соответствует стандартному точечному стилю")
    public void checkCurrentLayerStyleLegendPoint() {
        assertTrue(response.prettyPrint().contains("simple_point_1"));
    }

    @Then("установленный стиль соответствует стандартному полигональному стилю")
    public void checkCurrentLayerStyleLegendPolygon() {
        assertTrue(response.prettyPrint().contains("simple_polygon_1"));
    }

    @And("геосервер успешно отдаёт легенду для стиля {string} правила {string}")
    public void checkStyleLegend(String styleName, String rule) {
        getRuleOfStyleFromGeoserver(currentComplexName, styleName, rule);
    }

    @And("тело текущего стиля содержит строку {string}")
    public void checkStyleBody(String bodyPart) {
        assertTrue(response.asString().contains(bodyPart));
    }

    @And("SVG {string} существует на геосервере и соответствует ожидаемой")
    public void checkSvg(String svgPath) throws IOException {
        getSvgFromGeoserver(svgPath);

        String svgName = svgPath.substring(svgPath.lastIndexOf("/") + 1);

        File file = TestFilesManager.getFile(svgName);
        String expectedSvg = Files.readString(file.toPath(), StandardCharsets.UTF_8).replaceAll("\\s+", " ").trim();
        String actualSvg = response.getBody().asString().replaceAll("\\s+", " ").trim();

        assertEquals(expectedSvg, actualSvg);
    }

    public Response getEpsgPropertiesResponse() {
        Response response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/resource/user_projections/epsg.properties");

        response.then().statusCode(SC_OK);

        return response;
    }

    public void checkGeoserverWorkspaceAndStorage(Integer orgId) {
        String workspace = "scratch_database_" + orgId;
        String store = workspace + "_store";

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/workspaces/" + workspace + "/datastores/" + store)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("dataStore.name", equalTo(store),
                             "dataStore.type", equalTo("PostGIS"),
                             "dataStore.enabled", is(true));
    }

    public void checkUserOnGeoserver() {
        userStepsDefinitions.getCurrent();

        String geoserverLogin = response.jsonPath().get("geoserverLogin");
        assertNotNull(geoserverLogin);

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/usergroup/service/postgres_db_user_service/users.json")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.findAll { it.enabled == true }.userName",
                             hasItems(geoserverLogin));
    }

    public void checkOwnerOfOrganizationAbsentOnGeoserver(String ownerEmail) {
        String geoserverLogin = ownerEmail + "_" + orgId;
        String body = String.format("users.findAll { it.userName == \"%s\" }", geoserverLogin);

        getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/usergroup/service/postgres_db_user_service/users.json")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK)
                        .body(body, equalTo(new ArrayList()));
    }

    public void checkGeoserverServiceRules(Integer orgId) {
        String role = "admin_" + orgId;

        Map<Object, Object> servicesRules = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/acl/services")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        servicesRules.forEach((key, value) -> {
            String roles = value.toString();
            if ("wfs.*".equals(key)) {
                boolean containsInWfs = roles.contains(role);
                if (!containsInWfs) {
                    System.out.println("================================");
                    System.out.printf("Role: '%s' NOT EXIST in WFS roles: [%s]%n", role, roles);
                }

                assertTrue(containsInWfs);
            }

            if ("wms.*".equals(key)) {
                boolean containsInWms = roles.contains(role);
                if (!containsInWms) {
                    System.out.println("================================");
                    System.out.printf("Role: '%s' NOT EXIST in WMS roles: [%s]%n", role, roles);
                }

                assertTrue(containsInWms);
            }
        });
    }

    public void getLayerLegend(String complexName) {
        String request = "geoserver/rest/layers/" + complexName + "/styles";

        getBaseRequestWithCurrentCookie()
                .when().
                        get(request)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK);
    }

    private void getStyleFromWorkspace(String workspace, String styleName) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        headers("Accept", "application/vnd.ogc.se+xml")
                .when().
                        get("/geoserver/rest/workspaces/" + workspace + "/styles/" + styleName);
    }

    private void getSvgFromGeoserver(String svgPath) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/resource/styles/" + svgPath);
    }

    private void getRuleOfStyleFromGeoserver(String complexName, String styleName, String rule) {
        String request = "geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image%2Fpng&WIDTH=40&HEIGHT=20&" +
                "LAYER=" + complexName + "&STYLE=" + styleName + "&RULE=" + rule;

        getBaseRequestWithCurrentCookie()
                .given().
                        headers("Accept", "application/vnd.ogc.se+xml")
                .when().
                        get(request)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK);
    }
}
