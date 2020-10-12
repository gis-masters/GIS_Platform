package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.response.Response;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_ACCEPTED;
import static org.junit.Assert.*;

public class UserStepsDefinitions extends BaseStepsDefinitions {
    public static Integer currentUserId;
    public static UserCreateDto currentUserDto;
    public static int usersCount;

    public static int MAX_RETRY_ATTEMPT = 10;
    public static int RETRY_DELAY = 1000;

    @Before
    public void setup() {
        super.setup();
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
                        post("/users");
    }

    @Then("Пользователю присвоена роль = {string}")
    public void isUserRoleIsUser(String role) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/users/" + currentUserId);

        jsonPath = response.jsonPath();

        assertEquals(jsonPath.getList("authorities.authority").get(0), role);
    }

    @Given("Существует пользователь")
    public void checkUser(DataTable dataTable) throws InterruptedException {
        String eMail = replaceString(dataTable.asList().get(2));

        if (!isUserExistInPool(eMail)) {
            UserCreateDto dto = mapToUserDto(dataTable);
            Response createResponse = createUser(dto);

            assertEquals(SC_ACCEPTED, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractUserId(createResponse);

            waitUntilUserSuccessfullyCreated(id, cookie);

            currentUserId = id;
            currentUserDto = dto;
            userPool.put(id, dto);
        }
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
                        post("/users");

        return response;
    }

    private void waitUntilUserSuccessfullyCreated(Integer id, Cookie cookie) throws InterruptedException {
        System.out.println("check status user: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/users/" + id);

            if (response.statusCode() == 200) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("User was not created: " + id);
    }


    @When("Администратор организации удаляет пользователя")
    public void deleteUser() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/users/" + currentUserId);

        userPool.remove(currentUserId);
    }

    @And("в заголовке Location передает ID созданного пользователя")
    public Integer extractLocation() {
        String header = response.getHeader("Location");
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(header);

        while (matcher.find()) {
            currentUserId = Integer.parseInt(matcher.group());
        }

        assertNotNull(currentUserId);
        return currentUserId;
    }

    private Integer extractUserId(Response response) {
        String header = response.getHeader("Location");
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(header);

        Integer id = null;
        while (matcher.find()) {
            id = Integer.parseInt(matcher.group());
        }

        assertNotNull(id);

        return id;
    }


    @When("Администратор делает запрос с сортировкой по {string} и {string} на всех пользователей")
    public void getAllUsersSorted(String sortingType, String sortingDirection) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/users?sort=" + sortingType + "," + sortingDirection);
    }

    @And("В ответе есть пункт users")
    public void isUsers() {
        jsonPath = response.jsonPath();
        List<String> users = jsonPath.get("_embedded.users.email");

        assertTrue(users.size() >= 2);
    }

    @Then("Данные отсортированы по {string} и {string}")
    public void isUsersSorted(String sortingType, String sortingDirection) {
        List<String> sorted = jsonPath.getList("_embedded.users." + sortingType);
        for (int i = 1; i < sorted.size(); i++) {
            if (sortingDirection.equals("asc")) {
                assertTrue(sorted.get(i - 1).compareTo(sorted.get(i)) < 1);
            } else if (sortingDirection.equals("desc")) {
                assertTrue(sorted.get(i - 1).compareTo(sorted.get(i)) > -1);
            }
        }
    }

    @When("Администратор делает запрос на указанного пользователя")
    public void getExactUser() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/users/" + currentUserId);
    }

    @When("Администратор делает запрос на всех пользователей")
    public void getAllUsers() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/users");
    }


    @When("Администратор делает постраничный запрос на всех пользователей")
    public void getAllUsersPaginated() {
        getAllUsers();
        jsonPath = response.jsonPath();
        usersCount = jsonPath.getList("_embedded.users.id").size();
    }

    @And("Количество страниц пропорционально {string}")
    public void checkPagesCount(String usersPerPage) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/users?size=" + usersPerPage);
        jsonPath = response.jsonPath();

        double usersPerPageDouble = Integer.parseInt(usersPerPage);
        int estimatedPages = (int) Math.ceil(usersCount / usersPerPageDouble);
        totalPages = jsonPath.get("page.totalPages");

        assertEquals(totalPages, estimatedPages);
    }

    @Then("Поля пользователя совпадают с переданными {string}, {string}, {string}")
    public void isDataCorrect(String userName, String userSurname, String userEmail) {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), replaceString(userName));
        assertEquals(jsonPath.get("surName"), replaceString(userSurname));
        assertEquals(jsonPath.get("email"), replaceString(userEmail));

        userPool.put(currentUserId, currentUserDto);
    }

    @And("На всех страницах есть пользователи {string}")
    public void isUsersOnPages(String usersPerPage) {
        for (int i = 0; i < totalPages; i++) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            get(String.format("/users?size=%s&page=%s", usersPerPage, i));

            jsonPath = response.jsonPath();
            List<String> usersEmails = response.jsonPath().getList("_embedded.users.email");

            assertNotEquals(0, usersEmails.size());
        }
    }
}
