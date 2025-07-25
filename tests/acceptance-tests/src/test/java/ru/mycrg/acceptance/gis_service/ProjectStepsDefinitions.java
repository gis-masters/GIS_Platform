package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectDto;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.apache.http.HttpStatus.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.*;

public class ProjectStepsDefinitions extends BaseStepsDefinitions {

    public static ProjectCreateDto projectDto;
    public static Integer projectId;

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
    public void createProject(String projectName) {
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
    public void createProjectFolder(String folderName) {
        projectDto = new ProjectCreateDto(folderName, "Пустая папка проектов", null, false, true, null);

        super.createEntity(projectDto);

        assertEquals(SC_CREATED, response.getStatusCode());
        extractAndSetProjectIdAddToProjectPool();
    }

    @When("я создаю папку проектов: {string}, {string}")
    public void createProjectFolder(String folderName, String description) {
        projectDto = new ProjectCreateDto(folderName, description, null, false, true, null);

        super.createEntity(projectDto);

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
    public void updateCurrentProjectStep(String projectName) {
        authorizationBase.loginAsCurrentUser();

        String projName = generateString(projectName);
        ProjectCreateDto updateDto = new ProjectCreateDto(projName);

        String jsonBody = gson.toJson(updateDto);
        projectDto = mapToProjectDto(projName);

        updateCurrentProject(jsonBody);
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

    @When("Администратор отправляет запрос на обновление проекта")
    public void updateCurrentProjectAsAdmin() {
        authorizationBase.loginAsOwner();

        String projName = generateString("STRING_10");
        ProjectCreateDto updateDto = new ProjectCreateDto(projName,
                                                          generateString("description"),
                                                          "[3824617.6,5725021.2,3834608.8,5743457.4]");
        String jsonBody = gson.toJson(updateDto);
        projectDto = mapToProjectDto(projName);

        updateCurrentProject(jsonBody);
    }

    @When("Администратор делает запрос на обновление полей проекта {string} {string} {string}")
    public void updateCurrentProjectAsAdmin(String name, String description, String bbox) {
        authorizationBase.loginAsOwner();

        String projName = generateString(name);
        ProjectCreateDto updateDto = new ProjectCreateDto(projName, generateString(description), bbox);
        String jsonBody = gson.toJson(updateDto);
        projectDto = mapToProjectDto(projName);

        updateCurrentProject(jsonBody);
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

    @And("Сервер отвечает с пустым телом")
    public void checkBodilessAnswer() {
        jsonPath = response.jsonPath();
        getBaseRequestWithCurrentCookie()
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("$.size()", is(0));
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

    @When("я делаю выборку всех проектов")
    public void currentUserGetAllProjects() {
        super.getAllEntities();
    }

    @When("я делаю выборку проектов из папки {string}")
    public void currentUserGetAllProjects(String projectFolderName) {
        getByParent(String.valueOf(getProjectIdByName(projectFolderName)));
    }

    @When("я перемещаю {string} в {string}")
    public void moveProjectToProjectFolder(String projectName, String projectFolderName) {
        moveItem(getProjectIdByName(projectName),
                 getProjectIdByName(projectFolderName));
    }

    @When("я удаляю {string}")
    public void removeProject(String projectName) {
        int id = getProjectIdByName(projectName);

        forcedDeleteProjectItemById(String.valueOf(id));
    }

    @When("я меняю название проекта {string} на {string}")
    public void updateProjectItemName(String oldName, String newName) {
        updateProject(getProjectIdByName(oldName),
                      gson.toJson(new ProjectCreateDto(newName)));
    }

    @When("название проекта {string} изменено на {string}")
    public void checkProjectItemName(String oldName, String expectedName) {
        int id = getProjectIdByName(oldName);

        getProjectById(id)
                .then()
                .body("name", is(expectedName));
    }

    // Этот шаг проверяет правильность права при массовой выборке
    @Then("{string} имеет роль {string}")
    public void checkRoleForProjectItem(String projectItemName, String expectedRole) {
        List<ProjectDto> projects = response.jsonPath().getList("content", ProjectDto.class);
        ProjectDto project = projects
                .stream()
                .filter(p -> p.getName().equals(projectItemName))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Не найден проект: " + projectItemName));

        String message = String.format("Проект '%s' имеет роль: '%s'. Ожидается роль: '%s'",
                                       projectItemName, project.getRole(), expectedRole);

        assertEquals(message, project.getRole(), expectedRole);
    }

    // Этот шаг проверяет правильность права при выборке конкретного объекта.
    @When("пользователь {string} обладает правом {string} на {string}")
    public void checkUserPermissionsForProjectItem(String userName, String expectedRole, String projectItemName) {
        UserCreateDto user = getUserByName(userName);
        authorizationBase.loginAs(user.getEmail(), user.getPassword());

        Response response = getProjectById(getProjectIdByName(projectItemName));
        response.then()
                .statusCode(SC_OK)
                .body("role", is(expectedRole));
    }

    @When("проекты актуализированы согласно шаблона {string}")
    public void recreateProjects(String projectsTemplate) {
        authorizationBase.loginAsOwner();

        super.getAllEntities()
             .jsonPath()
             .getList("content", ProjectDto.class)
             .forEach(project -> {
                 forcedDeleteProjectItemById(project.getId())
                         .then()
                         .statusCode(SC_NO_CONTENT);
             });

        // Создадим новые
        createProjectsByTemplate(projectsTemplate);
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
    public void deletedProjects() {
        super.getAllEntities()
             .jsonPath()
             .getList("content", ProjectDto.class)
             .forEach(project -> {
                 forcedDeleteProjectItemById(project.getId())
                         .then()
                         .statusCode(SC_NO_CONTENT);
             });
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

    @Then("количество доступных мне проектов равно {int}")
    public void allowedForCurrentUser(int expectedCount) {
        assertEquals(expectedCount, response.jsonPath().getInt("page.totalElements"));
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

    @And("Количество страниц проектов пропорционально {string}")
    public void checkProjectPagesCount(String sortingDirection) {
        super.checkPagesCount(sortingDirection);
    }

    @And("На всех страницах проектов есть {string}")
    public void areProjectsOnPages(String entitiesPerPage) {
        super.checkSomethingOnPages(entitiesPerPage);
    }

    @When("Администратор делает постраничный запрос на проекты")
    public void getProjectCount() {
        getAllAndFillEntityCount();
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

    @When("я делаю запрос на перемещение проекта {string} в {string}")
    public void adminMovesProjectOrFolder(String movedItem, String targetItem) {
        int movedItemId = getProjectIdByName(movedItem);
        int targetItemId = getProjectIdByName(targetItem);

        moveItem(movedItemId, targetItemId);
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

        assertFalse(jsonPath.getList("").isEmpty());
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

    private void moveItem(Integer movedItemId, Integer targetId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        post(String.format("/%d/move/%d", movedItemId, targetId));
    }

    private void updateProject(Integer id, String jsonBody) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(jsonBody).
                        contentType(ContentType.JSON)
                .when().log().all().
                       patch("" + id);
    }

    private void updateCurrentProject(String jsonBody) {
        updateProject(projectId, jsonBody);
    }

    private Response getByParent(String parentId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?parent=" + parentId);

        return response;
    }

    private Response forcedDeleteProjectItemById(String id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/" + id + "?forced=true");

        return response;
    }

    private Response getProjectById(Integer projectItemId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                       get("/" + projectItemId);

        return response;
    }

    public void createProjectsByTemplate(String template) {
        projectPool.clear();

        if ("тестирование прав на проекты".equals(template)) {
            // Проекты в корне
            createProject("Проект0.1");
            createProject("Проект0.2");
            createProject("Проект0.3");

            // Папка 1 и её наполнение
            createProjectFolder("Папка1", "Папка 1");
            createProject("Проект1.1");
            createProject("Проект1.2");
            createProject("Проект1.3");

            int folder1 = getProjectIdByName("Папка1");

            moveItem(getProjectIdByName("Проект1.1"), folder1);
            moveItem(getProjectIdByName("Проект1.2"), folder1);
            moveItem(getProjectIdByName("Проект1.3"), folder1);

            // Папка 2 и её наполнение
            createProjectFolder("Папка2", "Папка 2");
            createProject("Проект2.1");
            createProject("Проект2.2");
            createProject("Проект2.3");

            int folder2 = getProjectIdByName("Папка2");

            moveItem(getProjectIdByName("Проект2.1"), folder2);
            moveItem(getProjectIdByName("Проект2.2"), folder2);
            moveItem(getProjectIdByName("Проект2.3"), folder2);

            // Папка 7 и её наполнение
            createProjectFolder("Папка7", "Папка 7");
            int pFolder7 = getProjectIdByName("Папка7");
            createProject("Проект37.1");

            moveItem(getProjectIdByName("Проект37.1"), pFolder7);

            // Папка 6 и её наполнение
            createProjectFolder("Папка6", "Папка 6");
            createProject("Проект6.1");

            moveItem(getProjectIdByName("Проект6.1"), getProjectIdByName("Папка6"));

            // Папка 5 и её наполнение
            createProjectFolder("Папка5", "Папка 5");
            int pFolder5 = getProjectIdByName("Папка5");

            createProject("Проект345.1");
            createProject("Проект345.2");

            moveItem(getProjectIdByName("Проект345.1"), pFolder5);
            moveItem(getProjectIdByName("Проект345.2"), pFolder5);

            // Папка 4 и её наполнение
            createProjectFolder("Папка4", "Папка 4");
            int pFolder4 = getProjectIdByName("Папка4");

            createProject("Проект34.1");
            createProject("Проект34.2");

            moveItem(pFolder5, pFolder4);
            moveItem(getProjectIdByName("Проект34.1"), pFolder4);
            moveItem(getProjectIdByName("Проект34.2"), pFolder4);

            // Папка 3 и её наполнение
            createProjectFolder("Папка3", "Папка 3");
            int pFolder3 = getProjectIdByName("Папка3");

            createProject("Проект3.1");

            moveItem(pFolder4, pFolder3);
            moveItem(pFolder7, pFolder3);
            moveItem(getProjectIdByName("Проект3.1"), pFolder3);
        } else {
            throw new IllegalStateException("Создание проектов. Передан не известный шаблон: " + template);
        }
    }

    private ProjectCreateDto mapToProjectDto(String projectName) {
        return new ProjectCreateDto(projectName);
    }

    private boolean isProjectExistInPool(String projectName) {
        return projectPool.values().stream()
                          .anyMatch(dto -> projectName.equals(dto.getName()));
    }
}
