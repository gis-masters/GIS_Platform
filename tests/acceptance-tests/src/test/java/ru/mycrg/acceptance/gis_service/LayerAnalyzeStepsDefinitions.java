package ru.mycrg.acceptance.gis_service;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.Resource;
import ru.mycrg.acceptance.gis_service.dto.ResourceDefinition;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.AUTH_COOKIE_VALUE_SEPARATOR;

public class LayerAnalyzeStepsDefinitions extends BaseStepsDefinitions {

    private final LayerStepDefinitions layerStepDefinitions = new LayerStepDefinitions();

    @Override
    public RequestSpecification getBaseRequest() {
        return RestAssured
                .given().
                        log().ifValidationFails().
                        baseUri(testServerHost).
                        port(8082).
                        basePath("");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String accessToken = cookie.getValue().split(AUTH_COOKIE_VALUE_SEPARATOR)[0];

        return RestAssured
                .given().
                        log().ifValidationFails().
                        baseUri(testServerHost).
                        port(8082).
                        headers("Authorization", "Bearer " + accessToken).
                        basePath("");
    }

    @When("я запускаю анализатор: проверка доступности слоя по WMS")
    public void checkLayerEfficiencyOnGeoserver() {
        Resource resource = createResource();

        response = getBaseRequestWithCurrentCookie()
                .basePath("/resource-analyzers/LayerExistenceByWmsAnalyzer/analyze")
                .given().
                        body(gson.toJson(Collections.singletonList(resource))).
                        contentType(ContentType.JSON)
                .when().
                        post()
                .then().
                        log().ifError().
                        extract().response();
    }

    @Then("результат проверки слоя положителен")
    public void checkPositiveAnalyzeResult() {
        assertTrue(response.jsonPath().get("passed").toString().contains("true"));
    }

    private Resource createResource() {
        layerStepDefinitions.getCurrentLayer();

        Map<String, Object> resourceProperties = new HashMap<>();
        resourceProperties.put("type", response.jsonPath().get("type"));
        resourceProperties.put("styleName", response.jsonPath().get("styleName"));

        return new Resource(response.jsonPath().get("tableName"),
                            response.jsonPath().get("title"),
                            new ResourceDefinition("VectorLayer", "Векторные слои"),
                            resourceProperties);
    }
}
