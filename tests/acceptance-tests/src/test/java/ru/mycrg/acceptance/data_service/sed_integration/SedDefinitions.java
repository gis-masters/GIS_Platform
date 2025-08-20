package ru.mycrg.acceptance.data_service.sed_integration;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.path.json.JsonPath;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.UserStepsDefinitions;
import ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition;

import java.util.HashMap;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition.currentTaskId;
import static ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition.taskCreateDto;

public class SedDefinitions extends BaseStepsDefinitions {

    private final TaskStepDefinition taskStepDefinition = new TaskStepDefinition();
    private final UserStepsDefinitions userStepsDefinitions = new UserStepsDefinitions();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return RestAssured
                .given()
                .log().ifValidationFails()
                .baseUri("http://localhost")
                .port(8888)
                .basePath("/sed/synchronization");
    }

    @Given("Создана задача СЭД, статус задачи 'Создана'")
    public void createSedTask() {
        userStepsDefinitions.getCurrent();

        Integer ownerId = response.jsonPath().get("id");

        taskCreateDto = new HashMap<>();
        taskCreateDto.put("type", "CUSTOM");
        taskCreateDto.put("assigned_to", (long) ownerId);
        taskCreateDto.put("owner_id", (long) ownerId);
        taskCreateDto.put("content_type_id", "sed_task_introduction");
        taskCreateDto.put("is_done_in_sed", false);

        taskStepDefinition.createTask(taskCreateDto);
        currentTaskId = extractEntityIdFromResponse(response);

        assertEquals(201, response.getStatusCode());
    }

    @And("В задаче изменились поля статуса и описания")
    public void checkTaskState2() {
        taskStepDefinition.getTaskByIdentifier(currentTaskId);

        String actualDescription = response.jsonPath().get("description");
        Boolean actualIsDoneInSed = response.jsonPath().get("is_done_in_sed");

        assertEquals("Что-то пошло не так при получении токена в СЭД", actualDescription);
        assertEquals(true, actualIsDoneInSed);
    }

    @Given("Пользователь нажимает на ручку интеграции со СМЭВ")
    public void useSedHandler() {
        response = getBaseRequestWithCurrentCookie()
                .when()
                .post();
    }

    @When("Текущей задаче выставлен положительный статус обработки в СЭД")
    public void updateTasksIsDoneInSed() {
        taskStepDefinition.updateCurrentTask("{\"is_done_in_sed\": true }");

        assertEquals(204, response.getStatusCode());
    }

    @And("Задача никак не изменилась")
    public void checkTaskState() {
        taskStepDefinition.getTaskByIdentifier(currentTaskId);

        String actualType = response.jsonPath().get("type");
        Long actualAssignedTo = response.jsonPath().getLong("assigned_to");
        Long actualOwnerId = response.jsonPath().getLong("owner_id");
        String actualContentTypeId = response.jsonPath().get("content_type_id");
        Boolean actualIsDoneInSed = response.jsonPath().get("is_done_in_sed");

        assertEquals(taskCreateDto.get("type"), actualType);
        assertEquals(taskCreateDto.get("assigned_to"), actualAssignedTo);
        assertEquals(taskCreateDto.get("owner_id"), actualOwnerId);
        assertEquals(taskCreateDto.get("content_type_id"), actualContentTypeId);
        assertEquals(taskCreateDto.get("is_done_in_sed"), actualIsDoneInSed);
    }

    @And("В задаче изменен только статус обработки в СЭД")
    public void checkTaskSedState() {
        taskStepDefinition.getTaskByIdentifier(currentTaskId);

        String actualType = response.jsonPath().get("type");
        Long actualAssignedTo = response.jsonPath().getLong("assigned_to");
        Long actualOwnerId = response.jsonPath().getLong("owner_id");
        String actualContentTypeId = response.jsonPath().get("content_type_id");

        assertEquals(taskCreateDto.get("type"), actualType);
        assertEquals(taskCreateDto.get("assigned_to"), actualAssignedTo);
        assertEquals(taskCreateDto.get("owner_id"), actualOwnerId);
        assertEquals(taskCreateDto.get("content_type_id"), actualContentTypeId);
        assertEquals(true, response.jsonPath().get("is_done_in_sed"));

        assertNull(taskCreateDto.get("description"));
    }

    @And("Существует задача СЭД с созданным только что документом")
    public void isSedTaskReallyExist() {
        taskStepDefinition.getTasks();

        String inbox_data_key_data_connection = response.jsonPath()
                                                        .getString("content[0].inbox_data_key_data_connection");

        JsonPath jsonPath = JsonPath.from(inbox_data_key_data_connection);
        Integer realId = jsonPath.getInt("[0].id");

        assertEquals(currentDocumentId, realId);
    }
}
