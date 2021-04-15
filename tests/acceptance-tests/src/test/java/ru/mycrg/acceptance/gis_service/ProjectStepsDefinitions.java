package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.ProjectRequestDto;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.GroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;

public class ProjectStepsDefinitions extends BaseStepsDefinitions {

    public static ProjectRequestDto projectDto;
    public static Integer projectId;
    public static Integer permId;

    @Override
    public Integer getCurrentId() {
        return projectId;
    }

    @Override
    public void setCurrentId(Integer id) {
        projectId = id;
    }

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/projects");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/projects");
    }

    @And("В ответе на удаление проекта есть упоминание ID")
    public void checkCurrentIdInResponse() {
        super.checkCurrentIdInResponse();
    }

    @And("Поля проекта совпадают с переданными")
    public void checkProjectData() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), projectDto.getProjectName());
    }

    @Given("Существует проект {string}")
    public void initializeProject(String projectNameKey) {
        final String projectName = generateString(projectNameKey);
        if (isProjectExistInPool(projectName)) {
            makeExactProjectAsCurrent(projectName);
        } else if (!projectPool.isEmpty()) {
            makeLastAvailableProjectAsCurrent();
        } else {
            createProject(projectNameKey);
            assertEquals(SC_CREATED, response.getStatusCode());
            extractAndSetProjectIdFromBody();
        }
    }

    @And("Представление проекта корректно")
    public void checkProjectKeys() {
        Map<String, String> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("internalName"));
        assertTrue(presentedData.containsKey("organizationId"));
        assertTrue(presentedData.containsKey("createdAt"));
        assertTrue(presentedData.containsKey("name"));
        assertTrue(presentedData.containsKey("default"));
        assertTrue(presentedData.containsKey("id"));
        assertTrue(presentedData.containsKey("_links"));
    }

    @When("Существуют проекты")
    public void createMultipleProjects(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> data1: data) {
            for (String project: data1) {
                createProject(project);
            }
        }
    }

    @When("Пользователь делает запрос на создание проекта {string}")
    public void createProject(String projectNameKey) {
        projectDto = new ProjectRequestDto(generateString(projectNameKey));

        super.createEntity(projectDto);
    }

    @When("Пользователь делает запрос на обновление полей проекта {string}")
    public void updateCurrentProject(String projectName) {
        projectDto = mapToProjectDto(projectName);

        String payload = gson.toJson(projectDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        put("" + projectId);
    }

    @When("Администратор делает запрос на создание правила на текущего пользователя")
    public void giveCurrentUserPermToCurrentProject() {
        addPermissionToProject(userId, "user", "VIEWER");
    }

    @When("Администратор присваивает текущей группе роль {string}")
    public void addPermissionToCurrentGroup(String role) {
        addPermissionToProject(usersGroupId, "group", role);
    }

    @Then("В ответе присутствует текущий проект")
    public void checkCurrentProjectIsPresentInResponse() {
        jsonPath = response.jsonPath();

        final List<String> names = jsonPath.getList("_embedded.projects.name");

        names.forEach(s -> System.out.println("PROJECT NAME : " + s));

        assertTrue(names.contains(projectDto.getProjectName()));
    }

    @When("Пользователь делает запрос на удаление текущего проекта")
    public void deleteProject() {
        super.deleteCurrentEntity();

        projectPool.remove(projectId);
    }

    @When("Администратор делает запрос на проверку правил текущего проекта")
    public void checkProjectPerm() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + projectId + "/permissions");
    }

    @And("Сервер отвечает с пустым телом")
    public void checkBodilessAnswer() {
        jsonPath = response.jsonPath();
        getBaseRequestWithCurrentCookie()
                .then().
                log().ifValidationFails().
                        statusCode(SC_OK).
                        body("$.size()", is(0));
    }

    @When("Администратор делает запрос на изменение правила с пользователя на пользовательскую группу")
    public void changePermFromUserToUsersGroup() {
        Map<String, String> queryParams = new LinkedHashMap<>();

        queryParams.put("principalType", "group");

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(queryParams)).
                        contentType("application/merge-patch+json")
                .when().
                        patch(String.format("/%d/permissions/%d", projectId, permId));
    }

    @When("Администратор делает запрос на указанное правило")
    public void checkPerm() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        get(String.format("/%d/permissions/%d", projectId, permId));
    }

    @And("Сервер передает ID правила в ответе")
    public void extractPermIdFromResponse() {
        permId = extractEntityIdFromResponse(response);

        assertNotNull(permId);
    }

    @When("Пользователь делает повторный запрос на создание проекта")
    public void createProjectAgain() {
        String payload = gson.toJson(projectDto);
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    @And("Сервер передает ID проекта в ответе")
    public void extractAndSetProjectIdFromBody() {
        super.extractAndSetEntityIdFromBody();

        projectPool.put(projectId, projectDto);
    }

    @When("Пользователь делает запрос на текущий проект")
    public void getCurrentProjectInfoById() {
        super.getCurrentEntity();
    }

    @When("Пользователь делает запрос на все проекты организации")
    public void getAllProjects() {
        super.getAllEntities();
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все проекты")
    public void getAllProjectsSorted(String sortingType, String sortingDirection) {
        super.getAllEntitiesSorted(sortingType, sortingDirection);
    }

    @When("Администратор делает запрос на текущий проект")
    public void getCurrentProject() {
        super.getCurrentEntity();
    }

    @When("Администратор делает запрос на выборку проектов с фильтрацией по полю {string} и значению {string}")
    public void getProjectsByFilter(String field, String value) {
        super.getCurrentEntityByFilter(field, value);
    }

    @And("Количество страниц проектов {string} пропорционально {string}")
    public void checkProjectPagesCount(String sortingType, String sortingDirection) {
        super.checkPagesCount(sortingType, sortingDirection);
    }

    @And("На всех страницах проектов {string} есть {string}")
    public void areProjectsOnPages(String checkType, String entitiesPerPage) {
        super.checkSomethingOnPages(checkType, entitiesPerPage);
    }

    @When("Администратор делает постраничный запрос на проекты {string}")
    public void getProjectCount(String entity) {
        getAllAndFillEntityCount(entity);
    }

    private boolean isProjectExistInPool(String projectName) {
        return projectPool.values().stream()
                          .anyMatch(dto -> projectName.equals(dto.getProjectName()));
    }

    private ProjectRequestDto mapToProjectDto(String projectName) {
        return new ProjectRequestDto(projectName);
    }

    private void makeExactProjectAsCurrent(String projectName) {
        projectPool.entrySet().stream()
                   .filter(entry -> entry.getValue().getProjectName().equals(projectName))
                   .findFirst()
                   .ifPresent(entry -> {
                       projectId = entry.getKey();
                       projectDto = entry.getValue();
                   });
    }

    private void makeLastAvailableProjectAsCurrent() {
        projectPool.entrySet().stream()
                   .skip(projectPool.size() - 1)
                   .findFirst()
                   .ifPresent(entry -> {
                       projectId = entry.getKey();
                       projectDto = entry.getValue();
                   });
    }

    private void addPermissionToProject(Integer principalId, String principalType, String role) {
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("principalId", principalId.toString());
        payload.put("principalType", principalType);
        payload.put("role", role);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(payload)).
                        contentType(ContentType.JSON)
                .when().
                        post(String.format("/%d/permissions", projectId));
    }
}
