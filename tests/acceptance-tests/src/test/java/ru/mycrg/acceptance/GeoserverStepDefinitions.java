package ru.mycrg.acceptance;

import io.cucumber.core.exception.CucumberException;
import io.cucumber.java.en.And;
import io.restassured.response.Response;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgDto;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions.currentDatasetIdentifier;

public class GeoserverStepDefinitions extends BaseStepsDefinitions {

    @And("На Геосервере существует scratch рабочая область и хранилище")
    public void checkGeoserverScratchWorkspaceAndStorage() {
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
        getBaseRequestWithCurrentCookie()
                .when().
                get("/geoserver/rest/security/usergroup/service/postgres_db_user_service/users.json")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.findAll { it.enabled == true }.userName",
                             hasItems(orgDto.getOwner().getEmail()));
    }

    @And("На Геосервере создана роль")
    public void checkGeoserverRole() {
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
        String role = "admin_" + orgId;

        final Map<Object, Object> restRules = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/acl/rest")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        restRules.forEach((key, value) -> {
            List<String> roles = new ArrayList<>(Arrays.asList(value.toString().split(",")));

            assertTrue(roles.contains(role));
        });
    }

    @And("На Геосервере дан доступ к слоям")
    public void checkGeoserverLayersRules() {
        String role = "admin_" + orgId;
        String rRuleKey = "scratch_database_" + orgId + ".*.r";
        String wRuleKey = "scratch_database_" + orgId + ".*.w";
        String aRuleKey = "scratch_database_" + orgId + ".*.a";

        final Map<Object, Object> layersRules = getBaseRequestWithCurrentCookie()
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
        String role = "admin_" + orgId;

        final Map<Object, Object> servicesRules = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/acl/services")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        servicesRules.forEach((key, value) -> {
            if ("wfs.*".equals(key) || "wms.*".equals(key)) {
                List<String> roles = new ArrayList<>(Arrays.asList(value.toString().split(",")));

                assertTrue(roles.contains(role));
            }
        });
    }

    @And("На Геосервере отсутствует пользователь {string}")
    public void isUserAbsentOnGeoserver(String userRole) {
        getBaseRequestWithCurrentCookie()
                .when().
                get("/geoserver/rest/security/roles.json")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("roles", not(hasItems(userRole)));
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

    @And("На Геосервере доступ к слоям. Роль пользователя отсутствует в списке")
    public void checkGeoserverLayersRulesIfUserIsAbsent() {
        String role = "admin_" + orgId;

        final Response response = getBaseRequestWithCurrentCookie()
                .when().
                        log().all().
                        get("/geoserver/rest/security/acl/layers");

        response.prettyPrint();

        final Map<Object, Object> layersRules =
                response.then().
                        statusCode(SC_OK).
                                extract().jsonPath().
                                getMap("");

        if (layersRules.containsValue(role)) {
            throw new CucumberException(role + " are present in layer rules");
        }
    }

    @And("На Геосервере дан доступ к сервисам. Роль пользователя отсутствует в списке")
    public void checkGeoserverServiceRulesIfUserIsAbsent() {
        String role = "admin_" + orgId;

        final Map<Object, Object> servicesRules = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/acl/services")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        if (servicesRules.values()
                         .stream()
                         .filter(e -> e.toString().contains(role))
                         .findFirst()
                         .orElse(null) != null) {
            throw new CucumberException(role + " are present in services");
        }
    }

    @And("На Геосервере дан доступ к rest. Роль пользователя отсутствует в списке")
    public void checkGeoserverRestRulesIfUserIsAbsent() {
        String role = "admin_" + orgId;

        final Map<Object, Object> restRules = getBaseRequestWithCurrentCookie()
                .when().
                        get("/geoserver/rest/security/acl/rest")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        if (restRules.values()
                     .stream()
                     .filter(e -> e.toString().contains(role))
                     .findFirst()
                     .orElse(null) != null) {
            throw new CucumberException(role + " are present in services");
        }
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
}
