package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.gis_service.dto.ProjectRequestDto;
import ru.mycrg.acceptance.gis_service.dto.ProjectUpdateDto;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.*;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.GroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;

public class ProjectStepsDefinitions extends BaseStepsDefinitions {

    public static ProjectRequestDto projectDto;
    public static Integer projectId;
    public static Integer permId;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

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
        String projectName = generateString(projectNameKey);
        if (isProjectExistInPool(projectName)) {
            makeExactProjectAsCurrent(projectName);
        } else if (!projectPool.isEmpty()) {
            makeLastAvailableProjectAsCurrent();
        } else {
            createProjectStep(projectNameKey);
            assertEquals(SC_CREATED, response.getStatusCode());
            extractAndSetProjectIdFromBody();
        }
    }

    @And("Представление проекта корректно")
    public void checkProjectBody() {
        Map<String, String> presentedData = response
                .then().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("organizationId"));
        assertTrue(presentedData.containsKey("createdAt"));
        assertTrue(presentedData.containsKey("name"));
        assertTrue(presentedData.containsKey("default"));
        assertTrue(presentedData.containsKey("id"));
        assertTrue(presentedData.containsKey("role"));
    }

    @When("Существуют проекты")
    public void createMultipleProjects(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> data1: data) {
            for (String project: data1) {
                createProjectStep(project);
            }
        }
    }

    @When("Пользователь делает запрос на создание проекта {string}")
    public void createProjectStep(String projectNameKey) {
        projectDto = new ProjectRequestDto(generateString(projectNameKey));

        super.createEntity(projectDto);

        projectId = extractEntityIdFromResponse(response);
    }

    @When("Пользователь делает запрос на обновление полей проекта {string}")
    public void updateCurrentProject(String projectName) {
        authorizationBase.loginAsCurrentUser();

        String projName = generateString(projectName);
        ProjectUpdateDto updateDto = new ProjectUpdateDto(projName);

        String jsonBody = gson.toJson(updateDto);
        projectDto = mapToProjectDto(projName);

        updateProject(jsonBody);
    }

    @When("Пользователь делает запрос на обновление полей проекта {string} имея старый токен")
    public void updateCurrentProjectWithOldCookie(String projectName) {
        String projName = generateString(projectName);
        ProjectUpdateDto updateDto = new ProjectUpdateDto(projName);

        String jsonBody = gson.toJson(updateDto);
        projectDto = mapToProjectDto(projName);

        response = getBaseRequestWithOldCookie()
                .given().
                        body(jsonBody).
                        contentType(ContentType.JSON)
                .when().
                        patch("" + projectId);
    }

    @When("Администратор делает запрос на обновление полей проекта {string}")
    public void updateCurrentProjectAsAdmin(String projectName) {
        authorizationBase.loginAsOwner();

        updateProject(projectName);
    }

    @When("Администратор отправляет запрос на обновление проекта")
    public void updateCurrentProjectAsAdmin() {
        authorizationBase.loginAsOwner();

        String projName = generateString("STRING_10");
        ProjectUpdateDto updateDto = new ProjectUpdateDto(projName,
                                                          generateString("description"),
                                                          "[3824617.6,5725021.2,3834608.8,5743457.4]");
        String jsonBody = gson.toJson(updateDto);
        projectDto = mapToProjectDto(projName);

        updateProject(jsonBody);
    }

    @When("Администратор делает запрос на обновление полей проекта {string} {string} {string}")
    public void updateCurrentProjectAsAdmin(String name, String description, String bbox) {
        authorizationBase.loginAsOwner();

        String projName = generateString(name);
        ProjectUpdateDto updateDto = new ProjectUpdateDto(projName, generateString(description), bbox);
        String jsonBody = gson.toJson(updateDto);
        projectDto = mapToProjectDto(projName);

        updateProject(jsonBody);
    }

    @When("Администратор даёт доступ: {string} для текущего пользователя на текущий проект")
    public void giveCurrentUserPermToCurrentProject(String role) {
        authorizationBase.loginAsOwner();

        addPermissionToProject(userId, "user", role);
    }

    @When("Пользователь даёт доступ: {string} для текущей пользовательской группы на текущий проект")
    public void giveCurrentUserPermToCurrentProjectAsUser(String role) {
        authorizationBase.loginAsCurrentUser();

        addPermissionToProject(usersGroupId, "group", role);
    }

    @When("Администратор даёт доступ: {string} для текущей пользовательской группы на текущий проект")
    public void giveCurrentGroupPermToCurrentProject(String role) {
        authorizationBase.loginAsOwner();

        addPermissionToProject(usersGroupId, "group", role);
    }

    @When("Администратор присваивает группе роль {string} на текущий проект")
    public void addPermissionToCurrentGroup(String role) {
        addPermissionToProject(usersGroupId, "group", role);

        assertEquals(SC_CREATED, response.getStatusCode());
    }

    @Then("В ответе присутствует текущий проект")
    public void checkCurrentProjectIsPresentInResponse() {
        jsonPath = response.jsonPath();

        final List<String> names = jsonPath.getList("content.name");

        names.forEach(s -> System.out.println("PROJECT NAME : " + s));

        assertTrue(names.contains(projectDto.getProjectName()));
    }

    @When("Пользователь делает запрос на удаление текущего проекта")
    public void deleteProject() {
        authorizationBase.loginAsCurrentUser();

        super.deleteCurrentEntity();

        projectPool.remove(projectId);
    }

    @When("Администратор делает запрос на удаление текущего проекта")
    public void deleteProjectAsAdmin() {
        authorizationBase.loginAsOwner();

        super.deleteCurrentEntity();

        projectPool.remove(projectId);
    }

    @When("Администратор делает запрос на проверку правил текущего проекта")
    public void checkProjectPerm() {
        authorizationBase.loginAsOwner();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + projectId + "/permissions");
    }

    @When("Пользователь делает запрос на проверку правил текущего проекта")
    public void checkProjectPermAsUser() {
        authorizationBase.loginAsCurrentUser();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + projectId + "/permissions");
    }

    @When("Пользователь делает запрос на удаление правил текущего проекта")
    public void deleteProjectPermAsUser() {
        authorizationBase.loginAsCurrentUser();

        deletePermissionById();
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
        authorizationBase.loginAsCurrentUser();

        super.getCurrentEntity();
    }

    @When("Пользователь делает запрос на все проекты организации")
    public void getAllProjects() {
        authorizationBase.loginAsCurrentUser();

        super.getAllEntities();
    }

    @When("Пользователь делает запрос на получение доступных отсортированных проектов {string} {string}")
    public void getAllowedSortedProjectsAsUser(String sortingType, String sortDirection) {
        authorizationBase.loginAsCurrentUser();

        super.getAllEntitiesSorted(sortingType, sortDirection);
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все проекты")
    public void getAllProjectsSorted(String sortingType, String sortingDirection) {
        authorizationBase.loginAsOwner();

        super.getAllEntitiesSorted(sortingType, sortingDirection);
    }

    @When("Администратор делает запрос на текущий проект")
    public void getCurrentProject() {
        authorizationBase.loginAsOwner();

        super.getCurrentEntity();
    }

    @When("Администратор делает запрос на выборку проектов с фильтрацией по полю {string} и значению {string}")
    public void getProjectsByFilter(String field, String value) {
        super.getEntitiesWithFilterByField(field, value);
    }

    @And("Количество страниц проектов {string} пропорционально {string}")
    public void checkProjectPagesCount(String sortingType, String sortingDirection) {
        super.checkPagesCount(sortingType, sortingDirection);
    }

    @And("На всех страницах проектов {string} есть {string}")
    public void areProjectsOnPages(String checkType, String entitiesPerPage) {
        super.checkSomethingOnPages(entitiesPerPage);
    }

    @When("Администратор делает постраничный запрос на проекты")
    public void getProjectCount() {
        getAllAndFillEntityCount();
    }

    @And("Пользователь является владельцем проекта")
    public void checkIsCurrentUserOwnCurrentProject() {
        extractAndSetEntityIdFromBody();

        assertNotNull(projectId);

        checkProjectPerm();

        final Map<String, String> result = (Map<String, String>) response.jsonPath().getList("").get(0);

        assertEquals("OWNER", result.get("role"));
    }

    @And("Пользователь имеет роль {string} для текущего проекта")
    public void checkUserRoleForCurrentProject(String expectedRole) {
        String result = response.jsonPath().get("role");

        assertEquals(expectedRole, result);
    }

    @And("Пользователь видит все назначенные ему роли для текущего проекта")
    public void checkAllRolesForCurrentProject() {
        List<Object> permission = response.jsonPath().getList("");
        assertEquals(2, permission.size());

        List<String> roles = response.jsonPath().getList("role");
        roles.forEach(role -> assertEquals("VIEWER", role));
    }

    @And("Многократная проверка получения роли {string} для текущего пользователя, даёт одинаковый результат")
    public void checkRoleForCurrentUserSeveralTimes(String expectedRole) {
        for (int i = 0; i < 5; i++) {
            getCurrentProjectInfoById();
            checkUserRoleForCurrentProject(expectedRole);
        }
    }

    @And("Сервер отвечает со статус-кодом 204, проект успешно удален")
    public void checkProjectWasDeleted() {
        assertEquals(SC_NO_CONTENT, response.getStatusCode());

        super.getCurrentEntity();

        assertEquals(SC_NOT_FOUND, response.getStatusCode());
    }

    @And("в проекте слои были размещены в новой группе, все слои включены")
    public void checkIsCurrentProjectGroupExist() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + projectId + "/groups");

        JsonPath jsonPath = response.jsonPath();

        assertTrue(jsonPath.getList("").size() > 0);
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

        permId = extractEntityIdFromResponse(response);
    }

    private void deletePermissionById() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("/%d/permissions/%s", projectId, permId));
    }

    private void updateProject(String jsonBody) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(jsonBody).
                        contentType(ContentType.JSON)
                .when().
                        patch("" + projectId);
    }
}
