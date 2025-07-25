package ru.mycrg.acceptance.integration_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class ResourceAnalyzerStepsDefinitions extends BaseStepsDefinitions {

    public String analyzeProcessId;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/resource-analyzers");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/resource-analyzers");
    }

    @When("Пользователь делает запрос на выборку всех анализаторов ресурсов")
    public void getAllAnalyzers() {
        super.get1000Entities();
    }

    @When("Пользователь отправляет запрос, запуская процесс анализа ресурсов")
    public void runAnalyzeProcess() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        post();
    }

    @And("Тело ответа содержит Id процесса")
    public void checkProcessIdFromResponse() {
        analyzeProcessId = response.getBody().asString();

        assertNotNull(analyzeProcessId);
    }

    @And("Процесс существует на BPMN сервере")
    public void checkExistingBpmnProcess() {
        // Check active process
        final Response responseActive = super.getBaseRequestWithCurrentTokenAndPort(8338)
                                             .basePath("/rest/process-instance/")
                                             .when().
                                                     get(analyzeProcessId);

        // Check process in history
        final Response responseInHistory = super.getBaseRequestWithCurrentTokenAndPort(8338)
                                                .basePath("/rest/history/process-instance/")
                                                .when().
                                                        get(analyzeProcessId);

        assertTrue(responseActive.statusCode() == 200 || responseInHistory.statusCode() == 200);
    }

    @Then("Представление анализаторов корректно")
    public void checkAnalyzersModel() {
        final List<Object> presentedData = response
                .then().
                        extract().jsonPath().
                        getList("");

        assertTrue(Objects.nonNull(presentedData));
        assertTrue(presentedData.size() > 0);

        presentedData.forEach(data -> {
            Map<String, String> analyzer = (Map<String, String>) data;
            assertTrue(analyzer.containsKey("id"));
            assertTrue(analyzer.containsKey("title"));
            assertTrue(analyzer.containsKey("resourceDefinitions"));
            assertTrue(analyzer.containsKey("batchSize"));
            assertTrue(analyzer.containsKey("errorMessageTemplate"));
            assertTrue(analyzer.containsKey("url"));
        });
    }
}
