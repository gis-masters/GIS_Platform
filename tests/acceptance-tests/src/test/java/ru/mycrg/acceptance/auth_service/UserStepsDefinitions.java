package ru.mycrg.acceptance.auth_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.List;

import static org.apache.http.HttpStatus.SC_ACCEPTED;
import static org.junit.Assert.assertEquals;

public class UserStepsDefinitions extends BaseStepsDefinitions {

    public static Integer userId;
    public static UserCreateDto userDto;

    public Integer getCurrentId() {
        return userId;
    }

    public void setCurrentId(Integer id) {
        userId = id;
    }

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/users");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/users");
    }

    @When("Администратор создает пользователя")
    public void createUser(DataTable dataTable) {
        List<String> data = dataTable.asList();

        userDto = new UserCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                                    replaceString(data.get(2)), replaceString(data.get(3)));

        String payload = gson.toJson(userDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    @When("Администратор повторно создает пользователя")
    public void createAgainUser() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(userDto)).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    @Then("Пользователю присвоена роль = {string}")
    public void isUserRoleIsUser(String role) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + userId);

        jsonPath = response.jsonPath();

        assertEquals(jsonPath.getList("authorities.authority").get(0), role);
    }

    @Given("Существует пользователь")
    public void checkUser(DataTable dataTable) {
        String eMail = replaceString(dataTable.asList().get(2));

        if (!isUserExistInPool(eMail)) {
            UserCreateDto dto = mapToUserDto(dataTable);
            Response createResponse = createUser(dto);

            assertEquals(SC_ACCEPTED, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractIdFromLocation(createResponse);

            userId = id;
            userDto = dto;
            userPool.put(id, dto);
        }
    }

    @When("Администратор организации удаляет пользователя")
    public void deleteUser() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/" + userId);

        userPool.remove(userId);
    }

    @And("в заголовке Location передает ID созданного пользователя")
    public void extractUserIdFromLocation() {
        userId = extractIdFromLocation();
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на всех пользователей")
    public void getAllUsersSorted(String sortingType, String sortingDirection) {
        super.getAllEntitiesSorted(sortingType, sortingDirection);
    }

    @When("Администратор делает запрос на созданного пользователя")
    public void getExactUser() {
        getCurrentEntityInfoById();
    }

    @When("Администратор делает запрос на всех пользователей")
    public void getAllUsers() {
        getAllEntities();
    }

    @When("Администратор делает постраничный запрос на всех пользователей")
    public void getAllUsersPaginated() {
        getAllUsers();
        jsonPath = response.jsonPath();
        entityCount = jsonPath.getList("_embedded.users.id").size();
    }

    @And("Количество страниц пользователей {string} пропорционально {string}")
    public void checkUserPagesCount(String checkType, String entitiesPerPage) {
        super.checkPagesCount(checkType, entitiesPerPage);
    }

    @Then("Поля пользователя совпадают с переданными")
    public void isDataCorrect() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), userDto.getName());
        assertEquals(jsonPath.get("surName"), userDto.getSurName());
        assertEquals(jsonPath.get("email"), userDto.getEmail());

        userPool.put(userId, userDto);
    }

    @And("На всех страницах пользователей {string} есть {string}")
    public void areUsersOnPages(String checkType, String entitiesPerPage) {
        super.isSomethingOnPages(checkType, entitiesPerPage);
    }

    @Given("Существуют пользователи")
    public void createMultipleUsers(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> user: data) {
            createUser(user);
        }
    }

    private void createUser(List<String> user) {
        userDto = new UserCreateDto(replaceString(user.get(0)), replaceString(user.get(1)),
                                    replaceString(user.get(2)), replaceString(user.get(3)));

        String payload = gson.toJson(userDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    private boolean isUserExistInPool(String eMail) {
        return userPool
                .values().stream()
                .anyMatch(dto -> eMail.equals(dto.getEmail()));
    }

    private UserCreateDto mapToUserDto(DataTable dataTable) {
        List<String> data = dataTable.asList();
        return new UserCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                                 replaceString(data.get(2)), replaceString(data.get(3)));
    }

    private Response createUser(UserCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("");

        return response;
    }

    @When("Администратор делает постраничный запрос на пользователей {string}")
    public void getUsersCount(String entity) {
        getEntityCount(entity);
    }
}
