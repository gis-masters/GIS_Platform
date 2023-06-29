package ru.mycrg.acceptance.data_service.tasks;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition.currentTaskId;

public class TaskLogStepsDefinition extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/task-log");
    }

    @When("Пользователь делает запрос на выборку записей из журнала задач о текущей задаче")
    public void getLogsByTaskId() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                       get("/" + currentTaskId);
    }

    @Then("Текущая задача в журнале задач имеет следующие изменения: {string}")
    public void checkFieldEventType(String value) {
        List<String> eventTypes = response.jsonPath().get("eventType");

        List<String> expectedChanges = Arrays.asList(value.split(","));

        expectedChanges.forEach(expected -> assertTrue(eventTypes.contains(expected.trim())));
    }
}
