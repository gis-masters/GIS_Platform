package ru.mycrg.acceptance.data_service.tasks;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.auth_service.UserStepsDefinitions;
import ru.mycrg.acceptance.data_service.TestFilesManager;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

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

            System.out.println("For: " + task.get(0) + " / assignedToId: " + getUserIdByName(task.get(0)));
            System.out.println("For: " + task.get(1) + " / ownerId: " + getUserIdByName(task.get(1)));

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

    @When("я меняю исполнителя текущей задачи на: {string}")
    public void updateAssigned(String assignedTo) {
        updateCurrentTask("{\"assigned_to\": " + getUserIdByName(assignedTo) + "}");
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

    @When("я сохраняю промежуточный статус со значением: {string}")
    public void updateTasksIntermediateStatus(String intermediateStatus) {
        updateCurrentTask("{\"intermediate_status\": \"" + intermediateStatus + "\"}");
    }

    @When("я привязываю к задаче, в поле для отправки, документ {string}")
    public void updateTasksDataSectionKeyDataConnection(String input) {
        String[] parts = input.split(" ", 2);
        String title = parts[0];
        String libraryTableName = parts[1];

        String body = "[{\"id\":1,\"title\":\"" + title + "\", \"libraryTableName\":\"" + libraryTableName + "\"}]";
        updateCurrentTask("{\"data_section_key_data_connection\": \"" + body.replace("\"", "\\\"") + "\"}");
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

    @When("я делаю выборку задач с ID {string}")
    public void getTasksById(String taskId) {
        getTasksByRecords(taskId);

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

    @Then("начальник в текущей задаче соответствует: {string}")
    public void checkOwnerForCurrentTask(String expectedOwner) {
        getTaskByIdentifier(currentTaskId);
        int currentOwner = response.jsonPath().get("owner_id");

        assertEquals(getUserIdByName(expectedOwner), currentOwner);
    }

    @Then("В выборке только задачи с ID {string}")
    public void checkCountTasks(String expectedTaskIds) {
        if (expectedTaskIds.isEmpty()) {
            int totalElements = response.jsonPath().get("page.totalElements");
            assertEquals("Выборка должна быть пустой", 0, totalElements);
            return;
        }

        String[] expectedIds = expectedTaskIds.split(",");
        List<Integer> actualIds = response.jsonPath().getList("content.id");

        assertEquals("Количество задач в выборке не соответствует ожидаемому",
                     expectedIds.length, actualIds.size());

        for (int i = 0; i < expectedIds.length; i++) {
            int expectedId = Integer.parseInt(expectedIds[i].trim());
            assertEquals("ID задачи на позиции " + i + " не соответствует ожидаемому",
                         expectedId, actualIds.get(i).intValue());
        }
    }

    @Then("я жду пока новая задача с контент типом {string} создаётся")
    public void waitUntilTaskCreate(String contentType) throws InterruptedException {
        String filter = "content_type_id IN('" + contentType + "')";

        int maxAttempts = 4;
        int delaySeconds = 5;
        TimeUnit.SECONDS.sleep(delaySeconds);

        for (int attempt = 0; attempt < maxAttempts; attempt++) {
            getTasks(filter);
            List<Map<String, Object>> content = response.jsonPath().getList("content");
            if (content != null && !content.isEmpty()) {
                // Находим задачу с максимальным ID
                Integer maxTaskId = null;
                Map<String, Object> taskWithMaxId = null;
                for (Map<String, Object> task: content) {
                    Integer taskId = (Integer) task.get("id");
                    if (taskId != null && (maxTaskId == null || taskId > maxTaskId)) {
                        maxTaskId = taskId;
                        taskWithMaxId = task;
                    }
                }

                if (taskWithMaxId != null) {
                    String connection = (String) taskWithMaxId.get("inbox_data_key_data_connection");
                    if (isValidConnection(connection)) {
                        currentTaskId = maxTaskId;

                        return;
                    }
                }
            }
            if (attempt < maxAttempts - 1) {
                TimeUnit.SECONDS.sleep(delaySeconds);
            }
        }

        StringBuilder errorDetails = new StringBuilder();
        errorDetails.append(String.format(
                "Задача с content_type_id '%s' и корректным inbox_data_key_data_connection не найдена после %d попыток\n",
                contentType, maxAttempts));
        errorDetails.append("Ожидаемые условия:\n");
        errorDetails.append("1. Задача должна иметь content_type_id = ").append(contentType).append("\n");
        errorDetails.append("2. Задача должна иметь максимальный ID среди всех задач с указанным content_type_id\n");

        throw new AssertionError(errorDetails);
    }

    @When("файл {string} добавлен к задаче {int}")
    public void currentUserAddFileToTask(String fileName, int taskId) {
        FileDescriptionModel fileDescription = TestFilesManager.getFileDescriptionByTitleOrThrow(fileName);

        updateTask(taskId, "{\"attachments\": [" + fileDescription.asJson() + "]}");

        assertEquals(204, response.getStatusCode());
    }

    @Then("статус текущей задачи равен {string}")
    public void taskStatusCheck(String expectedStatus) throws InterruptedException {
        getTaskByIdentifier(currentTaskId);
        String actualStatus = response.jsonPath().get("status");
        assertEquals("Статус задачи не соответствует ожидаемому", expectedStatus, actualStatus);
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

    private void getTasksByRecords(String tasksId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?recordId=" + tasksId);
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
        updateTask(currentTaskId, json);
    }

    private void updateTask(Integer taskId, String json) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(json).
                        contentType(PATCH_CONTENT_TYPE)
                .when().
                        patch("/" + taskId);
    }

    private boolean isValidConnection(String connection) {
        if (connection == null || connection.trim().isEmpty()) {
            return false;
        }

        try {
            List<Map<String, Object>> connections = gson.fromJson(connection, List.class);
            return !connections.isEmpty()
                    && connections.get(0).containsKey("id")
                    && connections.get(0).containsKey("title")
                    && connections.get(0).containsKey("libraryTableName");
        } catch (Exception e) {
            System.out.println(String.format("Ошибка при парсинге JSON connection: %s", connection));
            e.printStackTrace();

            return false;
        }
    }
}
