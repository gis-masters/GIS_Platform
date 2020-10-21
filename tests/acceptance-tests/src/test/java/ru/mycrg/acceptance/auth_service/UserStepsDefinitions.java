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
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.List;

import static org.apache.http.HttpStatus.SC_ACCEPTED;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class UserStepsDefinitions extends BaseStepsDefinitions {

    public static Integer currentUserId;
    public static UserCreateDto currentUserDto;

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

        currentUserDto = new UserCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                                           replaceString(data.get(2)), replaceString(data.get(3)));

        String payload = new Gson().toJson(currentUserDto);

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
                        body(new Gson().toJson(currentUserDto)).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    @Then("Пользователю присвоена роль = {string}")
    public void isUserRoleIsUser(String role) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentUserId);

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

            currentUserId = id;
            currentUserDto = dto;
            userPool.put(id, dto);
        }
    }

    @When("Администратор организации удаляет пользователя")
    public void deleteUser() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/" + currentUserId);

        userPool.remove(currentUserId);
    }

    @And("в заголовке Location передает ID созданного пользователя")
    public void extractUserIdFromLocation() {
        currentUserId = extractIdFromLocation();
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на всех пользователей")
    public void getAllUsersSorted(String sortingType, String sortingDirection) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/?sort=%s,%s&%s", sortingType, sortingDirection, "size=1000"));
    }

    @And("В ответе есть пункт users")
    public void isUsers() {
        jsonPath = response.jsonPath();
        List<String> users = jsonPath.get("_embedded.users.email");

        assertTrue(users.size() >= 2);
    }

    @Then("Данные {string} отсортированы по {string} и {string}")
    public void isUsersSorted(String checkType, String sortingType, String sortingDirection) {
        List<String> sorted = jsonPath.getList(String.format("_embedded.%s.%s", checkType, sortingType));
        for (int i = 1; i < sorted.size(); i++) {
            if (sortingDirection.equals("asc")) {
                assertTrue(sorted.get(i - 1).compareTo(sorted.get(i)) < 1);
            } else if (sortingDirection.equals("desc")) {
                assertTrue(sorted.get(i - 1).compareTo(sorted.get(i)) > -1);
            }
        }
    }

    @When("Администратор делает запрос на созданного пользователя")
    public void getExactUser() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentUserId);
    }

    @When("Администратор делает запрос на всех пользователей")
    public void getAllUsers() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=1000");
    }

    @When("Администратор делает постраничный запрос на всех пользователей")
    public void getAllUsersPaginated() {
        getAllUsers();
        jsonPath = response.jsonPath();
        entityCount = jsonPath.getList("_embedded.users.id").size();
    }

    @And("Количество страниц пользователей пропорционально {string}")
    public void checkUserPagesCount(String entitiesPerPage) {
        super.checkPagesCount(entitiesPerPage);
    }

    @Then("Поля пользователя совпадают с переданными")
    public void isDataCorrect() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), currentUserDto.getName());
        assertEquals(jsonPath.get("surName"), currentUserDto.getSurName());
        assertEquals(jsonPath.get("email"), currentUserDto.getEmail());

        userPool.put(currentUserId, currentUserDto);
    }

    @And("На всех страницах пользователей {string} есть {string}")
    public void isUsersOnPages(String checkType, String entitiesPerPage) {
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
        currentUserDto = new UserCreateDto(replaceString(user.get(0)), replaceString(user.get(1)),
                                           replaceString(user.get(2)), replaceString(user.get(3)));

        String payload = new Gson().toJson(currentUserDto);

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
                        body(new Gson().toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("");

        return response;
    }
}
