package ru.mycrg.acceptance.data_service.tasks;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.data_service_contract.dto.TaskCreateDto;

import static org.junit.Assert.assertEquals;

public class TaskStepDefinition extends BaseStepsDefinitions {

    public static Integer currentTaskId;
    public static TaskCreateDto taskCreateDto;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/tasks");
    }

    @When("Отправляется запрос на создание задачи {string} {string} {string} {string}")
    public void createTaskRequest(String assignedTo,
                                  String ownerId,
                                  String type,
                                  String description) {
        taskCreateDto = new TaskCreateDto(type,
                                          Long.valueOf(assignedTo),
                                          Long.valueOf(ownerId),
                                          null,
                                          description);

        createTask(taskCreateDto);

        currentTaskId = extractEntityIdFromResponse(response);
    }

    @Given("Существует задача")
    public void initDataset() {
        taskCreateDto = new TaskCreateDto("CUSTOM", 1L, 1L, null, "test");

        createTask(taskCreateDto);
        currentTaskId = extractEntityIdFromResponse(response);
    }

    @When("Переведение текущей задачи в статус IN_PROGRESS")
    public void setTaskInProgress() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        put("/" + currentTaskId + "/in-progress");

        assertEquals(204, response.getStatusCode());
    }

    @When("Переведение текущей задачи в статус DONE")
    public void setTaskInDone() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        put("/" + currentTaskId + "/done");

        assertEquals(204, response.getStatusCode());
    }

    @When("Переведение текущей задачи в статус CANCEL")
    public void setTaskInCancel() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        put("/" + currentTaskId + "/cancel");

        assertEquals(204, response.getStatusCode());
    }

    @And("Задача имеет статус {string}")
    public void checkTaskStatus(String status) {
        getTaskByIdentifier(currentTaskId);

        String statusFromDb = response.jsonPath().get("status");

        assertEquals(status, statusFromDb);
    }

    private void createTask(TaskCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post();
    }

    private void getTaskByIdentifier(Integer taskId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + taskId);
    }
}
