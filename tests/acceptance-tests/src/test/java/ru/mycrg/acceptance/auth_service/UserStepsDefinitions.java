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
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.auth_service_contract.dto.UserUpdateDto;

import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static java.lang.String.format;
import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_ACCEPTED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.DEFAULT_TEST_PASSWORD;

public class UserStepsDefinitions extends BaseStepsDefinitions {

    private static final int RETRY_DELAY = 3000;
    private static final int MAX_RETRY_ATTEMPT = 40;

    public static Integer userId;
    public static Integer anotherUserId;
    public static String geoserverLogin;
    public static UserCreateDto userDto;
    public static UserCreateDto anotherUserDto;
    public static List<Long> usersId = new ArrayList<>();
    public static Map<String, Object> filterResults = new HashMap<>();

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

        userDto = mapToDto(dataTable.asLists(String.class).get(0));

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
        userDto = mapToDto(dataTable.asLists(String.class).get(0));

        createRandomUser(userDto);
    }

    @Given("Существует другой пользователь")
    public void initAnotherUser(DataTable dataTable) throws InterruptedException {
        anotherUserDto = mapToDto(dataTable.asLists(String.class).get(0));

        createAnotherUser(anotherUserDto);
    }

    @Given("Существует пользователь у которого email содержит спецсимволы")
    public void initializeUserWithSpecialSymbols() throws InterruptedException {
        String email = format("test.email%s@test", generateString("STRING_5"));

        UserCreateDto userDto = new UserCreateDto();
        userDto.setName("testEmail");
        userDto.setSurname("testEmail");
        userDto.setEmail(email);
        userDto.setPassword(DEFAULT_TEST_PASSWORD);

        createRandomUser(userDto);
    }

    @Then("На геосервере удалилась роль, связанная с пользователем")
    public void checkRoleDeletionFromGeoserver() throws InterruptedException {
        sleep(800);

        authorizationBase.loginAsOwner();

        sleep(800);

        getRolesFromGeoserverByUser(userDto.getEmail());

        List<Object> roles = response.jsonPath().getList("roles");

        assertTrue(roles.isEmpty());
    }

    @Then("Роль пользователя существует на геосервере")
    public void checkUserOnGeoserverByGeoserverLogin() {
        geoserverLogin = response.jsonPath().get("geoserverLogin");
        assertNotNull(geoserverLogin);

        getRolesFromGeoserverByUser(geoserverLogin);

        List<Object> roles = response.jsonPath().getList("roles");

        assertFalse(roles.isEmpty());
    }

    @Given("Существует некий пользователь")
    public void initializeSomeUser() throws InterruptedException {
        authorizationBase.loginAsOwner();

        createRandomUser();
    }

    @Given("Существует {int} пользователей")
    public void createUsers(Integer quantityOfUsers) throws InterruptedException {
        authorizationBase.loginAsOwner();

        CountDownLatch counter = new CountDownLatch(30);
        int availableProcessors = Runtime.getRuntime().availableProcessors();

        System.out.println("availableProcessors: " + availableProcessors);

        ExecutorService executorService = Executors.newFixedThreadPool(availableProcessors);
        for (int i = 0; i < 30; i++) {
            int finalI = i;
            executorService.submit(() -> {
                try {
                    createUserWithEmail(generateString("EMAIL_8") + "_" + (finalI + 1));
                } catch (Exception e) {
                    throw new RuntimeException(e);
                } finally {
                    counter.countDown();
                }
            });
        }
        counter.await();

        System.out.println("Начали создавать " + quantityOfUsers + " пользователей одновременно");

        executorService.shutdown();
    }

    @Given("Существует и авторизован некий пользователь")
    public void initializeSomeUserAndLogin() throws InterruptedException {
        createRandomUserAndLogin();
    }

    @Given("Существует и авторизован первый пользователь")
    public void initializeFirstUser() throws InterruptedException {
        createRandomUserAndLogin();
    }

    @Given("Существует и авторизован второй пользователь")
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
        userId = extractId(response);

        userPool.put(userId, userDto);
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на всех пользователей")
    public void getAllUsersSorted(String sortingType, String sortingDirection) {
        super.get1000EntitiesSorted(sortingType, sortingDirection);
    }

    @When("Администратор делает запрос на созданного пользователя")
    public void getExactUser() {
        super.getCurrentEntity();
    }

    @When("Отправляется запрос на выборку всех пользователей")
    public void getAllUsers() {
        super.get1000Entities();
    }

    @When("Пользователь делает запрос на выборку всех пользователей")
    public void getAllUsersByUser() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @And("Количество страниц пользователей пропорционально {string}")
    public void checkUserPagesCount(String entitiesPerPage) {
        super.checkPagesCount(entitiesPerPage);
    }

    @Then("Поля пользователя совпадают с переданными")
    public void checkUserData() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), userDto.getName());
        assertEquals(jsonPath.get("surname"), userDto.getSurname());
        assertEquals(jsonPath.get("email"), userDto.getEmail());

        userPool.put(userId, userDto);
    }

    @And("На всех страницах пользователей есть {string}")
    public void areUsersOnPages(String entitiesPerPage) {
        super.checkSomethingOnPages(entitiesPerPage);
    }

    @Given("Существуют пользователи")
    public void createMultipleUsers(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> user: data) {
            userDto = mapToDto(user);

            super.createEntity(userDto);
        }
    }

    @Given("Существует иерархия пользователей {string}")
    public void createUsersByTemplate(String template) throws InterruptedException {
        if ("тестирование прав на проекты".equals(template)) {
            createRandomUser(new UserCreateDto("fiz1", "fiz1", "fiz1@fiz", DEFAULT_TEST_PASSWORD));
            createRandomUser(new UserCreateDto("fiz2", "fiz2", "fiz2@fiz", DEFAULT_TEST_PASSWORD));
            createRandomUser(new UserCreateDto("fiz3", "fiz3", "fiz3@fiz", DEFAULT_TEST_PASSWORD));
            createRandomUser(new UserCreateDto("fiz4", "fiz4", "fiz4@fiz", DEFAULT_TEST_PASSWORD));
            createRandomUser(new UserCreateDto("fiz5", "fiz5", "fiz5@fiz", DEFAULT_TEST_PASSWORD));
        } else if ("для тестирования задач РНС по СМЭВ".equals(template)) {
            createRandomUser(new UserCreateDto("rns1", "rns1", "rns1@smev.ru", DEFAULT_TEST_PASSWORD));
            createRandomUser(new UserCreateDto("sed1", "sed1", "sed_user_integration@mycrg.ru", DEFAULT_TEST_PASSWORD));
        } else if ("Иерархия вариант 1".equals(template)) {
            // orgOwner
            //   fiz1
            //   fiz2
            //     fiz3
            //       fiz4
            // fiz5

            System.out.printf("*** *** Разворачиваем иерархическую структуру пользователей, вариант: '%s'", template);

            getCurrent();
            Integer ownerId = response.jsonPath().get("id");
            assertNotNull(ownerId);
            System.out.println(" Id владельца организации: " + ownerId);

            UserCreateDto orgOwner = userPool.get(-1);
            userPool.put(ownerId, orgOwner);
            userPool.remove(-1);

            // Пользователь fiz1, у которого начальником будет владелец организации
            UserCreateDto fiz1 = new UserCreateDto("fiz1", "fiz1", "fiz1", "job", generateString("NUMBER_10"),
                                                   generateString("EMAIL_10"), DEFAULT_TEST_PASSWORD, "dep");
            fiz1.setBossId(ownerId);

            System.out.println("*** *** Create user fiz1");
            userDto = fiz1;
            createRandomUser(fiz1);

            // Пользователь fiz2, у которого начальником будет владелец организации
            UserCreateDto fiz2 = new UserCreateDto("fiz2", "fiz2", "fiz2", "job", generateString("NUMBER_10"),
                                                   generateString("EMAIL_10"), DEFAULT_TEST_PASSWORD, "dep");
            fiz2.setBossId(ownerId);

            System.out.println("*** *** Create user fiz2");
            userDto = fiz2;
            createRandomUser(fiz2);
            Integer fiz2Id = userId;

            // Пользователь fiz3, у которого начальником будет fiz2
            UserCreateDto fiz3 = new UserCreateDto("fiz3", "fiz3", "fiz3", "job", generateString("NUMBER_10"),
                                                   generateString("EMAIL_10"), DEFAULT_TEST_PASSWORD, "dep");
            fiz3.setBossId(fiz2Id);

            System.out.println("*** *** Create user fiz3");
            userDto = fiz3;
            createRandomUser(fiz3);
            Integer fiz3Id = userId;

            // Пользователь fiz4, у которого начальником будет fiz3
            UserCreateDto fiz4 = new UserCreateDto("fiz4", "fiz4", "fiz4", "job", generateString("NUMBER_10"),
                                                   generateString("EMAIL_10"), DEFAULT_TEST_PASSWORD, "dep");
            fiz4.setBossId(fiz3Id);

            System.out.println("*** *** Create user fiz4");
            userDto = fiz4;
            createRandomUser(fiz4);

            // Пользователь fiz5, без начальника
            UserCreateDto fiz5 = new UserCreateDto("fiz5", "fiz5", "fiz5", "job", generateString("NUMBER_10"),
                                                   generateString("EMAIL_10"), DEFAULT_TEST_PASSWORD, "dep");

            System.out.println("*** *** Create user fiz5");
            userDto = fiz5;
            createRandomUser(fiz5);

            System.out.println("============= Print userPool =============");
            userPool.forEach((id, userDto) -> {
                System.out.printf("id: %d. Name: '%s' Email: '%s'%n", id, userDto.getName(), userDto.getEmail());
            });
            System.out.println("==========================================");

            // После изменения иерархии получаем новый актуальный токен
            authorizationBase.loginAsOwner(false);
        } else {
            throw new IllegalStateException(
                    String.format("Unknown template: '%s'. Plz implement it first.", template));
        }
    }

    @When("Администратор делает постраничный запрос на пользователей")
    public void getUsersCount() {
        getAllAndFillEntityCount();
    }

    @When("При выборке пользователей данные не были утеряны")
    public void checkThatUsersDataIsFull() {
        List<Map<String, Object>> users = response.jsonPath().getList("content");
        users.stream()
             .filter(user -> user.get("name").equals("test1") || user.get("name").equals("test2"))
             .forEach(user -> assertTrue(checkUserDataIsFull(user)));
    }

    @When("Текущий пользователь запрашивает пользователей с фильтрацией")
    public void getUsersByFilter(DataTable datatable) {
        List<Map<String, String>> filterCases = datatable.asMaps();
        filterCases.forEach(filterCase -> {
            String aCase = filterCase.get("case");
            String filter = filterCase.get("filter");

            super.getCurrentEntityByFilter(filter);

            Object totalElements = response.jsonPath().get("page.totalElements");

            filterResults.put(aCase, totalElements);
        });
    }

    @Then("Результат фильтрации пользователей соответствует ожидаемому")
    public void checkTotalElements(DataTable datatable) {
        List<Map<String, String>> filterCases = datatable.asMaps();
        filterCases.forEach(filterCase -> {
            String aCase = filterCase.get("case");
            Integer expected = Integer.valueOf(filterCase.get("expected"));

            assertEquals(expected, filterResults.get(aCase));
        });
    }

    @When("Владелец организации делает постраничный запрос на всех пользователей, по {int} пользователей на странице")
    public void getAllUsersByPage(Integer usersPerPage) {
        getAllAndFillEntityCount();
        getAllUsersIdAllPages(usersPerPage);

        assertEquals(entityCount, usersId.size());
    }

    @Then("Дублирование пользователей, при выборке постранично, не происходит")
    public void checkThatUsersNotDuplicated() {
        Set<Long> userIdsSet = new HashSet<>(usersId);
        assertEquals(usersId.size(), userIdsSet.size());
    }

    @When("Владелец организации отправляет приглашение несуществующему пользователю")
    public void inviteNonExistingUser() {
        authorizationBase.loginAsOwner();
        inviteUserByEmail(generateString("EMAIL_8"));
    }

    @When("Владелец организации отправляет приглашение существующему пользователю")
    public void inviteExistingUser() {
        authorizationBase.loginAsOwner();

        inviteUserByEmail(userDto.getEmail());
    }

    @And("Пользователь состоит в данной организации")
    public void userPresentInOrganization() {
        Map<String, Object> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        List<HashMap<String, Object>> users = (List<HashMap<String, Object>>) presentedData.get("users");
        assertFalse(users.isEmpty());

        long countOfUsersWithEmail = users
                .stream()
                .filter(user -> userDto.getEmail().equalsIgnoreCase(String.valueOf(user.get("email"))))
                .count();

        assertEquals(1, countOfUsersWithEmail);
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

    @When("Администратор организации делает запрос на обновление пользователя")
    public void patchUserByAdmin(DataTable datatable) {
        authorizationBase.loginAsOwner();

        setUserDtoFields(datatable);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(userDto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        patch(String.valueOf(userId));
    }

    @When("Администратор организации назначает текущему пользователю в качестве начальника другого пользователя")
    public void assignBossToUser() {
        assignBossForUser(userId, anotherUserId);
    }

    @When("Администратор организации делает запрос на назначение в качестве начальника, пользователя, которого не существует")
    public void assignAsBossNotExistingUser() {
        assignBossForUser(userId, 0);
    }

    @Then("Поля пользователя обновлены")
    public void checkUserUpdatedFields(DataTable dataTable) {
        List<String> data = dataTable.asLists(String.class).get(0);

        jsonPath = response.jsonPath();

        assertThat(jsonPath.get("name"), equalTo(data.get(0)));
        assertThat(jsonPath.get("surname"), equalTo(data.get(1)));
    }

    @Then("Текущему пользователю назначен в качестве начальника другой пользователь")
    public void checkUserUpdatedWithBossId() {
        jsonPath = response.jsonPath();

        assertEquals(anotherUserId, jsonPath.get("bossId"));
    }

    @When("Пользователь делает запрос на самого себя")
    public void getCurrent() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/current");
    }

    @When("Получаем данные владельца организации")
    public void getDataOfOrgAdmin() {
        authorizationBase.loginAsOwner();
        getCurrent();

        geoserverLogin = response.jsonPath().get("geoserverLogin");
        assertNotNull(geoserverLogin);
    }

    @When("Пользователь делает запрос на обновление чужого пользователя")
    public void patchForeignUser(DataTable datatable) {
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

    @And("Тело ответа содержит ошибку о том что такого пользователя не существует")
    public void checkErrorMessage() {
        String error = response.jsonPath().get("message");

        assertNotNull(error);
        assertTrue(error.contains("Пользователь не найден(а) по идентификатору:"));
    }

    private boolean checkUserDataIsFull(Map<String, Object> userData) {
        if (Objects.isNull(userData.get("email"))) {
            return false;
        }

        if (Objects.isNull(userData.get("name"))) {
            return false;
        }

        if (Objects.isNull(userData.get("surname"))) {
            return false;
        }

        if (Objects.isNull(userData.get("phone"))) {
            return false;
        }

        if (Objects.isNull(userData.get("login"))) {
            return false;
        }

        if (Objects.isNull(userData.get("middleName"))) {
            return false;
        }

        if (Objects.isNull(userData.get("department"))) {
            return false;
        }

        if (Objects.isNull(userData.get("geoserverLogin"))) {
            return false;
        }

        if (Objects.isNull(userData.get("geoserverLogin"))) {
            return false;
        }

        return true;
    }

    private void getAllUsersIdAllPages(Integer entitiesPerPage) {
        totalPages = entityCount / entitiesPerPage;

        for (int i = 0; i <= totalPages; i++) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            get(String.format("/?size=%s&page=%s", entitiesPerPage, i));

            jsonPath = response.jsonPath();
            List<Long> userIds = jsonPath.getList("content.id");
            usersId.addAll(userIds);
        }
    }

    private void assignBossForUser(Integer userId, Integer bossId) {
        authorizationBase.loginAsOwner();

        UserUpdateDto userUpdate = new UserUpdateDto();
        userUpdate.setBossId(bossId);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(userUpdate)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        patch(String.valueOf(userId));
    }

    private void setUserDtoFields(DataTable dataTable) {
        List<String> data = dataTable.asLists(String.class).get(0);

        userDto.setName(generateString(data.get(0)));
        userDto.setSurname(generateString(data.get(1)));
        userDto.setPassword(generateString(data.get(2)));
    }

    private boolean isUserExistInPool(String eMail) {
        System.out.println("Try found user in pool by email: " + eMail);

        return userPool.values().stream()
                       .filter(Objects::nonNull)
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
        System.out.println("Wait for user: " + id + " created");

        int currentAttempt = 0;
        do {
            currentAttempt++;
            sleep(RETRY_DELAY);
            System.out.println("check user: " + id + " attempt: " + currentAttempt);

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/" + id);

            if (response.statusCode() == SC_OK) {
                if (response.jsonPath().getBoolean("enabled")) {
                    System.out.println("check user: " + id + " attempt: " + currentAttempt + " - ready!");

                    return;
                }

                System.out.println(" - NOT ready yet!");
            } else {
                System.out.println("check status for user: " + id + " failed. Reason: " + response.statusCode());
            }
        } while (currentAttempt <= MAX_RETRY_ATTEMPT);

        throw new RuntimeException("User not created: " + id);
    }

    private void createRandomUser(UserCreateDto dto) throws InterruptedException {
        if (isUserExistInPool(dto.getEmail())) {
            makeExactUserAsCurrent(dto.getEmail());
        } else {
            userDto = dto;

            super.createEntity(dto);
            assertEquals(SC_ACCEPTED, response.getStatusCode());
            extractUserIdFromLocation();

            waitUntilUserSuccessfullyCreated(userId);
        }
    }

    private void createAnotherUser(UserCreateDto dto) throws InterruptedException {
        if (isUserExistInPool(dto.getEmail())) {
            makeExactUserAsCurrent(dto.getEmail());
        } else {
            super.createEntity(dto);
            assertEquals(SC_ACCEPTED, response.getStatusCode());
            anotherUserId = extractId(response);

            waitUntilUserSuccessfullyCreated(anotherUserId);
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

    private void createRandomUser() throws InterruptedException {
        userDto = new UserCreateDto(generateString("STRING_10"),
                                    generateString("STRING_10"),
                                    generateString("EMAIL_10"),
                                    DEFAULT_TEST_PASSWORD);

        createRandomUser(userDto);
    }

    private void createUserWithEmail(String email) throws InterruptedException {
        userDto = new UserCreateDto(generateString("STRING_10"),
                                    generateString("STRING_10"),
                                    email,
                                    DEFAULT_TEST_PASSWORD);

        createRandomUser(userDto);
    }

    private void createRandomUserAndLogin() throws InterruptedException {
        authorizationBase.loginAsOwner();

        createRandomUser();

        authorizationBase.loginAsCurrentUser();
    }

    private void getRolesFromGeoserverByUser(String login) {
        response = getBaseRequestWithCurrentCookie()
                       .basePath("geoserver/rest/security")
                .when().
                       get(format("/roles/user/%s.json", login));
    }

    private void inviteUserByEmail(String email) {
        Map<String, String> queryParams = new HashMap<String, String>() {{
            put("email", email);
        }};

        response = getBaseRequestWithCurrentCookie()
                .formParams(queryParams)
                .when().
                       post("/invite");
    }
}
