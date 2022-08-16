package ru.mycrg.acceptance.auth_service;

import io.cucumber.core.exception.CucumberException;
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
import ru.mycrg.auth_service_contract.dto.UserInfoModel;

import java.util.List;
import java.util.Map;

import static java.lang.String.format;
import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_ACCEPTED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.*;

public class UserStepsDefinitions extends BaseStepsDefinitions {

    private static final int RETRY_DELAY = 1000;
    private static final int MAX_RETRY_ATTEMPT = 10;

    public static Integer userId;
    public static UserCreateDto userDto;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

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

    @Then("Пользователю присвоена роль = {string}")
    public void checkUserRole(String role) {
        getExactUser();

        jsonPath = response.jsonPath();

        assertEquals(jsonPath.getList("authorities.authority").get(0), role);
    }

    @When("Администратор создает пользователя")
    public void adminCreateUserWithoutCheck(DataTable dataTable) {
        authorizationBase.loginAsOwner();

        userDto = mapToDto(dataTable.asList());

        super.createEntity(userDto);
    }

    @When("Администратор создает некого пользователя {string} {string} {string} {string} {string} {string} {string} {string}")
    public void adminCreateSomeUser(String nameKey, String surnameKey, String emailKey, String passwordKey,
                                    String middleNameKey, String jobKey, String phoneKey, String departmentKey) {
        authorizationBase.loginAsOwner();

        userDto = new UserCreateDto(generateString(nameKey),
                                    generateString(middleNameKey),
                                    generateString(surnameKey),
                                    generateString(jobKey),
                                    generateString(phoneKey),
                                    generateString(emailKey),
                                    generateString(passwordKey),
                                    generateString(departmentKey)
        );

        super.createEntity(userDto);
    }

    @When("Администратор повторно создает пользователя")
    public void createAgainUser() {
        super.createEntity(userDto);
    }

    @Given("Существует пользователь")
    public void initializeUser(DataTable dataTable) throws InterruptedException {
        userDto = mapToDto(dataTable.asList());

        createUser(userDto);
    }

    @Then("На геосервере удалилась роль, связанная с пользователем")
    public void checkRoleDeletionFromGeoserver() throws InterruptedException {
        sleep(800);

        authorizationBase.loginAsOwner();

        sleep(800);

        response = getBaseRequestWithCurrentCookie()
                .basePath("geoserver/rest/security")
                .when().
                        get(String.format("/roles/user/%s.json", userDto.getEmail()));

        List<Object> roles = response.jsonPath().getList("roles");

        assertTrue(roles.isEmpty());
    }

    @Given("Существует некий пользователь")
    public void initializeSomeUser() throws InterruptedException {
        createRandomUserAndLogin();
    }

    @Given("Существует первый пользователь")
    public void initializeFirstUser() throws InterruptedException {
        createRandomUserAndLogin();
    }

    @Given("Существует второй пользователь")
    public void initializeSecondUser() throws InterruptedException {
        createRandomUserAndLogin();
    }

    @When("Администратор организации удаляет пользователя")
    public void deleteUser() {
        authorizationBase.loginAsOwner();

        super.deleteCurrentEntity();

        userPool.remove(userId);
    }

    @And("в заголовке Location передает ID созданного пользователя")
    public void extractUserIdFromLocation() {
        userId = extractId(response.getHeader("Location"));

        userPool.put(userId, userDto);
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на всех пользователей")
    public void getAllUsersSorted(String sortingType, String sortingDirection) {
        super.getAllEntitiesSorted(sortingType, sortingDirection);
    }

    @When("Администратор делает запрос на созданного пользователя")
    public void getExactUser() {
        super.getCurrentEntity();
    }

    @When("Отправляется запрос на выборку всех пользователей")
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
            userDto = mapToDto(user);

            super.createEntity(userDto);
        }
    }

    @When("Администратор делает постраничный запрос на пользователей {string}")
    public void getUsersCount(String entity) {
        getAllAndFillEntityCount(entity);
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

    @When("Пользователь делает запрос на обновление пользователя")
    public void patchUser(DataTable datatable) {
        setUserDtoFields(datatable);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(userDto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        patch(String.valueOf(userId));
    }

    @Then("Поля пользователя обновлены")
    public void checkUserUpdatedFields(DataTable datatable) {
        List<String> data = datatable.asList();

        jsonPath = response.jsonPath();

        assertThat(jsonPath.get("name"), equalTo(data.get(0)));
        assertThat(jsonPath.get("surname"), equalTo(data.get(1)));
    }

    @When("Пользователь делает запрос на самого себя")
    public void getUsersCurrent() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/current");
    }

    @When("Пользователь делает запрос на обновление чужого пользователя")
    public void patchForeignUser(DataTable datatable) {
        takeForeignUserAsCurrent();

        setUserDtoFields(datatable);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(userDto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        patch(String.valueOf(userId));
    }

    @When("Администратор делает запрос на изменение статуса пользователя на {string}")
    public void performsDisableEnableUsers(String isEnabled) {
        getBaseRequestWithCurrentCookie()
                .given().
                        body(format("{\"enabled\":\"%s\"}", isEnabled)).
                        contentType(ContentType.JSON)
                .when().
                        patch(String.valueOf(userId))
                .then().
                        statusCode(SC_OK).
                        log().ifValidationFails();
    }

    @Then("Статус пользователя равен {string}")
    public void checkUserStatus(String userStatus) {
        getExactUser();

        assertThat(response.jsonPath().get("enabled"), is(Boolean.parseBoolean(userStatus)));
    }

    private void takeForeignUserAsCurrent() {
        Map.Entry<Integer, UserCreateDto> entry;
        entry = userPool.entrySet().stream()
                        .filter((user) -> !user.getValue().getEmail().equals(userDto.getEmail()))
                        .findFirst()
                        .orElseThrow(() -> new CucumberException("Haven't found any foreign user"));

        userId = entry.getKey();
        userDto = entry.getValue();
    }

    private void setUserDtoFields(DataTable datatable) {
        List<String> data = datatable.asList();

        userDto.setName(generateString(data.get(0)));
        userDto.setSurname(generateString(data.get(1)));
        userDto.setPassword(generateString(data.get(2)));
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

    private void waitUntilUserSuccessfullyCreated(Integer id) throws InterruptedException {
        System.out.println("check status user: " + id);

        int currentAttempt = 1;
        do {
            System.out.println("attempt check user: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/" + id);

            boolean isEnabled = response.jsonPath().get("enabled");

            if (response.statusCode() == SC_OK && isEnabled) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt <= MAX_RETRY_ATTEMPT);

        throw new RuntimeException("User not created: " + id);
    }

    private void createUser(UserCreateDto dto) throws InterruptedException {
        if (isUserExistInPool(dto.getEmail())) {
            makeExactUserAsCurrent(dto.getEmail());
        } else {
            super.createEntity(dto);
            assertEquals(SC_ACCEPTED, response.getStatusCode());
            extractUserIdFromLocation();

            waitUntilUserSuccessfullyCreated(userId);
        }
    }

    private UserCreateDto mapToDto(List<String> data) {
        if (data.size() > 6 &&
                data.get(4) != null && data.get(5) != null && data.get(6) != null && data.get(7) != null) {
            return new UserCreateDto(generateString(data.get(0)), generateString(data.get(1)),
                                     generateString(data.get(2)), generateString(data.get(3)),
                                     generateString(data.get(4)), generateString(data.get(5)),
                                     generateString(data.get(6)), generateString(data.get(7)));
        } else if (data.size() > 4 && data.get(4) != null && data.get(5) != null && data.get(6) != null) {
            return new UserCreateDto(generateString(data.get(0)), generateString(data.get(1)),
                                     generateString(data.get(2)), generateString(data.get(3)),
                                     generateString(data.get(4)), generateString(data.get(5)),
                                     generateString(data.get(6)));
        } else if (data.get(0) != null && data.get(1) != null && data.get(2) != null && data.get(3) != null) {
            return new UserCreateDto(generateString(data.get(0)), generateString(data.get(1)),
                                     generateString(data.get(2)), generateString(data.get(3)));
        } else {
            throw new IllegalStateException("Passed wrong data for user model");
        }
    }

    private void createRandomUserAndLogin() throws InterruptedException {
        authorizationBase.loginAsOwner();

        userDto = new UserCreateDto(generateString("STRING_10"),
                                    generateString("STRING_10"),
                                    generateString("EMAIL_10"),
                                    "testtestQ1");

        createUser(userDto);

        authorizationBase.loginAsCurrentUser();
    }
}
