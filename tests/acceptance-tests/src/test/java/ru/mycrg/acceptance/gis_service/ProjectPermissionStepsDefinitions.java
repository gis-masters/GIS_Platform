package ru.mycrg.acceptance.gis_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_CREATED;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.auth_service.UserGroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class ProjectPermissionStepsDefinitions extends BaseStepsDefinitions {

    public static Integer permissionId;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();
    private final ProjectStepsDefinitions projectStepsDefinitions = new ProjectStepsDefinitions();

    @Override
    public Integer getCurrentId() {
        return permissionId;
    }

    @Override
    public void setCurrentId(Integer id) {
        permissionId = id;
    }

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest()
                    .basePath("/projects/");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/projects/");
    }

    @Given("я назначил роль {string} для пользователя {string} на {string}")
    public void currentUserSetPermissionForUser(String role, String userName, String itemName) {
        addPermissionAsUser(getUserIdByName(userName),
                            role,
                            getProjectIdByName(itemName));

        response.then().statusCode(SC_CREATED);
    }

    @When("{string} назначает роль {string} для пользователя {string} на {string}")
    public void currentUserSetPermissionForUser(String actor, String role, String userName, String itemName) {
        UserCreateDto user = getUserByName(actor);
        authorizationBase.loginAs(user.getEmail(), user.getPassword());

        addPermissionAsUser(getUserIdByName(userName),
                            role,
                            getProjectIdByName(itemName));
    }

    @Given("я назначил роль {string} для группы пользователей {string} на {string}")
    public void currentUserSetPermissionForUserGroup(String role, String userGroupName, String itemName) {
        addPermissionAsGroup(getUserGroupIdByName(userGroupName),
                             role,
                             getProjectIdByName(itemName));

        response.then().statusCode(SC_CREATED);
    }

    @When("Администратор даёт доступ: {string} для текущего пользователя на текущий проект")
    public void giveCurrentUserPermToCurrentProject(String role) {
        authorizationBase.loginAsOwner();

        addPermissionToCurrentProject(userId, "user", role);
    }

    @When("Пользователь даёт доступ: {string} для текущей пользовательской группы на текущий проект")
    public void giveCurrentUserPermToCurrentProjectAsUser(String role) {
        authorizationBase.loginAsCurrentUser();

        addPermissionToCurrentProject(usersGroupId, "group", role);
    }

    @When("Администратор даёт доступ: {string} для текущей пользовательской группы на текущий проект")
    public void giveCurrentGroupPermToCurrentProject(String role) {
        authorizationBase.loginAsOwner();

        addPermissionToCurrentProject(usersGroupId, "group", role);
    }

    @When("Администратор присваивает группе роль {string} на текущий проект")
    public void addPermissionToCurrentGroup(String role) {
        addPermissionToCurrentProject(usersGroupId, "group", role);

        assertEquals(SC_CREATED, response.getStatusCode());
    }

    @When("я делаю запрос на получение разрешения для текущего проекта")
    public void checkProjectPerm() {
        getProjectPermissions(projectId);
    }

    @When("Пользователь делает запрос на проверку правил текущего проекта")
    public void checkProjectPermAsUser() {
        authorizationBase.loginAsCurrentUser();

        getProjectPermissions(projectId);
    }

    @When("Пользователь делает запрос на удаление правил текущего проекта")
    public void deleteProjectPermAsUser() {
        authorizationBase.loginAsCurrentUser();

        deleteProjectPermission(projectId, permissionId);
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
                        patch(String.format("/%d/permissions/%d", projectId, permissionId));
    }

    @When("Администратор делает запрос на указанное правило")
    public void checkPerm() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        get(String.format("/%d/permissions/%d", projectId, permissionId));
    }

    @And("Сервер передает ID правила в ответе")
    public void extractPermIdFromResponse() {
        permissionId = extractEntityIdFromResponse(response);

        assertNotNull(permissionId);
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
            projectStepsDefinitions.getCurrentProjectInfoById();
            checkUserRoleForCurrentProject(expectedRole);
        }
    }

    private void addPermissionToCurrentProject(Integer principalId, String principalType, String role) {
        addPermission(principalId, principalType, role, projectId);
    }

    private void addPermissionAsUser(Integer principalId,
                                     String role,
                                     Integer projectId) {
        addPermission(principalId, "user", role, projectId);
    }

    private void addPermissionAsGroup(Integer principalId,
                                      String role,
                                      Integer projectId) {
        addPermission(principalId, "group", role, projectId);
    }

    private void addPermission(Integer principalId,
                               String principalType,
                               String role,
                               Integer projectId) {
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

        permissionId = extractEntityIdFromResponse(response);
    }

    private void deleteProjectPermission(Integer projectId, Integer permissionId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("/%d/permissions/%s", projectId, permissionId));
    }

    private void getProjectPermissions(Integer projectId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + projectId + "/permissions");
    }
}
