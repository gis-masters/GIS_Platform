package ru.mycrg.acceptance.data_service.tasks;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.UserStepsDefinitions;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition.currentTaskId;

public class TaskLogStepsDefinition extends BaseStepsDefinitions {

    private final String updateTaskEvent = "Изменение задачи";
    private final UserStepsDefinitions userStepsDefinitions = new UserStepsDefinitions();

    // ID текущего пользователя, от которого совершается запрос
    private static long currentUserId;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/task-log");
    }

    @When("Пользователь делает запрос на выборку записей из журнала задач о текущей задаче")
    public void getCurrentTaskLogById() {
        getTaskLogById(currentTaskId);
    }

    @Then("Текущая задача в журнале задач имеет следующие изменения: {string}")
    public void checkFieldEventType(String value) {
        List<String> eventTypes = response.jsonPath().get("eventType");

        List<String> expectedChanges = Arrays.asList(value.split(","));

        expectedChanges.forEach(expected -> assertTrue(eventTypes.contains(expected.trim())));
    }

    @Then("В журнале задач отображается корректная информация о её создателе")
    public void getCreatedByOfCurrentTask() {
        long createdById = response.jsonPath().getLong("[0].createdBy");

        // Получаем информацию о текущем пользователе
        userStepsDefinitions.getCurrent();
        currentUserId = response.jsonPath().getLong("id");

        assertEquals("ID создателя задачи должен совпадать с ID текущего пользователя", currentUserId, createdById);
    }

    @Then("ID автора изменения в журнале совпадает с ID пользователя, выполнившего изменение")
    public void createdByIdMatch() {

        long createdById = response.jsonPath()
                                   .getLong("find { it.eventType == '" + updateTaskEvent + "' }.createdBy");

        userStepsDefinitions.getCurrent();
        currentUserId = response.jsonPath().getLong("id");

        assertEquals("ID автора изменения должен совпадать с ID текущего пользователя",
                     currentUserId, createdById);
    }

    private void getTaskLogById(int taskId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + taskId);
    }
}
