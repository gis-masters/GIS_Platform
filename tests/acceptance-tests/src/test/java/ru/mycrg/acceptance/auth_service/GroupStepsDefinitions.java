package ru.mycrg.acceptance.auth_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;

import java.util.List;

import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class GroupStepsDefinitions extends BaseStepsDefinitions {

    public static GroupCreateDto currentUsersGroupDto;
    public static Integer currentUsersGroupId;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/groups");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/groups");
    }

    @When("Администратор создает группу {string}, {string}")
    public void createUserGroup(String groupName, String groupDescription) {
        currentUsersGroupDto = new GroupCreateDto(replaceString(groupName), replaceString(groupDescription));
        String payload = new Gson().toJson(currentUsersGroupDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    @Then("Сервер передает ID созданный группы")
    public void extractUsersGroupIdFromResponseBody() {
        currentUsersGroupId = response.jsonPath().get("id");

        assertNotNull(currentUsersGroupId);
    }

    @When("Администратор делает запрос на указанную группу")
    public void getExactUsersGroup() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentUsersGroupId);
    }

    @Then("Поля группы совпадают с переданными")
    public void isUsersGroupDataCorrect() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), currentUsersGroupDto.getName());
        assertEquals(jsonPath.get("description"), currentUsersGroupDto.getDescription());
    }

    @Given("Существует пользовательская группа {string}, {string}")
    public void checkUsersGroup(String groupName, String groupDescription) {
        if (!isUsersGroupExistInPool(replaceString(groupName))) {
            GroupCreateDto dto = mapToGroupDto(replaceString(groupName), replaceString(groupDescription));
            Response createResponse = createUsersGroup(dto);

            assertEquals(SC_OK, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractUsersGroupId(createResponse);

            currentUsersGroupId = id;
            currentUsersGroupDto = dto;
            usersGroupPool.put(id, dto);
        }
    }

    @When("Администратор делает запрос на все группы")
    public void getAllUsersGroups() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=1000");

        assertEquals(SC_OK, response.statusCode());
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все пользовательские группы")
    public void getAllUsersGroupsSorted(String sortingFactor, String sortingDirection) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/?sort=%s,%s&%s", sortingFactor, sortingDirection, "size=1000"));
    }

    @When("Администратор делает постраничный запрос на все пользовательские группы")
    public void usersGroupsPerPage() {
        getAllUsersGroups();
        jsonPath = response.jsonPath();
        entityCount = jsonPath.getList("_embedded.groups.id").size();
    }

    @When("Администратор изменяет поля группы {string}, {string}")
    public void updateUsersGroup(String newGroupName, String newGroupDescription) {
        currentUsersGroupDto = new GroupCreateDto(replaceString(newGroupName), replaceString(newGroupDescription));
        String payload = new Gson().toJson(currentUsersGroupDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        body(payload).
                        patch("/" + currentUsersGroupId);
    }

    @When("Администратор добавляет пользователя в пользовательскую группу")
    public void addUserToUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .given().
                contentType(ContentType.JSON)
                .when().
                        body("{}").
                        post(String.format("/%s/users/%s", currentUsersGroupId,
                                           UserStepsDefinitions.currentUserId))
                .then().
                        log().ifValidationFails().
                        statusCode(SC_NO_CONTENT);
    }

    @Then("В пользовательской групппе присутствует указанный пользователь")
    public void isUserInUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                get("/" + currentUsersGroupId)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.id", hasItems(UserStepsDefinitions.currentUserId));
    }

    @When("Администратор удаляет пользователя из пользовательской группы")
    public void deleteUserToUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                delete(String.format("/%s/users/%s", currentUsersGroupId, UserStepsDefinitions.currentUserId))
                .then().
                        log().ifValidationFails().
                        statusCode(SC_NO_CONTENT);
    }

    @And("В пользовательской групппе отсутствует указанный пользователь")
    public void isNotUserInUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                get("/" + currentUsersGroupId)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.id", not(hasItems(UserStepsDefinitions.currentUserId)));
    }

    @When("Администратор организации удаляет пользовательскую группу")
    public void deleteUsersGroup() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/" + currentUsersGroupId);

        assertEquals(response.statusCode(), SC_NO_CONTENT);
    }

    @Given("Существуют пользовательские группы")
    public void createMultipleUsersGroups(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> group: data) {
            createUserGroup(group);
        }
    }

    @And("Количество страниц групп пропорционально {string}")
    public void checkUsersGroupPagesCount(String entitiesPerPage) {
        super.checkPagesCount(entitiesPerPage);
    }

    @And("На всех страницах групп {string} есть {string}")
    public void isBaseMapsOnPages(String checkType, String entitiesPerPage) {
        super.isSomethingOnPages(checkType, entitiesPerPage);
    }

    private Response createUsersGroup(GroupCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(new Gson().toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("");

        return response;
    }

    private void createUserGroup(List<String> group) {
        currentUsersGroupDto = new GroupCreateDto(replaceString(group.get(0)), replaceString(group.get(1)));
        String payload = new Gson().toJson(currentUsersGroupDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    private Integer extractUsersGroupId(Response response) {
        return response.jsonPath().get("id");
    }

    private boolean isUsersGroupExistInPool(String groupName) {
        return usersGroupPool
                .values().stream()
                .anyMatch(dto -> groupName.equals(dto.getName()));
    }

    private GroupCreateDto mapToGroupDto(String groupName, String groupDescription) {
        return new GroupCreateDto(groupName, groupDescription);
    }
}
