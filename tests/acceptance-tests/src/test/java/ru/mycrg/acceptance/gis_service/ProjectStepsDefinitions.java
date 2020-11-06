package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.UserStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.ProjectRequestDto;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class ProjectStepsDefinitions extends BaseStepsDefinitions {

    public static ProjectRequestDto currentProjectDto;
    public static Integer currentId;
    public static Integer currentPermId;

    public Integer getCurrentId() {
        return currentId;
    }

    public void setCurrentId(Integer currentId) {
        ProjectStepsDefinitions.currentId = currentId;
    }

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/projects");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/projects");
    }

    @When("Пользователь делает запрос на создание проекта {string}")
    public void createProject(String projectName) {
        currentProjectDto = new ProjectRequestDto(replaceString(projectName));

        String payload = gson.toJson(currentProjectDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    @And("Поля проекта совпадают с переданными")
    public void isProjectDataIsCorrect() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), currentProjectDto.getProjectName());
    }

    @Given("Существует проект {string}")
    public void isProjectExist(String projectName) {
        if (!isProjectExistInPool(replaceString(projectName))) {
            ProjectRequestDto dto = mapToProjectDto(replaceString(projectName));
            Response createResponse = createProject(dto);

            assertEquals(SC_CREATED, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractEntityIdFromResponse(createResponse);

            currentProjectDto = dto;
            setCurrentId(id);

            projectPool.put(id, dto);
        }
    }

    @And("Представление проекта корректно")
    public void isProjectDataStructureIsCorrect() {
        Map<String, String> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("internalName"));
        assertTrue(presentedData.containsKey("baseMaps"));
        assertTrue(presentedData.containsKey("organizationId"));
        assertTrue(presentedData.containsKey("layersCount"));
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

    @When("Пользователь делает запрос на обновление полей проекта {string}")
    public void updateCurrentProject(String projectName) {
        currentProjectDto = mapToProjectDto(projectName);

        String payload = gson.toJson(currentProjectDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        put("" + currentId);
    }

    @When("Администратор делает запрос на создание правила на текущего пользователя")
    public void giveCurrentUserPermToCurrentProject() {
        Map<String, String> queryParams = new LinkedHashMap<>();

        queryParams.put("principalId", (UserStepsDefinitions.currentId).toString());
        queryParams.put("principalType", "user");
        queryParams.put("role", "VIEWER");

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(queryParams)).
                        contentType(ContentType.JSON)
                .when().
                        post(String.format("/%d/permissions", currentId));
    }

    @When("Пользователь делает запрос на удаление текущего проекта")
    public void deleteCurrentProject() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/" + currentId);

        projectPool.remove(currentId);
    }

    @When("Администратор делает запрос на проверку правил текущего проекта")
    public void checkPermOfCurrentProject() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentId + "/permissions");
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
                        patch(String.format("/%d/permissions/%d", currentId, currentPermId));
    }

    @When("Администратор делает запрос на указанное правило")
    public void checkPerm() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        get(String.format("/%d/permissions/%d", currentId, currentPermId));

        jsonPath = response.jsonPath();
    }

    @And("Сервер передает ID правила в ответе")
    public void extractPermIdFromResponse() {
        currentPermId = extractEntityIdFromResponse(response);

        assertNotNull(currentPermId);
    }

    @When("Пользователь делает повторный запрос на создание проекта")
    public void createProjectAgain() {
        String payload = gson.toJson(currentProjectDto);
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
    }

    @When("Пользователь делает запрос на текущий проект")
    public void getCurrentProjectInfoById() {
        super.getCurrentEntityInfoById();
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

    @And("Количество страниц проектов {string} пропорционально {string}")
    public void checkProjectPagesCount(String sortingType, String sortingDirection) {
        super.getAllEntitiesSorted(sortingType, sortingDirection);
    }

    @And("На всех страницах проектов {string} есть {string}")
    public void areProjectsOnPages(String checkType, String entitiesPerPage) {
        super.isSomethingOnPages(checkType, entitiesPerPage);
    }

    @When("Администратор делает постраничный запрос на проекты {string}")
    public void getProjectCount(String entity) {
        getEntityCount(entity);
    }

    private Response createProject(ProjectRequestDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("");

        return response;
    }

    private boolean isProjectExistInPool(String projectName) {
        return projectPool
                .values().stream()
                .anyMatch(dto -> projectName.equals(dto.getProjectName()));
    }

    private ProjectRequestDto mapToProjectDto(String projectName) {
        return new ProjectRequestDto(projectName);
    }

    @And("В ответе на удаление проекта есть упоминание ID")
    public void checkIdInResponse() {
        super.checkIdInResponse();
    }
}
