package ru.mycrg.acceptance.auth_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;

import java.util.List;

import static org.apache.http.HttpStatus.SC_ACCEPTED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.*;

public class UserStepsDefinitions extends BaseStepsDefinitions {

    public static Integer userId;
    public static UserCreateDto userDto;

    @Override
    public Integer getCurrentId() {
        return userId;
    }

    @Override
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

        userDto = new UserCreateDto(generateString(data.get(0)), generateString(data.get(1)),
                                    generateString(data.get(2)), generateString(data.get(3)));

        super.createEntity(userDto);
    }

    @When("Администратор повторно создает пользователя")
    public void createAgainUser() {
        super.createEntity(userDto);
    }

    @Then("Пользователю присвоена роль = {string}")
    public void checkUserRole(String role) {
        getExactUser();

        jsonPath = response.jsonPath();

        assertEquals(jsonPath.getList("authorities.authority").get(0), role);
    }

    @Given("Существует пользователь")
    public void initializeUser(DataTable dataTable) {
        String eMail = generateString(dataTable.asList().get(2));

        if (isUserExistInPool(eMail)) {
            makeExactUserAsCurrent(eMail);
        } else {
            createUser(dataTable);
            assertEquals(SC_ACCEPTED, response.getStatusCode());
            extractUserIdFromLocation();
        }
    }

    @When("Администратор организации удаляет пользователя")
    public void deleteUser() {
        super.deleteEntity(userId);

        userPool.remove(userId);
    }

    @And("в заголовке Location передает ID созданного пользователя")
    public void extractUserIdFromLocation() {
        userId = extractIdFromLocation();

        userPool.put(userId, userDto);
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на всех пользователей")
    public void getAllUsersSorted(String sortingType, String sortingDirection) {
        super.getAllEntitiesSorted(sortingType, sortingDirection);
    }

    @When("Администратор делает запрос на созданного пользователя")
    public void getExactUser() {
        super.getCurrentEntityInfoById();
    }

    @When("Администратор делает запрос на всех пользователей")
    public void getAllUsers() {
        super.getAllEntities();
    }

    @And("Количество страниц пользователей {string} пропорционально {string}")
    public void checkUserPagesCount(String checkType, String entitiesPerPage) {
        super.checkPagesCount(checkType, entitiesPerPage);
    }

    @Then("Поля пользователя совпадают с переданными")
    public void checkUserData() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), userDto.getName());
        assertEquals(jsonPath.get("surname"), userDto.getSurname());
        assertEquals(jsonPath.get("email"), userDto.getEmail());

        userPool.put(userId, userDto);
    }

    @And("На всех страницах пользователей {string} есть {string}")
    public void areUsersOnPages(String checkType, String entitiesPerPage) {
        super.checkSomethingOnPages(checkType, entitiesPerPage);
    }

    @Given("Существуют пользователи")
    public void createMultipleUsers(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> user: data) {
            createUser(user);
        }
    }

    @When("Администратор делает постраничный запрос на пользователей {string}")
    public void getUsersCount(String entity) {
        getEntityCount(entity);
    }

    private void createUser(List<String> user) {
        userDto = new UserCreateDto(generateString(user.get(0)), generateString(user.get(1)),
                                    generateString(user.get(2)), generateString(user.get(3)));

        super.createEntity(userDto);
    }

    @When("Эндпоинт на выборку инфы текущего пользователя доступен и тело имеет корректное представление")
    public void checkCurrentUserEndpointAndResponseBody() {
        final UserInfoModel userInfoModel = getBaseRequestWithCurrentCookie()
                .when().
                        get("/current")
                .then().
                        log().ifValidationFails().
                        assertThat().
                        statusCode(SC_OK).
                        extract().
                        as(UserInfoModel.class);

        assertNotNull(userInfoModel);
        assertEquals(userDto.getEmail(), userInfoModel.getEmail());
        assertEquals(userDto.getSurname(), userInfoModel.getSurname());
        assertNotNull(userInfoModel.getId());
        assertNotNull(userInfoModel.getAuthorities());
        assertNotNull(userInfoModel.getOrgId());
        assertNotNull(userInfoModel.getOrgName());
    }

    private boolean isUserExistInPool(String eMail) {
        return userPool
                .values().stream()
                .anyMatch(dto -> eMail.equals(dto.getEmail()));
    }

    private void makeExactUserAsCurrent(String email) {
        userPool.entrySet().stream()
                .filter(entry -> entry.getValue().getEmail().equals(email))
                .findFirst()
                .ifPresent(entry -> {
                    userId = entry.getKey();
                    userDto = entry.getValue();
                });
    }
}
