package ru.mycrg.acceptance.data_service.tasks;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.auth_service.UserStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.restassured.http.ContentType.JSON;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;

public class TaskStepDefinition extends BaseStepsDefinitions {

    public static Integer currentTaskId;
    public static Map<String, Object> taskCreateDto;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();
    private final UserStepsDefinitions userStepsDefinitions = new UserStepsDefinitions();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/tasks");
    }

    @Given("Создана задача")
    public void createTaskForOrgOwner() {
        userStepsDefinitions.getCurrent();
        Integer ownerId = response.jsonPath().get("id");

        createTaskRequest(ownerId, ownerId, "CUSTOM", "test description");
    }

    @Given("Существуют задачи")
    public void initTasks(DataTable dataTable) {
        List<List<String>> tasks = dataTable.asLists();
        for (List<String> task: tasks) {
            int assignedToId = getUserIdByName(task.get(0));
            int ownerId = getUserIdByName(task.get(1));

            taskCreateDto = new HashMap<>();
            taskCreateDto.put("type", task.get(2));
            taskCreateDto.put("assigned_to", (long) assignedToId);
            taskCreateDto.put("owner_id", (long) ownerId);
            taskCreateDto.put("description", task.get(3));

            createTask(taskCreateDto);

            assertEquals(201, response.statusCode());
        }
    }

    @Given("Текущая задача переведена в статус {string}")
    public void updateStatus(String status) {
        updateCurrentTaskStatus(TaskStatus.valueOf(status));

        assertEquals(204, response.getStatusCode());
    }

    @When("я меняю статус текущей задачи на: {string}")
    public void updateStatus2(String status) {
        updateCurrentTaskStatus(TaskStatus.valueOf(status));
    }

    @When("Отправляется запрос на создание задачи {int} {int} {string} {string}")
    public void createTaskRequest(int assignedTo,
                                  int ownerId,
                                  String type,
                                  String description) {
        taskCreateDto = new HashMap<>();
        taskCreateDto.put("type", type);
        taskCreateDto.put("assigned_to", (long) assignedTo);
        taskCreateDto.put("owner_id", (long) ownerId);
        taskCreateDto.put("description", description);


        createTask(taskCreateDto);
        currentTaskId = extractEntityIdFromResponse(response);
    }

    @When("я создаю задачу на пользователя {string}")
    public void createTaskRequest(String userName) {
        int ownerId = getUserIdByName(userName);

        taskCreateDto = new HashMap<>();
        taskCreateDto.put("type", "CUSTOM");
        taskCreateDto.put("assigned_to", (long) ownerId);
        taskCreateDto.put("owner_id", (long) ownerId);
        taskCreateDto.put("description", "description");


        createTask(taskCreateDto);
        currentTaskId = extractEntityIdFromResponse(response);
    }

    @When("пользователем {string} создана задача на пользователя {string}")
    public void createTaskRequest(String creatorName, String ownerName) {
        UserCreateDto creator = getUserByName(creatorName);
        authorizationBase.loginAs(creator.getEmail(), creator.getPassword());

        int ownerId = getUserIdByName(ownerName);
        taskCreateDto = new HashMap<>();
        taskCreateDto.put("type", "CUSTOM");
        taskCreateDto.put("assigned_to", (long) ownerId);
        taskCreateDto.put("owner_id", (long) ownerId);
        taskCreateDto.put("description", "old description");

        createTask(taskCreateDto);
        currentTaskId = extractEntityIdFromResponse(response);
    }

    @When("я меняю описание текущей задачи на: {string}")
    public void updateTasksDescription(String description) {
        updateCurrentTask("{\"description\": \"" + description + "\"}");
    }

    @When("я делаю выборку всех задач")
    public void getAllTasks() {
        getTasks();

        assertEquals(200, response.getStatusCode());
    }

    @When("я делаю выборку всех задач с фильтром {string}")
    public void getAllTasks(String filter) {
        getTasks(filter);

        assertEquals(200, response.getStatusCode());
    }

    @Then("описание текущей задачи изменено на: {string}")
    public void checkDescriptionForCurrentTask(String expectedDescription) {
        getTaskByIdentifier(currentTaskId);

        String currentDescription = response.jsonPath().get("description");

        assertEquals(expectedDescription, currentDescription);
    }

    @Then("задача изменила статус на {string}")
    public void checkStatusForCurrentTask(String expectedStatus) {
        getTaskByIdentifier(currentTaskId);

        String currentStatus = response.jsonPath().get("status");

        assertEquals(expectedStatus, currentStatus);
    }

    private void createTask(Map<String, Object> dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(JSON)
                .when().
                        log().ifValidationFails().
                        post();
    }

    private void getTaskByIdentifier(Integer taskId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + taskId);
    }

    private void getTasks() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    private void getTasks(String filter) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?filter=" + filter);
    }

    private void updateCurrentTaskStatus(TaskStatus status) {
        String apiWay = "";
        if (status.equals(IN_PROGRESS)) {
            apiWay = "in-progress";
        } else if (status.equals(DONE)) {
            apiWay = "done";
        } else if (status.equals(CANCELED)) {
            apiWay = "cancel";
        }

        updateCurrentTaskStatus(currentTaskId, apiWay);
    }

    private void updateCurrentTaskStatus(int taskId, String way) {
        String url = String.format("/%d/%s", taskId, way);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(JSON)
                .when().
                        log().ifValidationFails().
                        put(url);
    }

    private void updateCurrentTask(String json) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(json).
                        contentType(PATCH_CONTENT_TYPE)
                .when().
                        patch("/" + currentTaskId);
    }
}
