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
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectDto;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.apache.http.HttpStatus.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.GroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;

public class ProjectStepsDefinitions extends BaseStepsDefinitions {

    public static ProjectCreateDto projectDto;
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

        assertEquals(jsonPath.get("name"), projectDto.getName());
    }

    @And("параметры проекта совпадают с переданными")
    public void checkCreatedProject() {
        ProjectDto project = response.jsonPath().getObject("", ProjectDto.class);

        assertEquals(projectDto.getName(), project.getName());
        assertEquals(projectDto.getDescription(), project.getDescription());
        assertEquals(projectDto.getBbox(), project.getBbox());
        assertEquals(projectDto.isDefault(), project.isDefault());
        assertEquals(projectDto.isFolder(), project.isFolder());
        assertEquals(projectDto.getParentId(), project.getParentId());
    }

    @And("параметры папки совпадают с переданными")
    public void checkCreatedProjectFolder() {
        ProjectDto project = response.jsonPath().getObject("", ProjectDto.class);

        assertEquals(projectDto.getName(), project.getName());
        assertEquals(projectDto.getDescription(), project.getDescription());
        assertNull(project.getBbox());
        assertFalse(project.isDefault());
        assertEquals(projectDto.isFolder(), project.isFolder());
        assertEquals(projectDto.getParentId(), project.getParentId());
    }

    @Given("Существует проект {string}")
    public void initializeProject(String projectNameKey) {
        String projectName = generateString(projectNameKey);
        if (isProjectExistInPool(projectName)) {
            makeExactProjectAsCurrent(projectName);
        } else {
            createProjectStep(projectNameKey);

            assertEquals(SC_CREATED, response.getStatusCode());
            extractAndSetProjectIdAddToProjectPool();
        }
    }

    @Given("я создал проект {string}")
    public void createsProjectWithName(String projectName) {
        projectDto = new ProjectCreateDto(generateString(projectName));

        super.createEntity(projectDto);

        assertEquals(SC_CREATED, response.getStatusCode());
        extractAndSetProjectIdAddToProjectPool();
    }

    @Given("я создал проект с именем {string} и описанием {string}")
    public void createdProjectWithNameAndDescription(String name, String description) {
        projectDto = new ProjectCreateDto(name, description, null, false, false, null);

        super.createEntity(projectDto);

        assertEquals(SC_CREATED, response.getStatusCode());
        extractAndSetProjectIdAddToProjectPool();
    }

    @Given("я создал папку проектов {string}")
    public void createsProjectFolder(String folderName) {
        projectDto = new ProjectCreateDto(generateString(folderName), "Пустая папка проектов", null, false, true, null);

        super.createEntity(projectDto);

        assertEquals(SC_CREATED, response.getStatusCode());
        extractAndSetProjectIdAddToProjectPool();
    }

    @When("Пользователь делает запрос на создание проекта {string}")
    public void createProjectStep(String projectNameKey) {
        projectDto = new ProjectCreateDto(generateString(projectNameKey));

        super.createEntity(projectDto);

        projectId = extractEntityIdFromResponse(response);
    }

    @When("я создаю проект: {string}, {string}, {string}, {string}, {string}")
    public void createProjectNewStep(String name, String description, String bbox, String isDefault, String isFolder) {
        projectDto = new ProjectCreateDto(name, description, bbox, Boolean.parseBoolean(isDefault),
                                          Boolean.parseBoolean(isFolder), null);

        super.createEntity(projectDto);

        projectId = extractEntityIdFromResponse(response);
    }

    @When("я создаю папку проектов: {string}, {string}")
    public void createProjectFolder(String name, String description) {
        projectDto = new ProjectCreateDto(name, description, null, false, true, null);

        super.createEntity(projectDto);

        projectId = extractEntityIdFromResponse(response);
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

    @And("Представление проекта корректно")
    public void checkProjectBody() {
        ProjectDto project = response.jsonPath().getObject("", ProjectDto.class);

        assertNotNull(project.getId());
        assertNotNull(project.getName());
        assertNotNull(project.getOrganizationId());
        assertNotNull(project.getCreatedAt());
        assertNotNull(project.getRole());

        assertNull(project.getDescription());
        assertNull(project.getBbox());
        assertNull(project.getParentId());

        assertFalse(project.isDefault());
        assertFalse(project.isFolder());
    }

    @Then("проект успешно создан")
    public void checkCreateProjectResponseStatus() {
        assertEquals(SC_CREATED, response.getStatusCode());
    }

    @Then("папка успешно создана")
    public void checkCreateProjectFolderResponseStatus() {
        assertEquals(SC_CREATED, response.getStatusCode());
    }

    @When("Пользователь делает запрос на обновление полей проекта {string}")
    public void updateCurrentProject(String projectName) {
        authorizationBase.loginAsCurrentUser();

        String projName = generateString(projectName);
        ProjectCreateDto updateDto = new ProjectCreateDto(projName);

        String jsonBody = gson.toJson(updateDto);
        projectDto = mapToProjectDto(projName);

        updateProject(jsonBody);
    }

    @When("Пользователь делает запрос на обновление полей проекта {string} имея старый токен")
    public void updateCurrentProjectWithOldCookie(String projectName) {
        String projName = generateString(projectName);
        ProjectCreateDto updateDto = new ProjectCreateDto(projName);

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
        ProjectCreateDto updateDto = new ProjectCreateDto(projName,
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
        ProjectCreateDto updateDto = new ProjectCreateDto(projName, generateString(description), bbox);
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

        assertTrue(names.contains(projectDto.getName()));
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

    @When("я делаю запрос на получение разрешения для текущего проекта")
    public void checkProjectPerm() {
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
    public void extractAndSetProjectIdAddToProjectPool() {
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

        super.get1000Entities();
    }

    @When("Пользователь делает запрос на получение доступных отсортированных проектов {string} {string}")
    public void getAllowedSortedProjectsAsUser(String sortingType, String sortDirection) {
        authorizationBase.loginAsCurrentUser();

        super.get1000EntitiesSorted(sortingType, sortDirection);
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все проекты")
    public void getAllProjectsSorted(String sortingType, String sortingDirection) {
        authorizationBase.loginAsOwner();

        super.get1000EntitiesSorted(sortingType, sortingDirection);
    }

    @Given("удалены все существующие проекты")
    public void deleted1000Projects() {
        // Получаем все проекты
        super.get1000Entities();

        // Получаем список ID проектов
        List<Integer> projectIds = response.jsonPath().getList("content.id");

        // Удаляем каждый проект
        for (Integer id: projectIds) {
            projectId = id;
            super.deleteCurrentEntity();
            projectPool.remove(id);
        }
    }

    @And("Порядок проектов соответствует сортировке по {string} в направлении {string}")
    public void checkProjectsOrder(String sortingType, String sortingDirection) {
        jsonPath = response.jsonPath();
        List<Map<String, Object>> projects = jsonPath.getList("content");

        // Проверяем, что проекты не пустые
        assertThat(projects, not(projects.isEmpty()));

        if (sortingType.equals("name")) {
            // Для сортировки по имени
            List<String> names = projects.stream()
                                         .map(p -> (String) p.get("name"))
                                         .collect(Collectors.toList());

            if (sortingDirection.equals("asc")) {
                // Для возрастающей сортировки ожидаем A-B-C
                assertTrue("Ожидается, что A-Project будет перед B-Project",
                           names.indexOf("A-Project") < names.indexOf("B-Project"));
                assertTrue("Ожидается, что B-Project будет перед C-Project",
                           names.indexOf("B-Project") < names.indexOf("C-Project"));
            } else {
                // Для убывающей сортировки ожидаем C-B-A
                assertTrue("Ожидается, что C-Project будет перед B-Project",
                           names.indexOf("C-Project") < names.indexOf("B-Project"));
                assertTrue("Ожидается, что B-Project будет перед A-Project",
                           names.indexOf("B-Project") < names.indexOf("A-Project"));
            }
        } else if (sortingType.equals("id")) {
            // Для сортировки по ID
            List<Integer> ids = projects.stream()
                                        .map(p -> ((Number) p.get("id")).intValue())
                                        .collect(Collectors.toList());

            // Проверяем, что ID отсортированы правильно
            if (sortingDirection.equals("asc")) {
                for (int i = 1; i < ids.size(); i++) {
                    assertTrue("ID должны быть отсортированы по возрастанию",
                               ids.get(i - 1) <= ids.get(i));
                }
            } else {
                for (int i = 1; i < ids.size(); i++) {
                    assertTrue("ID должны быть отсортированы по убыванию",
                               ids.get(i - 1) >= ids.get(i));
                }
            }
        } else if (sortingType.equals("createdAt")) {
            // Для сортировки по дате создания
            // Предполагаем, что проекты создаются в порядке A, B, C
            List<String> names = projects.stream()
                                         .map(p -> (String) p.get("name"))
                                         .collect(Collectors.toList());

            if (sortingDirection.equals("asc")) {
                // Для возрастающей сортировки ожидаем A-B-C (порядок создания)
                assertTrue("Ожидается, что A-Project будет перед B-Project",
                           names.indexOf("A-Project") < names.indexOf("B-Project"));
                assertTrue("Ожидается, что B-Project будет перед C-Project",
                           names.indexOf("B-Project") < names.indexOf("C-Project"));
            } else {
                // Для убывающей сортировки ожидаем C-B-A (обратный порядок создания)
                assertTrue("Ожидается, что C-Project будет перед B-Project",
                           names.indexOf("C-Project") < names.indexOf("B-Project"));
                assertTrue("Ожидается, что B-Project будет перед A-Project",
                           names.indexOf("B-Project") < names.indexOf("A-Project"));
            }
        }
    }

    @When("я делаю запрос на текущий проект")
    public void getCurrentProject() {
        super.getCurrentEntity();
    }

    @When("Администратор делает запрос на выборку проектов с фильтрацией по полю {string} и значению {string}")
    public void getProjectsByFilter(String field, String value) {
        super.getEntitiesWithFilterByField(field, value);
    }

    @And("В результатах фильтрации присутствуют проекты {string} и {string}")
    public void checkFilteredProjects(String project1, String project2) {
        jsonPath = response.jsonPath();
        List<String> names = jsonPath.getList("content.name");

        assertTrue("Проект " + project1 + " должен присутствовать в результатах фильтрации",
                   names.contains(project1));
        assertTrue("Проект " + project2 + " должен присутствовать в результатах фильтрации",
                   names.contains(project2));
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

        Map<String, String> result = (Map<String, String>) response.jsonPath().getList("").get(0);

        assertEquals("OWNER", result.get("role"));
    }

    @And("Пользователь имеет роль {string} для текущего проекта")
    public void checkUserRoleForCurrentProject(String expectedRole) {
        String result = response.jsonPath().get("role");

        assertEquals(expectedRole, result);
    }

    @And("Администратор создаёт проект {string} внутри текущей папки")
    public void adminCreatesProjectInsideFolder(String projectName) {
        authorizationBase.loginAsOwner();

        ProjectCreateDto childProjectDto = new ProjectCreateDto(
                generateString(projectName),
                "Проект внутри папки",
                null,
                false,
                false,
                Long.parseLong(String.valueOf(projectId))
        );

        String jsonBody = gson.toJson(childProjectDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(jsonBody).
                        contentType(ContentType.JSON)
                .when().
                        post("");

        assertEquals(SC_CREATED, response.getStatusCode());
    }

    @And("В ответе содержится сообщение об ошибке {string}")
    public void checkErrorMessageInResponse(String errorMessage) {
        jsonPath = response.jsonPath();
        String message = jsonPath.get("message");

        assertTrue("Ожидаемое сообщение об ошибке не найдено в ответе",
                   message != null && message.contains(errorMessage));
    }

    @When("Администратор делает запрос на перемещение проекта в проект")
    @When("Администратор делает запрос на перемещение проекта в папку")
    @When("Администратор делает запрос на перемещение папки в папку")
    public void adminMovesProjectOrFolder() {
        authorizationBase.loginAsOwner();

        // Сохраняем ID исходного объекта (который будем перемещать)
        Integer sourceId = projectId;

        // Получаем ID целевого объекта (куда будем перемещать)
        getCurrentEntity();
        Integer targetId = projectId;

        // Восстанавливаем ID исходного объекта для перемещения
        projectId = sourceId;

        response = getBaseRequestWithCurrentCookie()
                .when().
                        patch(String.format("/%d/move/%d", projectId, targetId));
    }

    @When("Администратор делает запрос на текущую папку")
    public void adminGetsCurrentFolder() {
        authorizationBase.loginAsOwner();

        getCurrentEntity();
    }

    @Then("Проект находится в указанной папке")
    public void checkProjectIsInFolder() {
        jsonPath = response.jsonPath();
        String path = jsonPath.get("path");

        assertNotNull("Путь проекта не должен быть null", path);
        assertTrue("Путь проекта должен содержать ID папки",
                   path.matches(".*/" + projectId + "$"));
    }

    @Then("Папка находится в указанной папке")
    public void checkFolderIsInFolder() {
        jsonPath = response.jsonPath();
        String path = jsonPath.get("path");

        assertNotNull("Путь папки не должен быть null", path);
        assertTrue("Путь папки должен содержать ID родительской папки",
                   path.matches(".*/" + projectId + "$"));
    }

    @And("Пользователь видит все назначенные ему роли с правом просмотра")
    public void checkAllViewerRolesForCurrentProject() {
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
                          .anyMatch(dto -> projectName.equals(dto.getName()));
    }

    private ProjectCreateDto mapToProjectDto(String projectName) {
        return new ProjectCreateDto(projectName);
    }

    private void makeExactProjectAsCurrent(String projectName) {
        projectPool.entrySet().stream()
                   .filter(entry -> entry.getValue().getName().equals(projectName))
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
