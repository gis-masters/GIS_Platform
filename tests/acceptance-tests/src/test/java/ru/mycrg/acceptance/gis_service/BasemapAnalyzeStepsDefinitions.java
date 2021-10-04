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

public class BasemapAnalyzeStepsDefinitions extends BaseStepsDefinitions {

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

    @When("Запускаем проверку доступности несуществующей подложки по WMS")
    public void checkBasemapEfficiencyOnGeoserver() {
        Resource resource = createResource();

        response = getBaseRequestWithCurrentCookie()
                .basePath("/resource-analyzers/BaseMapsExistenceByWmsAnalyzer/analyze")
                .given().
                        body(gson.toJson(Collections.singletonList(resource))).
                        contentType(ContentType.JSON)
                .when().
                        post()
                .then().
                        log().ifError().
                        extract().response();
    }

    @Then("Результат проверки слоя отрицателен\\(ответ геосервера содержит ServiceException)")
    public void checkNegativeAnalyzeResult() {
        assertTrue(response.jsonPath().get("passed").toString().contains("false"));
    }

    private Resource createResource() {
        Map<String, Object> resourceProperties = new HashMap<>();
        resourceProperties.put("layerName", "someLayer");

        return new Resource("1",
                            "Yalta_GP",
                            new ResourceDefinition("BaseMaps", "Подложки"),
                            resourceProperties);
    }
}
