package ru.mycrg.acceptance.auth_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;

public class UserGroupStepsDefinitions extends BaseStepsDefinitions {

    public static Integer usersGroupId;
    public static GroupCreateDto usersGroupDto;
    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/groups");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/groups");
    }

    @Override
    public Integer getCurrentId() {
        return usersGroupId;
    }

    @Override
    public void setCurrentId(Integer id) {
        usersGroupId = id;
    }

    @When("Администратор создает группу {string}, {string}")
    public void createUserGroupAsOwner(String groupName, String groupDescription) {
        authorizationBase.loginAsOwner();

        usersGroupDto = new GroupCreateDto(generateString(groupName), generateString(groupDescription));

        super.createEntity(usersGroupDto);
    }

    @When("Пользователь делает запрос на создание группы {string}, {string}")
    public void createUserGroupAsUser(String groupName, String groupDescription) {
        authorizationBase.loginAsCurrentUser();

        usersGroupDto = new GroupCreateDto(generateString(groupName), generateString(groupDescription));

        super.createEntity(usersGroupDto);
    }

    @Then("Сервер передает ID созданный группы")
    public void extractUsersGroupIdFromResponseBody() {
        super.extractAndSetEntityIdFromBody();

        usersGroupPool.put(usersGroupId, usersGroupDto);
    }

    @When("Администратор делает запрос на указанную группу")
    public void getExactUsersGroup() {
        super.getCurrentEntity();
    }

    @Then("Поля группы совпадают с переданными")
    public void checkUsersGroupData() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), usersGroupDto.getName());
        assertEquals(jsonPath.get("description"), usersGroupDto.getDescription());
    }

    @Given("Существует пользовательская группа {string}, {string}")
    public void initializeUsersGroup(String groupName, String groupDescription) {
        if (isUsersGroupExistInPool(groupName)) {
            makeExactUsersGroupAsCurrent(groupName);
        } else {
            createUserGroupAsOwner(groupName, groupDescription);
            assertEquals(SC_OK, response.getStatusCode());
            extractUsersGroupIdFromResponseBody();
        }
    }

    @When("Администратор делает запрос на все группы")
    public void getAllUsersGroups() {
        super.get1000Entities();
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все пользовательские группы")
    public void getAllUsersGroupsSorted(String sortingFactor, String sortingDirection) {
        super.get1000EntitiesSorted(sortingFactor, sortingDirection);
    }

    @When("Администратор делает постраничный запрос на группы")
    public void getUsersGroupCount() {
        super.getAllAndFillEntityCount();
    }

    @When("Администратор изменяет поля группы {string}, {string}")
    public void updateUsersGroupAsOwner(String newGroupName, String newGroupDescription) {
        authorizationBase.loginAsOwner();

        usersGroupDto = new GroupCreateDto(generateString(newGroupName), generateString(newGroupDescription));
        String payload = gson.toJson(usersGroupDto);

        sendUpdateRequest(payload);
    }

    @When("Пользователь делает запрос на изменение полей группы {string}, {string}")
    public void updateUsersGroupAsUser(String newGroupName, String newGroupDescription) {
        authorizationBase.loginAsCurrentUser();

        usersGroupDto = new GroupCreateDto(generateString(newGroupName), generateString(newGroupDescription));
        String payload = gson.toJson(usersGroupDto);

        sendUpdateRequest(payload);
    }

    @When("Администратор добавляет пользователя в пользовательскую группу")
    public void addUserToUsersGroup() {
        authorizationBase.loginAsOwner();

        getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        body("{}").
                        post(String.format("/%s/users/%s", usersGroupId, userId))
                .then().
                        log().ifValidationFails().
                        statusCode(SC_NO_CONTENT);
    }

    @Then("В пользовательской групппе присутствует указанный пользователь")
    public void isUserInUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + usersGroupId)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.id", hasItems(userId));
    }

    @When("Администратор удаляет пользователя из пользовательской группы")
    public void deleteUserFromUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("/%s/users/%s", usersGroupId, userId))
                .then().
                        log().ifValidationFails().
                        statusCode(SC_NO_CONTENT);
    }

    @And("В пользовательской группе отсутствует указанный пользователь")
    public void isNotUserInUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + usersGroupId)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.id", not(hasItems(userId)));
    }

    @When("Администратор организации удаляет пользовательскую группу")
    public void deleteUsersGroup() {
        super.deleteCurrentEntity();

        assertEquals(SC_NO_CONTENT, response.statusCode());
    }

    @Given("Существуют пользовательские группы")
    public void createMultipleUsersGroups(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> group: data) {
            createUserGroupAsOwner(group);
        }
    }

    @Given("В организации удалены все пользовательские группы")
    public void deleteMultipleUsersGroups() {
        getAllUsersGroups();
        List<Integer> groupIds = response.jsonPath().getList("content.id", Integer.class);
        Set<Integer> ids = new HashSet<>(groupIds);

        for (Integer id: ids) {
            super.deleteEntityById(id);
        }
    }

    @And("Количество страниц групп пропорционально {string}")
    public void checkUsersGroupPagesCount(String entitiesPerPage) {
        super.checkPagesCount(entitiesPerPage);
    }

    @And("На всех страницах групп есть {string}")
    public void checkUsersGroupOnPages(String entitiesPerPage) {
        super.checkSomethingOnPages(entitiesPerPage);
    }

    public void createGroupsByTemplate(String template) {
        if ("тестирование прав на проекты".equals(template)) {
            // Группа 1
            usersGroupDto = new GroupCreateDto("группа 1", "Группа с пользователями fiz3, fiz4");
            super.createEntity(usersGroupDto);
            usersGroupId = response.jsonPath().get("id");

            usersGroupPool.put(usersGroupId, usersGroupDto);

            addUserToGroup(usersGroupId, getUserIdByName("fiz3"));
            addUserToGroup(usersGroupId, getUserIdByName("fiz4"));

            // Группа 2
            usersGroupDto = new GroupCreateDto("группа 2", "Группа с пользователем fiz5");
            super.createEntity(usersGroupDto);
            usersGroupId = response.jsonPath().get("id");

            usersGroupPool.put(usersGroupId, usersGroupDto);

            addUserToGroup(usersGroupId, getUserIdByName("fiz5"));
        } else {
            throw new IllegalStateException("Создание групп пользователей. Передан не известный шаблон: " + template);
        }
    }

    private void createUserGroupAsOwner(List<String> group) {
        usersGroupDto = new GroupCreateDto(generateString(group.get(0)), generateString(group.get(1)));

        super.createEntity(usersGroupDto);
    }

    private boolean isUsersGroupExistInPool(String groupName) {
        return usersGroupPool
                .values().stream()
                .anyMatch(dto -> groupName.equals(dto.getName()));
    }

    private void makeExactUsersGroupAsCurrent(String name) {
        usersGroupPool.entrySet().stream()
                      .filter(entry -> entry.getValue().getName().equals(name))
                      .findFirst()
                      .ifPresent(entry -> {
                          usersGroupId = entry.getKey();
                          usersGroupDto = entry.getValue();
                      });
    }

    private void sendUpdateRequest(String payload) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        body(payload).
                        patch("/" + usersGroupId);
    }

    private void addUserToGroup(Integer groupId, Integer userId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        post(String.format("/%s/users/%s", groupId, userId));

        response.then().statusCode(SC_NO_CONTENT);
    }
}
