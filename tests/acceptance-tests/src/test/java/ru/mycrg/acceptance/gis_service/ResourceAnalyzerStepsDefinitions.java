package ru.mycrg.acceptance.gis_service;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.Map;
import java.util.Objects;

import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertTrue;

public class ResourceAnalyzerStepsDefinitions extends BaseStepsDefinitions {

    private final static int port = 8082;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest(port).basePath("/resource-analyzers");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentTokenAndPort(port).basePath("/resource-analyzers");
    }

    @When("Пользователь делает запрос на все анализаторы ресурсов")
    public void getAllAnalyzers() {
        super.getAllEntities();
    }

    @Then("Представление анализаторов корректно")
    public void isResponseStructureCorrect() {
        Map<String, Object> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(Objects.nonNull(presentedData));
        assertTrue(presentedData.size() > 0);

        presentedData.forEach((key, value) -> {
            Map<String, String> analyzer = (Map<String, String>) value;
            assertTrue(analyzer.containsKey("id"));
            assertTrue(analyzer.containsKey("title"));
            assertTrue(analyzer.containsKey("resourceDefinition"));
            assertTrue(analyzer.containsKey("batchSize"));
        });
    }
}
