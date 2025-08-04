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
import ru.mycrg.data_service_contract.enums.TaskType;

import java.util.*;
import java.util.stream.Collectors;

import static io.restassured.http.ContentType.JSON;
import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_NO_CONTENT;
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

    @When("Согласно специализации 1 создана таблица задач")
    public void checkTasksBySpecialization1() {
        getAllTasks();
    }

    @Given("задачи актуализированы согласно шаблона {string}")
    public void recreateTasks(String tasksTemplate) {
        authorizationBase.loginAsOwner();

        allTasksRemoved();
        createTasksByTemplate(tasksTemplate);
    }

    @Given("Создана задача")
    public void createTaskForOrgOwner() {
        userStepsDefinitions.getCurrent();

        Integer ownerId = response.jsonPath().get("id");

        createTaskRequest(ownerId, ownerId, "CUSTOM", "test description");

        assertEquals(201, response.getStatusCode());
    }

    @Given("удалены все существующие задачи")
    public void allTasksRemoved() {
        deleteAllTasks();

        response.then().statusCode(SC_NO_CONTENT);
    }

    @Given("Существуют задачи")
    public void initTasks(List<List<String>> tasks) {
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

            int taskId = response.jsonPath().getInt("id");

            taskPool.put(taskId, taskCreateDto);
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

    @When("я делаю выборку задач с фильтром по recordId {string}")
    public void getTasksById(String taskDescriptions) {
        if (taskDescriptions.equals("NOT_EXIST_TASK")) {
            int latestTaskId = getTaskByDescription("fiz5 task 1");

            getTasksByRecords(String.valueOf(latestTaskId + 33));

            assertEquals(200, response.getStatusCode());

            return;
        }

        Set<String> ids = Arrays.stream(taskDescriptions.split(","))
                                .filter(desc -> !desc.isEmpty())
                                .map(desc -> {
                                    try {
                                        return getTaskByDescription(desc.trim());
                                    } catch (Exception e) {
                                        return 0;
                                    }
                                })
                                .filter(integer -> integer > 0)
                                .map(Object::toString)
                                .collect(Collectors.toSet());
        String taskIds = String.join(",", ids);

        getTasksByRecords(taskIds);

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

    @Then("в выборке только задачи {string}")
    public void checkCountTasks(String taskDescriptions) {
        if (taskDescriptions.equals("NOT_EXIST_TASK")) {
            int totalElements = response.jsonPath().get("page.totalElements");
            assertEquals("Выборка должна быть пустой", 0, totalElements);

            return;
        }

        int expectedTaskCount = (int) Arrays.stream(taskDescriptions.split(","))
                                            .filter(desc -> !desc.isEmpty())
                                            .count();

        int actualTaskCount = response.jsonPath().getList("content").size();

        assertEquals("Количество задач в выборке не соответствует ожидаемому",
                     expectedTaskCount, actualTaskCount);
    }

    @Then("я жду пока новая задача с контент типом {string} создаётся")
    public void waitUntilTaskCreate(String contentType) throws InterruptedException {
        String filter = "content_type_id IN('" + contentType + "')";

        int attempts = 40;
        int delay = 500;

        sleep(delay);
        for (int attempt = 0; attempt < attempts; attempt++) {
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

            if (attempt < attempts - 1) {
                sleep(delay);
            }
        }

        StringBuilder errorDetails = new StringBuilder();
        errorDetails.append(String.format(
                "Задача с content_type_id '%s' и корректным inbox_data_key_data_connection не найдена после %d попыток\n",
                contentType, attempts));
        errorDetails.append("Ожидаемые условия:\n");
        errorDetails.append("1. Задача должна иметь content_type_id = ").append(contentType).append("\n");
        errorDetails.append("2. Задача должна иметь максимальный ID среди всех задач с указанным content_type_id\n");

        throw new AssertionError(errorDetails);
    }

    @When("файл {string} добавлен к задаче {string}")
    public void currentUserAddFileToTask(String fileName, String taskDescription) {
        FileDescriptionModel fileDescription = TestFilesManager.getFileDescriptionByTitleOrThrow(fileName);

        updateTask(getTaskByDescription(taskDescription),
                   "{\"attachments\": [" + fileDescription.asJson() + "]}");

        assertEquals(204, response.getStatusCode());
    }

    @Then("статус текущей задачи равен {string}")
    public void taskStatusCheck(String expectedStatus) throws InterruptedException {
        getTaskByIdentifier(currentTaskId);
        String actualStatus = response.jsonPath().get("status");
        assertEquals("Статус задачи не соответствует ожидаемому", expectedStatus, actualStatus);
    }

    @Given("Существует таблица задач")
    public void initTaskTable() {
        getTasks();

        if (response.getStatusCode() == 400) {
            System.out.println("Необходимо создать таблицу задач");
            createTaskTableByTaskSchemaV1();
        } else {
            System.out.println("Таблица задач уже существует");
        }
    }

    public void createTask(Map<String, Object> dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(JSON)
                .when().
                        log().ifValidationFails().
                        post();
    }

    public void getTaskByIdentifier(Integer taskId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + taskId);
    }

    public void getTasks() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    private void createTaskTableByTaskSchemaV1() {
        response = getBaseRequestWithCurrentCookie()
                .when()
                        .post("/crateTable/tasks_schema_v1");
    }

    public void updateCurrentTask(String json) {
        updateTask(currentTaskId, json);
    }

    private void getTasks(String filter) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?filter=" + filter);
    }

    private void getTasksByRecords(String taskIds) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?recordId=" + taskIds);
    }

    private void deleteAllTasks() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                       delete("/all");
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
            System.out.printf("Ошибка при парсинге JSON connection: %s%n", connection);
            e.printStackTrace();

            return false;
        }
    }

    private void createTasksByTemplate(String template) {
        taskPool.clear();

        if ("для тестирования доступности вложений задач".equals(template)) {
            List<String> task1 = new ArrayList<>();
            task1.add("orgOwner");
            task1.add("orgOwner");
            task1.add(TaskType.CUSTOM.name());
            task1.add("orgOwner task 1");

            List<String> task2 = new ArrayList<>();
            task2.add("orgOwner");
            task2.add("orgOwner");
            task2.add(TaskType.CUSTOM.name());
            task2.add("orgOwner task 2");

            List<String> task3 = new ArrayList<>();
            task3.add("fiz1");
            task3.add("fiz1");
            task3.add(TaskType.CUSTOM.name());
            task3.add("fiz1 task 1");

            List<String> task4 = new ArrayList<>();
            task4.add("fiz1");
            task4.add("fiz1");
            task4.add(TaskType.CUSTOM.name());
            task4.add("fiz1 task 2");

            List<String> task5 = new ArrayList<>();
            task5.add("fiz1");
            task5.add("fiz1");
            task5.add(TaskType.CUSTOM.name());
            task5.add("fiz1 task 3");

            List<String> task6 = new ArrayList<>();
            task6.add("fiz2");
            task6.add("fiz2");
            task6.add(TaskType.CUSTOM.name());
            task6.add("fiz2 task 1");

            List<String> task7 = new ArrayList<>();
            task7.add("fiz2");
            task7.add("fiz2");
            task7.add(TaskType.CUSTOM.name());
            task7.add("fiz2 task 2");

            List<List<String>> tasksForOwner = new ArrayList<>();
            tasksForOwner.add(task1);
            tasksForOwner.add(task2);
            tasksForOwner.add(task3);
            tasksForOwner.add(task4);
            tasksForOwner.add(task5);
            tasksForOwner.add(task6);
            tasksForOwner.add(task7);

            initTasks(tasksForOwner);

            // Create tasks as fiz2
            UserCreateDto user2 = getUserByName("fiz2");
            authorizationBase.loginAs(user2.getEmail(), user2.getPassword());

            List<String> task8 = new ArrayList<>();
            task8.add("fiz3");
            task8.add("fiz3");
            task8.add(TaskType.CUSTOM.name());
            task8.add("fiz3 task 1");

            List<List<String>> tasksForFiz2 = new ArrayList<>();
            tasksForFiz2.add(task8);

            initTasks(tasksForFiz2);

            // Create tasks as fiz3
            UserCreateDto user3 = getUserByName("fiz3");
            authorizationBase.loginAs(user3.getEmail(), user3.getPassword());

            List<String> task9 = new ArrayList<>();
            task9.add("fiz4");
            task9.add("fiz4");
            task9.add(TaskType.CUSTOM.name());
            task9.add("fiz4 task 1");

            List<String> task10 = new ArrayList<>();
            task10.add("fiz4");
            task10.add("fiz4");
            task10.add(TaskType.CUSTOM.name());
            task10.add("fiz4 task 2");

            List<String> task11 = new ArrayList<>();
            task11.add("fiz4");
            task11.add("fiz4");
            task11.add(TaskType.CUSTOM.name());
            task11.add("fiz4 task 3");

            List<List<String>> tasksForFiz4 = new ArrayList<>();
            tasksForFiz4.add(task9);
            tasksForFiz4.add(task10);
            tasksForFiz4.add(task11);

            initTasks(tasksForFiz4);

            // Create tasks as fiz5
            UserCreateDto user5 = getUserByName("fiz5");
            authorizationBase.loginAs(user5.getEmail(), user5.getPassword());

            List<String> task5_1 = new ArrayList<>();
            task5_1.add("fiz5");
            task5_1.add("fiz5");
            task5_1.add(TaskType.CUSTOM.name());
            task5_1.add("fiz5 task 1");

            List<List<String>> tasksForFiz5 = new ArrayList<>();
            tasksForFiz5.add(task5_1);

            initTasks(tasksForFiz5);
        } else if ("для тестирования доступности задач согласно иерархии пользователей".equals(template)) {
            List<String> task1 = new ArrayList<>();
            task1.add("orgOwner");
            task1.add("orgOwner");
            task1.add(TaskType.CUSTOM.name());
            task1.add("orgOwner task 1");

            List<String> task2 = new ArrayList<>();
            task2.add("orgOwner");
            task2.add("orgOwner");
            task2.add(TaskType.CUSTOM.name());
            task2.add("orgOwner task 2");

            List<String> task3 = new ArrayList<>();
            task3.add("fiz1");
            task3.add("fiz1");
            task3.add(TaskType.CUSTOM.name());
            task3.add("fiz1 task 1");

            List<String> task4 = new ArrayList<>();
            task4.add("fiz1");
            task4.add("fiz1");
            task4.add(TaskType.CUSTOM.name());
            task4.add("fiz1 task 2");

            List<String> task5 = new ArrayList<>();
            task5.add("fiz1");
            task5.add("fiz1");
            task5.add(TaskType.CUSTOM.name());
            task5.add("fiz1 task 3");

            List<String> task6 = new ArrayList<>();
            task6.add("fiz2");
            task6.add("fiz2");
            task6.add(TaskType.CUSTOM.name());
            task6.add("fiz2 task 1");

            List<String> task7 = new ArrayList<>();
            task7.add("fiz2");
            task7.add("fiz2");
            task7.add(TaskType.CUSTOM.name());
            task7.add("fiz2 task 2");

            List<List<String>> tasksForOwner = new ArrayList<>();
            tasksForOwner.add(task1);
            tasksForOwner.add(task2);
            tasksForOwner.add(task3);
            tasksForOwner.add(task4);
            tasksForOwner.add(task5);
            tasksForOwner.add(task6);
            tasksForOwner.add(task7);

            initTasks(tasksForOwner);

            // Create tasks as fiz2
            UserCreateDto user2 = getUserByName("fiz2");
            authorizationBase.loginAs(user2.getEmail(), user2.getPassword());

            List<String> task8 = new ArrayList<>();
            task8.add("fiz3");
            task8.add("fiz3");
            task8.add(TaskType.CUSTOM.name());
            task8.add("fiz3 task 1");

            List<List<String>> tasksForFiz2 = new ArrayList<>();
            tasksForFiz2.add(task8);

            initTasks(tasksForFiz2);

            // Create tasks as fiz3
            UserCreateDto user3 = getUserByName("fiz3");
            authorizationBase.loginAs(user3.getEmail(), user3.getPassword());

            List<String> task9 = new ArrayList<>();
            task9.add("fiz4");
            task9.add("fiz4");
            task9.add(TaskType.CUSTOM.name());
            task9.add("fiz4 task 1");

            List<String> task10 = new ArrayList<>();
            task10.add("fiz4");
            task10.add("fiz4");
            task10.add(TaskType.CUSTOM.name());
            task10.add("fiz4 task 2");

            List<String> task11 = new ArrayList<>();
            task11.add("fiz4");
            task11.add("fiz4");
            task11.add(TaskType.CUSTOM.name());
            task11.add("fiz4 task 3");

            List<List<String>> tasksForFiz4 = new ArrayList<>();
            tasksForFiz4.add(task9);
            tasksForFiz4.add(task10);
            tasksForFiz4.add(task11);

            initTasks(tasksForFiz4);

            // Create tasks as fiz5
            UserCreateDto user5 = getUserByName("fiz5");
            authorizationBase.loginAs(user5.getEmail(), user5.getPassword());

            List<String> task5_1 = new ArrayList<>();
            task5_1.add("fiz5");
            task5_1.add("fiz5");
            task5_1.add(TaskType.CUSTOM.name());
            task5_1.add("fiz5 task 1");

            List<List<String>> tasksForFiz5 = new ArrayList<>();
            tasksForFiz5.add(task5_1);

            initTasks(tasksForFiz5);
        } else {
            throw new IllegalStateException("Создание задач. Передан не известный шаблон: " + template);
        }
    }
}
