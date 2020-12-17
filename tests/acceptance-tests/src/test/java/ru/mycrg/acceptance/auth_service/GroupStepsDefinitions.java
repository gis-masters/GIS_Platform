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

import java.util.List;

import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;

public class GroupStepsDefinitions extends BaseStepsDefinitions {

    public static GroupCreateDto usersGroupDto;
    public static Integer usersGroupId;

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
    public void createUserGroup(String groupName, String groupDescription) {
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
            createUserGroup(groupName, groupDescription);
            assertEquals(SC_OK, response.getStatusCode());
            extractUsersGroupIdFromResponseBody();
        }
    }

    @When("Администратор делает запрос на все группы")
    public void getAllUsersGroups() {
        super.getAllEntities();
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все пользовательские группы")
    public void getAllUsersGroupsSorted(String sortingFactor, String sortingDirection) {
        super.getAllEntitiesSorted(sortingFactor, sortingDirection);
    }

    @When("Администратор делает постраничный запрос на группы {string}")
    public void getUsersGroupCount(String entity) {
        super.getEntityCount(entity);
    }

    @When("Администратор изменяет поля группы {string}, {string}")
    public void updateUsersGroup(String newGroupName, String newGroupDescription) {
        usersGroupDto = new GroupCreateDto(generateString(newGroupName), generateString(newGroupDescription));
        String payload = gson.toJson(usersGroupDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        body(payload).
                        patch("/" + usersGroupId);
    }

    @When("Администратор добавляет пользователя в пользовательскую группу")
    public void addUserToUsersGroup() {
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

    @And("В пользовательской групппе отсутствует указанный пользователь")
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
            createUserGroup(group);
        }
    }

    @And("Количество страниц групп {string} пропорционально {string}")
    public void checkUsersGroupPagesCount(String checkType, String entitiesPerPage) {
        super.checkPagesCount(checkType, entitiesPerPage);
    }

    @And("На всех страницах групп {string} есть {string}")
    public void checkUsersGroupOnPages(String checkType, String entitiesPerPage) {
        super.checkSomethingOnPages(checkType, entitiesPerPage);
    }

    private void createUserGroup(List<String> group) {
        usersGroupDto = new GroupCreateDto(generateString(group.get(0)), generateString(group.get(1)));
        String payload = gson.toJson(usersGroupDto);

        super.createEntity(payload);
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
}
